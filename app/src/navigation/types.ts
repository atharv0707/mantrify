import type { NavigatorScreenParams } from '@react-navigation/native';

export type TabParamList = {
  Today: undefined;
  Calendar: undefined;
  Explore: undefined;
  Favourites: undefined;
  Routine: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Main: NavigatorScreenParams<TabParamList>;
  PracticeGuide: { practiceId: string };
  Admin: undefined;
  AdminPracticeEdit: { practiceId?: string };
};

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  VerifyEmail: { email: string };
  ForgotPassword: { email?: string };
  ResetPassword: { email: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
