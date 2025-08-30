import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Target, Trophy, MessageSquare, Heart, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Community = () => {
  const [joinedChallenges, setJoinedChallenges] = useState<string[]>([]);
  const { toast } = useToast();

  const challenges = [
    {
      id: "1",
      title: "Weekly Patrol Challenge",
      description: "Report 3 mangrove incidents this week",
      progress: 67,
      participants: 234,
      reward: "Mangrove Guardian Badge + 50 points",
      daysLeft: 3,
      category: "active"
    },
    {
      id: "2", 
      title: "Community Clean Drive",
      description: "Organize or join a cleanup in your area",
      progress: 23,
      participants: 89,
      reward: "Eco-Warrior Badge + 100 points",
      daysLeft: 7,
      category: "active"
    },
    {
      id: "3",
      title: "Education Ambassador",
      description: "Share 5 mangrove facts on social media",
      progress: 100,
      participants: 156,
      reward: "Knowledge Keeper Badge + 75 points", 
      daysLeft: 0,
      category: "completed"
    }
  ];

  const communityStats = [
    { label: "Active Guardians", value: "1,247", icon: Users, color: "text-eco-green" },
    { label: "Reports This Month", value: "892", icon: Target, color: "text-eco-forest" },
    { label: "Mangroves Protected", value: "2.4k hectares", icon: Heart, color: "text-eco-sage" },
    { label: "Communities Joined", value: "67", icon: Trophy, color: "text-eco-mint" }
  ];

  const topContributors = [
    { name: "Arjun Nair", location: "Kerala", reports: 45, badges: ["Guardian", "Warrior"], avatar: "/api/placeholder/40/40" },
    { name: "Priya Sharma", location: "Maharashtra", reports: 38, badges: ["Guardian", "Ambassador"], avatar: "/api/placeholder/40/40" },
    { name: "Ravi Patel", location: "Gujarat", reports: 32, badges: ["Warrior"], avatar: "/api/placeholder/40/40" },
    { name: "Sara Johnson", location: "Tamil Nadu", reports: 28, badges: ["Guardian"], avatar: "/api/placeholder/40/40" }
  ];

  const joinChallenge = (challengeId: string) => {
    if (!joinedChallenges.includes(challengeId)) {
      setJoinedChallenges([...joinedChallenges, challengeId]);
      toast({
        title: "Challenge Joined! 🎯",
        description: "You're now part of this community challenge. Good luck!",
      });
    }
  };

  const shareAchievement = () => {
    toast({
      title: "Shared Successfully! 📱",
      description: "Your achievement has been shared to inspire others.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-mint/20 via-background to-eco-sage/10">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-eco-forest mb-4">Community Hub</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join fellow guardians in protecting mangrove ecosystems. Take challenges, earn badges, and make an impact together.
          </p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {communityStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="text-center shadow-eco border-eco-sage/20">
                <CardContent className="p-4">
                  <Icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                  <p className="text-2xl font-bold text-eco-forest">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="challenges" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="leaderboard">Top Contributors</TabsTrigger>
            <TabsTrigger value="stories">Success Stories</TabsTrigger>
          </TabsList>

          {/* Challenges Tab */}
          <TabsContent value="challenges" className="space-y-6">
            <div className="grid gap-6">
              {challenges.map((challenge) => (
                <Card key={challenge.id} className="shadow-eco border-eco-sage/20">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-eco-forest">{challenge.title}</CardTitle>
                        <CardDescription className="mt-2">{challenge.description}</CardDescription>
                      </div>
                      <Badge 
                        variant={challenge.category === "completed" ? "default" : "secondary"}
                        className={challenge.category === "completed" ? "bg-eco-green text-white" : ""}
                      >
                        {challenge.category === "completed" ? "Completed" : `${challenge.daysLeft} days left`}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{challenge.progress}%</span>
                        </div>
                        <Progress value={challenge.progress} className="h-2" />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                          <Users className="inline h-4 w-4 mr-1" />
                          {challenge.participants} participants
                        </div>
                        <div className="text-sm font-medium text-eco-green">
                          🏆 {challenge.reward}
                        </div>
                      </div>

                      {challenge.category !== "completed" && (
                        <Button
                          onClick={() => joinChallenge(challenge.id)}
                          disabled={joinedChallenges.includes(challenge.id)}
                          className="w-full bg-eco-green hover:bg-eco-green-dark text-white"
                        >
                          {joinedChallenges.includes(challenge.id) ? "Joined ✓" : "Join Challenge"}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Top Contributors Tab */}
          <TabsContent value="leaderboard" className="space-y-6">
            <Card className="shadow-eco border-eco-sage/20">
              <CardHeader>
                <CardTitle className="text-eco-forest">Community Champions</CardTitle>
                <CardDescription>Our most active mangrove guardians this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topContributors.map((contributor, index) => (
                    <div key={contributor.name} className="flex items-center space-x-4 p-4 rounded-lg bg-gradient-to-r from-eco-mint/10 to-transparent">
                      <div className="text-2xl font-bold text-eco-forest w-8">
                        #{index + 1}
                      </div>
                      <Avatar>
                        <AvatarImage src={contributor.avatar} />
                        <AvatarFallback className="bg-eco-sage text-eco-forest">
                          {contributor.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold text-eco-forest">{contributor.name}</p>
                        <p className="text-sm text-muted-foreground">{contributor.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-eco-green">{contributor.reports} reports</p>
                        <div className="flex gap-1">
                          {contributor.badges.map((badge) => (
                            <Badge key={badge} variant="secondary" className="text-xs">
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={shareAchievement}
                        className="border-eco-sage text-eco-forest hover:bg-eco-sage/20"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Success Stories Tab */}
          <TabsContent value="stories" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-eco border-eco-sage/20">
                <CardHeader>
                  <CardTitle className="text-eco-forest text-lg">Sundarbans Success</CardTitle>
                  <CardDescription>Community effort saves 50 hectares</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    "Thanks to 89 community reports and quick action, we prevented illegal mangrove cutting that could have destroyed 50 hectares of the Sundarbans ecosystem."
                  </p>
                  <div className="flex items-center space-x-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="text-sm">127 community members involved</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-eco border-eco-sage/20">
                <CardHeader>
                  <CardTitle className="text-eco-forest text-lg">Kerala Restoration</CardTitle>
                  <CardDescription>From threat to thriving ecosystem</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    "What started as pollution reports led to a community-driven restoration project. Now 200+ new mangrove saplings are thriving!"
                  </p>
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4 text-eco-green" />
                    <span className="text-sm">Featured in local news</span>
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

export default Community;