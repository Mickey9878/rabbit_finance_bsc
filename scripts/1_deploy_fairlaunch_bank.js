const {ethers, upgrades} = require("hardhat");
const cnf = require('./cnf/cnf');
const cnfBank = require('./cnf/cnf_bank');
const utils = require('./utils');

async function main() {
    // ---------------------------------------- Rabbit -------------------------------------
    const Rabbit = await ethers.getContractFactory("contracts/token/RabbitToken.sol:Rabbit");
    const rabbit = await Rabbit.deploy();
    utils.SaveBankContract("Rabbit: "+rabbit.address.toString() + "\n");
    console.log("Rabbit: ", rabbit.address);

    // ---------------------------------------- FairLaunch ---------------------------------
    const FairLaunch = await ethers.getContractFactory("contracts/rewards/FairLaunch.sol:FairLaunch");
    const fairLaunch = await upgrades.deployProxy(FairLaunch,[
        rabbit.address,
        cnf.FairLaunchDevAddr,
        0,
        cnf.FairLaunchStartBlock,
        cnf.FairLaunchBonusEndBlock
    ], { initializer: 'initialize', unsafeAllow: ['delegatecall']});
    utils.SaveBankContract("FairLaunch: "+fairLaunch.address.toString() + "\n");
    console.log("fairLaunch: ", fairLaunch.address);

    await rabbit.transferOperator(fairLaunch.address);
    await rabbit.transferOwnership(cnf.ContractOwner);
    console.log("transfer rabbit Operator OK");

    // ---------------------------------------- Bank ---------------------------------
    const TripleSlopeModel = await ethers.getContractFactory("contracts/bank_config/InterestModelv2.sol:TripleSlopeModel");
    const tripleSlopeModel = await TripleSlopeModel.deploy();
    utils.SaveBankContract("TripleSlopeModel: "+tripleSlopeModel.address.toString() + "\n");
    console.log("tripleSlopeModel: ", tripleSlopeModel.address);

    const GoblinPriceOracle = await ethers.getContractFactory("contracts/bank_config/GoblinPriceOracle.sol:GoblinPriceOracle");
    const goblinPriceOracle = await GoblinPriceOracle.deploy();
    await goblinPriceOracle.transferOwnership(cnf.BankOracleOwner)
    utils.SaveBankContract("GoblinPriceOracle: "+goblinPriceOracle.address.toString() + "\n");
    console.log("goblinPriceOracle: ", goblinPriceOracle.address);

    const BankConfig = await ethers.getContractFactory("contracts/bank_config/Conf.sol:BankConfig");
    const bankConfig = await BankConfig.deploy();
    utils.SaveBankContract("BankConfig: "+bankConfig.address.toString() + "\n");
    console.log("bankConfig: ", bankConfig.address);

    await bankConfig.setParams(cnf.BankConfGetReserveBps, cnf.BankConfGetLiquidateBps, tripleSlopeModel.address);
    await bankConfig.setOracle(goblinPriceOracle.address);
    console.log("bank conf set params ok");
    //
    const Bank = await ethers.getContractFactory("contracts/Bank.sol:Bank");
    const bank = await upgrades.deployProxy(Bank,[
        bankConfig.address
    ], { initializer: 'initialize', unsafeAllow: ['delegatecall']});
    utils.SaveBankContract("Bank: "+bank.address.toString() + "\n");
    console.log("bank: ", bank.address);

    // ---------------------------------------- Bank AddBank ---------------------------------
    for (let [_, item] of Object.entries(cnfBank.BankToken)) {
        await bank.addBank(item.Addr, item.Name);
        console.log("add bank ok: " + item.Name);
    }

    utils.SaveBankContract("----------------------------- IbToken ---------------------------------------" + "\n");

    await utils.Wait(20000);

    // ---------------------------------------- FairLaunch Add ibToken ---------------------------------
    for (let [_, item] of Object.entries(cnfBank.BankToken)) {
        const {ibTokenAddr} = await bank.banks(item.Addr);
        utils.SaveBankContract(item.Name + ": " + ibTokenAddr.toString() + "\n");
        console.log(item.Name + " : " + ibTokenAddr);

        await fairLaunch.addPool(item.Point, ibTokenAddr, false);
        console.log("add fairLaunch Pool ok: " + item.Name);

        await utils.Wait(10000);

        const [isDuplicatedPool,Pid] = await fairLaunch.getPoolPid(ibTokenAddr)
        if (isDuplicatedPool){
            utils.SaveBankContract(item.Name + " FairLaunch Pid: " + Pid + "\n\n");
            console.log(item.Name + " FairLaunch Pid: " + Pid);
        }else{
            console.log(item.Name + " FairLaunch Add IbToken Error");
        }
    }

    await utils.Wait(2000);
}


main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });