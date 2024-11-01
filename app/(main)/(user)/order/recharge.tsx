'use client';

import { DialogTrigger } from '@radix-ui/react-dialog';
import { useQuery } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

import { FormattedInput } from '@/components/customize/formatted-Input';
import { Button, ButtonProps } from '@/components/ui/button';
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
import { convertToMajorUnit, convertToMinorUnit } from '@/lib';
import { checkoutOrder, recharge } from '@/services/user/order';
import { getAvailablePaymentMethods } from '@/services/user/payment';

export default function Recharge(props: ButtonProps) {
  const t = useTranslations('order');
  const { common } = useGlobalStore();
  const { currency } = common;

  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [loading, startTransition] = useTransition();

  const [params, setParams] = useState<API.RechargeOrderRequest>({
    amount: 0,
    payment: '',
  });

  const { data: paymentMethods } = useQuery({
    queryKey: ['getAvailablePaymentMethods'],
    queryFn: async () => {
      const { data } = await getAvailablePaymentMethods();
      return data.data?.list || [];
    },
  });

  useEffect(() => {
    if (paymentMethods?.length) {
      setParams((prev) => ({
        ...prev,
        payment: paymentMethods.find((item) => item.mark !== 'balance')?.mark as string,
      }));
    }
  }, [paymentMethods]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button {...props}>{t('recharge')}</Button>
      </DialogTrigger>
      <DialogContent className='flex h-full flex-col overflow-hidden md:h-auto'>
        <DialogHeader>
          <DialogTitle>{t('balanceRecharge')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <div className='flex flex-col justify-between text-sm'>
          <div className='grid gap-3'>
            <div className='font-semibold'>{t('rechargeAmount')}</div>
            <div className='flex'>
              <FormattedInput<number>
                type='number'
                placeholder={t('enterAmount')}
                min={0}
                value={params.amount}
                formatInput={convertToMajorUnit}
                formatOutput={convertToMinorUnit}
                onValueChange={(value) => {
                  setParams((prev) => ({
                    ...prev,
                    amount: value,
                  }));
                }}
                prefix={currency.currency_symbol}
                suffix={currency.currency_unit}
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
              {paymentMethods
                ?.filter((item) => item.mark !== 'balance')
                ?.map((item) => {
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
            disabled={loading || !params.amount}
            onClick={() => {
              startTransition(async () => {
                try {
                  const response = await recharge(params);
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
                    router.push(`/payment?order_no=${orderNo}`);
                    setOpen(false);
                  }
                } catch (error) {}
              });
            }}
          >
            {loading && <LoaderCircle className='mr-2 animate-spin' />}
            {t('rechargeNow')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
