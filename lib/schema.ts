import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
} from "drizzle-orm/pg-core"
import { sql } from 'drizzle-orm'
import postgres from "postgres"
import { drizzle } from "drizzle-orm/postgres-js"
import type { AdapterAccountType } from "next-auth/adapters"

export type Role = "learner" | "teacher" | "parent";
export type Roles = Role[] & { 0: "learner" };

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  firstName: text("firstName"),
  lastName: text("lastName"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  password: text("password"),
  createdDate: timestamp("createdDate", { mode: "date", withTimezone: true }).defaultNow(),
  updatedDate: timestamp("updatedDate", { mode: "date", withTimezone: true }).defaultNow().$onUpdateFn(() => new Date()),
  roles: text('roles', { enum: ["learner", "teacher", "parent"] })
    .array()
    .notNull()
    .default(sql`'{"learner"}'::text[]`)
    .$type<Roles>(),
})

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
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
)

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable(
  "verificationToken",
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
)

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ]
)

export const courses = pgTable("course", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description"),
  courseLength: integer("courseLength").notNull(),
  image: text("image"),
})

export const modules = pgTable("module", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  courseId: text("courseId")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  description: text("description"),
  objectives: text("objectives"),
  order: integer("order").notNull(),
})

export const lessons = pgTable("lesson", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  description: text("description"),
  objectives: text("objectives"),
})

export const moduleLessons = pgTable("moduleLesson", {
  moduleId: text("moduleId")
    .notNull()
    .references(() => modules.id, { onDelete: "cascade" }),
  lessonId: text("lessonId")
    .notNull()
    .references(() => lessons.id, { onDelete: "cascade" }),
  order: integer("order").notNull(),
}, (moduleLesson) => [
  {
    compositePK: primaryKey({
      columns: [moduleLesson.moduleId, moduleLesson.lessonId],
    }),
  },
])

export const activities = pgTable("activity", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  type: text("type", { enum: ["Quiz", "Article"] }).notNull(),
  description: text("description"),
})

export const lessonActivities = pgTable("lessonActivity", {
  lessonId: text("lessonId")
    .notNull()
    .references(() => lessons.id, { onDelete: "cascade" }),
  activityId: text("activityId")
    .notNull()
    .references(() => activities.id, { onDelete: "cascade" }),
  order: integer("order").notNull(),
}, (lessonActivity) => [
  {
    compositePK: primaryKey({
      columns: [lessonActivity.lessonId, lessonActivity.activityId],
    }),
  },
])

export const questions = pgTable("question", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  type: text("type", { enum: ["matching", "number", "multiselect", "radio", "info"] }).notNull(),
  difficulty: text("difficulty", { enum: ["easy", "medium", "hard"] }).notNull(),
  description: text("description"),
})

export const activityQuestions = pgTable("activityQuestion", {
  activityId: text("activityId")
    .notNull()
    .references(() => activities.id, { onDelete: "cascade" }),
  questionId: text("questionId")
    .notNull()
    .references(() => questions.id, { onDelete: "cascade" }),
  order: integer("order").notNull(),
}, (activityQuestion) => [
  {
    compositePK: primaryKey({
      columns: [activityQuestion.activityId, activityQuestion.questionId],
    }),
  },
])

export const standards = pgTable("standard", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  description: text("description"),
  objectives: text("objectives"),
})

export const activityStandards = pgTable("activityStandard", {
  activityId: text("activityId")
    .notNull()
    .references(() => activities.id, { onDelete: "cascade" }),
  standardId: text("standardId")
    .notNull()
    .references(() => standards.id, { onDelete: "cascade" }),
}, (activityStandard) => [
  {
    compositePK: primaryKey({
      columns: [activityStandard.activityId, activityStandard.standardId],
    }),
  },
])

export const userProgress = pgTable("userProgress", {
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  courseId: text("courseId")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  moduleId: text("moduleId")
    .references(() => modules.id, { onDelete: "cascade" }),
  lessonId: text("lessonId")
    .references(() => lessons.id, { onDelete: "cascade" }),
  activityId: text("activityId")
    .references(() => activities.id, { onDelete: "cascade" }),
  progressStatus: text("progressStatus", { enum: ["not started", "in progress", "completed"] }).notNull(),
  updatedDate: timestamp("updatedDate", { mode: "date", withTimezone: true }).defaultNow().$onUpdateFn(() => new Date()),
}, (userProgress) => [
  {
    compositePK: primaryKey({
      columns: [userProgress.userId, userProgress.courseId, userProgress.moduleId, userProgress.lessonId, userProgress.activityId],
    }),
  },
])

const schema = { 
  users, accounts, sessions, verificationTokens, authenticators, 
  courses, modules, lessons, activities, lessonActivities, 
  questions, activityQuestions, moduleLessons, standards, activityStandards,
  userProgress
};

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set")
}

const pool = postgres(connectionString)

export const db = drizzle(pool, { schema })