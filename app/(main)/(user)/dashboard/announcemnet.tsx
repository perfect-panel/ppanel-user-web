'use client';

import { Icon } from '@iconify/react';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import Empty from '@/components/customize/empty';
import { Markdown } from '@/components/editor';
import { Card } from '@/components/ui/card';
import { queryAnnouncement } from '@/services/user/announcement';

export default function Announcement() {
  const t = useTranslations('dashboard');

  const { data } = useQuery({
    queryKey: ['queryAnnouncement', 1],
    queryFn: async () => {
      const { data } = await queryAnnouncement({
        page: 1,
        size: 1,
      });
      return (data.data?.announcements?.[0] as API.AnnouncementDetails) || {};
    },
  });

  return (
    <>
      <h2 className='flex items-center gap-1.5 font-semibold'>
        <Icon icon='uil:bell' className='size-5' />
        {t('latestAnnouncement')}
      </h2>
      <Card className='p-6'>
        {data?.content ? <Markdown>{data?.content}</Markdown> : <Empty />}
      </Card>
    </>
  );
}
