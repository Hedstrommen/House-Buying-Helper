export interface LoanInput {
  housePrice: number
  downPaymentPct: number
  interestRates: [number, number, number]
  loanTermYears: number
  propertyType: 'house' | 'apartment'
  monthlyFee: number
  monthlyCosts: number
  currentMonthlyCosts: number
  currentCostGrowthPct: number
  valueGrowthPct: number
  numberOfOwners: number
  otherCapitalIncome: number
}

export interface YearRow {
  year: number
  houseValue: number
  loanBalance: number
  currentCostAtYear: number
  amortizationTotal: number
  amortizationMonthly: number
  interestCost: number
  interestAfterTax: number
  taxReduction: number
  monthlyCostTotal: number
  monthlyCostAfterTax: monthlyCostAfterTaxType
  monthlyDifference: number
  netIfSold: number
}

type monthlyCostAfterTaxType = number

export interface CalculationResult {
  loanAmount: number
  downPayment: number
  years: YearRow[]
}

export interface RateScenario {
  rate: number
  monthlyPayment: number
  monthlyInterest: number
  monthlyAmortization: number
  monthlyTotal: number
  monthlyTotalAfterTax: number
  taxReductionYear: number
  firstYearInterest: number
}

export const annuityPayment = (principal: number, annualRatePct: number, years: number): number => {
  const monthlyRate = annualRatePct / 100 / 12
  const n = years * 12
  if (n === 0) return 0
  if (monthlyRate === 0) return principal / n
  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n))
}

export const calculateRanteavdrag = (
  annualInterest: number,
  numberOfOwners: number,
  otherCapitalIncome: number,
): number => {
  const owners = Math.max(numberOfOwners, 1)
  const perOwnerInterest = annualInterest / owners
  const perOwnerCapital = otherCapitalIncome / owners
  let total = 0
  for (let i = 0; i < owners; i++) {
    const deficit = Math.max(perOwnerInterest - perOwnerCapital, 0)
    const reduction30 = Math.min(deficit, 100000) * 0.3
    const reduction21 = Math.max(deficit - 100000, 0) * 0.21
    total += reduction30 + reduction21
  }
  return total
}

export const calculate = (input: LoanInput): CalculationResult => {
  const downPayment = input.housePrice * (input.downPaymentPct / 100)
  const loanAmount = Math.max(input.housePrice - downPayment, 0)
  const years: YearRow[] = []
  let balance = loanAmount
  let houseValue = input.housePrice
  const annuity = annuityPayment(loanAmount, input.interestRates[0], input.loanTermYears)
  let currentCost = input.currentMonthlyCosts

  for (let y = 0; y <= input.loanTermYears; y++) {
    let yearAmortization = 0
    let yearInterest = 0
    if (y > 0) {
      const monthlyRate = input.interestRates[0] / 100 / 12
      for (let m = 0; m < 12; m++) {
        const interestPortion = balance * monthlyRate
        const amortPortion = Math.min(annuity - interestPortion, balance)
        balance = Math.max(balance - amortPortion, 0)
        yearAmortization += amortPortion
        yearInterest += interestPortion
      }
      houseValue *= 1 + input.valueGrowthPct / 100
      currentCost *= 1 + input.currentCostGrowthPct / 100
    }
    const taxReduction = calculateRanteavdrag(yearInterest, input.numberOfOwners, input.otherCapitalIncome)
    const monthlyTotal = annuity + input.monthlyFee + input.monthlyCosts
    const monthlyTotalAfterTax = monthlyTotal - taxReduction / 12
    years.push({
      year: y,
      houseValue,
      loanBalance: balance,
      currentCostAtYear: currentCost,
      amortizationTotal: yearAmortization,
      amortizationMonthly: yearAmortization / 12,
      interestCost: yearInterest,
      interestAfterTax: yearInterest - taxReduction,
      taxReduction,
      monthlyCostTotal: monthlyTotal,
      monthlyCostAfterTax: monthlyTotalAfterTax,
      monthlyDifference: monthlyTotalAfterTax - currentCost,
      netIfSold: houseValue - balance,
    })
  }
  return { loanAmount, downPayment, years }
}

export const calculateRateScenarios = (input: LoanInput): RateScenario[] => {
  const loanAmount = input.housePrice * (1 - input.downPaymentPct / 100)
  return input.interestRates.map((rate) => {
    const monthlyPayment = annuityPayment(loanAmount, rate, input.loanTermYears)
    const monthlyInterest = (loanAmount * rate) / 100 / 12
    const monthlyAmortization = Math.max(monthlyPayment - monthlyInterest, 0)
    const firstYearInterest = monthlyInterest * 12
    const taxReductionYear = calculateRanteavdrag(firstYearInterest, input.numberOfOwners, input.otherCapitalIncome)
    const monthlyTotal = monthlyPayment + input.monthlyFee + input.monthlyCosts
    return {
      rate,
      monthlyPayment,
      monthlyInterest,
      monthlyAmortization,
      monthlyTotal,
      monthlyTotalAfterTax: monthlyTotal - taxReductionYear / 12,
      taxReductionYear,
      firstYearInterest,
    }
  })
}

export const DEFAULT_GROWTH_PCT = 4.5

interface ScbResponse {
  data: { key: string[]; values: string[] }[]
}

export const fetchScbGrowthPct = async (): Promise<number | null> => {
  try {
    const res = await fetch(
      'https://api.scb.se/OV0104/v1/doris/sv/ssd/BO/BO0501/BO0501A/FastpiPSRegAr',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: [
            { code: 'Region', selection: { filter: 'item', values: ['00'] } },
          ],
          response: { format: 'json' },
        }),
      },
    )
    if (!res.ok) return null
    const json = (await res.json()) as ScbResponse
    const rows = json.data
    if (!rows || rows.length < 2) return null
    const latest = parseFloat(rows[rows.length - 1].values[0])
    const prior = parseFloat(rows[rows.length - 2].values[0])
    if (!Number.isFinite(latest) || !Number.isFinite(prior) || prior <= 0) return null
    const pct = ((latest - prior) / prior) * 100
    return Math.round(pct * 100) / 100
  } catch {
    return null
  }
}
