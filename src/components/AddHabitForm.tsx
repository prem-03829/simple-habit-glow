import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Habit } from "./WellnessTracker";
import { 
  Activity, 
  Brain, 
  Apple, 
  Moon, 
  BookOpen, 
  Sparkles,
  X,
  Plus 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AddHabitFormProps {
  onAdd: (name: string, category: Habit['category']) => void;
  onCancel: () => void;
}

const categories = [
  { key: 'exercise' as const, label: 'Exercise', icon: Activity, color: 'from-red-400 to-pink-400' },
  { key: 'mindfulness' as const, label: 'Mindfulness', icon: Brain, color: 'from-purple-400 to-indigo-400' },
  { key: 'nutrition' as const, label: 'Nutrition', icon: Apple, color: 'from-green-400 to-emerald-400' },
  { key: 'sleep' as const, label: 'Sleep', icon: Moon, color: 'from-blue-400 to-cyan-400' },
  { key: 'learning' as const, label: 'Learning', icon: BookOpen, color: 'from-yellow-400 to-orange-400' },
  { key: 'other' as const, label: 'Other', icon: Sparkles, color: 'from-gray-400 to-slate-400' },
];

const habitSuggestions = {
  exercise: ['Morning walk', 'Yoga practice', '10 pushups', 'Gym session', 'Stretching'],
  mindfulness: ['Meditation', 'Deep breathing', 'Gratitude journal', 'Mindful eating', 'Nature observation'],
  nutrition: ['Drink water', 'Eat vegetables', 'No sugar', 'Healthy breakfast', 'Vitamins'],
  sleep: ['Sleep 8 hours', 'No screens before bed', 'Consistent bedtime', 'Relaxing routine', 'Dark room'],
  learning: ['Read 30 min', 'Learn new words', 'Practice skill', 'Watch educational video', 'Take notes'],
  other: ['Call family', 'Clean space', 'Practice hobby', 'Random act of kindness', 'Plan tomorrow'],
};

export const AddHabitForm = ({ onAdd, onCancel }: AddHabitFormProps) => {
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Habit['category']>('exercise');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name.trim(), selectedCategory);
      setName("");
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setName(suggestion);
  };

  return (
    <div className="wellness-card p-6 border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-primary-glow/5">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-primary">Add New Habit</h3>
        <Button
          onClick={onCancel}
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Habit Name Input */}
        <div className="space-y-2">
          <Label htmlFor="habit-name" className="text-sm font-medium">
            Habit Name
          </Label>
          <Input
            id="habit-name"
            type="text"
            placeholder="Enter your new habit..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-background/50 border-primary/20 focus:border-primary"
            autoFocus
          />
        </div>

        {/* Category Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Category</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {categories.map(({ key, label, icon: IconComponent, color }) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedCategory(key)}
                className={cn(
                  "flex items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200",
                  selectedCategory === key
                    ? "border-primary bg-primary/10 shadow-soft"
                    : "border-border hover:border-primary/50 hover:bg-primary/5"
                )}
              >
                <div className={cn(
                  "p-1.5 rounded-lg bg-gradient-to-r text-white text-xs",
                  color
                )}>
                  <IconComponent className="w-3 h-3" />
                </div>
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Habit Suggestions */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Suggestions</Label>
          <div className="flex flex-wrap gap-2">
            {habitSuggestions[selectedCategory].map((suggestion) => (
              <Badge
                key={suggestion}
                variant="secondary"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-3 py-1"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </Badge>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={!name.trim()}
            className="flex-1 gradient-primary text-white hover:shadow-glow transition-all duration-300 hover:scale-105"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Habit
          </Button>
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="hover:bg-muted"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};