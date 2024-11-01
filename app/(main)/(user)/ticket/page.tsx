'use client';

import { Icon } from '@iconify/react';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import NextImage from 'next/legacy/image';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { DeleteButton } from '@/components/customize/delete-button';
import { ProList } from '@/components/pro-list';
import { ProListActions } from '@/components/pro-list/pro-list';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { cn, formatDate } from '@/lib';
import {
  createUserTicket,
  createUserTicketFollow,
  getUserTicketDetails,
  getUserTicketList,
  updateUserTicketStatus,
} from '@/services/user/ticket';

export default function Page() {
  const t = useTranslations('ticket');

  const [ticketId, setTicketId] = useState<any>(null);
  const [message, setMessage] = useState('');

  const { data: ticket, refetch: refetchTicket } = useQuery({
    queryKey: ['getUserTicketDetails', ticketId],
    queryFn: async () => {
      const { data } = await getUserTicketDetails({ id: ticketId });
      return data.data as API.UserTicket;
    },
    enabled: !!ticketId,
    refetchInterval: 5000,
  });

  const scrollRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.children[1].scrollTo({
          top: scrollRef.current.children[1].scrollHeight,
          behavior: 'smooth',
        });
      }
    }, 66);
  }, [ticket?.follow?.length]);

  const ref = useRef<ProListActions>();
  const [create, setCreate] = useState<Partial<API.CreateUserTicketRequest & { open: boolean }>>();

  return (
    <>
      <ProList<API.UserTicket, { status: number }>
        action={ref}
        header={{
          title: t('ticketList'),
          toolbar: (
            <Dialog open={create?.open} onOpenChange={(open) => setCreate({ open })}>
              <DialogTrigger asChild>
                <Button size='sm'>{t('createTicket')}</Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                  <DialogTitle>{t('createTicket')}</DialogTitle>
                  <DialogDescription>{t('createTicketDescription')}</DialogDescription>
                </DialogHeader>
                <div className='grid gap-4 py-4'>
                  <Label htmlFor='title'>{t('title')}</Label>
                  <Input
                    id='title'
                    defaultValue={create?.title}
                    onChange={(e) => setCreate({ ...create, title: e.target.value! })}
                  />
                  <Label htmlFor='content'>{t('description')}</Label>
                  <Textarea
                    id='content'
                    defaultValue={create?.description}
                    onChange={(e) => setCreate({ ...create, description: e.target.value! })}
                  />
                </div>
                <DialogFooter>
                  <Button
                    disabled={!create?.title || !create?.description}
                    onClick={async () => {
                      await createUserTicket({
                        title: create!.title!,
                        description: create!.description!,
                      });
                      ref.current?.refresh();
                      toast.success(t('createSuccess'));
                      setCreate({ open: false });
                    }}
                  >
                    {t('submit')}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ),
        }}
        params={[
          {
            key: 'search',
          },
          {
            key: 'status',
            placeholder: t('status.0'),
            options: [
              {
                label: t('close'),
                value: '4',
              },
            ],
          },
        ]}
        request={async (pagination, filters) => {
          const { data } = await getUserTicketList({
            ...pagination,
            ...filters,
          });
          return {
            list: data.data?.list || [],
            total: data.data?.total || 0,
          };
        }}
        renderItem={(item) => {
          return (
            <Card className='overflow-hidden'>
              <CardHeader className='flex flex-row items-center justify-between gap-2 space-y-0 bg-muted/50 p-3'>
                <CardTitle>
                  <span
                    className={cn(
                      'flex items-center gap-2 before:block before:size-1.5 before:animate-pulse before:rounded-full before:ring-2 before:ring-opacity-50',
                      {
                        'before:bg-yellow-500 before:ring-yellow-500': item.status === 1,
                        'before:bg-rose-500 before:ring-rose-500': item.status === 2,
                        'before:bg-green-500 before:ring-green-500': item.status === 3,
                        'before:bg-zinc-500 before:ring-zinc-500': item.status === 4,
                      },
                    )}
                  >
                    {t(`status.${item.status}`)}
                  </span>
                </CardTitle>
                <CardDescription className='flex gap-2'>
                  {item.status !== 4 ? (
                    <>
                      <Button key='reply' size='sm' onClick={() => setTicketId(item.id)}>
                        {t('reply')}
                      </Button>
                      <DeleteButton
                        key='close'
                        trigger={t('close')}
                        title={t('confirmClose')}
                        description={t('closeWarning')}
                        onConfirm={async () => {
                          await updateUserTicketStatus({ id: item.id, status: 4 });
                          toast.success(t('closeSuccess'));
                          ref.current?.refresh();
                        }}
                        onCancelText={t('cancel')}
                        onConfirmText={t('confirm')}
                      />
                    </>
                  ) : (
                    <Button key='check' size='sm' onClick={() => setTicketId(item.id)}>
                      {t('check')}
                    </Button>
                  )}
                </CardDescription>
              </CardHeader>

              <CardContent className='p-3 text-sm'>
                <ul className='grid gap-3 *:flex *:flex-col lg:grid-cols-3'>
                  <li>
                    <span className='text-muted-foreground'>{t('title')}</span>
                    <span> {item.title}</span>
                  </li>
                  <li className='font-semibold'>
                    <span className='text-muted-foreground'>{t('description')}</span>
                    <time>{item.description}</time>
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
      <Drawer
        open={!!ticketId}
        onOpenChange={(open) => {
          if (!open) setTicketId(null);
        }}
      >
        <DrawerContent className='container mx-auto h-screen'>
          <DrawerHeader className='border-b text-left'>
            <DrawerTitle>{ticket?.title}</DrawerTitle>
            <DrawerDescription className='line-clamp-3'>{ticket?.description}</DrawerDescription>
          </DrawerHeader>
          <ScrollArea className='h-full overflow-hidden' ref={scrollRef}>
            <div className='flex flex-col gap-4 p-4'>
              {ticket?.follow?.map((item) => (
                <div
                  key={item.id}
                  className={cn('flex items-center gap-4', {
                    'flex-row-reverse': item.from !== 'System',
                  })}
                >
                  <div
                    className={cn('flex flex-col gap-1', {
                      'items-end': item.from !== 'System',
                    })}
                  >
                    <p className='text-sm text-muted-foreground'>{formatDate(item.created_at)}</p>
                    <p
                      className={cn('w-fit rounded-lg bg-accent p-2 font-medium', {
                        'bg-primary text-primary-foreground': item.from !== 'System',
                      })}
                    >
                      {item.type === 1 && item.content}
                      {item.type === 2 && (
                        <NextImage
                          src={item.content!}
                          width={300}
                          height={300}
                          className='!size-auto object-cover'
                          alt='image'
                        />
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          {ticket?.status !== 4 && (
            <DrawerFooter>
              <form
                className='flex w-full flex-row items-center gap-2'
                onSubmit={async (event) => {
                  event.preventDefault();
                  if (message) {
                    await createUserTicketFollow({
                      ticket_id: ticketId,
                      from: 'User',
                      type: 1,
                      content: message,
                    });
                    refetchTicket();
                    setMessage('');
                  }
                }}
              >
                <Button type='button' variant='outline' className='p-0'>
                  <Label htmlFor='picture' className='p-2'>
                    <Icon icon='uil:image-upload' className='text-2xl' />
                  </Label>
                  <Input
                    id='picture'
                    type='file'
                    className='hidden'
                    accept='image/*'
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file && file.type.startsWith('image/')) {
                        const reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = (e) => {
                          const img = new Image();
                          img.src = e.target?.result as string;
                          img.onload = () => {
                            const canvas = document.createElement('canvas');
                            const ctx = canvas.getContext('2d');

                            const maxWidth = 300;
                            const maxHeight = 300;
                            let width = img.width;
                            let height = img.height;

                            if (width > height) {
                              if (width > maxWidth) {
                                height = Math.round((maxWidth / width) * height);
                                width = maxWidth;
                              }
                            } else {
                              if (height > maxHeight) {
                                width = Math.round((maxHeight / height) * width);
                                height = maxHeight;
                              }
                            }

                            canvas.width = width;
                            canvas.height = height;
                            ctx?.drawImage(img, 0, 0, width, height);

                            canvas.toBlob(
                              (blob) => {
                                const reader = new FileReader();
                                reader.readAsDataURL(blob!);
                                reader.onloadend = async () => {
                                  await createUserTicketFollow({
                                    ticket_id: ticketId,
                                    from: 'User',
                                    type: 2,
                                    content: reader.result as string,
                                  });
                                  refetchTicket();
                                };
                              },
                              'image/webp',
                              0.8,
                            );
                          };
                        };
                      }
                    }}
                  />
                </Button>
                <Input
                  placeholder={t('inputPlaceholder')}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <Button type='submit' disabled={!message}>
                  <Icon icon='uil:navigator' />
                </Button>
              </form>
            </DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
