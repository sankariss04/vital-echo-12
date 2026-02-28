import { Heart, Activity, Shield, Zap } from 'lucide-react';

interface HealthScoreCardProps {
  score: number;
  riskLevel: 'Low' | 'Moderate' | 'High';
}

const HealthScoreCard = ({ score, riskLevel }: HealthScoreCardProps) => {
  const gradients = {
    Low: 'gradient-mint',
    Moderate: 'gradient-lavender',
    High: 'gradient-pink',
  };

  const icons = {
    Low: Shield,
    Moderate: Activity,
    High: Zap,
  };

  const iconColors = {
    Low: 'text-risk-low',
    Moderate: 'text-risk-moderate',
    High: 'text-risk-high',
  };

  const riskLabels = {
    Low: 'Your vitals look excellent!',
    Moderate: 'Some areas need attention.',
    High: 'Immediate action recommended.',
  };

  const Icon = icons[riskLevel];

  return (
    <div className="glass-card p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className={`${gradients[riskLevel]} rounded-xl p-3`}>
          <Heart className="w-6 h-6 text-foreground/80" />
        </div>
        <div className={`p-2 rounded-full bg-background/50`}>
          <Icon className={`w-5 h-5 ${iconColors[riskLevel]}`} />
        </div>
      </div>
      
      <div className={`${gradients[riskLevel]} rounded-xl p-4 -mx-2 mb-2`}>
        <p className="text-sm font-medium text-foreground/70 mb-1">Health Score</p>
        <div className="flex items-baseline gap-1">
          <span className="text-5xl font-display font-bold text-foreground">{score}</span>
          <span className="text-lg text-foreground/50">/100</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 mt-auto">
        <div className={`w-2 h-2 rounded-full ${riskLevel === 'Low' ? 'bg-risk-low' : riskLevel === 'Moderate' ? 'bg-risk-moderate' : 'bg-risk-high'}`} />
        <p className="text-sm text-foreground/70">
          {riskLabels[riskLevel]}
        </p>
      </div>
    </div>
  );
};

export default HealthScoreCard;
