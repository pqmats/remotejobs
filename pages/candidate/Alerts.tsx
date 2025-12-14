import React, { useEffect, useState } from 'react';
import { MockApi } from '../../services/mockApi';
import { JobAlert } from '../../types';
import { Bell, Trash2, ToggleLeft, ToggleRight, Plus } from 'lucide-react';
import { useModal } from '../../context/ModalContext';

export const Alerts = () => {
  const [alerts, setAlerts] = useState<JobAlert[]>([]);
  const { openModal } = useModal();

  useEffect(() => {
    MockApi.getAlerts().then(setAlerts);
  }, []);

  const toggle = async (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
    await MockApi.toggleAlert(id);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Alertas de Vagas</h1>
          <p className="text-onyx-muted mt-1">Receba oportunidades no seu email.</p>
        </div>
        <button 
            onClick={() => openModal('CREATE_ALERT')}
            className="flex items-center gap-2 bg-onyx-accent hover:bg-onyx-accentHover text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Criar Alerta
        </button>
      </div>

      <div className="space-y-4">
        {alerts.map(alert => (
          <div key={alert.id} className="bg-onyx-800 p-6 rounded-xl border border-onyx-700 flex items-center justify-between group hover:border-onyx-600 transition-colors">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${alert.active ? 'bg-onyx-accent/10 text-onyx-accent' : 'bg-onyx-900 text-onyx-muted'}`}>
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h3 className={`font-semibold text-lg ${alert.active ? 'text-white' : 'text-onyx-muted'}`}>{alert.name}</h3>
                <div className="flex gap-2 mt-2">
                   {alert.filters.area && <span className="text-xs bg-onyx-900 text-onyx-muted px-2 py-1 rounded">{alert.filters.area}</span>}
                   {alert.filters.currency && <span className="text-xs bg-onyx-900 text-onyx-muted px-2 py-1 rounded">{alert.filters.currency}</span>}
                   {alert.filters.level && <span className="text-xs bg-onyx-900 text-onyx-muted px-2 py-1 rounded">{alert.filters.level}</span>}
                   <span className="text-xs bg-onyx-900 text-onyx-muted px-2 py-1 rounded capitalize">{alert.frequency.toLowerCase()}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button onClick={() => toggle(alert.id)} className="text-onyx-muted hover:text-white transition-colors">
                {alert.active ? <ToggleRight className="w-8 h-8 text-onyx-accent" /> : <ToggleLeft className="w-8 h-8" />}
              </button>
              <button className="text-onyx-muted hover:text-red-400 transition-colors p-2">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};