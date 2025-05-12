export type EmployeeType = "employee" | "fresher" | "intern" | "freelancer";
export type EmployeeStatus = "active" | "deleted" | "not an employee";
export type EmployeeAssetStatus = "assigned" | "unassigned";

export interface AuthorizeUser {
  id: string;
  email: string;
  adddedById: string;
  count:string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  deletedBy: string | null;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: EmployeeType;
  status: EmployeeStatus;
  assetStatus: EmployeeAssetStatus;
  deletedAt: string;
  createdAt: string;
  updatedAt: string;
  deleteReason: string;
}
