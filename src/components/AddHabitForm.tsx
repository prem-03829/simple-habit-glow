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
  onAdd: (name: string, category: Habit['category'], icon?: string, color?: string) => void;
  onCancel: () => void;
}

const categoryIcons = {
  exercise: ["🏃", "💪", "🚴", "🏋️", "⚽", "🏊", "🧘"],
  mindfulness: ["🧘", "🕯️", "🌸", "☮️", "🧠", "💭", "🌺"],
  nutrition: ["🥗", "🍎", "🥑", "🍇", "🥕", "💧", "🌱"],
  sleep: ["😴", "🌙", "🛏️", "⭐", "🌃", "💤", "🌌"],
  learning: ["📚", "🎓", "📖", "✏️", "🧮", "💡", "🎯"],
  other: ["✨", "🎨", "🎵", "🌟", "💚", "🔥", "⚡"]
};

const categoryColors = {
  exercise: ["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4"],
  mindfulness: ["#8b5cf6", "#a855f7", "#c084fc", "#e879f9", "#f0abfc"],
  nutrition: ["#22c55e", "#16a34a", "#15803d", "#14532d", "#84cc16"],
  sleep: ["#3b82f6", "#1d4ed8", "#1e40af", "#1e3a8a", "#06b6d4"],
  learning: ["#f59e0b", "#d97706", "#b45309", "#92400e", "#eab308"],
  other: ["#6b7280", "#4b5563", "#374151", "#1f2937", "#9ca3af"]
};

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
  const [selectedIcon, setSelectedIcon] = useState<string>(categoryIcons.exercise[0]);
  const [selectedColor, setSelectedColor] = useState<string>(categoryColors.exercise[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name.trim(), selectedCategory, selectedIcon, selectedColor);
      setName("");
    }
  };

  const handleCategoryChange = (category: Habit['category']) => {
    setSelectedCategory(category);
    // Auto-select first icon and color for new category
    setSelectedIcon(categoryIcons[category][0]);
    setSelectedColor(categoryColors[category][0]);
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
            {Object.entries(categoryIcons).map(([key, icons]) => (
              <button
                key={key}
                type="button"
                onClick={() => handleCategoryChange(key as Habit['category'])}
                className={cn(
                  "flex items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200",
                  selectedCategory === key
                    ? "border-primary bg-primary/10 shadow-soft"
                    : "border-border hover:border-primary/50 hover:bg-primary/5"
                )}
              >
                <span className="text-lg">{icons[0]}</span>
                <span className="text-sm font-medium capitalize">{key}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Icon Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Choose Icon</Label>
          <div className="grid grid-cols-7 gap-2">
            {categoryIcons[selectedCategory].map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => setSelectedIcon(icon)}
                className={cn(
                  "h-12 rounded-lg border-2 text-xl transition-all duration-200 hover:scale-110",
                  selectedIcon === icon
                    ? "border-primary bg-primary/10 shadow-glow"
                    : "border-border hover:border-primary/50"
                )}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Color Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Choose Color</Label>
          <div className="flex gap-2 flex-wrap">
            {categoryColors[selectedCategory].map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={cn(
                  "w-10 h-10 rounded-lg border-2 transition-all duration-200 hover:scale-110",
                  selectedColor === color
                    ? "border-primary shadow-glow scale-110"
                    : "border-border hover:border-primary/50"
                )}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Preview */}
        {name && (
          <div className="p-4 rounded-lg bg-secondary/30 border border-border">
            <Label className="text-sm font-medium text-muted-foreground mb-2 block">Preview</Label>
            <div className="flex items-center gap-3">
              <div 
                className="p-3 rounded-2xl text-white shadow-soft flex items-center justify-center"
                style={{ backgroundColor: selectedColor }}
              >
                <span className="text-lg">{selectedIcon}</span>
              </div>
              <div>
                <h4 className="font-semibold">{name}</h4>
                <Badge variant="secondary" className="text-xs capitalize mt-1">
                  {selectedCategory}
                </Badge>
              </div>
            </div>
          </div>
        )}

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