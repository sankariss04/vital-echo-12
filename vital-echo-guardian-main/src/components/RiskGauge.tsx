import { Activity, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

interface RiskGaugeProps {
  score: number;
  riskLevel: 'Low' | 'Moderate' | 'High';
}

const RiskGauge = ({ score, riskLevel }: RiskGaugeProps) => {
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

  const icons = {
    Low: CheckCircle,
    Moderate: AlertCircle,
    High: AlertCircle,
  };

  const getRiskColor = () => {
    if (riskLevel === 'Low') return 'hsl(var(--risk-low))';
    if (riskLevel === 'Moderate') return 'hsl(var(--risk-moderate))';
    return 'hsl(var(--risk-high))';
  };

  const riskColor = getRiskColor();
  const radius = 70;
  const cx = 100;
  const cy = 95;
  
  const polarToCartesian = (centerX: number, centerY: number, r: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 180) * Math.PI) / 180.0;
    return {
      x: centerX + (r * Math.cos(angleInRadians)),
      y: centerY + (r * Math.sin(angleInRadians))
    };
  };

  const describeArc = (x: number, y: number, r: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, r, endAngle);
    const end = polarToCartesian(x, y, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
      "M", start.x, start.y, 
      "A", r, r, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
  };

  const scoreAngle = (score / 100) * 180;
  const Icon = icons[riskLevel];

  return (
    <div className="glass-card p-6 flex flex-col items-center h-full">
      <div className="flex items-center gap-2 mb-2">
        <TrendingUp className={`w-4 h-4 ${riskColors[riskLevel]}`} />
        <h3 className="text-sm font-medium text-foreground/70">Risk Assessment</h3>
      </div>
      
      <div className="relative w-48 h-24">
        <svg viewBox="0 0 200 110" className="w-full h-full overflow-visible">
          <path
            d={describeArc(cx, cy, radius, 0, 180)}
            fill="none"
            stroke="hsl(var(--muted) / 0.3)"
            strokeWidth="14"
            strokeLinecap="round"
          />
          
          {score > 0 && (
            <path
              d={describeArc(cx, cy, radius, 0, scoreAngle)}
              fill="none"
              stroke={riskColor}
              strokeWidth="14"
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          )}
          
          <line
            x1={cx}
            y1={cy}
            x2={cx + 50 * Math.cos(((scoreAngle - 180) * Math.PI) / 180)}
            y2={cy + 50 * Math.sin(((scoreAngle - 180) * Math.PI) / 180)}
            stroke="hsl(var(--foreground))"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
          
          <circle cx={cx} cy={cy} r="6" fill="hsl(var(--foreground))" />
        </svg>
      </div>
      
      <div className="flex items-center gap-2 mt-1">
        <Icon className={`w-5 h-5 ${riskColors[riskLevel]}`} />
        <span className={`text-4xl font-display font-bold ${riskColors[riskLevel]}`}>{score}</span>
        <span className="text-sm text-foreground/50">/100</span>
      </div>
      
      <span className={`mt-2 px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1.5 ${riskBg[riskLevel]} ${riskColors[riskLevel]}`}>
        <Activity className="w-3.5 h-3.5" />
        {riskLevel} Risk
      </span>
    </div>
  );
};

export default RiskGauge;
