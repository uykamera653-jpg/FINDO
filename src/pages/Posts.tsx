import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { Post } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Eye, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export function Posts() {
  const { t } = useLanguage();
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<Post | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, search, typeFilter]);

  const loadPosts = async () => {
    try {
      console.log('🔄 Loading posts...');
      const { data, error } = await supabase
        .from('posts')
        .select('*, user_profiles(username, email)')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error loading posts:', error);
        toast.error(`Error: ${error.message}`);
        throw error;
      }
      
      console.log('✅ Posts loaded:', data?.length || 0);
      console.log('📊 Data:', data);
      setPosts(data || []);
      
      if (!data || data.length === 0) {
        toast.info('Ma\'lumotlar topilmadi. FINDO ilovasida e\'lon yarating.');
      }
    } catch (error: any) {
      console.error('Error loading posts:', error);
      toast.error(error.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = posts;

    if (search) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(search.toLowerCase()) ||
          post.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      if (typeFilter === 'reward') {
        filtered = filtered.filter((post) => post.reward);
      } else {
        filtered = filtered.filter((post) => post.type === typeFilter);
      }
    }

    setFilteredPosts(filtered);
    setCurrentPage(1);
  };

  const handleDelete = async (post: Post) => {
    try {
      const { error } = await supabase.from('posts').delete().eq('id', post.id);
      if (error) throw error;
      
      setPosts(posts.filter((p) => p.id !== post.id));
      toast.success('Post deleted successfully');
      setDeleteDialog(null);
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);

  if (loading) {
    return <div className="text-muted-foreground">{t('loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">{t('allPosts')}</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>{t('allPosts')}</CardTitle>
            <div className="flex flex-col gap-4 md:flex-row">
              <Input
                placeholder={t('search')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="md:w-[300px]"
              />
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="md:w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('all')}</SelectItem>
                  <SelectItem value="found">{t('found')}</SelectItem>
                  <SelectItem value="lost">{t('lost')}</SelectItem>
                  <SelectItem value="reward">{t('withReward')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('image')}</TableHead>
                <TableHead>{t('title')}</TableHead>
                <TableHead>{t('type')}</TableHead>
                <TableHead>{t('user')}</TableHead>
                <TableHead>{t('location')}</TableHead>
                <TableHead>{t('reward')}</TableHead>
                <TableHead>{t('date')}</TableHead>
                <TableHead>{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    {post.image_url ? (
                      <img src={post.image_url} alt="" className="h-12 w-12 rounded object-cover" />
                    ) : (
                      <div className="h-12 w-12 rounded bg-muted" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>
                    <Badge variant={post.type === 'found' ? 'default' : 'destructive'} className={post.type === 'found' ? 'bg-found' : 'bg-lost'}>
                      {post.type === 'found' ? t('found') : t('lost')}
                    </Badge>
                  </TableCell>
                  <TableCell>{post.user_profiles?.username || 'Unknown'}</TableCell>
                  <TableCell>{post.location || '-'}</TableCell>
                  <TableCell>
                    {post.reward && <Badge className="bg-reward">{post.reward}</Badge>}
                  </TableCell>
                  <TableCell>{new Date(post.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => setSelectedPost(post)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteDialog(post)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredPosts.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">{t('noData')}</div>
          )}

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {(currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, filteredPosts.length)} {t('of')}{' '}
                {filteredPosts.length}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  {t('previous')}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  {t('next')}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedPost && (
        <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedPost.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedPost.image_url && (
                <img src={selectedPost.image_url} alt="" className="h-64 w-full rounded object-cover" />
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('type')}</p>
                  <Badge variant={selectedPost.type === 'found' ? 'default' : 'destructive'} className={selectedPost.type === 'found' ? 'bg-found' : 'bg-lost'}>
                    {selectedPost.type === 'found' ? t('found') : t('lost')}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('user')}</p>
                  <p>{selectedPost.user_profiles?.username || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('location')}</p>
                  <p>{selectedPost.location || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('reward')}</p>
                  <p>{selectedPost.reward || '-'}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Description</p>
                <p className="mt-1">{selectedPost.description || '-'}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {deleteDialog && (
        <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('confirmDelete')}</DialogTitle>
              <DialogDescription>
                {deleteDialog.title}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialog(null)}>
                {t('cancel')}
              </Button>
              <Button variant="destructive" onClick={() => handleDelete(deleteDialog)}>
                {t('delete')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
