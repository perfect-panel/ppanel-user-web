'use client';

import { DialogTrigger } from '@radix-ui/react-dialog';
import { useQuery } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/legacy/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

import { Display } from '@/components/customize/display';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import useGlobalStore from '@/hooks/use-global';
import { checkoutOrder, resetTraffic } from '@/services/user/order';
import { getAvailablePaymentMethods } from '@/services/user/payment';

export default function ResetTraffic({
  id,
  mark,
  replacement,
}: {
  id: number;
  mark: string;
  replacement?: number;
}) {
  const t = useTranslations('order');
  const { getUserInfo } = useGlobalStore();
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const [params, setParams] = useState<API.ResetTrafficOrderRequest>({
    subscribe_id: id,
    payment: 'balance',
    subscribe_mark: mark,
  });
  const [loading, startTransition] = useTransition();

  const { data: paymentMethods } = useQuery({
    queryKey: ['getAvailablePaymentMethods'],
    queryFn: async () => {
      const { data } = await getAvailablePaymentMethods();
      return data.data?.list || [];
    },
  });

  useEffect(() => {
    if (id && mark) {
      setParams((prev) => ({
        ...prev,
        quantity: 1,
        subscribe_id: id,
        subscribe_mark: mark,
      }));
    }
  }, [id, mark]);

  if (!replacement) return;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm'>
          {t('resetTraffic')}
        </Button>
      </DialogTrigger>
      <DialogContent className='flex h-full flex-col overflow-hidden md:h-auto'>
        <DialogHeader>
          <DialogTitle>{t('resetTrafficTitle')}</DialogTitle>
          <DialogDescription>{t('resetTrafficDescription')}</DialogDescription>
        </DialogHeader>
        <div className='flex flex-col justify-between text-sm'>
          <div className='grid gap-3'>
            <div className='flex justify-between font-semibold'>
              <span>{t('resetPrice')}</span>
              <span>
                <Display type='currency' value={replacement} />
              </span>
            </div>
            <div className='font-semibold'>{t('paymentMethod')}</div>
            <RadioGroup
              className='grid grid-cols-5 gap-2'
              value={params.payment}
              onValueChange={(value) => {
                setParams({
                  ...params,
                  payment: value,
                });
              }}
            >
              {paymentMethods?.map((item) => {
                return (
                  <div key={item.mark}>
                    <RadioGroupItem value={item.mark} id={item.mark} className='peer sr-only' />
                    <Label
                      htmlFor={item.mark}
                      className='flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover py-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary'
                    >
                      <div className='mb-3 size-12'>
                        <Image
                          src={item.icon || `/payment/${item.mark}.svg`}
                          width={48}
                          height={48}
                          alt={item.name!}
                        />
                      </div>
                      <span className='w-full overflow-hidden text-ellipsis whitespace-nowrap text-center'>
                        {item.name || t(`methods.${item.mark}`)}
                      </span>
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>
          <Button
            className='fixed bottom-0 left-0 w-full rounded-none md:relative md:mt-6'
            disabled={loading}
            onClick={async () => {
              startTransition(async () => {
                try {
                  const response = await resetTraffic(params);
                  const orderNo = response.data.data?.order_no;
                  if (orderNo) {
                    const { data } = await checkoutOrder({
                      orderNo,
                    });
                    const type = data.data?.type;
                    const checkout_url = data.data?.checkout_url;
                    if (type === 'link') {
                      const width = 600;
                      const height = 800;
                      const left = (screen.width - width) / 2;
                      const top = (screen.height - height) / 2;
                      window.open(
                        checkout_url,
                        'newWindow',
                        `width=${width},height=${height},top=${top},left=${left},menubar=0,scrollbars=1,resizable=1,status=1,titlebar=0,toolbar=0,location=1`,
                      );
                    }
                    getUserInfo();
                    router.push(`/payment?order_no=${orderNo}`);
                  }
                } catch (error) {
                  console.log(error);
                }
              });
            }}
          >
            {loading && <LoaderCircle className='mr-2 animate-spin' />}
            {t('buyNow')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
