import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import type { PredictionResult } from '@/lib/prediction';
import { generateTrendData, generateProjection } from '@/lib/prediction';
import { useMemo } from 'react';

const PASTEL_COLORS = ['hsl(150, 55%, 50%)', 'hsl(42, 90%, 55%)', 'hsl(0, 75%, 58%)'];
const FEATURE_COLORS = ['hsl(240, 67%, 82%)', 'hsl(210, 62%, 76%)', 'hsl(150, 65%, 75%)', 'hsl(330, 100%, 85%)', 'hsl(20, 100%, 85%)'];

interface ChartsProps {
  prediction: PredictionResult | null;
}

const DashboardCharts = ({ prediction }: ChartsProps) => {
  const trendData = useMemo(() => generateTrendData(14), []);
  const projection = useMemo(() => generateProjection(trendData), [trendData]);
  const combinedRiskData = useMemo(() => {
    const actual = trendData.map(d => ({ ...d, projected: false }));
    return [...actual, ...projection];
  }, [trendData, projection]);

  const pieData = prediction
    ? [
        { name: 'Low', value: prediction.probabilities.low },
        { name: 'Moderate', value: prediction.probabilities.moderate },
        { name: 'High', value: prediction.probabilities.high },
      ]
    : [{ name: 'Low', value: 0.33 }, { name: 'Moderate', value: 0.34 }, { name: 'High', value: 0.33 }];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* HRV Trend */}
      <div className="glass-card p-6">
        <h3 className="font-display font-semibold text-foreground mb-4">HRV Trend (14 Days)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 20%, 90%)" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(240, 10%, 60%)" />
            <YAxis tick={{ fontSize: 11 }} stroke="hsl(240, 10%, 60%)" />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }} />
            <Line type="monotone" dataKey="hrv" stroke="hsl(210, 62%, 66%)" strokeWidth={2.5} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Activity Bar */}
      <div className="glass-card p-6">
        <h3 className="font-display font-semibold text-foreground mb-4">Daily Steps</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 20%, 90%)" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(240, 10%, 60%)" />
            <YAxis tick={{ fontSize: 11 }} stroke="hsl(240, 10%, 60%)" />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }} />
            <Bar dataKey="steps" fill="hsl(150, 65%, 75%)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Risk Probability Pie */}
      <div className="glass-card p-6">
        <h3 className="font-display font-semibold text-foreground mb-4">Risk Probability</h3>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
              {pieData.map((_, i) => (
                <Cell key={i} fill={PASTEL_COLORS[i]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Feature Importance */}
      <div className="glass-card p-6">
        <h3 className="font-display font-semibold text-foreground mb-2">Why Am I At Risk?</h3>
        <p className="text-xs text-muted-foreground mb-4">Feature contribution to prediction</p>
        {prediction ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={prediction.featureImportance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 20%, 90%)" />
              <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(240, 10%, 60%)" unit="%" />
              <YAxis dataKey="feature" type="category" width={120} tick={{ fontSize: 10 }} stroke="hsl(240, 10%, 60%)" />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
              <Bar dataKey="importance" radius={[0, 6, 6, 0]}>
                {prediction.featureImportance.map((_, i) => (
                  <Cell key={i} fill={FEATURE_COLORS[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
            Run analysis to see feature importance
          </div>
        )}
      </div>

      {/* Risk Trend Projection */}
      <div className="glass-card p-6 lg:col-span-2">
        <h3 className="font-display font-semibold text-foreground mb-1">7-Day Risk Projection</h3>
        <p className="text-xs text-muted-foreground mb-4">Historical trend + projected risk (dashed)</p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={combinedRiskData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 20%, 90%)" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(240, 10%, 60%)" />
            <YAxis tick={{ fontSize: 11 }} stroke="hsl(240, 10%, 60%)" domain={[0, 100]} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
            <Line
              type="monotone"
              dataKey="riskScore"
              stroke="hsl(240, 50%, 75%)"
              strokeWidth={2.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardCharts;
