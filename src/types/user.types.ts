export interface IUser {
  accessToken: string;
  accountInfo: AccountInfo;
  sessionId: string;
}

interface AccountInfo {
  associatedShopIds: string[];
  avatarUrl: string;
  countryCode: string;
  email: string;
  id: string;
  lockedAt: string | null;
  name: string;
  orgId: string;
  password: string;
  phone: string;
  salt: string;
  type: string;
}
