const Productions = [
    {
        "Name": "PancakeUSDT-BUSD",
        //-------bank borrow Production
        "Goblin":"",
        "CoinToken":"0x55d398326f99059fF775485246999027B3197955",
        "CurrencyToken":"0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
        "BorrowName0":"USDT",
        "BorrowToken0":"0x55d398326f99059fF775485246999027B3197955",
        "BorrowMinDebt0": "100",
        "BorrowMaxDebt0": "30000000",
        "BorrowName1":"BUSD",
        "BorrowToken1":"0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
        "BorrowMinDebt1": "100",
        "BorrowMaxDebt1": "30000000",
        "OpenFactor":9000,
        "LiquidateFactor":9400
    },
    //------------------------------------ Mdx Farm ---------------------------------------------
    {
        "Name": "MdexBNB-BUSD",
        //-------bank borrow Production
        "Goblin":"",
        "CoinToken":"0x0000000000000000000000000000000000000000",
        "CurrencyToken":"0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
        "BorrowName0":"BNB",
        "BorrowToken0":"0x0000000000000000000000000000000000000000",
        "BorrowMinDebt0": "0.1613",
        "BorrowMaxDebt0": "316",
        "BorrowName1":"BUSD",
        "BorrowToken1":"0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
        "BorrowMinDebt1": "100",
        "BorrowMaxDebt1": "195688",
        "OpenFactor":7000,
        "LiquidateFactor":8400
    },
]

module.exports =  {
    Productions
}