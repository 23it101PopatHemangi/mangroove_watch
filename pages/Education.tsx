import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Lightbulb, Leaf, Shield, Globe, Users, Play, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Education = () => {
  const [completedLessons, setCompletedLessons] = useState<string[]>(["1", "3"]);
  const [sharedFacts, setSharedFacts] = useState<string[]>([]);
  const { toast } = useToast();

  const ecoFacts = [
    {
      id: "1",
      icon: Leaf,
      title: "Carbon Storage Champions",
      fact: "Mangroves store 10x more carbon per hectare than tropical rainforests!",
      detail: "Despite covering only 0.1% of Earth's surface, mangroves store 1-10% of global carbon.",
      shareText: "🌱 Did you know? Mangroves are carbon storage champions! They store 10x more carbon than rainforests. #MangroveWatch #ClimateAction"
    },
    {
      id: "2", 
      icon: Shield,
      title: "Natural Storm Barriers",
      fact: "Mangroves reduce wave energy by up to 70%, protecting coastal communities.",
      detail: "A 100m wide mangrove belt can reduce wave heights by 13-66% and protect against tsunamis.",
      shareText: "🛡️ Mangroves are nature's storm barriers! They reduce wave energy by 70% protecting millions of people. #CoastalProtection #MangroveWatch"
    },
    {
      id: "3",
      icon: Globe,
      title: "Biodiversity Hotspots", 
      fact: "Mangroves support 75% of tropical fish species during part of their life cycle.",
      detail: "These ecosystems are nurseries for countless species, supporting entire food webs.",
      shareText: "🐟 Amazing! 75% of tropical fish depend on mangroves as nurseries. Protecting mangroves = protecting marine life! #Biodiversity #MangroveWatch"
    },
    {
      id: "4",
      icon: Users,
      title: "Livelihoods Support",
      fact: "Over 120 million people worldwide depend on mangroves for their livelihoods.",
      detail: "From fishing to tourism, mangroves provide sustainable income for coastal communities.",
      shareText: "👥 120 million people depend on mangroves for their livelihoods! These ecosystems support entire communities. #SustainableLiving #MangroveWatch"
    }
  ];

  const lessons = [
    {
      id: "1",
      title: "What Are Mangroves?",
      duration: "5 min",
      difficulty: "Beginner",
      description: "Learn about mangrove ecosystems and their unique characteristics.",
      topics: ["Definition", "Types", "Global Distribution", "Unique Adaptations"],
      completed: true
    },
    {
      id: "2",
      title: "Threats to Mangroves",
      duration: "8 min", 
      difficulty: "Beginner",
      description: "Understand the major threats facing mangrove ecosystems worldwide.",
      topics: ["Deforestation", "Pollution", "Climate Change", "Urban Development"],
      completed: false
    },
    {
      id: "3",
      title: "Conservation Strategies",
      duration: "10 min",
      difficulty: "Intermediate", 
      description: "Explore effective methods for mangrove conservation and restoration.",
      topics: ["Community Involvement", "Legal Protection", "Restoration Techniques", "Monitoring"],
      completed: true
    },
    {
      id: "4",
      title: "Citizen Science & Reporting",
      duration: "6 min",
      difficulty: "Beginner",
      description: "Learn how to effectively document and report mangrove threats.",
      topics: ["Photography Tips", "GPS Accuracy", "Threat Identification", "Report Writing"],
      completed: false
    }
  ];

  const completedCount = lessons.filter(lesson => completedLessons.includes(lesson.id)).length;
  const progressPercentage = (completedCount / lessons.length) * 100;

  const completeLesson = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId]);
      toast({
        title: "Lesson Completed! 🎓",
        description: "You earned +15 knowledge points! Keep learning to become a mangrove expert.",
      });
    }
  };

  const shareFact = (factId: string, shareText: string) => {
    setSharedFacts([...sharedFacts, factId]);
    navigator.clipboard.writeText(shareText);
    toast({
      title: "Fact Copied! 📋",
      description: "Share this on social media to spread awareness about mangroves.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-mint/20 via-background to-eco-sage/10">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-eco-forest mb-4">Mangrove Academy</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Become a mangrove expert! Learn about these incredible ecosystems and how to protect them.
          </p>
        </div>

        {/* Learning Progress */}
        <Card className="mb-8 shadow-eco border-eco-sage/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-eco-forest">Your Learning Journey</CardTitle>
                <CardDescription>Track your progress toward becoming a Mangrove Expert</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-eco-green">{completedCount}/{lessons.length}</div>
                <div className="text-sm text-muted-foreground">Lessons Completed</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <div className="text-sm text-muted-foreground">
                {progressPercentage === 100 ? "🎉 Congratulations! You're a Mangrove Expert!" : 
                 progressPercentage >= 75 ? "🌟 Almost there! You're becoming an expert!" :
                 progressPercentage >= 50 ? "📚 Great progress! Keep learning!" :
                 "🌱 Just getting started! Every expert was once a beginner."}
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="lessons" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="lessons">Interactive Lessons</TabsTrigger>
            <TabsTrigger value="facts">Share & Learn</TabsTrigger>
          </TabsList>

          {/* Lessons Tab */}
          <TabsContent value="lessons" className="space-y-6">
            <div className="grid gap-6">
              {lessons.map((lesson) => (
                <Card key={lesson.id} className="shadow-eco border-eco-sage/20">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-full ${
                          completedLessons.includes(lesson.id) 
                            ? 'bg-eco-green text-white' 
                            : 'bg-eco-sage/20 text-eco-forest'
                        }`}>
                          {completedLessons.includes(lesson.id) ? (
                            <CheckCircle className="h-6 w-6" />
                          ) : (
                            <BookOpen className="h-6 w-6" />
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-eco-forest">{lesson.title}</CardTitle>
                          <CardDescription className="mt-2">{lesson.description}</CardDescription>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <Badge variant="secondary">{lesson.difficulty}</Badge>
                        <div className="text-sm text-muted-foreground">{lesson.duration}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-eco-forest mb-2">What you'll learn:</h4>
                        <div className="flex flex-wrap gap-2">
                          {lesson.topics.map((topic) => (
                            <Badge key={topic} variant="outline" className="border-eco-sage text-eco-forest">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => completeLesson(lesson.id)}
                        disabled={completedLessons.includes(lesson.id)}
                        className={`w-full ${
                          completedLessons.includes(lesson.id)
                            ? 'bg-eco-sage text-eco-forest'
                            : 'bg-eco-green hover:bg-eco-green-dark text-white'
                        }`}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        {completedLessons.includes(lesson.id) ? "Completed ✓" : "Start Lesson"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Facts Tab */}
          <TabsContent value="facts" className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-eco-forest mb-2">Amazing Mangrove Facts</h3>
              <p className="text-muted-foreground">Share these facts to spread awareness and earn knowledge points!</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {ecoFacts.map((fact) => {
                const Icon = fact.icon;
                return (
                  <Card key={fact.id} className="shadow-eco border-eco-sage/20 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-full bg-eco-green/10">
                          <Icon className="h-6 w-6 text-eco-green" />
                        </div>
                        <CardTitle className="text-eco-forest">{fact.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 bg-eco-mint/10 rounded-lg border-l-4 border-eco-green">
                          <p className="font-medium text-eco-forest">{fact.fact}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{fact.detail}</p>
                        
                        <Button
                          onClick={() => shareFact(fact.id, fact.shareText)}
                          variant="outline"
                          className="w-full border-eco-sage text-eco-forest hover:bg-eco-sage/20"
                          disabled={sharedFacts.includes(fact.id)}
                        >
                          <Lightbulb className="h-4 w-4 mr-2" />
                          {sharedFacts.includes(fact.id) ? "Shared ✓" : "Copy & Share (+5 points)"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Education;