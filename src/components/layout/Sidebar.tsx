import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, MessageSquare, Mail, Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function Sidebar() {
  const { t } = useLanguage();

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: t('dashboard') },
    { to: '/posts', icon: FileText, label: t('posts') },
    { to: '/users', icon: Users, label: t('users') },
    { to: '/comments', icon: MessageSquare, label: t('comments') },
    { to: '/messages', icon: Mail, label: t('messages') },
  ];

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <div className="flex items-center gap-2">
          <Search className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-foreground">FINDO</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
