import React, { useEffect, useRef, useState } from 'react';
import DashboardNav from '@/components/DashboardNav';

const formatNumber = (n: number) => n.toLocaleString();

const GoLive = () => {
  const [monitoring, setMonitoring] = useState(false);
  const [heartRate, setHeartRate] = useState(72);
  const [steps, setSteps] = useState(2450);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (monitoring) {
      intervalRef.current = window.setInterval(() => {
        setHeartRate(prev => {
          const next = Math.max(45, Math.min(140, Math.round(prev + (Math.random() * 6 - 3))));
          return next;
        });
        setSteps(prev => prev + Math.round(Math.random() * 5));
      }, 1000);
    }

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [monitoring]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <div className="animate-slide-up">
            <h1 className="text-3xl font-display font-bold">Live Health Monitoring</h1>
            <p className="text-muted-foreground">Real-time health signal tracking</p>
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <button
              onClick={() => setMonitoring(m => !m)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all shadow-soft hover:shadow-hover hover:scale-105 ${
                monitoring ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-green-100 text-green-800 hover:bg-green-200'
              }`}
            >
              {monitoring ? 'Stop Live Monitoring' : 'Start Live Monitoring'}
            </button>
          </div>
        </div>

        <div className="mb-6 p-6 rounded-2xl bg-card shadow-card hover-lift animate-slide-up" style={{ animationDelay: '0.15s' }}>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${monitoring ? 'bg-green-500 animate-pulse-soft' : 'bg-gray-300'}`} />
            <span className="text-sm text-muted-foreground">{monitoring ? 'Monitoring Active' : 'Monitoring Inactive'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card-hover p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Heart Rate</span>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold">{heartRate} <span className="text-base font-medium text-muted-foreground">bpm</span></div>
                <div className="text-sm text-muted-foreground">{heartRate >= 100 ? 'High' : heartRate < 60 ? 'Low' : 'Normal'}</div>
              </div>
            </div>
            <div className="h-3 mt-4 rounded-full bg-muted shadow-inner-glow">
              <div
                style={{ width: `${Math.min(100, Math.max(0, (heartRate - 40) / 1))}%` }}
                className={`h-3 rounded-full bg-gradient-to-r from-green-400 to-red-500`}
              />
            </div>
          </div>

          <div className="glass-card-hover p-6 animate-slide-up" style={{ animationDelay: '0.25s' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-sm text-muted-foreground">Daily Steps</span>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold">{formatNumber(steps)}</div>
                <div className="text-sm text-muted-foreground">{Math.min(100, Math.round((steps / 10000) * 100))}% of daily goal</div>
              </div>
            </div>
            <div className="h-3 mt-4 rounded-full bg-muted shadow-inner-glow">
              <div
                style={{ width: `${Math.min(100, (steps / 10000) * 100)}%` }}
                className="h-3 rounded-full bg-gradient-to-r from-emerald-300 to-violet-400"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 rounded-lg bg-muted/60 text-sm text-muted-foreground glass-card-hover animate-slide-up" style={{ animationDelay: '0.3s' }}>
          Live monitoring provides real-time insights into your health metrics. Ensure your devices are properly connected for accurate readings.
        </div>
      </main>
    </div>
  );
};

export default GoLive;
