'use client';

import { Icon } from '@iconify/react';
import { useQuery } from '@tanstack/react-query';
import { useCountDown } from 'ahooks';
import { addMinutes, format } from 'date-fns';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { QRCodeCanvas } from 'qrcode.react';
import { useEffect, useState } from 'react';

import { Display } from '@/components/customize/display';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import useGlobalStore from '@/hooks/use-global';
import { formatDate } from '@/lib';
import { checkoutOrder, queryOrderDetail } from '@/services/user/order';

import { SubscribeBilling } from '../subscribe/billing';
import { SubscribeDetail } from '../subscribe/detail';
import StripePayment from './stripe';

export default function Page() {
  const t = useTranslations('order');
  const { getUserInfo } = useGlobalStore();
  const [order_no, setOrderNo] = useState<string>();
  const [enabled, setEnabled] = useState<boolean>(false);

  const { data } = useQuery({
    enabled: enabled,
    queryKey: ['queryOrderDetail', order_no],
    queryFn: async () => {
      const { data } = await queryOrderDetail({ order_no: order_no! });
      if (data?.data?.status !== 1) {
        getUserInfo();
        setEnabled(false);
      }
      return data?.data;
    },
    refetchInterval: 3000,
  });

  const { data: payment } = useQuery({
    enabled: !!order_no,
    queryKey: ['checkoutOrder', order_no],
    queryFn: async () => {
      const { data } = await checkoutOrder({ orderNo: order_no! });
      return data?.data;
    },
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('order_no')) {
      setOrderNo(searchParams.get('order_no')!);
      setEnabled(true);
    }
  }, []);

  const [countDown, formattedRes] = useCountDown({
    targetDate: data && format(addMinutes(data?.created_at, 15), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
  });

  const { hours, minutes, seconds } = formattedRes;

  const countdownDisplay =
    countDown > 0 ? (
      <>
        {hours.toString().length === 1 ? `0${hours}` : hours} :{' '}
        {minutes.toString().length === 1 ? `0${minutes}` : minutes} :{' '}
        {seconds.toString().length === 1 ? `0${seconds}` : seconds}
      </>
    ) : (
      <>{t('timeExpired')}</>
    );

  return (
    <>
      <Breadcrumbs
        items={[
          {
            label: 'dashboard',
            href: '/dashboard',
          },
          {
            label: 'order',
            href: '/order',
          },
          {
            label: 'payment',
            href: '/payment',
          },
        ]}
      />
      <div className='grid gap-4 xl:grid-cols-2'>
        <Card className='order-2 xl:order-1'>
          <CardHeader className='flex flex-row items-start bg-muted/50'>
            <div className='grid gap-0.5'>
              <CardTitle className='flex flex-col text-lg'>
                {t('orderNumber')}
                <span>{data?.orderNo}</span>
              </CardTitle>
              <CardDescription>
                {t('createdAt')}: {formatDate(data?.created_at)}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className='grid gap-3 p-6 text-sm'>
            <div className='font-semibold'>{t('paymentMethod')}</div>
            <dl className='grid gap-3'>
              <div className='flex items-center justify-between'>
                <dt className='text-muted-foreground'>
                  <Badge>{t(`methods.${data?.method}`)}</Badge>
                </dt>
              </div>
            </dl>
            <Separator />

            {[1, 2].includes(data?.type!) && (
              <SubscribeDetail
                subscribe={{
                  ...data?.subscribe,
                  quantity: data?.quantity,
                }}
              />
            )}
            {data?.type === 3 && (
              <>
                <div className='font-semibold'>重置流量</div>
                <ul className='grid grid-cols-2 gap-3 *:flex *:items-center *:justify-between lg:grid-cols-1'>
                  <li className='flex items-center justify-between'>
                    <span className='line-clamp-2 flex-1 text-muted-foreground'>重置价格</span>
                    <span>
                      <Display type='currency' value={data.amount} />
                    </span>
                  </li>
                </ul>
              </>
            )}

            {data?.type === 4 && (
              <>
                <div className='font-semibold'>{t('balanceRecharge')}</div>
                <ul className='grid grid-cols-2 gap-3 *:flex *:items-center *:justify-between lg:grid-cols-1'>
                  <li className='flex items-center justify-between'>
                    <span className='line-clamp-2 flex-1 text-muted-foreground'>
                      {t('rechargeAmount')}
                    </span>
                    <span>
                      <Display type='currency' value={data.amount} />
                    </span>
                  </li>
                </ul>
              </>
            )}
            <Separator />
            <SubscribeBilling
              order={{
                ...data,
                coupon: data?.reduction,
                quantity: data?.quantity,
                unit_price: data?.subscribe?.unit_price,
                type: data?.type,
              }}
            />
          </CardContent>
        </Card>
        <Card className='order-1 flex flex-auto items-center justify-center xl:order-2'>
          <CardContent className='py-16'>
            {[2, 5].includes(data?.status!) && (
              <div className='flex flex-col items-center gap-8 text-center'>
                <h3 className='text-2xl font-bold tracking-tight'>{t('paymentSuccess')}</h3>
                <Icon icon='mdi:success-circle-outline' className='text-7xl text-green-500' />
                <div className='flex gap-4'>
                  <Button asChild>
                    <Link href='/dashboard'>{t('subscribeNow')}</Link>
                  </Button>
                  <Button variant='outline'>
                    <Link href='/document'>{t('viewDocument')}</Link>
                  </Button>
                </div>
              </div>
            )}
            {data?.status === 1 && payment?.type === 'link' && (
              <div className='flex flex-col items-center gap-8 text-center'>
                <h3 className='text-2xl font-bold tracking-tight'>{t('waitingForPayment')}</h3>
                <p className='flex items-center text-3xl font-bold'>{countdownDisplay}</p>
                <Icon icon='mdi:access-time' className='text-7xl text-muted-foreground' />
                <div className='flex gap-4'>
                  <Button
                    onClick={() => {
                      const width = 600;
                      const height = 800;
                      const left = (screen.width - width) / 2;
                      const top = (screen.height - height) / 2;
                      window.open(
                        payment?.checkout_url,
                        'newWindow',
                        `width=${width},height=${height},top=${top},left=${left},menubar=0,scrollbars=1,resizable=1,status=1,titlebar=0,toolbar=0,location=1`,
                      );
                    }}
                  >
                    {t('goToPayment')}
                  </Button>
                  <Button variant='outline'>
                    <Link href='/subscribe'>{t('productList')}</Link>
                  </Button>
                </div>
              </div>
            )}

            {data?.status === 1 && payment?.type === 'qr' && (
              <div className='flex flex-col items-center gap-8 text-center'>
                <h3 className='text-2xl font-bold tracking-tight'>{t('scanToPay')}</h3>
                <p className='flex items-center text-3xl font-bold'>{countdownDisplay}</p>
                <QRCodeCanvas
                  value={payment?.checkout_url!}
                  size={208}
                  imageSettings={{
                    src: `/payment/alipay_f2f.svg`,
                    width: 48,
                    height: 48,
                    excavate: true,
                  }}
                />
                <div className='flex gap-4'>
                  <Button asChild>
                    <Link href='/subscribe'>{t('productList')}</Link>
                  </Button>
                  <Button asChild variant='outline'>
                    <Link href='/order'>{t('orderList')}</Link>
                  </Button>
                </div>
              </div>
            )}

            {data?.status === 1 && payment?.type === 'stripe' && (
              <div className='flex flex-col items-center gap-8 text-center'>
                <h3 className='text-2xl font-bold tracking-tight'>{t('scanToPay')}</h3>
                <p className='flex items-center text-3xl font-bold'>{countdownDisplay}</p>
                {payment.stripe && <StripePayment {...payment.stripe} />}
                <div className='flex gap-4'>
                  <Button asChild>
                    <Link href='/subscribe'>{t('productList')}</Link>
                  </Button>
                  <Button asChild variant='outline'>
                    <Link href='/order'>{t('orderList')}</Link>
                  </Button>
                </div>
              </div>
            )}

            {[3, 4].includes(data?.status!) && (
              <div className='flex flex-col items-center gap-8 text-center'>
                <h3 className='text-2xl font-bold tracking-tight'>{t('orderClosed')}</h3>
                <Icon icon='mdi:cancel' className='text-7xl text-red-500' />
                <div className='flex gap-4'>
                  <Button asChild>
                    <Link href='/subscribe'>{t('productList')}</Link>
                  </Button>
                  <Button asChild variant='outline'>
                    <Link href='/order'>{t('orderList')}</Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
