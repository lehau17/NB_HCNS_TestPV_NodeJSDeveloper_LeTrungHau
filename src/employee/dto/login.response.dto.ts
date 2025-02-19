import { users } from '@prisma/client';

export interface UserResponseDto {
  info: users;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}
