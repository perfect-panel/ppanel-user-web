declare namespace API {
  type AnnouncementDetails = {
    id: number;
    title: string;
    content: string;
    created_at: number;
    updated_at: number;
  };

  type ApplicationConfig = {
    id: number;
    name: string;
    platform: string;
    subscribe_type: string;
    icon: string;
    url: string;
  };

  type CheckoutOrderRequest = {
    orderNo: string;
  };

  type CheckoutOrderResponse = {
    type: string;
    checkout_url?: string;
    stripe?: StripePayment;
  };

  type CloseOrderRequest = {
    orderNo: string;
  };

  type CreateUserTicketFollowRequest = {
    ticket_id: number;
    from: string;
    type: number;
    content: string;
  };

  type CreateUserTicketRequest = {
    title: string;
    description: string;
  };

  type DocumentDetail = {
    id: number;
    title: string;
    content: string;
    tags: string[];
    created_at: number;
    updated_at: number;
  };

  type DocumentItem = {
    id: number;
    title: string;
    tags: string[];
    updated_at: number;
  };

  type GetAvailablePaymentMethodsResponse = {
    list: PaymentItem[];
  };

  type GetUserTicketDetailRequest = {
    id: number;
  };

  type GetUserTicketDetailsParams = {
    id: number;
  };

  type GetUserTicketListParams = {
    page: number;
    size: number;
    status?: number;
    search?: string;
  };

  type GetUserTicketListRequest = {
    page: number;
    size: number;
    status?: number;
    search?: string;
  };

  type GetUserTicketListResponse = {
    total: number;
    list: UserTicket[];
  };

  type OrderDetails = {
    id: number;
    orderNo: string;
    type: number;
    subscribe_id: number;
    subscribe: SubscribeInfo;
    quantity: number;
    price: number;
    amount: number;
    fee_amount: number;
    coupon: string;
    reduction: number;
    trade_no: string;
    method: string;
    status: number;
    created_at: number;
  };

  type PaymentItem = {
    id: number;
    name: string;
    mark: string;
    icon: string;
    domain: string;
    fee_mode: number;
    fee_percent: number;
    fee_amount: number;
    enable: boolean;
  };

  type PreOrderResponse = {
    price: number;
    amount: number;
    fee_amount: number;
    coupon: number;
    reduction: number;
  };

  type PreRenewalOrderResponse = {
    orderNo: string;
  };

  type PurchaseOrderRequest = {
    subscribe_id: number;
    quantity: number;
    payment: string;
    coupon?: string;
  };

  type PurchaseOrderResponse = {
    order_no: string;
  };

  type QueryAnnouncementParams = {
    page: number;
    size: number;
  };

  type QueryAnnouncementRequest = {
    page: number;
    size: number;
  };

  type QueryAnnouncementResponse = {
    total: number;
    announcements: AnnouncementDetails[];
  };

  type QueryApplicationConfigResponse = {
    windows: ApplicationConfig[];
    mac: ApplicationConfig[];
    linux: ApplicationConfig[];
    android: ApplicationConfig[];
    ios: ApplicationConfig[];
  };

  type QueryDocumentDetailParams = {
    id: number;
  };

  type QueryDocumentDetailRequest = {
    id: number;
  };

  type QueryDocumentListResponse = {
    total: number;
    list: DocumentItem[];
  };

  type QueryOrderDetailParams = {
    order_no: string;
  };

  type QueryOrderDetailRequest = {
    order_no: string;
  };

  type QueryOrderListParams = {
    page: number;
    size: number;
  };

  type QueryOrderListRequest = {
    page: number;
    size: number;
  };

  type QueryOrderListResponse = {
    total: number;
    list: OrderDetails[];
  };

  type QuerySubscribeGroupListResponse = {
    list: UserSubscribeGroupDetails[];
    total: number;
  };

  type QuerySubscribeListResponse = {
    list: SubscribeDetails[];
    total: number;
  };

  type QueryUserBalanceLogListResponse = {
    list: UserBalanceLog[];
    total: number;
  };

  type QueryUserSubscribeListResponse = {
    list: UserSubscribe[];
    total: number;
  };

  type RechargeOrderRequest = {
    amount: number;
    payment: string;
  };

  type RechargeOrderResponse = {
    order_no: string;
  };

  type RenewalOrderRequest = {
    subscribe_id: number;
    quantity: number;
    payment: string;
    coupon?: string;
    subscribe_mark: string;
  };

  type RenewalOrderResponse = {
    order_no: string;
  };

  type ResetTrafficOrderRequest = {
    subscribe_id: number;
    subscribe_mark: string;
    payment: string;
  };

  type ResetTrafficOrderResponse = {
    order_no: string;
  };

  type Response = {
    /** 状态码 */
    code?: number;
    /** 消息 */
    msg?: string;
    /** 数据 */
    data?: Record<string, any>;
  };

  type StripePayment = {
    method: string;
    client_secret: string;
    publishable_key: string;
  };

  type SubscribeDetails = {
    id: number;
    name: string;
    description: string;
    unit_price: number;
    discount: UserSubscribeDiscount[];
    replacement: number;
    inventory: number;
    traffic: number;
    group_id: number;
    speed_limit: number;
    device_limit: number;
    quota: number;
    show: boolean;
    sell: boolean;
  };

  type SubscribeDiscountInfo = {
    months: number;
    discount: number;
  };

  type SubscribeInfo = {
    id: number;
    name: string;
    description: string;
    discount: string;
    unit_price: number;
    replacement: number;
    inventory: number;
    traffic: number;
    group_id: number;
    speed_limit: number;
    device_limit: number;
    quota: number;
    show: boolean;
    sell: boolean;
  };

  type SubscribeItem = {
    id: number;
    name: string;
    description: string;
    discount: string;
    unit_price: number;
    replacement: number;
    inventory: number;
    traffic: number;
    group_id: number;
    speed_limit: number;
    device_limit: number;
    quota: number;
    show: boolean;
    sell: boolean;
  };

  type UpdateUserNotifyRequest = {
    enable_balance_notify: boolean;
    enable_login_notify: boolean;
    enable_subscribe_notify: boolean;
    enable_trade_notify: boolean;
  };

  type UpdateUserNotifySettingRequet = {
    telegram: number;
    enable_email_notify: boolean;
    enable_telegram_notify: boolean;
  };

  type UpdateUserPasswordRequest = {
    password: string;
  };

  type UpdateUserTicketStatusRequest = {
    id: number;
    status: number;
  };

  type UserBalanceLog = {
    id: number;
    user_id: number;
    amount: number;
    type: number;
    order_id: number;
    balance: number;
    created_at: number;
  };

  type UserFollow = {
    id: number;
    ticket_id: number;
    from: string;
    type: number;
    content: string;
    created_at: number;
  };

  type UserInfo = {
    id: number;
    email: string;
    avatar: string;
    balance: number;
    telegram: number;
    refer_code: string;
    referer_id: number;
    enable: boolean;
    valid_email: boolean;
    enable_email_notify: boolean;
    enable_telegram_notify: boolean;
    enable_balance_notify: boolean;
    enable_login_notify: boolean;
    enable_subscribe_notify: boolean;
    enable_trade_notify: boolean;
    created_at: number;
    updated_at: number;
  };

  type UserSubscribe = {
    id: number;
    user_id: number;
    order_id: number;
    subscribe_id: number;
    subscribe: SubscribeItem;
    start_time: number;
    expire_time: number;
    traffic: number;
    download: number;
    upload: number;
    mark: string;
    status: number;
    created_at: number;
    updated_at: number;
  };

  type UserSubscribeDiscount = {
    months: number;
    discount: number;
  };

  type UserSubscribeGroupDetails = {
    id: number;
    name: string;
    description: string;
  };

  type UserTicket = {
    id: number;
    title: string;
    description: string;
    user_id: number;
    follow?: UserFollow[];
    status: number;
    created_at: number;
    updated_at: number;
  };
}
