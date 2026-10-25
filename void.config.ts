import { defineConfig } from "void/config"

export default defineConfig({
  worker: {
    compatibility_date: "2026-09-06",
    compatibility_flags: ["nodejs_compat"],
    vars: {
      READ_ONLY: "false",
    },
  },
  cloudflare: {
    name: "swimmy",
    workers_dev: true,
    routes: [
      {
        pattern: "swimmy.io",
        custom_domain: true,
      },
      {
        pattern: "www.swimmy.io",
        custom_domain: true,
      },
    ],
    d1_databases: [
      {
        binding: "DB",
        database_name: "swimmy",
        database_id: "5da58112-3d9b-4780-b26d-2a6fb4f088cc",
        migrations_dir: "db/migrations",
      },
    ],
    account_id: "5b7537bae3233beb7ebbcdb7f47c3ec0",
    r2_buckets: [
      {
        binding: "BUCKET",
        bucket_name: "swimmy-images",
      },
    ],
    images: {
      binding: "IMAGES",
    },
    observability: {
      enabled: true,
    },
  },
  routing: {
    isr: false,
  },
  head: {
    htmlAttrs: {
      lang: "ja",
    },
    meta: [
      {
        charset: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        name: "application-name",
        content: "スイミー電子掲示板",
      },
    ],
    link: [
      {
        rel: "icon",
        href: "/favicon.ico",
      },
      {
        rel: "apple-touch-icon",
        href: "/icons/apple-touch-icon.png",
      },
    ],
  },
})
