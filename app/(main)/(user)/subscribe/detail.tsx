'use client';

import { useTranslations } from 'next-intl';

import { Display } from '@/components/customize/display';

interface SubscribeDetailProps {
  subscribe?: {
    traffic?: number | null;
    speed_limit?: number | null;
    device_limit?: number | null;
    name?: string | null;
    quantity?: number | null;
    unit_price?: number | null;
  };
}

export function SubscribeDetail({ subscribe }: SubscribeDetailProps) {
  const t = useTranslations('subscribe.detail');

  return (
    <>
      <div className='font-semibold'>{t('productDetail')}</div>
      <ul className='grid grid-cols-2 gap-3 *:flex *:items-center *:justify-between lg:grid-cols-1'>
        {subscribe?.name && (
          <li className='flex items-center justify-between'>
            <span className='line-clamp-2 flex-1 text-muted-foreground'>{subscribe?.name}</span>
            <span>
              x <span>{subscribe?.quantity || 1}</span>
            </span>
          </li>
        )}
        <li>
          <span className='text-muted-foreground'>{t('availableTraffic')}</span>
          <span>
            <Display type='traffic' value={subscribe?.traffic} unlimited />
          </span>
        </li>
        <li>
          <span className='text-muted-foreground'>{t('connectionSpeed')}</span>
          <span>
            <Display type='traffic' value={subscribe?.speed_limit} unlimited />
          </span>
        </li>
        <li>
          <span className='text-muted-foreground'>{t('connectedDevices')}</span>
          <span>
            <Display value={subscribe?.device_limit} type='number' unlimited />
          </span>
        </li>
      </ul>
    </>
  );
}
