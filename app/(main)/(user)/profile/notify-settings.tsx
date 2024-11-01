'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import useGlobalStore from '@/hooks/use-global';
import { updateUserNotifySetting } from '@/services/user/user';

const FormSchema = z.object({
  telegram: z.number().nullish(),
  enable_email_notify: z.boolean(),
  enable_telegram_notify: z.boolean(),
});

export default function NotifySettings() {
  const t = useTranslations('profile.notify');
  const { user } = useGlobalStore();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      telegram: user?.telegram,
      enable_email_notify: user?.enable_email_notify,
      enable_telegram_notify: user?.enable_telegram_notify,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    await updateUserNotifySetting(data as API.UpdateUserNotifySettingRequet);
    toast.success(t('updateSuccess'));
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-start bg-muted/50'>
        <CardTitle>{t('notificationSettings')}</CardTitle>
      </CardHeader>
      <CardContent className='grid gap-4 p-6 text-sm'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-6'>
            <FormField
              control={form.control}
              name='telegram'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('telegramId')}</FormLabel>
                  <FormControl>
                    <div className='flex w-full items-center space-x-2'>
                      <Input
                        type='number'
                        placeholder={t('telegramIdPlaceholder')}
                        {...field}
                        value={field.value ? field.value : ''}
                        onChange={(e) => {
                          field.onChange(e.target.value ? Number(e.target.value) : '');
                        }}
                      />
                      <Button
                        size='sm'
                        type='button'
                        onClick={async () => {
                          form.handleSubmit(onSubmit)();
                        }}
                      >
                        {t('bind')}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='enable_email_notify'
              render={({ field }) => (
                <FormItem className='flex items-center justify-between text-muted-foreground'>
                  <FormLabel>{t('emailNotification')}</FormLabel>
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
              name='enable_telegram_notify'
              render={({ field }) => (
                <FormItem className='flex items-center justify-between text-muted-foreground'>
                  <FormLabel>{t('telegramNotification')}</FormLabel>
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
