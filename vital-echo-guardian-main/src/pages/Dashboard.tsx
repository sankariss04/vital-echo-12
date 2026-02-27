import { useState } from 'react';
import DashboardNav from '@/components/DashboardNav';
import HealthForm from '@/components/HealthForm';
import RiskGauge from '@/components/RiskGauge';
import HealthScoreCard from '@/components/HealthScoreCard';
import AdvisoryPanel from '@/components/AdvisoryPanel';
import DashboardCharts from '@/components/DashboardCharts';
import { predict, type HealthInput, type PredictionResult } from '@/lib/prediction';
import { toast } from 'sonner';

const Dashboard = () => {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (input: HealthInput) => {
    setLoading(true);
    // Simulate API call delay
    await new Promise(r => setTimeout(r, 1200));
    const result = predict(input);
    setPrediction(result);
    setLoading(false);
    toast.success(`Analysis complete: ${result.riskLevel} Risk`);
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl font-display font-bold text-foreground">Health Dashboard</h1>
          <p className="text-muted-foreground mt-1">Analyze your passive health signals for early disease risk detection</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Form */}
          <div className="lg:col-span-4 space-y-6 animate-slide-up">
            <HealthForm onSubmit={handleAnalyze} loading={loading} />
          </div>

          {/* Right: Results */}
          <div className="lg:col-span-8 space-y-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {/* Score cards row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <RiskGauge
                score={prediction?.healthScore ?? 72}
                riskLevel={prediction?.riskLevel ?? 'Low'}
              />
              <HealthScoreCard
                score={prediction?.healthScore ?? 72}
                riskLevel={prediction?.riskLevel ?? 'Low'}
              />
            </div>

            {/* Advisory */}
            {prediction && (
              <div className="animate-fade-in">
                <AdvisoryPanel advice={prediction.advice} riskLevel={prediction.riskLevel} />
              </div>
            )}
          </div>
        </div>

        {/* Charts section */}
        <div className="mt-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <DashboardCharts prediction={prediction} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
