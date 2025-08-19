import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';

const TurnstileWidget = forwardRef(({ onVerify, onError, onExpire, className, ...props }, ref) => {
  const turnstileRef = useRef();

  useImperativeHandle(ref, () => ({
    reset: () => {
      if (turnstileRef.current) {
        turnstileRef.current.reset();
      }
    },
    getResponse: () => {
      if (turnstileRef.current) {
        return turnstileRef.current.getResponse();
      }
      return null;
    }
  }));

  const handleVerify = (token) => {
    if (onVerify) {
      onVerify(token);
    }
  };

  const handleError = (error) => {
    console.error('Turnstile error:', error);
    if (onError) {
      onError(error);
    }
  };

  const handleExpire = () => {
    console.warn('Turnstile token expired');
    if (onExpire) {
      onExpire();
    }
  };

  return (
    <div className={className}>
      <Turnstile
        ref={turnstileRef}
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
        onSuccess={handleVerify}
        onError={handleError}
        onExpire={handleExpire}
        theme="auto"
        size="normal"
        {...props}
      />
    </div>
  );
});

TurnstileWidget.displayName = 'TurnstileWidget';

export default TurnstileWidget;