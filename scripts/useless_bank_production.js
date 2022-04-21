const {ethers} = require("hardhat");
const cnf = require('./cnf/cnf')
const cnfFarm = require('./cnf/cnf_farm')

async function main() {
    // ---------------------------------------- Bank Creat Production ----------------------------------
    const Bank = await ethers.getContractFactory("contracts/Bank.sol:Bank");
    const bank = await Bank.attach(cnf.Bank);

    for (let [_, item] of Object.entries(cnfFarm.FarmPool)) {
        if (item.BorrowName0 !== ""){
            const currentPid = await bank.currentPid();
            await bank.createProduction(
                0,
                true,
                true,
                item.CoinToken,
                item.CurrencyToken,
                item.BorrowToken0,
                item.Goblin,
                ethers.utils.parseEther(item.BorrowMinDebt0),
                ethers.utils.parseEther(item.BorrowMaxDebt0),
                item.OpenFactor,
                item.LiquidateFactor
            );
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
                item.Goblin,
                ethers.utils.parseEther(item.BorrowMinDebt1),
                ethers.utils.parseEther(item.BorrowMaxDebt1),
                item.OpenFactor,
                item.LiquidateFactor
            );
            console.log(item.Name + " BorrowToken1: "+item.BorrowName1+ ", Pid:" + currentPid)
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });