const {ethers} = require("hardhat");
const cnf = require('./cnf/cnf')
const utils = require('./utils')

async function main() {
    // ---------------------------------------- Strategy ---------------------------------------------
    // ---------------------------------------- pancake ---------------------------------------------
    // Reinvest Strategy
    utils.SaveStrategyContract("--------------------------------------- Farm Pancake ------------------------------------------"+"\n");
    const PancakeStrategyAllTokenOnly = await ethers.getContractFactory("contracts/worker/pancake_farm/StrategyAllTokenOnly.sol:StrategyAllTokenOnly");
    const pancakeStrategyAllTokenOnly = await PancakeStrategyAllTokenOnly.deploy(cnf.PancakeSwapV2Router02);
    await pancakeStrategyAllTokenOnly.transferOwnership(cnf.ContractOwner);
    utils.SaveStrategyContract("PancakeStrategyAllTokenOnly: "+pancakeStrategyAllTokenOnly.address.toString()+"\n");
    console.log("pancakeStrategyAllTokenOnly: ", pancakeStrategyAllTokenOnly.address);

    // liq positions
    const PancakeStrategyLiquidate = await ethers.getContractFactory("contracts/worker/pancake_farm/StrategyLiquidate.sol:StrategyLiquidate");
    const pancakeStrategyLiquidate = await PancakeStrategyLiquidate.deploy(cnf.PancakeSwapV2Router02);
    await pancakeStrategyLiquidate.transferOwnership(cnf.ContractOwner);
    utils.SaveStrategyContract("PancakeStrategyLiquidate: "+pancakeStrategyLiquidate.address.toString()+"\n");
    console.log("pancakeStrategyLiquidate: ", pancakeStrategyLiquidate.address);

    // stop positions
    const PancakeStrategyWithdrawMinimizeTrading = await ethers.getContractFactory("contracts/worker/pancake_farm/StrategyWithdrawMinimizeTrading.sol:StrategyWithdrawMinimizeTrading");
    const pancakeStrategyWithdrawMinimizeTrading = await PancakeStrategyWithdrawMinimizeTrading.deploy(cnf.PancakeSwapV2Router02);
    await pancakeStrategyWithdrawMinimizeTrading.transferOwnership(cnf.ContractOwner);
    utils.SaveStrategyContract("PancakeStrategyWithdrawMinimizeTrading: "+pancakeStrategyWithdrawMinimizeTrading.address.toString()+"\n");
    console.log("pancakeStrategyWithdrawMinimizeTrading: ", pancakeStrategyWithdrawMinimizeTrading.address);

    // eps liq positions
    const PancakeEpsStrategyLiquidate = await ethers.getContractFactory("contracts/worker/eps_strategy/EpsLiquidateStrategy.sol:StrategyLiquidate");
    const pancakeEpsStrategyLiquidate = await PancakeEpsStrategyLiquidate.deploy(cnf.PancakeSwapV2Router02, cnf.IEps);
    await pancakeEpsStrategyLiquidate.transferOwnership(cnf.ContractOwner);
    utils.SaveStrategyContract("PancakeEpsStrategyLiquidate: "+pancakeEpsStrategyLiquidate.address.toString()+"\n");
    console.log("pancakeEpsStrategyLiquidate: ", pancakeEpsStrategyLiquidate.address);

    // eps stop positions
    const PancakeEpsStrategyWithdraw = await ethers.getContractFactory("contracts/worker/eps_strategy/EpsWithdrawStrategy.sol:epsStrategyWithdraw");
    const pancakeEpsStrategyWithdraw = await PancakeEpsStrategyWithdraw.deploy(cnf.PancakeSwapV2Router02, cnf.IEps);
    await pancakeEpsStrategyWithdraw.transferOwnership(cnf.ContractOwner);
    utils.SaveStrategyContract("PancakeEpsStrategyWithdraw: "+pancakeEpsStrategyWithdraw.address.toString()+"\n\n");
    console.log("pancakeEpsStrategyWithdraw: ", pancakeEpsStrategyWithdraw.address);

    // ---------------------------------------- mdx ---------------------------------------------
    utils.SaveStrategyContract("--------------------------------------- Farm Mdx ------------------------------------------"+"\n");
    // liq positions
    const MdxStrategyLiquidate = await ethers.getContractFactory("contracts/worker/mdx_farm/StrategyLiquidate.sol:StrategyLiquidate");
    const mdxStrategyLiquidate = await MdxStrategyLiquidate.deploy(cnf.MdxSwapRouter02);
    await mdxStrategyLiquidate.transferOwnership(cnf.ContractOwner);
    utils.SaveStrategyContract("MdxStrategyLiquidate: "+mdxStrategyLiquidate.address.toString()+"\n");
    console.log("mdxStrategyLiquidate: ", mdxStrategyLiquidate.address);

    // stop positions
    const MdxStrategyWithdrawMinimizeTrading = await ethers.getContractFactory("contracts/worker/mdx_farm/StrategyWithdrawMinimizeTrading.sol:StrategyWithdrawMinimizeTrading");
    const mdxStrategyWithdrawMinimizeTrading = await MdxStrategyWithdrawMinimizeTrading.deploy(cnf.MdxSwapRouter02);
    await mdxStrategyWithdrawMinimizeTrading.transferOwnership(cnf.ContractOwner);
    utils.SaveStrategyContract("MdxStrategyWithdrawMinimizeTrading: "+mdxStrategyWithdrawMinimizeTrading.address.toString()+"\n");
    console.log("mdxStrategyWithdrawMinimizeTrading: ", mdxStrategyWithdrawMinimizeTrading.address);

    // eps liq positions
    const MdxEpsStrategyLiquidate = await ethers.getContractFactory("contracts/worker/eps_strategy/EpsLiquidateStrategy.sol:StrategyLiquidate");
    const mdxEpsStrategyLiquidate = await MdxEpsStrategyLiquidate.deploy(cnf.MdxSwapRouter02, cnf.IEps);
    await mdxEpsStrategyLiquidate.transferOwnership(cnf.ContractOwner);
    utils.SaveStrategyContract("MdxEpsStrategyLiquidate: "+mdxEpsStrategyLiquidate.address.toString()+"\n");
    console.log("mdxEpsStrategyLiquidate: ", mdxEpsStrategyLiquidate.address);

    // eps stop positions
    const MdxEpsStrategyWithdraw = await ethers.getContractFactory("contracts/worker/eps_strategy/EpsWithdrawStrategy.sol:epsStrategyWithdraw");
    const mdxEpsStrategyWithdraw = await MdxEpsStrategyWithdraw.deploy(cnf.MdxSwapRouter02, cnf.IEps);
    await mdxEpsStrategyWithdraw.transferOwnership(cnf.ContractOwner);
    utils.SaveStrategyContract("MdxEpsStrategyWithdraw: "+mdxEpsStrategyWithdraw.address.toString()+"\n\n");
    console.log("mdxEpsStrategyWithdraw: ", mdxEpsStrategyWithdraw.address);

    // ---------------------------------------- Pancake leverage ---------------------------------------------
    utils.SaveStrategyContract("--------------------------------------- Leverage Biswap ------------------------------------------"+"\n");
    // liq positions
    const BiswapLeverageStrategyLiquidate = await ethers.getContractFactory("contracts/worker/leverage/LeverageStrategyLiquidate.sol:LeverageStrategyLiquidate");
    const biswapLeverageStrategyLiquidate = await BiswapLeverageStrategyLiquidate.deploy(cnf.BiSwapRouter02);
    await biswapLeverageStrategyLiquidate.transferOwnership(cnf.ContractOwner);
    utils.SaveStrategyContract("biswapLeverageStrategyLiquidate: "+biswapLeverageStrategyLiquidate.address.toString()+"\n\n");
    console.log("biswapLeverageStrategyLiquidate: ", biswapLeverageStrategyLiquidate.address);

    await utils.Wait(2000);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });