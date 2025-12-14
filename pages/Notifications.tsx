
import React, { useEffect, useState } from 'react';
import { MockApi } from '../services/mockApi';
import { Notification } from '../types';
import { Bell, CheckCircle, AlertTriangle, Info, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    MockApi.getNotifications().then(data => {
        setNotifications(data);
        setLoading(false);
    });
  }, []);

  const handleMarkRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    MockApi.markNotificationRead(id);
  };

  const markAllRead = () => {
      const ids = notifications.map(n => n.id);
      setNotifications(prev => prev.map(n => ({...n, read: true})));
      ids.forEach(id => MockApi.markNotificationRead(id));
  };

  const getIcon = (type: Notification['type']) => {
      switch(type) {
          case 'SUCCESS': return <CheckCircle className="w-5 h-5 text-green-500" />;
          case 'WARNING': 
          case 'ALERT': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
          default: return <Info className="w-5 h-5 text-blue-500" />;
      }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-2xl font-bold text-white">Notificações</h1>
           <p className="text-onyx-muted mt-1">Acompanhe novidades e alertas da sua conta.</p>
        </div>
        <button 
            onClick={markAllRead}
            className="text-sm text-onyx-accent hover:text-white transition-colors"
        >
            Marcar todas como lidas
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
             [1,2,3].map(i => <div key={i} className="h-20 bg-onyx-800 rounded-xl animate-pulse" />)
        ) : notifications.length === 0 ? (
            <div className="text-center py-20 bg-onyx-800/30 rounded-xl border border-onyx-700 border-dashed">
                <Bell className="w-12 h-12 text-onyx-muted mx-auto mb-4" />
                <p className="text-onyx-muted">Nenhuma notificação por enquanto.</p>
            </div>
        ) : (
            notifications.map(notification => (
                <div 
                    key={notification.id} 
                    className={`bg-onyx-800 p-5 rounded-xl border transition-colors flex items-start gap-4 ${notification.read ? 'border-onyx-700 opacity-70' : 'border-onyx-600'}`}
                    onClick={() => handleMarkRead(notification.id)}
                >
                    <div className="mt-1 flex-shrink-0">
                        {getIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h3 className={`font-semibold ${notification.read ? 'text-onyx-muted' : 'text-white'}`}>{notification.title}</h3>
                            <span className="text-xs text-onyx-muted flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(notification.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <p className="text-onyx-muted text-sm mt-1">{notification.message}</p>
                        {notification.link && (
                            <Link to={notification.link} className="text-sm text-onyx-accent hover:underline mt-2 inline-block">
                                Ver detalhes
                            </Link>
                        )}
                    </div>
                    {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-onyx-accent flex-shrink-0 mt-2"></div>
                    )}
                </div>
            ))
        )}
      </div>
    </div>
  );
};
