'use client';

import { useTranslations } from 'next-intl';

import { formatBytes } from '@/lib';

export function NetWorkTraffic({ value = 0, unlimited }: { value?: number; unlimited?: boolean }) {
  const t = useTranslations('common');
  if (value && unlimited) return t('unlimited');
  return value && `${formatBytes(value)}`;
}
