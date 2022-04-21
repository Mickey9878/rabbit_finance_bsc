const fs = require('fs');

const DeployHome = 'deploy_info'
const BankFile = DeployHome+'/bank.txt'
const StrategyFile = DeployHome+'/strategy.txt'
const FarmPoolFile = DeployHome+'/farm_pool.txt'
const LeverageFile = DeployHome+'/leverage.txt'

function SaveBankContract(context) {
    fs.appendFile(BankFile, context, err => {
        if (err) {
            console.error("SaveContract: "+err)
        }
    })
}

function SaveStrategyContract(context) {
    fs.appendFile(StrategyFile, context, err => {
        if (err) {
            console.error("SaveContract: "+err)
        }
    })
}

function SaveFarmPoolContract(context) {
    fs.appendFile(FarmPoolFile, context, err => {
        if (err) {
            console.error("SaveContract: "+err)
        }
    })
}

function SaveLeverageContract(context) {
    fs.appendFile(LeverageFile, context, err => {
        if (err) {
            console.error("SaveContract: "+err)
        }
    })
}

function Wait(ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
}

module.exports = {
    SaveBankContract,SaveStrategyContract,SaveFarmPoolContract,SaveLeverageContract,Wait
}
