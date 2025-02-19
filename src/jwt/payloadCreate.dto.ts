import { TokenType } from '@app/common';

export interface TokenPayloadCreateDto {
  id: number;
  email: string;
  roles: string[];
  typeToken: TokenType;
}
