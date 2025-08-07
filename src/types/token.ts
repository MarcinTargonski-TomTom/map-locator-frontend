export type TokenData = {
  sub: string;
  accountRoles: Role[];
  exp: number;
  lang: string;
};

export const Role = {
  TENANT: "TENANT",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const TokenType = {
  AUTH: "auth_token",
  REFRESH: "refresh_token",
} as const;

export type TokenType = (typeof TokenType)[keyof typeof TokenType];
