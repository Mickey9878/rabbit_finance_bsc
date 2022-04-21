// Set:
const Rabbit = ''
const BankConf = ''
const Bank = ''
const FarmOperator = ''
const FarmFairLaunchAddr = ''

const FarmPancakeReinvestStrat = '' // Pancake Reinvest Strategy
const FarmPancakeLiqStrat = '' // Pancake Liquidate Strategy
const FarmPancakeWithdrawStrat = '' // Pancake Withdraw Strategy
const FarmPancakeEpsLiqStrat = '' // Pancake Eps Liquidate Strategy
const FarmPancakeEpsWithdrawStrat = '' // Pancake Eps Withdraw Strategy

const FarmMdxLiqStrat = '' // Mdx Liquidate Strategy
const FarmMdxWithdrawStrat = '' // Mdx Withdraw Strategy
const FarmMdxEpsLiqStrat = '' // Mdx Eps Liquidate Strategy
const FarmMdxEpsWithdrawStrat = '' // Mdx Eps Withdraw Strategy
const LeverageBiswapLiq = ''   // Leverage Liq Strategy

// rabbit bank and fairLaunch
const FairLaunchDevAddr = ''
const FarmDevAddr = ''
const LeverageDevAddr = ''
const ContractOwner = ''
const BankOracleOwner = ''
const TimeLock = ''
const FairLaunchStartBlock = 13124241   // start time
const FairLaunchBonusEndBlock = 0
const BankConfGetReserveBps = 2000
const BankConfGetLiquidateBps = 500
const PancakeSwapV2Router02 = '0x10ED43C718714eb63d5aA57B78B54704E256024E'
const MdxSwapRouter02 = '0x7DAe51BD3E3376B8c7c4900E9107f12Be3AF1bA8'
const BiSwapRouter02 = '0x3a6d8cA21D1CF76F653A67577FA0D27453350dD8'
const IEps = '0x160CAed03795365F3A589f10C379FfA7d75d4E76'


// farm
const FarmPancakeIMasterChef = '0x73feaa1ee314f8c655e354234017be2193c9e24e'
const FarmPancakeReinvestBountyBps = 0
const FarmPancakeFeeBps = 0 // Reinvest Fee
const FarmMdxIMasterChef = '0xc48FE252Aa631017dF253578B1405ea399728A50'
const FarmMdxReinvestBountyBps = 0
const FarmMdxFeeBps = 0 // Reinvest Fee
const FarmMdxBoardRoomMDX = '0x6aEE12e5Eb987B3bE1BA8e621BE7C4804925bA68'
const FarmMdxBoardPID = 4


// leverage
const LeverageVault = '0x6B1498DA8422194b085454290B0c2F136Fbb4aC6'

module.exports =  {
    TimeLock,ContractOwner,BankOracleOwner,
    Rabbit,Bank,BankConf,FairLaunchDevAddr,FairLaunchStartBlock,
    FairLaunchBonusEndBlock,BankConfGetReserveBps,BankConfGetLiquidateBps,
    FarmOperator,FarmDevAddr,FarmFairLaunchAddr,IEps,BiSwapRouter02,
    FarmPancakeIMasterChef,PancakeSwapV2Router02,FarmPancakeReinvestStrat,FarmPancakeLiqStrat,
    FarmPancakeWithdrawStrat,FarmPancakeReinvestBountyBps,FarmPancakeFeeBps,FarmPancakeEpsLiqStrat,FarmPancakeEpsWithdrawStrat,
    FarmMdxIMasterChef,MdxSwapRouter02,FarmMdxLiqStrat,FarmMdxWithdrawStrat,
    FarmMdxReinvestBountyBps,FarmMdxFeeBps,FarmMdxBoardRoomMDX,FarmMdxBoardPID,FarmMdxEpsLiqStrat,FarmMdxEpsWithdrawStrat,
    LeverageVault,LeverageBiswapLiq,LeverageDevAddr
};