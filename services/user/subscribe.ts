// @ts-ignore
/* eslint-disable */
import request from '@/lib/request';

/** Get application config GET /v1/public/subscribe/application/config */
export async function queryApplicationConfig(options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.QueryApplicationConfigResponse }>(
    '/v1/public/subscribe/application/config',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}

/** Get subscribe group list GET /v1/public/subscribe/group/list */
export async function querySubscribeGroupList(options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.QuerySubscribeGroupListResponse }>(
    '/v1/public/subscribe/group/list',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}

/** Get subscribe list GET /v1/public/subscribe/list */
export async function querySubscribeList(options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.QuerySubscribeListResponse }>(
    '/v1/public/subscribe/list',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}
