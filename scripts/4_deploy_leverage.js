const {ethers, upgrades} = require("hardhat");
const cnf = require('./cnf/cnf')
const cnfLeverage = require('./cnf/cnf_leverage')
const utils = require('./utils')

async function main() {

    const FairLaunch = await ethers.getContractFactory("contracts/rewards/FairLaunch.sol:FairLaunch");
    const fairLaunch = await FairLaunch.attach(cnf.FarmFairLaunchAddr);

    const Bank = await ethers.getContractFactory("contracts/Bank.sol:Bank");
    const bank = await Bank.attach(cnf.Bank);

    const BankConfig = await ethers.getContractFactory("contracts/bank_config/Conf.sol:BankConfig");
    const bankConfig = await BankConfig.attach(cnf.BankConf);

    for (let [_, item] of Object.entries(cnfLeverage.LeverageBiswap)) {
        utils.SaveLeverageContract("--------------------------------------- Leverage "+item.Name+" ------------------------------------------"+"\n");
        console.log("--------------------------------------- Leverage "+item.Name+" ------------------------------------------");
        // ---------------------------------------- Debt Token ---------------------------------------------
        const DebtToken = await ethers.getContractFactory("contracts/DebtToken.sol:DebtToken");
        const debtToken = await upgrades.deployProxy(DebtToken,[
            item.DebtTokenName,
            item.DebtTokenSymbol
        ], { initializer: 'initialize', unsafeAllow: ['delegatecall']});

        utils.SaveLeverageContract(item.Name + " debtToken: " + debtToken.address.toString() + "\n");
        console.log(item.Name + " debtToken: ", debtToken.address);

        // ---------------------------------------- Goblin -------------------------------------------------
        let GoblinAddr = '';
        let AddTwoStrategyAddr = ''
        if (item.FarmType === "BiswapLeverage"){

            const BiGoblin = await ethers.getContractFactory("contracts/worker/leverage/LeverageBiswapGoblin.sol:LeverageGoblin");
            const biGoblin = await upgrades.deployProxy(BiGoblin,[
                cnf.FarmOperator,
                cnf.BiSwapRouter02,
                cnf.LeverageBiswapLiq,
                cnf.LeverageDevAddr,
                cnf.FarmFairLaunchAddr,
                item.Token0,
                item.Token1,
                item.SwapPath,
                cnf.LeverageVault,
            ], { initializer: 'initialize', unsafeAllow: ['delegatecall']});
            utils.SaveLeverageContract(item.Name + " Biswap Leverage Goblin: " + biGoblin.address.toString() + "\n");
            console.log(item.Name + " Biswap Leverage Goblin: " , biGoblin.address);

            // ---------------------------------------- Goblin Deploy AddTwoStrategy ------------------------------------
            const AddTwoStrategy = await ethers.getContractFactory("contracts/worker/leverage/LeverageStrategyAdd.sol:LeverageStrategyAddTwoSidesOptimal");
            const addTwoStrategy = await AddTwoStrategy.deploy(cnf.BiSwapRouter02, biGoblin.address);
            await addTwoStrategy.transferOwnership(cnf.ContractOwner);

            AddTwoStrategyAddr = addTwoStrategy.address;
            GoblinAddr = biGoblin.address;
            utils.SaveLeverageContract(item.Name + " LeverageLiqStrat: " + cnf.LeverageBiswapLiq + "\n");
            console.log(item.Name + " LeverageLiqStrat: " + cnf.LeverageBiswapLiq);
        }
        utils.SaveLeverageContract(item.Name + " AddTwoStrategyAddr: " + AddTwoStrategyAddr.toString() + "\n");
        console.log(item.Name + " AddTwoStrategyAddr: ", AddTwoStrategyAddr);

        // ---------------------------------------- Debt Token Transfer Owner ------------------------------
        await debtToken.transferOwnership(GoblinAddr);
        console.log("debtToken transferOwnership ok");

        // ---------------------------------------- Goblin Update DebtToken And Pid And Approve ------------------------
        const Goblin = await ethers.getContractFactory("contracts/worker/leverage/LeverageBiswapGoblin.sol:LeverageGoblin");
        const goblin = await Goblin.attach(GoblinAddr);
        await goblin.setStrategyOk([AddTwoStrategyAddr], true);
        console.log("goblin setStrategyOk ok");

        // ---------------------------------------- FairLaunch Add Debt Token ------------------------------
        const debtTokenPid =  await fairLaunch.poolLength();

        utils.SaveLeverageContract("------------------ FairLaunch DebtToken Pid --------------------" + "\n");
        await fairLaunch.addPool(item.FairLaunchPoint, debtToken.address, false);
        console.log("fairLaunch addPool ok");

        await goblin.updateDebtToken(debtToken.address, debtTokenPid);
        utils.SaveLeverageContract(item.DebtTokenName + " FairLaunch Pid: " + debtTokenPid + "\n");
        console.log(item.DebtTokenName + " FairLaunch Pid: ", debtTokenPid.toNumber());

        await goblin.setPendingGovernor(cnf.ContractOwner);
        console.log("goblin setPendingGovernor ok");

        // await utils.Wait(10000);
        //
        // const [isDuplicatedPool,Pid] = await fairLaunch.getPoolPid(debtToken.address)
        // if (isDuplicatedPool){
        //     await goblin.updateDebtToken(debtToken.address, Pid);
        //     utils.SaveLeverageContract(item.DebtTokenName + " FairLaunch Pid: " + Pid + "\n");
        //     console.log(item.DebtTokenName + " FairLaunch Pid: ", Pid.toNumber());
        //     console.log("goblin updateDebtToken ok");
        // }else{
        //     utils.SaveLeverageContract(item.DebtTokenName + " FairLaunch Pid: " + 0 + "\n");
        //     console.log(item.Name + " FairLaunch Add DebtToken Error");
        // }

        // ---------------------------------------- BankConf setConfigs -------------------------------------
        await bankConfig.setConfigs([goblin.address], [item.MaxPriceDiff]);
        console.log("BankConfig Set Goblin MaxPriceDiff OK");

        // ---------------------------------------- Bank Creat Production ----------------------------------
        utils.SaveLeverageContract("------------------ Bank Borrow Pid --------------------" + "\n");
        if (item.BorrowName0 !== ""){
            const currentPid = await bank.currentPid();
            await bank.createProduction(
                0,
                true,
                true,
                item.CoinToken,
                item.CurrencyToken,
                item.BorrowToken0,
                GoblinAddr,
                ethers.utils.parseEther(item.BorrowMinDebt0),
                ethers.utils.parseEther(item.BorrowMaxDebt0),
                item.OpenFactor,
                item.LiquidateFactor
            );
            utils.SaveLeverageContract(item.Name + " BorrowToken0: "+item.BorrowName0+ ", Pid:" + currentPid + "\n");
            console.log(item.Name + " BorrowToken0: "+item.BorrowName0+ ", Pid:" + currentPid)
        }

        if (item.BorrowName1 !== ""){
            const currentPid = await bank.currentPid();
            await bank.createProduction(
                0,
                true,
                true,
                item.CoinToken,
                item.CurrencyToken,
                item.BorrowToken1,
                GoblinAddr,
                ethers.utils.parseEther(item.BorrowMinDebt1),
                ethers.utils.parseEther(item.BorrowMaxDebt1),
                item.OpenFactor,
                item.LiquidateFactor
            );
            utils.SaveLeverageContract(item.Name + " BorrowToken1: "+item.BorrowName1+ ", Pid:" + currentPid + "\n");
            console.log(item.Name + " BorrowToken1: "+item.BorrowName1+ ", Pid:" + currentPid);
        }

        utils.SaveLeverageContract("\n");
        console.log(item.Name + " Over" + "\n");
        await utils.Wait(200);

    }

    await utils.Wait(2000);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });