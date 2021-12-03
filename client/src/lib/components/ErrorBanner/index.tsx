import React from 'react';
import { Alert } from 'antd';

interface IErrorBannerProps {
  message?: string;
  description?: string;
}

export function ErrorBanner({
  message = 'Oh no! Something went wrong :(',
  description = 'Sorry, but something went wrong. Please check you connection and try again.',
}: IErrorBannerProps) {
  return (
    <Alert
      banner
      closable
      message={message}
      description={description}
      type="error"
      className="error-banner"
    />
  );
}
