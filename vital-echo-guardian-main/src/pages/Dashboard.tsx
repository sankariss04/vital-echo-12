import { useState } from 'react';
import DashboardNav from '@/components/DashboardNav';
import HealthForm from '@/components/HealthForm';
import RiskGauge from '@/components/RiskGauge';
import HealthScoreCard from '@/components/HealthScoreCard';
import AdvisoryPanel from '@/components/AdvisoryPanel';
import DashboardCharts from '@/components/DashboardCharts';
import AIExplanationPanel from '@/components/AIExplanationPanel';
import TrendsPanel from '@/components/TrendsPanel';
import VoiceOutput from '@/components/VoiceOutput';
import { predict, type HealthInput, type PredictionResult } from '@/lib/prediction';
import { toast } from 'sonner';

const Dashboard = () => {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [healthInput, setHealthInput] = useState<HealthInput | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (input: HealthInput) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    const result = predict(input);
    setPrediction(result);
    setHealthInput(input);
    setLoading(false);
    toast.success(`Analysis complete: ${result.riskLevel} Risk`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-32 w-96 h-96 rounded-full bg-pastel-lavender/30 blur-3xl animate-float" />
        <div className="absolute bottom-0 -right-32 w-80 h-80 rounded-full bg-pastel-mint/30 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <DashboardNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl font-display font-bold text-foreground">Health Dashboard</h1>
          <p className="text-foreground/70 mt-1">Analyze your passive health signals for early disease risk detection</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Form */}
          <div className="lg:col-span-4 space-y-6 animate-slide-up">
            <HealthForm onSubmit={handleAnalyze} loading={loading} />
          </div>

          {/* Right: Results */}
          <div className="lg:col-span-8 space-y-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {/* Score cards row - without extra wrapper borders */}
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

            {/* AI Explanation Panel */}
            {prediction && healthInput && (
              <div className="animate-fade-in">
                <AIExplanationPanel prediction={prediction} healthInput={healthInput} />
              </div>
            )}

            {/* Advisory */}
            {prediction && (
              <div className="animate-fade-in">
                <AdvisoryPanel advice={prediction.advice} riskLevel={prediction.riskLevel} />
              </div>
            )}
          </div>
        </div>

        {/* Trends Section */}
        {prediction && (
          <div className="mt-8 animate-slide-up" style={{ animationDelay: '0.15s' }}>
            <TrendsPanel prediction={prediction} />
          </div>
        )}

        {/* Charts section */}
        <div className="mt-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <DashboardCharts prediction={prediction} />
        </div>
      </main>

      {/* Voice Output Component */}
      {prediction && (
        <VoiceOutput
          riskLevel={prediction.riskLevel}
          healthScore={prediction.healthScore}
          advice={prediction.advice}
        />
      )}
    </div>
  );
};

export default Dashboard;
