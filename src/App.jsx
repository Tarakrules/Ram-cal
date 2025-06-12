import React, { useState, useEffect } from 'react';
import { ChevronsUpDown, Calculator, PieChart as PieChartIcon, Table, Percent, Banknote, Calendar, Coins } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
const toIndianWords = (numStr) => {
    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const s = numStr.toString();
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

// New component for amount inputs with word display
const AmountInput = ({ label, id, value, onChange, placeholder, icon: Icon }) => {
    const [words, setWords] = useState('');

    const handleChange = (e) => {
        const numValue = e.target.value;
        onChange(e); // Pass the event up to the parent component
        const parsedNum = parseInt(numValue.replace(/,/g, ''), 10);
        if (!isNaN(parsedNum) && numValue.length > 0 && numValue.length < 16) {
            setWords(toIndianWords(parsedNum));
        } else {
            setWords('');
        }
    };
    
    return (
        <div>
            <InputField label={label} id={id} value={value} onChange={handleChange} placeholder={placeholder} icon={Icon} />
            {words && 
                <p className="text-right text-xs font-semibold text-indigo-600 pt-1 pr-1 h-4">
                    {words}
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
            <button
                key={key}
                onClick={() => onSelect(key)}
                className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors duration-300 ${selected === key ? 'bg-white text-indigo-600 shadow' : 'bg-transparent text-gray-600'}`}
            >
                {value}
            </button>
        ))}
    </div>
);

const ResultCard = ({ label, value, isHighlighted = false }) => (
    <div className={`p-4 rounded-lg ${isHighlighted ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg' : 'bg-indigo-50'}`}>
        <p className="text-sm opacity-90">{label}</p>
        <p className={`text-2xl font-bold ${isHighlighted ? 'text-white' : 'text-indigo-800'}`}>{value}</p>
    </div>
);

// --- Combined Interest Calculator ---
const InterestCalculator = () => {
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
        setMode(newMode);
        setResults(null);
        setError('');
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const p = parseFloat(principal), r = parseFloat(rate), t = parseFloat(tenure);
        if (isNaN(p) || p <= 0 || isNaN(r) || r < 0 || isNaN(t) || t <= 0) {
            setError('Please enter valid, positive numbers for all fields.');
            setResults(null);
            return;
        }
        setError('');

        if (mode === 'SIMPLE') {
            let annualRate, totalInterest;
            let tenureInYears;
            switch(tenureType) {
                case 'Months':
                    tenureInYears = t / 12;
                    break;
                case 'Days':
                    tenureInYears = t / 365;
                    break;
                default: // 'Years'
                    tenureInYears = t;
            }
            
            if (interestType === '%') {
                annualRate = r;
                totalInterest = (p * annualRate * tenureInYears) / 100;
            } else {
                const tenureInMonths = tenureInYears * 12;
                annualRate = r * 12;
                totalInterest = (p * r * tenureInMonths) / 100;
            }
            setResults({ mode: 'SIMPLE', principal: p, totalInterest, totalAmount: p + totalInterest });
        } else { // COMPOUND
            const n = parseFloat(frequency);
            const annualRate = interestType === '%' ? r : r * 12;
            const totalAmount = p * Math.pow((1 + (annualRate / 100) / n), n * t);
            const totalInterest = totalAmount - p;
            setResults({ mode: 'COMPOUND', principal: p, totalInterest, totalAmount });
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/60 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-md border border-gray-200">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <ToggleButton options={{'SIMPLE': 'Simple Interest', 'COMPOUND': 'Compound Interest'}} selected={mode} onSelect={handleModeChange}/>
                    <AmountInput label="Principal Amount" id="i-principal" value={principal} onChange={(e) => setPrincipal(e.target.value)} placeholder="e.g., 100000" icon={Banknote}/>
                    
                    <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2">
                           <InputField label={interestType === '%' ? 'Annual Interest Rate (%)' : 'Interest (₹ per 100/mo)'} id="si-interest" value={rate} onChange={(e) => setRate(e.target.value)} placeholder={interestType === '%' ? 'e.g., 8.5' : 'e.g., 1.5'} icon={Percent}/>
                        </div>
                         <div className="col-span-1"><CustomSelect label="Type" value={interestType} onChange={setInterestType} options={{ '%': '%', '₹': '₹' }} /></div>
                    </div>

                    {mode === 'SIMPLE' ? (
                         <div className="grid grid-cols-3 gap-3">
                            <div className="col-span-2"><InputField label="Tenure" id="si-tenure" value={tenure} onChange={(e) => setTenure(e.target.value)} placeholder="e.g., 5" icon={Calendar}/></div>
                            <div className="col-span-1"><CustomSelect label="Unit" value={tenureType} onChange={setTenureType} options={{'Years':'Years', 'Months':'Months', 'Days': 'Daily'}} /></div>
                        </div>
                    ) : (
                        <>
                            <InputField label="Tenure (in Years)" id="ci-tenure" value={tenure} onChange={(e) => setTenure(e.target.value)} placeholder="e.g., 10" icon={Calendar}/>
                            <CustomSelect label="Compounding Frequency" value={frequency} onChange={setFrequency} options={compoundingFrequencies} />
                        </>
                    )}
                    
                    <button type="submit" className="w-full flex items-center justify-center bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition shadow-md"><Calculator className="h-5 w-5 mr-2" /> Calculate</button>
                </form>
            </div>
            <div className="bg-white/60 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-md border border-gray-200 flex flex-col">
                <h3 className="text-2xl font-semibold text-gray-700 mb-6 flex-shrink-0">{mode === 'SIMPLE' ? 'Simple Interest Summary' : 'Compound Interest Summary'}</h3>
                <div className="flex-grow flex items-center justify-center">
                    {error && <div className="text-center bg-red-50 text-red-700 p-4 rounded-lg w-full"><p>{error}</p></div>}
                    {results && !error && (
                        <div className="space-y-4 w-full">
                            <ResultCard label="Principal Amount" value={formatCurrency(results.principal)} />
                            <ResultCard label={mode === 'SIMPLE' ? "Total Interest Payable" : "Total Interest Earned"} value={formatCurrency(results.totalInterest)} />
                            <ResultCard label={mode === 'SIMPLE' ? "Total Amount Payable" : "Maturity Amount"} value={formatCurrency(results.totalAmount)} isHighlighted={true} />
                        </div>
                    )}
                    {!results && !error && <div className="text-center bg-gray-50 text-gray-500 p-4 rounded-lg w-full"><p>Enter details to calculate.</p></div>}
                </div>
            </div>
        </div>
    );
};

// --- EMI Calculator ---
const EMICalculator = () => {
    const [principal, setPrincipal] = useState('');
    const [rate, setRate] = useState('');
    const [tenure, setTenure] = useState('');
    const [tenureType, setTenureType] = useState('Years');
    const [error, setError] = useState('');
    const [results, setResults] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const p = parseFloat(principal), r = parseFloat(rate), t = parseFloat(tenure);
        if (isNaN(p) || p <= 0 || isNaN(r) || r < 0 || isNaN(t) || t <= 0) {
            setError('Please enter valid, positive numbers for all fields.'); setResults(null); return;
        }
        setError('');
        const monthlyRate = r / 12 / 100;
        const tenureInMonths = tenureType === 'Years' ? t * 12 : t;
        let emi = monthlyRate === 0 ? p / tenureInMonths : p * monthlyRate * Math.pow(1 + monthlyRate, tenureInMonths) / (Math.pow(1 + monthlyRate, tenureInMonths) - 1);
        const totalAmount = emi * tenureInMonths;
        const totalInterest = totalAmount - p;
        let remainingBalance = p;
        const schedule = Array.from({ length: tenureInMonths }, (_, i) => {
            const interestPaid = remainingBalance * monthlyRate;
            const principalPaid = emi - interestPaid;
            remainingBalance -= principalPaid;
            return { month: i + 1, principalPaid, interestPaid, emi, remainingBalance: Math.max(0, remainingBalance) };
        });
        setResults({ principal: p, emi, totalAmount, totalInterest, schedule });
    };

    const LoanPieChart = ({ principal, interest }) => (
        <div className="mt-6"><h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center"><PieChartIcon className="h-5 w-5 mr-2 text-indigo-500"/>Loan Breakdown</h3>
            <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie data={[{ name: 'Principal', value: principal }, { name: 'Total Interest', value: interest }]} cx="50%" cy="50%" outerRadius={80} dataKey="value" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                            <Cell fill={COLORS[0]} /><Cell fill={COLORS[1]} />
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
    
    const AmortizationTable = ({ schedule }) => (
        <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center"><Table className="h-5 w-5 mr-2 text-indigo-500"/>Amortization Schedule</h3>
            <div className="h-64 overflow-auto border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50 sticky top-0"><tr>
                        <th className="px-4 py-2 text-left font-medium text-gray-600">Month</th><th className="px-4 py-2 text-left font-medium text-gray-600">Principal</th>
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
                <h3 className="text-2xl font-semibold text-gray-700 mb-6">EMI Details</h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <AmountInput label="Loan Amount" id="emi-principal" value={principal} onChange={(e) => setPrincipal(e.target.value)} placeholder="e.g., 500000" icon={Banknote}/>
                    <InputField label="Annual Interest Rate (%)" id="emi-rate" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="e.g., 9.5" icon={Percent}/>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2"><InputField label="Tenure" id="emi-tenure" value={tenure} onChange={(e) => setTenure(e.target.value)} placeholder="e.g., 20" icon={Calendar}/></div>
                        <div className="col-span-1"><CustomSelect label="Unit" value={tenureType} onChange={setTenureType} options={{'Years':'Years', 'Months':'Months'}}/></div>
                    </div>
                    <button type="submit" className="w-full flex items-center justify-center bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition shadow-md"><Calculator className="h-5 w-5 mr-2" /> Calculate EMI</button>
                </form>
            </div>
            <div className="lg:col-span-3 bg-white/60 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-md border border-gray-200 flex flex-col">
                <h3 className="text-2xl font-semibold text-gray-700 mb-6 flex-shrink-0">Summary & Schedule</h3>
                <div className="flex-grow">
                    {error && <div className="flex items-center justify-center h-full bg-red-50 text-red-700 p-4 rounded-lg"><p>{error}</p></div>}
                    {results && !error && (
                        <div className="space-y-4">
                            <ResultCard label="Monthly EMI" value={formatCurrency(results.emi)} isHighlighted={true} />
                            <ResultCard label="Total Interest Payable" value={formatCurrency(results.totalInterest)} />
                            <ResultCard label="Total Amount Payable" value={formatCurrency(results.totalAmount)} />
                            <LoanPieChart principal={results.principal} interest={results.totalInterest} />
                            <AmortizationTable schedule={results.schedule} />
                        </div>
                    )}
                    {!results && !error && <div className="flex items-center justify-center h-full bg-gray-50 text-gray-500 p-4 rounded-lg"><p>Enter details to calculate.</p></div>}
                </div>
            </div>
        </div>
    );
};

// --- Chit Fund Calculator ---
const ChitFundCalculator = () => {
    const [chitValue, setChitValue] = useState('');
    const [members, setMembers] = useState('');
    const [commission, setCommission] = useState('5');
    const [bidDiscount, setBidDiscount] = useState('');
    const [error, setError] = useState('');
    const [results, setResults] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const cv = parseFloat(chitValue), m = parseInt(members), c = parseFloat(commission), bd = parseFloat(bidDiscount);
        if (isNaN(cv) || cv <= 0 || isNaN(m) || m <= 0 || isNaN(c) || c < 0 || c > 100 || isNaN(bd) || bd < 0 || bd > 40 ) {
            setError('Please enter valid numbers. Commission (0-100), Bid Discount (0-40).'); setResults(null); return;
        }
        if (m !== Math.round(m)) { setError('Number of members must be a whole number.'); setResults(null); return; }
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
        setResults({ baseInstallment, foremanCommission, netBidAmountReceived, totalDividend, dividendPerMember, monthlyInstallment, totalPaidOverLife, profitLoss });
    };

    const CalculationStep = ({ title, value, isFinal = false }) => (
        <div className={`flex justify-between items-center py-2 ${isFinal ? 'font-bold text-indigo-700' : ''}`}>
            <span className="text-gray-600">{title}</span><span className="text-gray-900">{value}</span>
        </div>
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/60 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-md border border-gray-200">
                <h3 className="text-2xl font-semibold text-gray-700 mb-6">Chit Fund Details</h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <AmountInput label="Total Chit Amount (Pot)" id="cf-value" value={chitValue} onChange={(e) => setChitValue(e.target.value)} placeholder="e.g., 100000" icon={Banknote}/>
                    <InputField label="Number of Members (Duration in Months)" id="cf-members" value={members} onChange={(e) => setMembers(e.target.value)} placeholder="e.g., 20" icon={Calendar}/>
                    <InputField label="Foreman's Commission (%)" id="cf-commission" value={commission} onChange={(e) => setCommission(e.target.value)} placeholder="Standard is 5%" icon={Percent}/>
                    <InputField label="Your Auction Bid Discount (%)" id="cf-bid" value={bidDiscount} onChange={(e) => setBidDiscount(e.target.value)} placeholder="e.g., 30 (Max is 40%)" icon={Percent}/>
                    <button type="submit" className="w-full flex items-center justify-center bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition shadow-md"><Calculator className="h-5 w-5 mr-2" /> Calculate</button>
                </form>
            </div>
            <div className="bg-white/60 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-md border border-gray-200 flex flex-col">
                <h3 className="text-2xl font-semibold text-gray-700 mb-6 flex-shrink-0">Illustrative Scenario Breakdown</h3>
                <div className="flex-grow flex items-center justify-center">
                    {error && <div className="text-center bg-red-50 text-red-700 p-4 rounded-lg w-full"><p>{error}</p></div>}
                    {results && !error && (
                        <div className="space-y-4 w-full">
                            <div className="p-4 bg-gray-50 rounded-lg"><CalculationStep title="1. Base Monthly Installment" value={formatCurrency(results.baseInstallment)} /><div className="text-xs text-gray-500 pl-4 mb-2">(Total Amount / Members)</div><CalculationStep title="(-) Your Dividend Share" value={formatCurrency(results.dividendPerMember)} /><div className="text-xs text-gray-500 pl-4 mb-2">(Derived from the winner's bid discount)</div><hr className="my-2 border-dashed"/><CalculationStep title="(=) Est. Monthly Payment" value={formatCurrency(results.monthlyInstallment)} isFinal={true} /></div>
                            <div className="p-4 bg-blue-50 rounded-lg"><h4 className="font-semibold text-blue-800 mb-2">If you are the Bid Winner:</h4><CalculationStep title="Amount you receive" value={formatCurrency(results.netBidAmountReceived)} /><CalculationStep title="Total you'll pay over chit life" value={formatCurrency(results.totalPaidOverLife)} /><hr className="my-2 border-dashed"/><CalculationStep title="Your effective Profit/Loss" value={formatCurrency(results.profitLoss)} isFinal={true}/></div>
                            <p className="text-xs text-gray-500 mt-4"><strong>Note:</strong> This is an illustration for one specific auction. The dividend and your monthly payment will change every month based on that month's winning bid.</p>
                        </div>
                    )}
                    {!results && !error && <div className="text-center bg-gray-50 text-gray-500 p-4 rounded-lg w-full"><p>Enter details for an estimate.</p></div>}
                </div>
            </div>
        </div>
    );
};

// --- Main App Component ---
export default function App() {
    const TABS = {
        INTEREST: { name: 'Interest Calculator', component: InterestCalculator, icon: Coins },
        CHIT: { name: 'Chit Fund', component: ChitFundCalculator, icon: Banknote },
        EMI: { name: 'EMI Calculator', component: EMICalculator, icon: Table },
    };
    const [activeTab, setActiveTab] = useState('INTEREST');
    const ActiveComponent = TABS[activeTab].component;

    return (
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen p-4 sm:p-6 font-sans">
            <header className="text-center mb-6">
                <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 py-2">Financial Calculator Suite</h1>
                <p className="text-md text-gray-600 mt-2">Your all-in-one tool for financial calculations.</p>
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
                    <ActiveComponent />
                </div>
            </div>
        </div>
    );
}
