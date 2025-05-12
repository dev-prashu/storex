export type AssetType =
  | "accessories"
  | "laptop"
  | "monitor"
  | "hardisk"
  | "pendrive"
  | "ram"
  | "sim"
  | "mobile";
export type AssetStatus = "available" | "assigned" | "deleted" | "service";

export type AccesoryType = "mouse" | "cable" | "keyboard" | "other";
export interface BaseAsset {
  id: string;
  brand: string;
  model: string;
  serial: string;
  type: AssetType;
  status: AssetStatus;
  purchaseDate: string;
  warrantyStartDate: string;
  isAvailable: boolean;
  ownedBy: string;
  clientName: string | null;
  assetPic: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
  deleteReason: string | null;
}

export interface HardiskSpecs {
  id: string;
  assetId: string;
  storage: string;
  type: string;
}
export interface LaptopSpecs {
  id: string;
  assetId: string;
  series: string;
  processor: string;
  ram: string;
  os: string;
  screenRes: string;
  storage: string;
  charger: boolean;
}

export interface MobileSpecs {
  id: string;
  assetId: string;
  osType: string;
  imei1: string;
  imei2: string;
  imei3: string;
}

export interface MonitorSpecs {
  id: string;
  assetId: string;
  screenRes: string;
}

export interface PendriveSpecs {
  id: string;
  assetId: string;
  storage: string;
}

export interface SimSpecs {
  id: string;
  assetId: string;
  simno: string;
  phone: string;
}
export interface RamSpecs {
  id: string;
  assetId: string;
  capacity: string;
  remark: string;
}

export interface AccessoriesSpecs {
  id: string;
  assetId: string;
  type: AccesoryType;
  remark: string;
}

export type HardDiskAsset = BaseAsset & {
  type: "hardisk";
  specifications: HardiskSpecs;
};
export type LaptopAsset = BaseAsset & {
  type: "laptop";
  specifications: LaptopSpecs;
};
export type MobileAsset = BaseAsset & {
  type: "mobile";
  specifications: MobileSpecs;
};
export type MonitorAsset = BaseAsset & {
  type: "monitor";
  specifications: MonitorSpecs;
};
export type PendriveAsset = BaseAsset & {
  type: "pendrive";
  specifications: PendriveSpecs;
};
export type SimAsset = BaseAsset & { type: "sim"; specifications: SimSpecs };
export type RamAsset = BaseAsset & { type: "ram"; specifications: RamSpecs };
export type AccessoryAsset = BaseAsset & {
  type: "accessories";
  specifications: AccessoriesSpecs;
};

export type Asset =
  | HardDiskAsset
  | LaptopAsset
  | MobileAsset
  | MonitorAsset
  | PendriveAsset
  | SimAsset
  | RamAsset
  | AccessoryAsset;
