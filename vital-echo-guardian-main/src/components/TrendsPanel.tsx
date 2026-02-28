import { useState, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, Minus, Calendar, Activity, Heart, Moon, Mic } from 'lucide-react';

interface TrendsPanelProps {
  prediction: import('@/lib/prediction').PredictionResult | null;
}

const generateTrendData = (days: number) => {
  const data = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    // Generate realistic trend data
    const baseRisk = 40 + Math.sin(i * 0.3) * 15;
    const baseHRV = 55 + Math.sin(i * 0.5) * 15;
    const baseSleep = 7 + Math.sin(i * 0.4) * 1.5;
    const baseStress = 0.3 + Math.sin(i * 0.6) * 0.2;
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      riskScore: Math.max(10, Math.min(90, Math.round(baseRisk + (Math.random() - 0.5) * 10))),
      hrv: Math.max(20, Math.min(100, Math.round(baseHRV + (Math.random() - 0.5) * 10))),
      sleepHours: Math.max(4, Math.min(10, +(baseSleep + (Math.random() - 0.5) * 1).toFixed(1))),
      stress: Math.max(0, Math.min(1, +(baseStress + (Math.random() - 0.5) * 0.2).toFixed(2))),
    });
  }
  return data;
};

const TrendsPanel = ({ prediction }: TrendsPanelProps) => {
  const [timeRange, setTimeRange] = useState<'7' | '30' | 'custom'>('7');

  const trendData = useMemo(() => {
    const days = timeRange === '7' ? 7 : timeRange === '30' ? 30 : 14;
    return generateTrendData(days);
  }, [timeRange]);

  // Calculate week-over-week comparisons
  const comparisons = useMemo(() => {
    if (trendData.length < 7) return null;
    
    const thisWeek = trendData.slice(-7);
    const lastWeek = trendData.slice(-14, -7);
    
    const avg = (arr: typeof trendData, key: string) => 
      arr.reduce((sum, d) => sum + (d as any)[key], 0) / arr.length;
    
    const thisWeekRisk = avg(thisWeek, 'riskScore');
    const lastWeekRisk = avg(lastWeek, 'riskScore');
    const riskChange = +(thisWeekRisk - lastWeekRisk).toFixed(1);
    
    const thisWeekSleep = avg(thisWeek, 'sleepHours');
    const lastWeekSleep = avg(lastWeek, 'sleepHours');
    const sleepChange = +(thisWeekSleep - lastWeekSleep).toFixed(1);
    
    const thisWeekHRV = avg(thisWeek, 'hrv');
    const lastWeekHRV = avg(lastWeek, 'hrv');
    const hrvChange = +(thisWeekHRV - lastWeekHRV).toFixed(1);
    
    const thisWeekStress = avg(thisWeek, 'stress');
    const lastWeekStress = avg(lastWeek, 'stress');
    const stressChange = +((thisWeekStress - lastWeekStress) * 100).toFixed(0);
    
    return { riskChange, sleepChange, hrvChange, stressChange };
  }, [trendData]);

  const timeFilters = [
    { value: '7', label: 'Last 7 Days' },
    { value: '30', label: 'Last 30 Days' },
    { value: 'custom', label: 'Custom Range' },
  ];

  return (
    <div className="glass-card-hover p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          <h3 className="font-display font-semibold text-foreground">Health Trends</h3>
        </div>
        
        {/* Time Filters */}
        <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-lg">
          {timeFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setTimeRange(filter.value as '7' | '30' | 'custom')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                timeRange === filter.value
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Box */}
      {comparisons && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-3 rounded-xl bg-muted/30">
            <div className="flex items-center gap-2 mb-1">
              {comparisons.riskChange > 0 ? (
                <TrendingUp className="w-4 h-4 text-risk-high" />
              ) : comparisons.riskChange < 0 ? (
                <TrendingDown className="w-4 h-4 text-risk-low" />
              ) : (
                <Minus className="w-4 h-4 text-muted-foreground" />
              )}
              <span className="text-xs text-muted-foreground">Risk Score</span>
            </div>
            <p className={`text-lg font-bold ${
              comparisons.riskChange > 0 ? 'text-risk-high' : 
              comparisons.riskChange < 0 ? 'text-risk-low' : 'text-foreground'
            }`}>
              {comparisons.riskChange > 0 ? '+' : ''}{comparisons.riskChange}%
            </p>
          </div>
          
          <div className="p-3 rounded-xl bg-muted/30">
            <div className="flex items-center gap-2 mb-1">
              <Moon className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Sleep</span>
            </div>
            <p className={`text-lg font-bold ${
              comparisons.sleepChange > 0 ? 'text-risk-low' : 
              comparisons.sleepChange < 0 ? 'text-risk-high' : 'text-foreground'
            }`}>
              {comparisons.sleepChange > 0 ? '+' : ''}{comparisons.sleepChange} hrs
            </p>
          </div>
          
          <div className="p-3 rounded-xl bg-muted/30">
            <div className="flex items-center gap-2 mb-1">
              <Heart className="w-4 h-4 text-risk-moderate" />
              <span className="text-xs text-muted-foreground">HRV</span>
            </div>
            <p className={`text-lg font-bold ${
              comparisons.hrvChange > 0 ? 'text-risk-low' : 
              comparisons.hrvChange < 0 ? 'text-risk-high' : 'text-foreground'
            }`}>
              {comparisons.hrvChange > 0 ? '+' : ''}{comparisons.hrvChange} ms
            </p>
          </div>
          
          <div className="p-3 rounded-xl bg-muted/30">
            <div className="flex items-center gap-2 mb-1">
              <Mic className="w-4 h-4 text-risk-high" />
              <span className="text-xs text-muted-foreground">Stress</span>
            </div>
            <p className={`text-lg font-bold ${
              comparisons.stressChange < 0 ? 'text-risk-low' : 
              comparisons.stressChange > 0 ? 'text-risk-high' : 'text-foreground'
            }`}>
              {comparisons.stressChange > 0 ? '+' : ''}{comparisons.stressChange}%
            </p>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Score Trend */}
        <div className="p-4 rounded-xl bg-muted/20">
          <h4 className="text-sm font-medium text-foreground mb-3">Risk Score Trend</h4>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 20%, 90%)" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(240, 10%, 60%)" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(240, 10%, 60%)" domain={[0, 100]} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', fontSize: '12px' }} />
              <Line 
                type="monotone" 
                dataKey="riskScore" 
                stroke="hsl(240, 50%, 75%)" 
                strokeWidth={2} 
                dot={false}
                name="Risk Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* HRV Trend */}
        <div className="p-4 rounded-xl bg-muted/20">
          <h4 className="text-sm font-medium text-foreground mb-3">HRV Trend</h4>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 20%, 90%)" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(240, 10%, 60%)" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(240, 10%, 60%)" />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', fontSize: '12px' }} />
              <Line 
                type="monotone" 
                dataKey="hrv" 
                stroke="hsl(150, 55%, 50%)" 
                strokeWidth={2} 
                dot={false}
                name="HRV (ms)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Sleep Hours Trend */}
        <div className="p-4 rounded-xl bg-muted/20">
          <h4 className="text-sm font-medium text-foreground mb-3">Sleep Hours Trend</h4>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 20%, 90%)" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(240, 10%, 60%)" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(240, 10%, 60%)" domain={[0, 12]} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', fontSize: '12px' }} />
              <Line 
                type="monotone" 
                dataKey="sleepHours" 
                stroke="hsl(210, 62%, 66%)" 
                strokeWidth={2} 
                dot={false}
                name="Sleep (hrs)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Stress Levels Bar Chart */}
        <div className="p-4 rounded-xl bg-muted/20">
          <h4 className="text-sm font-medium text-foreground mb-3">Stress Levels (Weekly)</h4>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={trendData.slice(-7)}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 20%, 90%)" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(240, 10%, 60%)" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(240, 10%, 60%)" domain={[0, 1]} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', fontSize: '12px' }}
                formatter={(value: number) => [`${(value * 100).toFixed(0)}%`, 'Stress']}
              />
              <Bar 
                dataKey="stress" 
                fill="hsl(0, 75%, 58%)" 
                radius={[4, 4, 0, 0]}
                name="Stress Level"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TrendsPanel;
