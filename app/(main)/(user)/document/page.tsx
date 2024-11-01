'use client';

import { useQuery } from '@tanstack/react-query';
import { ChevronLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Fragment, useState } from 'react';

import { Markdown } from '@/components/editor';
import { ProList } from '@/components/pro-list';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib';
import { queryDocumentDetail, queryDocumentList } from '@/services/user/document';

export default function Page() {
  const t = useTranslations('document');
  const [tags, setTags] = useState<string[]>([]);
  const [selected, setSelected] = useState<number>();

  const { data } = useQuery({
    enabled: !!selected,
    queryKey: ['queryDocumentDetail', selected],
    queryFn: async () => {
      const { data } = await queryDocumentDetail({
        id: selected!,
      });
      return data.data;
    },
  });

  return (
    <Fragment>
      {selected ? (
        <Card>
          <CardHeader className='pb-2'>
            <div className='flex items-center justify-between'>
              <Button variant='outline' onClick={() => setSelected(undefined)}>
                <ChevronLeft className='size-4' />
                {t('back')}
              </Button>
              <CardTitle className='font-medium'>{data?.title}</CardTitle>
              <CardDescription>{formatDate(data?.updated_at)}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Markdown>{data?.content!}</Markdown>
          </CardContent>
        </Card>
      ) : (
        <ProList<API.DocumentItem, { tag: string }>
          params={[
            {
              key: 'tag',
              placeholder: t('category'),
              options: tags.map((item) => ({
                label: item,
                value: item,
              })),
            },
          ]}
          request={async ({}, filter) => {
            const response = await queryDocumentList();
            const list = response.data.data?.list || [];
            setTags(
              Array.from(new Set(list.reduce((acc: string[], item) => acc.concat(item.tags), []))),
            );
            const filterList = list.filter((item) =>
              filter.tag ? item.tags.includes(filter.tag) : true,
            );
            return {
              list: filterList,
              total: filterList.length || 0,
            };
          }}
          renderItem={(item) => {
            return (
              <Card className='overflow-hidden'>
                <CardHeader className='flex flex-row items-center justify-between gap-2 space-y-0 bg-muted/50 p-3'>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>
                    <Button
                      size='sm'
                      onClick={() => {
                        setSelected(item.id);
                      }}
                    >
                      {t('read')}
                    </Button>
                  </CardDescription>
                </CardHeader>

                <CardContent className='p-3 text-sm'>
                  <ul className='grid gap-3 *:flex *:flex-col lg:grid-cols-2'>
                    <li>
                      <span className='text-muted-foreground'>{t('tags')}</span>
                      <span>{item.tags.join(', ')}</span>
                    </li>
                    <li className='font-semibold'>
                      <span className='text-muted-foreground'>{t('updatedAt')}</span>
                      <time>{formatDate(item.updated_at)}</time>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            );
          }}
        />
      )}
    </Fragment>
  );
}
