'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRef } from 'react';

import { Display } from '@/components/customize/display';
import { ProList } from '@/components/pro-list';
import { ProListActions } from '@/components/pro-list/pro-list';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib';
import { closeOrder, queryOrderList } from '@/services/user/order';

export default function Page() {
  const t = useTranslations('order');

  const ref = useRef<ProListActions>(null);
  return (
    <ProList<API.OrderDetails, Record<string, unknown>>
      action={ref}
      request={async (pagination, filter) => {
        const response = await queryOrderList({ ...pagination, ...filter });
        return {
          list: response.data.data?.list || [],
          total: response.data.data?.total || 0,
        };
      }}
      renderItem={(item) => {
        return (
          <Card className='overflow-hidden'>
            <CardHeader className='flex flex-row items-center justify-between gap-2 space-y-0 bg-muted/50 p-3'>
              <CardTitle>
                {t('orderNo')}
                <p className='text-sm'>{item.orderNo}</p>
              </CardTitle>
              <CardDescription className='flex gap-2'>
                {item.status === 1 ? (
                  <>
                    <Link
                      key='payment'
                      href={`/payment?order_no=${item.orderNo}`}
                      className={buttonVariants({ size: 'sm' })}
                    >
                      {t('payment')}
                    </Link>
                    <Button
                      key='cancel'
                      size='sm'
                      variant='destructive'
                      onClick={async () => {
                        await closeOrder({ orderNo: item.orderNo });
                        ref.current?.refresh();
                      }}
                    >
                      {t('cancel')}
                    </Button>
                  </>
                ) : (
                  <Link
                    key='detail'
                    href={`/payment?order_no=${item.orderNo}`}
                    className={buttonVariants({ size: 'sm' })}
                  >
                    {t('detail')}
                  </Link>
                )}
              </CardDescription>
            </CardHeader>

            <CardContent className='p-3 text-sm'>
              <ul className='grid grid-cols-2 gap-3 *:flex *:flex-col lg:grid-cols-4'>
                <li>
                  <span className='text-muted-foreground'>{t('name')}</span>
                  <span>{item.subscribe.name || t(`type.${item.type}`)}</span>
                </li>
                <li className='font-semibold'>
                  <span className='text-muted-foreground'>{t('paymentAmount')}</span>
                  <span>
                    <Display type='currency' value={item.amount} />
                  </span>
                </li>
                <li className='font-semibold'>
                  <span className='text-muted-foreground'>{t('status.0')}</span>
                  <span>{t(`status.${item.status}`)}</span>
                </li>
                <li className='font-semibold'>
                  <span className='text-muted-foreground'>{t('createdAt')}</span>
                  <time>{formatDate(item.created_at)}</time>
                </li>
              </ul>
            </CardContent>
          </Card>
        );
      }}
    />
  );
}
