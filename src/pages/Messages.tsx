import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { Message } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export function Messages() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:user_profiles!messages_sender_id_fkey(username),
          receiver:user_profiles!messages_receiver_id_fkey(username)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-muted-foreground">{t('loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">{t('messages')}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('messages')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('sender')}</TableHead>
                <TableHead>{t('receiver')}</TableHead>
                <TableHead>{t('messageText')}</TableHead>
                <TableHead>{t('read')}</TableHead>
                <TableHead>{t('date')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((message) => (
                <TableRow key={message.id}>
                  <TableCell className="font-medium">
                    {message.sender?.username || 'Unknown'}
                  </TableCell>
                  <TableCell>{message.receiver?.username || 'Unknown'}</TableCell>
                  <TableCell className="max-w-md truncate">{message.message}</TableCell>
                  <TableCell>
                    {message.is_read ? (
                      <Badge variant="default">{t('read')}</Badge>
                    ) : (
                      <Badge variant="secondary">{t('unread')}</Badge>
                    )}
                  </TableCell>
                  <TableCell>{new Date(message.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {messages.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">{t('noData')}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
