// Simulated ML prediction engine for VitalEcho
// In production, this would call a FastAPI backend

export interface HealthInput {
  hrv: number;          // Heart Rate Variability (ms) - typical 20-100
  sleepHours: number;   // Hours of sleep - typical 4-10
  sleepIrregularity: number; // 0-10 scale
  steps: number;        // Daily step count - typical 1000-15000
  voiceStress: number;  // 0-1 scale
}

export interface PredictionResult {
  riskLevel: 'Low' | 'Moderate' | 'High';
  healthScore: number;  // 0-100
  probabilities: { low: number; moderate: number; high: number };
  featureImportance: { feature: string; importance: number }[];
  advice: string[];
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: number[][];
}

// Simulated feature weights (would come from trained Random Forest)
const WEIGHTS = {
  hrv: 0.28,
  sleepHours: 0.22,
  sleepIrregularity: 0.20,
  steps: 0.17,
  voiceStress: 0.13,
};

function normalize(value: number, min: number, max: number): number {
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

export function predict(input: HealthInput): PredictionResult {
  // Normalize inputs to 0-1 risk scale (higher = worse)
  const hrvRisk = 1 - normalize(input.hrv, 20, 80);
  const sleepRisk = 1 - normalize(input.sleepHours, 4, 9);
  const irregularityRisk = normalize(input.sleepIrregularity, 0, 10);
  const stepsRisk = 1 - normalize(input.steps, 2000, 12000);
  const voiceRisk = normalize(input.voiceStress, 0, 1);

  // Weighted risk score
  const riskScore =
    hrvRisk * WEIGHTS.hrv +
    sleepRisk * WEIGHTS.sleepHours +
    irregularityRisk * WEIGHTS.sleepIrregularity +
    stepsRisk * WEIGHTS.steps +
    voiceRisk * WEIGHTS.voiceStress;

  const healthScore = Math.round((1 - riskScore) * 100);

  // Simulate probability distribution
  let probabilities: { low: number; moderate: number; high: number };
  let riskLevel: 'Low' | 'Moderate' | 'High';

  if (riskScore < 0.35) {
    riskLevel = 'Low';
    probabilities = {
      low: +(0.6 + Math.random() * 0.2).toFixed(2),
      moderate: +(0.1 + Math.random() * 0.15).toFixed(2),
      high: +(0.02 + Math.random() * 0.08).toFixed(2),
    };
  } else if (riskScore < 0.65) {
    riskLevel = 'Moderate';
    probabilities = {
      low: +(0.15 + Math.random() * 0.15).toFixed(2),
      moderate: +(0.5 + Math.random() * 0.2).toFixed(2),
      high: +(0.1 + Math.random() * 0.15).toFixed(2),
    };
  } else {
    riskLevel = 'High';
    probabilities = {
      low: +(0.03 + Math.random() * 0.07).toFixed(2),
      moderate: +(0.1 + Math.random() * 0.15).toFixed(2),
      high: +(0.6 + Math.random() * 0.2).toFixed(2),
    };
  }

  // Normalize probabilities to sum to 1
  const total = probabilities.low + probabilities.moderate + probabilities.high;
  probabilities.low = +(probabilities.low / total).toFixed(2);
  probabilities.moderate = +(probabilities.moderate / total).toFixed(2);
  probabilities.high = +(1 - probabilities.low - probabilities.moderate).toFixed(2);

  const featureImportance = [
    { feature: 'Heart Rate Variability', importance: +(hrvRisk * WEIGHTS.hrv * 100 / riskScore).toFixed(1) },
    { feature: 'Sleep Duration', importance: +(sleepRisk * WEIGHTS.sleepHours * 100 / riskScore).toFixed(1) },
    { feature: 'Sleep Irregularity', importance: +(irregularityRisk * WEIGHTS.sleepIrregularity * 100 / riskScore).toFixed(1) },
    { feature: 'Daily Steps', importance: +(stepsRisk * WEIGHTS.steps * 100 / riskScore).toFixed(1) },
    { feature: 'Voice Stress', importance: +(voiceRisk * WEIGHTS.voiceStress * 100 / riskScore).toFixed(1) },
  ];

  // Preventive advice
  const advice: string[] = [];
  if (hrvRisk > 0.5) advice.push('Your HRV is below optimal. Practice deep breathing, meditation, or yoga to improve autonomic nervous system balance.');
  if (sleepRisk > 0.5) advice.push('You may not be getting enough sleep. Aim for 7-9 hours per night for optimal health recovery.');
  if (irregularityRisk > 0.5) advice.push('Your sleep schedule is irregular. Try to maintain consistent sleep and wake times, even on weekends.');
  if (stepsRisk > 0.5) advice.push('Your daily activity is below recommended levels. Aim for at least 7,000-10,000 steps per day.');
  if (voiceRisk > 0.5) advice.push('Elevated voice stress detected. Consider stress-reduction techniques like mindfulness or professional counseling.');
  if (riskLevel === 'High') advice.push('⚠️ Your overall risk is high. We strongly recommend scheduling a medical consultation soon.');
  if (advice.length === 0) advice.push('Great job! Your health indicators look good. Keep maintaining your healthy lifestyle.');

  return { riskLevel, healthScore, probabilities, featureImportance, advice };
}

export function getModelMetrics(): ModelMetrics {
  return {
    accuracy: 0.934,
    precision: 0.921,
    recall: 0.918,
    f1Score: 0.919,
    confusionMatrix: [
      [142, 5, 1],
      [7, 128, 8],
      [2, 6, 131],
    ],
  };
}

// Generate synthetic trend data
export function generateTrendData(days: number = 14) {
  const data = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const base = 50 + Math.sin(i * 0.5) * 15;
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      hrv: Math.round(base + Math.random() * 20),
      steps: Math.round(5000 + Math.random() * 8000 + Math.sin(i) * 2000),
      sleepHours: +(5 + Math.random() * 4).toFixed(1),
      riskScore: Math.round(30 + Math.sin(i * 0.3) * 20 + Math.random() * 15),
    });
  }
  return data;
}

// Generate 7-day projection
export function generateProjection(trendData: ReturnType<typeof generateTrendData>) {
  const last5 = trendData.slice(-5);
  const avgRisk = last5.reduce((s, d) => s + d.riskScore, 0) / 5;
  const trend = (last5[4].riskScore - last5[0].riskScore) / 4;
  
  const projection = [];
  const now = new Date();
  for (let i = 1; i <= 7; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i);
    projection.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      riskScore: Math.round(Math.max(5, Math.min(95, avgRisk + trend * i + (Math.random() - 0.5) * 5))),
      projected: true,
    });
  }
  return projection;
}
