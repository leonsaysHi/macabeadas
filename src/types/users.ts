export type UserRole = 'editor';
export interface User {
  id?: string;
  email: string;
  role: UserRole;
}
