export type AppLoginResponse = {
  data: {
    accessToken: string;
    refreshToken: string;
    userId: number;
    isNewUser: boolean;
  };
  message: string;
  timestamp: string;
};

export type EmailLoginResponse = {
  tokenType: string;
  accessToken: string;
  refreshToken: string;
  expiresInMillis: number;
  userId: number;
  email: string;
  isNewUser: boolean;
};
