import React, { useState, useEffect } from 'react';

interface LoanCalculatorProps {
  carPrice: number;
}

const LoanCalculator: React.FC<LoanCalculatorProps> = ({ carPrice }) => {
  const [downPayment, setDownPayment] = useState(Math.floor(carPrice * 0.2)); // 20% default
  const [term, setTerm] = useState(60); // 60 months
  const [interestRate, setInterestRate] = useState(4.5); // 4.5% APR
  const [monthlyPayment, setMonthlyPayment] = useState(0);

  useEffect(() => {
    calculateLoan();
  }, [downPayment, term, interestRate, carPrice]);

  const calculateLoan = () => {
    const principal = carPrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    if (monthlyRate === 0) {
      setMonthlyPayment(principal / term);
      return;
    }
    const payment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, term)) /
      (Math.pow(1 + monthlyRate, term) - 1);
    
    setMonthlyPayment(isNaN(payment) ? 0 : payment);
  };

  return (
    <div className="bg-white dark:bg-gray-850 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        Payment Estimator
      </h3>

      <div className="space-y-4">
        {/* Monthly Payment Display */}
        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-sm text-gray-500 dark:text-gray-400">Estimated Monthly Payment</div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            ${Math.floor(monthlyPayment).toLocaleString()}
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/mo</span>
          </div>
        </div>

        {/* Sliders */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-300">Down Payment</span>
            <span className="font-semibold text-gray-900 dark:text-white">${downPayment.toLocaleString()}</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max={carPrice} 
            step="500"
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-300">Duration ({term} months)</span>
            <span className="font-semibold text-gray-900 dark:text-white">{term / 12} Years</span>
          </div>
          <input 
            type="range" 
            min="12" 
            max="84" 
            step="12"
            value={term}
            onChange={(e) => setTerm(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        <div>
           <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-300">APR (%)</span>
            <span className="font-semibold text-gray-900 dark:text-white">{interestRate}%</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="15" 
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      </div>
    </div>
  );
};

export default LoanCalculator;