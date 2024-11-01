import Providers from '@/components/layout/providers';
import { Toaster } from '@/components/ui/sonner';
import { fontSans } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { getGlobalConfig } from '@/services/common/common';
import { queryUserInfo } from '@/services/user/user';

import '@/styles/globals.css';

import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { cookies } from 'next/headers';
import { Metadata } from 'next/types';
import NextTopLoader from 'nextjs-toploader';
import React from 'react';

export async function generateMetadata(): Promise<Metadata> {
  const config = await getGlobalConfig({ skipErrorHandler: true }).then((res) => res.data.data!);
  const site = config?.site || {};
  return {
    title: {
      default: `${site.site_name}`,
      template: `%s | ${site.site_name}`,
    },
    description: site.site_desc,
    icons: {
      icon: site.site_logo
        ? [
            {
              url: site.site_logo,
              sizes: 'any',
            },
          ]
        : [],
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();

  let config, background, user;

  try {
    config = await getGlobalConfig({ skipErrorHandler: true }).then((res) => res.data.data);
  } catch (error) {}

  try {
    user = await queryUserInfo({
      skipErrorHandler: true,
      Authorization: (await cookies()).get('Authorization')?.value,
    }).then((res) => res.data.data);
  } catch (error) {}

  try {
    const response = await fetch('https://bing.com/HPImageArchive.aspx?format=js&idx=0&n=1');
    const data = await response.json();
    background = `https://bing.com${data?.images?.[0]?.url}`;
  } catch (error) {}

  return (
    <html suppressHydrationWarning lang={locale}>
      <body
        className={cn(
          'min-h-[calc(100dvh-env(safe-area-inset-top))] font-sans antialiased',
          fontSans.variable,
        )}
      >
        <NextIntlClientProvider messages={messages}>
          <NextTopLoader showSpinner={false} />
          <Providers common={{ ...config, background }} user={user}>
            <Toaster richColors closeButton />
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
