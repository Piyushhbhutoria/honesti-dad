import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
  variant?: "default" | "header";
}

const ThemeToggle = ({ className = "", variant = "default" }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useAuth();

  const baseClasses = "glass-button border-0 hover:shadow-glass transition-all duration-300 transform hover:scale-105";
  const variantClasses = variant === "header"
    ? "p-2"
    : "p-3";

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      size="sm"
      className={`${baseClasses} ${variantClasses} ${className}`}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5 text-foreground/70" />
      ) : (
        <Sun className="h-5 w-5 text-foreground/70" />
      )}
    </Button>
  );
};

export default ThemeToggle; 
