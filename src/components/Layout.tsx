import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { PenSquare, LogOut, BookOpen } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <BookOpen className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
              <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                Bstation
              </h1>
            </Link>
            
            <nav className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost">Stories</Button>
              </Link>
              
              {user && userRole === 'admin' && (
                <Link to="/create">
                  <Button className="gap-2">
                    <PenSquare className="h-4 w-4" />
                    Create Story
                  </Button>
                </Link>
              )}
              
              {user ? (
                <Button variant="outline" onClick={handleSignOut} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              ) : (
                <Link to="/auth">
                  <Button>Sign In</Button>
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>
      
      <main>{children}</main>
      
      <footer className="border-t border-border mt-20 py-8 bg-muted/30">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 Bstation. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}