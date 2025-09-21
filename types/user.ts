export enum EUserStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum EUserRole {
  MANAGER = "MANAGER",
  EMPLOYEE = "EMPLOYEE",
}

export type TUser = {
  phoneNumber: string;
  fullName: string;
  email: string;
  password: string;
  role: EUserRole;
  status: EUserStatus;
  token: string;
  id: string;
};
