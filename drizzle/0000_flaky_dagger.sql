CREATE TYPE "public"."accessory_type" AS ENUM('cable', 'keyboard', 'mouse', 'other');--> statement-breakpoint
CREATE TYPE "public"."asset_status" AS ENUM('available', 'assigned', 'deleted', 'service');--> statement-breakpoint
CREATE TYPE "public"."asset_type" AS ENUM('laptop', 'monitor', 'hardisk', 'pendrive', 'mobile', 'sim', 'ram', 'accessories');--> statement-breakpoint
CREATE TYPE "public"."employee_asset_status" AS ENUM('assigned', 'unassigned');--> statement-breakpoint
CREATE TYPE "public"."employee_status" AS ENUM('active', 'deleted', 'not an employee');--> statement-breakpoint
CREATE TYPE "public"."employee_type" AS ENUM('employee', 'fresher', 'intern', 'freelancer');--> statement-breakpoint
CREATE TYPE "public"."owned_by" AS ENUM('remotestate', 'client');--> statement-breakpoint
CREATE TABLE "accessories_specifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"asset_id" uuid NOT NULL,
	"type" "accessory_type" DEFAULT 'other',
	"remark" text
);
--> statement-breakpoint
CREATE TABLE "accounts" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text
);
--> statement-breakpoint
CREATE TABLE "asset_assignment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"asset_id" uuid NOT NULL,
	"employee_id" uuid,
	"assigned_by_id" uuid,
	"assigned_date" date,
	"returned_on" date,
	"return_reason" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "asset_service" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"asset_id" uuid NOT NULL,
	"sent_by" uuid,
	"service_reason" text,
	"sent_on" timestamp,
	"received_on" timestamp,
	"service_price" numeric,
	"remark" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand" text,
	"model" text,
	"serial_no" text,
	"type" "asset_type" NOT NULL,
	"status" "asset_status" DEFAULT 'available' NOT NULL,
	"purchase_date" date NOT NULL,
	"warranty_start_date" date,
	"warranty_expiry_date" date,
	"is_available" boolean,
	"owned_by" "owned_by" DEFAULT 'remotestate',
	"client_name" text,
	"asset_pic" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_at" timestamp,
	"deleted_at" timestamp,
	"deleted_by" uuid,
	"delete_reason" text
);
--> statement-breakpoint
CREATE TABLE "authorized_users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"added_by_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"deleted_by_id" uuid,
	CONSTRAINT "authorized_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "employees" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone_no" numeric NOT NULL,
	"status" "employee_status" DEFAULT 'active' NOT NULL,
	"employee_type" "employee_type" DEFAULT 'fresher' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by_id" uuid,
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"deleted_by_id" uuid,
	"delete_reason" text,
	CONSTRAINT "employees_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "hard_disk_specifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"asset_id" uuid NOT NULL,
	"storage" text,
	"type" text
);
--> statement-breakpoint
CREATE TABLE "laptop_specifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"asset_id" uuid NOT NULL,
	"series" text,
	"processor" text,
	"ram" text,
	"operating_system" text,
	"screen_resolution" text,
	"storage" text,
	"charger" boolean
);
--> statement-breakpoint
CREATE TABLE "mobile_specifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"asset_id" uuid NOT NULL,
	"os_type" text,
	"imei_1" text,
	"imei_2" text,
	"imei_3" text
);
--> statement-breakpoint
CREATE TABLE "monitor_specifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"asset_id" uuid NOT NULL,
	"screen_resolution" text
);
--> statement-breakpoint
CREATE TABLE "pendrive_specifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"asset_id" uuid NOT NULL,
	"storage" text
);
--> statement-breakpoint
CREATE TABLE "ram_specifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"asset_id" uuid NOT NULL,
	"capacity" text,
	"remark" text
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sim_specifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"asset_id" uuid NOT NULL,
	"simno" text,
	"phone_no" numeric(10, 0) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"emailVerified" timestamp,
	"image" text,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verificationTokens" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accessories_specifications" ADD CONSTRAINT "accessories_specifications_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset_assignment" ADD CONSTRAINT "asset_assignment_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset_assignment" ADD CONSTRAINT "asset_assignment_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset_assignment" ADD CONSTRAINT "asset_assignment_assigned_by_id_authorized_users_id_fk" FOREIGN KEY ("assigned_by_id") REFERENCES "public"."authorized_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset_service" ADD CONSTRAINT "asset_service_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset_service" ADD CONSTRAINT "asset_service_sent_by_authorized_users_id_fk" FOREIGN KEY ("sent_by") REFERENCES "public"."authorized_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_created_by_authorized_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."authorized_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_deleted_by_authorized_users_id_fk" FOREIGN KEY ("deleted_by") REFERENCES "public"."authorized_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employees" ADD CONSTRAINT "employees_created_by_id_authorized_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."authorized_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employees" ADD CONSTRAINT "employees_deleted_by_id_authorized_users_id_fk" FOREIGN KEY ("deleted_by_id") REFERENCES "public"."authorized_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hard_disk_specifications" ADD CONSTRAINT "hard_disk_specifications_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "laptop_specifications" ADD CONSTRAINT "laptop_specifications_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mobile_specifications" ADD CONSTRAINT "mobile_specifications_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monitor_specifications" ADD CONSTRAINT "monitor_specifications_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pendrive_specifications" ADD CONSTRAINT "pendrive_specifications_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ram_specifications" ADD CONSTRAINT "ram_specifications_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sim_specifications" ADD CONSTRAINT "sim_specifications_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;