ALTER TABLE "messages" DROP CONSTRAINT "messages_channel_id_channels_id_fk";
--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "username" text NOT NULL DEFAULT 'Emilien Chauvet';--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "user_avatar" text DEFAULT 'https://dashboard.clerk.com/_next/image?url=https%3A%2F%2Fimg.clerk.com%2FeyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18ycklIanIzSkVMQ0oxdlE1OUNMQ3RpRlY1ZkcifQ&w=64&q=75';--> statement-breakpoint
ALTER TABLE "messages" DROP COLUMN "updated_at";