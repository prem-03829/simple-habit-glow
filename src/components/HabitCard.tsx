import { useState } from "react";
import { Habit } from "./WellnessTracker";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  Flame, 
  Trophy, 
  Trash2, 
  Activity, 
  Brain, 
  Apple, 
  Moon, 
  BookOpen, 
  Sparkles 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HabitCardProps {
  habit: Habit;
  onToggle: (habitId: string) => void;
  onDelete: (habitId: string) => void;
}

const categoryIcons = {
  exercise: Activity,
  mindfulness: Brain,
  nutrition: Apple,
  sleep: Moon,
  learning: BookOpen,
  other: Sparkles,
};

const categoryColors = {
  exercise: "bg-gradient-to-r from-red-400 to-pink-400",
  mindfulness: "bg-gradient-to-r from-purple-400 to-indigo-400",
  nutrition: "bg-gradient-to-r from-green-400 to-emerald-400",
  sleep: "bg-gradient-to-r from-blue-400 to-cyan-400",
  learning: "bg-gradient-to-r from-yellow-400 to-orange-400",
  other: "bg-gradient-to-r from-gray-400 to-slate-400",
};

export const HabitCard = ({ habit, onToggle, onDelete }: HabitCardProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = habit.completedDates.includes(today);
  const IconComponent = categoryIcons[habit.category];
  
  const handleToggle = () => {
    onToggle(habit.id);
  };

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete(habit.id);
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  return (
    <div className={cn(
      "wellness-card p-6 transition-all duration-300 hover:shadow-glow hover:scale-[1.02] group cursor-pointer",
      isCompletedToday && "ring-2 ring-success/50 shadow-glow scale-[1.01]"
    )}>
      <div className="flex items-center justify-between">
        {/* Left side - Habit info */}
        <div className="flex items-center gap-4 flex-1">
          {/* Category icon */}
          <div className={cn(
            "p-3 rounded-2xl text-white shadow-soft transition-all duration-300 hover:scale-105",
            habit.color ? "" : categoryColors[habit.category]
          )} style={habit.color ? { backgroundColor: habit.color } : {}}>
            {habit.icon ? (
              <span className="text-lg">{habit.icon}</span>
            ) : (
              <IconComponent className="w-5 h-5" />
            )}
          </div>
          
          {/* Habit details */}
          <div className="flex-1">
            <h3 className={cn(
              "font-semibold text-lg transition-smooth",
              isCompletedToday && "text-success"
            )}>
              {habit.name}
            </h3>
            <div className="flex items-center gap-3 mt-1">
              <Badge variant="secondary" className="text-xs capitalize">
                {habit.category}
              </Badge>
              {habit.currentStreak > 0 && (
                <div className="flex items-center gap-1 text-orange-500">
                  <Flame className="w-4 h-4" />
                  <span className="text-sm font-medium">{habit.currentStreak} days</span>
                </div>
              )}
              {habit.bestStreak > 0 && (
                <div className="flex items-center gap-1 text-amber-500">
                  <Trophy className="w-4 h-4" />
                  <span className="text-sm text-muted-foreground">Best: {habit.bestStreak}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          {/* Complete button */}
          <Button
            onClick={handleToggle}
            variant={isCompletedToday ? "default" : "outline"}
            size="sm"
            className={cn(
              "transition-all duration-300 hover:scale-105",
              isCompletedToday 
                ? "gradient-success text-white shadow-glow animate-pulse-success" 
                : "hover:border-primary hover:text-primary hover:shadow-soft"
            )}
          >
            <Check className="w-4 h-4" />
            {isCompletedToday ? "Done" : "Mark"}
          </Button>

          {/* Delete button */}
          <Button
            onClick={handleDelete}
            variant="ghost"
            size="sm"
            className={cn(
              "text-muted-foreground hover:text-destructive transition-smooth",
              showDeleteConfirm && "text-destructive bg-destructive/10"
            )}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Progress visualization */}
      {habit.completedDates.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
            <span>Recent Progress</span>
            <span>{habit.completedDates.length} total completions</span>
          </div>
          
          {/* Last 30 days visualization */}
          <div className="flex gap-1">
            {Array.from({ length: 30 }, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - (29 - i));
              const dateString = date.toISOString().split('T')[0];
              const isCompleted = habit.completedDates.includes(dateString);
              const isToday = dateString === today;
              
              return (
                <div
                  key={dateString}
                  className={cn(
                    "w-3 h-3 rounded-sm border transition-smooth",
                    isCompleted 
                      ? "bg-success border-success shadow-sm" 
                      : "bg-muted border-border",
                    isToday && "ring-1 ring-primary"
                  )}
                  title={`${date.toLocaleDateString()} ${isCompleted ? '✓' : '○'}`}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};