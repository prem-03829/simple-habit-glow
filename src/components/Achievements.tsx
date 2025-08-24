import { useState, useEffect, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Flame, Target, Calendar, Award, Zap, Heart } from "lucide-react";
import { Habit } from "./WellnessTracker";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  condition: (habits: Habit[]) => boolean;
  earned: boolean;
  color: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface AchievementsProps {
  habits: Habit[];
}

export const Achievements = ({ habits }: AchievementsProps) => {
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [newlyUnlocked, setNewlyUnlocked] = useState<string[]>([]);

  // Load unlocked achievements from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("wellness-achievements");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUnlockedAchievements(parsed);
      } catch (error) {
        console.error("Failed to load achievements:", error);
      }
    }
  }, []);

  // Define all achievements
  const allAchievements = useMemo<Achievement[]>(() => [
    {
      id: "first-habit",
      title: "Getting Started",
      description: "Add your first habit",
      icon: Target,
      condition: (habits) => habits.length >= 1,
      earned: false,
      color: "text-blue-500",
      rarity: 'common'
    },
    {
      id: "habit-collector",
      title: "Habit Collector",
      description: "Track 5 different habits",
      icon: Star,
      condition: (habits) => habits.length >= 5,
      earned: false,
      color: "text-purple-500",
      rarity: 'rare'
    },
    {
      id: "first-week",
      title: "First Week Complete",
      description: "Complete any habit for 7 days straight",
      icon: Calendar,
      condition: (habits) => habits.some(h => h.bestStreak >= 7),
      earned: false,
      color: "text-green-500",
      rarity: 'common'
    },
    {
      id: "streak-master",
      title: "Streak Master",
      description: "Achieve a 30-day streak",
      icon: Flame,
      condition: (habits) => habits.some(h => h.bestStreak >= 30),
      earned: false,
      color: "text-orange-500",
      rarity: 'epic'
    },
    {
      id: "perfect-day",
      title: "Perfect Day",
      description: "Complete all habits in a single day",
      icon: Award,
      condition: (habits) => {
        const today = new Date().toISOString().split('T')[0];
        return habits.length > 0 && habits.every(h => h.completedDates.includes(today));
      },
      earned: false,
      color: "text-yellow-500",
      rarity: 'rare'
    },
    {
      id: "century-club",
      title: "Century Club",
      description: "Complete 100 total habit instances",
      icon: Trophy,
      condition: (habits) => {
        const total = habits.reduce((sum, h) => sum + h.completedDates.length, 0);
        return total >= 100;
      },
      earned: false,
      color: "text-amber-500",
      rarity: 'epic'
    },
    {
      id: "wellness-warrior",
      title: "Wellness Warrior",
      description: "Maintain 3 active streaks simultaneously",
      icon: Zap,
      condition: (habits) => {
        const activeStreaks = habits.filter(h => h.currentStreak > 0).length;
        return activeStreaks >= 3;
      },
      earned: false,
      color: "text-indigo-500",
      rarity: 'rare'
    },
    {
      id: "dedication",
      title: "True Dedication",
      description: "Achieve a 100-day streak",
      icon: Heart,
      condition: (habits) => habits.some(h => h.bestStreak >= 100),
      earned: false,
      color: "text-pink-500",
      rarity: 'legendary'
    }
  ], []);

  // Check for newly unlocked achievements
  useEffect(() => {
    const achievementsWithStatus = allAchievements.map(achievement => ({
      ...achievement,
      earned: unlockedAchievements.includes(achievement.id) || achievement.condition(habits)
    }));

    const newlyEarned = achievementsWithStatus
      .filter(achievement => achievement.earned && !unlockedAchievements.includes(achievement.id))
      .map(achievement => achievement.id);

    if (newlyEarned.length > 0) {
      const updatedUnlocked = [...unlockedAchievements, ...newlyEarned];
      setUnlockedAchievements(updatedUnlocked);
      setNewlyUnlocked(newlyEarned);
      
      // Save to localStorage
      localStorage.setItem("wellness-achievements", JSON.stringify(updatedUnlocked));
      
      // Clear newly unlocked after 5 seconds
      setTimeout(() => setNewlyUnlocked([]), 5000);
    }
  }, [habits, allAchievements, unlockedAchievements]);

  const achievementsWithStatus = allAchievements.map(achievement => ({
    ...achievement,
    earned: unlockedAchievements.includes(achievement.id) || achievement.condition(habits)
  }));

  const earnedCount = achievementsWithStatus.filter(a => a.earned).length;
  const totalCount = achievementsWithStatus.length;

  const getRarityBadge = (rarity: string) => {
    const rarityColors = {
      common: "bg-gray-500",
      rare: "bg-blue-500", 
      epic: "bg-purple-500",
      legendary: "bg-amber-500"
    };
    
    return (
      <Badge 
        className={`text-white text-xs ${rarityColors[rarity as keyof typeof rarityColors]} border-0`}
      >
        {rarity}
      </Badge>
    );
  };

  return (
    <div className="wellness-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-semibold">Achievements</h3>
        </div>
        <div className="text-sm text-muted-foreground">
          {earnedCount} / {totalCount}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span>Progress</span>
          <span>{Math.round((earnedCount / totalCount) * 100)}%</span>
        </div>
        <div className="h-3 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-primary-glow transition-all duration-500"
            style={{ width: `${(earnedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      {/* Newly unlocked achievements */}
      {newlyUnlocked.length > 0 && (
        <div className="mb-6 p-4 bg-gradient-to-r from-amber-400/10 to-yellow-400/10 border border-amber-400/20 rounded-2xl animate-fade-in">
          <h4 className="font-semibold text-amber-600 dark:text-amber-400 mb-2">
            🎉 New Achievement{newlyUnlocked.length > 1 ? 's' : ''} Unlocked!
          </h4>
          {newlyUnlocked.map(id => {
            const achievement = allAchievements.find(a => a.id === id);
            return achievement ? (
              <div key={id} className="flex items-center gap-2">
                <achievement.icon className={`w-4 h-4 ${achievement.color}`} />
                <span className="font-medium">{achievement.title}</span>
              </div>
            ) : null;
          })}
        </div>
      )}

      {/* Achievements grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievementsWithStatus.map((achievement) => {
          const IconComponent = achievement.icon;
          
          return (
            <div
              key={achievement.id}
              className={`
                p-4 rounded-xl border transition-all duration-300
                ${achievement.earned 
                  ? 'bg-gradient-to-br from-secondary/30 to-accent/30 border-primary/30 shadow-soft' 
                  : 'bg-muted/20 border-muted'
                }
                ${achievement.earned ? 'hover:shadow-glow' : ''}
              `}
            >
              <div className="flex items-start gap-3">
                <div className={`
                  p-2 rounded-lg
                  ${achievement.earned 
                    ? 'bg-gradient-to-br from-primary/20 to-primary-glow/20' 
                    : 'bg-muted/50'
                  }
                `}>
                  <IconComponent 
                    className={`w-5 h-5 ${achievement.earned ? achievement.color : 'text-muted-foreground'}`} 
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`font-semibold text-sm ${achievement.earned ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {achievement.title}
                    </h4>
                    {getRarityBadge(achievement.rarity)}
                  </div>
                  
                  <p className={`text-sm ${achievement.earned ? 'text-muted-foreground' : 'text-muted-foreground/70'}`}>
                    {achievement.description}
                  </p>
                  
                  {achievement.earned && (
                    <div className="mt-2">
                      <Badge variant="outline" className="text-xs border-success/50 text-success">
                        ✓ Completed
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};