export enum EUserStatus {
  PENDING = "pending",
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export enum EUserRole {
  MANAGER = "manager",
  EMPLOYEE = "employee",
  ANY = "any",
}

export type TUser = {
  phoneNumber: string;
  fullName: string;
  email: string;
  password: string;
  username: string;
  role: EUserRole;
  status: EUserStatus;
  token: string;
  id: string;
};
