import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import useGlobalStore from '@/hooks/use-global';

export default function UserCheckForm({
  loading,
  onSubmit,
  initialValues,
}: {
  loading?: boolean;
  onSubmit: (data: any) => void;
  initialValues: any;
}) {
  const t = useTranslations('auth.check');
  const { common } = useGlobalStore();
  const { register } = common;
  const formSchema = z.object({
    email: z
      .string()
      .email(t('email'))
      .refine(
        (email) => {
          if (!register.enable_email_domain_suffix) return true;
          const domain = email.split('@')[1];
          return register.email_domain_suffix_list.split('\n').includes(domain);
        },
        {
          message: t('whitelist'),
        },
      ),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleEmailChange = (value: string) => {
    form.setValue('email', value);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(async () => {
      const isValid = await form.trigger('email');
      if (isValid) {
        setIsSubmitting(true);
        form.handleSubmit(onSubmit)();
      } else {
        setIsSubmitting(false);
      }
    }, 500);
  };

  useEffect(() => {
    if (initialValues && initialValues.email) {
      handleEmailChange(initialValues.email);
    }
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-6'>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  disabled={loading}
                  placeholder='Enter your email...'
                  type='email'
                  {...field}
                  onChange={(e) => handleEmailChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' disabled={!isSubmitting}>
          {isSubmitting ? (
            <>
              <Icon icon='mdi:loading' className='mr-2 size-5 animate-spin' />
              {t('checking')}
            </>
          ) : (
            t('continue')
          )}
        </Button>
      </form>
    </Form>
  );
}
