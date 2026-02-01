import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { Comment } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export function Comments() {
  const { t } = useLanguage();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<Comment | null>(null);

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*, user_profiles(username), posts(title)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error loading comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (comment: Comment) => {
    try {
      const { error } = await supabase.from('comments').delete().eq('id', comment.id);
      if (error) throw error;
      
      setComments(comments.filter((c) => c.id !== comment.id));
      toast.success('Comment deleted successfully');
      setDeleteDialog(null);
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  if (loading) {
    return <div className="text-muted-foreground">{t('loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">{t('comments')}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('comments')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('user')}</TableHead>
                <TableHead>{t('post')}</TableHead>
                <TableHead>{t('commentText')}</TableHead>
                <TableHead>{t('date')}</TableHead>
                <TableHead>{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comments.map((comment) => (
                <TableRow key={comment.id}>
                  <TableCell className="font-medium">
                    {comment.user_profiles?.username || 'Unknown'}
                  </TableCell>
                  <TableCell>{comment.posts?.title || 'Unknown'}</TableCell>
                  <TableCell className="max-w-md truncate">{comment.comment}</TableCell>
                  <TableCell>{new Date(comment.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteDialog(comment)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {comments.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">{t('noData')}</div>
          )}
        </CardContent>
      </Card>

      {deleteDialog && (
        <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('confirmDelete')}</DialogTitle>
              <DialogDescription>
                {deleteDialog.comment}
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
