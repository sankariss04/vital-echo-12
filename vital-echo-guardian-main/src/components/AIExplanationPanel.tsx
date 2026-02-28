import { Brain, TrendingUp, TrendingDown, Activity, Moon, Footprints, Mic, Heart } from 'lucide-react';
import type { PredictionResult, HealthInput } from '@/lib/prediction';
import { useMemo } from 'react';

interface AIExplanationPanelProps {
  prediction: PredictionResult;
  healthInput: HealthInput;
}

const AIExplanationPanel = ({ prediction, healthInput }: AIExplanationPanelProps) => {
  // Generate explanations based on health input and feature importance
  const explanations = useMemo(() => {
    const exp: { text: string; impact: 'high' | 'medium' | 'low'; factor: string }[] = [];
    
    // HRV explanation
    if (healthInput.hrv < 40) {
      exp.push({ 
        text: 'Low HRV indicates possible stress overload', 
        impact: 'high',
        factor: 'Heart Rate Variability'
      });
    } else if (healthInput.hrv < 55) {
      exp.push({ 
        text: 'Your HRV is below optimal range', 
        impact: 'medium',
        factor: 'Heart Rate Variability'
      });
    }

    // Sleep hours explanation
    if (healthInput.sleepHours < 6) {
      const deficit = 7 - healthInput.sleepHours;
      exp.push({ 
        text: `Sleep deprivation increased risk by ${Math.round(deficit * 8)}%`, 
        impact: 'high',
        factor: 'Sleep Duration'
      });
    } else if (healthInput.sleepHours < 7) {
      exp.push({ 
        text: 'Slightly reduced sleep may impact recovery', 
        impact: 'low',
        factor: 'Sleep Duration'
      });
    }

    // Sleep irregularity explanation
    if (healthInput.sleepIrregularity > 5) {
      exp.push({ 
        text: `Your sleep irregularity increased risk by ${Math.round(healthInput.sleepIrregularity * 5)}%`, 
        impact: 'high',
        factor: 'Sleep Irregularity'
      });
    }

    // Steps explanation
    if (healthInput.steps < 5000) {
      const diff = Math.round((5000 - healthInput.steps) / 100);
      exp.push({ 
        text: `Low activity level increased risk by ${diff}%`, 
        impact: 'medium',
        factor: 'Daily Steps'
      });
    } else if (healthInput.steps < 7000) {
      exp.push({ 
        text: 'Below target activity level', 
        impact: 'low',
        factor: 'Daily Steps'
      });
    }

    // Voice stress explanation
    if (healthInput.voiceStress > 0.5) {
      exp.push({ 
        text: `Elevated voice stress markers detected (+${Math.round(healthInput.voiceStress * 30)}%)`, 
        impact: 'medium',
        factor: 'Voice Stress'
      });
    }

    return exp.slice(0, 4); // Limit to 4 explanations
  }, [healthInput]);

  // Generate smart recommendations
  const recommendations = useMemo(() => {
    const recs: { text: string; icon: React.ReactNode; priority: 'high' | 'medium' | 'low' }[] = [];
    
    // HRV recommendations
    if (healthInput.hrv < 55) {
      recs.push({
        text: 'Practice deep breathing exercises for 10 minutes daily',
        icon: <Heart className="w-4 h-4" />,
        priority: healthInput.hrv < 40 ? 'high' : 'medium'
      });
      recs.push({
        text: 'Try meditation or yoga to improve autonomic balance',
        icon: <Activity className="w-4 h-4" />,
        priority: 'medium'
      });
    }

    // Sleep recommendations
    if (healthInput.sleepHours < 7) {
      const targetHours = 8;
      recs.push({
        text: `Improve sleep by ${targetHours - healthInput.sleepHours} hour${targetHours - healthInput.sleepHours > 1 ? 's' : ''}`,
        icon: <Moon className="w-4 h-4" />,
        priority: 'high'
      });
    }

    if (healthInput.sleepIrregularity > 3) {
      recs.push({
        text: 'Maintain consistent sleep schedule (same time daily)',
        icon: <Moon className="w-4 h-4" />,
        priority: 'medium'
      });
    }

    // Activity recommendations
    const targetSteps = 9000;
    if (healthInput.steps < targetSteps) {
      recs.push({
        text: `Increase daily steps to ${targetSteps}`,
        icon: <Footprints className="w-4 h-4" />,
        priority: healthInput.steps < 5000 ? 'high' : 'medium'
      });
    }

    // Stress recommendations
    if (healthInput.voiceStress > 0.4) {
      recs.push({
        text: 'Reduce stress with breathing exercises',
        icon: <Mic className="w-4 h-4" />,
        priority: 'medium'
      });
      recs.push({
        text: 'Consider mindfulness or professional counseling',
        icon: <Brain className="w-4 h-4" />,
        priority: 'low'
      });
    }

    // If no specific recommendations, add positive ones
    if (recs.length === 0) {
      recs.push({
        text: 'Keep maintaining your healthy lifestyle!',
        icon: <Activity className="w-4 h-4" />,
        priority: 'low'
      });
    }

    return recs.slice(0, 4); // Limit to 4 recommendations
  }, [healthInput]);

  const impactColors = {
    high: 'text-risk-high bg-risk-high/10 border-risk-high/20',
    medium: 'text-risk-moderate bg-risk-moderate/10 border-risk-moderate/20',
    low: 'text-risk-low bg-risk-low/10 border-risk-low/20',
  };

  const priorityColors = {
    high: 'text-risk-high',
    medium: 'text-risk-moderate',
    low: 'text-risk-low',
  };

  return (
    <div className="glass-card-hover p-6 animate-slide-up" style={{ animationDelay: '0.15s' }}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Brain className="w-4 h-4 text-white" />
        </div>
        <h3 className="font-display font-semibold text-foreground">AI Explanation</h3>
      </div>

      {/* Factor Contributions Bar Chart */}
      <div className="mb-6">
        <p className="text-xs text-muted-foreground mb-3">Factor Contribution Breakdown</p>
        <div className="space-y-2">
          {prediction.featureImportance
            .sort((a, b) => b.importance - a.importance)
            .map((item, idx) => (
              <div key={item.feature} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-24 truncate">{item.feature}</span>
                <div className="flex-1 h-4 bg-muted/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-700"
                    style={{ width: `${Math.min(100, item.importance)}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-foreground w-10 text-right">{item.importance}%</span>
              </div>
            ))}
        </div>
      </div>

      {/* AI Explanations */}
      <div className="mb-6">
        <div className="flex items-center gap-1 mb-3">
          <TrendingDown className="w-4 h-4 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">Risk Factors Identified</p>
        </div>
        <div className="space-y-2">
          {explanations.map((exp, idx) => (
            <div 
              key={idx}
              className={`flex items-center gap-2 p-2 rounded-lg border ${impactColors[exp.impact]}`}
            >
              {exp.impact === 'high' ? (
                <TrendingUp className="w-4 h-4 shrink-0" />
              ) : exp.impact === 'medium' ? (
                <TrendingDown className="w-4 h-4 shrink-0" />
              ) : (
                <Activity className="w-4 h-4 shrink-0" />
              )}
              <span className="text-sm">{exp.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Recommendations */}
      <div>
        <div className="flex items-center gap-1 mb-3">
          <Brain className="w-4 h-4 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">Smart Recommendations</p>
        </div>
        <div className="space-y-2">
          {recommendations.map((rec, idx) => (
            <div 
              key={idx}
              className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className={`w-8 h-8 rounded-lg ${priorityColors[rec.priority]} bg-current/10 flex items-center justify-center shrink-0`}>
                {rec.icon}
              </div>
              <span className="text-sm text-foreground">{rec.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIExplanationPanel;
