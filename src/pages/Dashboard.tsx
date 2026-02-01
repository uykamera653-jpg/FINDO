import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { StatCard } from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, FileText, MessageSquare, Mail, Award } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Post } from '@/types';
import { toast } from 'sonner';

type Stats = {
  totalUsers: number;
  totalPosts: number;
  totalComments: number;
  totalMessages: number;
  rewardPosts: number;
};

export function Dashboard() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalPosts: 0,
    totalComments: 0,
    totalMessages: 0,
    rewardPosts: 0,
  });
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      console.log('🔄 Loading dashboard data...');
      const [usersRes, postsRes, commentsRes, messagesRes, rewardPostsRes] = await Promise.all([
        supabase.from('user_profiles').select('id', { count: 'exact', head: true }),
        supabase.from('posts').select('id', { count: 'exact', head: true }),
        supabase.from('comments').select('id', { count: 'exact', head: true }),
        supabase.from('messages').select('id', { count: 'exact', head: true }),
        supabase.from('posts').select('id', { count: 'exact', head: true }).not('reward', 'is', null),
      ]);

      setStats({
        totalUsers: usersRes.count || 0,
        totalPosts: postsRes.count || 0,
        totalComments: commentsRes.count || 0,
        totalMessages: messagesRes.count || 0,
        rewardPosts: rewardPostsRes.count || 0,
      });

      const { data: posts } = await supabase
        .from('posts')
        .select('*, user_profiles(username)')
        .order('created_at', { ascending: false })
        .limit(10);

      setRecentPosts(posts || []);

      // Chart data for last 7 days
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split('T')[0];
      });

      const chartPromises = last7Days.map(async (date) => {
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);
        
        const { count } = await supabase
          .from('posts')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', date)
          .lt('created_at', nextDate.toISOString().split('T')[0]);

        return {
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          posts: count || 0,
        };
      });

      const chartResults = await Promise.all(chartPromises);
      setChartData(chartResults);
      
      console.log('✅ Dashboard data loaded successfully');
      console.log('📊 Stats:', stats);
    } catch (error: any) {
      console.error('❌ Error loading dashboard data:', error);
      toast.error(error.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-muted-foreground">{t('loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">{t('dashboard')}</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard title={t('totalUsers')} value={stats.totalUsers} icon={Users} />
        <StatCard title={t('totalPosts')} value={stats.totalPosts} icon={FileText} />
        <StatCard title={t('totalComments')} value={stats.totalComments} icon={MessageSquare} />
        <StatCard title={t('totalMessages')} value={stats.totalMessages} icon={Mail} />
        <StatCard title={t('rewardPosts')} value={stats.rewardPosts} icon={Award} color="reward" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('postsLast7Days')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="date" className="text-muted-foreground" />
              <YAxis className="text-muted-foreground" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                }}
              />
              <Line type="monotone" dataKey="posts" stroke="hsl(var(--primary))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('recentPosts')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('title')}</TableHead>
                <TableHead>{t('type')}</TableHead>
                <TableHead>{t('user')}</TableHead>
                <TableHead>{t('location')}</TableHead>
                <TableHead>{t('date')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>
                    <Badge variant={post.type === 'found' ? 'default' : 'destructive'} className={post.type === 'found' ? 'bg-found' : 'bg-lost'}>
                      {post.type === 'found' ? t('found') : t('lost')}
                    </Badge>
                  </TableCell>
                  <TableCell>{post.user_profiles?.username || 'Unknown'}</TableCell>
                  <TableCell>{post.location || '-'}</TableCell>
                  <TableCell>{new Date(post.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
