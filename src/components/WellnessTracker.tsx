import { useState, useEffect } from "react";
import { HabitCard } from "./HabitCard";
import { AddHabitForm } from "./AddHabitForm";
import { DailyQuote } from "./DailyQuote"; 
import { ProgressOverview } from "./ProgressOverview";
import { Plus, Sparkles, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export interface Habit {
  id: string;
  name: string;
  category: 'exercise' | 'mindfulness' | 'nutrition' | 'sleep' | 'learning' | 'other';
  createdAt: string;
  completedDates: string[];
  currentStreak: number;
  bestStreak: number;
}

export const WellnessTracker = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

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

  const addHabit = (name: string, category: Habit['category']) => {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name,
      category,
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
      
      {/* Progress Overview */}
      <ProgressOverview habits={habits} />
      
      {/* Add Habit Button */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Today's Habits</h2>
          <span className="text-sm text-muted-foreground">({habits.length})</span>
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