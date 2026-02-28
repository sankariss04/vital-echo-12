import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/authContext';
import { Heart, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirm) { toast.error('Please fill all fields'); return; }
    if (password !== confirm) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      await signup(name, email, password);
      toast.success('Account created!');
      navigate('/dashboard');
    } catch {
      toast.error('Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="absolute top-20 right-20 w-32 h-32 rounded-full bg-pastel-mint/40 blur-3xl animate-float" />
      <div className="absolute bottom-20 left-20 w-40 h-40 rounded-full bg-pastel-lavender/40 blur-3xl animate-float" style={{ animationDelay: '3s' }} />

      <div className="glass-card-hover p-8 w-full max-w-md animate-slide-up relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl gradient-mint flex items-center justify-center shadow-soft">
              <Heart className="w-5 h-5 text-accent-foreground" />
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground">VitalEcho</h1>
          </div>
          <p className="text-muted-foreground">Create your health profile</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all text-foreground placeholder:text-muted-foreground hover-lift"
              placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all text-foreground placeholder:text-muted-foreground hover-lift"
              placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all text-foreground placeholder:text-muted-foreground hover-lift"
              placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Confirm Password</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all text-foreground placeholder:text-muted-foreground hover-lift"
              placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-soft hover:shadow-hover hover:scale-[1.02]">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline hover:text-primary/80">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
