import { useState, useEffect } from "react";
import { Quote, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const wellnessQuotes = [
  {
    text: "Take care of your body. It's the only place you have to live.",
    author: "Jim Rohn"
  },
  {
    text: "Health is not about the weight you lose, but about the life you gain.",
    author: "Dr. Josh Axe"
  },
  {
    text: "The groundwork for all happiness is good health.",
    author: "Leigh Hunt"
  },
  {
    text: "Your body can stand almost anything. It's your mind that you have to convince.",
    author: "Unknown"
  },
  {
    text: "Wellness is the complete integration of body, mind, and spirit.",
    author: "Greg Anderson"
  },
  {
    text: "To keep the body in good health is a duty... otherwise we shall not be able to keep our mind strong and clear.",
    author: "Buddha"
  },
  {
    text: "The first wealth is health.",
    author: "Ralph Waldo Emerson"
  },
  {
    text: "A healthy outside starts from the inside.",
    author: "Robert Urich"
  },
  {
    text: "Progress, not perfection, is what we should strive for.",
    author: "Unknown"
  },
  {
    text: "Small steps daily lead to big changes yearly.",
    author: "Unknown"
  },
  {
    text: "You don't have to be great to get started, but you have to get started to be great.",
    author: "Les Brown"
  },
  {
    text: "The only bad workout is the one that didn't happen.",
    author: "Unknown"
  },
  {
    text: "Mindfulness is about being fully awake in our lives.",
    author: "Jon Kabat-Zinn"
  },
  {
    text: "Rest when you're weary. Refresh and renew yourself, your body, your mind, your spirit.",
    author: "Ralph Marston"
  },
  {
    text: "Healthy habits are learned in the same way as unhealthy ones - through practice.",
    author: "Wayne Dyer"
  }
];

export const DailyQuote = () => {
  const [currentQuote, setCurrentQuote] = useState(wellnessQuotes[0]);
  const [isAnimating, setIsAnimating] = useState(false);

  // Get daily quote based on date
  useEffect(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const quoteIndex = dayOfYear % wellnessQuotes.length;
    setCurrentQuote(wellnessQuotes[quoteIndex]);
  }, []);

  const getNewQuote = () => {
    setIsAnimating(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * wellnessQuotes.length);
      setCurrentQuote(wellnessQuotes[randomIndex]);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="wellness-card p-8 gradient-morning text-foreground relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-4 right-4 opacity-20">
        <Sparkles className="w-8 h-8 animate-float" />
      </div>
      <div className="absolute bottom-4 left-4 opacity-10">
        <Quote className="w-12 h-12" />
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <Quote className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Daily Inspiration</h2>
          </div>
          <Button
            onClick={getNewQuote}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground hover:bg-background/20"
          >
            <RefreshCw className={`w-4 h-4 ${isAnimating ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 transform translate-y-2' : 'opacity-100 transform translate-y-0'}`}>
          <blockquote className="text-xl md:text-2xl font-medium leading-relaxed mb-4 text-foreground/90">
            "{currentQuote.text}"
          </blockquote>
          <cite className="text-sm font-semibold text-primary/80 not-italic">
            — {currentQuote.author}
          </cite>
        </div>
      </div>
    </div>
  );
};