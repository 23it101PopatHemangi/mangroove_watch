import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Award, Users, TrendingUp, Star, Crown, Shield, Leaf, User, Zap, Target, Heart } from "lucide-react";
import { users, getTopUsers, getUsersByBadge } from "@/data/mangroveData";
import { gamificationAPI } from "@/services/api";

interface User {
  id: number;
  name: string;
  points: number;
  badge: 'Newbie' | 'Mangrove Guardian' | 'Eco Warrior' | 'Master Guardian';
  reports?: number;
  badges?: string[];
}

const Leaderboard = () => {
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'all'>('month');
  const [filterBadge, setFilterBadge] = useState<string>('all');
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await gamificationAPI.getLeaderboard();
        setLeaderboardData(response.data || []);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
        // Fallback to existing data
        setLeaderboardData(users);
      }
    };

    fetchLeaderboard();
  }, []);

  // Use real user data from mangroveData
  const filteredUsers = filterBadge === 'all' 
    ? users 
    : getUsersByBadge(filterBadge as any);

  const sortedUsers = [...filteredUsers].sort((a, b) => b.points - a.points);
  const topUsers = getTopUsers(10);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2: return <Medal className="h-6 w-6 text-gray-400" />;
      case 3: return <Award className="h-6 w-6 text-amber-600" />;
      default: return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankCardStyle = (rank: number) => {
    switch (rank) {
      case 1: return "border-yellow-500/50 bg-gradient-to-r from-yellow-50 to-amber-50 shadow-lg";
      case 2: return "border-gray-400/50 bg-gradient-to-r from-gray-50 to-slate-50 shadow-md";
      case 3: return "border-amber-600/50 bg-gradient-to-r from-amber-50 to-orange-50 shadow-md";
      default: return "border-eco-sage/20 bg-card";
    }
  };

  const getBadgeColor = (badge: string) => {
    const colors: { [key: string]: string } = {
      'Master Guardian': 'bg-purple-500 text-white',
      'Eco Warrior': 'bg-green-500 text-white',
      'Mangrove Guardian': 'bg-blue-500 text-white',
      'Newbie': 'bg-gray-500 text-white',
      'Conservation Hero': 'bg-red-500 text-white',
      'Trusted Reporter': 'bg-blue-600 text-white',
      'Active Citizen': 'bg-orange-500 text-white'
    };
    return colors[badge] || 'bg-muted text-muted-foreground';
  };

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case "Master Guardian": return <Crown className="h-4 w-4" />;
      case "Eco Warrior": return <Shield className="h-4 w-4" />;
      case "Mangrove Guardian": return <Leaf className="h-4 w-4" />;
      case "Newbie": return <User className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const totalPoints = users.reduce((sum, user) => sum + user.points, 0);
  const totalUsers = users.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-eco-mint/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-eco-forest mb-4 flex items-center justify-center space-x-3">
            <Trophy className="h-10 w-10 text-yellow-500" />
            <span>Leaderboard</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Celebrating our top environmental guardians
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-eco border-eco-sage/20">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-eco-green mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-eco-forest">{totalUsers}</h3>
              <p className="text-muted-foreground">Active Guardians</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-eco border-eco-sage/20">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-eco-green mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-eco-forest">{totalPoints}</h3>
              <p className="text-muted-foreground">Total Points</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-eco border-eco-sage/20">
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 text-eco-green mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-eco-forest">{users.reduce((sum, user) => sum + user.points, 0)}</h3>
              <p className="text-muted-foreground">Total Points</p>
            </CardContent>
          </Card>
        </div>

        {/* Time Filter */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2 bg-muted p-1 rounded-lg">
            {(['week', 'month', 'all'] as const).map((filter) => (
              <Button
                key={filter}
                variant={timeFilter === filter ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeFilter(filter)}
                className={timeFilter === filter ? "bg-eco-green hover:bg-eco-green-dark" : ""}
              >
                {filter === 'week' ? 'This Week' : filter === 'month' ? 'This Month' : 'All Time'}
              </Button>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {sortedUsers.map((user, index) => (
              <Card
                key={user.id}
                className={`transition-all hover:shadow-lg ${getRankCardStyle(index + 1)}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Rank */}
                      <div className="flex items-center justify-center w-12 h-12">
                        {getRankIcon(index + 1)}
                      </div>
                      
                      {/* Avatar & Info */}
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl">🌿</div>
                        <div>
                          <h3 className="font-bold text-lg text-eco-forest">{user.name}</h3>
                          <p className="text-sm text-muted-foreground">Mangrove Guardian</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            <Badge className={`text-xs ${getBadgeColor(user.badge)} flex items-center gap-1`}>
                              {getBadgeIcon(user.badge)}
                              {user.badge}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="text-right">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-eco-forest">{user.points}</p>
                        <p className="text-xs text-muted-foreground">Points</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Card className="max-w-md mx-auto shadow-eco border-eco-green/20 bg-gradient-to-r from-eco-mint to-eco-sage/20">
            <CardHeader>
              <CardTitle className="text-eco-forest">Join the Mission!</CardTitle>
              <CardDescription>
                Start reporting threats and climb the leaderboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-eco-green hover:bg-eco-green-dark text-white">
                Submit Your First Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;