// @ts-ignore
/* eslint-disable */
import request from '@/lib/request';

/** Query User Balance Log GET /v1/public/user/balance_log */
export async function queryUserBalanceLog(options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.QueryUserBalanceLogListResponse }>(
    '/v1/public/user/balance_log',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}

/** Query User Info GET /v1/public/user/info */
export async function queryUserInfo(options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.UserInfo }>('/v1/public/user/info', {
    method: 'GET',
    ...(options || {}),
  });
}

/** Update User Notify PUT /v1/public/user/notify */
export async function updateUserNotify(
  body: API.UpdateUserNotifyRequest,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: any }>('/v1/public/user/notify', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Update User Notify Setting PUT /v1/public/user/notify_setting */
export async function updateUserNotifySetting(
  body: API.UpdateUserNotifySettingRequet,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: any }>('/v1/public/user/notify_setting', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Update User Password PUT /v1/public/user/password */
export async function updateUserPassword(
  body: API.UpdateUserPasswordRequest,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: any }>('/v1/public/user/password', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Query User Subscribe GET /v1/public/user/subscribe */
export async function queryUserSubscribe(options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.QueryUserSubscribeListResponse }>(
    '/v1/public/user/subscribe',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}
