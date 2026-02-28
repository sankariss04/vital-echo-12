import React, { useState, useEffect, useRef } from 'react';
import DashboardNav from '@/components/DashboardNav';

type StressLevel = 'HIGH' | 'MODERATE' | 'STABLE';

const calculateStressLevel = (
  hrv: number, 
  voiceStress: number, 
  sleepHours: number, 
  baselineHRV: number
): { level: StressLevel; flags: number } => {
  let flags = 0;

  // Rule 1: HRV < 40 → flag++
  if (hrv < 40) {
    flags++;
  }

  // Rule 2: Voice Stress > 0.65 → flag++
  if (voiceStress > 0.65) {
    flags++;
  }

  // Rule 3: Sleep < 5 → flag++
  if (sleepHours < 5) {
    flags++;
  }

  // Rule 4: HRV drop > 15% from baseline → flag++
  const hrvDropPercent = ((baselineHRV - hrv) / baselineHRV) * 100;
  if (hrvDropPercent > 15) {
    flags++;
  }

  // Classification
  let level: StressLevel;
  if (flags >= 2) {
    level = 'HIGH';
  } else if (flags === 1) {
    level = 'MODERATE';
  } else {
    level = 'STABLE';
  }

  return { level, flags };
};

const tabs = [
  { id: 'pulse-sync', label: 'Pulse Sync' },
  { id: 'mind-anchor', label: 'Mind Anchor' },
  { id: 'grounding', label: 'Grounding Challenge' },
];

// Pulse Sync Constants
const INHALE_DURATION = 4;
const HOLD_DURATION = 4;
const EXHALE_DURATION = 6;
const CYCLE_DURATION = INHALE_DURATION + HOLD_DURATION + EXHALE_DURATION;
const SESSION_DURATION = 120; // 2 minutes in seconds

// Echo Relax Constants
const ECHO_SESSION_DURATION = 180; // 3 minutes in seconds

// Mind Anchor Constants
const MIND_ANCHOR_DURATION = 120; // 2 minutes in seconds
const DOT_SPAWN_INTERVAL = 800; // 800ms

type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'idle';
type SoundType = 'rain' | 'ocean' | 'whitenoise' | null;
type DotColor = 'blue' | 'red';

interface Dot {
  id: number;
  x: number;
  y: number;
  color: DotColor;
}

// Sound URLs - using free ambient sound sources
const soundUrls: Record<string, string> = {
  rain: 'https://www.soundjay.com/nature/sounds/rain-01.mp3',
  ocean: 'https://www.soundjay.com/nature/sounds/ocean-wave-1.mp3',
  whitenoise: 'https://www.soundjay.com/nature/sounds/white-noise-1.mp3',
};

const StressRadar = () => {
  // Sample data - in real app, these would come from props or API
  const [hrv, setHrv] = useState(35);
  const [voiceStress] = useState(0.7);
  const [sleepHours] = useState(4);
  const [baselineHRV] = useState(50);
  const [activeTab, setActiveTab] = useState('pulse-sync');
  
  // Pulse Sync state
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(SESSION_DURATION);
  const [breathPhase, setBreathPhase] = useState<BreathPhase>('idle');
  const [phaseTimeRemaining, setPhaseTimeRemaining] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [hrvImprovement, setHrvImprovement] = useState<number | null>(null);

  // Echo Relax state
  const [selectedSound, setSelectedSound] = useState<SoundType>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [echoTimeRemaining, setEchoTimeRemaining] = useState(ECHO_SESSION_DURATION);

  // Mind Anchor state
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameTimeRemaining, setGameTimeRemaining] = useState(MIND_ANCHOR_DURATION);
  const [score, setScore] = useState(0);
  const [dots, setDots] = useState<Dot[]>([]);
  const [gameComplete, setGameComplete] = useState(false);

  // Grounding Challenge state
  const [thingsYouSee, setThingsYouSee] = useState(['', '', '', '', '']);
  const [thingsYouFeel, setThingsYouFeel] = useState(['', '', '', '']);
  const [thingsYouHear, setThingsYouHear] = useState(['', '', '']);
  const [thingsYouSmell, setThingsYouSmell] = useState(['', '']);
  const [gratefulFor, setGratefulFor] = useState('');
  const [groundingComplete, setGroundingComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  const pulseIntervalRef = useRef<number | null>(null);
  const echoIntervalRef = useRef<number | null>(null);
  const gameIntervalRef = useRef<number | null>(null);
  const dotIdRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { level, flags } = calculateStressLevel(hrv, voiceStress, sleepHours, baselineHRV);

  // Calculate circle size based on breath phase
  const getCircleSize = () => {
    switch (breathPhase) {
      case 'inhale':
        return 'w-32 h-32';
      case 'hold':
        return 'w-32 h-32';
      case 'exhale':
        return 'w-20 h-20';
      default:
        return 'w-24 h-24';
    }
  };

  const getPhaseLabel = () => {
    switch (breathPhase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      default:
        return 'Ready';
    }
  };

  // Session timer effect
  useEffect(() => {
    if (isSessionActive && timeRemaining > 0) {
      pulseIntervalRef.current = window.setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (pulseIntervalRef.current) {
        clearInterval(pulseIntervalRef.current);
      }
    };
  }, [isSessionActive, timeRemaining]);

  // Breath phase timing effect
  useEffect(() => {
    if (!isSessionActive) return;

    const elapsed = SESSION_DURATION - timeRemaining;
    const cyclePosition = elapsed % CYCLE_DURATION;

    let newPhase: BreathPhase;
    let newPhaseTime: number;

    if (cyclePosition < INHALE_DURATION) {
      newPhase = 'inhale';
      newPhaseTime = INHALE_DURATION - cyclePosition;
    } else if (cyclePosition < INHALE_DURATION + HOLD_DURATION) {
      newPhase = 'hold';
      newPhaseTime = INHALE_DURATION + HOLD_DURATION - cyclePosition;
    } else {
      newPhase = 'exhale';
      newPhaseTime = CYCLE_DURATION - cyclePosition;
    }

    setBreathPhase(newPhase);
    setPhaseTimeRemaining(newPhaseTime);

    // Check if session is complete
    if (timeRemaining === 0) {
      handleSessionComplete();
    }
  }, [timeRemaining, isSessionActive]);

  // Echo Relax timer effect
  useEffect(() => {
    if (isPlaying && echoTimeRemaining > 0) {
      echoIntervalRef.current = window.setInterval(() => {
        setEchoTimeRemaining((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (echoIntervalRef.current) {
        clearInterval(echoIntervalRef.current);
      }
    };
  }, [isPlaying, echoTimeRemaining]);

  // Auto stop after 3 minutes
  useEffect(() => {
    if (echoTimeRemaining === 0 && isPlaying) {
      handleStopSound();
    }
  }, [echoTimeRemaining, isPlaying]);

  // Mind Anchor game timer
  useEffect(() => {
    if (isGameActive && gameTimeRemaining > 0) {
      gameIntervalRef.current = window.setInterval(() => {
        setGameTimeRemaining((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current);
      }
    };
  }, [isGameActive, gameTimeRemaining]);

  // Spawn dots every 800ms
  useEffect(() => {
    if (!isGameActive) return;

    const spawnDot = () => {
      const newDot: Dot = {
        id: dotIdRef.current++,
        x: Math.random() * 80 + 10, // 10-90% from left
        y: Math.random() * 60 + 20, // 20-80% from top
        color: Math.random() > 0.5 ? 'blue' : 'red',
      };
      setDots((prev) => [...prev, newDot]);

      // Auto-remove dot after 1.5 seconds
      setTimeout(() => {
        setDots((prev) => prev.filter((d) => d.id !== newDot.id));
      }, 1500);
    };

    const spawnInterval = setInterval(spawnDot, DOT_SPAWN_INTERVAL);

    return () => clearInterval(spawnInterval);
  }, [isGameActive]);

  // Check game completion
  useEffect(() => {
    if (gameTimeRemaining === 0 && isGameActive) {
      setIsGameActive(false);
      setGameComplete(true);
      setDots([]);
    }
  }, [gameTimeRemaining, isGameActive]);

  const handleSessionComplete = () => {
    setIsSessionActive(false);
    setSessionComplete(true);
    setBreathPhase('idle');

    // Simulate HRV improvement (+5% to 10%)
    const improvementPercent = 5 + Math.random() * 5;
    const newHRV = Math.round(hrv * (1 + improvementPercent / 100));
    setHrvImprovement(improvementPercent);
    setHrv(newHRV);
  };

  const startSession = () => {
    setIsSessionActive(true);
    setTimeRemaining(SESSION_DURATION);
    setSessionComplete(false);
    setHrvImprovement(null);
    setBreathPhase('idle');
  };

  const resetSession = () => {
    setIsSessionActive(false);
    setSessionComplete(false);
    setTimeRemaining(SESSION_DURATION);
    setBreathPhase('idle');
    setHrvImprovement(null);
    if (pulseIntervalRef.current) {
      clearInterval(pulseIntervalRef.current);
    }
  };

  // Echo Relax handlers
  const handleSelectSound = (sound: SoundType) => {
    // Stop any current playback
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (echoIntervalRef.current) {
      clearInterval(echoIntervalRef.current);
    }
    
    setSelectedSound(sound);
    setIsPlaying(false);
    setEchoTimeRemaining(ECHO_SESSION_DURATION);

    // Create new audio element with the sound URL
    if (sound && soundUrls[sound]) {
      audioRef.current = new Audio(soundUrls[sound]);
      audioRef.current.loop = true;
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      if (echoIntervalRef.current) {
        clearInterval(echoIntervalRef.current);
      }
    } else {
      audioRef.current.play().catch(e => console.log('Audio play error:', e));
      echoIntervalRef.current = window.setInterval(() => {
        setEchoTimeRemaining((prev) => prev - 1);
      }, 1000);
    }
    setIsPlaying(!isPlaying);
  };

  const handleStopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (echoIntervalRef.current) {
      clearInterval(echoIntervalRef.current);
    }
    setIsPlaying(false);
    setSelectedSound(null);
    setEchoTimeRemaining(ECHO_SESSION_DURATION);
  };

  // Mind Anchor handlers
  const startGame = () => {
    setIsGameActive(true);
    setGameTimeRemaining(MIND_ANCHOR_DURATION);
    setScore(0);
    setDots([]);
    setGameComplete(false);
    dotIdRef.current = 0;
  };

  const handleDotClick = (dot: Dot) => {
    if (dot.color === 'blue') {
      setScore((prev) => prev + 1);
    } else {
      setScore((prev) => prev - 1);
    }
    // Remove clicked dot
    setDots((prev) => prev.filter((d) => d.id !== dot.id));
  };

  const resetGame = () => {
    setIsGameActive(false);
    setGameComplete(false);
    setGameTimeRemaining(MIND_ANCHOR_DURATION);
    setScore(0);
    setDots([]);
    if (gameIntervalRef.current) {
      clearInterval(gameIntervalRef.current);
    }
  };

  // Grounding Challenge handlers
  const startGrounding = () => {
    setCurrentStep(0);
    setThingsYouSee(['', '', '', '', '']);
    setThingsYouFeel(['', '', '', '']);
    setThingsYouHear(['', '', '']);
    setThingsYouSmell(['', '']);
    setGratefulFor('');
    setGroundingComplete(false);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return thingsYouSee.some(item => item.trim() !== '');
      case 1:
        return thingsYouFeel.some(item => item.trim() !== '');
      case 2:
        return thingsYouHear.some(item => item.trim() !== '');
      case 3:
        return thingsYouSmell.some(item => item.trim() !== '');
      case 4:
        return gratefulFor.trim() !== '';
      default:
        return false;
    }
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      setGroundingComplete(true);
    }
  };

  const resetGrounding = () => {
    setCurrentStep(0);
    setThingsYouSee(['', '', '', '', '']);
    setThingsYouFeel(['', '', '', '']);
    setThingsYouHear(['', '', '']);
    setThingsYouSmell(['', '']);
    setGratefulFor('');
    setGroundingComplete(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSoundIcon = (sound: SoundType) => {
    switch (sound) {
      case 'rain':
        return '🌧️';
      case 'ocean':
        return '🌊';
      case 'whitenoise':
        return '📻';
      default:
        return '🔊';
    }
  };

  const getSoundLabel = (sound: SoundType) => {
    switch (sound) {
      case 'rain':
        return 'Rain';
      case 'ocean':
        return 'Ocean';
      case 'whitenoise':
        return 'White Noise';
      default:
        return '';
    }
  };

  const renderPulseSyncTab = () => {
    if (sessionComplete) {
      return (
        <div className="text-center py-8">
          <div className="mb-6">
            <div className="w-32 h-32 mx-auto rounded-full bg-green-100 flex items-center justify-center text-4xl mb-4">
              👏
            </div>
            <h3 className="text-2xl font-bold text-green-600 mb-2">
              Session Complete!
            </h3>
            <p className="text-lg text-muted-foreground">
              HRV improved +{hrvImprovement?.toFixed(1)}%
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              New HRV: {hrv} (was 35)
            </p>
          </div>
          <button
            onClick={resetSession}
            className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-all"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (!isSessionActive) {
      return (
        <div className="text-center py-8">
          <div className="mb-6">
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center">
              <span className="text-4xl">🫁</span>
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2">Pulse Sync Breathing</h3>
          <p className="text-muted-foreground mb-6">
            4s inhale → 4s hold → 6s exhale • 2 minutes
          </p>
          <button
            onClick={startSession}
            className="px-8 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
          >
            Start Session
          </button>
        </div>
      );
    }

    return (
      <div className="text-center py-8">
        {/* Timer */}
        <div className="text-3xl font-bold mb-6 font-mono">
          {formatTime(timeRemaining)}
        </div>

        {/* Animated Circle */}
        <div className="flex justify-center items-center mb-6">
          <div
            className={`rounded-full bg-gradient-to-br from-blue-300 to-purple-400 flex items-center justify-center transition-all duration-1000 ease-in-out ${getCircleSize()}`}
          >
            <span className="text-white font-semibold text-lg">
              {getPhaseLabel()}
            </span>
          </div>
        </div>

        {/* Phase Timer */}
        <div className="text-lg text-muted-foreground mb-4">
          {phaseTimeRemaining}s
        </div>

        {/* Instructions */}
        <div className="text-sm text-muted-foreground">
          {breathPhase === 'inhale' && 'Slowly breathe in through your nose'}
          {breathPhase === 'hold' && 'Hold your breath gently'}
          {breathPhase === 'exhale' && 'Exhale slowly through your mouth'}
        </div>
      </div>
    );
  };

  const renderEchoRelaxTab = () => {
    return (
      <div className="py-6">
        {/* Sound Selection Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          {(['rain', 'ocean', 'whitenoise'] as SoundType[]).map((sound) => (
            <button
              key={sound}
              onClick={() => handleSelectSound(sound)}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                selectedSound === sound
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <span className="mr-2">{getSoundIcon(sound)}</span>
              {getSoundLabel(sound)}
            </button>
          ))}
        </div>

        {/* Player Controls */}
        {selectedSound && (
          <div className="text-center">
            {/* Timer */}
            <div className="text-2xl font-bold mb-6 font-mono">
              {formatTime(echoTimeRemaining)}
            </div>

            {/* Animated Sound Bars */}
            <div className="flex justify-center items-center gap-1 mb-8 h-16">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 bg-gradient-to-t from-primary to-accent rounded-full transition-all duration-300 ${
                    isPlaying ? 'animate-pulse' : ''
                  }`}
                  style={{
                    height: isPlaying ? `${20 + Math.random() * 30 + i * 8}px` : '20px',
                    animationDelay: isPlaying ? `${i * 0.1}s` : '0s',
                  }}
                />
              ))}
            </div>

            {/* Play/Pause Button */}
            <div className="flex justify-center gap-4">
              <button
                onClick={handlePlayPause}
                disabled={!selectedSound}
                className="px-8 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPlaying ? '⏸️ Pause' : '▶️ Play'}
              </button>
              
              {isPlaying && (
                <button
                  onClick={handleStopSound}
                  className="px-6 py-3 bg-muted/50 text-muted-foreground rounded-full font-medium hover:bg-muted hover:text-foreground transition-all"
                >
                  ⏹️ Stop
                </button>
              )}
            </div>

            <p className="text-sm text-muted-foreground mt-6">
              Auto-stops after 3 minutes
            </p>
          </div>
        )}

        {!selectedSound && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Select a sound to begin</p>
          </div>
        )}
      </div>
    );
  };

  const renderMindAnchorTab = () => {
    if (gameComplete) {
      return (
        <div className="text-center py-8">
          <div className="mb-6">
            <div className="w-32 h-32 mx-auto rounded-full bg-green-100 flex items-center justify-center text-4xl mb-4">
              🧠
            </div>
            <h3 className="text-2xl font-bold text-green-600 mb-2">
              Focus Reset Complete
            </h3>
            <p className="text-lg text-muted-foreground mb-4">
              Nervous system stabilized.
            </p>
            <p className="text-sm text-muted-foreground">
              Final Score: {score}
            </p>
          </div>
          <button
            onClick={resetGame}
            className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-all"
          >
            Play Again
          </button>
        </div>
      );
    }

    if (!isGameActive) {
      return (
        <div className="text-center py-8">
          <div className="mb-6">
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-indigo-200 to-purple-200 flex items-center justify-center">
              <span className="text-4xl">🎯</span>
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2">Mind Anchor</h3>
          <p className="text-muted-foreground mb-2">
            Click blue dots (+1) • Avoid red dots (-1)
          </p>
          <p className="text-muted-foreground mb-6">
            2 minutes • Dots appear every 800ms
          </p>
          <button
            onClick={startGame}
            className="px-8 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
          >
            Start Game
          </button>
        </div>
      );
    }

    return (
      <div className="py-4 relative" style={{ height: '500px' }}>
        {/* Timer and Score */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-xl font-bold font-mono">
            {formatTime(gameTimeRemaining)}
          </div>
          <div className="text-xl font-bold">
            Score: <span className={score >= 0 ? 'text-green-600' : 'text-red-600'}>{score}</span>
          </div>
        </div>

        {/* Game Area */}
        <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl h-[340px] overflow-hidden">
          {dots.map((dot) => (
            <button
              key={dot.id}
              onClick={() => handleDotClick(dot)}
              className={`absolute w-12 h-12 rounded-full flex items-center justify-center text-2xl cursor-pointer transition-transform hover:scale-110 active:scale-95 ${
                dot.color === 'blue' 
                  ? 'bg-blue-500 hover:bg-blue-600' 
                  : 'bg-red-500 hover:bg-red-600'
              }`}
              style={{
                left: `${dot.x}%`,
                top: `${dot.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {dot.color === 'blue' ? '💙' : '❤️'}
            </button>
          ))}
        </div>

        <p className="text-sm text-muted-foreground text-center mt-4">
          Click blue hearts (+1) • Avoid red hearts (-1)
        </p>
      </div>
    );
  };

  const renderGroundingTab = () => {
    if (groundingComplete) {
      return (
        <div className="text-center py-8">
          <div className="mb-6">
            <div className="w-32 h-32 mx-auto rounded-full bg-green-100 flex items-center justify-center text-4xl mb-4">
              🌿
            </div>
            <h3 className="text-2xl font-bold text-green-600 mb-2">
              Grounding Complete
            </h3>
            <p className="text-lg text-muted-foreground">
              You are now centered.
            </p>
          </div>
          <button
            onClick={resetGrounding}
            className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-all"
          >
            Start Over
          </button>
        </div>
      );
    }

    return (
      <div className="py-6">
        <div className="text-center mb-6">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-emerald-200 to-teal-200 flex items-center justify-center mb-4">
            <span className="text-4xl">🌱</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Grounding Challenge</h3>
          <p className="text-muted-foreground">
            Step {currentStep + 1} of 5
          </p>
        </div>

        <div className="max-w-md mx-auto">
          {currentStep === 0 && (
            <>
              <h4 className="text-lg font-medium mb-4 text-center">5 things you see</h4>
              <div className="space-y-3 mb-6">
                {thingsYouSee.map((item, index) => (
                  <div key={index}>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const newArr = [...thingsYouSee];
                        newArr[index] = e.target.value;
                        setThingsYouSee(newArr);
                      }}
                      placeholder={`Thing ${index + 1} you see...`}
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {currentStep === 1 && (
            <>
              <h4 className="text-lg font-medium mb-4 text-center">4 things you feel</h4>
              <div className="space-y-3 mb-6">
                {thingsYouFeel.map((item, index) => (
                  <div key={index}>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const newArr = [...thingsYouFeel];
                        newArr[index] = e.target.value;
                        setThingsYouFeel(newArr);
                      }}
                      placeholder={`Thing ${index + 1} you feel...`}
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <h4 className="text-lg font-medium mb-4 text-center">3 things you hear</h4>
              <div className="space-y-3 mb-6">
                {thingsYouHear.map((item, index) => (
                  <div key={index}>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const newArr = [...thingsYouHear];
                        newArr[index] = e.target.value;
                        setThingsYouHear(newArr);
                      }}
                      placeholder={`Thing ${index + 1} you hear...`}
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {currentStep === 3 && (
            <>
              <h4 className="text-lg font-medium mb-4 text-center">2 things you smell</h4>
              <div className="space-y-3 mb-6">
                {thingsYouSmell.map((item, index) => (
                  <div key={index}>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const newArr = [...thingsYouSmell];
                        newArr[index] = e.target.value;
                        setThingsYouSmell(newArr);
                      }}
                      placeholder={`Thing ${index + 1} you smell...`}
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {currentStep === 4 && (
            <>
              <h4 className="text-lg font-medium mb-4 text-center">1 thing you're grateful for</h4>
              <div className="space-y-3 mb-6">
                <input
                  type="text"
                  value={gratefulFor}
                  onChange={(e) => setGratefulFor(e.target.value)}
                  placeholder="What are you grateful for?"
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            </>
          )}

          <div className="text-center">
            <button
              onClick={handleNextStep}
              disabled={!canProceed()}
              className="px-8 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === 4 ? 'Complete' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const getTabContent = (tabId: string) => {
    switch (tabId) {
      case 'pulse-sync':
        return renderPulseSyncTab();
      case 'echo-relax':
        return renderEchoRelaxTab();
      case 'mind-anchor':
        return renderMindAnchorTab();
      case 'grounding':
        return renderGroundingTab();
      default:
        return <p className="text-lg text-muted-foreground">Module Coming Soon</p>;
    }
  };

  const getCardStyles = () => {
    switch (level) {
      case 'HIGH':
        return 'bg-red-50 border-red-200';
      case 'MODERATE':
        return 'bg-yellow-50 border-yellow-200';
      case 'STABLE':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getCardContent = () => {
    switch (level) {
      case 'HIGH':
        return {
          title: '⚠️ High Stress Detected',
          subtitle: 'We detected elevated stress signals.',
          icon: '🔴'
        };
      case 'MODERATE':
        return {
          title: 'Stress Rising',
          subtitle: 'Recovery recommended.',
          icon: '🟡'
        };
      case 'STABLE':
        return {
          title: 'You are Stable',
          subtitle: 'Your stress signals are balanced.',
          icon: '🟢'
        };
      default:
        return {
          title: 'Unknown',
          subtitle: '',
          icon: '⚪'
        };
    }
  };

  const cardContent = getCardContent();
  const showInstantCalm = level === 'HIGH' || level === 'MODERATE';

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold">Stress Radar</h1>
          <p className="text-muted-foreground mt-1">Smart Stress Detection & Recovery System</p>
        </div>

        {/* Stress Level Card */}
        <div className={`glass-card p-8 mb-8 ${getCardStyles()}`}>
          <div className="flex items-center gap-4">
            <span className="text-4xl">{cardContent.icon}</span>
            <div>
              <h2 className="text-2xl font-display font-bold">{cardContent.title}</h2>
              <p className="text-muted-foreground mt-1">{cardContent.subtitle}</p>
              <p className="text-sm text-muted-foreground mt-2">Flags: {flags}</p>
            </div>
          </div>
        </div>

        {/* Instant Calm Mode - Only visible for HIGH or MODERATE */}
        {showInstantCalm && (
          <div className="mb-8 relative">
            <h2 className="text-2xl font-display font-bold mb-4">🧘 Instant Calm Mode</h2>
            
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    resetSession();
                    handleStopSound();
                    resetGame();
                    startGrounding();
                  }}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content with Background Effects */}
            <div className="glass-card p-6 relative overflow-hidden">
              {/* Shining particles when exercise is active */}
              {(activeTab === 'pulse-sync' && isSessionActive) || (activeTab === 'mind-anchor' && isGameActive) ? (
                <>
                  {/* Floating particles */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(15)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animationDelay: `${Math.random() * 2}s`,
                          animationDuration: `${1.5 + Math.random() * 1.5}s`,
                        }}
                      />
                    ))}
                  </div>
                  {/* Shining dots */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 bg-white/50 rounded-full"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animation: `shimmer 2s ease-in-out infinite`,
                          animationDelay: `${Math.random() * 2}s`,
                        }}
                      />
                    ))}
                  </div>
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />
                </>
              ) : null}
              
              {getTabContent(activeTab)}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default StressRadar;
