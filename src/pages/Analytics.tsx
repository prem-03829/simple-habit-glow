import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { ArrowLeft, Calendar, TrendingUp, Target, Award } from "lucide-react";
import { Habit } from "@/components/WellnessTracker";

const Analytics = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('weekly');
  
  // Load habits from localStorage
  const habits: Habit[] = useMemo(() => {
    try {
      const saved = localStorage.getItem("wellness-habits");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }, []);

  // Generate analytics data
  const analyticsData = useMemo(() => {
    const now = new Date();
    const data = [];
    
    let days = 7;
    let format = 'EEE';
    
    switch (timeRange) {
      case 'daily':
        days = 24;
        format = 'HH:mm';
        break;
      case 'weekly':
        days = 7;
        format = 'EEE';
        break;
      case 'monthly':
        days = 30;
        format = 'MMM dd';
        break;
      case 'yearly':
        days = 12;
        format = 'MMM';
        break;
    }

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      
      if (timeRange === 'daily') {
        date.setHours(date.getHours() - i);
      } else if (timeRange === 'yearly') {
        date.setMonth(date.getMonth() - i);
      } else {
        date.setDate(date.getDate() - i);
      }
      
      const dateStr = date.toISOString().split('T')[0];
      const completedCount = habits.reduce((count, habit) => {
        return count + (habit.completedDates.includes(dateStr) ? 1 : 0);
      }, 0);
      
      data.push({
        date: timeRange === 'daily' ? `${date.getHours()}:00` : 
              timeRange === 'yearly' ? date.toLocaleDateString('en', { month: 'short' }) :
              date.toLocaleDateString('en', { month: 'short', day: 'numeric' }),
        completed: completedCount,
        total: habits.length,
        percentage: habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0
      });
    }
    
    return data;
  }, [habits, timeRange]);

  // Category breakdown
  const categoryData = useMemo(() => {
    const categories = habits.reduce((acc, habit) => {
      acc[habit.category] = (acc[habit.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const colors = {
      exercise: '#ef4444',
      mindfulness: '#8b5cf6', 
      nutrition: '#22c55e',
      sleep: '#06b6d4',
      learning: '#f59e0b',
      other: '#6b7280'
    };

    return Object.entries(categories).map(([category, count]) => ({
      name: category,
      value: count,
      color: colors[category as keyof typeof colors] || '#6b7280'
    }));
  }, [habits]);

  // Stats
  const stats = useMemo(() => {
    const totalHabits = habits.length;
    const totalCompletions = habits.reduce((sum, habit) => sum + habit.completedDates.length, 0);
    const currentStreaks = habits.reduce((sum, habit) => sum + habit.currentStreak, 0);
    const bestStreak = Math.max(...habits.map(h => h.bestStreak), 0);
    
    return {
      totalHabits,
      totalCompletions,
      avgCurrentStreak: totalHabits > 0 ? Math.round(currentStreaks / totalHabits) : 0,
      bestStreak
    };
  }, [habits]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/20">
      <header className="flex items-center gap-4 p-6 md:p-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="flex items-center gap-2 hover:bg-secondary/50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tracker
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">Track your wellness journey progress</p>
        </div>
      </header>

      <main className="container mx-auto px-6 pb-12 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="wellness-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Habits</CardTitle>
              <Target className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.totalHabits}</div>
            </CardContent>
          </Card>
          
          <Card className="wellness-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completions</CardTitle>
              <Calendar className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{stats.totalCompletions}</div>
            </CardContent>
          </Card>
          
          <Card className="wellness-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Streak</CardTitle>
              <TrendingUp className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{stats.avgCurrentStreak}</div>
            </CardContent>
          </Card>
          
          <Card className="wellness-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Best Streak</CardTitle>
              <Award className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-500">{stats.bestStreak}</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs value={timeRange} onValueChange={(value) => setTimeRange(value as any)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {/* Completion Chart */}
            <Card className="wellness-card">
              <CardHeader>
                <CardTitle>Habit Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="completed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Percentage Chart */}
            <Card className="wellness-card">
              <CardHeader>
                <CardTitle>Success Percentage</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="percentage" 
                      stroke="hsl(var(--success))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Breakdown */}
            <Card className="wellness-card">
              <CardHeader>
                <CardTitle>Habit Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-2 justify-center mt-4">
                  {categoryData.map((category) => (
                    <div key={category.name} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color }} 
                      />
                      <span className="text-sm capitalize">{category.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </Tabs>
      </main>
    </div>
  );
};

export default Analytics;