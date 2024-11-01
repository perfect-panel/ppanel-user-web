'use client';

import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useGlobalStore from '@/hooks/use-global';
import { Logout, navItems } from '@/lib';

export function UserNav() {
  const t = useTranslations('menu');
  const { user, setUser } = useGlobalStore();
  const router = useRouter();

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size='icon' variant='default'>
            <Avatar className='size-8'>
              <AvatarImage alt={user?.avatar ?? ''} src={user?.avatar ?? ''} />
              <AvatarFallback className='rounded-none bg-transparent'>
                {user?.email?.[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent forceMount align='end' className='w-56'>
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col space-y-1'>
              <p className='text-xs leading-none text-muted-foreground'>ID: {user?.id}</p>
              <p className='text-sm font-medium leading-none'>{user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {navItems.map((item) => (
              <DropdownMenuItem
                key={item.href}
                onClick={() => {
                  router.push(`${item.href}`);
                }}
              >
                <Icon className='mr-2 size-4 flex-none' icon={item.icon!} />
                <span className='truncate'>{t(item.label)}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              Logout();
              setUser();
            }}
          >
            {t('logout')}
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
}
