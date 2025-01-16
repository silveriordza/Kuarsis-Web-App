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

const edgarCompanyFactsAnnual = mongoose.Schema(
   {
      symbol: { type: String, required: true },
      cik: { type: Number, required: true },
      year: { type: Number, required: true },
      InterestExpense: { type: Number, required: true },
   },
   {
      timestamps: true,
   },
)

const EdgarCompanyFactsAnnual = mongoose.model(
   'EdgarCompanyFactsAnnual',
   edgarCompanyFactsAnnual,
)

const edgarCompanyFactsQuarter = mongoose.Schema(
   {
      symbol: { type: String, required: true },
      cik: { type: Number, required: true },
      year: { type: Number, required: true },
      quarter: { type: Number, required: true },
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      InterestExpense: { type: Number, required: true },
   },
   {
      timestamps: true,
   },
)

const EgarCompanyFactsQuarter = mongoose.model(
   'EgarCompanyFactsQuarter',
   edgarCompanyFactsQuarter,
)

const edgarCikToTickerMaps = mongoose.Schema(
   {
      cikTickerMap: { type: mongoose.Schema.Types.Mixed, required: true },
   },
   {
      timestamps: true,
   },
)

const EdgarCikToTickerMaps = mongoose.model(
   'EdgarCikToTickerMaps',
   edgarCikToTickerMaps,
)

const edgarCompaniesFacts = mongoose.Schema(
   {
      ticker: { type: String, required: true, unique: true },
      cik: { type: String, required: true, unique: true },
      companyName: { type: String, required: true, unique: true },
      edgarData: { type: mongoose.Schema.Types.Mixed },
   },
   {
      timestamps: true,
   },
)

const EdgarCompaniesFacts = mongoose.model(
   'EdgarCompaniesFacts',
   edgarCompaniesFacts,
)

module.exports = {
   BalanceSheetAnnual,
   BalanceSheetQuarterly,
   EdgarCompanyFactsAnnual,
   EdgarCikToTickerMaps,
   EgarCompanyFactsQuarter,
   EdgarCompaniesFacts,
}
