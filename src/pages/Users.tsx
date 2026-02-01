import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { UserProfile } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ShieldCheck, ShieldOff } from 'lucide-react';
import { toast } from 'sonner';

type UserWithPosts = UserProfile & {
  posts_count: number;
};

export function Users() {
  const { t } = useLanguage();
  const [users, setUsers] = useState<UserWithPosts[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithPosts[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, search]);

  const loadUsers = async () => {
    try {
      console.log('🔄 Loading users...');
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .order('email');

      if (profilesError) {
        console.error('❌ Error loading users:', profilesError);
        toast.error(`Error: ${profilesError.message}`);
        throw profilesError;
      }

      console.log('✅ Users loaded:', profiles?.length || 0);

      const usersWithCounts = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { count } = await supabase
            .from('posts')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', profile.id);

          return {
            ...profile,
            posts_count: count || 0,
          };
        })
      );

      setUsers(usersWithCounts);
      
      if (!usersWithCounts || usersWithCounts.length === 0) {
        toast.info('Hech qanday foydalanuvchi topilmadi');
      }
    } catch (error: any) {
      console.error('Error loading users:', error);
      toast.error(error.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    if (!search) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(
      (user) =>
        user.username?.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const toggleAdmin = async (user: UserWithPosts) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_admin: !user.is_admin })
        .eq('id', user.id);

      if (error) throw error;

      setUsers(
        users.map((u) =>
          u.id === user.id ? { ...u, is_admin: !u.is_admin } : u
        )
      );
      toast.success(user.is_admin ? 'Admin rights removed' : 'User promoted to admin');
    } catch (error) {
      console.error('Error toggling admin:', error);
      toast.error('Failed to update user');
    }
  };

  if (loading) {
    return <div className="text-muted-foreground">{t('loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">{t('users')}</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>{t('users')}</CardTitle>
            <Input
              placeholder={t('search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="md:w-[300px]"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('avatar')}</TableHead>
                <TableHead>{t('username')}</TableHead>
                <TableHead>{t('email')}</TableHead>
                <TableHead>{t('admin')}</TableHead>
                <TableHead>{t('postsCount')}</TableHead>
                <TableHead>{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={user.avatar_url || undefined} />
                      <AvatarFallback>
                        {(user.username || user.email)?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{user.username || '-'}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.is_admin && <Badge>{t('admin')}</Badge>}
                  </TableCell>
                  <TableCell>{user.posts_count}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleAdmin(user)}
                    >
                      {user.is_admin ? (
                        <>
                          <ShieldOff className="mr-2 h-4 w-4" />
                          {t('removeAdmin')}
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="mr-2 h-4 w-4" />
                          {t('makeAdmin')}
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredUsers.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">{t('noData')}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
