'use client';

import Image from 'next/legacy/image';
import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import useGlobalStore from '@/hooks/use-global';
import { cn } from '@/lib';

import LanguageSwitch from './language-switch';
import { MobileSidebar } from './mobile-sidebar';
import ThemeToggle from './theme/toggle';
import { UserNav } from './user-nav';

export default function Header() {
  const { common, user } = useGlobalStore();
  const { site } = common;
  const Logo = (
    <Link href='/' className='flex items-center gap-2 text-lg font-bold'>
      {site.site_logo && <Image src={site.site_logo} width={48} height={48} alt='logo' />}
      <span>{site.site_name}</span>
    </Link>
  );
  return (
    <header className='sticky top-0 z-50 border-b backdrop-blur-md'>
      <div className='container flex h-16 items-center justify-between'>
        <div className={cn('block md:!hidden')}>{user ? <MobileSidebar /> : Logo}</div>
        <nav className='hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6'>
          {Logo}
        </nav>
        <div className='flex flex-1 items-center justify-end gap-2'>
          <LanguageSwitch />
          <ThemeToggle />
          <UserNav />
          {!user && (
            <Link
              href='/auth'
              className={buttonVariants({
                size: 'sm',
              })}
            >
              登录/注册
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
