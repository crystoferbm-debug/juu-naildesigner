
import React, { useState, useMemo } from 'react';
import type { Appointment } from '../types';
import { SERVICES } from '../constants';

type ReportView = 'monthly' | 'annual' | 'byService';

const ReportTab: React.FC<{ label: string; isActive: boolean; onClick: () => void; }> = ({ label, isActive, onClick }) => {
    const baseClasses = "px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200";
    const activeClasses = "bg-pink-500 text-white shadow";
    const inactiveClasses = "text-slate-600 hover:bg-pink-100";
    return (
        <button onClick={onClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
            {label}
        </button>
    );
}

const BarChart: React.FC<{ data: { label: string; value: number }[] }> = ({ data }) => {
    const maxValue = Math.max(...data.map(d => d.value), 1); // Avoid division by zero
    return (
        <div className="flex items-end justify-around h-64 w-full pt-4 space-x-2 sm:space-x-4">
            {data.map(({ label, value }) => (
                <div key={label} className="flex flex-col items-center flex-1 h-full">
                    <div 
                        className="w-full bg-pink-400 rounded-t-lg hover:bg-pink-500 transition-colors flex items-end justify-center"
                        style={{ height: `${(value / maxValue) * 100}%` }}
                        title={value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    >
                         <span className="text-white text-xs font-bold [text-shadow:_0_1px_2px_rgb(0_0_0_/_40%)] transform -rotate-90 origin-bottom-left ml-1 mb-1 whitespace-nowrap">{value > maxValue * 0.1 ? value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0 }) : ''}</span>
                    </div>
                    <div className="w-full text-center text-xs text-slate-500 mt-2 font-medium">{label}</div>
                </div>
            ))}
        </div>
    );
}

const MonthlyReport: React.FC<{ appointments: Appointment[] }> = ({ appointments }) => {
    const data = useMemo(() => {
        const now = new Date();
        const monthlyData: { [key: string]: number } = {};
        
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthName = date.toLocaleString('pt-BR', { month: 'short' }).replace('.', '');
            const year = date.getFullYear().toString().slice(-2);
            monthlyData[`${monthName}/${year}`] = 0;
        }

        appointments.forEach(appt => {
            const apptDate = new Date(appt.date);
            const monthName = apptDate.toLocaleString('pt-BR', { month: 'short' }).replace('.', '');
            const year = apptDate.getFullYear().toString().slice(-2);
            const key = `${monthName}/${year}`;
            if (key in monthlyData) {
                monthlyData[key] += appt.price;
            }
        });

        return Object.entries(monthlyData).map(([label, value]) => ({ label, value }));
    }, [appointments]);

    return (
         <div>
            <h3 className="text-md font-semibold text-slate-700 mb-4">Faturamento últimos 6 meses</h3>
            {data.some(d => d.value > 0) ? <BarChart data={data} /> : <p className="text-center text-slate-500 py-8">Nenhum faturamento registrado nos últimos meses.</p>}
        </div>
    );
};

const AnnualReport: React.FC<{ appointments: Appointment[] }> = ({ appointments }) => {
     const data = useMemo(() => {
        const now = new Date();
        const year = now.getFullYear();
        const monthlyData = Array.from({ length: 12 }, (_, i) => {
             const date = new Date(year, i, 1);
             return {
                label: date.toLocaleString('pt-BR', { month: 'short' }).replace('.',''),
                value: 0
             }
        });

        appointments.forEach(appt => {
            const apptDate = new Date(appt.date);
            if(apptDate.getFullYear() === year) {
                monthlyData[apptDate.getMonth()].value += appt.price;
            }
        });
        
        return monthlyData;
    }, [appointments]);
    
    return (
         <div>
            <h3 className="text-md font-semibold text-slate-700 mb-4">Faturamento Mensal em {new Date().getFullYear()}</h3>
            {data.some(d => d.value > 0) ? <BarChart data={data} /> : <p className="text-center text-slate-500 py-8">Nenhum faturamento registrado este ano.</p>}
        </div>
    );
};

const ByServiceReport: React.FC<{ appointments: Appointment[] }> = ({ appointments }) => {
    const data = useMemo(() => {
        const serviceData: { [key: string]: { count: number, revenue: number } } = {};
        
        SERVICES.forEach(s => {
            serviceData[s.id] = { count: 0, revenue: 0 };
        });

        appointments.forEach(appt => {
             if(serviceData[appt.serviceId]) {
                 serviceData[appt.serviceId].count += 1;
                 serviceData[appt.serviceId].revenue += appt.price;
             }
        });

        return Object.entries(serviceData)
            .map(([id, { count, revenue }]) => ({
                id,
                name: SERVICES.find(s => s.id === id)?.name || 'Desconhecido',
                count,
                revenue
            }))
            .sort((a, b) => b.revenue - a.revenue);

    }, [appointments]);

    return (
        <div>
            <h3 className="text-md font-semibold text-slate-700 mb-4">Faturamento por Serviço (Todo o período)</h3>
            {data.some(d => d.revenue > 0) ? (
                 <ul className="space-y-3">
                    {data.filter(d => d.count > 0).map(service => (
                        <li key={service.id} className="flex items-center justify-between p-3 bg-pink-50/50 rounded-lg">
                            <div>
                                <p className="font-semibold text-slate-700">{service.name}</p>
                                <p className="text-sm text-slate-500">{service.count} {service.count > 1 ? 'serviços realizados' : 'serviço realizado'}</p>
                            </div>
                            <p className="font-bold text-pink-600 text-lg">{service.revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                        </li>
                    ))}
                 </ul>
            ) : (
                <p className="text-center text-slate-500 py-8">Nenhum serviço foi concluído ainda.</p>
            )}
        </div>
    );
};

export const FinancialReport: React.FC<{ appointments: Appointment[] }> = ({ appointments }) => {
    const [activeTab, setActiveTab] = useState<ReportView>('monthly');

    const completedAppointments = useMemo(() => 
        appointments.filter(a => a.status === 'completed'),
    [appointments]);
    
    const renderContent = () => {
        switch(activeTab) {
            case 'monthly':
                return <MonthlyReport appointments={completedAppointments} />;
            case 'annual':
                return <AnnualReport appointments={completedAppointments} />;
            case 'byService':
                return <ByServiceReport appointments={completedAppointments} />;
            default:
                return null;
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                 <h2 className="text-lg font-bold text-slate-800 mb-3 sm:mb-0">Relatório Financeiro</h2>
                 <div className="flex space-x-2 bg-slate-100 p-1 rounded-lg">
                    <ReportTab label="Mensal" isActive={activeTab === 'monthly'} onClick={() => setActiveTab('monthly')} />
                    <ReportTab label="Anual" isActive={activeTab === 'annual'} onClick={() => setActiveTab('annual')} />
                    <ReportTab label="Por Serviço" isActive={activeTab === 'byService'} onClick={() => setActiveTab('byService')} />
                 </div>
            </div>
            <div className="mt-4">
                {renderContent()}
            </div>
        </div>
    );
};