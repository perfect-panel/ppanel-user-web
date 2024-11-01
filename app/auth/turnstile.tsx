'use client';

import { useLocale } from 'next-intl';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';
import Turnstile, { useTurnstile } from 'react-turnstile';

import useGlobalStore from '@/hooks/use-global';

export default function CloudFlareTurnstile({
  id,
  value,
  onChange,
}: {
  id?: string;
  value?: null | string;
  onChange: (value?: string) => void;
}) {
  const { common } = useGlobalStore();
  const { verify } = common;
  const { resolvedTheme } = useTheme();
  const locale = useLocale();
  const turnstile = useTurnstile();

  useEffect(() => {
    if (value === '') {
      turnstile.reset();
    }
  }, [turnstile, value]);

  return (
    verify.turnstile_site_key && (
      <Turnstile
        id={id}
        sitekey={verify.turnstile_site_key}
        theme={resolvedTheme as 'light' | 'dark'}
        language={locale.toLowerCase()}
        fixedSize
        onVerify={(token) => onChange(token)}
        // onError={() => {
        //   onChange();
        //   turnstile.reset();
        // }}
        onExpire={() => {
          onChange();
          turnstile.reset();
        }}
        onTimeout={() => {
          onChange();
          turnstile.reset();
        }}
      />
    )
  );
}
