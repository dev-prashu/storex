import { AdapterAccountType } from "@auth/core/adapters";
import { date, pgEnum, uuid, varchar } from "drizzle-orm/pg-core";
import {
  boolean,
  timestamp,
  pgTable,
  text,
  numeric,
  primaryKey,
  integer,
} from "drizzle-orm/pg-core";

export const employeeStatusEnum = pgEnum("employee_status", [
  "active",
  "deleted",
  "not an employee",
]);

export const employeeTypeEnum = pgEnum("employee_type", [
  "employee",
  "fresher",
  "intern",
  "freelancer",
]);

export const employeeAssetStatusEnum = pgEnum("employee_asset_status", [
  "assigned",
  "unassigned",
]);

export const assetTypeEnum = pgEnum("asset_type", [
  "laptop",
  "monitor",
  "hardisk",
  "pendrive",
  "mobile",
  "sim",
  "ram",
  "accessories",
]);

export const ownedByEnum = pgEnum("owned_by", ["remotestate", "client"]);

export const assetStatusEnum = pgEnum("asset_status", [
  "available",
  "assigned",
  "deleted",
  "service",
]);

export const accessoryTypeEnum = pgEnum("accessory_type", [
  "cable",
  "keyboard",
  "mouse",
  "other",
]);


export const users = pgTable("users", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("userId") // changed from text -> uuid
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
);

export const sessions = pgTable("sessions", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: uuid("userId") // changed from text -> uuid
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationTokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ]
);

export const authorizedUsers = pgTable("authorized_users", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  addedById: uuid("added_by").references(()=>users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"),
  deletedById: uuid("deleted_by").references(()=>users.id),
});

// export const authorizedUserRelations = relations(
//   authorizedUsers,
//   ({ one }) => ({
//     addedBy: one(authorizedUsers, {
//       fields: [authorizedUsers.addedById],
//       references: [authorizedUsers.id],
//     }),
//     deletedBy: one(authorizedUsers, {
//       fields: [authorizedUsers.deletedById],
//       references: [authorizedUsers.id],
//     }),
//   })
// );

export const employees = pgTable("employees", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: varchar("phone_no",{length: 15}).notNull(),
  status: employeeStatusEnum("status").notNull().default("active"),
  employeeType: employeeTypeEnum("employee_type").notNull().default("fresher"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  createdById: uuid("created_by_id").references(() => users.id),
  assetStatus: employeeAssetStatusEnum("asset_status").notNull().default("unassigned"),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
  deletedById: uuid("deleted_by_id").references(() => users.id),
  deleteReason: text("delete_reason"),
});

export const assets = pgTable("assets", {
  id: uuid("id").primaryKey().defaultRandom(),
  brand: text("brand"),
  model: text("model"),
  serial: text("serial_no"),
  type: assetTypeEnum("type").notNull(),
  status: assetStatusEnum("status").notNull().default("available"),
  purchaseDate: date("purchase_date").notNull(),
  warrantyStartDate: date("warranty_start_date"),
  warrantyExpiryDate: date("warranty_expiry_date"),
  isAvailable: boolean("is_available"),
  ownedBy: ownedByEnum("owned_by").default("remotestate"),
  clientName: text("client_name"),
  assetPic: text("asset_pic"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  createdBy: uuid("created_by").references(() => users.id),
  updatedAt: timestamp("updated_at"),
  deletedAt: timestamp("deleted_at"),
  deletedBy: uuid("deleted_by").references(() => users.id),
  deleteReason: text("delete_reason"),
});

export const assetAssignment = pgTable("asset_assignment", {
  id: uuid("id").primaryKey().defaultRandom(),
  assetId: uuid("asset_id")
    .notNull()
    .references(() => assets.id).unique(),
  employeeId: uuid("employee_id").references(() => employees.id),
  assignedById: uuid("assigned_by_id").references(() => users.id),
  assignedOn: date("assigned_date"),
  returnedOn: date("returned_on"),
  returnReason: text("return_reason"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export const assetService = pgTable("asset_service", {
  id: uuid("id").primaryKey().defaultRandom(),
  assetId: uuid("asset_id")
    .notNull()
    .references(() => assets.id).unique(),
  sentBy: uuid("sent_by").references(() => users.id),
  serviceReason: text("service_reason"),
  sentOn: timestamp("sent_on"),
  receivedOn: timestamp("received_on"),
  servicePrice: numeric("service_price"),
  remark: text("remark"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
  deletedAt: timestamp("deleted_at"),
});

export const hardDiskSpecs = pgTable("hard_disk_specifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  assetId: uuid("asset_id")
    .notNull()
    .references(() => assets.id).unique(),
  storage: text("storage"),
  type: text("type"),
});

export const laptopSpecs = pgTable("laptop_specifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  assetId: uuid("asset_id")
    .notNull()
    .references(() => assets.id).unique(),
  series: text("series"),
  processor: text("processor"),
  ram: text("ram"),
  os: text("operating_system"),
  screenRes: text("screen_resolution"),
  storage: text("storage"),
  charger: boolean("charger"),
});

export const mobileSpecs = pgTable("mobile_specifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  assetId: uuid("asset_id")
    .notNull()
    .references(() => assets.id).unique(),
  osType: text("os_type"),
  imei1: text("imei_1"),
  imei2: text("imei_2"),
  imei3: text("imei_3"),
});

export const monitorSpecs = pgTable("monitor_specifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  assetId: uuid("asset_id")
    .notNull()
    .references(() => assets.id).unique(),
  screenRes: text("screen_resolution"),
});

export const pendriveSpecs = pgTable("pendrive_specifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  assetId: uuid("asset_id")
    .notNull()
    .references(() => assets.id).unique(),
  storage: text("storage"),
});

export const simSpecs = pgTable("sim_specifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  assetId: uuid("asset_id")
    .notNull()
    .references(() => assets.id).unique(),
  simno: text("simno"),
  phone: numeric("phone_no", { precision: 10, scale: 0 }).notNull(),
});

export const accessoriesSpecs = pgTable("accessories_specifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  assetId: uuid("asset_id")
    .notNull()
    .references(() => assets.id).unique(),
  type: accessoryTypeEnum("type").default("other"),
  remark: text("remark"),
});

export const ramSpecs = pgTable("ram_specifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  assetId: uuid("asset_id")
    .notNull()
    .references(() => assets.id).unique(),
  capacity: text("capacity"),
  remark: text("remark"),
});
