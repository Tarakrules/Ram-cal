import React, { useState, useEffect } from 'react';
import { ChevronsUpDown, Calculator, PieChart as PieChartIcon, Table, Percent, Banknote, Calendar, Coins, LineChart as LineChartIcon, TrendingUp, Rocket, Target, LogIn, LogOut, User } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp, collection } from 'firebase/firestore';

// --- Firebase Configuration ---
// IMPORTANT: Replace this with your own Firebase project configuration!

const firebaseConfig = {
  apiKey: "AIzaSyBgwrGcN2CLpze71sDx-Qe1G66pIDoDozc",
  authDomain: "calclulator-app.firebaseapp.com",
  projectId: "calclulator-app",
  storageBucket: "calclulator-app.firebasestorage.app",
  messagingSenderId: "962890227805",
  appId: "1:962890227805:web:7c8be3da041fe0d9a1adb4",
  measurementId: "G-1YE0Z04CDT"
};

// --- Initialize Firebase ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- Translation Data (remains the same) ---
const translations = {
    en: {
        suiteTitle: "Financial Calculator Suite",
        suiteDescription: "Your all-in-one tool for financial planning and calculations.",
        interestTab: "Interest",
        sipTab: "SIP",
        chitTab: "Chit Fund",
        emiTab: "EMI",
        prepaymentTab: "Prepayment",
        calculate: "Calculate",
        rupeesOnly: "Rupees Only",
        loginWithGoogle: "Login with Google",
        logout: "Logout",
        welcome: "Welcome",
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
        totalInterestPayable: "Total Interest Payable",
        totalInterestEarned: "Total Interest Earned",
        totalAmountPayable: "Total Amount Payable",
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
        errorTotalAmount: "Total amount must be greater than principal.",
        errorChit: "Please enter valid numbers. Commission (0-100), Bid Discount (0-40).",
        errorMembers: "Number of members must be a whole number.",
        errorPrepayment: "Prepayment amount must be less than the loan amount.",
        enterDetails: "Enter details to calculate.",
        dataSaved: "Calculation saved to your account.",
    },
    te: {
        suiteTitle: "ఫైనాన్షియల్ కాలిక్యులేటర్ సూట్",
        suiteDescription: "మీ ఆర్థిక ప్రణాళిక మరియు లెక్కల కోసం ఆల్-ఇన్-వన్ సాధనం.",
        interestTab: "వడ్డీ",
        sipTab: "SIP",
        chitTab: "చిట్ ఫండ్",
        emiTab: "EMI",
        prepaymentTab: "ముందస్తు చెల్లింపు",
        calculate: "లెక్కించు",
        rupeesOnly: "రూపాయలు మాత్రమే",
        loginWithGoogle: "Googleతో లాగిన్ అవ్వండి",
        logout: "లాగ్ అవుట్",
        welcome: "స్వాగతం",
        interestCalcTitle: "వడ్డీ కాలిక్యులేటర్",
        simpleInterest: "సాధారణ వడ్డీ",
        compoundInterest: "చక్రవడ్డీ",
        findRate: "రేటు కనుగొనండి",
        principalAmount: "అసలు మొత్తం",
        principalPlaceholder: "ఉదా., 100000",
        interestAmount: "వడ్డీ మొత్తం",
        interestAmountPlaceholder: "ఉదా., 20000",
        totalAmount: "మొత్తం (అసలు + వడ్డీ)",
        totalAmountPlaceholder: "ఉదా., 120000",
        findRateInputType: "ఇన్‌పుట్ రకం",
        interestOnly: "వడ్డీ మాత్రమే",
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
        summaryTitleFindRate: "వడ్డీ రేటు లెక్కింపు",
        totalInterestPayable: "చెల్లించవలసిన మొత్తం వడ్డీ",
        totalInterestEarned: "సంపాదించిన మొత్తం వడ్డీ",
        totalAmountPayable: "చెల్లించవలసిన మొత్తం",
        maturityAmount: "మెచ్యూరిటీ మొత్తం",
        calculatedAnnualRate: "లెక్కించిన వార్షిక రేటు",
        calculatedMonthlyRate: "సమానమైన నెలవారీ రేటు",
        calculatedRateInRupees: "సమానమైన రేటు ₹లలో",
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
        prepaymentTitle: "లోన్ ముందస్తు చెల్లింపు కాలిక్యులేటర్",
        prepaymentDetails: "లోన్ & ముందస్తు చెల్లింపు వివరాలు",
        originalLoanDetails: "అసలు లోన్ వివరాలు",
        prepaymentStrategy: "ముందస్తు చెల్లింపు వ్యూహం",
        prepaymentType: "ముందస్తు చెల్లింపు రకం",
        oneTime: "ఒకసారి",
        recurring: "పునరావృతం",
        prepaymentAmount: "ముందస్తు చెల్లింపు మొత్తం",
        prepaymentAmountPlaceholder: "ఉదా., 50000",
        startPrepaymentAfter: "తర్వాత ప్రారంభించండి (నెలలు)",
        startPrepaymentAfterPlaceholder: "ఉదా., 6",
        prepaymentFrequency: "ఫ్రీక్వెన్సీ",
        monthly: "నెలవారీ",
        annually: "వార్షిక",
        prepaymentSummary: "ముందస్తు చెల్లింపు ప్రభావ సారాంశం",
        originalEMI: "అసలు నెలవారీ EMI",
        newTenure: "కొత్త లోన్ కాలపరిమితి",
        tenureReducedBy: "కాలపరిమితి తగ్గింది",
        totalInterestPaidOriginal: "అసలు మొత్తం వడ్డీ",
        totalInterestPaidNew: "కొత్త మొత్తం వడ్డీ",
        totalInterestSaved: "మొత్తం వడ్డీ ఆదా",
        loanComparison: "లోన్ బ్యాలెన్స్ పోలిక",
        originalLoan: "అసలు లోన్",
        withPrepayment: "ముందస్తు చెల్లింపుతో",
        errorGeneric: "దయచేసి అన్ని ఫీల్డ్‌లలో సరైన, ధన సంఖ్యలను నమోదు చేయండి.",
        errorTotalAmount: "మొత్తం అసలు కంటే ఎక్కువగా ఉండాలి.",
        errorChit: "దయచేసి సరైన సంఖ్యలను నమోదు చేయండి. కమీషన్ (0-100), బిడ్ డిస్కౌంట్ (0-40).",
        errorMembers: "సభ్యుల సంఖ్య పూర్ణ సంఖ్య అయి ఉండాలి.",
        errorPrepayment: "ముందస్తు చెల్లింపు మొత్తం లోన్ మొత్తం కంటే తక్కువగా ఉండాలి.",
        enterDetails: "లెక్కించడానికి వివరాలను నమోదు చేయండి.",
        dataSaved: "లెక్కింపు మీ ఖాతాలో సేవ్ చేయబడింది.",
    }
};

// --- Helper Functions & Constants ---
const CURRENCY_SYMBOL = '₹';
const COLORS = ['#4f46e5', '#f97316'];

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
    const s = String(numStr).split('.')[0];
    if (s.length > 9) return 'ఓవర్‌ఫ్లో';
    const ones = ['', 'ఒకటి', 'రెండు', 'మూడు', 'నాలుగు', 'ఐదు', 'ఆరు', 'ఏడు', 'ఎనిమిది', 'తొమ్మిది'];
    const teens = ['పది', 'పదకొండు', 'పన్నెండు', 'పదమూడు', 'పద్నాలుగు', 'పదిహేను', 'పదహారు', 'పదిహేడు', 'పద్దెనిమిది', 'పంతొమ్మిది'];
    const tens = ['', '', 'ఇరవై', 'ముప్పై', 'నలభై', 'యాభై', 'అరవై', 'డెబ్బై', 'ఎనభై', 'తొంభై'];
    const powers = ['వంద', 'వెయ్యి', 'లక్ష', 'కోటి'];
    const numToWords = (n, suffix) => {
        if (n === 0) return '';
        let str = '';
        if (n > 19) { str += tens[Math.floor(n / 10)] + ' ' + ones[n % 10]; } 
        else if (n > 9) { str += teens[n - 10]; } 
        else { str += ones[n]; }
        return str.trim() + (suffix ? ' ' + suffix + ' ' : ' ');
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

// --- Firestore Helper ---
const saveCalculation = async (user, calcType, data) => {
    if (!user) return;
    try {
        const calcData = {
            ...data,
            userId: user.uid,
            timestamp: serverTimestamp()
        };
        // Create a new document in a subcollection for the user
        const userCalculationsRef = collection(db, "users", user.uid, "calculations");
        await addDoc(userCalculationsRef, { type: calcType, ...calcData });
        console.log("Calculation saved successfully!");
    } catch (error) {
        console.error("Error saving calculation: ", error);
    }
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
            onChange({ target: { id: id, value: rawValue } });
        }
    };
    const words = value && parseInt(value.replace(/,/g, ''), 10) > 0 && value.length < 16 ? (lang === 'te' ? toTeluguWords(value) : toIndianWords(value)) : '';
    return (
        <div>
            <InputField label={label} id={id} value={formatWithCommas(value)} onChange={handleChange} placeholder={placeholder} icon={Icon} type="text" />
            {words && <p className="text-right text-xs font-semibold text-indigo-600 pt-1 pr-1 h-4">{words} {translations[lang].rupeesOnly}</p>}
        </div>
    );
};

const CustomSelect = ({ label, value, onChange, options, disabled = false }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="relative">
            <select value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled}
                className="w-full appearance-none bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm transition disabled:bg-gray-100">
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
                className={`w-full py-2 text-sm font-semibold rounded-md transition-colors duration-300 ${selected === key ? 'bg-white text-indigo-600 shadow' : 'bg-transparent text-gray-600'}`}>
                {value}
            </button>
        ))}
    </div>
);

const ResultCard = ({ label, value, isHighlighted = false, words, lang, subValue = null }) => (
    <div>
        <div className={`p-4 rounded-lg ${isHighlighted ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg' : 'bg-indigo-50'}`}>
            <p className="text-sm opacity-90">{label}</p>
            <p className={`text-2xl font-bold ${isHighlighted ? 'text-white' : 'text-indigo-800'}`}>{value}</p>
            {subValue && <p className="text-xs opacity-80">{subValue}</p>}
        </div>
        {words && <p className="text-right text-xs font-semibold text-indigo-600 pt-1 pr-1 h-4">{words} {translations[lang].rupeesOnly}</p>}
    </div>
);

// --- Interest Calculator ---
const InterestCalculator = ({t, lang, user}) => {
    const [mode, setMode] = useState('SIMPLE');
    const [principal, setPrincipal] = useState('');
    const [rate, setRate] = useState('');
    const [finalAmountInput, setFinalAmountInput] = useState('');
    const [findRateInputType, setFindRateInputType] = useState('interest');
    const [tenure, setTenure] = useState('');
    const [interestType, setInterestType] = useState('%');
    const [tenureType, setTenureType] = useState('Years');
    const [frequency, setFrequency] = useState('1');
    const [error, setError] = useState('');
    const [results, setResults] = useState(null);
    const [notification, setNotification] = useState('');

    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => setNotification(''), 3000);
    };

    const handleModeChange = (newMode) => {
        setMode(newMode); 
        setResults(null); 
        setError('');
        setPrincipal('');
        setRate('');
        setFinalAmountInput('');
        setTenure('');
    }

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setResults(null);
        const p = parseFloat(principal);
        const t_val = parseFloat(tenure);
        let tenureInYears;
        if (mode === 'COMPOUND') { tenureInYears = t_val; } 
        else {
             switch(tenureType) {
                case 'Months': tenureInYears = t_val / 12; break;
                case 'Days': tenureInYears = t_val / 365; break;
                default: tenureInYears = t_val;
            }
        }
        if (isNaN(p) || p <= 0 || isNaN(t_val) || t_val <= 0) { setError(t.errorGeneric); return; }
        
        let calcData = {};
        if (mode === 'FIND_RATE') {
            const finalAmount = parseFloat(finalAmountInput);
            if (isNaN(finalAmount) || finalAmount <= 0) { setError(t.errorGeneric); return; }
            let i_amt;
            if (findRateInputType === 'total') {
                if (finalAmount <= p) { setError(t.errorTotalAmount); return; }
                i_amt = finalAmount - p;
            } else { i_amt = finalAmount; }
            setError('');
            const calculatedRate = (i_amt * 100) / (p * tenureInYears);
            const res = { mode: 'FIND_RATE', principal: p, interestAmount: i_amt, tenureInYears, annualRate: calculatedRate };
            setResults(res);
            calcData = { inputs: { principal: p, amount: finalAmount, tenure: t_val, tenureUnit: tenureType, inputType: findRateInputType }, results: res };
        } else if (mode === 'SIMPLE') {
            const r = parseFloat(rate);
            if(isNaN(r) || r < 0) { setError(t.errorGeneric); return; }
            setError('');
            const annualRate = interestType === '%' ? r : r * 12;
            const totalInterest = (p * annualRate * tenureInYears) / 100;
            const res = { mode: 'SIMPLE', principal: p, totalInterest, totalAmount: p + totalInterest, tenureInYears, annualRate};
            setResults(res);
            calcData = { inputs: { principal: p, rate: r, rateType: interestType, tenure: t_val, tenureUnit: tenureType }, results: res };
        } else { // COMPOUND
            const r = parseFloat(rate);
            if(isNaN(r) || r < 0) { setError(t.errorGeneric); return; }
            setError('');
            const n = parseFloat(frequency);
            const annualRate = interestType === '%' ? r : r * 12;
            const totalAmount = p * Math.pow((1 + (annualRate / 100) / n), n * t_val);
            const totalInterest = totalAmount - p;
            const res = { mode: 'COMPOUND', principal: p, totalInterest, totalAmount, tenureInYears: t_val, annualRate };
            setResults(res);
            calcData = { inputs: { principal: p, rate: r, rateType: interestType, tenure: t_val, compounding: frequency }, results: res };
        }

        if (user && Object.keys(calcData).length > 0) {
            await saveCalculation(user, `Interest_${mode}`, calcData);
            showNotification(t.dataSaved);
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

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/60 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-md border border-gray-200">
                {notification && <div className="absolute top-0 right-0 mt-4 mr-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">{notification}</div>}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <ToggleButton options={{'SIMPLE': t.simpleInterest, 'COMPOUND': t.compoundInterest, 'FIND_RATE': t.findRate}} selected={mode} onSelect={handleModeChange}/>
                    <AmountInput label={t.principalAmount} id="i-principal" value={principal} onChange={(e) => setPrincipal(e.target.value)} placeholder={t.principalPlaceholder} icon={Banknote} lang={lang} />
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
                        <div className="grid grid-cols-3 gap-3">
                            <div className="col-span-2"><InputField label={interestType === '%' ? t.rateLabelPercent : t.rateLabelRupees} id="si-interest" value={rate} onChange={(e) => setRate(e.target.value)} placeholder={interestType === '%' ? t.ratePlaceholderPercent : t.ratePlaceholderRupees} icon={Percent}/></div>
                            <div className="col-span-1"><CustomSelect label="Type" value={interestType} onChange={setInterestType} options={{ '%': '%', '₹': '₹' }} /></div>
                        </div>
                    )}
                    {mode === 'COMPOUND' ? (
                        <>
                            <InputField label={`${t.tenure} (in Years)`} id="ci-tenure" value={tenure} onChange={(e) => setTenure(e.target.value)} placeholder={t.tenurePlaceholder} icon={Calendar}/>
                            <CustomSelect label={t.compoundingFrequency} value={frequency} onChange={setFrequency} options={compoundingFrequencies} />
                        </>
                    ) : (
                         <div className="grid grid-cols-3 gap-3">
                            <div className="col-span-2"><InputField label={t.tenure} id="si-tenure" value={tenure} onChange={(e) => setTenure(e.target.value)} placeholder={t.tenurePlaceholder} icon={Calendar}/></div>
                            <div className="col-span-1"><CustomSelect label={t.tenureUnit} value={tenureType} onChange={setTenureType} options={{'Years':'Years', 'Months':'Months', 'Days': 'Days'}} /></div>
                        </div>
                    )}
                    <button type="submit" className="w-full flex items-center justify-center bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition shadow-md"><Calculator className="h-5 w-5 mr-2" /> {t.calculate}</button>
                </form>
            </div>
            <div className="bg-white/60 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-md border border-gray-200 flex flex-col">
                <h3 className="text-2xl font-semibold text-gray-700 mb-6 flex-shrink-0">{getSummaryTitle()}</h3>
                <div className="flex-grow flex flex-col justify-center">
                    {error && <div className="text-center bg-red-50 text-red-700 p-4 rounded-lg w-full"><p>{error}</p></div>}
                    {results && !error && (
                        <div className="space-y-4 w-full">
                           {results.mode === 'SIMPLE' && <>
                                <ResultCard label={t.principalAmount} value={formatCurrency(results.principal)} lang={lang}/>
                                <ResultCard label={t.totalInterestPayable} value={formatCurrency(results.totalInterest)} lang={lang}/>
                                <ResultCard label={t.totalAmountPayable} value={formatCurrency(results.totalAmount)} isHighlighted={true} words={lang === 'en' ? toIndianWords(results.totalAmount) : toTeluguWords(results.totalAmount)} lang={lang}/>
                            </>}
                             {results.mode === 'COMPOUND' && <>
                                <ResultCard label={t.principalAmount} value={formatCurrency(results.principal)} lang={lang}/>
                                <ResultCard label={t.totalInterestEarned} value={formatCurrency(results.totalInterest)} lang={lang}/>
                                <ResultCard label={t.maturityAmount} value={formatCurrency(results.totalAmount)} isHighlighted={true} words={lang === 'en' ? toIndianWords(results.totalAmount) : toTeluguWords(results.totalAmount)} lang={lang}/>
                            </>}
                            {results.mode === 'FIND_RATE' && <>
                                <ResultCard label={t.calculatedAnnualRate} value={formatPercentage(results.annualRate)} isHighlighted={true} />
                                <ResultCard label={t.calculatedMonthlyRate} value={formatPercentage(results.annualRate / 12)} />
                                <ResultCard label={t.calculatedRateInRupees} value={`${formatCurrency(results.annualRate / 12)} per ₹100 / month`} />
                            </>}
                        </div>
                    )}
                    {!results && !error && <div className="text-center bg-gray-50 text-gray-500 p-4 rounded-lg w-full"><p>{t.enterDetails}</p></div>}
                </div>
            </div>
        </div>
    );
};

// ... other calculators (EMI, ChitFund, SIP, Prepayment) remain the same but should be passed the `user` prop
// Example for EMICalculator (apply similarly to others)
const EMICalculator = ({t, lang, user}) => {
    // ... existing state ...
    const handleSubmit = async (e) => {
        // ... existing logic ...
        // After setResults(...)
        if (user) {
            await saveCalculation(user, 'EMI', { inputs: { principal, rate, tenure, tenureType }, results });
        }
    };
    // ... rest of the component
    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* JSX remains the same */}
        </div>
    )
};
const ChitFundCalculator = ({t, lang, user}) => {
    // Add user prop and saving logic similarly
    return (<div>Chit Fund</div>);
}
const SIPCalculator = ({t, lang, user}) => {
    // Add user prop and saving logic similarly
    return (<div>SIP</div>);
}
const PrepaymentCalculator = ({t, lang, user}) => {
    // Add user prop and saving logic similarly
    return (<div>Prepayment</div>);
}


// --- Main App Component ---
export default function App() {
    const [lang, setLang] = useState('en');
    const [user, setUser] = useState(null);
    const t = translations[lang];

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Authentication error:", error);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const TABS = {
        INTEREST: { name: t.interestTab, component: InterestCalculator, icon: Target },
        SIP: { name: t.sipTab, component: SIPCalculator, icon: TrendingUp },
        PREPAYMENT: { name: t.prepaymentTab, component: PrepaymentCalculator, icon: Rocket },
        EMI: { name: t.emiTab, component: EMICalculator, icon: Table },
        CHIT: { name: t.chitTab, component: ChitFundCalculator, icon: Banknote },
    };
    const [activeTab, setActiveTab] = useState('INTEREST');
    const ActiveComponent = TABS[activeTab].component;
    
    const LanguageToggle = () => (
        <div className="bg-white/70 backdrop-blur-sm p-1 rounded-full shadow-md">
            <button onClick={() => setLang('en')} className={`px-3 py-1 text-sm rounded-full transition-colors ${lang === 'en' ? 'bg-indigo-600 text-white' : 'text-gray-600'}`}>EN</button>
            <button onClick={() => setLang('te')} className={`px-3 py-1 text-sm rounded-full transition-colors ${lang === 'te' ? 'bg-indigo-600 text-white' : 'text-gray-600'}`}>TE</button>
        </div>
    );

    const AuthControl = () => (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-4">
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

    return (
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen p-4 sm:p-6 font-sans relative">
            <AuthControl />
            <header className="text-center mb-6 pt-20">
                <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 py-2">{t.suiteTitle}</h1>
                <p className="text-md text-gray-600 mt-2">{t.suiteDescription}</p>
            </header>

            <div className="max-w-7xl mx-auto">
                <div className="mb-8 overflow-x-auto">
                    <div className="flex border-b border-gray-200 sm:justify-center">
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
                    <ActiveComponent t={t} lang={lang} user={user} />
                </div>
            </div>
             <footer className="text-center mt-12 pb-4">
                <p className="text-sm text-gray-500">
                    Calculations are for illustrative purposes. Please consult a financial advisor.
                </p>
                 {user && <p className="text-xs text-gray-400 mt-1">Logged in as {user.email}</p>}
            </footer>
        </div>
    );
}
