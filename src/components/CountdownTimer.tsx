import { useState, useEffect } from "react";
import { Clock, Sunrise } from "lucide-react";

export const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const diff = tomorrow.getTime() - now.getTime();
      
      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setTimeLeft({ hours, minutes, seconds });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="wellness-card p-6 text-center">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Sunrise className="w-5 h-5 text-warning animate-pulse" />
        <h3 className="text-lg font-semibold">Day Resets In</h3>
      </div>
      
      <div className="flex items-center justify-center gap-4 text-2xl font-bold">
        <div className="flex flex-col items-center">
          <div className="bg-gradient-to-br from-primary to-primary-glow text-white rounded-2xl px-4 py-2 min-w-[60px] shadow-glow">
            {String(timeLeft.hours).padStart(2, '0')}
          </div>
          <span className="text-xs text-muted-foreground mt-1">hours</span>
        </div>
        
        <Clock className="w-4 h-4 text-muted-foreground animate-pulse" />
        
        <div className="flex flex-col items-center">
          <div className="bg-gradient-to-br from-success to-emerald-400 text-white rounded-2xl px-4 py-2 min-w-[60px] shadow-soft">
            {String(timeLeft.minutes).padStart(2, '0')}
          </div>
          <span className="text-xs text-muted-foreground mt-1">mins</span>
        </div>
        
        <Clock className="w-4 h-4 text-muted-foreground animate-pulse" />
        
        <div className="flex flex-col items-center">
          <div className="bg-gradient-to-br from-warning to-orange-400 text-white rounded-2xl px-4 py-2 min-w-[60px] shadow-soft">
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
          <span className="text-xs text-muted-foreground mt-1">secs</span>
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground mt-4">
        Make the most of your remaining time today! 🌟
      </p>
    </div>
  );
};