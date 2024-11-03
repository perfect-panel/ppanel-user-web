'use client';

import { Icon } from '@iconify/react/dist/iconify.js';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Fragment } from 'react';

import { Separator } from '@/components/ui/separator';
import useGlobalStore from '@/hooks/use-global';
import {
  NEXT_PUBLIC_DISCORD_LINK,
  NEXT_PUBLIC_EMAIL,
  NEXT_PUBLIC_GITHUB_LINK,
  NEXT_PUBLIC_INSTAGRAM_LINK,
  NEXT_PUBLIC_LINKEDIN_LINK,
  NEXT_PUBLIC_TELEGRAM_LINK,
  NEXT_PUBLIC_TWITTER_LINK,
} from '@/lib/env';

const Links = [
  {
    icon: 'uil:envelope',
    href: NEXT_PUBLIC_EMAIL ?? `mailto:${NEXT_PUBLIC_EMAIL}`,
  },
  {
    icon: 'uil:telegram',
    href: NEXT_PUBLIC_TELEGRAM_LINK,
  },
  {
    icon: 'uil:twitter',
    href: NEXT_PUBLIC_TWITTER_LINK,
  },
  {
    icon: 'uil:discord',
    href: NEXT_PUBLIC_DISCORD_LINK,
  },
  {
    icon: 'uil:instagram',
    href: NEXT_PUBLIC_INSTAGRAM_LINK,
  },
  {
    icon: 'uil:linkedin',
    href: NEXT_PUBLIC_LINKEDIN_LINK,
  },
  {
    icon: 'uil:github',
    href: NEXT_PUBLIC_GITHUB_LINK,
  },
];

export default function Footer() {
  const { common } = useGlobalStore();
  const { site } = common;
  const t = useTranslations('auth');
  return (
    <footer>
      <Separator className='my-14' />
      <div className='container mb-14 flex flex-wrap justify-between gap-4 text-sm text-muted-foreground'>
        <nav className='flex flex-wrap items-center gap-2'>
          {Links.filter((item) => item.href).map((item, index) => (
            <Fragment key={index}>
              {index !== 0 && <Separator orientation='vertical' />}
              <Link href={item.href!}>
                <Icon icon={item.icon} className='size-5 text-foreground' />
              </Link>
            </Fragment>
          ))}
        </nav>
        <div>
          <strong className='text-foreground'>{site.site_name}</strong> © All rights reserved.
          <Link href='/tos' className='ml-2 underline'>
            {t('tos')}
          </Link>
        </div>
      </div>
    </footer>
  );
}
