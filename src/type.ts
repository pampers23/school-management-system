import { Role } from '../generated/prisma/enums';

export type JwtUser = {
  id: number;
  sub: string;
  username: string;
  role: Role;
  mustChangePassword: boolean;
  isActive: boolean;
};

export type JwtPayload = {
  sub: number;
  username: string;
  role: Role;
};
