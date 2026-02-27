import { useState } from 'react';
import { Activity, Moon, Footprints, Mic, Heart, Loader2 } from 'lucide-react';
import type { HealthInput } from '@/lib/prediction';

interface HealthFormProps {
  onSubmit: (input: HealthInput) => void;
  loading?: boolean;
}

const fields = [
  { key: 'hrv' as const, label: 'Heart Rate Variability', icon: Heart, unit: 'ms', min: 10, max: 120, step: 1, defaultVal: 55, desc: 'Typical range: 20-80ms' },
  { key: 'sleepHours' as const, label: 'Sleep Hours', icon: Moon, unit: 'hrs', min: 2, max: 14, step: 0.5, defaultVal: 7, desc: 'Hours slept last night' },
  { key: 'sleepIrregularity' as const, label: 'Sleep Irregularity', icon: Activity, unit: '/10', min: 0, max: 10, step: 0.5, defaultVal: 3, desc: '0 = very regular, 10 = very irregular' },
  { key: 'steps' as const, label: 'Daily Step Count', icon: Footprints, unit: 'steps', min: 0, max: 25000, step: 500, defaultVal: 7000, desc: 'Steps taken today' },
  { key: 'voiceStress' as const, label: 'Voice Stress Level', icon: Mic, unit: '', min: 0, max: 1, step: 0.05, defaultVal: 0.3, desc: '0 = calm, 1 = stressed' },
];

const HealthForm = ({ onSubmit, loading }: HealthFormProps) => {
  const [values, setValues] = useState<HealthInput>({
    hrv: 55, sleepHours: 7, sleepIrregularity: 3, steps: 7000, voiceStress: 0.3,
  });

  const handleChange = (key: keyof HealthInput, val: number) => {
    setValues(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="glass-card p-6">
      <h3 className="font-display font-semibold text-foreground mb-4">Health Signal Input</h3>
      <div className="space-y-5">
        {fields.map(f => {
          const Icon = f.icon;
          return (
            <div key={f.key}>
              <div className="flex items-center gap-2 mb-1.5">
                <Icon className="w-4 h-4 text-primary" />
                <label className="text-sm font-medium text-foreground">{f.label}</label>
                <span className="ml-auto text-sm font-semibold text-primary">
                  {values[f.key]}{f.unit}
                </span>
              </div>
              <input
                type="range"
                min={f.min}
                max={f.max}
                step={f.step}
                value={values[f.key]}
                onChange={e => handleChange(f.key, parseFloat(e.target.value))}
                className="w-full h-2 rounded-full appearance-none bg-muted cursor-pointer accent-primary"
              />
              <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
            </div>
          );
        })}
      </div>
      <button
        onClick={() => onSubmit(values)}
        disabled={loading}
        className="w-full mt-6 py-3 rounded-xl bg-accent text-accent-foreground font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
        {loading ? 'Analyzing...' : 'Analyze Health Signals'}
      </button>
    </div>
  );
};

export default HealthForm;
