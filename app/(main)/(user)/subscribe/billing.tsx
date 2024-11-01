'use client';

import { useTranslations } from 'next-intl';

import { Display } from '@/components/customize/display';
import { Separator } from '@/components/ui/separator';

interface SubscribeBillingProps {
  order?: {
    type?: number;
    subscribe_id?: number;
    quantity?: number;
    price?: number;
    reduction?: number;
    coupon?: number;
    fee_amount?: number;
    amount?: number;
    unit_price?: number;
  };
}

export function SubscribeBilling({ order }: SubscribeBillingProps) {
  const t = useTranslations('subscribe.billing');

  return (
    <>
      <div className='font-semibold'>{t('billingTitle')}</div>
      <ul className='grid grid-cols-2 gap-3 *:flex *:items-center *:justify-between lg:grid-cols-1'>
        {order?.type && [1, 2].includes(order?.type) && (
          <li>
            <span className='text-muted-foreground'>{t('duration')}</span>
            <span>
              {order?.quantity || 1} {t('months')}
            </span>
          </li>
        )}
        <li>
          <span className='text-muted-foreground'>{t('price')}</span>
          <span>
            <Display type='currency' value={order?.price || order?.unit_price} />
          </span>
        </li>
        <li>
          <span className='text-muted-foreground'>{t('productDiscount')}</span>
          <span>
            <Display type='currency' value={order?.reduction} />
          </span>
        </li>
        <li>
          <span className='text-muted-foreground'>{t('couponDiscount')}</span>
          <span>
            <Display type='currency' value={order?.coupon} />
          </span>
        </li>
        <li>
          <span className='text-muted-foreground'>{t('fee')}</span>
          <span>
            <Display type='currency' value={order?.fee_amount} />
          </span>
        </li>
      </ul>
      <Separator />
      <div className='flex items-center justify-between font-semibold'>
        <span className='text-muted-foreground'>{t('total')}</span>
        <span>
          <Display type='currency' value={order?.amount} />
        </span>
      </div>
    </>
  );
}
