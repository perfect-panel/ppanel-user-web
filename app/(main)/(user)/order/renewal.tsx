'use client';

import { DialogTrigger } from '@radix-ui/react-dialog';
import { useQuery } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/legacy/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import useGlobalStore from '@/hooks/use-global';
import { checkoutOrder, preCreateOrder, renewal } from '@/services/user/order';
import { getAvailablePaymentMethods } from '@/services/user/payment';

import { SubscribeBilling } from '../subscribe/billing';
import { SubscribeDetail } from '../subscribe/detail';

export default function Renewal({
  mark,
  subscribe,
}: {
  mark: string;
  subscribe: Omit<API.SubscribeDetails, 'discount'> & {
    discount: string | API.UserSubscribeDiscount[];
  };
}) {
  const t = useTranslations('order');
  const { getUserInfo } = useGlobalStore();
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const [params, setParams] = useState<API.RenewalOrderRequest>({
    quantity: 1,
    subscribe_id: subscribe.id,
    payment: 'balance',
    coupon: '',
    subscribe_mark: mark,
  });
  const [loading, startTransition] = useTransition();

  const { data: order } = useQuery({
    queryKey: ['preCreateOrder', params],
    queryFn: async () => {
      const { data } = await preCreateOrder({
        ...params,
        subscribe_id: subscribe.id,
      });
      return data.data;
    },
    enabled: !!subscribe.id,
  });

  const { data: paymentMethods } = useQuery({
    queryKey: ['getAvailablePaymentMethods'],
    queryFn: async () => {
      const { data } = await getAvailablePaymentMethods();
      return data.data?.list || [];
    },
  });

  useEffect(() => {
    if (subscribe.id && mark) {
      setParams((prev) => ({
        ...prev,
        quantity: 1,
        subscribe_id: subscribe.id,
        subscribe_mark: mark,
      }));
    }
  }, [subscribe.id, mark]);

  function getDiscount() {
    try {
      if (typeof subscribe.discount === 'string') {
        return JSON.parse(subscribe?.discount) as API.UserSubscribeDiscount[];
      }
      return subscribe?.discount;
    } catch (error) {
      return [];
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size='sm'>{t('renew')}</Button>
      </DialogTrigger>
      <DialogContent className='flex h-full max-w-screen-lg flex-col overflow-hidden md:h-auto'>
        <DialogHeader>
          <DialogTitle>{t('renewSubscription')}</DialogTitle>
        </DialogHeader>
        <div className='grid w-full gap-3 lg:grid-cols-2'>
          <Card className='border-transparent shadow-none md:border-inherit md:shadow'>
            <CardContent className='grid gap-3 p-0 text-sm md:p-6'>
              <SubscribeDetail
                subscribe={{
                  ...subscribe,
                  quantity: params.quantity,
                }}
              />
              <Separator />
              <SubscribeBilling
                order={{
                  ...order,
                  quantity: params.quantity,
                  unit_price: subscribe?.unit_price,
                }}
              />
            </CardContent>
          </Card>
          <div className='flex flex-col justify-between text-sm'>
            <div className='grid gap-3'>
              <div className='font-semibold'>{t('purchaseDuration')}</div>
              <RadioGroup
                value={String(params.quantity)}
                onValueChange={(value) => {
                  setParams({
                    ...params,
                    quantity: Number(value),
                  });
                }}
                className='flex flex-wrap gap-2'
              >
                <div className='relative'>
                  <RadioGroupItem value='1' id='1' className='peer sr-only' />
                  <Label
                    htmlFor='1'
                    className='relative flex h-full flex-col items-center justify-center gap-2 rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary'
                  >
                    1 {t('month')}
                  </Label>
                </div>
                {getDiscount().map((item) => (
                  <div key={item.months}>
                    <RadioGroupItem
                      value={String(item.months)}
                      id={String(item.months)}
                      className='peer sr-only'
                    />
                    <Label
                      htmlFor={String(item.months)}
                      className='relative flex h-full flex-col items-center justify-center gap-2 rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary'
                    >
                      {item.months} {t('months')}
                      {item.discount < 100 && (
                        <Badge variant='destructive'>-{100 - item.discount}%</Badge>
                      )}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              <div className='flex'>
                <Input
                  placeholder={t('enterCoupon')}
                  value={params.coupon}
                  onChange={(e) => {
                    setParams({
                      ...params,
                      coupon: e.target.value.trim(),
                    });
                  }}
                />
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
                    const response = await renewal(params);
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
