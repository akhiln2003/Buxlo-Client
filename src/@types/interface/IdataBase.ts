export interface IuserDB {
  id: string,
  createdAt: string;
  email: string;
  isAdmin: boolean;
  isBlocked: boolean;
  isGoogle: false;
  name: string,
  role: string,
  updatedAt: string;
  avatar?: string;
}
