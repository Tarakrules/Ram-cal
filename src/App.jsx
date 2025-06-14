import React, { useState, useEffect } from 'react';
import { ChevronsUpDown, Calculator, PieChart as PieChartIcon, Table, Percent, Banknote, Calendar, Coins, LineChart as LineChartIcon, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

// --- Translation Data ---
const translations = {
    en: {
        suiteTitle: "Financial Calculator Suite",
        suiteDescription: "Your all-in-one tool for financial calculations.",
        interestTab: "Interest",
        sipTab: "SIP",
        chitTab: "Chit Fund",
        emiTab: "EMI",
        calculate: "Calculate",
        rupeesOnly: "Rupees Only",
        // Interest Calculator
        interestCalcTitle: "Interest Calculator",
        simpleInterest: "Simple Interest",
        compoundInterest: "Compound Interest",
        principalAmount: "Principal Amount",
        principalPlaceholder: "e.g., 100000",
        rateLabelPercent: "Annual Interest Rate (%)",
        rateLabelRupees: "Interest (₹ per 100/mo)",
        ratePlaceholderPercent: "e.g., 8.5",
        ratePlaceholderRupees: "e.g., 1.5",
        tenure: "Tenure",
        tenureUnit: "Unit",
        tenurePlaceholder: "e.g., 5",
        compoundingFrequency: "Compounding Frequency",
        summaryTitleSimple: "Simple Interest Summary",
        summaryTitleCompound: "Compound Interest Summary",
        totalInterestPayable: "Total Interest Payable",
        totalInterestEarned: "Total Interest Earned",
        totalAmountPayable: "Total Amount Payable",
        maturityAmount: "Maturity Amount",
        // Chit Fund
        chitTitle: "Chit Fund Calculator",
        chitDetails: "Chit Fund Details",
        chitValue: "Total Chit Amount (Pot)",
        chitMembers: "Number of Members (Months)",
        chitCommission: "Foreman's Commission (%)",
        chitBid: "Your Auction Bid Discount (%)",
        chitSummary: "Illustrative Scenario Breakdown",
        chitBaseInstallment: "1. Base Monthly Installment",
        chitBaseInstallmentSub: "(Total Amount / Members)",
        chitDividendShare: "(-) Your Dividend Share",
        chitDividendShareSub: "(Derived from the winner's bid discount)",
        chitMonthlyPayment: "(=) Est. Monthly Payment",
        chitBidWinnerTitle: "If you are the Bid Winner:",
        chitAmountReceived: "Amount you receive",
        chitTotalPaid: "Total you'll pay over chit life",
        chitProfitLoss: "Your effective Profit/Loss",
        chitNote: "Note: This is an illustration for one specific auction. The dividend and your monthly payment will change every month based on that month's winning bid.",
        // EMI
        emiTitle: "EMI Calculator",
        emiDetails: "EMI Details",
        loanAmount: "Loan Amount",
        loanAmountPlaceholder: "e.g., 500000",
        emiSummary: "Summary & Schedule",
        monthlyEMI: "Monthly EMI",
        loanBreakdown: "Loan Breakdown",
        balanceReduction: "Balance Reduction Over Time",
        amortizationSchedule: "Amortization Schedule",
        principal: "Principal",
        totalInterest: "Total Interest",
        // SIP
        sipTitle: "SIP Calculator",
        sipDetails: "SIP Details",
        monthlyInvestment: "Monthly Investment",
        monthlyInvestmentPlaceholder: "e.g., 5000",
        returnRate: "Expected Return Rate (p.a. %)",
        returnRatePlaceholder: "e.g., 12",
        timePeriod: "Time Period (Years)",
        timePeriodPlaceholder: "e.g., 15",
        sipProjection: "Investment Projection",
        investedAmount: "Invested Amount",
        estimatedReturns: "Estimated Returns",
        totalValue: "Total Value",
        investmentBreakdown: "Investment Breakdown",
        invested: "Invested",
        returns: "Returns",
        // Common
        errorGeneric: "Please enter valid, positive numbers for all fields.",
        errorChit: "Please enter valid numbers. Commission (0-100), Bid Discount (0-40).",
        errorMembers: "Number of members must be a whole number.",
        enterDetails: "Enter details to calculate.",
    },
    te: {
        suiteTitle: "ఫైనాన్షియల్ కాలిక్యులేటర్ సూట్",
        suiteDescription: "మీ ఆర్థిక లెక్కల కోసం ఆల్-ఇన్-వన్ సాధనం.",
        interestTab: "వడ్డీ",
        sipTab: "SIP",
        chitTab: "చిట్ ఫండ్",
        emiTab: "EMI",
        calculate: "లెక్కించు",
        rupeesOnly: "రూపాయలు మాత్రమే",
        interestCalcTitle: "వడ్డీ కాలిక్యులేటర్",
        simpleInterest: "సాధారణ వడ్డీ",
        compoundInterest: "చక్రవడ్డీ",
        principalAmount: "అసలు మొత్తం",
        principalPlaceholder: "ఉదా., 100000",
        rateLabelPercent: "వార్షిక వడ్డీ రేటు (%)",
        rateLabelRupees: "వడ్డీ (₹ 100 కి/నెలకు)",
        ratePlaceholderPercent: "ఉదా., 8.5",
        ratePlaceholderRupees: "ఉదా., 1.5",
        tenure: "కాలపరిమితి",
        tenureUnit: "యూనిట్",
        tenurePlaceholder: "ఉదా., 5",
        compoundingFrequency: "చక్రవడ్డీ ఫ్రీక్వెన్సీ",
        summaryTitleSimple: "సాధారణ వడ్డీ సారాంశం",
        summaryTitleCompound: "చక్రవడ్డీ సారాంశం",
        totalInterestPayable: "చెల్లించవలసిన మొత్తం వడ్డీ",
        totalInterestEarned: "సంపాదించిన మొత్తం వడ్డీ",
        totalAmountPayable: "చెల్లించవలసిన మొత్తం",
        maturityAmount: "మెచ్యూరిటీ మొత్తం",
        chitTitle: "చిట్ ఫండ్ కాలిక్యులేటర్",
        chitDetails: "చిట్ ఫండ్ వివరాలు",
        chitValue: "మొత్తం చిట్ విలువ (పాట్)",
        chitMembers: "సభ్యుల సంఖ్య (నెలలు)",
        chitCommission: "ఫోర్‌మాన్ కమీషన్ (%)",
        chitBid: "మీ వేలం డిస్కౌంట్ (%)",
        chitSummary: "దృష్టాంత దృశ్యం విచ్ఛిన్నం",
        chitBaseInstallment: "1. ప్రాథమిక నెలవారీ వాయిదా",
        chitBaseInstallmentSub: "(మొత్తం విలువ / సభ్యులు)",
        chitDividendShare: "(-) మీ డివిడెండ్ వాటా",
        chitDividendShareSub: "(విజేత వేలం డిస్కౌంట్ నుండి తీసుకోబడింది)",
        chitMonthlyPayment: "(=) అంచనా నెలవారీ చెల్లింపు",
        chitBidWinnerTitle: "మీరు వేలం విజేత అయితే:",
        chitAmountReceived: "మీరు అందుకున్న మొత్తం",
        chitTotalPaid: "చిట్ జీవితకాలంలో మీరు చెల్లించే మొత్తం",
        chitProfitLoss: "మీ అంచనా లాభం / నష్టం",
        chitNote: "గమనిక: ఇది ఒక నిర్దిష్ట వేలం కోసం ఒక ఉదాహరణ మాత్రమే. డివిడెండ్ మరియు మీ నెలవారీ చెల్లింపు ప్రతి నెల గెలిచిన వేలం ఆధారంగా మారుతుంది.",
        emiTitle: "EMI కాలిక్యులేటర్",
        emiDetails: "EMI వివరాలు",
        loanAmount: "రుణ మొత్తం",
        loanAmountPlaceholder: "ఉదా., 500000",
        emiSummary: "సారాంశం & షెడ్యూల్",
        monthlyEMI: "నెలవారీ EMI",
        loanBreakdown: "రుణ విచ్ఛిన్నం",
        balanceReduction: "కాలక్రమేణా బ్యాలెన్స్ తగ్గుదల",
        amortizationSchedule: "అమోర్టైజేషన్ షెడ్యూల్",
        principal: "అసలు",
        totalInterest: "మొత్తం వడ్డీ",
        sipTitle: "SIP కాలిక్యులేటర్",
        sipDetails: "SIP వివరాలు",
        monthlyInvestment: "నెలవారీ పెట్టుబడి",
        monthlyInvestmentPlaceholder: "ఉదా., 5000",
        returnRate: "అంచనా రాబడి రేటు (వార్షిక %)",
        returnRatePlaceholder: "ఉదా., 12",
        timePeriod: "కాలపరిమితి (సంవత్సరాలు)",
        timePeriodPlaceholder: "ఉదా., 15",
        sipProjection: "పెట్టుబడి ప్రొజెక్షన్",
        investedAmount: "పెట్టుబడి పెట్టిన మొత్తం",
        estimatedReturns: "అంచనా రాబడులు",
        totalValue: "మొత్తం విలువ",
        investmentBreakdown: "పెట్టుబడి విచ్ఛిన్నం",
        invested: "పెట్టుబడి",
        returns: "రాబడులు",
        errorGeneric: "దయచేసి అన్ని ఫీల్డ్‌లలో సరైన, ధన సంఖ్యలను నమోదు చేయండి.",
        errorChit: "దయచేసి సరైన సంఖ్యలను నమోదు చేయండి. కమీషన్ (0-100), బిడ్ డిస్కౌంట్ (0-40).",
        errorMembers: "సభ్యుల సంఖ్య పూర్ణ సంఖ్య అయి ఉండాలి.",
        enterDetails: "లెక్కించడానికి వివరాలను నమోదు చేయండి.",
    }
};

// --- Helper Functions & Constants ---
const CURRENCY_SYMBOL = '₹';
const COLORS = ['#4f46e5', '#f97316']; // Indigo for Principal, Orange for Interest

// --- Formatting Helpers ---
const formatCurrency = (value) => {
    if (isNaN(value) || value === null) return `${CURRENCY_SYMBOL} 0.00`;
    return `${CURRENCY_SYMBOL} ${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatPercentage = (value) => {
    if (isNaN(value) || value === null) return `0.00 %`;
    return `${value.toFixed(2)} %`;
};

// --- Number to Words Conversion (Indian System) ---
function toIndianWords(numStr) {
    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const s = numStr.toString().split('.')[0]; // Work only with the integer part
    if (s.length > 9) return 'Overflow';
    const n = (`000000000${s}`).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return '';
    let str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || `${b[n[1][0]]} ${a[n[1][1]]}`) + 'Crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || `${b[n[2][0]]} ${a[n[2][1]]}`) + 'Lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || `${b[n[3][0]]} ${a[n[3][1]]}`) + 'Thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || `${b[n[4][0]]} ${a[n[4][1]]}`) + 'Hundred ' : '';
    str += (n[5] != 0) ? ((str !== '') ? 'and ' : '') + (a[Number(n[5])] || `${b[n[5][0]]} ${a[n[5][1]]}`) : '';
    return str.trim();
};

function toTeluguWords(numStr) {
    const s = numStr.toString().split('.')[0];
    if (s.length > 9) return 'ఓవర్‌ఫ్లో';

    const ones = ['', 'ఒకటి', 'రెండు', 'మూడు', 'నాలుగు', 'ఐదు', 'ఆరు', 'ఏడు', 'ఎనిమిది', 'తొమ్మిది'];
    const teens = ['పది', 'పదకొండు', 'పన్నెండు', 'పదమూడు', 'పద్నాలుగు', 'పదిహేను', 'పదహారు', 'పదిహేడు', 'పద్దెనిమిది', 'పంతొమ్మిది'];
    const tens = ['', '', 'ఇరవై', 'ముప్పై', 'నలభై', 'యాభై', 'అరవై', 'డెబ్బై', 'ఎనభై', 'తొంభై'];
    const powers = ['వంద', 'వెయ్యి', 'లక్ష', 'కోటి'];

    const numToWords = (n, suffix) => {
        if (n === 0) return '';
        let str = '';
        if (n > 19) {
            str += tens[Math.floor(n / 10)] + ' ' + ones[n % 10];
        } else if (n > 9) {
            str += teens[n - 10];
        } else {
            str += ones[n];
        }
        return str.trim() + ' ' + suffix + ' ';
    };

    let result = '';
    const num = parseInt(s, 10);
    if (num === 0) return 'సున్నా';
    
    result += numToWords(Math.floor(num / 10000000), powers[3]);
    result += numToWords(Math.floor((num / 100000) % 100), powers[2]);
    result += numToWords(Math.floor((num / 1000) % 100), powers[1]);
    result += numToWords(Math.floor((num / 100) % 10), powers[0]);
    result += numToWords(num % 100, '');

    return result.trim().replace(/\s+/g, ' ');
};


// --- Common UI Components ---
const InputField = ({ label, id, value, onChange, placeholder, type = "number", disabled = false, icon: Icon }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="relative">
            {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />}
            <input type={type} id={id} value={value} onChange={onChange} placeholder={placeholder} step="any" min="0" disabled={disabled}
                className={`w-full pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:bg-gray-100 ${Icon ? 'pl-10' : 'pl-3'}`} />
        </div>
    </div>
);

const AmountInput = ({ label, id, value, onChange, placeholder, icon: Icon, lang }) => {
    const formatWithCommas = (numStr) => {
        if (!numStr || typeof numStr !== 'string') return '';
        const [integerPart, decimalPart] = numStr.split('.');
        const lastThree = integerPart.slice(-3);
        const otherNumbers = integerPart.slice(0, -3);
        const formattedOtherNumbers = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
        const finalInteger = otherNumbers ? `${formattedOtherNumbers},${lastThree}` : lastThree;
        return decimalPart !== undefined ? `${finalInteger}.${decimalPart}` : finalInteger;
    };
    
    const handleChange = (e) => {
        const rawValue = e.target.value.replace(/,/g, '');
        if (/^[0-9]*\.?[0-9]*$/.test(rawValue)) {
            onChange({ target: { value: rawValue } });
        }
    };
    
    const words = value && parseInt(value.replace(/,/g, ''), 10) > 0 && value.length < 16 
        ? (lang === 'te' ? toTeluguWords(value) : toIndianWords(value)) 
        : '';

    return (
        <div>
            <InputField 
                label={label} id={id} value={formatWithCommas(value)} onChange={handleChange} 
                placeholder={placeholder} icon={Icon} type="text" 
            />
            {words && 
                <p className="text-right text-xs font-semibold text-indigo-600 pt-1 pr-1 h-4">
                    {words} {translations[lang].rupeesOnly}
                </p>
            }
        </div>
    );
};


const CustomSelect = ({ label, value, onChange, options, disabled = false }) => (
    <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <select value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled}
            className="w-full appearance-none bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm transition disabled:bg-gray-100">
            {Object.entries(options).map(([key, val]) => <option key={key} value={key}>{val}</option>)}
        </select>
        <ChevronsUpDown className="h-5 w-5 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none mt-3" />
    </div>
);

const ToggleButton = ({ options, selected, onSelect }) => (
    <div className="flex bg-gray-200 rounded-lg p-1">
        {Object.entries(options).map(([key, value]) => (
            <button key={key} onClick={() => onSelect(key)}
                className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors duration-300 ${selected === key ? 'bg-white text-indigo-600 shadow' : 'bg-transparent text-gray-600'}`}>
                {value}
            </button>
        ))}
    </div>
);

const ResultCard = ({ label, value, isHighlighted = false, words, lang }) => (
    <div>
        <div className={`p-4 rounded-lg ${isHighlighted ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg' : 'bg-indigo-50'}`}>
            <p className="text-sm opacity-90">{label}</p>
            <p className={`text-2xl font-bold ${isHighlighted ? 'text-white' : 'text-indigo-800'}`}>{value}</p>
        </div>
        {words && <p className="text-right text-xs font-semibold text-indigo-600 pt-1 pr-1 h-4">{words} {translations[lang].rupeesOnly}</p>}
    </div>
);

// --- Combined Interest Calculator ---
const InterestCalculator = ({t, lang}) => {
    const [mode, setMode] = useState('SIMPLE');
    const [principal, setPrincipal] = useState('');
    const [rate, setRate] = useState('');
    const [tenure, setTenure] = useState('');
    const [interestType, setInterestType] = useState('%');
    const [tenureType, setTenureType] = useState('Years');
    const [frequency, setFrequency] = useState('1');
    const [error, setError] = useState('');
    const [results, setResults] = useState(null);

    const compoundingFrequencies = {'12': 'Monthly', '4': 'Quarterly', '2': 'Half-Yearly', '1': 'Annually' };

    const handleModeChange = (newMode) => {
        setMode(newMode); setResults(null); setError('');
    }

    const handleSubmit = (e) => {
        e.preventDefault(); setResults(null);
        const p = parseFloat(principal), r = parseFloat(rate), t_val = parseFloat(tenure);
        if (isNaN(p) || p <= 0 || isNaN(r) || r < 0 || isNaN(t_val) || t_val <= 0) {
            setError(t.errorGeneric); return;
        }
        setError('');

        if (mode === 'SIMPLE') {
            let tenureInYears;
            switch(tenureType) {
                case 'Months': tenureInYears = t_val / 12; break;
                case 'Days': tenureInYears = t_val / 365; break;
                default: tenureInYears = t_val;
            }
            const annualRate = interestType === '%' ? r : r * 12;
            const totalInterest = (p * annualRate * tenureInYears) / 100;
            setResults({ mode: 'SIMPLE', principal: p, totalInterest, totalAmount: p + totalInterest, tenureInYears, annualRate});
        } else {
            const n = parseFloat(frequency);
            const annualRate = interestType === '%' ? r : r * 12;
            const totalAmount = p * Math.pow((1 + (annualRate / 100) / n), n * t_val);
            const totalInterest = totalAmount - p;
            setResults({ mode: 'COMPOUND', principal: p, totalInterest, totalAmount, tenureInYears: t_val, annualRate });
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/60 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-md border border-gray-200">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <ToggleButton options={{'SIMPLE': t.simpleInterest, 'COMPOUND': t.compoundInterest}} selected={mode} onSelect={handleModeChange}/>
                    <AmountInput label={t.principalAmount} id="i-principal" value={principal} onChange={(e) => setPrincipal(e.target.value)} placeholder={t.principalPlaceholder} icon={Banknote} lang={lang} />
                    
                    <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2"><InputField label={interestType === '%' ? t.rateLabelPercent : t.rateLabelRupees} id="si-interest" value={rate} onChange={(e) => setRate(e.target.value)} placeholder={interestType === '%' ? t.ratePlaceholderPercent : t.ratePlaceholderRupees} icon={Percent}/></div>
                        <div className="col-span-1"><CustomSelect label="Type" value={interestType} onChange={setInterestType} options={{ '%': '%', '₹': '₹' }} /></div>
                    </div>
                    {mode === 'SIMPLE' ? (
                         <div className="grid grid-cols-3 gap-3">
                            <div className="col-span-2"><InputField label={t.tenure} id="si-tenure" value={tenure} onChange={(e) => setTenure(e.target.value)} placeholder={t.tenurePlaceholder} icon={Calendar}/></div>
                            <div className="col-span-1"><CustomSelect label={t.tenureUnit} value={tenureType} onChange={setTenureType} options={{'Years':'Years', 'Months':'Months', 'Days': 'Days'}} /></div>
                        </div>
                    ) : ( <>
                            <InputField label={`${t.tenure} (in Years)`} id="ci-tenure" value={tenure} onChange={(e) => setTenure(e.target.value)} placeholder={t.tenurePlaceholder} icon={Calendar}/>
                            <CustomSelect label={t.compoundingFrequency} value={frequency} onChange={setFrequency} options={compoundingFrequencies} />
                        </>
                    )}
                    <button type="submit" className="w-full flex items-center justify-center bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition shadow-md"><Calculator className="h-5 w-5 mr-2" /> {t.calculate}</button>
                </form>
            </div>
            <div className="bg-white/60 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-md border border-gray-200 flex flex-col">
                <h3 className="text-2xl font-semibold text-gray-700 mb-6 flex-shrink-0">{mode === 'SIMPLE' ? t.summaryTitleSimple : t.summaryTitleCompound}</h3>
                <div className="flex-grow flex flex-col justify-center">
                    {error && <div className="text-center bg-red-50 text-red-700 p-4 rounded-lg w-full"><p>{error}</p></div>}
                    {results && !error && (
                        <div className="space-y-4 w-full">
                            <ResultCard label={t.principalAmount} value={formatCurrency(results.principal)} lang={lang}/>
                            <ResultCard label={mode === 'SIMPLE' ? t.totalInterestPayable : t.totalInterestEarned} value={formatCurrency(results.totalInterest)} lang={lang}/>
                            <ResultCard label={mode === 'SIMPLE' ? t.totalAmountPayable : t.maturityAmount} value={formatCurrency(results.totalAmount)} isHighlighted={true} words={lang === 'en' ? toIndianWords(results.totalAmount) : toTeluguWords(results.totalAmount)} lang={lang}/>
                        </div>
                    )}
                    {!results && !error && <div className="text-center bg-gray-50 text-gray-500 p-4 rounded-lg w-full"><p>{t.enterDetails}</p></div>}
                </div>
            </div>
        </div>
    );
};

// --- EMI Calculator ---
const EMICalculator = ({t, lang}) => {
    const [principal, setPrincipal] = useState('');
    const [rate, setRate] = useState('');
    const [tenure, setTenure] = useState('');
    const [tenureType, setTenureType] = useState('Years');
    const [error, setError] = useState('');
    const [results, setResults] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault(); setResults(null);
        const p = parseFloat(principal), r = parseFloat(rate), t_val = parseFloat(tenure);
        if (isNaN(p) || p <= 0 || isNaN(r) || r < 0 || isNaN(t_val) || t_val <= 0) {
            setError(t.errorGeneric); return;
        }
        setError('');
        const monthlyRate = r / 12 / 100;
        const tenureInMonths = tenureType === 'Years' ? t_val * 12 : t_val;
        let emi = monthlyRate === 0 ? p / tenureInMonths : p * monthlyRate * Math.pow(1 + monthlyRate, tenureInMonths) / (Math.pow(1 + monthlyRate, tenureInMonths) - 1);
        const totalAmount = emi * tenureInMonths;
        const totalInterest = totalAmount - p;
        let balance = p;
        const schedule = Array.from({ length: tenureInMonths }, (_, i) => {
            const interestPaid = balance * monthlyRate;
            const principalPaid = emi - interestPaid;
            balance -= principalPaid;
            return { month: i + 1, principalPaid, interestPaid, emi, remainingBalance: Math.max(0, balance) };
        });
        setResults({ principal: p, emi, totalAmount, totalInterest, schedule, rate: r, tenureInMonths });
    };

    const LoanPieChart = ({ principal, interest }) => (
        <div className="mt-6"><h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center"><PieChartIcon className="h-5 w-5 mr-2 text-indigo-500"/>{t.loanBreakdown}</h3>
            <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer><PieChart>
                    <Pie data={[{ name: t.principal, value: principal }, { name: t.totalInterest, value: interest }]} cx="50%" cy="50%" outerRadius={80} dataKey="value" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        <Cell fill={COLORS[0]} /><Cell fill={COLORS[1]} />
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} /><Legend />
                </PieChart></ResponsiveContainer>
            </div>
        </div>
    );
    
    const BalanceChart = ({ schedule }) => (
        <div className="mt-6"><h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center"><LineChartIcon className="h-5 w-5 mr-2 text-indigo-500"/>{t.balanceReduction}</h3>
             <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                    <LineChart data={schedule} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" label={{ value: 'Months', position: 'insideBottom', offset: -5 }} />
                        <YAxis tickFormatter={(tick) => formatCurrency(tick).replace(CURRENCY_SYMBOL, '')} />
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Legend />
                        <Line type="monotone" dataKey="remainingBalance" name="Remaining Balance" stroke="#8884d8" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );

    const AmortizationTable = ({ schedule }) => (
        <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center"><Table className="h-5 w-5 mr-2 text-indigo-500"/>{t.amortizationSchedule}</h3>
            <div className="h-64 overflow-auto border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50 sticky top-0"><tr>
                        <th className="px-4 py-2 text-left font-medium text-gray-600">Month</th><th className="px-4 py-2 text-left font-medium text-gray-600">{t.principal}</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-600">Interest</th><th className="px-4 py-2 text-left font-medium text-gray-600">Balance</th>
                    </tr></thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {schedule.map((row) => (<tr key={row.month}>
                            <td className="px-4 py-2">{row.month}</td><td className="px-4 py-2">{formatCurrency(row.principalPaid)}</td>
                            <td className="px-4 py-2">{formatCurrency(row.interestPaid)}</td><td className="px-4 py-2">{formatCurrency(row.remainingBalance)}</td>
                        </tr>))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 bg-white/60 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-md border border-gray-200">
                <h3 className="text-2xl font-semibold text-gray-700 mb-6">{t.emiDetails}</h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <AmountInput label={t.loanAmount} id="emi-principal" value={principal} onChange={(e) => setPrincipal(e.target.value)} placeholder={t.loanAmountPlaceholder} icon={Banknote} lang={lang}/>
                    <InputField label={t.rateLabelPercent} id="emi-rate" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="e.g., 9.5" icon={Percent}/>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2"><InputField label={t.tenure} id="emi-tenure" value={tenure} onChange={(e) => setTenure(e.target.value)} placeholder="e.g., 20" icon={Calendar}/></div>
                        <div className="col-span-1"><CustomSelect label={t.tenureUnit} value={tenureType} onChange={setTenureType} options={{'Years':'Years', 'Months':'Months'}}/></div>
                    </div>
                    <button type="submit" className="w-full flex items-center justify-center bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition shadow-md"><Calculator className="h-5 w-5 mr-2" /> {t.calculate} EMI</button>
                </form>
            </div>
            <div className="lg:col-span-3 bg-white/60 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-md border border-gray-200 flex flex-col">
                <h3 className="text-2xl font-semibold text-gray-700 mb-6 flex-shrink-0">{t.emiSummary}</h3>
                <div className="flex-grow">
                    {error && <div className="flex items-center justify-center h-full bg-red-50 text-red-700 p-4 rounded-lg"><p>{error}</p></div>}
                    {results && !error && (
                        <div className="space-y-4">
                            <ResultCard label={t.monthlyEMI} value={formatCurrency(results.emi)} isHighlighted={true} words={lang==='en' ? toIndianWords(results.emi) : toTeluguWords(results.emi)} lang={lang} />
                            <ResultCard label={t.totalInterestPayable} value={formatCurrency(results.totalInterest)} />
                            <ResultCard label={t.totalAmountPayable} value={formatCurrency(results.totalAmount)} isHighlighted words={lang==='en' ? toIndianWords(results.totalAmount) : toTeluguWords(results.totalAmount)} lang={lang}/>
                            <LoanPieChart principal={results.principal} interest={results.totalInterest} t={t} />
                            <BalanceChart schedule={results.schedule} t={t}/>
                            <AmortizationTable schedule={results.schedule} t={t}/>
                        </div>
                    )}
                    {!results && !error && <div className="flex items-center justify-center h-full bg-gray-50 text-gray-500 p-4 rounded-lg"><p>{t.enterDetails}</p></div>}
                </div>
            </div>
        </div>
    );
};


// --- Chit Fund Calculator ---
const ChitFundCalculator = ({t, lang}) => {
    const [chitValue, setChitValue] = useState('');
    const [members, setMembers] = useState('');
    const [commission, setCommission] = useState('5');
    const [bidDiscount, setBidDiscount] = useState('');
    const [error, setError] = useState('');
    const [results, setResults] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault(); setResults(null);
        const cv = parseFloat(chitValue), m = parseInt(members), c = parseFloat(commission), bd = parseFloat(bidDiscount);
        if (isNaN(cv) || cv <= 0 || isNaN(m) || m <= 0 || isNaN(c) || c < 0 || c > 100 || isNaN(bd) || bd < 0 || bd > 40 ) {
            setError(t.errorChit); return;
        }
        if (m !== Math.round(m)) { setError(t.errorMembers); return; }
        setError('');
        const baseInstallment = cv / m;
        const foremanCommission = cv * (c / 100);
        const bidAmountDiscount = cv * (bd / 100);
        const netBidAmountReceived = cv - bidAmountDiscount;
        const totalDividend = bidAmountDiscount - foremanCommission;
        const dividendPerMember = totalDividend > 0 ? totalDividend / m : 0;
        const monthlyInstallment = baseInstallment - dividendPerMember;
        const totalPaidOverLife = monthlyInstallment * m;
        const profitLoss = netBidAmountReceived - totalPaidOverLife;
        setResults({ chitValue: cv, members:m, bidDiscount:bd, baseInstallment, foremanCommission, netBidAmountReceived, totalDividend, dividendPerMember, monthlyInstallment, totalPaidOverLife, profitLoss });
    };
    
    const CalculationStep = ({ title, value, numericValue, isFinal = false }) => (
        <div>
            <div className={`flex justify-between items-center py-2 ${isFinal ? 'font-bold text-indigo-700' : ''}`}>
                <span className="text-gray-600">{title}</span><span className="text-gray-900">{value}</span>
            </div>
            {numericValue && <p className="text-right text-xs font-semibold text-indigo-600 -mt-2 pr-1 h-4">{lang==='en' ? toIndianWords(numericValue) : toTeluguWords(numericValue)} {t.rupeesOnly}</p>}
        </div>
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/60 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-md border border-gray-200">
                <h3 className="text-2xl font-semibold text-gray-700 mb-6">{t.chitDetails}</h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <AmountInput label={t.chitValue} id="cf-value" value={chitValue} onChange={(e) => setChitValue(e.target.value)} placeholder="e.g., 100000" icon={Banknote} lang={lang}/>
                    <InputField label={t.chitMembers} id="cf-members" value={members} onChange={(e) => setMembers(e.target.value)} placeholder="e.g., 20" icon={Calendar}/>
                    <InputField label={t.chitCommission} id="cf-commission" value={commission} onChange={(e) => setCommission(e.target.value)} placeholder="Standard is 5%" icon={Percent}/>
                    <InputField label={t.chitBid} id="cf-bid" value={bidDiscount} onChange={(e) => setBidDiscount(e.target.value)} placeholder="e.g., 30 (Max is 40%)" icon={Percent}/>
                    <button type="submit" className="w-full flex items-center justify-center bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition shadow-md"><Calculator className="h-5 w-5 mr-2" /> {t.calculate}</button>
                </form>
            </div>
            <div className="bg-white/60 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-md border border-gray-200 flex flex-col">
                <h3 className="text-2xl font-semibold text-gray-700 mb-6 flex-shrink-0">{t.chitSummary}</h3>
                <div className="flex-grow flex items-center justify-center">
                    {error && <div className="text-center bg-red-50 text-red-700 p-4 rounded-lg w-full"><p>{error}</p></div>}
                    {results && !error && (
                        <div className="w-full">
                           <div className="p-4 bg-gray-50 rounded-lg"><CalculationStep title={t.chitBaseInstallment} value={formatCurrency(results.baseInstallment)} /><div className="text-xs text-gray-500 pl-4 mb-2">{t.chitBaseInstallmentSub}</div><CalculationStep title={t.chitDividendShare} value={formatCurrency(results.dividendPerMember)} /><div className="text-xs text-gray-500 pl-4 mb-2">{t.chitDividendShareSub}</div><hr className="my-2 border-dashed"/><CalculationStep title={t.chitMonthlyPayment} value={formatCurrency(results.monthlyInstallment)} numericValue={results.monthlyInstallment} isFinal={true} /></div>
                            <div className="p-4 bg-blue-50 rounded-lg mt-4"><h4 className="font-semibold text-blue-800 mb-2">{t.chitBidWinnerTitle}</h4><CalculationStep title={t.chitAmountReceived} value={formatCurrency(results.netBidAmountReceived)} numericValue={results.netBidAmountReceived} /><CalculationStep title={t.chitTotalPaid} value={formatCurrency(results.totalPaidOverLife)} /><hr className="my-2 border-dashed"/><CalculationStep title={t.chitProfitLoss} value={formatCurrency(results.profitLoss)} isFinal={true}/></div>
                            <p className="text-xs text-gray-500 mt-4"><strong>Note:</strong> {t.chitNote}</p>
                        </div>
                    )}
                    {!results && !error && <div className="text-center bg-gray-50 text-gray-500 p-4 rounded-lg w-full"><p>{t.enterDetails}</p></div>}
                </div>
            </div>
        </div>
    );
};

// --- SIP Calculator ---
const SIPCalculator = ({t, lang}) => {
    const [monthlyInvestment, setMonthlyInvestment] = useState('');
    const [returnRate, setReturnRate] = useState('');
    const [timePeriod, setTimePeriod] = useState('');
    const [error, setError] = useState('');
    const [results, setResults] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault(); setResults(null);
        const p = parseFloat(monthlyInvestment);
        const r = parseFloat(returnRate);
        const t_val = parseFloat(timePeriod);

        if (isNaN(p) || p <= 0 || isNaN(r) || r < 0 || isNaN(t_val) || t_val <= 0) {
            setError(t.errorGeneric); return;
        }
        setError('');

        const n = t_val * 12; // tenure in months
        const i = r / 100 / 12; // monthly interest rate

        const totalValue = p * ( (Math.pow(1 + i, n) - 1) / i ) * (1 + i);
        const investedAmount = p * n;
        const estimatedReturns = totalValue - investedAmount;

        setResults({ investedAmount, estimatedReturns, totalValue, monthlyInvestment: p, returnRate: r, timePeriod: t_val });
    };
    
    const InvestmentPieChart = ({ invested, returns }) => (
         <div className="mt-6"><h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center"><PieChartIcon className="h-5 w-5 mr-2 text-indigo-500"/>{t.investmentBreakdown}</h3>
            <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer><PieChart>
                    <Pie data={[{ name: t.invested, value: invested }, { name: t.returns, value: returns }]} cx="50%" cy="50%" outerRadius={80} dataKey="value" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        <Cell fill={COLORS[0]} /><Cell fill={COLORS[1]} />
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} /><Legend />
                </PieChart></ResponsiveContainer>
            </div>
        </div>
    );
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/60 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-md border border-gray-200">
                <h3 className="text-2xl font-semibold text-gray-700 mb-6">{t.sipDetails}</h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <AmountInput label={t.monthlyInvestment} id="sip-investment" value={monthlyInvestment} onChange={(e) => setMonthlyInvestment(e.target.value)} placeholder={t.monthlyInvestmentPlaceholder} icon={Banknote} lang={lang}/>
                    <InputField label={t.returnRate} id="sip-rate" value={returnRate} onChange={(e) => setReturnRate(e.target.value)} placeholder={t.returnRatePlaceholder} icon={Percent} />
                    <InputField label={t.timePeriod} id="sip-tenure" value={timePeriod} onChange={(e) => setTimePeriod(e.target.value)} placeholder={t.timePeriodPlaceholder} icon={Calendar} />
                    <button type="submit" className="w-full flex items-center justify-center bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition shadow-md"><Calculator className="h-5 w-5 mr-2" /> {t.calculate} SIP</button>
                </form>
            </div>
            <div className="bg-white/60 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-md border border-gray-200 flex flex-col">
                <h3 className="text-2xl font-semibold text-gray-700 mb-6 flex-shrink-0">{t.sipProjection}</h3>
                <div className="flex-grow flex flex-col justify-center">
                    {error && <div className="text-center bg-red-50 text-red-700 p-4 rounded-lg w-full"><p>{error}</p></div>}
                    {results && !error && (
                        <>
                           <div className="space-y-4">
                               <ResultCard label={t.investedAmount} value={formatCurrency(results.investedAmount)} words={lang==='en' ? toIndianWords(results.investedAmount) : toTeluguWords(results.investedAmount)} lang={lang}/>
                               <ResultCard label={t.estimatedReturns} value={formatCurrency(results.estimatedReturns)} words={lang==='en' ? toIndianWords(results.estimatedReturns) : toTeluguWords(results.estimatedReturns)} lang={lang}/>
                               <ResultCard label={t.totalValue} value={formatCurrency(results.totalValue)} isHighlighted={true} words={lang==='en' ? toIndianWords(results.totalValue) : toTeluguWords(results.totalValue)} lang={lang}/>
                            </div>
                            <InvestmentPieChart invested={results.investedAmount} returns={results.estimatedReturns} t={t}/>
                        </>
                    )}
                    {!results && !error && <div className="text-center bg-gray-50 text-gray-500 p-4 rounded-lg w-full"><p>{t.enterDetails}</p></div>}
                </div>
            </div>
        </div>
    );
};

// --- Main App Component ---
export default function App() {
    const [lang, setLang] = useState('en');
    const t = translations[lang];

    const TABS = {
        INTEREST: { name: t.interestTab, component: InterestCalculator, icon: Coins },
        SIP: { name: t.sipTab, component: SIPCalculator, icon: TrendingUp },
        CHIT: { name: t.chitTab, component: ChitFundCalculator, icon: Banknote },
        EMI: { name: t.emiTab, component: EMICalculator, icon: Table },
    };
    const [activeTab, setActiveTab] = useState('INTEREST');
    const ActiveComponent = TABS[activeTab].component;
    
    const LanguageToggle = () => (
        <div className="absolute top-4 right-4 bg-white/70 backdrop-blur-sm p-1 rounded-full shadow-md">
            <button onClick={() => setLang('en')} className={`px-3 py-1 text-sm rounded-full ${lang === 'en' ? 'bg-indigo-600 text-white' : 'text-gray-600'}`}>EN</button>
            <button onClick={() => setLang('te')} className={`px-3 py-1 text-sm rounded-full ${lang === 'te' ? 'bg-indigo-600 text-white' : 'text-gray-600'}`}>TE</button>
        </div>
    );

    return (
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen p-4 sm:p-6 font-sans relative">
            <LanguageToggle />
            <header className="text-center mb-6 pt-8">
                <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 py-2">Ram Calculator Suite</h1>
                <p className="text-md text-gray-600 mt-2">{t.suiteDescription}</p>
            </header>

            <div className="max-w-6xl mx-auto">
                <div className="mb-8 overflow-x-auto">
                    <div className="flex border-b border-gray-200 space-x-2 sm:space-x-4">
                        {Object.entries(TABS).map(([key, { name, icon: Icon }]) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className={`flex-shrink-0 flex items-center px-3 sm:px-4 py-3 font-medium text-sm sm:text-base transition-all duration-300 border-b-4 ${
                                    activeTab === key
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <Icon className="h-5 w-5 mr-2" />
                                {name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="transition-opacity duration-300">
                    <ActiveComponent t={t} lang={lang} />
                </div>
            </div>
        </div>
    );
}
