import { useState } from 'react';
import DashboardNav from '@/components/DashboardNav';
import { useAuth } from '@/lib/authContext';
import { useTheme } from '@/lib/themeContext';
import { 
  Settings, Moon, Sun, Ruler, Scale, AlertTriangle, 
  Shield, Trash2, Download, FileText, LogOut, Save, Sparkles, CheckCircle2
} from 'lucide-react';

interface AppPreferences {
  units: 'metric' | 'imperial';
}

interface RiskThresholds {
  lowToModerate: number;
  moderateToHigh: number;
}

const SettingsPage = () => {
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();
  
  const [preferences, setPreferences] = useState<AppPreferences>({
    units: 'metric',
  });
  
  const [thresholds, setThresholds] = useState<RiskThresholds>({
    lowToModerate: 40,
    moderateToHigh: 70,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleThemeChange = (newTheme: 'pastel' | 'dark' | 'light') => {
    setTheme(newTheme);
  };

  const handleDeleteData = () => {
    if (confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
      alert('All data has been deleted.');
    }
  };

  const handleDownloadData = () => {
    alert('Your data is being prepared for download. You will receive an email shortly.');
  };

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
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl gradient-mint flex items-center justify-center shadow-glow animate-pulse-soft">
              <Settings className="w-6 h-6 text-accent-foreground" />
            </div>
            <h1 className="text-3xl font-display font-bold text-foreground">Settings</h1>
          </div>
          <p className="text-muted-foreground ml-15">Manage your app preferences and privacy settings</p>
        </div>

        <div className="glass-card-hover p-6 mb-6 animate-slide-up relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl" />
          <div className="flex items-center gap-2 mb-6 relative">
            <div className="w-10 h-10 rounded-xl gradient-lavender flex items-center justify-center">
              <Settings className="w-5 h-5 text-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">App Preferences</h2>
          </div>

          <div className="mb-6 relative">
            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              Theme
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleThemeChange('pastel')}
                className={`p-4 rounded-2xl border-2 transition-all hover:scale-105 ${
                  theme === 'pastel'
                    ? 'border-primary bg-gradient-to-r from-primary/20 to-accent/20 shadow-md'
                    : 'border-border/50 hover:border-primary/50 hover:shadow-md'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-xl gradient-lavender shadow-sm" />
                  <span className="text-sm font-semibold text-foreground">Pastel</span>
                  {theme === 'pastel' && <CheckCircle2 className="w-4 h-4 text-primary mt-1" />}
                </div>
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className={`p-4 rounded-2xl border-2 transition-all hover:scale-105 ${
                  theme === 'dark'
                    ? 'border-primary bg-gradient-to-r from-primary/20 to-accent/20 shadow-md'
                    : 'border-border/50 hover:border-primary/50 hover:shadow-md'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                    <Moon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">Dark</span>
                  {theme === 'dark' && <CheckCircle2 className="w-4 h-4 text-primary mt-1" />}
                </div>
              </button>
              <button
                onClick={() => handleThemeChange('light')}
                className={`p-4 rounded-2xl border-2 transition-all hover:scale-105 ${
                  theme === 'light'
                    ? 'border-primary bg-gradient-to-r from-primary/20 to-accent/20 shadow-md'
                    : 'border-border/50 hover:border-primary/50 hover:shadow-md'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                    <Sun className="w-5 h-5 text-yellow-600" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">Light</span>
                  {theme === 'light' && <CheckCircle2 className="w-4 h-4 text-primary mt-1" />}
                </div>
              </button>
            </div>
          </div>

          <div className="relative">
            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              Units
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPreferences({ ...preferences, units: 'metric' })}
                className={`p-5 rounded-2xl border-2 transition-all hover:scale-105 ${
                  preferences.units === 'metric'
                    ? 'border-primary bg-gradient-to-r from-primary/20 to-accent/20 shadow-md'
                    : 'border-border/50 hover:border-primary/50 hover:shadow-md'
                }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-card flex items-center justify-center shadow-sm">
                    <div className="flex items-center gap-1">
                      <Ruler className="w-6 h-6 text-primary" />
                      <Scale className="w-6 h-6 text-accent" />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-foreground">Metric</span>
                  <span className="text-xs text-muted-foreground">(kg, cm)</span>
                  {preferences.units === 'metric' && <CheckCircle2 className="w-4 h-4 text-primary" />}
                </div>
              </button>
              <button
                onClick={() => setPreferences({ ...preferences, units: 'imperial' })}
                className={`p-5 rounded-2xl border-2 transition-all hover:scale-105 ${
                  preferences.units === 'imperial'
                    ? 'border-primary bg-gradient-to-r from-primary/20 to-accent/20 shadow-md'
                    : 'border-border/50 hover:border-primary/50 hover:shadow-md'
                }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-card flex items-center justify-center shadow-sm">
                    <span className="text-xl font-bold text-foreground">lb</span>
                    <span className="text-sm text-muted-foreground">/</span>
                    <span className="text-xl font-bold text-foreground">ft</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">Imperial</span>
                  <span className="text-xs text-muted-foreground">(lb, ft)</span>
                  {preferences.units === 'imperial' && <CheckCircle2 className="w-4 h-4 text-primary" />}
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="glass-card-hover p-6 mb-6 animate-slide-up relative overflow-hidden" style={{ animationDelay: '0.1s' }}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-risk-moderate/10 to-transparent rounded-full blur-2xl" />
          <div className="flex items-center gap-2 mb-6 relative">
            <div className="w-10 h-10 rounded-xl gradient-peach flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Risk Thresholds</h2>
          </div>
          
          <p className="text-sm text-muted-foreground mb-6 relative">
            Customize the cutoffs for risk levels. These values affect how your health risk is categorized.
          </p>

          <div className="space-y-6 relative">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-pastel-lavender/20 to-transparent">
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-muted-foreground">Low to Moderate</label>
                <span className="text-sm font-bold text-risk-low px-3 py-1 rounded-full bg-risk-low/20">{thresholds.lowToModerate}</span>
              </div>
              <input
                type="range"
                min={10}
                max={50}
                value={thresholds.lowToModerate}
                onChange={(e) => setThresholds({ ...thresholds, lowToModerate: parseInt(e.target.value) })}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>10</span>
                <span className="text-primary font-medium">Score Range</span>
                <span>50</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-pastel-peach/20 to-transparent">
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-muted-foreground">Moderate to High</label>
                <span className="text-sm font-bold text-risk-moderate px-3 py-1 rounded-full bg-risk-moderate/20">{thresholds.moderateToHigh}</span>
              </div>
              <input
                type="range"
                min={50}
                max={90}
                value={thresholds.moderateToHigh}
                onChange={(e) => setThresholds({ ...thresholds, moderateToHigh: parseInt(e.target.value) })}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>50</span>
                <span className="text-primary font-medium">Score Range</span>
                <span>90</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-card/50 border border-border/30">
              <p className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Risk Level Preview
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-risk-low/20 to-transparent text-center border border-risk-low/20 hover:shadow-md transition-shadow">
                  <span className="text-sm font-bold text-risk-low">Low</span>
                  <p className="text-xs text-muted-foreground mt-1">0-{thresholds.lowToModerate}</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-risk-moderate/20 to-transparent text-center border border-risk-moderate/20 hover:shadow-md transition-shadow">
                  <span className="text-sm font-bold text-risk-moderate">Moderate</span>
                  <p className="text-xs text-muted-foreground mt-1">{thresholds.lowToModerate + 1}-{thresholds.moderateToHigh}</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-risk-high/20 to-transparent text-center border border-risk-high/20 hover:shadow-md transition-shadow">
                  <span className="text-sm font-bold text-risk-high">High</span>
                  <p className="text-xs text-muted-foreground mt-1">{thresholds.moderateToHigh + 1}-100</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card-hover p-6 mb-6 animate-slide-up relative overflow-hidden" style={{ animationDelay: '0.2s' }}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-2xl" />
          <div className="flex items-center gap-2 mb-6 relative">
            <div className="w-10 h-10 rounded-xl gradient-mint flex items-center justify-center">
              <Shield className="w-5 h-5 text-accent-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Privacy Settings</h2>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-r from-muted/30 to-transparent mb-6 relative">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl gradient-lavender flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Data Usage Explanation</p>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  VitalEcho collects and analyzes your health signals (HRV, sleep, activity, voice stress) 
                  to provide disease risk predictions. All data is encrypted and stored securely. 
                  We never share your personal health data with third parties without your explicit consent.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 relative">
            <button
              onClick={handleDownloadData}
              className="w-full flex items-center gap-4 p-4 rounded-2xl border border-border/50 hover:border-primary/50 hover:bg-muted/30 transition-all hover:scale-[1.01] group"
            >
              <div className="w-10 h-10 rounded-xl gradient-mint flex items-center justify-center group-hover:shadow-md transition-shadow">
                <Download className="w-5 h-5 text-accent-foreground" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground">Download All Data</p>
                <p className="text-xs text-muted-foreground">Export all your health data as a ZIP file</p>
              </div>
            </button>

            <button
              onClick={handleDeleteData}
              className="w-full flex items-center gap-4 p-4 rounded-2xl border border-destructive/20 hover:bg-destructive/10 transition-all hover:scale-[1.01] group"
            >
              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center group-hover:shadow-md transition-shadow">
                <Trash2 className="w-5 h-5 text-destructive" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-destructive">Delete All Data</p>
                <p className="text-xs text-muted-foreground">Permanently remove all your data from our servers</p>
              </div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <button
            onClick={logout}
            className="flex items-center justify-center gap-3 p-5 rounded-2xl border border-destructive/30 text-destructive hover:bg-destructive/10 transition-all hover:scale-[1.02] group"
          >
            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="font-semibold">Logout</span>
          </button>

          <button
            onClick={handleSave}
            className={`flex items-center justify-center gap-3 p-5 rounded-2xl font-semibold transition-all hover:scale-[1.02] ${
              saved 
                ? 'bg-gradient-to-r from-risk-low to-accent text-white shadow-lg' 
                : 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-glow hover:shadow-hover'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${saved ? 'bg-white/20' : 'bg-white/20'}`}>
              {saved ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />}
            </div>
            {saved ? 'Settings Saved!' : 'Save Settings'}
          </button>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
