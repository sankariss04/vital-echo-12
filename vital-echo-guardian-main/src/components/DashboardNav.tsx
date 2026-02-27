import { Heart, LayoutDashboard, BarChart3, Video, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/authContext';

const DashboardNav = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/metrics', label: 'Model Metrics', icon: BarChart3 },
    { to: '/go-live', label: 'Go Live', icon: Video },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-card/70 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-mint flex items-center justify-center">
            <Heart className="w-4 h-4 text-accent-foreground" />
          </div>
          <span className="font-display font-bold text-lg text-foreground">VitalEcho</span>
        </Link>

        <nav className="flex items-center gap-1">
          {links.map(l => {
            const Icon = l.icon;
            const active = location.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{l.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground hidden sm:inline">
            {user?.name}
          </span>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardNav;
