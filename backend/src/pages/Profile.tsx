import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  MapPin, 
  Calendar, 
  Trophy, 
  Star, 
  Camera, 
  Target,
  TrendingUp,
  Award,
  Medal,
  Crown,
  Shield
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { toast } = useToast();

  // Mock user data
  const user = {
    name: "Arjun Nair",
    email: "arjun.nair@email.com",
    location: "Kochi, Kerala",
    joinDate: "2024-08-15",
    totalPoints: 347,
    level: 8,
    nextLevelPoints: 400,
    reportsSubmitted: 23,
    accuracy: 94,
    streak: 7,
    avatar: "/api/placeholder/120/120"
  };

  const badges = [
    {
      id: "guardian",
      name: "Mangrove Guardian",
      description: "Submitted 20+ verified reports",
      icon: Shield,
      earned: true,
      rarity: "rare",
      earnedDate: "2024-12-10"
    },
    {
      id: "warrior",
      name: "Eco Warrior",
      description: "Active for 30 consecutive days",
      icon: Medal,
      earned: true,
      rarity: "common",
      earnedDate: "2024-12-01"
    },
    {
      id: "expert",
      name: "Threat Expert",
      description: "95% report accuracy rate",
      icon: Star,
      earned: false,
      rarity: "legendary",
      earnedDate: null
    },
    {
      id: "champion",
      name: "Community Champion",
      description: "Referred 10+ new users",
      icon: Crown,
      earned: false,
      rarity: "epic",
      earnedDate: null
    },
    {
      id: "photographer",
      name: "Nature Photographer",
      description: "High-quality photo submissions",
      icon: Camera,
      earned: true,
      rarity: "common", 
      earnedDate: "2024-11-28"
    },
    {
      id: "ambassador",
      name: "Knowledge Ambassador",
      description: "Shared 50+ educational facts",
      icon: Award,
      earned: false,
      rarity: "rare",
      earnedDate: null
    }
  ];

  const recentActivity = [
    {
      type: "report",
      description: "Reported illegal mangrove cutting",
      location: "Backwaters, Alleppey",
      points: 15,
      date: "2 hours ago",
      verified: true
    },
    {
      type: "badge",
      description: "Earned Mangrove Guardian badge",
      points: 50,
      date: "1 day ago"
    },
    {
      type: "challenge",
      description: "Completed Weekly Patrol Challenge",
      points: 25,
      date: "3 days ago"
    },
    {
      type: "education",
      description: "Completed lesson: Conservation Strategies", 
      points: 15,
      date: "5 days ago"
    }
  ];

  const monthlyStats = [
    { month: "Aug", reports: 8, points: 120 },
    { month: "Sep", reports: 12, points: 180 },
    { month: "Oct", reports: 15, points: 225 },
    { month: "Nov", reports: 18, points: 270 },
    { month: "Dec", reports: 23, points: 347 }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "border-gray-400 bg-gray-50";
      case "rare": return "border-blue-400 bg-blue-50";
      case "epic": return "border-purple-400 bg-purple-50";
      case "legendary": return "border-yellow-400 bg-yellow-50";
      default: return "border-gray-400 bg-gray-50";
    }
  };

  const progressToNextLevel = ((user.totalPoints % 50) / 50) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-mint/20 via-background to-eco-sage/10">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8 shadow-eco border-eco-sage/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-eco-sage text-eco-forest text-xl">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-eco-forest">{user.name}</h1>
                <p className="text-muted-foreground flex items-center justify-center md:justify-start mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  {user.location}
                </p>
                <p className="text-sm text-muted-foreground flex items-center justify-center md:justify-start mt-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  Guardian since {new Date(user.joinDate).toLocaleDateString()}
                </p>
                
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-eco-green">{user.totalPoints}</div>
                    <div className="text-sm text-muted-foreground">Total Points</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-eco-forest">Level {user.level}</div>
                    <div className="text-sm text-muted-foreground">Current Level</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-eco-sage">{user.reportsSubmitted}</div>
                    <div className="text-sm text-muted-foreground">Reports</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-eco-mint">{user.accuracy}%</div>
                    <div className="text-sm text-muted-foreground">Accuracy</div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="mb-2">
                  <Badge className="bg-eco-green text-white">
                    {user.streak} day streak 🔥
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  {user.nextLevelPoints - user.totalPoints} points to Level {user.level + 1}
                </div>
                <Progress value={progressToNextLevel} className="w-32" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="badges" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="badges">Badges & Achievements</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          {/* Badges Tab */}
          <TabsContent value="badges" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {badges.map((badge) => {
                const Icon = badge.icon;
                return (
                  <Card 
                    key={badge.id} 
                    className={`shadow-eco transition-all hover:shadow-lg ${
                      badge.earned 
                        ? getRarityColor(badge.rarity) 
                        : 'border-gray-200 bg-gray-50 opacity-60'
                    }`}
                  >
                    <CardHeader className="text-center">
                      <div className={`mx-auto p-4 rounded-full w-16 h-16 flex items-center justify-center ${
                        badge.earned 
                          ? 'bg-eco-green text-white' 
                          : 'bg-gray-300 text-gray-500'
                      }`}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <CardTitle className={`text-lg ${badge.earned ? 'text-eco-forest' : 'text-gray-500'}`}>
                        {badge.name}
                      </CardTitle>
                      <CardDescription>{badge.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center space-y-2">
                        <Badge 
                          variant={badge.earned ? "default" : "secondary"}
                          className={badge.earned ? "bg-eco-green text-white" : ""}
                        >
                          {badge.rarity.toUpperCase()}
                        </Badge>
                        {badge.earned && badge.earnedDate && (
                          <p className="text-xs text-muted-foreground">
                            Earned on {new Date(badge.earnedDate).toLocaleDateString()}
                          </p>
                        )}
                        {!badge.earned && (
                          <p className="text-xs text-muted-foreground">Not earned yet</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card className="shadow-eco border-eco-sage/20">
              <CardHeader>
                <CardTitle className="text-eco-forest">Recent Activity</CardTitle>
                <CardDescription>Your latest contributions to mangrove protection</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 rounded-lg bg-gradient-to-r from-eco-mint/5 to-transparent border border-eco-sage/10">
                      <div className="p-2 rounded-full bg-eco-green/10">
                        {activity.type === "report" && <Target className="h-5 w-5 text-eco-green" />}
                        {activity.type === "badge" && <Trophy className="h-5 w-5 text-eco-green" />}
                        {activity.type === "challenge" && <Medal className="h-5 w-5 text-eco-green" />}
                        {activity.type === "education" && <Star className="h-5 w-5 text-eco-green" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-eco-forest">{activity.description}</p>
                        {activity.location && (
                          <p className="text-sm text-muted-foreground">{activity.location}</p>
                        )}
                        <p className="text-xs text-muted-foreground">{activity.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-eco-green">+{activity.points}</p>
                        {activity.verified && (
                          <Badge variant="secondary" className="text-xs">Verified</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="stats" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-eco border-eco-sage/20">
                <CardHeader>
                  <CardTitle className="text-eco-forest flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Monthly Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {monthlyStats.map((stat) => (
                      <div key={stat.month} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{stat.month} 2024</span>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-muted-foreground">{stat.reports} reports</span>
                          <span className="font-bold text-eco-green">{stat.points} pts</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-eco border-eco-sage/20">
                <CardHeader>
                  <CardTitle className="text-eco-forest">Impact Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm">Mangroves Protected</span>
                      <span className="font-bold text-eco-green">127 hectares</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Carbon Saved</span>
                      <span className="font-bold text-eco-green">2.3k tons CO₂</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Threats Prevented</span>
                      <span className="font-bold text-eco-green">18 incidents</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Community Rank</span>
                      <span className="font-bold text-eco-green">#3 in Kerala</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;