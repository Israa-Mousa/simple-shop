import { UserRole } from 'generated/prisma';

export type JSON_Web_Token_Payload = {
  sub: bigint;
  role: UserRole;
};