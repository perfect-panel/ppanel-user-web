'use client';

import { Icon } from '@iconify/react/dist/iconify.js';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Fragment } from 'react';

import { Separator } from '@/components/ui/separator';
import useGlobalStore from '@/hooks/use-global';

const Links = [
  {
    icon: 'uil:envelope',
    href: process.env.NEXT_PUBLIC_EMAIL ?? `mailto:${process.env.NEXT_PUBLIC_EMAIL}`,
  },
  {
    icon: 'uil:telegram',
    href: process.env.NEXT_PUBLIC_TELEGRAM_LINK,
  },
  {
    icon: 'uil:twitter',
    href: process.env.NEXT_PUBLIC_TWITTER_LINK,
  },
  {
    icon: 'uil:discord',
    href: process.env.NEXT_PUBLIC_DISCORD_LINK,
  },
  {
    icon: 'uil:instagram',
    href: process.env.NEXT_PUBLIC_INSTAGRAM_LINK,
  },
  {
    icon: 'uil:linkedin',
    href: process.env.NEXT_PUBLIC_LINKEDIN_LINK,
  },
  {
    icon: 'uil:github',
    href: process.env.NEXT_PUBLIC_GITHUB_LINK,
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
