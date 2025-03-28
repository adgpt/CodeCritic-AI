import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Home, LayoutDashboard, Code, User, LogOut, Menu, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMobile } from '@/hooks/use-mobile';
import { useToast } from '@/components/ui/use-toast';

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  requiresAuth?: boolean;
};

export function Navbar() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMobile();
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navItems: NavItem[] = [
    {
      href: '/',
      label: 'Home',
      icon: <Home className="h-5 w-5" />,
    },
    {
      href: '/dashboard',
      label: 'Code Editor',
      icon: <Code className="h-5 w-5" />,
      requiresAuth: true,
    },
    {
      href: '/profile',
      label: 'Profile',
      icon: <User className="h-5 w-5" />,
      requiresAuth: true,
    },
  ];

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const filteredNavItems = navItems.filter(
    (item) => {
      // Hide Home button when on home page
      if (item.href === '/' && location.pathname === '/') {
        return false;
      }
      // Hide Code Editor button on home page for unauthenticated users
      if (item.href === '/dashboard' && location.pathname === '/' && !user) {
        return false;
      }
      // Only show items that require auth if user is logged in
      return !item.requiresAuth || (item.requiresAuth && user);
    }
  );

  const NavLinks = () => {
    const isTablet = window.innerWidth < 1024 && window.innerWidth >= 768;
    const showText = !isMobile;
    
    return (
      <div className="flex items-center gap-4">
        {filteredNavItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'font-bold underline decoration-2 underline-offset-4'
                  : 'hover:bg-accent hover:text-accent-foreground'
              )}
              onClick={() => setOpen(false)}
            >
              {item.icon}
              {showText && <span>{item.label}</span>}
            </Link>
          );
        })}
        {user ? (
          <Button
            variant="ghost"
            className="flex items-center gap-2 hover:bg-destructive/10 hover:text-destructive"
            onClick={() => {
              handleLogout();
              setOpen(false);
            }}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <LogOut className="h-5 w-5" />
            )}
            {showText && <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>}
          </Button>
        ) : (
          location.pathname !== '/login' && (
            <Button
              variant="default"
              className="flex items-center gap-2"
              onClick={() => {
                navigate('/login');
                setOpen(false);
              }}
            >
              <User className="h-5 w-5" />
              {showText && <span>Login</span>}
            </Button>
          )
        )}
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="flex items-center space-x-2">
            <svg width="24" height="24" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
              <rect width="512" height="512" rx="128" fill="#F8F9FC"/>
              <path d="M180 160L120 220L180 280" stroke="#6366F1" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M332 160L392 220L332 280" stroke="#6366F1" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="340" cy="340" r="80" fill="#E0E7FF" stroke="#4F46E5" strokeWidth="32"/>
              <line x1="400" y1="400" x2="440" y2="440" stroke="#4F46E5" strokeWidth="32" strokeLinecap="round"/>
            </svg>
            <span className="font-bold">CodeReviewAI</span>
          </Link>
        </div>

        {isMobile ? (
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-auto">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col justify-start pt-16">
              <nav className="flex flex-col gap-4">
                <NavLinks />
              </nav>
            </SheetContent>
          </Sheet>
        ) : (
          <nav className="flex-1 flex items-center justify-end space-x-1">
            <NavLinks />
          </nav>
        )}
      </div>
    </header>
  );
}