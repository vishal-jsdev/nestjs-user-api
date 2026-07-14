// roles.enum.ts
export enum Role {
  User = 'user',
  Admin = 'admin',
  Editor = 'editor',
}

export interface JwtPayload {
  sub: number;
  email: string;
  role: Role;
}
