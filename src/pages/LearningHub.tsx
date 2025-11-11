import { useState } from 'react';
import Header from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  GraduationCap, 
  Search, 
  Book, 
  Users, 
  Award, 
  TrendingUp,
  BookOpen,
  Video,
  MessageSquare,
  Star,
  Clock,
  CheckCircle2,
  Target,
  Sparkles,
  ExternalLink,
  Play,
  FileText,
  Lightbulb,
  MessageCircle
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  provider: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  progress: number;
  type: 'video' | 'lab' | 'article';
  tags: string[];
}

interface Partner {
  name: string;
  logo: string;
  resources: number;
  featured: boolean;
}

const mockCourses: Course[] = [
  {
    id: '1',
    title: 'VMware Aria Integration Fundamentals',
    provider: 'VMware',
    duration: '2h 30m',
    level: 'Beginner',
    progress: 65,
    type: 'video',
    tags: ['Integration', 'VMware', 'Cloud']
  },
  {
    id: '2',
    title: 'TruScale Billing Optimization',
    provider: 'Lenovo',
    duration: '1h 45m',
    level: 'Intermediate',
    progress: 0,
    type: 'lab',
    tags: ['FinOps', 'Billing', 'Cost Management']
  },
  {
    id: '3',
    title: 'Advanced AIOps with XClarity',
    provider: 'Lenovo',
    duration: '3h 15m',
    level: 'Advanced',
    progress: 30,
    type: 'video',
    tags: ['AIOps', 'ML', 'Operations']
  },
  {
    id: '4',
    title: 'Nutanix HCI Best Practices',
    provider: 'Nutanix',
    duration: '2h',
    level: 'Intermediate',
    progress: 100,
    type: 'article',
    tags: ['HCI', 'Infrastructure', 'Best Practices']
  },
  {
    id: '5',
    title: 'Azure Integration for Hybrid Cloud',
    provider: 'Microsoft',
    duration: '4h',
    level: 'Intermediate',
    progress: 45,
    type: 'video',
    tags: ['Azure', 'Hybrid', 'Cloud']
  },
  {
    id: '6',
    title: 'NVIDIA GPU Optimization',
    provider: 'NVIDIA',
    duration: '1h 30m',
    level: 'Advanced',
    progress: 0,
    type: 'lab',
    tags: ['GPU', 'Performance', 'AI']
  }
];

const mockPartners: Partner[] = [
  { name: 'VMware', logo: '🔷', resources: 24, featured: true },
  { name: 'Microsoft Azure', logo: '☁️', resources: 18, featured: true },
  { name: 'Nutanix', logo: '🔶', resources: 15, featured: false },
  { name: 'NVIDIA', logo: '🟩', resources: 12, featured: true },
  { name: 'Red Hat', logo: '🔴', resources: 10, featured: false },
  { name: 'AWS', logo: '🟧', resources: 8, featured: false }
];

const LearningHub = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');

  const completedCourses = mockCourses.filter(c => c.progress === 100).length;
  const totalCourses = mockCourses.length;
  const averageProgress = Math.round(
    mockCourses.reduce((acc, c) => acc + c.progress, 0) / mockCourses.length
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'lab': return Target;
      case 'article': return FileText;
      default: return BookOpen;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'text-green-500 border-green-500/50';
      case 'Intermediate': return 'text-blue-500 border-blue-500/50';
      case 'Advanced': return 'text-purple-500 border-purple-500/50';
      default: return 'text-muted-foreground border-border';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Learning Hub</h2>
                <p className="text-muted-foreground">Personalized learning paths and expert resources</p>
              </div>
            </div>
            <Button className="gap-2">
              <Sparkles className="w-4 h-4" />
              AI Recommendations
            </Button>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-card border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Courses Completed</p>
                <p className="text-2xl font-bold text-foreground">{completedCourses}/{totalCourses}</p>
              </div>
              <Award className="h-8 w-8 text-yellow-500" />
            </div>
            <Progress value={(completedCourses / totalCourses) * 100} className="mt-2 h-1" />
          </Card>

          <Card className="p-4 bg-card border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Learning Streak</p>
                <p className="text-2xl font-bold text-foreground">12 Days</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Keep it up! 🔥</p>
          </Card>

          <Card className="p-4 bg-card border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Hours</p>
                <p className="text-2xl font-bold text-foreground">24.5h</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">This month</p>
          </Card>

          <Card className="p-4 bg-card border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Skill Level</p>
                <p className="text-2xl font-bold text-foreground">Expert</p>
              </div>
              <Star className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Level 8 - 2340 XP</p>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="courses" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="courses" className="gap-2">
              <BookOpen className="h-4 w-4" />
              My Courses
            </TabsTrigger>
            <TabsTrigger value="partners" className="gap-2">
              <Users className="h-4 w-4" />
              Partner Resources
            </TabsTrigger>
            <TabsTrigger value="community" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Community
            </TabsTrigger>
            <TabsTrigger value="help" className="gap-2">
              <Lightbulb className="h-4 w-4" />
              Help Center
            </TabsTrigger>
          </TabsList>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            {/* Search and Filter */}
            <Card className="p-4 bg-card border-border">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search courses, topics, or skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  className="px-4 py-2 rounded-md border border-border bg-background text-foreground"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option value="all">All Roles</option>
                  <option value="admin">IT Admin</option>
                  <option value="finops">FinOps Lead</option>
                  <option value="sustainability">Sustainability Manager</option>
                  <option value="developer">Developer</option>
                </select>
              </div>
            </Card>

            {/* AI Recommendations */}
            <Card className="p-4 bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/30">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-foreground mb-2">AI Recommended for You</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Based on your role as an IT Admin and recent activity in the FinOps module, 
                    we recommend starting with TruScale Billing Optimization.
                  </p>
                  <Button size="sm" variant="outline">
                    Start Learning
                  </Button>
                </div>
              </div>
            </Card>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockCourses.map((course) => {
                const TypeIcon = getTypeIcon(course.type);
                return (
                  <Card key={course.id} className="p-4 bg-card border-border hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="outline" className={getLevelColor(course.level)}>
                        {course.level}
                      </Badge>
                      <TypeIcon className="h-4 w-4 text-muted-foreground" />
                    </div>

                    <h4 className="text-sm font-semibold text-foreground mb-2 line-clamp-2">
                      {course.title}
                    </h4>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <span>{course.provider}</span>
                      <span>•</span>
                      <span>{course.duration}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {course.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-foreground font-semibold">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-1" />
                    </div>

                    <Button 
                      size="sm" 
                      className="w-full mt-3 gap-2"
                      variant={course.progress > 0 ? 'default' : 'outline'}
                    >
                      {course.progress === 100 ? (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          Review
                        </>
                      ) : course.progress > 0 ? (
                        <>
                          <Play className="h-4 w-4" />
                          Continue
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4" />
                          Start Course
                        </>
                      )}
                    </Button>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Partners Tab */}
          <TabsContent value="partners" className="space-y-6">
            <Card className="p-4 bg-card border-border">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Partner Knowledge Portal</h3>
                  <p className="text-sm text-muted-foreground">
                    Access curated resources from our ecosystem partners
                  </p>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Search className="h-4 w-4" />
                  Unified Search
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockPartners.map((partner) => (
                  <Card 
                    key={partner.name} 
                    className={`p-4 ${
                      partner.featured 
                        ? 'bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/30' 
                        : 'bg-card border-border'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{partner.logo}</span>
                        <div>
                          <h4 className="text-sm font-semibold text-foreground">{partner.name}</h4>
                          <p className="text-xs text-muted-foreground">{partner.resources} resources</p>
                        </div>
                      </div>
                      {partner.featured && (
                        <Badge variant="outline" className="text-primary border-primary/50">
                          Featured
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <Button size="sm" variant="outline" className="text-xs">
                        <Book className="h-3 w-3 mr-1" />
                        Docs
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs">
                        <Video className="h-3 w-3 mr-1" />
                        Videos
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs">
                        <Award className="h-3 w-3 mr-1" />
                        Certifications
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Support
                      </Button>
                    </div>

                    <Button size="sm" variant="default" className="w-full">
                      Explore Resources
                    </Button>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Community Tab */}
          <TabsContent value="community" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Trending Topics */}
              <Card className="lg:col-span-2 p-4 bg-card border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Trending Discussions
                </h3>

                <div className="space-y-3">
                  {[
                    { title: 'Best practices for VMware Aria integration?', replies: 24, views: 342, solved: true },
                    { title: 'TruScale billing optimization tips', replies: 18, views: 287, solved: true },
                    { title: 'Azure hybrid cloud setup questions', replies: 31, views: 456, solved: false },
                    { title: 'XClarity AI model fine-tuning', replies: 12, views: 198, solved: false },
                    { title: 'Green computing metrics tracking', replies: 9, views: 145, solved: true }
                  ].map((topic, i) => (
                    <Card key={i} className="p-3 bg-card/50 border-border hover:border-primary/30 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-sm font-medium text-foreground flex-1">{topic.title}</h4>
                        {topic.solved && (
                          <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 ml-2" />
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{topic.replies} replies</span>
                        <span>{topic.views} views</span>
                      </div>
                    </Card>
                  ))}
                </div>

                <Button variant="outline" className="w-full mt-4">
                  View All Discussions
                </Button>
              </Card>

              {/* Ask Expert */}
              <Card className="p-4 bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/30">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  Ask an Expert
                </h3>

                <p className="text-sm text-muted-foreground mb-4">
                  Connect with Lenovo specialists and partners for personalized guidance
                </p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-foreground">8 experts online now</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-foreground">Avg. response: &lt;30 min</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-foreground">4.9/5 satisfaction</span>
                  </div>
                </div>

                <Button className="w-full mb-3">
                  Schedule Session
                </Button>
                <Button variant="outline" className="w-full">
                  Chat with Expert
                </Button>
              </Card>
            </div>
          </TabsContent>

          {/* Help Center Tab */}
          <TabsContent value="help" className="space-y-6">
            <Card className="p-6 bg-card border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Contextual Help Center</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="p-4 bg-primary/5 border-primary/30 cursor-pointer hover:shadow-md transition-shadow">
                  <Search className="h-6 w-6 text-primary mb-2" />
                  <h4 className="text-sm font-semibold text-foreground mb-1">Quick Search</h4>
                  <p className="text-xs text-muted-foreground">
                    Find answers across Lenovo and partner documentation
                  </p>
                </Card>

                <Card className="p-4 bg-blue-500/5 border-blue-500/30 cursor-pointer hover:shadow-md transition-shadow">
                  <MessageCircle className="h-6 w-6 text-blue-500 mb-2" />
                  <h4 className="text-sm font-semibold text-foreground mb-1">AI Assistant</h4>
                  <p className="text-xs text-muted-foreground">
                    Get instant answers with conversational AI
                  </p>
                </Card>

                <Card className="p-4 bg-purple-500/5 border-purple-500/30 cursor-pointer hover:shadow-md transition-shadow">
                  <Video className="h-6 w-6 text-purple-500 mb-2" />
                  <h4 className="text-sm font-semibold text-foreground mb-1">Video Tutorials</h4>
                  <p className="text-xs text-muted-foreground">
                    Step-by-step guides for common tasks
                  </p>
                </Card>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-semibold text-foreground mb-3">Popular Topics</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['Getting Started', 'Integration', 'Billing', 'Security', 'Performance', 'Troubleshooting', 'Best Practices', 'API Reference'].map((topic) => (
                    <Button key={topic} variant="outline" size="sm" className="justify-start">
                      {topic}
                    </Button>
                  ))}
                </div>
              </div>

              <Card className="p-4 bg-gradient-to-br from-green-500/5 to-blue-500/5 border-green-500/30">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">AI-Generated Insights</h4>
                    <p className="text-sm text-muted-foreground">
                      Based on your recent activity, you might find these topics helpful:
                    </p>
                    <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                      <li>• Optimizing FinOps dashboard configurations</li>
                      <li>• Setting up automated cost allocation rules</li>
                      <li>• Understanding TruScale pricing tiers</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default LearningHub;
