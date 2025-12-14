
import React, { useState, useEffect } from 'react';
import { DollarSign, Clock, Calculator as CalculatorIcon, Plane, Heart, Wifi } from 'lucide-react';

export const Calculator = () => {
  const [currency, setCurrency] = useState<'BRL' | 'USD' | 'EUR'>('BRL');
  
  // Basic Inputs
  const [monthlyNetTarget, setMonthlyNetTarget] = useState(10000);
  const [hoursPerDay, setHoursPerDay] = useState(6);
  const [vacationWeeks, setVacationWeeks] = useState(4); 
  
  // Simplified Expenses (One bucket instead of individual fields if desired, or just cleaner layout)
  const [expenses, setExpenses] = useState({
      health: 800,
      internet: 200,
      software: 150,
      accountant: 300,
      other: 200
  });

  const [taxRate, setTaxRate] = useState(6); 
  const [profitRate, setProfitRate] = useState(10); 

  const [results, setResults] = useState({
    hourly: 0,
    grossMonthly: 0
  });

  const totalMonthlyExpenses = (Object.values(expenses) as number[]).reduce((a, b) => a + b, 0);

  useEffect(() => {
    const annualNetGoal = monthlyNetTarget * 12; 
    const annualExpenses = totalMonthlyExpenses * 12; 
    const totalBaseNeeded = annualNetGoal + annualExpenses;
    const withProfit = totalBaseNeeded * (1 + profitRate / 100);
    const annualGrossNeeded = withProfit / (1 - taxRate / 100);

    const weeksInYear = 52;
    const workingWeeks = weeksInYear - vacationWeeks;
    const workingDaysPerWeek = 5; 
    const totalBillableHours = workingWeeks * workingDaysPerWeek * hoursPerDay;

    setResults({
      hourly: totalBillableHours > 0 ? annualGrossNeeded / totalBillableHours : 0,
      grossMonthly: annualGrossNeeded / 12, 
    });
  }, [monthlyNetTarget, hoursPerDay, vacationWeeks, expenses, taxRate, profitRate, totalMonthlyExpenses]);

  const format = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(val);

  const handleExpenseChange = (key: keyof typeof expenses, value: number) => {
      setExpenses(prev => ({...prev, [key]: value}));
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-onyx-800 rounded-xl border border-onyx-700">
            <CalculatorIcon className="w-6 h-6 text-onyx-accent" />
        </div>
        <h1 className="text-2xl font-bold text-white">Calculadora Freelance</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-7 space-y-6">
           <div className="bg-onyx-800 p-6 rounded-2xl border border-onyx-700">
               <h3 className="font-bold text-white mb-4 text-lg">Definições Básicas</h3>
               <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-onyx-muted mb-2">Salário Líquido Mensal (Meta)</label>
                        <div className="flex gap-2">
                            <select 
                                value={currency} 
                                onChange={(e) => setCurrency(e.target.value as any)}
                                className="bg-onyx-900 border border-onyx-700 rounded-lg px-3 text-white font-bold focus:ring-1 focus:ring-onyx-accent"
                            >
                                <option value="BRL">R$</option>
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                            </select>
                            <input 
                                type="number" 
                                value={monthlyNetTarget} 
                                onChange={e => setMonthlyNetTarget(Number(e.target.value))}
                                className="flex-1 bg-onyx-900 border border-onyx-700 rounded-lg py-3 px-4 text-white text-lg font-bold focus:ring-1 focus:ring-onyx-accent"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div>
                            <label className="block text-sm font-medium text-onyx-muted mb-2">Horas/Dia</label>
                            <input 
                                type="number" 
                                max={12}
                                value={hoursPerDay} 
                                onChange={e => setHoursPerDay(Number(e.target.value))}
                                className="w-full bg-onyx-900 border border-onyx-700 rounded-lg py-3 px-4 text-white"
                            />
                       </div>
                       <div>
                            <label className="block text-sm font-medium text-onyx-muted mb-2">Férias (Semanas/Ano)</label>
                            <input 
                                type="number" 
                                max={12}
                                value={vacationWeeks} 
                                onChange={e => setVacationWeeks(Number(e.target.value))}
                                className="w-full bg-onyx-900 border border-onyx-700 rounded-lg py-3 px-4 text-white"
                            />
                       </div>
                    </div>
               </div>
           </div>

           <div className="bg-onyx-800 p-6 rounded-2xl border border-onyx-700">
               <div className="flex justify-between items-center mb-4">
                   <h3 className="font-bold text-white text-lg">Custos & Impostos</h3>
                   <span className="text-sm text-onyx-muted">Total: {format(totalMonthlyExpenses)}/mês</span>
               </div>
               
               <div className="grid grid-cols-2 gap-4 mb-6">
                   <div>
                       <label className="text-xs text-onyx-muted mb-1 block">Saúde</label>
                       <input type="number" value={expenses.health} onChange={e => handleExpenseChange('health', Number(e.target.value))} className="w-full bg-onyx-900 border border-onyx-700 rounded-lg p-2 text-white text-sm" />
                   </div>
                   <div>
                       <label className="text-xs text-onyx-muted mb-1 block">Internet/Luz</label>
                       <input type="number" value={expenses.internet} onChange={e => handleExpenseChange('internet', Number(e.target.value))} className="w-full bg-onyx-900 border border-onyx-700 rounded-lg p-2 text-white text-sm" />
                   </div>
                   <div>
                       <label className="text-xs text-onyx-muted mb-1 block">Softwares/Ferramentas</label>
                       <input type="number" value={expenses.software} onChange={e => handleExpenseChange('software', Number(e.target.value))} className="w-full bg-onyx-900 border border-onyx-700 rounded-lg p-2 text-white text-sm" />
                   </div>
                   <div>
                       <label className="text-xs text-onyx-muted mb-1 block">Contador/MEI</label>
                       <input type="number" value={expenses.accountant} onChange={e => handleExpenseChange('accountant', Number(e.target.value))} className="w-full bg-onyx-900 border border-onyx-700 rounded-lg p-2 text-white text-sm" />
                   </div>
               </div>
               
               <div className="grid grid-cols-2 gap-4 pt-4 border-t border-onyx-700">
                    <div>
                        <label className="block text-sm font-medium text-onyx-muted mb-1">Impostos (%)</label>
                        <input 
                            type="number" 
                            value={taxRate} 
                            onChange={e => setTaxRate(Number(e.target.value))}
                            className="w-full bg-onyx-900 border border-onyx-700 rounded-lg p-2 text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-onyx-muted mb-1">Margem Lucro (%)</label>
                        <input 
                            type="number" 
                            value={profitRate} 
                            onChange={e => setProfitRate(Number(e.target.value))}
                            className="w-full bg-onyx-900 border border-onyx-700 rounded-lg p-2 text-white"
                        />
                    </div>
               </div>
           </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-5 space-y-6">
           <div className="sticky top-24">
                <div className="bg-gradient-to-br from-onyx-800 to-onyx-900 p-8 rounded-3xl border border-onyx-700 shadow-xl">
                    <h2 className="text-onyx-muted text-xs uppercase tracking-wider font-bold mb-4">Valor Mínimo da Hora</h2>
                    <div className="text-6xl font-bold text-white mb-2 tracking-tight">{format(results.hourly)}</div>
                    <p className="text-green-400 text-sm mb-8 font-medium">Necessário para atingir sua meta líquida.</p>

                    <div className="space-y-4 pt-6 border-t border-white/10">
                        <div className="flex justify-between">
                            <span className="text-sm text-onyx-muted uppercase font-bold">Faturamento Bruto Mensal</span>
                            <span className="text-xl font-bold text-white">{format(results.grossMonthly)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-onyx-muted uppercase font-bold">Diária (8h)</span>
                            <span className="text-xl font-bold text-white">{format(results.hourly * 8)}</span>
                        </div>
                    </div>
                </div>
           </div>
        </div>
      </div>
    </div>
  );
};
