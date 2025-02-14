import { pgTable, serial, text, timestamp, integer, primaryKey } from 'drizzle-orm/pg-core';

export const channels = pgTable('channels', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  channelId: integer('channel_id').notNull(),
  userId: text('user_id').notNull(),
  username: text('username').notNull(),
  userAvatar: text('user_avatar'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const reactions = pgTable('reactions', {
  id: serial('id').primaryKey(),
  messageId: integer('message_id').notNull().references(() => messages.id),
  userId: text('user_id').notNull(),
  emoji: text('emoji').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});