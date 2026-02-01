import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

type StatCardProps = {
  title: string;
  value: number;
  icon: LucideIcon;
  color?: 'primary' | 'found' | 'lost' | 'reward';
};

export function StatCard({ title, value, icon: Icon, color = 'primary' }: StatCardProps) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    found: 'bg-found/10 text-found',
    lost: 'bg-lost/10 text-lost',
    reward: 'bg-reward/10 text-reward',
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
          </div>
          <div className={`rounded-full p-3 ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
