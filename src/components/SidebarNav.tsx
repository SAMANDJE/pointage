import { NavLink } from 'react-router-dom';
import { CalendarClock, History, Hotel, BedDouble } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';
const navLinks = [
  { to: '/', text: "Today's Service", icon: CalendarClock },
  { to: '/history', text: 'History', icon: History },
  { to: '/rooms', text: 'Manage Rooms', icon: BedDouble },
];
export function SidebarNav() {
  return (
    <aside className="w-64 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-col sticky top-0 hidden md:flex">
      <NavLink to="/" className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3 group">
        <div className="w-10 h-10 bg-amber-400 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
          <Hotel className="w-6 h-6 text-gray-800" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tighter">
          Aurore
        </h1>
      </NavLink>
      <nav className="flex-1 p-4 space-y-2">
        {navLinks.map(({ to, text, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 dark:text-gray-300 transition-all duration-200 ease-in-out',
                'hover:bg-amber-400/10 hover:text-amber-500 dark:hover:bg-amber-400/20 dark:hover:text-amber-400',
                isActive && 'bg-amber-400/20 text-amber-600 dark:bg-amber-400/30 dark:text-amber-300 font-semibold'
              )
            }
          >
            <Icon className="w-5 h-5" />
            <span>{text}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <p className="text-xs text-center text-gray-400 dark:text-gray-500">
          Built with ❤️ at Cloudflare
        </p>
        <ThemeToggle />
      </div>
    </aside>
  );
}