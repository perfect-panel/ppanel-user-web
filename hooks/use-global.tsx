import Base64 from 'crypto-js/enc-base64';
import UTF8 from 'crypto-js/enc-utf8';
import { create } from 'zustand';

import { extractDomain } from '@/lib';
import { queryUserInfo } from '@/services/user/user';

interface ICommon extends API.GetGlobalConfigResponse {
  background: string;
}

export interface GlobalStore {
  common: ICommon;
  user?: API.UserInfo;
  setCommon: (common: Partial<ICommon>) => void;
  setUser: (user?: API.UserInfo) => void;
  getUserInfo: () => Promise<void>;
  getUserSubscribe: (uuid: string, type?: string) => string[];
  getAppSubLink: (type: string, url: string) => string;
}

export const useGlobalStore = create<GlobalStore>((set, get) => ({
  common: {
    background: '',
    site: {
      host: '',
      site_name: '',
      site_desc: '',
      site_logo: '',
    },
    verify: {
      enable_login_verify: false,
      enable_register_verify: false,
      enable_reset_password_verify: false,
      turnstile_site_key: '',
    },
    register: {
      stop_register: false,
      enable_email_verify: false,
      enable_email_domain_suffix: false,
      email_domain_suffix_list: '',
    },
    invite: {
      forced_invite: false,
    },
    currency: {
      currency_unit: 'USD',
      currency_symbol: '$',
    },
    subscribe: {
      single_model: false,
      subscribe_path: '',
      subscribe_domain: '',
      pan_domain: false,
    },
  },
  user: undefined,
  setCommon: (common) =>
    set((state) => ({
      common: {
        ...state.common,
        ...common,
      },
    })),
  setUser: (user) => set({ user }),
  getUserInfo: async () => {
    try {
      const { data } = await queryUserInfo();
      set({ user: data.data });
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  },
  getUserSubscribe: (uuid: string, type?: string) => {
    const { pan_domain, subscribe_domain, subscribe_path } = get().common.subscribe || {};
    const domains = subscribe_domain
      ? subscribe_domain.split('\n')
      : [extractDomain(process.env.NEXT_PUBLIC_API_URL!)];

    return domains.map((domain) => {
      const enc_type = type ? Base64.stringify(UTF8.parse(type)) : '';
      const enc_uuid = Base64.stringify(UTF8.parse(uuid));
      if (pan_domain) {
        if (enc_type) return `https://${enc_type}.${enc_uuid}.${domain}`;
        return `https://${enc_uuid}.${domain}`;
      } else {
        if (enc_type) return `https://${domain}${subscribe_path}?mark=${enc_uuid}&type=${enc_type}`;
        return `https://${domain}${subscribe_path}?mark=${enc_uuid}`;
      }
    });
  },
  getAppSubLink: (type: string, url: string) => {
    const name = get().common.site.site_name || '';
    switch (type) {
      // case 'Clash':
      //   return `clash://install-config?url=${url}&name=${name}`;
      case 'Hiddify':
        return `hiddify://import/${url}#${name}`;
      case 'Loon':
        return `loon://import?sub=${encodeURI(url)}${name}`;
      case 'NekoBox':
        return `sn://subscription?url=${url}&name=${name}`;
      case 'NekoRay':
        return `sn://subscription?url=${url}&name=${name}`;
      // case 'Netch':
      //   return ``;
      case 'Quantumult X':
        return `quantumult-x://add-resource?remote-resource=${url}`;
      case 'Shadowrocket':
        return `shadowrocket://add/sub://${window.btoa(url)}?remark=${encodeURI(name)}`;
      case 'Singbox':
        return `sing-box://import-remote-profile?url=${encodeURI(url)}#${name}`;
      case 'Surfboard':
        return `surfboard:///install-config?url=${encodeURI(url)}`;
      case 'Surge':
        return `surge:///install-config?url=${encodeURI(url)}`;
      case 'V2box':
        return `v2box://install-sub?url=${encodeURI(url)}&name=${name}`;
      case 'V2rayN':
        return `v2rayn://install-sub?url=${encodeURI(url)}&name=${name}`;
      case 'V2rayNg':
        return `v2rayng://install-sub?url=${encodeURI(url)}&name=${name}`;
      default:
        return `clash://install-config?url=${encodeURI(url)}&name=${name}`;
    }
  },
}));

export default useGlobalStore;
