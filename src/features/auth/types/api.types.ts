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
