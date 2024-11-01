'use client';

import Lottie, { LottieComponentProps } from 'lottie-react';
import gift from './gift.json';
import globalMap from './global-map.json';
import loading from './loading.json';
import locations from './locations.json';
import login from './login.json';
import moon from './moon.json';
import networkSecurity from './network-security.json';
import rocket from './rocket.json';
import servers from './servers.json';
import sun from './sun.json';
import users from './users.json';

export function RocketLoading(props: Omit<LottieComponentProps, 'animationData'>) {
  return <Lottie {...props} loop animationData={rocket} />
}

export function Loading(props: Omit<LottieComponentProps, 'animationData'>) {
  return <Lottie {...props} loop animationData={loading} />
}

export function Sun(props: Omit<LottieComponentProps, 'animationData'>) {
  return <Lottie {...props} loop animationData={sun} />
}

export function Moon(props: Omit<LottieComponentProps, 'animationData'>) {
  return <Lottie {...props} loop animationData={moon} />
}

export function NetworkSecurity(props: Omit<LottieComponentProps, 'animationData'>) {
  return <Lottie {...props} loop animationData={networkSecurity} />
}

export function Users(props: Omit<LottieComponentProps, 'animationData'>) {
  return <Lottie {...props} loop animationData={users} />
}

export function Locations(props: Omit<LottieComponentProps, 'animationData'>) {
  return <Lottie {...props} loop animationData={locations} />
}

export function Servers(props: Omit<LottieComponentProps, 'animationData'>) {
  return <Lottie {...props} loop animationData={servers} />
}

export function GlobalMap(props: Omit<LottieComponentProps, 'animationData'>) {
  return <Lottie {...props} loop animationData={globalMap} />
}

export function Gift(props: Omit<LottieComponentProps, 'animationData'>) {
  return <Lottie {...props} loop animationData={gift} />
}

export function Login(props: Omit<LottieComponentProps, 'animationData'>) {
  return <Lottie {...props} loop animationData={login} />
}
