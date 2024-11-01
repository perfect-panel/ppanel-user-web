import { Elements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe, PaymentIntentResult } from '@stripe/stripe-js';
import { QRCodeCanvas } from 'qrcode.react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

interface StripePaymentProps {
  method: string;
  client_secret: string;
  publishable_key: string;
}

const StripePayment: React.FC<StripePaymentProps> = ({
  method,
  client_secret,
  publishable_key,
}) => {
  const stripePromise = useMemo(() => loadStripe(publishable_key), [publishable_key]);

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm method={method} client_secret={client_secret} />
    </Elements>
  );
};

const CheckoutForm: React.FC<Omit<StripePaymentProps, 'publishable_key'>> = ({
  client_secret,
  method,
}) => {
  const stripe = useStripe();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleError = useCallback((message: string) => {
    setErrorMessage(message);
    setIsSubmitted(false);
  }, []);

  const confirmPayment = useCallback(async (): Promise<PaymentIntentResult | null> => {
    if (!stripe) {
      handleError('Stripe.js is not loaded.');
      return null;
    }

    if (method === 'alipay') {
      return await stripe.confirmAlipayPayment(
        client_secret,
        { return_url: window.location.href },
        { handleActions: false },
      );
    }

    return await stripe.confirmWechatPayPayment(
      client_secret,
      {
        payment_method_options: { wechat_pay: { client: 'web' } },
      },
      { handleActions: false },
    );
  }, [client_secret, method, stripe, handleError]);

  const autoSubmit = useCallback(async () => {
    if (isSubmitted) return;

    setIsSubmitted(true);

    try {
      const result = await confirmPayment();
      if (!result) return;

      const { error, paymentIntent } = result;
      if (error) return handleError(error.message!);

      if (paymentIntent?.status === 'requires_action') {
        const nextAction = paymentIntent.next_action as any;
        const qrUrl =
          method === 'alipay'
            ? nextAction?.alipay_handle_redirect?.url
            : nextAction?.wechat_pay_display_qr_code?.image_url_svg;

        setQrCodeUrl(qrUrl || null);
      }
    } catch (error) {
      handleError('An unexpected error occurred');
    }
  }, [confirmPayment, isSubmitted, handleError, method]);

  useEffect(() => {
    autoSubmit();
  }, [autoSubmit]);

  return qrCodeUrl ? (
    <QRCodeCanvas
      value={qrCodeUrl}
      size={208}
      imageSettings={{
        src: `/payment/${method}.svg`,
        width: 48,
        height: 48,
        excavate: true,
      }}
    />
  ) : (
    errorMessage
  );
};

export default StripePayment;
