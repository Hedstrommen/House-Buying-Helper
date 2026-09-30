import { useMemo, useState } from 'react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {
  calculate,
  calculateRateScenarios,
  DEFAULT_GROWTH_PCT,
  fetchScbGrowthPct,
  type LoanInput,
} from './calc'
import { translations, type Lang } from './i18n'
import './App.css'

const formatSek = (n: number): string =>
  new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 0 }).format(Math.round(n)) + ' kr'

const formatPct = (n: number): string => n.toFixed(2) + '%'


const diffClass = (n: number): string => (n > 0 ? 'neg' : n < 0 ? 'pos' : '')

const formatSigned = (n: number): string =>
  (n > 0 ? '+' : '') + formatSek(n).replace(' kr', '')

interface ScbState {
  fetching: boolean
  value: number | null
  failed: boolean
}

function App() {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem('hbh-lang')
    return saved === 'sv' || saved === 'en' ? saved : 'sv'
  })
  const t = translations[lang]

  const [housePrice, setHousePrice] = useState(3500000)
  const [downPaymentPct, setDownPaymentPct] = useState(15)
  const [interestRates, setInterestRates] = useState<[number, number, number]>([3.5, 4.5, 5.5])
  const [loanTermYears, setLoanTermYears] = useState(30)
  const [propertyType, setPropertyType] = useState<'house' | 'apartment'>('house')
  const [monthlyFee, setMonthlyFee] = useState(0)
  const [monthlyCosts, setMonthlyCosts] = useState(1500)
  const [currentMonthlyCosts, setCurrentMonthlyCosts] = useState(12000)
  const [currentCostGrowthPct, setCurrentCostGrowthPct] = useState(2)
  const [valueGrowthPct, setValueGrowthPct] = useState(DEFAULT_GROWTH_PCT)
  const [numberOfOwners, setNumberOfOwners] = useState(2)
  const [otherCapitalIncome, setOtherCapitalIncome] = useState(0)
  const [scb, setScb] = useState<ScbState>({ fetching: false, value: null, failed: false })
  const [selectedYear, setSelectedYear] = useState(1)

  const input: LoanInput = useMemo(
    () => ({
      housePrice,
      downPaymentPct,
      interestRates,
      loanTermYears,
      propertyType,
      monthlyFee,
      monthlyCosts,
      currentMonthlyCosts,
      currentCostGrowthPct,
      valueGrowthPct,
      numberOfOwners,
      otherCapitalIncome,
    }),
    [housePrice, downPaymentPct, interestRates, loanTermYears, propertyType, monthlyFee, monthlyCosts, currentMonthlyCosts, currentCostGrowthPct, valueGrowthPct, numberOfOwners, otherCapitalIncome],
  )

  const result = useMemo(() => calculate(input), [input])
  const scenarios = useMemo(() => calculateRateScenarios(input), [input])
  const firstYear = result.years[1] ?? result.years[0]
  const selectedYearRow = result.years[Math.min(selectedYear, result.years.length - 1)]

  const loanToValue = housePrice > 0 ? (result.loanAmount / housePrice) * 100 : 0

  const fetchScb = async () => {
    setScb({ fetching: true, value: null, failed: false })
    const pct = await fetchScbGrowthPct()
    if (pct === null) {
      setScb({ fetching: false, value: null, failed: true })
    } else {
      setScb({ fetching: false, value: pct, failed: false })
      setValueGrowthPct(pct)
    }
  }

  const switchLang = (l: Lang) => {
    setLang(l)
    localStorage.setItem('hbh-lang', l)
  }

  const chartData = result.years.map((y) => ({
    year: y.year,
    houseValue: Math.round(y.houseValue),
    loanBalance: Math.round(y.loanBalance),
    houseValue2: Math.round(y.houseValue),
    monthlyCost: Math.round(y.monthlyCostTotal),
    monthlyCostAfterTax: Math.round(y.monthlyCostAfterTax),
    difference: Math.round(y.monthlyDifference),
    currentCost: Math.round(y.currentCostAtYear),
    interestCost: Math.round(y.interestCost),
    interestAfterTax: Math.round(y.interestAfterTax),
  }))

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>{t.appName}</h1>
          <p className="tagline">{t.tagline}</p>
        </div>
        <div className="lang-switch">
          <button className={lang === 'sv' ? 'active' : ''} onClick={() => switchLang('sv')}>Svenska</button>
          <button className={lang === 'en' ? 'active' : ''} onClick={() => switchLang('en')}>English</button>
        </div>
      </header>

      <section className="inputs">
        <div className="field">
          <label>{t.housePrice}</label>
          <input type="number" value={housePrice} min={0} step={50000}
            onChange={(e) => setHousePrice(Math.max(Number(e.target.value), 0))} />
        </div>

        <div className="field">
          <label>{t.downPaymentPct}</label>
          <input type="number" value={downPaymentPct} min={0} max={100} step={0.5}
            onChange={(e) => setDownPaymentPct(Math.min(Math.max(Number(e.target.value), 0), 100))} />
          <p className="hint">{t.downPaymentAmount}: <strong>{formatSek(result.downPayment)}</strong></p>
          <p className="hint">{t.loanAmount}: <strong>{formatSek(result.loanAmount)}</strong></p>
          <p className="hint">{t.loanToValue}: <strong>{formatPct(loanToValue)}</strong></p>
          {downPaymentPct < 15 && <p className="warning">{t.loanToValueWarning}</p>}
        </div>

        <div className="field">
          <label>{t.loanTerm}</label>
          <input type="number" value={loanTermYears} min={1} max={50}
            onChange={(e) => setLoanTermYears(Math.min(Math.max(Number(e.target.value), 1), 50))} />
        </div>

        <div className="field">
          <label>{t.propertyType}</label>
          <div className="segmented">
            <button className={propertyType === 'house' ? 'active' : ''} onClick={() => setPropertyType('house')}>{t.house}</button>
            <button className={propertyType === 'apartment' ? 'active' : ''} onClick={() => setPropertyType('apartment')}>{t.apartment}</button>
          </div>
        </div>

        {propertyType === 'apartment' && (
          <div className="field">
            <label>{t.monthlyFee}</label>
            <input type="number" value={monthlyFee} min={0} step={100}
              onChange={(e) => setMonthlyFee(Math.max(Number(e.target.value), 0))} />
          </div>
        )}

        <div className="field">
          <label>{t.monthlyCosts}</label>
          <input type="number" value={monthlyCosts} min={0} step={100}
            onChange={(e) => setMonthlyCosts(Math.max(Number(e.target.value), 0))} />
        </div>

        <div className="field">
          <label>{t.currentMonthlyCosts}</label>
          <input type="number" value={currentMonthlyCosts} min={0} step={500}
            onChange={(e) => setCurrentMonthlyCosts(Math.max(Number(e.target.value), 0))} />
          <p className="hint">{t.currentMonthlyCostsHelp}</p>
        </div>

        <div className="field">
          <label>{t.currentCostGrowth}</label>
          <input type="number" value={currentCostGrowthPct} step={0.1}
            onChange={(e) => setCurrentCostGrowthPct(Number(e.target.value))} />
          <p className="hint">{t.currentCostGrowthHelp}</p>
        </div>

        <div className="field">
          <label>{t.interestRates}</label>
          {interestRates.map((rate, i) => (
            <div key={i} className="inline-field">
              <span>{t.rate} {i + 1}</span>
              <input type="number" value={rate} min={0} max={25} step={0.1}
                onChange={(e) => {
                  const next = [...interestRates] as [number, number, number]
                  next[i] = Math.min(Math.max(Number(e.target.value), 0), 25)
                  setInterestRates(next)
                }} />
            </div>
          ))}
        </div>

        <div className="field">
          <label>{t.valueGrowth}</label>
          <input type="number" value={valueGrowthPct} step={0.1}
            onChange={(e) => setValueGrowthPct(Number(e.target.value))} />
          <p className="hint">{t.valueGrowthHelp}</p>
          <button className="scb-btn" onClick={fetchScb} disabled={scb.fetching}>
            {scb.fetching ? t.scbFetching : t.useScb}
          </button>
          {scb.failed && <p className="warning">{t.scbFailed}</p>}
          {scb.value !== null && <p className="hint scb-ok">{t.scbUpdated}: {formatPct(scb.value)}</p>}
        </div>

        <div className="field">
          <label>{t.numberOfOwners}</label>
          <input type="number" value={numberOfOwners} min={1} max={4}
            onChange={(e) => setNumberOfOwners(Math.min(Math.max(Number(e.target.value), 1), 4))} />
          <p className="hint">{t.numberOfOwnersHelp}</p>
        </div>

        <div className="field">
          <label>{t.otherCapitalIncome}</label>
          <input type="number" value={otherCapitalIncome} min={0} step={1000}
            onChange={(e) => setOtherCapitalIncome(Math.max(Number(e.target.value), 0))} />
          <p className="hint">{t.otherCapitalIncomeHelp}</p>
        </div>
      </section>

      <section className="summary-cards">
        <div className="card">
          <span className="card-label">{t.loanAmount}</span>
          <span className="card-value">{formatSek(result.loanAmount)}</span>
        </div>
        <div className="card">
          <span className="card-label">{t.monthlyCostTotal}</span>
          <span className="card-value">{formatSek(firstYear.monthlyCostTotal)}{t.perMonth}</span>
        </div>
        <div className="card">
          <span className="card-label">{t.monthlyCostAfterTax}</span>
          <span className="card-value">{formatSek(firstYear.monthlyCostAfterTax)}{t.perMonth}</span>
        </div>
        <div className="card">
          <span className="card-label">{t.netIfSold}</span>
          <span className="card-value">{formatSek(firstYear.netIfSold)}</span>
        </div>
      </section>

      <section className={`difference-box ${selectedYearRow.monthlyDifference < 0 ? 'difference-cheaper' : 'difference-expensive'}`}>
        <span className="difference-label">{t.compareWithToday} · {t.year} {selectedYearRow.year}</span>
        <span className={`difference-value ${diffClass(selectedYearRow.monthlyDifference)}`}>
          {formatSigned(selectedYearRow.monthlyDifference)} kr{t.perMonth}
        </span>
        <span className="difference-sub">
          {t.currentMonthlyCosts}: {formatSek(selectedYearRow.currentCostAtYear)} → {formatSek(selectedYearRow.monthlyCostAfterTax)} · {selectedYearRow.monthlyDifference < 0 ? t.cheaper : t.moreExpensive}
        </span>
        <input
          className="year-slider"
          type="range"
          min={0}
          max={result.years.length - 1}
          value={selectedYearRow.year}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        />
        <div className="slider-labels">
          <span>0 {t.years}</span>
          <span>{result.years.length - 1} {t.years}</span>
        </div>
      </section>

      <section className="scenarios">
        <h2>{t.scenarioComparison}</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t.rate}</th>
                <th>{t.monthlyPayment}</th>
                <th>{t.monthlyInterest}</th>
                <th>{t.monthlyAmortization}</th>
                <th>{t.monthlyTotal}</th>
                <th>{t.monthlyTotalAfterTax}</th>
                <th>{t.taxReduction}</th>
              </tr>
            </thead>
            <tbody>
              {scenarios.map((s, i) => (
                <tr key={i}>
                  <td>{formatPct(s.rate)}</td>
                  <td>{formatSek(s.monthlyPayment)}</td>
                  <td>{formatSek(s.monthlyInterest)}</td>
                  <td>{formatSek(s.monthlyAmortization)}</td>
                  <td>{formatSek(s.monthlyTotal)}</td>
                  <td className="pos">{formatSek(s.monthlyTotalAfterTax)}</td>
                  <td className="pos">{formatSek(s.taxReductionYear)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="charts">
        <h2>{t.yearlyDevelopment}</h2>

        <h3>{t.chartHouseValue}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
            <Tooltip formatter={(v) => formatSek(Number(v))} />
            <Legend />
            <Line type="monotone" dataKey="houseValue" name={t.houseValue} stroke="#2563eb" dot={false} />
          </LineChart>
        </ResponsiveContainer>

        <h3>{t.chartLoanEquity}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
            <Tooltip formatter={(v) => formatSek(Number(v))} />
            <Legend />
            <Area type="monotone" dataKey="loanBalance" name={t.loanBalance} stroke="#dc2626" fill="#dc262633" />
            <Area type="monotone" dataKey="houseValue2" name={t.houseValue} stroke="#2563eb" fill="#2563eb33" />
          </AreaChart>
        </ResponsiveContainer>

        <h3>{t.chartMonthlyCost}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
            <Tooltip formatter={(v) => formatSek(Number(v))} />
            <Legend />
            <Line type="monotone" dataKey="monthlyCost" name={t.monthlyCostTotal} stroke="#2563eb" dot={false} />
            <Line type="monotone" dataKey="monthlyCostAfterTax" name={t.monthlyCostAfterTax} stroke="#16a34a" dot={false} />
            {currentMonthlyCosts > 0 && (
              <Line type="monotone" dataKey="currentCost" name={t.currentMonthlyCosts} stroke="#9333ea" strokeDasharray="6 4" dot={false} />
            )}
            <Line type="monotone" dataKey="difference" name={t.differenceColumn} stroke="#f59e0b" dot={false} />
          </LineChart>
        </ResponsiveContainer>

        <h3>{t.chartInterest}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
            <Tooltip formatter={(v) => formatSek(Number(v))} />
            <Legend />
            <Line type="monotone" dataKey="interestCost" name={t.interestCost} stroke="#dc2626" dot={false} />
            <Line type="monotone" dataKey="interestAfterTax" name={t.interestAfterTax} stroke="#f59e0b" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </section>

      <section className="table-section">
        <h2>{t.yearlyDevelopment}</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t.year}</th>
                <th>{t.houseValue}</th>
                <th>{t.loanBalance}</th>
                <th>{t.amortizationYear}</th>
                <th>{t.interestCost}</th>
                <th>{t.interestAfterTax}</th>
                <th>{t.monthlyCostTotal}</th>
                <th>{t.monthlyCostAfterTax}</th>
                <th>{t.differenceColumn}</th>
                <th>{t.netIfSold}</th>
              </tr>
            </thead>
            <tbody>
              {result.years.map((y) => (
                <tr key={y.year}>
                  <td>{y.year}</td>
                  <td>{formatSek(y.houseValue)}</td>
                  <td>{formatSek(y.loanBalance)}</td>
                  <td>{formatSek(y.amortizationTotal)}</td>
                  <td>{formatSek(y.interestCost)}</td>
                  <td>{formatSek(y.interestAfterTax)}</td>
                  <td>{formatSek(y.monthlyCostTotal)}</td>
                  <td>{formatSek(y.monthlyCostAfterTax)}</td>
                  <td className={diffClass(y.monthlyDifference)}>{formatSigned(y.monthlyDifference)}</td>
                  <td>{formatSek(y.netIfSold)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="footer">{t.disclaimer}</footer>
    </div>
  )
}

export default App
