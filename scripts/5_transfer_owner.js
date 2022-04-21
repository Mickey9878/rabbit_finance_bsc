const {ethers} = require("hardhat");
const cnf = require('./cnf/cnf')

async function main() {
    // bank, bank conf, fairLaunch
    // Goblin Bank acceptGovernor
    const FairLaunch = await ethers.getContractFactory("contracts/rewards/FairLaunch.sol:FairLaunch");
    const fairLaunch = await FairLaunch.attach(cnf.FarmFairLaunchAddr);
    await fairLaunch.transferOwnership(cnf.ContractOwner);
    console.log("fairLaunch transferOwnership ok");

    const Bank = await ethers.getContractFactory("contracts/Bank.sol:Bank");
    const bank = await Bank.attach(cnf.Bank);
    await bank.setPendingGovernor(cnf.ContractOwner);
    console.log("bank setPendingGovernor ok");

    const BankConfig = await ethers.getContractFactory("contracts/bank_config/Conf.sol:BankConfig");
    const bankConfig = await BankConfig.attach(cnf.BankConf);
    await bankConfig.transferOwnership(cnf.ContractOwner);
    console.log("bankConfig transferOwnership ok");
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });