import { Habit } from "./WellnessTracker";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Target, 
  Calendar, 
  Award,
  Activity,
  Brain,
  Apple,
  Moon,
  BookOpen,
  Sparkles
} from "lucide-react";

interface ProgressOverviewProps {
  habits: Habit[];
}

const categoryIcons = {
  exercise: Activity,
  mindfulness: Brain,
  nutrition: Apple,
  sleep: Moon,
  learning: BookOpen,
  other: Sparkles,
};

export const ProgressOverview = ({ habits }: ProgressOverviewProps) => {
  const today = new Date().toISOString().split('T')[0];
  
  // Calculate statistics
  const completedToday = habits.filter(habit => 
    habit.completedDates.includes(today)
  ).length;
  
  const completionRate = habits.length > 0 ? (completedToday / habits.length) * 100 : 0;
  
  const totalStreaks = habits.reduce((sum, habit) => sum + habit.currentStreak, 0);
  const averageStreak = habits.length > 0 ? Math.round(totalStreaks / habits.length) : 0;
  
  const bestStreakEver = Math.max(0, ...habits.map(habit => habit.bestStreak));
  
  // Category breakdown
  const categoryStats = habits.reduce((acc, habit) => {
    const isCompletedToday = habit.completedDates.includes(today);
    if (!acc[habit.category]) {
      acc[habit.category] = { total: 0, completed: 0 };
    }
    acc[habit.category].total++;
    if (isCompletedToday) {
      acc[habit.category].completed++;
    }
    return acc;
  }, {} as Record<string, { total: number; completed: number }>);

  if (habits.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* Today's Progress */}
      <div className="wellness-card p-6 gradient-calm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Today's Progress</h3>
          </div>
          <Badge variant="secondary" className="bg-background/20">
            {completedToday}/{habits.length}
          </Badge>
        </div>
        
        <div className="space-y-3">
          <Progress 
            value={completionRate} 
            className="h-3 bg-background/30" 
          />
          <div className="flex justify-between text-sm">
            <span className="text-foreground/70">Completion Rate</span>
            <span className="font-semibold text-foreground">{Math.round(completionRate)}%</span>
          </div>
        </div>
      </div>

      {/* Average Streak */}
      <div className="wellness-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-orange-500" />
          <h3 className="font-semibold">Average Streak</h3>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-orange-500 mb-1">
            {averageStreak}
          </div>
          <div className="text-sm text-muted-foreground">days on average</div>
        </div>
      </div>

      {/* Best Streak */}
      <div className="wellness-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-amber-500" />
          <h3 className="font-semibold">Best Streak</h3>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-amber-500 mb-1">
            {bestStreakEver}
          </div>
          <div className="text-sm text-muted-foreground">days personal best</div>
        </div>
      </div>

      {/* Total Habits */}
      <div className="wellness-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Total Habits</h3>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-primary mb-1">
            {habits.length}
          </div>
          <div className="text-sm text-muted-foreground">habits tracked</div>
        </div>
      </div>

      {/* Category Breakdown */}
      {Object.keys(categoryStats).length > 0 && (
        <div className="wellness-card p-6 md:col-span-2 lg:col-span-4">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Category Breakdown</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(categoryStats).map(([category, stats]) => {
              const IconComponent = categoryIcons[category as keyof typeof categoryIcons];
              const percentage = (stats.completed / stats.total) * 100;
              
              return (
                <div key={category} className="text-center space-y-2">
                  <div className="flex justify-center">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-sm font-medium capitalize">{category}</div>
                  <div className="text-xs text-muted-foreground">
                    {stats.completed}/{stats.total} completed
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};