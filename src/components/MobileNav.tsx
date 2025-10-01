import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, CalendarClock, History, Hotel, BedDouble } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';
const navLinks = [
  { to: '/', text: "Today's Service", icon: CalendarClock },
  { to: '/history', text: 'History', icon: History },
  { to: '/rooms', text: 'Manage Rooms', icon: BedDouble },
];
export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white dark:bg-gray-800 dark:border-gray-700 md:hidden">
      <div className="container flex h-14 items-center justify-between px-4">
        <NavLink to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
          <div className="w-8 h-8 bg-amber-400 rounded-md flex items-center justify-center">
            <Hotel className="w-5 h-5 text-gray-800" />
          </div>
          <span className="text-xl font-bold text-gray-800 dark:text-white tracking-tighter">
            Aurore
          </span>
        </NavLink>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs bg-white dark:bg-gray-800 p-0">
            <SheetHeader className="p-4 border-b dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-400 rounded-lg flex items-center justify-center">
                  <Hotel className="w-6 h-6 text-gray-800" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tighter">
                  Aurore
                </h1>
              </div>
            </SheetHeader>
            <div className="p-4 flex flex-col h-full">
              <nav className="flex-1 space-y-2">
                {navLinks.map(({ to, text, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => setIsOpen(false)}
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
              <div className="mt-auto p-4 border-t dark:border-gray-700 flex justify-between items-center">
                 <p className="text-xs text-gray-400 dark:text-gray-500">
                    Built with ❤️ at Cloudflare
                </p>
                <ThemeToggle />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}