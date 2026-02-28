import { Heart, Activity, Shield, Brain, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  { icon: Heart, title: 'Passive Signal Analysis', desc: 'Monitor HRV, sleep patterns, activity, and voice stress passively.', gradient: 'gradient-pink', hoverEffect: 'hover-lift' },
  { icon: Brain, title: 'AI-Powered Predictions', desc: 'Machine learning models detect early disease risk patterns.', gradient: 'gradient-lavender', hoverEffect: 'hover-lift' },
  { icon: Shield, title: 'Preventive Advisory', desc: 'Personalized health recommendations based on your data.', gradient: 'gradient-mint', hoverEffect: 'hover-lift' },
  { icon: Activity, title: 'Explainable AI', desc: 'Understand exactly which factors contribute to your risk score.', gradient: 'gradient-health', hoverEffect: 'hover-lift' },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-60" />
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-pastel-pink/40 blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-pastel-blue/40 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-56 h-56 rounded-full bg-pastel-mint/40 blur-3xl animate-float" style={{ animationDelay: '4s' }} />
        <div className="absolute top-1/4 right-1/4 w-40 h-40 rounded-full bg-pastel-lavender/30 blur-2xl animate-float" style={{ animationDelay: '1s' }} />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-card/70 backdrop-blur-sm border-2 border-white/60 mb-8 animate-fade-in shadow-glow">
            <Heart className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-foreground">Early Disease Risk Detection</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-foreground leading-tight animate-slide-up">
            Your Health,{' '}
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Decoded Early
            </span>
          </h1>
          <p className="mt-6 text-lg text-foreground/70 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
            VitalEcho analyzes passive health signals—heart rate variability, sleep patterns, activity levels, and voice stress—to detect potential disease risks before symptoms appear.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold hover:opacity-90 transition-all shadow-glow hover:shadow-hover hover:scale-105 border-2 border-transparent"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-card/70 backdrop-blur-sm border-2 border-white/60 text-foreground font-semibold hover:bg-card/80 transition-all hover:shadow-hover hover:scale-105"
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
              <div key={i} className={`glass-card-hover p-6 ${f.hoverEffect}`} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className={`w-14 h-14 rounded-2xl ${f.gradient} flex items-center justify-center mb-4 shadow-glow border border-white/40`}>
                  <Icon className="w-7 h-7 text-foreground/80" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-foreground/70 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-border/50 py-8 text-center text-sm text-foreground/60">
        <p>© 2026 VitalEcho • AI-Powered Early Disease Risk Detection</p>
      </footer>
    </div>
  );
};

export default Index;
