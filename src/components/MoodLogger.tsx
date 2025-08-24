import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Smile } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MoodEntry {
  date: string;
  mood: string;
  emoji: string;
}

const moods = [
  { name: "amazing", emoji: "🤩", color: "from-green-400 to-emerald-500" },
  { name: "great", emoji: "😊", color: "from-blue-400 to-cyan-500" },
  { name: "good", emoji: "🙂", color: "from-teal-400 to-green-500" },
  { name: "okay", emoji: "😐", color: "from-yellow-400 to-orange-500" },
  { name: "meh", emoji: "😕", color: "from-orange-400 to-red-500" },
  { name: "stressed", emoji: "😤", color: "from-red-400 to-pink-500" },
  { name: "sad", emoji: "😢", color: "from-purple-400 to-indigo-500" },
];

export const MoodLogger = () => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [todaysMood, setTodaysMood] = useState<string | null>(null);
  const { toast } = useToast();

  const today = new Date().toISOString().split('T')[0];

  // Load mood entries from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("wellness-mood-entries");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMoodEntries(parsed);
        
        // Check if today's mood is already logged
        const todaysEntry = parsed.find((entry: MoodEntry) => entry.date === today);
        if (todaysEntry) {
          setTodaysMood(todaysEntry.mood);
        }
      } catch (error) {
        console.error("Failed to load mood entries:", error);
      }
    }
  }, [today]);

  // Save mood entries to localStorage
  useEffect(() => {
    localStorage.setItem("wellness-mood-entries", JSON.stringify(moodEntries));
  }, [moodEntries]);

  const logMood = (moodName: string, emoji: string) => {
    const newEntry: MoodEntry = {
      date: today,
      mood: moodName,
      emoji: emoji
    };

    // Remove existing entry for today if it exists
    const filteredEntries = moodEntries.filter(entry => entry.date !== today);
    setMoodEntries([...filteredEntries, newEntry]);
    setTodaysMood(moodName);

    toast({
      title: `Mood logged! ${emoji}`,
      description: `Feeling ${moodName} today - that's perfectly valid.`,
      duration: 3000,
    });
  };

  const getTodaysMoodEmoji = () => {
    if (!todaysMood) return null;
    const mood = moods.find(m => m.name === todaysMood);
    return mood?.emoji || null;
  };

  return (
    <div className="wellness-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="w-5 h-5 text-primary animate-pulse" />
        <h3 className="text-lg font-semibold">How are you feeling today?</h3>
        {getTodaysMoodEmoji() && (
          <span className="text-2xl animate-bounce">{getTodaysMoodEmoji()}</span>
        )}
      </div>

      {todaysMood ? (
        <div className="text-center py-4">
          <div className="text-6xl mb-4 animate-float">
            {getTodaysMoodEmoji()}
          </div>
          <p className="text-muted-foreground mb-4">
            You're feeling <span className="font-semibold capitalize text-foreground">{todaysMood}</span> today
          </p>
          <Button
            variant="outline"
            onClick={() => setTodaysMood(null)}
            className="hover:border-primary hover:text-primary transition-smooth"
          >
            <Smile className="w-4 h-4 mr-2" />
            Change Mood
          </Button>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-4">
            Track your daily mood to better understand your wellness patterns.
          </p>
          
          <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
            {moods.map((mood) => (
              <Button
                key={mood.name}
                variant="outline"
                onClick={() => logMood(mood.name, mood.emoji)}
                className={`
                  h-16 flex flex-col items-center justify-center p-2 
                  hover:scale-105 transition-all duration-300 
                  hover:shadow-glow hover:border-primary/50
                  group relative overflow-hidden
                `}
              >
                <div className={`
                  absolute inset-0 bg-gradient-to-br ${mood.color} 
                  opacity-0 group-hover:opacity-10 transition-opacity duration-300
                `} />
                <div className="text-2xl mb-1 group-hover:scale-110 transition-transform duration-300">
                  {mood.emoji}
                </div>
                <div className="text-xs capitalize font-medium">
                  {mood.name}
                </div>
              </Button>
            ))}
          </div>
        </>
      )}

      {/* Recent moods */}
      {moodEntries.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Recent Moods</h4>
          <div className="flex gap-2 overflow-x-auto">
            {moodEntries
              .slice(-7)
              .reverse()
              .map((entry, index) => (
                <div 
                  key={entry.date}
                  className="flex flex-col items-center min-w-[50px] p-2 rounded-lg bg-secondary/30"
                  title={`${entry.date}: ${entry.mood}`}
                >
                  <div className="text-lg">{entry.emoji}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {index === 0 ? 'Today' : `${index + 1}d ago`}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};