export interface IUserDB {
  id: string;
  createdAt: string;
  email: string;
  isAdmin: boolean;
  isBlocked: boolean;
  isGoogle: false;
  name: string;
  role: string;
  premiumId?: boolean;
  premiumEndDate?: Date;
  updatedAt: string;
  avatar?: string;
}
