// @ts-ignore
/* eslint-disable */
import request from '@/lib/request';

/** Query announcement GET /v1/public/announcement/list */
export async function queryAnnouncement(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.QueryAnnouncementParams,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data?: API.QueryAnnouncementResponse }>(
    '/v1/public/announcement/list',
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    },
  );
}
