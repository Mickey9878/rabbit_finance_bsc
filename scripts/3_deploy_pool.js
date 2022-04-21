const {ethers, upgrades} = require("hardhat");
const cnf = require('./cnf/cnf')
const cnfFarm = require('./cnf/cnf_farm')
const utils = require('./utils')

async function main() {

    const FairLaunch = await ethers.getContractFactory("contracts/rewards/FairLaunch.sol:FairLaunch");
    const fairLaunch = await FairLaunch.attach(cnf.FarmFairLaunchAddr);

    const Bank = await ethers.getContractFactory("contracts/Bank.sol:Bank");
    const bank = await Bank.attach(cnf.Bank);

    const BankConfig = await ethers.getContractFactory("contracts/bank_config/Conf.sol:BankConfig");
    const bankConfig = await BankConfig.attach(cnf.BankConf);

    for (let [_, item] of Object.entries(cnfFarm.FarmPool)) {
        utils.SaveFarmPoolContract("--------------------------------------- Farm "+item.Name+" ------------------------------------------"+"\n");
        console.log("--------------------------------------- Farm "+item.Name+" ------------------------------------------");
        // ---------------------------------------- Debt Token ---------------------------------------------
        const DebtToken = await ethers.getContractFactory("contracts/DebtToken.sol:DebtToken");
        const debtToken = await upgrades.deployProxy(DebtToken,[
            item.DebtTokenName,
            item.DebtTokenSymbol
        ], { initializer: 'initialize', unsafeAllow: ['delegatecall']});

        utils.SaveFarmPoolContract(item.Name + " debtToken: " + debtToken.address.toString() + "\n");
        console.log(item.Name + " debtToken: ", debtToken.address);

        // ---------------------------------------- Goblin -------------------------------------------------
        let GoblinAddr = '';
        let AddTwoStrategyAddr = ''
        let WithdrawStrategyAddr = ''
        if (item.FarmType === "PancakeFarm"){
            let LiqStrat = cnf.FarmPancakeLiqStrat
            if (item.IsEps){
                LiqStrat = cnf.FarmPancakeEpsLiqStrat
            }

            const PancakeGoblin = await ethers.getContractFactory("contracts/worker/pancake_farm/PancakeGoblin.sol:PancakeswapGoblin");
            const pancakeGoblin = await upgrades.deployProxy(PancakeGoblin,[
                cnf.FarmOperator,
                cnf.FarmPancakeIMasterChef,
                cnf.PancakeSwapV2Router02,
                item.Pid,
                cnf.FarmPancakeReinvestStrat,
                LiqStrat,
                cnf.FarmPancakeReinvestBountyBps,
                cnf.FarmPancakeFeeBps,
                cnf.FarmDevAddr,
                cnf.FarmFairLaunchAddr,
                item.BaseToken
            ], { initializer: 'initialize', unsafeAllow: ['delegatecall']});
            utils.SaveFarmPoolContract(item.Name + " Pancake Goblin: " + pancakeGoblin.address.toString() + "\n");
            console.log(item.Name + " Pancake Goblin: ", pancakeGoblin.address);

            // ---------------------------------------- Goblin Deploy AddTwoStrategy ------------------ -----------------
            if (item.IsEps){
                const EpsAddTwoStrategy = await ethers.getContractFactory("contracts/worker/eps_strategy/EpsAddStrategy.sol:EpsAddStrategy");
                const epsAddTwoStrategy = await EpsAddTwoStrategy.deploy(cnf.PancakeSwapV2Router02, cnf.IEps, pancakeGoblin.address);
                await epsAddTwoStrategy.transferOwnership(cnf.ContractOwner);
                AddTwoStrategyAddr = epsAddTwoStrategy.address;
                WithdrawStrategyAddr = cnf.FarmPancakeEpsWithdrawStrat;
                console.log(item.Name + " epsAddTwoStrategy: ", epsAddTwoStrategy.address);
            }else{
                WithdrawStrategyAddr = cnf.FarmPancakeWithdrawStrat
                const AddTwoStrategy = await ethers.getContractFactory("contracts/worker/pancake_farm/PancakeV2StrategyAddTwoSidesOptimal.sol:StrategyAddTwoSidesOptimal");
                const addTwoStrategy = await AddTwoStrategy.deploy(cnf.PancakeSwapV2Router02, pancakeGoblin.address);
                await addTwoStrategy.transferOwnership(cnf.ContractOwner);
                AddTwoStrategyAddr = addTwoStrategy.address;
                WithdrawStrategyAddr = cnf.FarmPancakeWithdrawStrat;
                console.log(item.Name + " addTwoStrategy: ", addTwoStrategy.address);
            }

            GoblinAddr = pancakeGoblin.address;
            utils.SaveFarmPoolContract(item.Name + " FarmPancakeReinvestStrat: " + cnf.FarmPancakeReinvestStrat + "\n");
            utils.SaveFarmPoolContract(item.Name + " FarmPancakeLiqStrat: " + LiqStrat + "\n");
            console.log(item.Name + " FarmPancakeReinvestStrat: " + cnf.FarmPancakeReinvestStrat);
            console.log(item.Name + " FarmPancakeLiqStrat: " + LiqStrat);
        }else if (item.FarmType === "MdxFarm"){
            let LiqStrat = cnf.FarmMdxLiqStrat;
            if (item.IsEps){
                LiqStrat = cnf.FarmMdxEpsLiqStrat;
            }

            const MdxGoblin = await ethers.getContractFactory("contracts/worker/mdx_farm/MDXGoblinBoardroom.sol:MDXGoblin");
            const mdxGoblin = await upgrades.deployProxy(MdxGoblin,[
                cnf.FarmOperator,
                cnf.FarmMdxIMasterChef,
                cnf.MdxSwapRouter02,
                item.Pid,
                LiqStrat,
                cnf.FarmMdxReinvestBountyBps,
                cnf.FarmMdxFeeBps,
                cnf.FarmDevAddr,
                cnf.FarmFairLaunchAddr,
                item.BaseToken,
                cnf.FarmMdxBoardRoomMDX,
                cnf.FarmMdxBoardPID
            ], { initializer: 'initialize', unsafeAllow: ['delegatecall']});
            utils.SaveFarmPoolContract(item.Name + " Mdx Goblin: " + mdxGoblin.address.toString() + "\n");
            console.log(item.Name + " Mdx Goblin: ", mdxGoblin.address);

            // ---------------------------------------- Goblin Deploy AddTwoStrategy ------------------------------------
            if (item.IsEps){
                const EpsAddTwoStrategy = await ethers.getContractFactory("contracts/worker/eps_strategy/EpsAddStrategy.sol:EpsAddStrategy");
                const epsAddTwoStrategy = await EpsAddTwoStrategy.deploy(cnf.MdxSwapRouter02, cnf.IEps, mdxGoblin.address);
                await epsAddTwoStrategy.transferOwnership(cnf.ContractOwner);
                AddTwoStrategyAddr = epsAddTwoStrategy.address;
                WithdrawStrategyAddr = cnf.FarmMdxEpsWithdrawStrat;
                console.log(item.Name + " epsAddTwoStrategy: ", epsAddTwoStrategy.address);
            }else{
                const AddTwoStrategy = await ethers.getContractFactory("contracts/worker/mdx_farm/MdexStrategyAddTwoSidesOptimal.sol:StrategyAddTwoSidesOptimal");
                const addTwoStrategy = await AddTwoStrategy.deploy(cnf.MdxSwapRouter02, mdxGoblin.address);
                await addTwoStrategy.transferOwnership(cnf.ContractOwner);
                AddTwoStrategyAddr = addTwoStrategy.address;
                WithdrawStrategyAddr = cnf.FarmMdxWithdrawStrat;
                console.log(item.Name + " addTwoStrategy: ", addTwoStrategy.address);
            }

            GoblinAddr = mdxGoblin.address;
            utils.SaveFarmPoolContract(item.Name + " FarmMdxLiqStrat: " + LiqStrat + "\n");
            console.log(item.Name + " FarmMdxLiqStrat: " + LiqStrat);
        }
        utils.SaveFarmPoolContract(item.Name + " AddTwoStrategyAddr: " + AddTwoStrategyAddr.toString() + "\n");
        utils.SaveFarmPoolContract(item.Name + " WithdrawStrategyAddr: " + WithdrawStrategyAddr.toString() + "\n");
        console.log(item.Name + " AddTwoStrategyAddr: ", AddTwoStrategyAddr);
        console.log(item.Name + " AddTwoStrategyAddr: ", AddTwoStrategyAddr);

        // ---------------------------------------- Debt Token Transfer Owner ------------------------------
        await debtToken.transferOwnership(GoblinAddr);
        console.log("debtToken transferOwnership ok");

        // ---------------------------------------- Goblin Update DebtToken And Pid And Approve ------------------------
        const Goblin = await ethers.getContractFactory("contracts/worker/pancake_farm/PancakeGoblin.sol:PancakeswapGoblin");
        const goblin = await Goblin.attach(GoblinAddr);
        await goblin.setStrategyOk([AddTwoStrategyAddr, WithdrawStrategyAddr], true);
        console.log("goblin setStrategyOk ok");

        // ---------------------------------------- FairLaunch Add Debt Token ------------------------------
        const debtTokenPid =  await fairLaunch.poolLength();

        utils.SaveFarmPoolContract("------------------ FairLaunch DebtToken Pid --------------------" + "\n");
        await fairLaunch.addPool(item.FairLaunchPoint, debtToken.address, false);
        console.log("fairLaunch addPool ok");

        await goblin.updateDebtToken(debtToken.address, debtTokenPid);
        utils.SaveFarmPoolContract(item.DebtTokenName + " FairLaunch Pid: " + debtTokenPid + "\n");
        console.log(item.DebtTokenName + " FairLaunch Pid: ", debtTokenPid.toNumber());

        await goblin.setPendingGovernor(cnf.ContractOwner);
        console.log("goblin setPendingGovernor ok");

        // await utils.Wait(10000);
        //
        // const [isDuplicatedPool,Pid] = await fairLaunch.getPoolPid(debtToken.address)
        // if (isDuplicatedPool){
        //     await goblin.updateDebtToken(debtToken.address, Pid);
        //     utils.SaveFarmPoolContract(item.DebtTokenName + " FairLaunch Pid: " + Pid + "\n");
        //     console.log(item.DebtTokenName + " FairLaunch Pid: ", Pid.toNumber());
        //     console.log("goblin updateDebtToken ok");
        // }else{
        //     utils.SaveFarmPoolContract(item.DebtTokenName + " FairLaunch Pid: " + 0 + "\n");
        //     console.log(item.Name + " FairLaunch Add DebtToken Error");
        // }

        // ---------------------------------------- BankConf setConfigs -------------------------------------
        await bankConfig.setConfigs([goblin.address], [item.MaxPriceDiff]);
        console.log("BankConfig Set Goblin MaxPriceDiff OK");

        // ---------------------------------------- Bank Creat Production ----------------------------------
        utils.SaveFarmPoolContract("------------------ Bank Borrow Pid --------------------" + "\n");
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
            utils.SaveFarmPoolContract(item.Name + " BorrowToken0: "+item.BorrowName0+ ", Pid:" + currentPid + "\n");
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
            utils.SaveFarmPoolContract(item.Name + " BorrowToken1: "+item.BorrowName1+ ", Pid:" + currentPid + "\n");
            console.log(item.Name + " BorrowToken1: "+item.BorrowName1+ ", Pid:" + currentPid);
        }

        utils.SaveFarmPoolContract("\n");
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