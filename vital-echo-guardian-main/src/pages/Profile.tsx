import { useState } from 'react';
import DashboardNav from '@/components/DashboardNav';
import { useAuth } from '@/lib/authContext';
import { User, Heart, Moon, Footprints, Brain, Save, Edit2, Sparkles } from 'lucide-react';

interface ProfileData {
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  medicalHistory: string[];
  targetSleepHours: number;
  dailyStepGoal: number;
  stressManagementGoal: string;
}

const ProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    name: user?.name || 'John Doe',
    age: 35,
    gender: 'Male',
    height: 175,
    weight: 70,
    medicalHistory: ['Hypertension', 'Seasonal Allergies'],
    targetSleepHours: 8,
    dailyStepGoal: 10000,
    stressManagementGoal: 'Daily meditation',
  });

  const handleSave = () => {
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];
  
  const medicalHistoryOptions = [
    'Hypertension',
    'Diabetes',
    'Heart Disease',
    'Asthma',
    'Seasonal Allergies',
    'Arthritis',
    'None',
  ];

  const stressOptions = [
    'Daily meditation',
    'Weekly exercise',
    'Yoga',
    'Therapy sessions',
    'Breathing exercises',
    'Journaling',
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-32 w-96 h-96 rounded-full bg-pastel-lavender/30 blur-3xl animate-float" />
        <div className="absolute bottom-20 -right-32 w-80 h-80 rounded-full bg-pastel-mint/30 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-pastel-pink/20 blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <DashboardNav />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-2xl gradient-lavender flex items-center justify-center shadow-glow animate-pulse-soft">
                  <User className="w-6 h-6 text-foreground" />
                </div>
                <h1 className="text-3xl font-display font-bold text-foreground">My Profile</h1>
              </div>
              <p className="text-muted-foreground ml-15">Manage your personal information and health goals</p>
            </div>
            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all shadow-glow hover:shadow-hover ${
                isEditing 
                  ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90' 
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-card/80'
              }`}
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </>
              )}
            </button>
          </div>
        </div>

        <div className="glass-card-hover p-6 mb-6 animate-slide-up relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl" />
          <div className="flex items-center gap-2 mb-6 relative">
            <div className="w-10 h-10 rounded-xl gradient-mint flex items-center justify-center">
              <User className="w-5 h-5 text-accent-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Personal Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-pastel-lavender" />
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              ) : (
                <p className="text-foreground font-semibold py-2.5 px-4 rounded-xl bg-muted/30">{profile.name}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-pastel-blue" />
                Age
              </label>
              {isEditing ? (
                <input
                  type="number"
                  value={profile.age}
                  onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              ) : (
                <p className="text-foreground font-semibold py-2.5 px-4 rounded-xl bg-muted/30">{profile.age} years</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-pastel-pink" />
                Gender
              </label>
              {isEditing ? (
                <select
                  value={profile.gender}
                  onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                >
                  {genderOptions.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              ) : (
                <p className="text-foreground font-semibold py-2.5 px-4 rounded-xl bg-muted/30">{profile.gender}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-pastel-mint" />
                Height (cm)
              </label>
              {isEditing ? (
                <input
                  type="number"
                  value={profile.height}
                  onChange={(e) => setProfile({ ...profile, height: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              ) : (
                <p className="text-foreground font-semibold py-2.5 px-4 rounded-xl bg-muted/30">{profile.height} cm</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-pastel-peach" />
                Weight (kg)
              </label>
              {isEditing ? (
                <input
                  type="number"
                  value={profile.weight}
                  onChange={(e) => setProfile({ ...profile, weight: parseInt(e.target.value) || 0 })}
                  className="w-full md:w-1/2 px-4 py-2.5 rounded-xl border border-input bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              ) : (
                <p className="text-foreground font-semibold py-2.5 px-4 rounded-xl bg-muted/30 w-fit">{profile.weight} kg</p>
              )}
            </div>
          </div>
        </div>

        <div className="glass-card-hover p-6 mb-6 animate-slide-up relative overflow-hidden" style={{ animationDelay: '0.1s' }}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-risk-high/10 to-transparent rounded-full blur-2xl" />
          <div className="flex items-center gap-2 mb-6 relative">
            <div className="w-10 h-10 rounded-xl gradient-pink flex items-center justify-center">
              <Heart className="w-5 h-5 text-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Medical History</h2>
          </div>
          
          {isEditing ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 relative">
              {medicalHistoryOptions.map(condition => (
                <label
                  key={condition}
                  className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all hover:scale-105 ${
                    profile.medicalHistory.includes(condition)
                      ? 'border-primary bg-gradient-to-r from-primary/20 to-accent/20 text-foreground shadow-sm'
                      : 'border-border/50 text-muted-foreground hover:border-primary/50 hover:bg-muted/30'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={profile.medicalHistory.includes(condition)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setProfile({ ...profile, medicalHistory: [...profile.medicalHistory, condition] });
                      } else {
                        setProfile({ ...profile, medicalHistory: profile.medicalHistory.filter(h => h !== condition) });
                      }
                    }}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium">{condition}</span>
                </label>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {profile.medicalHistory.length > 0 ? (
                profile.medicalHistory.map((condition, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-muted to-muted/50 text-foreground text-sm font-medium shadow-sm hover:shadow-md transition-shadow"
                  >
                    {condition}
                  </span>
                ))
              ) : (
                <p className="text-muted-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  No medical history recorded
                </p>
              )}
            </div>
          )}
        </div>

        <div className="glass-card-hover p-6 animate-slide-up relative overflow-hidden" style={{ animationDelay: '0.2s' }}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-2xl" />
          <div className="flex items-center gap-2 mb-6 relative">
            <div className="w-10 h-10 rounded-xl gradient-health flex items-center justify-center">
              <Brain className="w-5 h-5 text-accent-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Health Goals</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-pastel-lavender/30 to-transparent border border-white/20 hover:shadow-lg transition-all hover:scale-[1.02]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-card/80 flex items-center justify-center shadow-sm">
                  <Moon className="w-5 h-5 text-primary" />
                </div>
                <label className="text-sm font-medium text-muted-foreground">Sleep Target</label>
              </div>
              {isEditing ? (
                <input
                  type="number"
                  value={profile.targetSleepHours}
                  onChange={(e) => setProfile({ ...profile, targetSleepHours: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  min={1}
                  max={24}
                />
              ) : (
                <div className="flex items-baseline gap-1">
                  <p className="text-3xl font-bold text-foreground">{profile.targetSleepHours}</p>
                  <span className="text-sm font-medium text-muted-foreground">hrs</span>
                </div>
              )}
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-pastel-mint/30 to-transparent border border-white/20 hover:shadow-lg transition-all hover:scale-[1.02]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-card/80 flex items-center justify-center shadow-sm">
                  <Footprints className="w-5 h-5 text-accent" />
                </div>
                <label className="text-sm font-medium text-muted-foreground">Step Goal</label>
              </div>
              {isEditing ? (
                <input
                  type="number"
                  value={profile.dailyStepGoal}
                  onChange={(e) => setProfile({ ...profile, dailyStepGoal: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  min={1000}
                  max={50000}
                  step={1000}
                />
              ) : (
                <p className="text-2xl font-bold text-foreground">{profile.dailyStepGoal.toLocaleString()}</p>
              )}
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-pastel-pink/30 to-transparent border border-white/20 hover:shadow-lg transition-all hover:scale-[1.02]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-card/80 flex items-center justify-center shadow-sm">
                  <Brain className="w-5 h-5 text-risk-moderate" />
                </div>
                <label className="text-sm font-medium text-muted-foreground">Stress Relief</label>
              </div>
              {isEditing ? (
                <select
                  value={profile.stressManagementGoal}
                  onChange={(e) => setProfile({ ...profile, stressManagementGoal: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {stressOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <p className="text-lg font-semibold text-foreground">{profile.stressManagementGoal}</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
