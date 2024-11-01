// @ts-ignore
/* eslint-disable */
import request from '@/lib/request';

/** Get available payment methods GET /v1/public/payment/methods */
export async function getAvailablePaymentMethods(options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.GetAvailablePaymentMethodsResponse }>(
    '/v1/public/payment/methods',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}
