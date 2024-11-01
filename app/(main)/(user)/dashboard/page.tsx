'use client';

import { Icon } from '@iconify/react';
import { useQuery } from '@tanstack/react-query';
import { differenceInDays } from 'date-fns';
import { Copy } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { QRCodeCanvas } from 'qrcode.react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Display } from '@/components/customize/display';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useGlobalStore from '@/hooks/use-global';
import { getNextResetDate, isBrowser } from '@/lib';
import { queryApplicationConfig } from '@/services/user/subscribe';
import { queryUserSubscribe } from '@/services/user/user';

import Renewal from '../order/renewal';
import ResetTraffic from '../order/reset-traffic';
import Subscribe from '../subscribe/page';
import Announcement from './announcemnet';

export default function Page() {
  const t = useTranslations('dashboard');
  const { getUserSubscribe, getAppSubLink } = useGlobalStore();

  const [protocol, setProtocol] = useState('');

  const { data: userSubscribe = [] } = useQuery({
    queryKey: ['queryUserSubscribe'],
    queryFn: async () => {
      const { data } = await queryUserSubscribe();
      return data.data?.list || [];
    },
  });
  const { data: application } = useQuery({
    queryKey: ['queryApplicationConfig'],
    queryFn: async () => {
      const { data } = await queryApplicationConfig();
      return data.data as API.QueryApplicationConfigResponse;
    },
  });
  const [platform, setPlatform] = useState<keyof API.QueryApplicationConfigResponse>('windows');

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(t('copySuccess'));
    } catch {
      toast.error(t('copyFailure'));
    }
  };

  return (
    <div className='flex min-h-[calc(100vh-64px-58px-32px-114px)] w-full flex-col gap-4 overflow-hidden'>
      <Announcement />
      {userSubscribe.length ? (
        <>
          <h2 className='flex items-center gap-1.5 font-semibold'>
            <Icon icon='uil:servers' className='size-5' />
            {t('mySubscriptions')}
          </h2>
          <div className='flex flex-wrap justify-between gap-4'>
            <Tabs
              value={platform}
              onValueChange={(value) =>
                setPlatform(value as keyof API.QueryApplicationConfigResponse)
              }
              className='w-full max-w-full md:w-auto'
            >
              <TabsList className='flex *:flex-auto'>
                {application &&
                  Object.keys(application)?.map((item) => (
                    <TabsTrigger value={item} key={item} className='px-1 uppercase lg:px-3'>
                      {item}
                    </TabsTrigger>
                  ))}
              </TabsList>
            </Tabs>
            <Tabs
              value={protocol}
              onValueChange={setProtocol}
              className='w-full max-w-full md:w-auto'
            >
              <TabsList className='flex *:flex-auto'>
                {['all', 'ss', 'vmess', 'vless', 'trojan'].map((item) => (
                  <TabsTrigger
                    value={item === 'all' ? '' : item}
                    key={item}
                    className='px-1 uppercase lg:px-3'
                  >
                    {item}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          {userSubscribe.map((item) => (
            <Card key={item.id}>
              <CardHeader className='flex flex-row flex-wrap items-center justify-between gap-2 space-y-0'>
                <CardTitle className='font-medium'>{item.subscribe.name}</CardTitle>
                <div className='flex gap-2'>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size='sm' variant='destructive'>
                        {t('resetSubscription')}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t('prompt')}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {t('confirmResetSubscription')}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={() => toast.success(t('resetSuccess'))}>
                          {t('confirm')}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <ResetTraffic
                    id={item.subscribe_id}
                    mark={item.mark}
                    replacement={item.subscribe.replacement}
                  />
                  <Renewal mark={item.mark} subscribe={item.subscribe} />
                </div>
              </CardHeader>
              <CardContent>
                <ul className='grid grid-cols-2 gap-3 *:flex *:flex-col *:justify-between lg:grid-cols-4'>
                  <li>
                    <span className='text-muted-foreground'>{t('used')}</span>
                    <span className='text-2xl font-bold'>
                      <Display
                        type='traffic'
                        value={item.upload + item.download}
                        unlimited={!item.traffic}
                      />
                    </span>
                  </li>
                  <li>
                    <span className='text-muted-foreground'>{t('totalTraffic')}</span>
                    <span className='text-2xl font-bold'>
                      <Display type='traffic' value={item.traffic} unlimited={!item.traffic} />
                    </span>
                  </li>
                  <li>
                    <span className='text-muted-foreground'>{t('nextResetDays')}</span>
                    <span className='text-2xl font-semibold'>
                      {differenceInDays(getNextResetDate(item.start_time), new Date()) ||
                        t('unknown')}
                    </span>
                  </li>
                  <li>
                    <span className='text-muted-foreground'>{t('expirationDays')}</span>
                    <span className='text-2xl font-semibold'>
                      {differenceInDays(new Date(item.expire_time), new Date()) || t('unknown')}
                    </span>
                  </li>
                </ul>
                <Separator className='mt-4' />
                <Accordion type='single' collapsible defaultValue='0' className='w-full'>
                  {getUserSubscribe(item.mark, protocol)?.map((url, index) => (
                    <AccordionItem key={url} value={String(index)}>
                      <AccordionTrigger className='hover:no-underline'>
                        <div className='flex w-full flex-row items-center justify-between'>
                          <CardTitle className='text-sm font-medium'>
                            {t('subscriptionUrl')} {index + 1}
                          </CardTitle>
                          <span
                            className='mr-4 flex cursor-pointer rounded p-2 text-sm text-primary hover:bg-accent'
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(url);
                            }}
                          >
                            <Copy className='mr-2 size-5' />
                            {t('copy')}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className='grid grid-cols-3 gap-4 lg:grid-cols-4 xl:grid-cols-7'>
                          {application &&
                            application[platform]?.map((app) => (
                              <div
                                key={app.name}
                                className='flex size-full flex-col items-center justify-between gap-2 text-xs text-muted-foreground'
                              >
                                <span>{app.name}</span>
                                {app.icon && (
                                  <Image src={app.icon} alt={app.name} width={50} height={50} />
                                )}
                                <div className='flex'>
                                  <Button size='sm' variant='secondary' className='px-1.5' asChild>
                                    <Link href={app.url!}>{t('download')}</Link>
                                  </Button>
                                  <Button
                                    size='sm'
                                    onClick={() => {
                                      handleCopy(url);
                                      const href = getAppSubLink(app.subscribe_type, url);
                                      if (isBrowser() && href) {
                                        window.location.href = href;
                                      } else {
                                        toast.info(t('manualImportMessage'));
                                      }
                                    }}
                                    className='p-2'
                                  >
                                    {t('import')}
                                  </Button>
                                </div>
                              </div>
                            ))}
                          <div className='hidden size-full flex-col items-center justify-between gap-2 text-sm text-muted-foreground lg:flex'>
                            <span>{t('qrCode')}</span>
                            <QRCodeCanvas
                              value={url}
                              size={80}
                              bgColor='transparent'
                              fgColor='rgb(59, 130, 246)'
                            />
                            <span className='text-center'>{t('scanToSubscribe')}</span>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </>
      ) : (
        <>
          <h2 className='flex items-center gap-1.5 font-semibold'>
            <Icon icon='uil:shop' className='size-5' />
            {t('purchaseSubscription')}
          </h2>
          <Subscribe />
        </>
      )}
    </div>
  );
}
