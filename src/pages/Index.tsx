import { useState, useEffect } from "react";
import { WellnessTracker } from "@/components/WellnessTracker";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Leaf, Heart, Sun } from "lucide-react";

const Index = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/20 transition-smooth">
      {/* Header with theme toggle */}
      <header className="relative flex justify-between items-center p-6 md:p-8">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Leaf className="w-8 h-8 text-primary animate-float" />
            <div className="absolute inset-0 blur-sm">
              <Leaf className="w-8 h-8 text-primary-glow opacity-50" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Wellness Tracker
            </h1>
            <p className="text-sm text-muted-foreground">Nurture your daily habits</p>
          </div>
        </div>
        <ThemeToggle />
      </header>

      {/* Floating wellness icons */}
      <div className="fixed top-20 right-10 opacity-10 dark:opacity-5 pointer-events-none">
        <Heart className="w-24 h-24 text-primary animate-float" style={{ animationDelay: '1s' }} />
      </div>
      <div className="fixed bottom-20 left-10 opacity-10 dark:opacity-5 pointer-events-none">
        <Sun className="w-20 h-20 text-warning animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Main content */}
      <main className="container mx-auto px-6 pb-12">
        <WellnessTracker />
      </main>
    </div>
  );
};

export default Index;