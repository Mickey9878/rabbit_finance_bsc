const LeverageBiswap = [
    {
        "Name": "BiswapBTCB-USDT",
        "FarmType":"BiswapLeverage",
        "FairLaunchPoint": 10,
        "MaxPriceDiff":10500, // price differences
        "DebtTokenName": "debtLeverageBiswapBTCB-USDT",
        "DebtTokenSymbol": "debtLeverageBiswapBTCB-USDT",
        "Token0":"0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",
        "Token1":"0x55d398326f99059ff775485246999027b3197955",
        "SwapPath":[
            "0x55d398326f99059ff775485246999027b3197955",
            "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c"
        ],
        //-------bank borrow Production
        "Goblin":"",
        "CoinToken":"0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",
        "CurrencyToken":"0x55d398326f99059fF775485246999027B3197955",
        "BorrowName0":"BTCB",
        "BorrowToken0":"0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",
        "BorrowMinDebt0": "0.0017",
        "BorrowMaxDebt0": "14.1849",
        "BorrowName1":"USDT",
        "BorrowToken1":"0x55d398326f99059fF775485246999027B3197955",
        "BorrowMinDebt1": "100",
        "BorrowMaxDebt1": "822722",
        "OpenFactor":8100,
        "LiquidateFactor":9000
    },
]

module.exports =  {
    LeverageBiswap
}