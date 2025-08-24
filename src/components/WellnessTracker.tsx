import { useState, useEffect } from "react";
import { HabitCard } from "./HabitCard";
import { AddHabitForm } from "./AddHabitForm";
import { DailyQuote } from "./DailyQuote"; 
import { ProgressOverview } from "./ProgressOverview";
import { CountdownTimer } from "./CountdownTimer";
import { MoodLogger } from "./MoodLogger";
import { Achievements } from "./Achievements";
import { Plus, Sparkles, Target, BarChart3, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";

export interface Habit {
  id: string;
  name: string;
  category: 'exercise' | 'mindfulness' | 'nutrition' | 'sleep' | 'learning' | 'other';
  icon?: string;
  color?: string;
  createdAt: string;
  completedDates: string[];
  currentStreak: number;
  bestStreak: number;
}

export const WellnessTracker = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Confetti celebration
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#22c55e', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'],
    });
  };

  // Load habits from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("wellness-habits");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setHabits(parsed);
      } catch (error) {
        console.error("Failed to load habits:", error);
      }
    }
  }, []);

  // Save habits to localStorage whenever habits change
  useEffect(() => {
    localStorage.setItem("wellness-habits", JSON.stringify(habits));
  }, [habits]);

  const addHabit = (name: string, category: Habit['category'], icon?: string, color?: string) => {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name,
      category,
      icon,
      color,
      createdAt: new Date().toISOString(),
      completedDates: [],
      currentStreak: 0,
      bestStreak: 0,
    };
    
    setHabits(prev => [...prev, newHabit]);
    setShowAddForm(false);
    
    toast({
      title: "Habit added! 🌱",
      description: `${name} has been added to your wellness journey.`,
      duration: 3000,
    });
  };

  const toggleHabit = (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    setHabits(prev => prev.map(habit => {
      if (habit.id !== habitId) return habit;
      
      const wasCompleted = habit.completedDates.includes(today);
      let updatedDates: string[];
      let currentStreak = habit.currentStreak;
      let bestStreak = habit.bestStreak;
      
      if (wasCompleted) {
        updatedDates = habit.completedDates.filter(date => date !== today);
        currentStreak = Math.max(0, currentStreak - 1);
      } else {
        updatedDates = [...habit.completedDates, today].sort();
        currentStreak = calculateStreak(updatedDates);
        bestStreak = Math.max(bestStreak, currentStreak);
        
        // Trigger confetti celebration
        triggerConfetti();
        
        toast({
          title: "Great job! ✨",
          description: `${habit.name} completed! Streak: ${currentStreak} days`,
          duration: 2000,
        });
      }
      
      return {
        ...habit,
        completedDates: updatedDates,
        currentStreak,
        bestStreak,
      };
    }));
  };

  const deleteHabit = (habitId: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== habitId));
    toast({
      title: "Habit removed",
      description: "The habit has been deleted from your tracker.",
      duration: 2000,
    });
  };

  const calculateStreak = (dates: string[]): number => {
    if (dates.length === 0) return 0;
    
    const sortedDates = [...dates].sort().reverse();
    const today = new Date();
    let streak = 0;
    
    for (let i = 0; i < sortedDates.length; i++) {
      const date = new Date(sortedDates[i]);
      const daysDiff = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === i) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Daily Quote */}
      <DailyQuote />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Countdown Timer */}
        <CountdownTimer />
        
        {/* Mood Logger */}
        <MoodLogger />
        
        {/* Progress Overview */}
        <div className="lg:col-span-1">
          <ProgressOverview habits={habits} />
        </div>
      </div>
      
      {/* Achievements */}
      <Achievements habits={habits} />
      
      {/* Navigation & Add Habit */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Today's Habits</h2>
            <span className="text-sm text-muted-foreground">({habits.length})</span>
          </div>
          
          <Button
            variant="outline"
            onClick={() => navigate('/analytics')}
            className="flex items-center gap-2 hover:border-primary hover:text-primary transition-smooth"
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </Button>
        </div>
        
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="gradient-primary text-white hover:shadow-glow transition-all duration-300 hover:scale-105"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Habit
        </Button>
      </div>

      {/* Add Habit Form */}
      {showAddForm && (
        <div className="animate-fade-in">
          <AddHabitForm 
            onAdd={addHabit} 
            onCancel={() => setShowAddForm(false)} 
          />
        </div>
      )}

      {/* Habits List */}
      {habits.length === 0 ? (
        <div className="wellness-card p-12 text-center">
          <Sparkles className="w-16 h-16 text-primary mx-auto mb-4 animate-float" />
          <h3 className="text-xl font-semibold mb-2">Start Your Wellness Journey</h3>
          <p className="text-muted-foreground mb-6">
            Add your first habit to begin tracking your daily wellness goals.
          </p>
          <Button
            onClick={() => setShowAddForm(true)}
            className="gradient-primary text-white hover:shadow-glow"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Habit
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:gap-6">
          {habits.map(habit => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onToggle={toggleHabit}
              onDelete={deleteHabit}
            />
          ))}
        </div>
      )}
    </div>
  );
};