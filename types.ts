import { User } from "db"

export type Role = "ADMIN" | "USER"

export type Session = {
  userId: User["id"] | null
  role: Role | null
}

export type Context = {
  session: Session | null
}
