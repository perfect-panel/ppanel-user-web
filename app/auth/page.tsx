'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/legacy/image';
import Link from 'next/link';

import LanguageSwitch from '@/components/layout/language-switch';
import ThemeToggle from '@/components/layout/theme/toggle';
import { Login } from '@/components/lotties';
import useGlobalStore from '@/hooks/use-global';

import UserAuthForm from './user-auth-form';

export default function Page() {
  const t = useTranslations('auth');
  const { common } = useGlobalStore();
  const { site } = common;

  return (
    <main className='flex h-full min-h-screen items-center bg-muted/50'>
      <div className='flex size-full flex-auto flex-col lg:flex-row'>
        <div className='flex bg-cover bg-center lg:w-1/2 lg:flex-auto'>
          <div className='lg:py-15 md:px-15 flex w-full flex-col items-center justify-center px-5 py-7'>
            <Link className='mb-0 flex flex-col items-center lg:mb-12' href='/'>
              <Image src={site.site_logo} height={48} width={48} alt='logo' />
              <span className='text-2xl font-semibold'>{site.site_name}</span>
            </Link>
            <Login className='mx-auto hidden w-[275px] md:w-1/2 lg:block xl:w-[500px]' />
            <p className='hidden w-[275px] text-center md:w-1/2 lg:block xl:w-[500px]'>
              {site.site_desc}
            </p>
          </div>
        </div>
        <div className='flex flex-initial justify-center p-12 lg:flex-auto lg:justify-end'>
          <div className='flex flex-col items-center rounded-2xl p-10 md:w-[600px] lg:flex-auto lg:bg-background lg:shadow'>
            <div className='flex flex-col items-stretch justify-center md:w-[400px] lg:h-full'>
              <div className='pb-15 flex flex-col justify-center lg:flex-auto lg:pb-20'>
                <UserAuthForm />
              </div>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-5'>
                  <LanguageSwitch />
                  <ThemeToggle />
                </div>
                <div className='flex gap-5 text-sm font-semibold text-primary'>
                  <Link href='/tos'>{t('tos')}</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
