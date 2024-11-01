'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import useGlobalStore from '@/hooks/use-global';
import { updateUserNotify } from '@/services/user/user';

const FormSchema = z.object({
  enable_balance_notify: z.boolean(),
  enable_login_notify: z.boolean(),
  enable_subscribe_notify: z.boolean(),
  enable_trade_notify: z.boolean(),
});

export default function NotifyEvent() {
  const t = useTranslations('profile.notifyEvent');
  const { user, getUserInfo } = useGlobalStore();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      enable_balance_notify: user?.enable_balance_notify,
      enable_login_notify: user?.enable_login_notify,
      enable_subscribe_notify: user?.enable_subscribe_notify,
      enable_trade_notify: user?.enable_trade_notify,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    await updateUserNotify(data);
    toast.success(t('updateSuccess'));
    getUserInfo();
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-start bg-muted/50'>
        <CardTitle>{t('notificationEvents')}</CardTitle>
      </CardHeader>
      <CardContent className='grid gap-4 p-6 text-sm'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-6'>
            <FormField
              control={form.control}
              name='enable_balance_notify'
              render={({ field }) => (
                <FormItem className='flex items-center justify-between text-muted-foreground'>
                  <FormLabel>{t('balanceChange')}</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(value) => {
                        field.onChange(value);
                        form.handleSubmit(onSubmit)();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='enable_login_notify'
              render={({ field }) => (
                <FormItem className='flex items-center justify-between text-muted-foreground'>
                  <FormLabel>{t('login')}</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(value) => {
                        field.onChange(value);
                        form.handleSubmit(onSubmit)();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='enable_subscribe_notify'
              render={({ field }) => (
                <FormItem className='flex items-center justify-between text-muted-foreground'>
                  <FormLabel>{t('subscribe')}</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(value) => {
                        field.onChange(value);
                        form.handleSubmit(onSubmit)();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='enable_trade_notify'
              render={({ field }) => (
                <FormItem className='flex items-center justify-between text-muted-foreground'>
                  <FormLabel>{t('finance')}</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(value) => {
                        field.onChange(value);
                        form.handleSubmit(onSubmit)();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
