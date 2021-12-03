import { Card, Layout, Spin, Typography } from 'antd';
import { Redirect } from 'react-router-dom';

import googleLogo from './assests/google_logo.jpg';
import { IViewer } from '../../lib/types';
import { FC, useEffect, useRef } from 'react';
import { useApolloClient, useMutation } from '@apollo/client';
import { AUTH_URL } from '../../lib/graphql/queries';
import { AuthUrl as AuthUrlData } from '../../lib/graphql/queries/AuthUrl/__generated__/AuthUrl';
import { LOG_IN } from '../../lib/graphql/mutations';
import {
  LogIn as LogInData,
  LogInVariables,
} from '../../lib/graphql/mutations/LogIn/__generated__/LogIn';
import {
  displayErrorMessage,
  displaySuccessNotification,
} from '../../lib/utils';
import { ErrorBanner } from '../../lib/components';

const { Content } = Layout;
const { Text, Title } = Typography;

interface IProps {
  setViewer: (viewer: IViewer) => void;
}

export const Login: FC<IProps> = ({ setViewer }) => {
  const client = useApolloClient();

  // const {logIn, {data: logInData, loading: logInLoading, error: logInError}} = useMutation<LogInData, LogInVariables>(LOG_IN)
  const [logIn, { data: logInData, loading: logInLoading, error: logInError }] =
    useMutation<LogInData, LogInVariables>(LOG_IN, {
      onCompleted: (data) => {
        if (data && data.logIn) {
          setViewer(data.logIn);
          displaySuccessNotification("You've successfully logged in!");
        }
      },
    });

  const logInRef = useRef(logIn);

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get('code');
    if (code) {
      logInRef.current({
        variables: {
          logInInput: { code },
        },
      });
    }
  }, []);

  const handleAuthorize = async () => {
    try {
      const { data } = await client.query<AuthUrlData>({
        query: AUTH_URL,
      });
      if (data) {
        window.location.href = data.authUrl;
      }
    } catch (e) {
      displayErrorMessage(
        "Sorry! We weren't able to log you in. Please try again later!",
      );
    }
  };

  if (logInLoading) {
    return (
      <Content className="log-in">
        <Spin size="large" tip="Logging you in..." />
      </Content>
    );
  }

  if (logInData && logInData?.logIn) {
    const { id: viewerId } = logInData.logIn;
    return <Redirect to={`/user/${viewerId}`} />;
  }

  const logInErrorBanner = logInError ? (
    <ErrorBanner description="Sorry! We weren't able to log you in. Please try again later!" />
  ) : null;

  return (
    <Content className="log-in">
      {logInErrorBanner}
      <Card className="log-in-card">
        <div>
          <Title level={3} className="log-in-card__intro-title">
            <span role="img" aria-label="wave">
              👋
            </span>
          </Title>
          <Title level={3} className="log-in-card__intro-title">
            Log in to TinyHouse!
          </Title>
          <Text>Sign in with Google to book available rentals!</Text>
        </div>
        <button
          className="log-in-card__google-button"
          onClick={handleAuthorize}
        >
          <img
            alt="Google logo"
            className="log-in-card__google-button-logo"
            src={googleLogo}
          />
          <span className="log-in-card__google-button-text">
            Sign in with Google!
          </span>
        </button>
        <Text type="secondary">
          Note: By signing in, you'll be redirected to the Google consent form
          to sign in with your Google.
        </Text>
      </Card>
    </Content>
  );
};
