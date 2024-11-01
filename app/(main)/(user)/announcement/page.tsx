'use client';

import { useQuery } from '@tanstack/react-query';

import Empty from '@/components/customize/empty';
import { Markdown } from '@/components/editor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib';
import { queryAnnouncement } from '@/services/user/announcement';

export default function Page() {
  const { data } = useQuery({
    queryKey: ['queryAnnouncement'],
    queryFn: async () => {
      const { data } = await queryAnnouncement({
        page: 1,
        size: 20,
      });
      return data.data?.announcements || [];
    },
  });
  return (
    <div className='flex flex-col gap-5'>
      {data?.length ? (
        data.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{formatDate(item.updated_at)}</CardDescription>
            </CardHeader>
            <CardContent>
              <Markdown>{item.content}</Markdown>
            </CardContent>
          </Card>
        ))
      ) : (
        <Empty />
      )}
    </div>
  );
}
