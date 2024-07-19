export const paths = {
  home: "/",
  auth: {
    signIn: "/auth/sign-in",
    signUp: "/auth/register",
    resetPassword: "/auth/reset-password",
  },
  dashboard: {
    overview: "/dashboard",
    devices: "/dashboard/devices",
    channels: "/dashboard/channels",
    account: "/dashboard/account",
    settings: "/dashboard/settings",
  },
  errors: { notFound: "/not-found" },
} as const;
