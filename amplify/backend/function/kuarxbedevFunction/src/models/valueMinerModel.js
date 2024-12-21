/**
 * @prettier
 */

let mongoose = require('mongoose')

const balanceSheetAnnualModel = mongoose.Schema(
   {
      symbol: { type: String, required: true },
      fiscalDateEnding: { type: Date, required: false },
      reportedCurrency: { type: String, required: false },
      totalAssets: { type: Number, required: false },
      totalCurrentAssets: { type: Number, required: false },
      cashAndCashEquivalentsAtCarryingValue: { type: Number, required: false },
      cashAndShortTermInvestments: { type: Number, required: false },
      inventory: { type: Number, required: false },
      currentNetReceivables: { type: Number, required: false },
      totalNonCurrentAssets: { type: Number, required: false },
      propertyPlantEquipment: { type: Number, required: false },
      accumulatedDepreciationAmortizationPPE: { type: Number, required: false },
      intangibleAssets: { type: Number, required: false },
      intangibleAssetsExcludingGoodwill: { type: Number, required: false },
      goodwill: { type: Number, required: false },
      investments: { type: Number, required: false },
      longTermInvestments: { type: Number, required: false },
      shortTermInvestments: { type: Number, required: false },
      otherCurrentAssets: { type: Number, required: false },
      otherNonCurrentAssets: { type: Number, required: false },
      totalLiabilities: { type: Number, required: false },
      totalCurrentLiabilities: { type: Number, required: false },
      currentAccountsPayable: { type: Number, required: false },
      deferredRevenue: { type: Number, required: false },
      currentDebt: { type: Number, required: false },
      shortTermDebt: { type: Number, required: false },
      totalNonCurrentLiabilities: { type: Number, required: false },
      capitalLeaseObligations: { type: Number, required: false },
      longTermDebt: { type: Number, required: false },
      currentLongTermDebt: { type: Number, required: false },
      longTermDebtNoncurrent: { type: Number, required: false },
      shortLongTermDebtTotal: { type: Number, required: false },
      otherCurrentLiabilities: { type: Number, required: false },
      otherNonCurrentLiabilities: { type: Number, required: false },
      totalShareholderEquity: { type: Number, required: false },
      treasuryStock: { type: Number, required: false },
      retainedEarnings: { type: Number, required: false },
      commonStock: { type: Number, required: false },
      commonStockSharesOutstanding: { type: Number, required: false },
   },
   {
      timestamps: true,
   },
)

balanceSheetAnnualModel.pre('insertMany', function (next, docs) {
   // 'docs' is an array of documents being inserted
   docs.forEach(doc => {
      for (let key in doc) {
         if (doc[key] === 'None') {
            doc[key] = null // Replace "None" with an empty string
         }
      }
   })
   next() // Proceed with the insertion
})

const BalanceSheetAnnual = mongoose.model(
   'BalanceSheetAnnual',
   balanceSheetAnnualModel,
)

const balanceSheetQuarterlyModel = mongoose.Schema(
   {
      symbol: { type: String, required: true },
      fiscalDateEnding: { type: Date, required: false },
      reportedCurrency: { type: String, required: false },
      totalAssets: { type: Number, required: false },
      totalCurrentAssets: { type: Number, required: false },
      cashAndCashEquivalentsAtCarryingValue: { type: Number, required: false },
      cashAndShortTermInvestments: { type: Number, required: false },
      inventory: { type: Number, required: false },
      currentNetReceivables: { type: Number, required: false },
      totalNonCurrentAssets: { type: Number, required: false },
      propertyPlantEquipment: { type: Number, required: false },
      accumulatedDepreciationAmortizationPPE: { type: Number, required: false },
      intangibleAssets: { type: Number, required: false },
      intangibleAssetsExcludingGoodwill: { type: Number, required: false },
      goodwill: { type: Number, required: false },
      investments: { type: Number, required: false },
      longTermInvestments: { type: Number, required: false },
      shortTermInvestments: { type: Number, required: false },
      otherCurrentAssets: { type: Number, required: false },
      otherNonCurrentAssets: { type: Number, required: false },
      totalLiabilities: { type: Number, required: false },
      totalCurrentLiabilities: { type: Number, required: false },
      currentAccountsPayable: { type: Number, required: false },
      deferredRevenue: { type: Number, required: false },
      currentDebt: { type: Number, required: false },
      shortTermDebt: { type: Number, required: false },
      totalNonCurrentLiabilities: { type: Number, required: false },
      capitalLeaseObligations: { type: Number, required: false },
      longTermDebt: { type: Number, required: false },
      currentLongTermDebt: { type: Number, required: false },
      longTermDebtNoncurrent: { type: Number, required: false },
      shortLongTermDebtTotal: { type: Number, required: false },
      otherCurrentLiabilities: { type: Number, required: false },
      otherNonCurrentLiabilities: { type: Number, required: false },
      totalShareholderEquity: { type: Number, required: false },
      treasuryStock: { type: Number, required: false },
      retainedEarnings: { type: Number, required: false },
      commonStock: { type: Number, required: false },
      commonStockSharesOutstanding: { type: Number, required: false },
   },
   {
      timestamps: true,
   },
)

balanceSheetQuarterlyModel.pre('insertMany', function (next, docs) {
   // 'docs' is an array of documents being inserted
   docs.forEach(doc => {
      for (let key in doc) {
         if (doc[key] === 'None') {
            doc[key] = null // Replace "None" with an empty string
         }
      }
   })
   next() // Proceed with the insertion
})
const BalanceSheetQuarterly = mongoose.model(
   'BalanceSheetQuarterly',
   balanceSheetQuarterlyModel,
)

module.exports = {
   BalanceSheetAnnual,
   BalanceSheetQuarterly,
}
