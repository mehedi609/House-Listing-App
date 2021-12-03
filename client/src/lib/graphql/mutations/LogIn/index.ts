import { gql } from '@apollo/client';

export const LOG_IN = gql`
  mutation LogIn($logInInput: LogInInput) {
    logIn(logInInput: $logInInput) {
      id
      token
      avatar
      hasWallet
      didRequest
    }
  }
`;
