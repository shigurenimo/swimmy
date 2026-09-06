CREATE TABLE "_user_reactions" (
  "A" TEXT NOT NULL,
  "B" TEXT NOT NULL,
  FOREIGN KEY ("A") REFERENCES "reactions" ("id") ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY ("B") REFERENCES "users" ("id") ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE "bookmarks" (
  "created_at" INTEGER NOT NULL DEFAULT (CAST(unixepoch('subsec') * 1000 AS INTEGER)),
  "post_id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  FOREIGN KEY ("post_id") REFERENCES "posts" ("id") ON UPDATE CASCADE ON DELETE RESTRICT,
  FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE "friendships" (
  "id" TEXT NOT NULL,
  "created_at" INTEGER NOT NULL DEFAULT (CAST(unixepoch('subsec') * 1000 AS INTEGER)),
  "followee_id" TEXT NOT NULL,
  "follower_id" TEXT NOT NULL,
  FOREIGN KEY ("followee_id") REFERENCES "users" ("id") ON UPDATE CASCADE ON DELETE RESTRICT,
  FOREIGN KEY ("follower_id") REFERENCES "users" ("id") ON UPDATE CASCADE ON DELETE RESTRICT,
  PRIMARY KEY ("id")
);

CREATE TABLE "likes" (
  "id" TEXT NOT NULL,
  "created_at" INTEGER NOT NULL DEFAULT (CAST(unixepoch('subsec') * 1000 AS INTEGER)),
  "post_id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  PRIMARY KEY ("id"),
  FOREIGN KEY ("post_id") REFERENCES "posts" ("id") ON UPDATE CASCADE ON DELETE RESTRICT,
  FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE "notifications" (
  "id" TEXT NOT NULL,
  "type" TEXT NOT NULL CHECK ("type" IN ('FOLLOW', 'FRIENDSHIP', 'LIKE', 'REPLY', 'QUOTATION')),
  "unique_id" TEXT NOT NULL,
  "created_at" INTEGER NOT NULL DEFAULT (CAST(unixepoch('subsec') * 1000 AS INTEGER)),
  "friendship_id" TEXT,
  "is_read" INTEGER NOT NULL DEFAULT 0 CHECK ("is_read" IN (0, 1)),
  "like_id" TEXT,
  "post_id" TEXT,
  "user_id" TEXT,
  FOREIGN KEY ("friendship_id") REFERENCES "friendships" ("id") ON UPDATE CASCADE ON DELETE SET NULL,
  FOREIGN KEY ("like_id") REFERENCES "likes" ("id") ON UPDATE CASCADE ON DELETE SET NULL,
  PRIMARY KEY ("id"),
  FOREIGN KEY ("post_id") REFERENCES "posts" ("id") ON UPDATE CASCADE ON DELETE SET NULL,
  FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE "posts" (
  "id" TEXT NOT NULL,
  "created_at" INTEGER NOT NULL DEFAULT (CAST(unixepoch('subsec') * 1000 AS INTEGER)),
  "updated_at" INTEGER NOT NULL DEFAULT (CAST(unixepoch('subsec') * 1000 AS INTEGER)),
  "date_text" TEXT NOT NULL,
  "file_ids" TEXT CHECK ("file_ids" IS NULL OR (json_valid("file_ids") AND json_type("file_ids") = 'array')),
  "likes_count" INTEGER NOT NULL DEFAULT 0,
  "quotation_id" TEXT,
  "quotations_count" INTEGER NOT NULL DEFAULT 0,
  "replies_count" INTEGER NOT NULL DEFAULT 0,
  "reply_id" TEXT,
  "text" TEXT,
  "user_id" TEXT,
  "is_deleted" INTEGER DEFAULT 0 CHECK ("is_deleted" IN (0, 1)),
  PRIMARY KEY ("id"),
  FOREIGN KEY ("quotation_id") REFERENCES "posts" ("id") ON UPDATE CASCADE ON DELETE SET NULL,
  FOREIGN KEY ("reply_id") REFERENCES "posts" ("id") ON UPDATE CASCADE ON DELETE SET NULL,
  FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE "reactions" (
  "id" TEXT NOT NULL,
  "created_at" INTEGER NOT NULL DEFAULT (CAST(unixepoch('subsec') * 1000 AS INTEGER)),
  "updated_at" INTEGER NOT NULL DEFAULT (CAST(unixepoch('subsec') * 1000 AS INTEGER)),
  "text" TEXT NOT NULL,
  "post_id" TEXT NOT NULL,
  "count" INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY ("id"),
  FOREIGN KEY ("post_id") REFERENCES "posts" ("id") ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE "references" (
  "created_at" INTEGER NOT NULL DEFAULT (CAST(unixepoch('subsec') * 1000 AS INTEGER)),
  "is_read" INTEGER NOT NULL DEFAULT 0 CHECK ("is_read" IN (0, 1)),
  "post_id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  PRIMARY KEY ("user_id", "post_id"),
  FOREIGN KEY ("post_id") REFERENCES "posts" ("id") ON UPDATE CASCADE ON DELETE RESTRICT,
  FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE "sessions" (
  "id" TEXT NOT NULL,
  "created_at" INTEGER NOT NULL DEFAULT (CAST(unixepoch('subsec') * 1000 AS INTEGER)),
  "updated_at" INTEGER NOT NULL DEFAULT (CAST(unixepoch('subsec') * 1000 AS INTEGER)),
  "anti_csrf_token" TEXT,
  "expires_at" INTEGER,
  "handle" TEXT NOT NULL,
  "hashed_session_token" TEXT,
  "private_data" TEXT,
  "public_data" TEXT,
  "user_id" TEXT,
  PRIMARY KEY ("id"),
  FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE "tokens" (
  "id" TEXT NOT NULL,
  "created_at" INTEGER NOT NULL DEFAULT (CAST(unixepoch('subsec') * 1000 AS INTEGER)),
  "updated_at" INTEGER NOT NULL,
  "hashed_token" TEXT NOT NULL,
  "type" TEXT NOT NULL CHECK ("type" IN ('RESET_PASSWORD')),
  "expires_at" INTEGER NOT NULL,
  "sent_to" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  PRIMARY KEY ("id"),
  FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE "users" (
  "id" TEXT NOT NULL,
  "created_at" INTEGER NOT NULL DEFAULT (CAST(unixepoch('subsec') * 1000 AS INTEGER)),
  "updated_at" INTEGER NOT NULL DEFAULT (CAST(unixepoch('subsec') * 1000 AS INTEGER)),
  "name" TEXT,
  "username" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'USER' CHECK ("role" IN ('ADMIN', 'SYSTEM', 'USER')),
  "email" TEXT,
  "biography" TEXT NOT NULL DEFAULT '',
  "site_url" TEXT,
  "followees_count" INTEGER NOT NULL DEFAULT 0,
  "followers_count" INTEGER NOT NULL DEFAULT 0,
  "header_file_id" TEXT,
  "icon_file_id" TEXT,
  "login_provider" TEXT NOT NULL CHECK ("login_provider" IN ('GOOGLE_COM', 'PASSWORD')),
  "fcm_token" TEXT,
  "fcm_token_for_mobile" TEXT,
  "notification_email" TEXT,
  "protected" INTEGER NOT NULL DEFAULT 0 CHECK ("protected" IN (0, 1)),
  "discoverable_by_email" INTEGER NOT NULL DEFAULT 1 CHECK ("discoverable_by_email" IN (0, 1)),
  "subscribe_message" INTEGER NOT NULL DEFAULT 0 CHECK ("subscribe_message" IN (0, 1)),
  "subscribe_post_like" INTEGER NOT NULL DEFAULT 0 CHECK ("subscribe_post_like" IN (0, 1)),
  "subscribe_post_quotation" INTEGER NOT NULL DEFAULT 0 CHECK ("subscribe_post_quotation" IN (0, 1)),
  PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "_user_reactions_AB_unique" ON "_user_reactions" ("A", "B");

CREATE INDEX "_user_reactions_B_index" ON "_user_reactions" ("B");

CREATE INDEX "bookmarks_user_id_created_at_idx" ON "bookmarks" ("user_id", "created_at");

CREATE UNIQUE INDEX "bookmarks_user_id_post_id_key" ON "bookmarks" ("user_id", "post_id");

CREATE INDEX "friendships_follower_id_created_at_idx" ON "friendships" ("follower_id", "created_at");

CREATE UNIQUE INDEX "friendships_follower_id_followee_id_key" ON "friendships" ("follower_id", "followee_id");

CREATE INDEX "likes_user_id_created_at_idx" ON "likes" ("user_id", "created_at");

CREATE UNIQUE INDEX "likes_user_id_post_id_key" ON "likes" ("user_id", "post_id");

CREATE INDEX "notifications_user_id_created_at_idx" ON "notifications" ("user_id", "created_at");

CREATE UNIQUE INDEX "notifications_user_id_type_unique_id_key" ON "notifications" ("user_id", "type", "unique_id");

CREATE INDEX "posts_created_at_idx" ON "posts" ("created_at");

CREATE INDEX "posts_reply_id_created_at_idx" ON "posts" ("reply_id", "created_at");

CREATE INDEX "posts_user_id_created_at_idx" ON "posts" ("user_id", "created_at");

CREATE UNIQUE INDEX "posts_user_id_quotation_id_key" ON "posts" ("user_id", "quotation_id");

CREATE INDEX "reactions_post_id_idx" ON "reactions" ("post_id");

CREATE UNIQUE INDEX "reactions_post_id_text_key" ON "reactions" ("post_id", "text");

CREATE INDEX "references_user_id_created_at_idx" ON "references" ("user_id", "created_at");

CREATE UNIQUE INDEX "sessions_handle_key" ON "sessions" ("handle");

CREATE UNIQUE INDEX "tokens_hashed_token_type_key" ON "tokens" ("hashed_token", "type");

CREATE INDEX "users_created_at_idx" ON "users" ("created_at");

CREATE UNIQUE INDEX "users_email_key" ON "users" ("email");

CREATE UNIQUE INDEX "users_username_key" ON "users" ("username");