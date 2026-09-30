export type Lang = 'sv' | 'en'

export interface TranslationKey {
  appName: string
  tagline: string
  language: string
  housePrice: string
  downPaymentPct: string
  downPaymentAmount: string
  loanAmount: string
  loanTerm: string
  interestRates: string
  rate: string
  monthlyPayment: string
  monthlyInterest: string
  monthlyAmortization: string
  monthlyTotal: string
  monthlyTotalAfterTax: string
  taxReduction: string
  firstYearInterest: string
  propertyType: string
  house: string
  apartment: string
  monthlyFee: string
  monthlyCosts: string
  currentMonthlyCosts: string
  currentMonthlyCostsHelp: string
  currentCostGrowth: string
  currentCostGrowthHelp: string
  valueGrowth: string
  valueGrowthHelp: string
  useScb: string
  scbFetching: string
  scbFailed: string
  scbUpdated: string
  numberOfOwners: string
  numberOfOwnersHelp: string
  otherCapitalIncome: string
  otherCapitalIncomeHelp: string
  loanToValue: string
  loanToValueWarning: string
  results: string
  yearlyDevelopment: string
  year: string
  yearOf: string
  houseValue: string
  loanBalance: string
  amortizationYear: string
  amortizationMonth: string
  interestCost: string
  interestAfterTax: string
  monthlyCostTotal: string
  monthlyCostAfterTax: string
  netIfSold: string
  netIfSoldHelp: string
  scenarioComparison: string
  compareWithToday: string
  difference: string
  differenceColumn: string
  cheaper: string
  moreExpensive: string
  summary: string
  amortizationRequirement: string
  chartHouseValue: string
  chartLoanEquity: string
  chartMonthlyCost: string
  chartInterest: string
  years: string
  perMonth: string
  disclaimer: string
}

export const translations: Record<Lang, TranslationKey> = {
  sv: {
    appName: 'Bostadsköps­hjälpen',
    tagline: 'Räkna på ditt bostadsköp innan du köper',
    language: 'Språk',
    housePrice: 'Pris på bostaden',
    downPaymentPct: 'Kontantinsats (%)',
    downPaymentAmount: 'Kontantinsats (kr)',
    loanAmount: 'Lånebelopp',
    loanTerm: 'Löptid (år)',
    interestRates: 'Räntor att jämföra',
    rate: 'Ränta',
    monthlyPayment: 'Månadsbetalning (annuitet)',
    monthlyInterest: 'Räntekostnad / månad',
    monthlyAmortization: 'Amortering / månad',
    monthlyTotal: 'Totalkostnad / månad',
    monthlyTotalAfterTax: 'Totalkostnad / månad efter ränteavdrag',
    taxReduction: 'Ränteavdrag (per år)',
    firstYearInterest: 'Räntekostnad första året',
    propertyType: 'Bostadstyp',
    house: 'Villa / småhus',
    apartment: 'Bostadsrätt',
    monthlyFee: 'Månadsavgift bostadsrättsförening',
    monthlyCosts: 'Övriga boendekostnader / månad',
    currentMonthlyCosts: 'Din nuvarande månadskostnad',
    currentMonthlyCostsHelp: 'Vad du betalar i boende idag, för att jämföra med att köpa.',
    currentCostGrowth: 'Ökning nuvarande kostnad (%/år)',
    currentCostGrowthHelp: 'Standardökning för hyra, mat och övriga levnadskostnader.',
    valueGrowth: 'Förväntad värdeökning (%/år)',
    valueGrowthHelp: 'Medianökning för den svenska marknaden. Hämtas från SCB om möjligt.',
    useScb: 'Hämta senaste från SCB',
    scbFetching: 'Hämtar från SCB…',
    scbFailed: 'Kunde inte hämta SCB-data. Använder standardvärde.',
    scbUpdated: 'Uppdaterat värde från SCB',
    numberOfOwners: 'Antal låntagare',
    numberOfOwnersHelp: 'Ränteavdraget beräknas per person (100 000 kr-gränsen gäller per låntagare).',
    otherCapitalIncome: 'Övrig kapitalinkomst (kr/år)',
    otherCapitalIncomeHelp: 'T.ex. utdelning eller ränta i tjänstepension. Påverkar avdraget vid höga räntekostnader.',
    loanToValue: 'Belåningsgrad',
    loanToValueWarning: 'Obs: kontantinsats under 15% kräver oftast amorteringstillägg.',
    results: 'Resultat',
    yearlyDevelopment: 'Utveckling per år',
    year: 'År',
    yearOf: 'år',
    houseValue: 'Bostadens värde',
    loanBalance: 'Kvarvarande lån',
    amortizationYear: 'Amortering / år',
    amortizationMonth: 'Amortering / månad',
    interestCost: 'Räntekostnad',
    interestAfterTax: 'Räntekostnad efter ränteavdrag',
    monthlyCostTotal: 'Total månadskostnad',
    monthlyCostAfterTax: 'Månadskostnad efter ränteavdrag',
    netIfSold: 'Netto vid försäljning',
    netIfSoldHelp: 'Bostadens värde minus kvarvarande lån.',
    scenarioComparison: 'Jämförelse av räntor',
    compareWithToday: 'Jämförelse med din nuvarande kostnad',
    difference: 'Skillnad',
    differenceColumn: 'Skillnad vs idag',
    cheaper: 'billigare',
    moreExpensive: 'dyrare',
    summary: 'Sammanfattning',
    amortizationRequirement: 'Amorteringskrav',
    chartHouseValue: 'Bostadens värde',
    chartLoanEquity: 'Lån och bostadens värde',
    chartMonthlyCost: 'Månadskostnad över tid',
    chartInterest: 'Räntekostnad per år',
    years: 'år',
    perMonth: '/ månad',
    disclaimer: 'Beräkningarna är uppskattningar och utgör inte ekonomisk rådgivning.',
  },
  en: {
    appName: 'House Buying Helper',
    tagline: 'Calculate your house purchase before you buy',
    language: 'Language',
    housePrice: 'House price',
    downPaymentPct: 'Down payment (%)',
    downPaymentAmount: 'Down payment (SEK)',
    loanAmount: 'Loan amount',
    loanTerm: 'Loan term (years)',
    interestRates: 'Interest rates to compare',
    rate: 'Rate',
    monthlyPayment: 'Monthly payment (annuity)',
    monthlyInterest: 'Interest cost / month',
    monthlyAmortization: 'Amortization / month',
    monthlyTotal: 'Total cost / month',
    monthlyTotalAfterTax: 'Total cost / month after tax reduction',
    taxReduction: 'Interest deduction (per year)',
    firstYearInterest: 'Interest cost first year',
    propertyType: 'Property type',
    house: 'House',
    apartment: 'Apartment (bostadsrätt)',
    monthlyFee: 'Monthly fee (housing cooperative)',
    monthlyCosts: 'Other monthly housing costs',
    currentMonthlyCosts: 'Your current monthly cost',
    currentMonthlyCostsHelp: 'What you pay for housing today, to compare with buying.',
    currentCostGrowth: 'Increase of current cost (%/year)',
    currentCostGrowthHelp: 'Standard increase for rent, food and general living costs.',
    valueGrowth: 'Expected value growth (%/year)',
    valueGrowthHelp: 'Median increase for the Swedish market. Fetched from SCB when possible.',
    useScb: 'Fetch latest from SCB',
    scbFetching: 'Fetching from SCB…',
    scbFailed: 'Could not fetch SCB data. Using default value.',
    scbUpdated: 'Updated value from SCB',
    numberOfOwners: 'Number of borrowers',
    numberOfOwnersHelp: 'The interest deduction is calculated per person (the 100,000 SEK threshold applies per borrower).',
    otherCapitalIncome: 'Other capital income (SEK/year)',
    otherCapitalIncomeHelp: 'E.g. dividends or pension interest. Affects the deduction at high interest costs.',
    loanToValue: 'Loan-to-value',
    loanToValueWarning: 'Note: down payment below 15% usually requires extra amortization.',
    results: 'Results',
    yearlyDevelopment: 'Yearly development',
    year: 'Year',
    yearOf: 'year',
    houseValue: 'House value',
    loanBalance: 'Remaining loan',
    amortizationYear: 'Amortization / year',
    amortizationMonth: 'Amortization / month',
    interestCost: 'Interest cost',
    interestAfterTax: 'Interest cost after deduction',
    monthlyCostTotal: 'Total monthly cost',
    monthlyCostAfterTax: 'Monthly cost after deduction',
    netIfSold: 'Net if sold',
    netIfSoldHelp: 'House value minus remaining loan.',
    scenarioComparison: 'Interest rate comparison',
    compareWithToday: 'Comparison with your current cost',
    difference: 'Difference',
    differenceColumn: 'Difference vs today',
    cheaper: 'cheaper',
    moreExpensive: 'more expensive',
    summary: 'Summary',
    amortizationRequirement: 'Amortization requirement',
    chartHouseValue: 'House value',
    chartLoanEquity: 'Loan and house value',
    chartMonthlyCost: 'Monthly cost over time',
    chartInterest: 'Interest cost per year',
    years: 'years',
    perMonth: '/ month',
    disclaimer: 'The calculations are estimates and do not constitute financial advice.',
  },
}
