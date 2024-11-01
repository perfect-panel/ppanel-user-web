'use client';

import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';

import { Display } from '@/components/customize/display';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { DashboardNav } from '@/components/layout/dashboard-nav';
import Loading from '@/components/layout/loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import useGlobalStore from '@/hooks/use-global';
import { navItems } from '@/lib/site';

import Recharge from './order/recharge';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations('layout');
  const path = usePathname();
  const { user } = useGlobalStore();

  if (!user)
    return <Loading className='m-auto h-[calc(100dvh-252px-env(safe-area-inset-top))] lg:w-3/5' />;

  const navItem = path !== '/dashboard' && navItems.find((item) => item.href === path);

  return (
    <main className='container flex flex-wrap-reverse gap-5 align-top md:flex-nowrap'>
      <div className='sticky top-[84px] hidden h-96 w-52 shrink-0 flex-col gap-2 text-muted-foreground lg:flex'>
        <DashboardNav items={navItems} />
      </div>
      <div className='md:py-6l min-h-[calc(100dvh-252px-env(safe-area-inset-top))] flex-grow gap-5 py-4'>
        {navItem && (
          <Breadcrumbs
            items={[
              {
                label: 'dashboard',
                href: '/dashboard',
              },
              {
                href: navItem?.href,
                label: navItem?.label,
              },
            ]}
          />
        )}
        {children}
      </div>
      <div className='top-[84px] mt-4 grid size-full min-w-52 shrink-0 grid-cols-2 gap-4 p-2 md:sticky md:w-auto md:grid-cols-1 md:flex-col lg:w-52'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 p-3 pb-2'>
            <CardTitle className='text-sm font-medium'>{t('accountBalance')}</CardTitle>
            <Recharge variant='link' className='p-0' />
          </CardHeader>
          <CardContent className='p-3 text-2xl font-bold'>
            <Display type='currency' value={user?.balance} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 p-3 pb-2'>
            <CardTitle className='text-sm font-medium'>{t('totalCommission')}</CardTitle>
            <Icon icon='mdi:money' className='text-2xl text-muted-foreground' />
          </CardHeader>
          <CardContent className='p-3 text-2xl font-bold'>0.00</CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 p-3 pb-2'>
            <CardTitle className='text-sm font-medium'>{t('invitees')}</CardTitle>
            <Icon icon='mdi:users' className='text-2xl text-muted-foreground' />
          </CardHeader>
          <CardContent className='p-3 text-2xl font-bold'>0</CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 p-3 pb-2'>
            <CardTitle className='text-sm font-medium'>{t('inviteCode')}</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    className='size-5 p-0'
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${location.origin}/auth?invite=${user?.refer_code}`,
                      );
                      toast.success(t('copySuccess'));
                    }}
                  >
                    <Icon icon='mdi:content-copy' className='text-2xl text-primary' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t('copyInviteLink')}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardHeader>
          <CardContent className='truncate p-3 font-bold'>{user?.refer_code}</CardContent>
        </Card>
      </div>
    </main>
  );
}
