import { AlertTriangle, CheckCircle, Info, ShieldAlert } from 'lucide-react';

interface AdvisoryPanelProps {
  advice: string[];
  riskLevel: 'Low' | 'Moderate' | 'High';
}

const AdvisoryPanel = ({ advice, riskLevel }: AdvisoryPanelProps) => {
  const config = {
    Low: { icon: CheckCircle, bg: 'bg-risk-low/10', border: 'border-risk-low/20', iconColor: 'text-risk-low', title: 'Looking Good!' },
    Moderate: { icon: Info, bg: 'bg-risk-moderate/10', border: 'border-risk-moderate/20', iconColor: 'text-risk-moderate', title: 'Attention Recommended' },
    High: { icon: ShieldAlert, bg: 'bg-risk-high/10', border: 'border-risk-high/20', iconColor: 'text-risk-high', title: 'Action Required' },
  };

  const c = config[riskLevel];
  const Icon = c.icon;

  return (
    <div className="glass-card p-6">
      <h3 className="font-display font-semibold text-foreground mb-3">Preventive Advisory</h3>
      <div className={`${c.bg} border ${c.border} rounded-xl p-4 mb-4`}>
        <div className="flex items-center gap-2 mb-2">
          <Icon className={`w-5 h-5 ${c.iconColor}`} />
          <span className={`font-semibold ${c.iconColor}`}>{c.title}</span>
        </div>
      </div>
      <ul className="space-y-3">
        {advice.map((a, i) => (
          <li key={i} className="flex gap-3 text-sm text-foreground/80">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
            <span>{a}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdvisoryPanel;
