export interface TokenPayload {
  id: number;
  username: string;
  roles: string[];
  iat: number;
  exp: number;
  typeToken: TokenType;
}

export enum TokenType {
  ACCESS_TOKEN = 'accessToken',
  REFRESH_TOKEN = 'refreshToken',
}
