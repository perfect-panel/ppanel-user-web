'use client';

import AutoScroll from 'embla-carousel-auto-scroll';
import { AnimationProps, motion, MotionProps } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/legacy/image';
import Link from 'next/link';
import { useMemo } from 'react';

import { Gift, GlobalMap, Locations, NetworkSecurity, Servers, Users } from '@/components/lotties';
import { Button, buttonVariants } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import useGlobalStore from '@/hooks/use-global';

function ScrollAnimationWrapper({
  children,
  className,
  ...props
}: AnimationProps &
  MotionProps & {
    className?: string;
  }) {
  return (
    <motion.section
      className={className}
      initial='offscreen'
      viewport={{ once: true, amount: 0.8 }}
      whileInView='onscreen'
      {...props}
    >
      {children}
    </motion.section>
  );
}
function getScrollAnimation() {
  return {
    offscreen: {
      y: 150,
      opacity: 0,
    },
    onscreen: ({ duration = 2 } = {}) => ({
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        duration,
      },
    }),
  };
}

const listUser = [
  {
    name: 'Users',
    number: '390',
    icon: <Users className='size-24' />,
  },
  {
    name: 'Locations',
    number: '20',
    icon: <Locations className='size-24' />,
  },
  {
    name: 'Server',
    number: '50',
    icon: <Servers className='size-24' />,
  },
];

export default function Page() {
  const scrollAnimation = useMemo(() => getScrollAnimation(), []);
  const { common, user } = useGlobalStore();
  const { site } = common;
  const t = useTranslations('index');
  return (
    <main className='container space-y-16'>
      <ScrollAnimationWrapper>
        <motion.div
          className='grid grid-flow-row grid-rows-2 gap-8 pt-16 sm:grid-flow-col sm:grid-cols-2 md:grid-rows-1'
          variants={scrollAnimation}
        >
          <div className='row-start-2 flex flex-col items-start justify-center sm:row-start-1'>
            <h1 className='my-6 text-pretty text-4xl font-bold lg:text-6xl'>
              {t('welcome')} {site.site_name}
            </h1>
            <p className='mb-8 max-w-xl text-muted-foreground lg:text-xl'>{site.site_desc}</p>
            <div className='flex w-full flex-col gap-2 sm:flex-row md:justify-start'>
              <Link href={user ? '/dashboard' : '/auth'} className={buttonVariants()}>
                {t('started')}
              </Link>
            </div>
          </div>
          <div className='flex w-full'>
            <motion.div className='h-full w-full' variants={scrollAnimation}>
              <NetworkSecurity />
            </motion.div>
          </div>
        </motion.div>
      </ScrollAnimationWrapper>
      <ScrollAnimationWrapper>
        <div className='z-10 grid w-full grid-flow-row grid-cols-1 divide-y-2 divide-muted rounded-lg sm:grid-flow-row sm:grid-cols-3 sm:divide-x-2 sm:divide-y-0'>
          {listUser.map((item, index) => (
            <motion.div
              className='mx-auto flex w-8/12 items-center justify-start px-4 py-4 sm:mx-0 sm:w-auto sm:justify-center sm:py-6'
              key={index}
              custom={{ duration: 2 + index }}
              variants={scrollAnimation}
            >
              <div className='mx-auto flex w-40 items-center sm:w-auto'>
                <div className='mr-6 flex h-24 w-24 items-center justify-center rounded-full'>
                  {item.icon}
                </div>
                <div className='flex flex-col'>
                  <p className='text-xl font-bold'>{item.number}+</p>
                  <p className='text-lg text-muted-foreground'>{item.name}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollAnimationWrapper>
      <div className='mx-auto flex w-full max-w-screen-xl flex-col justify-center px-6 text-center'>
        <div className='flex w-full flex-col'>
          <ScrollAnimationWrapper>
            <motion.h3
              variants={scrollAnimation}
              className='text-2xl font-medium leading-relaxed sm:text-3xl lg:text-4xl'
            >
              {t('choose_plan')}
            </motion.h3>
            <motion.p
              variants={scrollAnimation}
              className='mx-auto my-2 w-10/12 text-center leading-normal sm:w-7/12 lg:w-6/12'
            >
              {t('choose_plan_desc')}
            </motion.p>
          </ScrollAnimationWrapper>
          <div className='grid grid-flow-row grid-cols-1 gap-4 px-6 py-8 sm:grid-flow-col sm:grid-cols-3 sm:px-0 lg:gap-12 lg:px-6 lg:py-12'>
            <ScrollAnimationWrapper className='flex justify-center'>
              <motion.div
                variants={scrollAnimation}
                className='flex flex-col items-center justify-center rounded-xl border-2 border-gray-500 px-6 py-4 lg:px-12 xl:px-20'
                whileHover={{
                  scale: 1.1,
                  transition: {
                    duration: 0.2,
                  },
                }}
              >
                <Gift className='size-48' />
                <p className='my-2 text-lg font-medium capitalize sm:my-7'>Free Plan</p>
                <ul className='flex flex-grow list-inside flex-col items-start justify-start pl-6 text-left text-muted-foreground xl:pl-0'>
                  <li className='check custom-list relative my-2'>Unlimited Bandwitch</li>
                  <li className='check custom-list relative my-2'>Encrypted Connection</li>
                  <li className='check custom-list relative my-2'>No Traffic Logs</li>
                  <li className='check custom-list relative my-2'>Works on All Devices</li>
                </ul>
                <div className='mb-8 mt-12 flex w-full flex-none flex-col justify-center'>
                  <p className='mb-4 text-center text-2xl'>Free</p>
                  <Button>Select</Button>
                </div>
              </motion.div>
            </ScrollAnimationWrapper>
            <ScrollAnimationWrapper className='flex justify-center'>
              <motion.div
                variants={scrollAnimation}
                className='flex flex-col items-center justify-center rounded-xl border-2 border-gray-500 px-6 py-4 lg:px-12 xl:px-20'
                whileHover={{
                  scale: 1.1,
                  transition: {
                    duration: 0.2,
                  },
                }}
              >
                <Gift className='size-48' />
                <p className='my-2 text-lg font-medium capitalize sm:my-7'>Standard Plan </p>
                <ul className='flex flex-grow list-inside flex-col items-start justify-start pl-6 text-left text-muted-foreground xl:pl-0'>
                  <li className='check custom-list relative my-2'>Unlimited Bandwitch</li>
                  <li className='check custom-list relative my-2'>Encrypted Connection</li>
                  <li className='check custom-list relative my-2'>No Traffic Logs</li>
                  <li className='check custom-list relative my-2'>Works on All Devices</li>
                  <li className='check custom-list relative my-2'>Connect Anyware </li>
                </ul>
                <div className='mb-8 mt-12 flex w-full flex-none flex-col justify-center'>
                  <p className='mb-4 text-center text-2xl'>
                    $9 <span className='text-muted-foreground'>/ mo</span>
                  </p>
                  <Button>Select</Button>
                </div>
              </motion.div>
            </ScrollAnimationWrapper>
            <ScrollAnimationWrapper className='flex justify-center'>
              <motion.div
                variants={scrollAnimation}
                className='flex flex-col items-center justify-center rounded-xl border-2 border-gray-500 px-6 py-4 lg:px-12 xl:px-20'
                whileHover={{
                  scale: 1.1,
                  transition: {
                    duration: 0.2,
                  },
                }}
              >
                <Gift className='size-48' />
                <p className='my-2 text-lg font-medium capitalize sm:my-7'>Premium Plan </p>
                <ul className='flex flex-grow list-inside flex-col items-start justify-start pl-6 text-left text-muted-foreground xl:pl-0'>
                  <li className='check custom-list relative my-2'>Unlimited Bandwitch</li>
                  <li className='check custom-list relative my-2'>Encrypted Connection</li>
                  <li className='check custom-list relative my-2'>No Traffic Logs</li>
                  <li className='check custom-list relative my-2'>Works on All Devices</li>
                  <li className='check custom-list relative my-2'>Connect Anyware </li>
                  <li className='check custom-list relative my-2'>Get New Features </li>
                </ul>
                <div className='mb-8 mt-12 flex w-full flex-none flex-col justify-center'>
                  <p className='mb-4 text-center text-2xl'>
                    $12 <span className='text-muted-foreground'>/ mo</span>
                  </p>

                  <Button>Select</Button>
                </div>
              </motion.div>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </div>
      <ScrollAnimationWrapper>
        <motion.h3
          variants={scrollAnimation}
          className='mx-auto text-center text-2xl font-medium leading-relaxed sm:text-3xl lg:text-4xl'
        >
          {t('huge_network')} {site.site_name}
        </motion.h3>
        <motion.p className='mx-auto my-2 text-center leading-normal' variants={scrollAnimation}>
          {site.site_name} {t('global_network_desc')}
        </motion.p>
      </ScrollAnimationWrapper>
      <ScrollAnimationWrapper>
        <motion.div className='aspect-[2/1] w-full overflow-hidden' variants={scrollAnimation}>
          <GlobalMap className='-mt-[25%] w-full' />
        </motion.div>
      </ScrollAnimationWrapper>
      <ScrollAnimationWrapper>
        <motion.div
          className='relative mx-auto flex items-center justify-center overflow-hidden py-6'
          variants={scrollAnimation}
        >
          <Carousel
            opts={{ loop: true, dragFree: false }}
            plugins={[AutoScroll({ playOnInit: true })]}
          >
            <CarouselContent className='ml-0'>
              {[
                'facebook',
                'google',
                'hbo',
                'instagram',
                'netflix',
                'primevideo',
                'reddit',
                'snapchat',
                'spotify',
                'twitch',
                'twitter',
                'whatsapp',
                'youtube',
              ].map((logo) => (
                <CarouselItem
                  key={logo}
                  className='basis-1/3 pl-0 sm:basis-1/4 md:basis-1/5 lg:basis-1/6'
                >
                  <div className='mx-10 flex shrink-0 items-center justify-center'>
                    <Image
                      src={`/index/${logo}.png`}
                      alt={logo}
                      width={120}
                      height={48}
                      className='h-12 w-auto object-contain'
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className='absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background to-transparent'></div>
          <div className='absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent'></div>
        </motion.div>
      </ScrollAnimationWrapper>
    </main>
  );
}
