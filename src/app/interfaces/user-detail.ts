export interface UserDetail {
  id: string;
  email: string;
  fullName: string;
  roles: string[];
  phoneNumber: string;
  twoFactorEnabled: boolean;
  phoneNumberConfirmed: boolean;
  accessFailedCount: number;
}