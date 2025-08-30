import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, Camera, Map, Trophy, Users, BookOpen, User, LogIn, LogOut, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="bg-primary shadow-eco border-b border-eco-sage/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-primary-foreground hover:text-eco-mint transition-colors">
            <Leaf className="h-8 w-8" />
            <div>
              <h1 className="text-xl font-bold">Mangrove Watch</h1>
              <p className="text-xs text-eco-mint">Protect Our Coasts</p>
            </div>
          </Link>
          
          <nav className="flex items-center space-x-1">
            <Button 
              variant={isActive("/") ? "secondary" : "ghost"} 
              size="sm" 
              asChild
              className={isActive("/") ? "bg-eco-mint text-eco-forest" : "text-primary-foreground hover:bg-eco-green-light"}
            >
              <Link to="/" className="flex items-center space-x-1">
                <Camera className="h-4 w-4" />
                <span className="hidden lg:inline text-xs">Report</span>
              </Link>
            </Button>
            
            <Button 
              variant={isActive("/dashboard") ? "secondary" : "ghost"} 
              size="sm" 
              asChild
              className={isActive("/dashboard") ? "bg-eco-mint text-eco-forest" : "text-primary-foreground hover:bg-eco-green-light"}
            >
              <Link to="/dashboard" className="flex items-center space-x-1">
                <Map className="h-4 w-4" />
                <span className="hidden lg:inline text-xs">Dashboard</span>
              </Link>
            </Button>
            
            <Button 
              variant={isActive("/alerts") ? "secondary" : "ghost"} 
              size="sm" 
              asChild
              className={isActive("/alerts") ? "bg-eco-mint text-eco-forest" : "text-primary-foreground hover:bg-eco-green-light"}
            >
              <Link to="/alerts" className="flex items-center space-x-1">
                <AlertTriangle className="h-4 w-4" />
                <span className="hidden lg:inline text-xs">Alerts</span>
              </Link>
            </Button>
            
            <Button 
              variant={isActive("/leaderboard") ? "secondary" : "ghost"} 
              size="sm" 
              asChild
              className={isActive("/leaderboard") ? "bg-eco-mint text-eco-forest" : "text-primary-foreground hover:bg-eco-green-light"}
            >
              <Link to="/leaderboard" className="flex items-center space-x-1">
                <Trophy className="h-4 w-4" />
                <span className="hidden lg:inline text-xs">Leaderboard</span>
              </Link>
            </Button>

            <Button 
              variant={isActive("/community") ? "secondary" : "ghost"} 
              size="sm" 
              asChild
              className={isActive("/community") ? "bg-eco-mint text-eco-forest" : "text-primary-foreground hover:bg-eco-green-light"}
            >
              <Link to="/community" className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span className="hidden lg:inline text-xs">Community</span>
              </Link>
            </Button>

            <Button 
              variant={isActive("/education") ? "secondary" : "ghost"} 
              size="sm" 
              asChild
              className={isActive("/education") ? "bg-eco-mint text-eco-forest" : "text-primary-foreground hover:bg-eco-green-light"}
            >
              <Link to="/education" className="flex items-center space-x-1">
                <BookOpen className="h-4 w-4" />
                <span className="hidden lg:inline text-xs">Academy</span>
              </Link>
            </Button>

            {user ? (
              <>
                <Button 
                  variant={isActive("/profile") ? "secondary" : "ghost"} 
                  size="sm" 
                  asChild
                  className={isActive("/profile") ? "bg-eco-mint text-eco-forest" : "text-primary-foreground hover:bg-eco-green-light"}
                >
                  <Link to="/profile" className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span className="hidden lg:inline text-xs">Profile</span>
                  </Link>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={logout}
                  className="text-primary-foreground hover:bg-eco-green-light"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden lg:inline text-xs">Logout</span>
                </Button>
              </>
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                asChild
                className="text-primary-foreground hover:bg-eco-green-light"
              >
                <Link to="/login" className="flex items-center space-x-1">
                  <LogIn className="h-4 w-4" />
                  <span className="hidden lg:inline text-xs">Login</span>
                </Link>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;