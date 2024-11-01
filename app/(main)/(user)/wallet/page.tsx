'use client';

import { useTranslations } from 'next-intl';
import { useRef } from 'react';

import { Display } from '@/components/customize/display';
import { ProList } from '@/components/pro-list';
import { ProListActions } from '@/components/pro-list/pro-list';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useGlobalStore from '@/hooks/use-global';
import { formatDate } from '@/lib';
import { queryUserBalanceLog } from '@/services/user/user';

import Recharge from '../order/recharge';

export default function Page() {
  const t = useTranslations('wallet');
  const { user } = useGlobalStore();
  const ref = useRef<ProListActions>(null);

  return (
    <>
      <Card className='mb-4'>
        <CardHeader>
          <CardTitle className='font-medium'>{t('title')}</CardTitle>
        </CardHeader>
        <CardContent className='flex items-center justify-between'>
          <div className='text-2xl font-bold'>
            <Display type='currency' value={user?.balance} />
          </div>
          <div className='flex gap-2'>
            <Recharge />
          </div>
        </CardContent>
      </Card>
      <ProList<API.UserBalanceLog, Record<string, unknown>>
        action={ref}
        request={async (pagination, filter) => {
          const response = await queryUserBalanceLog({ ...pagination, ...filter });
          return {
            list: response.data.data?.list || [],
            total: response.data.data?.total || 0,
          };
        }}
        renderItem={(item) => {
          return (
            <Card className='overflow-hidden'>
              <CardContent className='p-3 text-sm'>
                <ul className='grid grid-cols-2 gap-3 *:flex *:flex-col lg:grid-cols-4'>
                  <li className='font-semibold'>
                    <span className='text-muted-foreground'>{t('createdAt')}</span>
                    <time>{formatDate(item.created_at)}</time>
                  </li>
                  <li className='font-semibold'>
                    <span className='text-muted-foreground'>{t('type.0')}</span>
                    <span>{t(`type.${item.type}`)}</span>
                  </li>
                  <li className='font-semibold'>
                    <span className='text-muted-foreground'>{t('amount')}</span>
                    <span>
                      <Display type='currency' value={item.amount} />
                    </span>
                  </li>

                  <li>
                    <span className='text-muted-foreground'>{t('balance')}</span>
                    <span>
                      <Display type='currency' value={item.balance} />
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          );
        }}
      />
    </>
  );
}
