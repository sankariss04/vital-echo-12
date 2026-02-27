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

  return (
    <div className={`${gradients[riskLevel]} rounded-2xl p-6 shadow-card`}>
      <p className="text-sm font-medium text-foreground/60 mb-1">Health Score</p>
      <div className="flex items-baseline gap-2">
        <span className="text-5xl font-display font-bold text-foreground">{score}</span>
        <span className="text-lg text-foreground/50">/100</span>
      </div>
      <p className="text-sm text-foreground/60 mt-2">
        {riskLevel === 'Low' ? 'Your vitals look excellent!' : riskLevel === 'Moderate' ? 'Some areas need attention.' : 'Immediate action recommended.'}
      </p>
    </div>
  );
};

export default HealthScoreCard;
