import { useState } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

interface VoiceOutputProps {
  riskLevel: string;
  healthScore: number;
  advice: string[];
}

const VoiceOutput = ({ riskLevel, healthScore, advice }: VoiceOutputProps) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  const getRiskExplanation = (level: string) => {
    switch (level) {
      case 'Low':
        return 'Your health risk is low. This means you are in good health condition and should continue maintaining your healthy lifestyle.';
      case 'Moderate':
        return 'Your health risk is moderate. This indicates some areas may need attention. Please review the recommendations provided.';
      case 'High':
        return 'Your health risk is high. It is recommended that you consult with a healthcare professional for further evaluation.';
      default:
        return 'Your health status is being analyzed.';
    }
  };

  const getScoreExplanation = (score: number) => {
    if (score >= 70) return `Your health score is ${score} out of 100, which is excellent.`;
    if (score >= 40) return `Your health score is ${score} out of 100, which is moderate.`;
    return `Your health score is ${score} out of 100, which needs attention.`;
  };

  const generateSpeechText = () => {
    const riskText = getRiskExplanation(riskLevel);
    const scoreText = getScoreExplanation(healthScore);
    const adviceText = advice.length > 0 
      ? `Here are some recommendations: ${advice.slice(0, 3).map((a, i) => `${i + 1}. ${a}`).join('. ')}`
      : '';
    
    return `Hello. Welcome to your health analysis. ${scoreText} ${riskText} ${adviceText}. Thank you for using VitalEcho.`;
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      setSpeechSupported(false);
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const text = generateSpeechText();
    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleStop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  if (!speechSupported) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="glass-card-hover p-3 flex items-center gap-3">
        <button
          onClick={() => setIsEnabled(!isEnabled)}
          className={`p-2 rounded-xl transition-all ${
            isEnabled ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
          }`}
          title={isEnabled ? 'Disable voice output' : 'Enable voice output'}
        >
          {isEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
        
        {isEnabled && (
          <button
            onClick={isSpeaking ? handleStop : handleSpeak}
            className="p-2 rounded-xl bg-gradient-to-r from-primary to-accent text-white transition-all hover:scale-110"
            title={isSpeaking ? 'Stop speaking' : 'Read results aloud'}
          >
            {isSpeaking ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
        )}
        
        {isSpeaking && (
          <span className="text-xs text-muted-foreground animate-pulse">
            Speaking...
          </span>
        )}
      </div>
    </div>
  );
};

export default VoiceOutput;
