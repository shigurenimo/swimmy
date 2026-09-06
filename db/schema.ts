import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core"

export const tokenTypeEnum = pgEnum("TokenType", ["RESET_PASSWORD"])

export const notificationTypeEnum = pgEnum("notification_type", [
  "FOLLOW",
  "FRIENDSHIP",
  "LIKE",
  "REPLY",
  "QUOTATION",
])

export const userRoleEnum = pgEnum("user_role", ["ADMIN", "SYSTEM", "USER"])

export const loginProviderEnum = pgEnum("login_provider", ["GOOGLE_COM", "PASSWORD"])

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    createdAt: timestamp("created_at", { precision: 3, mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { precision: 3, mode: "date" })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    name: text("name"),
    username: text("username").notNull(),
    role: userRoleEnum("role").notNull().default("USER"),
    email: text("email"),
    biography: text("biography").notNull().default(""),
    siteURL: text("site_url"),
    followeesCount: integer("followees_count").notNull().default(0),
    followersCount: integer("followers_count").notNull().default(0),
    headerFileId: text("header_file_id"),
    iconFileId: text("icon_file_id"),
    loginProvider: loginProviderEnum("login_provider").notNull(),
    fcmToken: text("fcm_token"),
    fcmTokenForMobile: text("fcm_token_for_mobile"),
    notificationEmail: text("notification_email"),
    protected: boolean("protected").notNull().default(false),
    discoverableByEmail: boolean("discoverable_by_email").notNull().default(true),
    subscribeMessage: boolean("subscribe_message").notNull().default(false),
    subscribePostLike: boolean("subscribe_post_like").notNull().default(false),
    subscribePostQuotation: boolean("subscribe_post_quotation").notNull().default(false),
  },
  (table) => [
    uniqueIndex("users_username_key").on(table.username),
    uniqueIndex("users_email_key").on(table.email),
    index("users_created_at_idx").on(table.createdAt),
  ],
)

export const friendships = pgTable(
  "friendships",
  {
    id: text("id").primaryKey(),
    createdAt: timestamp("created_at", { precision: 3, mode: "date" }).notNull().defaultNow(),
    followeeId: text("followee_id")
      .notNull()
      .references(() => users.id),
    followerId: text("follower_id")
      .notNull()
      .references(() => users.id),
  },
  (table) => [
    uniqueIndex("friendships_follower_id_followee_id_key").on(table.followerId, table.followeeId),
    index("friendships_follower_id_created_at_idx").on(table.followerId, table.createdAt),
  ],
)

export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    createdAt: timestamp("created_at", { precision: 3, mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { precision: 3, mode: "date" })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    antiCSRFToken: text("anti_csrf_token"),
    expiresAt: timestamp("expires_at", { precision: 3, mode: "date" }),
    handle: text("handle").notNull(),
    hashedSessionToken: text("hashed_session_token"),
    privateData: text("private_data"),
    publicData: text("public_data"),
    userId: text("user_id").references(() => users.id),
  },
  (table) => [uniqueIndex("sessions_handle_key").on(table.handle)],
)

export const posts = pgTable(
  "posts",
  {
    id: text("id").primaryKey(),
    createdAt: timestamp("created_at", { precision: 3, mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { precision: 3, mode: "date" })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    dateText: text("date_text").notNull(),
    fileIds: text("file_ids").array(),
    likesCount: integer("likes_count").notNull().default(0),
    quotationId: text("quotation_id"),
    quotationsCount: integer("quotations_count").notNull().default(0),
    repliesCount: integer("replies_count").notNull().default(0),
    replyId: text("reply_id"),
    text: text("text"),
    userId: text("user_id").references(() => users.id),
    isDeleted: boolean("is_deleted").default(false),
  },
  (table) => [
    uniqueIndex("posts_user_id_quotation_id_key").on(table.userId, table.quotationId),
    index("posts_created_at_idx").on(table.createdAt),
    index("posts_user_id_created_at_idx").on(table.userId, table.createdAt),
    index("posts_reply_id_created_at_idx").on(table.replyId, table.createdAt),
  ],
)

export const references = pgTable(
  "references",
  {
    createdAt: timestamp("created_at", { precision: 3, mode: "date" }).notNull().defaultNow(),
    isRead: boolean("is_read").notNull().default(false),
    postId: text("post_id")
      .notNull()
      .references(() => posts.id),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.postId] }),
    index("references_user_id_created_at_idx").on(table.userId, table.createdAt),
  ],
)

export const likes = pgTable(
  "likes",
  {
    id: text("id").primaryKey(),
    createdAt: timestamp("created_at", { precision: 3, mode: "date" }).notNull().defaultNow(),
    postId: text("post_id")
      .notNull()
      .references(() => posts.id),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
  },
  (table) => [
    uniqueIndex("likes_user_id_post_id_key").on(table.userId, table.postId),
    index("likes_user_id_created_at_idx").on(table.userId, table.createdAt),
  ],
)

export const reactions = pgTable(
  "reactions",
  {
    id: text("id").primaryKey(),
    createdAt: timestamp("created_at", { precision: 3, mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { precision: 3, mode: "date" }).notNull().defaultNow(),
    text: text("text").notNull(),
    postId: text("post_id")
      .notNull()
      .references(() => posts.id),
    count: integer("count").notNull().default(0),
  },
  (table) => [
    uniqueIndex("reactions_post_id_text_key").on(table.postId, table.text),
    index("reactions_post_id_idx").on(table.postId),
  ],
)

/**
 * Prismaの暗黙的多対多リレーション "user_reactions" の結合テーブル。A=reactions.id, B=users.id
 */
export const userReactions = pgTable(
  "_user_reactions",
  {
    reactionId: text("A")
      .notNull()
      .references(() => reactions.id),
    userId: text("B")
      .notNull()
      .references(() => users.id),
  },
  (table) => [uniqueIndex("_user_reactions_AB_unique").on(table.reactionId, table.userId)],
)

export const bookmarks = pgTable(
  "bookmarks",
  {
    createdAt: timestamp("created_at", { precision: 3, mode: "date" }).notNull().defaultNow(),
    postId: text("post_id")
      .notNull()
      .references(() => posts.id),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
  },
  (table) => [
    uniqueIndex("bookmarks_user_id_post_id_key").on(table.userId, table.postId),
    index("bookmarks_user_id_created_at_idx").on(table.userId, table.createdAt),
  ],
)

export const notifications = pgTable(
  "notifications",
  {
    id: text("id").primaryKey(),
    type: notificationTypeEnum("type").notNull(),
    uniqueId: text("unique_id").notNull(),
    createdAt: timestamp("created_at", { precision: 3, mode: "date" }).notNull().defaultNow(),
    friendshipId: text("friendship_id").references(() => friendships.id),
    isRead: boolean("is_read").notNull().default(false),
    likeId: text("like_id").references(() => likes.id),
    postId: text("post_id").references(() => posts.id),
    userId: text("user_id").references(() => users.id),
  },
  (table) => [
    uniqueIndex("notifications_user_id_type_unique_id_key").on(
      table.userId,
      table.type,
      table.uniqueId,
    ),
    index("notifications_user_id_created_at_idx").on(table.userId, table.createdAt),
  ],
)

export const tokens = pgTable(
  "tokens",
  {
    id: text("id").primaryKey(),
    createdAt: timestamp("created_at", { precision: 3, mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { precision: 3, mode: "date" })
      .notNull()
      .$onUpdate(() => new Date()),
    hashedToken: text("hashed_token").notNull(),
    type: tokenTypeEnum("type").notNull(),
    expiresAt: timestamp("expires_at", {
      precision: 3,
      mode: "date",
    }).notNull(),
    sentTo: text("sent_to").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
  },
  (table) => [uniqueIndex("tokens_hashed_token_type_key").on(table.hashedToken, table.type)],
)
