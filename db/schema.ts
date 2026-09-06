import { sql } from "drizzle-orm"
import {
  type AnySQLiteColumn,
  check,
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core"

export const userReactions = sqliteTable(
  "_user_reactions",
  {
    reactionId: text("A")
      .notNull()
      .references((): AnySQLiteColumn => reactions.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    userId: text("B")
      .notNull()
      .references((): AnySQLiteColumn => users.id, { onUpdate: "cascade", onDelete: "cascade" }),
  },
  (table) => [
    uniqueIndex("_user_reactions_AB_unique").on(table.reactionId, table.userId),
    index("_user_reactions_B_index").on(table.userId),
  ],
)

export const bookmarks = sqliteTable(
  "bookmarks",
  {
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(CAST(unixepoch('subsec') * 1000 AS INTEGER))`),
    postId: text("post_id")
      .notNull()
      .references((): AnySQLiteColumn => posts.id, { onUpdate: "cascade", onDelete: "restrict" }),
    userId: text("user_id")
      .notNull()
      .references((): AnySQLiteColumn => users.id, { onUpdate: "cascade", onDelete: "restrict" }),
  },
  (table) => [
    index("bookmarks_user_id_created_at_idx").on(table.userId, table.createdAt),
    uniqueIndex("bookmarks_user_id_post_id_key").on(table.userId, table.postId),
  ],
)

export const friendships = sqliteTable(
  "friendships",
  {
    id: text("id").notNull().primaryKey(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(CAST(unixepoch('subsec') * 1000 AS INTEGER))`),
    followeeId: text("followee_id")
      .notNull()
      .references((): AnySQLiteColumn => users.id, { onUpdate: "cascade", onDelete: "restrict" }),
    followerId: text("follower_id")
      .notNull()
      .references((): AnySQLiteColumn => users.id, { onUpdate: "cascade", onDelete: "restrict" }),
  },
  (table) => [
    index("friendships_follower_id_created_at_idx").on(table.followerId, table.createdAt),
    uniqueIndex("friendships_follower_id_followee_id_key").on(table.followerId, table.followeeId),
  ],
)

export const likes = sqliteTable(
  "likes",
  {
    id: text("id").notNull().primaryKey(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(CAST(unixepoch('subsec') * 1000 AS INTEGER))`),
    postId: text("post_id")
      .notNull()
      .references((): AnySQLiteColumn => posts.id, { onUpdate: "cascade", onDelete: "restrict" }),
    userId: text("user_id")
      .notNull()
      .references((): AnySQLiteColumn => users.id, { onUpdate: "cascade", onDelete: "restrict" }),
  },
  (table) => [
    index("likes_user_id_created_at_idx").on(table.userId, table.createdAt),
    uniqueIndex("likes_user_id_post_id_key").on(table.userId, table.postId),
  ],
)

export const notifications = sqliteTable(
  "notifications",
  {
    id: text("id").notNull().primaryKey(),
    type: text("type", { enum: ["FOLLOW", "FRIENDSHIP", "LIKE", "REPLY", "QUOTATION"] }).notNull(),
    uniqueId: text("unique_id").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(CAST(unixepoch('subsec') * 1000 AS INTEGER))`),
    friendshipId: text("friendship_id").references((): AnySQLiteColumn => friendships.id, {
      onUpdate: "cascade",
      onDelete: "set null",
    }),
    isRead: integer("is_read", { mode: "boolean" }).notNull().default(false),
    likeId: text("like_id").references((): AnySQLiteColumn => likes.id, {
      onUpdate: "cascade",
      onDelete: "set null",
    }),
    postId: text("post_id").references((): AnySQLiteColumn => posts.id, {
      onUpdate: "cascade",
      onDelete: "set null",
    }),
    userId: text("user_id").references((): AnySQLiteColumn => users.id, {
      onUpdate: "cascade",
      onDelete: "set null",
    }),
  },
  (table) => [
    index("notifications_user_id_created_at_idx").on(table.userId, table.createdAt),
    uniqueIndex("notifications_user_id_type_unique_id_key").on(
      table.userId,
      table.type,
      table.uniqueId,
    ),
    check(
      "notifications_type_check",
      sql`${table.type} IN ('FOLLOW', 'FRIENDSHIP', 'LIKE', 'REPLY', 'QUOTATION')`,
    ),
    check("notifications_is_read_check", sql`${table.isRead} IN (0, 1)`),
  ],
)

export const posts = sqliteTable(
  "posts",
  {
    id: text("id").notNull().primaryKey(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(CAST(unixepoch('subsec') * 1000 AS INTEGER))`),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(CAST(unixepoch('subsec') * 1000 AS INTEGER))`)
      .$onUpdate(() => new Date()),
    dateText: text("date_text").notNull(),
    fileIds: text("file_ids", { mode: "json" }).$type<string[]>(),
    likesCount: integer("likes_count").notNull().default(0),
    quotationId: text("quotation_id").references((): AnySQLiteColumn => posts.id, {
      onUpdate: "cascade",
      onDelete: "set null",
    }),
    quotationsCount: integer("quotations_count").notNull().default(0),
    repliesCount: integer("replies_count").notNull().default(0),
    replyId: text("reply_id").references((): AnySQLiteColumn => posts.id, {
      onUpdate: "cascade",
      onDelete: "set null",
    }),
    text: text("text"),
    userId: text("user_id").references((): AnySQLiteColumn => users.id, {
      onUpdate: "cascade",
      onDelete: "set null",
    }),
    isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
  },
  (table) => [
    index("posts_created_at_idx").on(table.createdAt),
    index("posts_reply_id_created_at_idx").on(table.replyId, table.createdAt),
    index("posts_user_id_created_at_idx").on(table.userId, table.createdAt),
    uniqueIndex("posts_user_id_quotation_id_key").on(table.userId, table.quotationId),
    check(
      "posts_file_ids_check",
      sql`${table.fileIds} IS NULL OR (json_valid(${table.fileIds}) AND json_type(${table.fileIds}) = 'array')`,
    ),
    check("posts_is_deleted_check", sql`${table.isDeleted} IN (0, 1)`),
  ],
)

export const reactions = sqliteTable(
  "reactions",
  {
    id: text("id").notNull().primaryKey(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(CAST(unixepoch('subsec') * 1000 AS INTEGER))`),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(CAST(unixepoch('subsec') * 1000 AS INTEGER))`),
    text: text("text").notNull(),
    postId: text("post_id")
      .notNull()
      .references((): AnySQLiteColumn => posts.id, { onUpdate: "cascade", onDelete: "restrict" }),
    count: integer("count").notNull().default(0),
  },
  (table) => [
    index("reactions_post_id_idx").on(table.postId),
    uniqueIndex("reactions_post_id_text_key").on(table.postId, table.text),
  ],
)

export const references = sqliteTable(
  "references",
  {
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(CAST(unixepoch('subsec') * 1000 AS INTEGER))`),
    isRead: integer("is_read", { mode: "boolean" }).notNull().default(false),
    postId: text("post_id")
      .notNull()
      .references((): AnySQLiteColumn => posts.id, { onUpdate: "cascade", onDelete: "restrict" }),
    userId: text("user_id")
      .notNull()
      .references((): AnySQLiteColumn => users.id, { onUpdate: "cascade", onDelete: "restrict" }),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.postId] }),
    index("references_user_id_created_at_idx").on(table.userId, table.createdAt),
    check("references_is_read_check", sql`${table.isRead} IN (0, 1)`),
  ],
)

export const sessions = sqliteTable(
  "sessions",
  {
    id: text("id").notNull().primaryKey(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(CAST(unixepoch('subsec') * 1000 AS INTEGER))`),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(CAST(unixepoch('subsec') * 1000 AS INTEGER))`)
      .$onUpdate(() => new Date()),
    antiCSRFToken: text("anti_csrf_token"),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }),
    handle: text("handle").notNull(),
    hashedSessionToken: text("hashed_session_token"),
    privateData: text("private_data"),
    publicData: text("public_data"),
    userId: text("user_id").references((): AnySQLiteColumn => users.id, {
      onUpdate: "cascade",
      onDelete: "set null",
    }),
  },
  (table) => [uniqueIndex("sessions_handle_key").on(table.handle)],
)

export const tokens = sqliteTable(
  "tokens",
  {
    id: text("id").notNull().primaryKey(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(CAST(unixepoch('subsec') * 1000 AS INTEGER))`),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .notNull()
      .$onUpdate(() => new Date()),
    hashedToken: text("hashed_token").notNull(),
    type: text("type", { enum: ["RESET_PASSWORD"] }).notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    sentTo: text("sent_to").notNull(),
    userId: text("user_id")
      .notNull()
      .references((): AnySQLiteColumn => users.id, { onUpdate: "cascade", onDelete: "restrict" }),
  },
  (table) => [
    uniqueIndex("tokens_hashed_token_type_key").on(table.hashedToken, table.type),
    check("tokens_type_check", sql`${table.type} IN ('RESET_PASSWORD')`),
  ],
)

export const users = sqliteTable(
  "users",
  {
    id: text("id").notNull().primaryKey(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(CAST(unixepoch('subsec') * 1000 AS INTEGER))`),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(CAST(unixepoch('subsec') * 1000 AS INTEGER))`)
      .$onUpdate(() => new Date()),
    name: text("name"),
    username: text("username").notNull(),
    role: text("role", { enum: ["ADMIN", "SYSTEM", "USER"] })
      .notNull()
      .default("USER"),
    email: text("email"),
    biography: text("biography").notNull().default(""),
    siteURL: text("site_url"),
    followeesCount: integer("followees_count").notNull().default(0),
    followersCount: integer("followers_count").notNull().default(0),
    headerFileId: text("header_file_id"),
    iconFileId: text("icon_file_id"),
    loginProvider: text("login_provider", { enum: ["GOOGLE_COM", "PASSWORD"] }).notNull(),
    fcmToken: text("fcm_token"),
    fcmTokenForMobile: text("fcm_token_for_mobile"),
    notificationEmail: text("notification_email"),
    protected: integer("protected", { mode: "boolean" }).notNull().default(false),
    discoverableByEmail: integer("discoverable_by_email", { mode: "boolean" })
      .notNull()
      .default(true),
    subscribeMessage: integer("subscribe_message", { mode: "boolean" }).notNull().default(false),
    subscribePostLike: integer("subscribe_post_like", { mode: "boolean" }).notNull().default(false),
    subscribePostQuotation: integer("subscribe_post_quotation", { mode: "boolean" })
      .notNull()
      .default(false),
  },
  (table) => [
    index("users_created_at_idx").on(table.createdAt),
    uniqueIndex("users_email_key").on(table.email),
    uniqueIndex("users_username_key").on(table.username),
    check("users_role_check", sql`${table.role} IN ('ADMIN', 'SYSTEM', 'USER')`),
    check("users_login_provider_check", sql`${table.loginProvider} IN ('GOOGLE_COM', 'PASSWORD')`),
    check("users_protected_check", sql`${table.protected} IN (0, 1)`),
    check("users_discoverable_by_email_check", sql`${table.discoverableByEmail} IN (0, 1)`),
    check("users_subscribe_message_check", sql`${table.subscribeMessage} IN (0, 1)`),
    check("users_subscribe_post_like_check", sql`${table.subscribePostLike} IN (0, 1)`),
    check("users_subscribe_post_quotation_check", sql`${table.subscribePostQuotation} IN (0, 1)`),
  ],
)
