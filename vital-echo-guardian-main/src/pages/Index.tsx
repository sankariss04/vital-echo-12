import { Heart, Activity, Shield, Brain, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  { icon: Heart, title: 'Passive Signal Analysis', desc: 'Monitor HRV, sleep patterns, activity, and voice stress passively.', gradient: 'gradient-pink' },
  { icon: Brain, title: 'AI-Powered Predictions', desc: 'Machine learning models detect early disease risk patterns.', gradient: 'gradient-lavender' },
  { icon: Shield, title: 'Preventive Advisory', desc: 'Personalized health recommendations based on your data.', gradient: 'gradient-mint' },
  { icon: Activity, title: 'Explainable AI', desc: 'Understand exactly which factors contribute to your risk score.', gradient: 'gradient-health' },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-50" />
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-pastel-pink/30 blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-pastel-blue/30 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full bg-pastel-mint/30 blur-3xl animate-float" style={{ animationDelay: '4s' }} />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/60 backdrop-blur-sm border border-border mb-8 animate-fade-in">
            <Heart className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Early Disease Risk Detection</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-foreground leading-tight animate-slide-up">
            Your Health,{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Decoded Early
            </span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
            VitalEcho analyzes passive health signals—heart rate variability, sleep patterns, activity levels, and voice stress—to detect potential disease risks before symptoms appear.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all shadow-glow"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-card/60 backdrop-blur-sm border border-border text-foreground font-semibold hover:bg-card/80 transition-all"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-display font-bold text-foreground text-center mb-12">
          How VitalEcho Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="glass-card p-6 hover:shadow-glow transition-all duration-300">
                <div className={`w-12 h-12 rounded-xl ${f.gradient} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-foreground/70" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p>© 2026 VitalEcho • AI-Powered Early Disease Risk Detection</p>
      </footer>
    </div>
  );
};

export default Index;
