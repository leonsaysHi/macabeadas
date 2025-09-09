export type UserId = string;
export type UserRole = 'editor';
export interface User {
  id?: UserId;
  email: string;
  role: UserRole;
}
