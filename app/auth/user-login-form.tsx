import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useTranslations } from 'next-intl';
import { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import useGlobalStore from '@/hooks/use-global';

import CloudFlareTurnstile from './turnstile';

export default function UserLoginForm({
  loading,
  onSubmit,
  initialValues,
  setInitialValues,
  onSwitchForm,
}: {
  loading?: boolean;
  onSubmit: (data: any) => void;
  initialValues: any;
  setInitialValues: Dispatch<SetStateAction<any>>;
  onSwitchForm: (type?: 'register' | 'reset') => void;
}) {
  const t = useTranslations('auth.login');
  const { common } = useGlobalStore();
  const { verify } = common;

  const formSchema = z.object({
    email: z.string(),
    password: z.string(),
    cf_token: verify.enable_login_verify ? z.string() : z.string().optional(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-6'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input disabled placeholder='Enter your email...' type='email' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder='Enter your password...'
                    type='password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {verify.enable_login_verify && (
            <FormField
              control={form.control}
              name='cf_token'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CloudFlareTurnstile id='login' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <Button type='submit' disabled={loading}>
            {loading && <Icon icon='mdi:loading' className='animate-spin' />}
            {t('title')}
          </Button>
        </form>
      </Form>
      <div className='mt-4 flex w-full justify-between text-sm'>
        <Button variant='link' type='button' className='p-0' onClick={() => onSwitchForm('reset')}>
          {t('forgotPassword')}
        </Button>
        <Button
          variant='link'
          className='p-0'
          onClick={() => {
            setInitialValues(undefined);
            onSwitchForm(undefined);
          }}
        >
          {t('switchAccount')}
        </Button>
      </div>
    </>
  );
}
