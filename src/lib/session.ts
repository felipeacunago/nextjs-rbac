import type { SessionOptions } from 'iron-session';

export interface UserProtectedData {
  role: string;
  organizationId: string | null;
}

export interface SessionData {
  user?: UserProtectedData;
}

export const sessionOptions: SessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD || 'complex_password_at_least_32_characters_long',
  cookieName: 'rbac-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  },
};

// Extending the built-in session type
declare module 'iron-session' {
  interface IronSessionData extends SessionData {
    lastLogin?: Date;
  }
}
