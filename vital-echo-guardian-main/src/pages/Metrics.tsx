import DashboardNav from '@/components/DashboardNav';
import { getModelMetrics } from '@/lib/prediction';
import { useMemo } from 'react';

const Metrics = () => {
  const metrics = useMemo(() => getModelMetrics(), []);
  const labels = ['Low Risk', 'Moderate Risk', 'High Risk'];

  const cards = [
    { label: 'Accuracy', value: metrics.accuracy, color: 'gradient-lavender' },
    { label: 'Precision', value: metrics.precision, color: 'gradient-mint' },
    { label: 'Recall', value: metrics.recall, color: 'gradient-pink' },
    { label: 'F1 Score', value: metrics.f1Score, color: 'gradient-health' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl font-display font-bold text-foreground">Model Performance</h1>
          <p className="text-muted-foreground mt-1">Random Forest classifier metrics on validation dataset</p>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-slide-up">
          {cards.map((c, i) => (
            <div key={c.label} className={`${c.color} rounded-2xl p-5 shadow-card hover-lift`} style={{ animationDelay: `${i * 0.1}s` }}>
              <p className="text-sm text-foreground/60 font-medium">{c.label}</p>
              <p className="text-3xl font-display font-bold text-foreground mt-1">
                {(c.value * 100).toFixed(1)}%
              </p>
            </div>
          ))}
        </div>

        {/* Confusion Matrix */}
        <div className="glass-card-hover p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h3 className="font-display font-semibold text-foreground mb-4">Confusion Matrix</h3>
          <div className="overflow-x-auto">
            <table className="w-full max-w-lg mx-auto">
              <thead>
                <tr>
                  <th className="p-3 text-sm text-muted-foreground"></th>
                  {labels.map(l => (
                    <th key={l} className="p-3 text-sm font-medium text-foreground text-center">{l}<br /><span className="text-xs text-muted-foreground">(Predicted)</span></th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {metrics.confusionMatrix.map((row, i) => (
                  <tr key={i}>
                    <td className="p-3 text-sm font-medium text-foreground">{labels[i]}<br /><span className="text-xs text-muted-foreground">(Actual)</span></td>
                    {row.map((val, j) => {
                      const isDiagonal = i === j;
                      return (
                        <td key={j} className="p-3 text-center">
                          <span className={`inline-flex items-center justify-center w-14 h-14 rounded-xl text-lg font-bold ${
                            isDiagonal ? 'bg-accent text-accent-foreground' : 'bg-muted/50 text-muted-foreground'
                          }`}>
                            {val}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-4 text-center">
            Trained on 1,290 synthetic samples • 430 per class • 70/30 train-test split
          </p>
        </div>

        {/* Model info */}
        <div className="glass-card-hover p-6 mt-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="font-display font-semibold text-foreground mb-3">Model Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between hover-lift p-2 rounded-lg"><span className="text-muted-foreground">Algorithm</span><span className="font-medium text-foreground">Random Forest</span></div>
              <div className="flex justify-between hover-lift p-2 rounded-lg"><span className="text-muted-foreground">Estimators</span><span className="font-medium text-foreground">100 trees</span></div>
              <div className="flex justify-between hover-lift p-2 rounded-lg"><span className="text-muted-foreground">Max Depth</span><span className="font-medium text-foreground">10</span></div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between hover-lift p-2 rounded-lg"><span className="text-muted-foreground">Features</span><span className="font-medium text-foreground">5 passive signals</span></div>
              <div className="flex justify-between hover-lift p-2 rounded-lg"><span className="text-muted-foreground">Classes</span><span className="font-medium text-foreground">3 (Low / Moderate / High)</span></div>
              <div className="flex justify-between hover-lift p-2 rounded-lg"><span className="text-muted-foreground">Cross-validation</span><span className="font-medium text-foreground">5-fold stratified</span></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Metrics;
