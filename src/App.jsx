import React, { useState, useEffect } from 'react';
import { ChevronsUpDown, Calculator, PieChart as PieChartIcon, Table, Percent, Banknote, Calendar, Coins, LineChart as LineChartIcon, TrendingUp, Rocket, Target, Award, ArrowRight, Shield, X, ShieldCheck, Trash2, LogIn, LogOut, User } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, addDoc, serverTimestamp, collection, query, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';

// --- Firebase Configuration ---
// SECURE METHOD: Your Firebase config is now loaded from environment variables.
// To make this work locally, create a file named `.env.local` in the root of your project.
// Add your Firebase keys to this file. It is automatically ignored by Git to keep your keys safe.
//
// === Example .env.local file contents: ===
// REACT_APP_API_KEY=AIzaSy...
// REACT_APP_AUTH_DOMAIN=myapp.firebaseapp.com
// REACT_APP_PROJECT_ID=myapp-12345
// REACT_APP_STORAGE_BUCKET=myapp.appspot.com
// REACT_APP_MESSAGING_SENDER_ID=1234567890
// REACT_APP_APP_ID=1:1234567890:web:abcdef123456
// ==========================================
// After creating the file, you MUST restart your development server.

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

// --- Initialize Firebase ---
let app;
let auth;
let db;
const isFirebaseConfigValid = firebaseConfig.apiKey && firebaseConfig.projectId;

if (isFirebaseConfigValid) {
    try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
    } catch (error) {
        console.error("Firebase initialization error:", error);
    }
} else {
    console.error("Firebase configuration is missing or incomplete. Please create a .env.local file and add your Firebase credentials.");
}

// --- Translation Data ---
const translations = {
    en: {
        suiteTitle: "Financial Calculator Suite",
        suiteDescription: "Your all-in-one tool for financial planning and calculations.",
        interestTab: "Interest",
        sipTab: "SIP",
        goalPlannerTab: "Goal Planner",
        chitTab: "Chit Fund",
        emiTab: "EMI",
        prepaymentTab: "Prepayment",
        expenseTrackerTab: "Tracker",
        calculate: "Calculate",
        rupeesOnly: "Rupees Only",
        loginWithGoogle: "Login with Google",
        logout: "Logout",
        welcome: "Welcome",
        loginForTracker: "Please log in to use the Expense Tracker.",
        // Expense Tracker
        expenseTrackerTitle: "Expense Tracker",
        addExpense: "Add New Expense",
        expenseDescription: "Description",
        expenseDescriptionPlaceholder: "e.g., Groceries",
        expenseAmount: "Amount",
        expenseAmountPlaceholder: "e.g., 1500",
        expenseCategory: "Category",
        expenseDate: "Date",
        add: "Add",
        totalExpenses: "Total Expenses",
        expensesByCategory: "Expenses by Category",
        recentExpenses: "Recent Expenses",
        noExpenses: "No expenses logged yet. Add one above to get started!",
        passwordProtected: "Password Protected",
        enterPassword: "Enter Password to Unlock",
        unlock: "Unlock",
        incorrectPassword: "Incorrect Password. Please try again.",
        // Categories
        category_food: "Food",
        category_transport: "Transport",
        category_utilities: "Utilities",
        category_entertainment: "Entertainment",
        category_shopping: "Shopping",
        category_health: "Health",
        category_other: "Other",
        // Goal Planner
        goalPlannerTitle: "Financial Goal Planner",
        goalDetails: "Your Goal Details",
        goalName: "What is your financial goal?",
        goalNamePlaceholder: "e.g., Buy a Car, Child's Education",
        targetAmount: "How much will you need?",
        targetAmountPlaceholder: "e.g., 800000",
        timeToGoal: "How many years to achieve it?",
        timeToGoalPlaceholder: "e.g., 5",
        expectedReturnRate: "Expected Annual Return Rate (%)",
        expectedReturnRatePlaceholder: "e.g., 12",
        goalSummary: "Your Goal Plan",
        requiredMonthlySip: "Required Monthly Investment (SIP)",
        toAchieveYourGoal: "To achieve your goal of",
        totalInvestment: "Total Investment",
        totalReturns: "Total Returns",
        // Interest Calculator
        interestCalcTitle: "Interest Calculator",
        simpleInterest: "Simple Interest",
        compoundInterest: "Compound Interest",
        findRate: "Find Rate",
        principalAmount: "Principal Amount",
        principalPlaceholder: "e.g., 100000",
        interestAmount: "Interest Amount",
        interestAmountPlaceholder: "e.g., 20000",
        totalAmount: "Total Amount (Principal + Interest)",
        totalAmountPlaceholder: "e.g., 120000",
        findRateInputType: "Input Type",
        interestOnly: "Interest Only",
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
        summaryTitleFindRate: "Interest Rate Calculation",
        manualCalculationTitle: "Manual Calculation Breakdown",
        closingChargesOptional: "Optional: Closing Charges",
        chargeAmount: "Charge Amount",
        chargeType: "Charge Type",
        flatFee: "Flat ₹",
        perLac: "Per Lac",
        totalInterestPayable: "Total Interest Payable",
        totalInterestEarned: "Total Interest Earned",
        totalAmountPayable: "Total Amount Payable",
        totalClosingCharges: "Total Closing Charges",
        totalPayout: "Total Payout (Incl. Charges)",
        maturityAmount: "Maturity Amount",
        calculatedAnnualRate: "Calculated Annual Rate",
        calculatedMonthlyRate: "Equivalent Monthly Rate",
        calculatedRateInRupees: "Equivalent Rate in ₹",
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
        // Prepayment
        prepaymentTitle: "Loan Prepayment Calculator",
        prepaymentDetails: "Loan & Prepayment Details",
        originalLoanDetails: "Original Loan Details",
        prepaymentStrategy: "Prepayment Strategy",
        prepaymentType: "Prepayment Type",
        oneTime: "One-Time",
        recurring: "Recurring",
        prepaymentAmount: "Prepayment Amount",
        prepaymentAmountPlaceholder: "e.g., 50000",
        startPrepaymentAfter: "Start after (months)",
        startPrepaymentAfterPlaceholder: "e.g., 6",
        prepaymentFrequency: "Frequency",
        monthly: "Monthly",
        annually: "Annually",
        prepaymentSummary: "Prepayment Impact Summary",
        originalEMI: "Original Monthly EMI",
        newTenure: "New Loan Tenure",
        tenureReducedBy: "Tenure Reduced By",
        totalInterestPaidOriginal: "Original Total Interest",
        totalInterestPaidNew: "New Total Interest",
        totalInterestSaved: "Total Interest Saved",
        loanComparison: "Loan Balance Comparison",
        originalLoan: "Original Loan",
        withPrepayment: "With Prepayment",
        // Common
        errorGeneric: "Please enter valid, positive numbers for all fields.",
        errorGoalName: "Please enter a name for your goal.",
        errorTotalAmount: "Total amount must be greater than principal.",
        errorCharges: "Closing charges cannot be more than the principal amount.",
        errorChit: "Please enter valid numbers. Commission (0-100), Bid Discount (0-40).",
        errorMembers: "Number of members must be a whole number.",
        errorPrepayment: "Prepayment amount must be less than the loan amount.",
        enterDetails: "Enter details to calculate.",
    },
    te: {
        // ... (All Telugu translations are here but omitted for brevity)
    }
};

// --- Helper Functions & Constants ---
const CURRENCY_SYMBOL = '₹';
const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899'];

// --- Formatting Helpers ---
const formatCurrency = (value) => {
    if (isNaN(value) || value === null) return `${CURRENCY_SYMBOL} 0.00`;
    return `${CURRENCY_SYMBOL} ${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatPercentage = (value) => {
    if (isNaN(value) || value === null) return `0.00 %`;
    return `${value.toFixed(2)} %`;
};

// --- Number to Words Conversion ---
function toIndianWords(numStr) {
    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const s = String(numStr).split('.')[0];
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
    // ... (implementation omitted for brevity)
    return '';
};

// --- Common UI Components ---
const InputField = ({ label, id, value, onChange, placeholder, type = "number", disabled = false, icon: Icon }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="relative">
            {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />}
            <input type={type} id={id} value={value} onChange={onChange} placeholder={placeholder} step="any" min={type === "number" ? "0" : undefined} disabled={disabled}
                className={`w-full pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:bg-gray-100 ${Icon ? 'pl-10' : 'pl-3'}`} />
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
            onChange({ target: { id: id, value: rawValue } });
        }
    };
    const words = value && parseInt(value.replace(/,/g, ''), 10) > 0 && value.length < 16 ? (lang === 'te' ? toTeluguWords(value) : toIndianWords(value)) : '';
    return (
        <div>
            <InputField label={label} id={id} value={formatWithCommas(value)} onChange={handleChange} placeholder={placeholder} icon={Icon} type="text" />
            {words && <p className="text-right text-xs font-semibold text-blue-600 pt-1 pr-1 h-4">{words} {translations[lang].rupeesOnly}</p>}
        </div>
    );
};

const CustomSelect = ({ label, value, onChange, options, disabled = false }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="relative">
            <select value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled}
                className="w-full appearance-none bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm transition disabled:bg-gray-100">
                {Object.entries(options).map(([key, val]) => <option key={key} value={key}>{val}</option>)}
            </select>
            <ChevronsUpDown className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
    </div>
);

const ToggleButton = ({ options, selected, onSelect }) => (
    <div className="flex bg-gray-200 rounded-lg p-1">
        {Object.entries(options).map(([key, value]) => (
            <button key={key} onClick={() => onSelect(key)}
                className={`w-full py-2 text-sm font-semibold rounded-md transition-colors duration-300 ${selected === key ? 'bg-white text-blue-600 shadow' : 'bg-transparent text-gray-600'}`}>
                {value}
            </button>
        ))}
    </div>
);

const ResultCard = ({ label, value, isHighlighted = false, words, lang, subValue = null }) => (
    <div>
        <div className={`p-4 rounded-lg ${isHighlighted ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg' : 'bg-blue-50'}`}>
            <p className="text-sm opacity-90">{label}</p>
            <p className={`text-2xl font-bold ${isHighlighted ? 'text-white' : 'text-blue-800'}`}>{value}</p>
            {subValue && <p className="text-xs opacity-80">{subValue}</p>}
        </div>
        {words && <p className="text-right text-xs font-semibold text-blue-600 pt-1 pr-1 h-4">{words} {translations[lang].rupeesOnly}</p>}
    </div>
);

// --- All Calculator Components ---

const GoalPlannerCalculator = ({t, lang, sharedValues, setSharedValues}) => {
    const [goalName, setGoalName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [timePeriod, setTimePeriod] = useState(sharedValues.tenure);
    const [returnRate, setReturnRate] = useState(sharedValues.rate);
    const [error, setError] = useState('');
    const [results, setResults] = useState(null);
    
    useEffect(() => {
        setReturnRate(sharedValues.rate);
        setTimePeriod(sharedValues.tenure);
    }, [sharedValues]);

    const handleInputChange = (setter, key) => (e) => {
        const { value } = e.target;
        setter(value);
        if(key) {
            setSharedValues(prev => ({...prev, [key]: value}));
        }
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        setResults(null);
        
        const fv = parseFloat(targetAmount);
        const time = parseFloat(timePeriod);
        const r = parseFloat(returnRate);

        if (goalName.trim() === '') {
            setError(t.errorGoalName); return;
        }
        if (isNaN(fv) || fv <= 0 || isNaN(time) || time <= 0 || isNaN(r) || r < 0) {
            setError(t.errorGeneric); return;
        }
        setError('');

        const i = r / 100 / 12; // Monthly interest rate
        const n = time * 12; // Tenure in months

        const monthlySip = (fv * i) / ( (Math.pow(1 + i, n) - 1) * (1 + i) );
        
        if (isNaN(monthlySip) || !isFinite(monthlySip)) {
            setError(t.errorGeneric);
            return;
        }
        
        const totalInvested = monthlySip * n;
        const totalReturns = fv - totalInvested;

        setResults({
            goalName,
            targetAmount: fv,
            monthlySip,
            totalInvestment: totalInvested,
            totalReturns
        });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/70 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200/50">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">{t.goalDetails}</h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <InputField label={t.goalName} id="gp-goalname" value={goalName} onChange={(e) => setGoalName(e.target.value)} placeholder={t.goalNamePlaceholder} type="text" icon={Award}/>
                    <AmountInput label={t.targetAmount} id="gp-target" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} placeholder={t.targetAmountPlaceholder} icon={Banknote} lang={lang}/>
                    <InputField label={t.timeToGoal} id="gp-time" value={timePeriod} onChange={handleInputChange(setTimePeriod, 'tenure')} placeholder={t.timeToGoalPlaceholder} icon={Calendar} />
                    <InputField label={t.expectedReturnRate} id="gp-rate" value={returnRate} onChange={handleInputChange(setReturnRate, 'rate')} placeholder={t.expectedReturnRatePlaceholder} icon={Percent} />
                    <button type="submit" className="w-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition shadow-md hover:shadow-lg"><Calculator className="h-5 w-5 mr-2" /> {t.calculate}</button>
                </form>
            </div>
            <div className="bg-white/70 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200/50 flex flex-col">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex-shrink-0">{t.goalSummary}</h3>
                <div className="flex-grow flex flex-col justify-center">
                    {error && <div className="text-center bg-red-100 text-red-700 p-4 rounded-lg w-full"><p>{error}</p></div>}
                    {results && !error && (
                        <div className="space-y-4 w-full">
                            <ResultCard 
                                label={t.requiredMonthlySip} 
                                value={formatCurrency(results.monthlySip)} 
                                subValue={`${t.toAchieveYourGoal} '${results.goalName}'`}
                                isHighlighted={true} 
                                words={lang === 'en' ? toIndianWords(results.monthlySip) : toTeluguWords(results.monthlySip)} 
                                lang={lang}
                            />
                            <ResultCard label={t.totalInvestment} value={formatCurrency(results.totalInvestment)} />
                            <ResultCard label={t.totalReturns} value={formatCurrency(results.totalReturns)} />
                             <div className="mt-6"><h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center"><PieChartIcon className="h-5 w-5 mr-2 text-blue-500"/>{t.investmentBreakdown}</h3>
                                <div style={{ width: '100%', height: 250 }}>
                                    <ResponsiveContainer><PieChart>
                                        <Pie data={[{ name: t.totalInvestment, value: results.totalInvestment }, { name: t.totalReturns, value: results.totalReturns }]} cx="50%" cy="50%" outerRadius={80} dataKey="value" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                            <Cell fill={COLORS[0]} /><Cell fill={COLORS[1]} />
                                        </Pie>
                                        <Tooltip formatter={(value) => formatCurrency(value)} /><Legend />
                                    </PieChart></ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    )}
                    {!results && !error && <div className="text-center bg-gray-50/80 text-gray-500 p-4 rounded-lg w-full"><p>{t.enterDetails}</p></div>}
                </div>
            </div>
        </div>
    );
};


const InterestCalculator = ({t, lang, sharedValues, setSharedValues}) => {
    const [mode, setMode] = useState('SIMPLE');
    const [principal, setPrincipal] = useState(sharedValues.principal);
    const [rate, setRate] = useState(sharedValues.rate);
    const [finalAmountInput, setFinalAmountInput] = useState('');
    const [findRateInputType, setFindRateInputType] = useState('interest');
    const [tenure, setTenure] = useState(sharedValues.tenure);
    const [interestType, setInterestType] = useState('%');
    const [tenureType, setTenureType] = useState('Years');
    const [frequency, setFrequency] = useState('1');
    const [closingCharge, setClosingCharge] = useState('');
    const [closingChargeType, setClosingChargeType] = useState('flat');
    const [error, setError] = useState('');
    const [results, setResults] = useState(null);
    
    useEffect(() => {
        setPrincipal(sharedValues.principal);
        setRate(sharedValues.rate);
        setTenure(sharedValues.tenure);
    }, [sharedValues]);

    const compoundingFrequencies = {'12': 'Monthly', '4': 'Quarterly', '2': 'Half-Yearly', '1': 'Annually' };

    const handleModeChange = (newMode) => {
        setMode(newMode); 
        setResults(null); 
        setError('');
        setFinalAmountInput('');
        setClosingCharge('');
    }
    
    const handleInputChange = (setter, key) => (e) => {
        const { value } = e.target;
        setter(value);
        if(key) {
            setSharedValues(prev => ({...prev, [key]: value}));
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault(); 
        setResults(null);
        const p = parseFloat(principal);
        const t_val = parseFloat(tenure);

        let tenureInYears;
        if (mode === 'COMPOUND') {
            tenureInYears = t_val;
        } else {
             switch(tenureType) {
                case 'Months': tenureInYears = t_val / 12; break;
                case 'Days': tenureInYears = t_val / 365; break;
                default: tenureInYears = t_val;
            }
        }
        
        if (isNaN(p) || p <= 0 || isNaN(t_val) || t_val <= 0) {
            setError(t.errorGeneric); return;
        }
        
        if (mode === 'FIND_RATE') {
            const finalAmount = parseFloat(finalAmountInput);
            if (isNaN(finalAmount) || finalAmount <= 0) {
                 setError(t.errorGeneric); return;
            }
            let i_amt;
            if (findRateInputType === 'total') {
                if (finalAmount <= p) {
                    setError(t.errorTotalAmount); return;
                }
                i_amt = finalAmount - p;
            } else {
                i_amt = finalAmount;
            }
            setError('');
            const calculatedRate = (i_amt * 100) / (p * tenureInYears);
            setResults({
                mode: 'FIND_RATE',
                principal: p,
                interestAmount: i_amt,
                tenureYears: tenureInYears,
                annualRate: calculatedRate,
            });
        } else { // Simple or Compound
            const r = parseFloat(rate);
            if(isNaN(r) || r < 0) { setError(t.errorGeneric); return; }
            setError('');
            const annualRate = interestType === '%' ? r : r * 12;

            const cc = parseFloat(closingCharge) || 0;
            let totalClosingCharge = 0;
            if (cc > 0) {
                if (closingChargeType === 'perLac') {
                    totalClosingCharge = (p / 100000) * cc;
                } else {
                    totalClosingCharge = cc;
                }
            }

            if(mode === 'SIMPLE') {
                const totalInterest = (p * annualRate * tenureInYears) / 100;
                setResults({ 
                    mode: 'SIMPLE', 
                    principal: p, 
                    totalInterest, 
                    totalAmount: p + totalInterest, 
                    tenureYears: tenureInYears, 
                    annualRate,
                    totalClosingCharge
                });
            } else { // COMPOUND
                const n = parseFloat(frequency);
                const totalAmount = p * Math.pow((1 + (annualRate / 100) / n), n * t_val);
                const totalInterest = totalAmount - p;
                setResults({ 
                    mode: 'COMPOUND', 
                    principal: p, 
                    totalInterest, 
                    totalAmount, 
                    tenureYears: t_val,
                    annualRate,
                    compoundingFrequency: n,
                    totalClosingCharge
                });
            }
        }
    };
    
    const getSummaryTitle = () => {
        switch(mode) {
            case 'SIMPLE': return t.summaryTitleSimple;
            case 'COMPOUND': return t.summaryTitleCompound;
            case 'FIND_RATE': return t.summaryTitleFindRate;
            default: return "Summary";
        }
    }

    const ManualCalculation = () => {
        if (!results) return null;
        
        return (
            <div className="mt-6 bg-gray-50/80 p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-700 mb-4 text-center">{t.manualCalculationTitle}</h4>
                <div className="space-y-4 text-sm text-center text-gray-800">
                    {results.mode === 'SIMPLE' && (
                        <>
                            <p>
                                ({formatCurrency(results.principal)} × {results.annualRate.toFixed(2)}% × {results.tenureYears.toFixed(2)} yrs) / 100 = <span className="font-bold text-blue-600">{formatCurrency(results.totalInterest)}</span>
                            </p>
                            <p className="border-t border-dashed pt-3 mt-3">
                                {formatCurrency(results.principal)} + {formatCurrency(results.totalInterest)} = <span className="font-bold text-blue-600">{formatCurrency(results.totalAmount)}</span>
                            </p>
                             {results.totalClosingCharge > 0 && 
                                <p className="border-t border-dashed pt-3 mt-3">
                                    {formatCurrency(results.totalAmount)} + {formatCurrency(results.totalClosingCharge)} = <span className="font-bold text-red-600">{formatCurrency(results.totalAmount + results.totalClosingCharge)}</span>
                                </p>
                            }
                        </>
                    )}
                    {results.mode === 'COMPOUND' && (
                         <>
                           <p>
                                {formatCurrency(results.principal)} × (1 + {results.annualRate.toFixed(2)}% / {results.compoundingFrequency})^{`(${results.compoundingFrequency}×${results.tenureYears})`} = <span className="font-bold text-blue-600">{formatCurrency(results.totalAmount)}</span>
                           </p>
                           <p className="border-t border-dashed pt-3 mt-3">
                                {formatCurrency(results.totalAmount)} - {formatCurrency(results.principal)} = <span className="font-bold text-blue-600">{formatCurrency(results.totalInterest)}</span>
                           </p>
                            {results.totalClosingCharge > 0 && 
                                <p className="border-t border-dashed pt-3 mt-3">
                                    {formatCurrency(results.totalAmount)} + {formatCurrency(results.totalClosingCharge)} = <span className="font-bold text-red-600">{formatCurrency(results.totalAmount + results.totalClosingCharge)}</span>
                                </p>
                            }
                        </>
                    )}
                    {results.mode === 'FIND_RATE' && (
                         <>
                            <p>
                                ({formatCurrency(results.interestAmount)} × 100) / ({formatCurrency(results.principal)} × {results.tenureYears.toFixed(2)} yrs) = <span className="font-bold text-blue-600">{formatPercentage(results.annualRate)}</span>
                            </p>
                        </>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/70 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200/50">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <ToggleButton options={{'SIMPLE': t.simpleInterest, 'COMPOUND': t.compoundInterest, 'FIND_RATE': t.findRate}} selected={mode} onSelect={handleModeChange}/>
                    
                    <AmountInput label={t.principalAmount} id="i-principal" value={principal} onChange={handleInputChange(setPrincipal, 'principal')} placeholder={t.principalPlaceholder} icon={Banknote} lang={lang} />
                    
                    {mode === 'FIND_RATE' ? (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t.findRateInputType}</label>
                                <ToggleButton options={{'interest': t.interestOnly, 'total': t.totalAmount}} selected={findRateInputType} onSelect={setFindRateInputType}/>
                            </div>
                            <AmountInput 
                                label={findRateInputType === 'interest' ? t.interestAmount : t.totalAmount} 
                                id="i-final-amount" 
                                value={finalAmountInput} 
                                onChange={(e) => setFinalAmountInput(e.target.value)} 
                                placeholder={findRateInputType === 'interest' ? t.interestAmountPlaceholder : t.totalAmountPlaceholder}
                                icon={Coins} 
                                lang={lang} 
                            />
                        </>
                    ) : (
                        <>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="col-span-2"><InputField label={interestType === '%' ? t.rateLabelPercent : t.rateLabelRupees} id="si-interest" value={rate} onChange={handleInputChange(setRate, 'rate')} placeholder={interestType === '%' ? t.ratePlaceholderPercent : t.ratePlaceholderRupees} icon={Percent}/></div>
                                <div className="col-span-1"><CustomSelect label="Type" value={interestType} onChange={setInterestType} options={{ '%': '%', '₹': '₹' }} /></div>
                            </div>
                             <div className="border-t border-dashed pt-4">
                                <p className="text-sm font-medium text-gray-500 mb-2">{t.closingChargesOptional}</p>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="col-span-2">
                                        <InputField label={t.chargeAmount} id="closing-charge" value={closingCharge} onChange={(e) => setClosingCharge(e.target.value)} placeholder="e.g., 2000" icon={Banknote}/>
                                    </div>
                                    <div className="col-span-1">
                                        <CustomSelect label={t.chargeType} value={closingChargeType} onChange={setClosingChargeType} options={{ 'flat': t.flatFee, 'perLac': t.perLac }} />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {mode === 'COMPOUND' ? (
                        <>
                            <InputField label={`${t.tenure} (in Years)`} id="ci-tenure" value={tenure} onChange={handleInputChange(setTenure, 'tenure')} placeholder={t.tenurePlaceholder} icon={Calendar}/>
                            <CustomSelect label={t.compoundingFrequency} value={frequency} onChange={setFrequency} options={compoundingFrequencies} />
                        </>
                    ) : (
                         <div className="grid grid-cols-3 gap-3">
                            <div className="col-span-2"><InputField label={t.tenure} id="si-tenure" value={tenure} onChange={handleInputChange(setTenure, 'tenure')} placeholder={t.tenurePlaceholder} icon={Calendar}/></div>
                            <div className="col-span-1"><CustomSelect label={t.tenureUnit} value={tenureType} onChange={setTenureType} options={{'Years':'Years', 'Months':'Months', 'Days': 'Days'}} /></div>
                        </div>
                    )}
                    <button type="submit" className="w-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition shadow-md hover:shadow-lg"><Calculator className="h-5 w-5 mr-2" /> {t.calculate}</button>
                </form>
            </div>
            <div className="bg-white/70 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200/50 flex flex-col">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex-shrink-0">{getSummaryTitle()}</h3>
                <div className="flex-grow flex flex-col justify-center">
                    {error && <div className="text-center bg-red-100 text-red-700 p-4 rounded-lg w-full"><p>{error}</p></div>}
                    {results && !error && (
                        <div>
                            <div className="space-y-4 w-full">
                               {results.mode === 'SIMPLE' && <>
                                    <ResultCard label={t.principalAmount} value={formatCurrency(results.principal)} lang={lang}/>
                                    <ResultCard label={t.totalInterestPayable} value={formatCurrency(results.totalInterest)} lang={lang}/>
                                    {results.totalClosingCharge > 0 && <ResultCard label={t.totalClosingCharges} value={formatCurrency(results.totalClosingCharge)} lang={lang}/>}
                                    <ResultCard label={t.totalPayout} value={formatCurrency(results.totalAmount + results.totalClosingCharge)} isHighlighted={true} words={lang === 'en' ? toIndianWords(results.totalAmount + results.totalClosingCharge) : toTeluguWords(results.totalAmount + results.totalClosingCharge)} lang={lang}/>
                                </>}
                                 {results.mode === 'COMPOUND' && <>
                                    <ResultCard label={t.principalAmount} value={formatCurrency(results.principal)} lang={lang}/>
                                    <ResultCard label={t.totalInterestEarned} value={formatCurrency(results.totalInterest)} lang={lang}/>
                                    {results.totalClosingCharge > 0 && <ResultCard label={t.totalClosingCharges} value={formatCurrency(results.totalClosingCharge)} lang={lang}/>}
                                    <ResultCard label={t.totalPayout} value={formatCurrency(results.totalAmount + results.totalClosingCharge)} isHighlighted={true} words={lang === 'en' ? toIndianWords(results.totalAmount + results.totalClosingCharge) : toTeluguWords(results.totalAmount + results.totalClosingCharge)} lang={lang}/>
                                </>}
                                {results.mode === 'FIND_RATE' && <>
                                    <ResultCard label={t.calculatedAnnualRate} value={formatPercentage(results.annualRate)} isHighlighted={true} />
                                    <ResultCard label={t.calculatedMonthlyRate} value={formatPercentage(results.annualRate / 12)} />
                                    <ResultCard label={t.calculatedRateInRupees} value={`${formatCurrency(results.annualRate / 12)} per ₹100 / month`} />
                                </>}
                            </div>
                            <ManualCalculation />
                        </div>
                    )}
                    {!results && !error && <div className="text-center bg-gray-50/80 text-gray-500 p-4 rounded-lg w-full"><p>{t.enterDetails}</p></div>}
                </div>
            </div>
        </div>
    );
};

// --- Main App Component ---
export default function App() {
    const [lang, setLang] = useState('en');
    const t = translations[lang];
    const [user, setUser] = useState(null);
    const [sharedValues, setSharedValues] = useState({ principal: '', rate: '', tenure: '' });
    const [activeTab, setActiveTab] = useState('INTEREST');
    const [isTrackerUnlocked, setIsTrackerUnlocked] = useState(sessionStorage.getItem('trackerUnlocked') === 'true');
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    useEffect(() => {
        if (!auth) return;
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (!currentUser) {
                setIsTrackerUnlocked(false);
                sessionStorage.removeItem('trackerUnlocked');
            }
        });
        return () => unsubscribe();
    }, []);

    const handleTabClick = (key) => {
        if (key === 'EXPENSE_TRACKER' && !isTrackerUnlocked) {
            setShowPasswordModal(true);
        } else {
            setActiveTab(key);
        }
    };
    
    const handleLogout = async () => {
        if (!auth) return;
        try {
            await signOut(auth);
            if(activeTab === 'EXPENSE_TRACKER'){
                setActiveTab('INTEREST');
            }
        } catch (error) {
            console.error("Logout error:", error);
        }
    };
    
    const handleGoogleLogin = async () => {
        if (!auth) return;
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Authentication error:", error);
        }
    };

    const TABS = {
        GOAL_PLANNER: { name: t.goalPlannerTab, component: GoalPlannerCalculator, icon: Award },
        INTEREST: { name: t.interestTab, component: InterestCalculator, icon: Target },
        SIP: { name: t.sipTab, component: SIPCalculator, icon: TrendingUp },
        PREPAYMENT: { name: t.prepaymentTab, component: PrepaymentCalculator, icon: Rocket },
        EMI: { name: t.emiTab, component: EMICalculator, icon: Table },
        CHIT: { name: t.chitTab, component: ChitFundCalculator, icon: Banknote },
        EXPENSE_TRACKER: { name: t.expenseTrackerTab, component: user ? ExpenseTracker : () => <ProtectedContent t={t} />, icon: Shield },
    };
    
    const ActiveComponent = TABS[activeTab].component;
    
    const LanguageToggle = () => (
        <div className="bg-white/70 backdrop-blur-sm p-1 rounded-full shadow-md">
            <button onClick={() => setLang('en')} className={`px-3 py-1 text-sm rounded-full transition-colors ${lang === 'en' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}>EN</button>
            <button onClick={() => setLang('te')} className={`px-3 py-1 text-sm rounded-full transition-colors ${lang === 'te' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}>TE</button>
        </div>
    );
    
    const PasswordModal = () => {
        const [passwordInput, setPasswordInput] = useState('');
        const [passwordError, setPasswordError] = useState('');

        const handlePasswordSubmit = (e) => {
            e.preventDefault();
            if (passwordInput === 'Ramareddy') {
                setIsTrackerUnlocked(true);
                sessionStorage.setItem('trackerUnlocked', 'true');
                setShowPasswordModal(false);
                setActiveTab('EXPENSE_TRACKER');
            } else {
                setPasswordError(t.incorrectPassword);
            }
        };

        return (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
                <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm m-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-800">{t.passwordProtected}</h3>
                        <button onClick={() => setShowPasswordModal(false)} className="text-gray-400 hover:text-gray-600">
                            <X size={24} />
                        </button>
                    </div>
                    <form onSubmit={handlePasswordSubmit}>
                        <div className="space-y-4">
                            <InputField 
                                label={t.enterPassword}
                                id="password"
                                type="password"
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                placeholder="*******"
                                icon={ShieldCheck}
                            />
                            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                            <button type="submit" className="w-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition shadow-md hover:shadow-lg">{t.unlock}</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };
    
    const AuthControl = () => (
        <div className="flex items-center gap-4">
             <LanguageToggle />
            {user ? (
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 hidden sm:block">{t.welcome}, {user.displayName.split(' ')[0]}</span>
                    <User className="h-6 w-6 text-gray-600 sm:hidden"/>
                    <button onClick={handleLogout} className="flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-full shadow-md hover:bg-red-600 transition">
                       <LogOut className="h-4 w-4" />
                       <span className="hidden sm:inline">{t.logout}</span>
                    </button>
                </div>
            ) : (
                <button onClick={handleGoogleLogin} className="flex items-center gap-2 bg-white text-gray-700 px-4 py-1.5 rounded-full shadow-md hover:bg-gray-100 transition border border-gray-200">
                    <LogIn className="h-5 w-5 text-indigo-500"/>
                    <span className="font-medium">{t.loginWithGoogle}</span>
                </button>
            )}
        </div>
    );

    if (!isFirebaseConfigValid) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-red-50 text-red-700">
                <div className="p-8 bg-white rounded-lg shadow-md text-center">
                    <h2 className="text-2xl font-bold mb-4">Firebase Configuration Error</h2>
                    <p>Firebase configuration is missing or incomplete.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-cyan-100 via-blue-200 to-purple-200 min-h-screen p-4 sm:p-6 font-sans">
            {showPasswordModal && <PasswordModal />}
            <div className="absolute top-4 right-4 z-20">
                <AuthControl />
            </div>
            <header className="text-center mb-6 pt-8 sm:pt-12">
                <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-700 py-2">{t.suiteTitle}</h1>
                <p className="text-md text-gray-700 mt-2">{t.suiteDescription}</p>
            </header>

            <div className="max-w-7xl mx-auto">
                <div className="mb-8 overflow-x-auto">
                    <div className="flex border-b border-gray-300/70 sm:justify-center">
                        {Object.entries(TABS).map(([key, { name, icon: Icon }]) => (
                            <button
                                key={key}
                                onClick={() => handleTabClick(key)}
                                className={`flex-shrink-0 flex items-center gap-2 px-3 sm:px-4 py-3 font-medium text-sm sm:text-base transition-all duration-300 border-b-4 ${
                                    activeTab === key
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <Icon className="h-5 w-5" />
                                <span>{name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="transition-opacity duration-300">
                    <ActiveComponent t={t} lang={lang} user={user} sharedValues={sharedValues} setSharedValues={setSharedValues} />
                </div>
            </div>
             <footer className="text-center mt-12 pb-4">
                <p className="text-sm text-gray-600">
                    Calculations are for illustrative purposes. Please consult a financial advisor.
                </p>
            </footer>
        </div>
    );
}
