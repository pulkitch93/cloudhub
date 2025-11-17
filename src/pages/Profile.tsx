import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Clock, Target, BookOpen, TrendingUp, Award } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Profile = () => {
  const recentActivity = [
    { module: "FinOps Dashboard", time: "2 hours ago", icon: TrendingUp },
    { module: "GreenOps Analytics", time: "5 hours ago", icon: Target },
    { module: "AI Models Training", time: "1 day ago", icon: BookOpen },
  ];

  const certifications = [
    { name: "XClarity Expert", issued: "2024-11", level: "Advanced" },
    { name: "FinOps Practitioner", issued: "2024-10", level: "Intermediate" },
    { name: "Cloud Infrastructure", issued: "2024-09", level: "Professional" },
  ];

  const learningProgress = [
    { course: "Advanced FinOps Optimization", progress: 75 },
    { course: "AI-Powered Infrastructure", progress: 45 },
    { course: "Sustainability Best Practices", progress: 90 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">User Profile</h2>
          <p className="text-muted-foreground">Manage your account and view your achievements</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Overview */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src="" alt="John Doe" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                    JD
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold text-foreground">John Doe</h3>
                <p className="text-sm text-muted-foreground mb-2">Infrastructure Admin</p>
                <Badge variant="secondary">Lenovo Enterprise</Badge>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="text-sm font-medium">john.doe@lenovo.com</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Role</span>
                  <span className="text-sm font-medium">Admin</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Member Since</span>
                  <span className="text-sm font-medium">Jan 2024</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last Login</span>
                  <span className="text-sm font-medium">Today, 9:30 AM</span>
                </div>
              </div>

              <Button className="w-full" variant="outline">Edit Profile</Button>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Certifications */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  <CardTitle>Certifications & Badges</CardTitle>
                </div>
                <CardDescription>Your earned certifications and achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {certifications.map((cert, index) => (
                    <div key={index} className="flex flex-col items-center p-4 border border-border rounded-lg hover:border-primary transition-colors">
                      <Trophy className="w-12 h-12 text-primary mb-3" />
                      <h4 className="font-semibold text-sm text-center mb-1">{cert.name}</h4>
                      <Badge variant="secondary" className="mb-2">{cert.level}</Badge>
                      <p className="text-xs text-muted-foreground">Issued: {cert.issued}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Learning Progress */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <CardTitle>Learning Progress</CardTitle>
                </div>
                <CardDescription>Your current courses and completion status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {learningProgress.map((course, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{course.course}</span>
                      <span className="text-sm text-muted-foreground">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <CardTitle>Recent Activity</CardTitle>
                </div>
                <CardDescription>Your latest platform interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 border border-border rounded-lg hover:bg-accent transition-colors">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <activity.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.module}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Usage Stats */}
            <Card>
              <CardHeader>
                <CardTitle>AI Usage Statistics</CardTitle>
                <CardDescription>Your interaction with AI features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 border border-border rounded-lg">
                    <p className="text-2xl font-bold text-primary">247</p>
                    <p className="text-xs text-muted-foreground">AI Queries</p>
                  </div>
                  <div className="text-center p-4 border border-border rounded-lg">
                    <p className="text-2xl font-bold text-primary">15</p>
                    <p className="text-xs text-muted-foreground">Models Used</p>
                  </div>
                  <div className="text-center p-4 border border-border rounded-lg">
                    <p className="text-2xl font-bold text-primary">98%</p>
                    <p className="text-xs text-muted-foreground">Accuracy Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
