interface RiskGaugeProps {
  score: number; // 0-100 health score
  riskLevel: 'Low' | 'Moderate' | 'High';
}

const RiskGauge = ({ score, riskLevel }: RiskGaugeProps) => {
  const angle = (score / 100) * 180 - 90; // -90 to 90 degrees
  const riskColors = {
    Low: 'text-risk-low',
    Moderate: 'text-risk-moderate',
    High: 'text-risk-high',
  };
  const riskBg = {
    Low: 'bg-risk-low/10',
    Moderate: 'bg-risk-moderate/10',
    High: 'bg-risk-high/10',
  };

  // SVG arc for the gauge
  const radius = 80;
  const cx = 100;
  const cy = 100;

  const polarToCartesian = (angle: number) => {
    const rad = ((angle - 180) * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  };

  const startAngle = 0;
  const endAngle = 180;
  const start = polarToCartesian(startAngle);
  const end = polarToCartesian(endAngle);
  const scoreEnd = polarToCartesian((score / 100) * 180);
  const largeArcFlag = score > 50 ? 1 : 0;

  return (
    <div className="glass-card p-6 flex flex-col items-center">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">Risk Assessment</h3>
      <div className="relative w-48 h-28">
        <svg viewBox="0 0 200 110" className="w-full h-full">
          {/* Background arc */}
          <path
            d={`M ${start.x} ${start.y} A ${radius} ${radius} 0 0 1 ${end.x} ${end.y}`}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Score arc */}
          {score > 0 && (
            <path
              d={`M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${scoreEnd.x} ${scoreEnd.y}`}
              fill="none"
              stroke={riskLevel === 'Low' ? 'hsl(var(--risk-low))' : riskLevel === 'Moderate' ? 'hsl(var(--risk-moderate))' : 'hsl(var(--risk-high))'}
              strokeWidth="12"
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          )}
          {/* Needle */}
          <line
            x1={cx}
            y1={cy}
            x2={cx + 55 * Math.cos(((angle - 180) * Math.PI) / 180)}
            y2={cy + 55 * Math.sin(((angle - 180) * Math.PI) / 180)}
            stroke="hsl(var(--foreground))"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
          <circle cx={cx} cy={cy} r="5" fill="hsl(var(--foreground))" />
        </svg>
      </div>
      <div className="text-center mt-2">
        <span className={`text-4xl font-display font-bold ${riskColors[riskLevel]}`}>{score}</span>
        <span className="text-sm text-muted-foreground ml-1">/100</span>
      </div>
      <span className={`mt-2 px-4 py-1 rounded-full text-sm font-medium ${riskBg[riskLevel]} ${riskColors[riskLevel]}`}>
        {riskLevel} Risk
      </span>
    </div>
  );
};

export default RiskGauge;
