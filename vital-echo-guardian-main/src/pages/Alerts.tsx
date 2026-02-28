import { useState } from 'react';
import DashboardNav from '@/components/DashboardNav';
import VoiceOutput from '@/components/VoiceOutput';
import { Bell, AlertTriangle, Moon, Activity, CheckCircle, XCircle, Clock, Settings } from 'lucide-react';

interface Alert {
  id: string;
  type: 'high-risk' | 'sleep-deficit' | 'stress-spike' | 'hrv-alert' | 'activity-alert';
  title: string;
  message: string;
  date: string;
  status: 'resolved' | 'ongoing';
}

const generateMockAlerts = (): Alert[] => {
  const now = new Date();
  return [
    {
      id: '1',
      type: 'high-risk',
      title: 'High Risk Detected',
      message: 'Your overall health risk has elevated to HIGH. Immediate action recommended.',
      date: new Date(now.getTime() - 2 * 60 * 60 * 1000).toLocaleString(),
      status: 'ongoing',
    },
    {
      id: '2',
      type: 'sleep-deficit',
      title: 'Sleep Deficit Alert',
      message: 'You have been getting below 6 hours of sleep for 3 consecutive days.',
      date: new Date(now.getTime() - 24 * 60 * 60 * 1000).toLocaleString(),
      status: 'ongoing',
    },
    {
      id: '3',
      type: 'stress-spike',
      title: 'Stress Spike Alert',
      message: 'Unusual voice stress patterns detected. Consider stress management techniques.',
      date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toLocaleString(),
      status: 'resolved',
    },
    {
      id: '4',
      type: 'hrv-alert',
      title: 'HRV Below Normal',
      message: 'Your heart rate variability has dropped below optimal levels.',
      date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toLocaleString(),
      status: 'resolved',
    },
    {
      id: '5',
      type: 'activity-alert',
      title: 'Low Activity Alert',
      message: 'Daily steps below 5000 for the past week. Aim to increase activity.',
      date: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toLocaleString(),
      status: 'resolved',
    },
  ];
};

const AlertsPage = () => {
  const [alerts] = useState<Alert[]>(generateMockAlerts);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  const currentAlerts = alerts.filter(a => a.status === 'ongoing');
  const alertHistory = alerts.filter(a => a.status === 'resolved');

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'high-risk':
        return <AlertTriangle className="w-5 h-5" />;
      case 'sleep-deficit':
        return <Moon className="w-5 h-5" />;
      case 'stress-spike':
        return <Activity className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getAlertColor = (type: Alert['type'], status: Alert['status']) => {
    if (status === 'resolved') return 'bg-risk-low/10 border-risk-low/20 text-risk-low';
    switch (type) {
      case 'high-risk':
        return 'bg-risk-high/10 border-risk-high/20 text-risk-high';
      case 'sleep-deficit':
        return 'bg-risk-moderate/10 border-risk-moderate/20 text-risk-moderate';
      case 'stress-spike':
        return 'bg-risk-high/10 border-risk-high/20 text-risk-high';
      default:
        return 'bg-muted border-border text-foreground';
    }
  };

  const getAlertAdvice = () => {
    if (currentAlerts.length === 0) return ['No specific recommendations at this time.'];
    return currentAlerts.map(a => a.title + ': ' + a.message);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-32 w-96 h-96 rounded-full bg-pastel-lavender/30 blur-3xl animate-float" />
        <div className="absolute bottom-20 -right-32 w-80 h-80 rounded-full bg-pastel-mint/30 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <DashboardNav />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl gradient-pink flex items-center justify-center shadow-glow animate-pulse-soft">
              <Bell className="w-6 h-6 text-foreground" />
            </div>
            <h1 className="text-3xl font-display font-bold text-foreground">Health Alerts</h1>
          </div>
          <p className="text-muted-foreground ml-15">Monitor and manage your health alerts and notifications</p>
        </div>

        <div className="glass-card-hover p-6 mb-8 animate-slide-up relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl" />
          <div className="flex items-center justify-between relative">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Settings className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Enable Notifications</h3>
                <p className="text-sm text-muted-foreground">Receive alerts for health warnings</p>
              </div>
            </div>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                notificationsEnabled ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  notificationsEnabled ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-xl font-display font-semibold text-foreground mb-4">Current Alerts</h2>
          {currentAlerts.length === 0 ? (
            <div className="glass-card-hover p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-risk-low/10 to-transparent rounded-full blur-2xl" />
              <CheckCircle className="w-12 h-12 text-risk-low mx-auto mb-3" />
              <p className="text-foreground font-medium">All Clear!</p>
              <p className="text-muted-foreground text-sm">No active alerts at this time.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {currentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`glass-card-hover p-4 border-l-4 ${getAlertColor(alert.type, alert.status)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 mt-0.5">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{alert.title}</h3>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {alert.date}
                        </span>
                      </div>
                      <p className="text-sm mt-1 text-foreground/80">{alert.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-xl font-display font-semibold text-foreground mb-4">Alert History</h2>
          <div className="glass-card-hover overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-muted/20 to-transparent rounded-full blur-2xl" />
            <div className="overflow-x-auto relative">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Type</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Description</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {alertHistory.map((alert) => (
                    <tr key={alert.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="p-4 text-sm text-muted-foreground">{alert.date}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {getAlertIcon(alert.type)}
                          <span className="text-sm font-medium text-foreground">{alert.title}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-foreground/80 max-w-md">{alert.message}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          alert.status === 'resolved' 
                            ? 'bg-risk-low/10 text-risk-low' 
                            : 'bg-risk-high/10 text-risk-high'
                        }`}>
                          {alert.status === 'resolved' ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              Resolved
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" />
                              Ongoing
                            </>
                          )}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <VoiceOutput
        riskLevel={currentAlerts.length > 0 ? 'High' : 'Low'}
        healthScore={currentAlerts.length > 0 ? 30 : 80}
        advice={getAlertAdvice()}
      />
    </div>
  );
};

export default AlertsPage;
