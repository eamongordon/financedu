import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  decimal,
} from "drizzle-orm/pg-core"
import { sql } from 'drizzle-orm'
import type { AdapterAccountType } from "next-auth/adapters"
import { relations } from "drizzle-orm"

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
  courseLength: text("courseLength").notNull(),
  gradeLevels: text("gradeLevels").notNull(),
  image: text("image"),
})

export const modules = pgTable("module", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  courseId: text("courseId")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  objectives: text("objectives"),
  order: integer("order").notNull(),
})

export const lessons = pgTable("lesson", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description"),
  objectives: text("objectives"),
})

export const moduleToLessons = pgTable("moduleLesson", {
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

export const lessonToActivities = pgTable("lessonActivity", {
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

export const activities = pgTable("activity", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  type: text("type", { enum: ["Quiz", "Article"] }).notNull(),
  description: text("description"),
  content: text("content"),
})

export const activityToQuestions = pgTable("activityQuestion", {
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

export const questions = pgTable("question", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  type: text("type", { enum: ["matching", "numeric", "multiselect", "radio", "info"] }).notNull(),
  difficulty: text("difficulty", { enum: ["easy", "medium", "hard"] }).notNull(),
  numericAnswer: decimal("numericAnswer", { precision: 10, scale: 2 }),
  instructions: text("instructions"),
  topics: text("topics").array(),
})

export const questionOptions = pgTable("questionOption", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  questionId: text("questionId")
    .notNull()
    .references(() => questions.id, { onDelete: "cascade" }),
  option: text("option").notNull(),
  isCorrect: boolean("isCorrect").notNull(),
})

export const matchingSubquestions = pgTable("matchingSubquestion", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  questionId: text("questionId")
    .notNull()
    .references(() => questions.id, { onDelete: "cascade" }),
  subquestion: text("subquestion").notNull(),
  correctMatchingOptionId: text("correctMatchingOptionId")
    .notNull()
    .references(() => matchingOptions.id, { onDelete: "cascade" }),
})

export const matchingOptions = pgTable("matchingOption", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  questionId: text("questionId")
    .notNull()
    .references(() => questions.id, { onDelete: "cascade" }),
  option: text("option").notNull(),
  correct: boolean("correct").notNull(),
})

export const activityToStandards = pgTable("activityStandard", {
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

export const standards = pgTable("standard", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  description: text("description"),
  objectives: text("objectives"),
})

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

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  authenticators: many(authenticators),
  userProgress: many(userProgress),
}))

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))

export const authenticatorsRelations = relations(authenticators, ({ one }) => ({
  user: one(users, {
    fields: [authenticators.userId],
    references: [users.id],
  }),
}))

export const coursesRelations = relations(courses, ({ many }) => ({
  modules: many(modules),
  userProgress: many(userProgress),
}))

export const modulesRelations = relations(modules, ({ one, many }) => ({
  course: one(courses, {
    fields: [modules.courseId],
    references: [courses.id],
  }),
  moduleToLessons: many(moduleToLessons),
  userProgress: many(userProgress),
}))

export const lessonsRelations = relations(lessons, ({ many }) => ({
  moduleToLessons: many(moduleToLessons),
  lessonToActivities: many(lessonToActivities),
  userProgress: many(userProgress),
}))

export const moduleLessonsRelations = relations(moduleToLessons, ({ one }) => ({
  module: one(modules, {
    fields: [moduleToLessons.moduleId],
    references: [modules.id],
  }),
  lesson: one(lessons, {
    fields: [moduleToLessons.lessonId],
    references: [lessons.id],
  }),
}))

export const activitiesRelations = relations(activities, ({ many }) => ({
  lessonToActivities: many(lessonToActivities),
  activityToQuestions: many(activityToQuestions),
  activityToStandards: many(activityToStandards),
  userProgress: many(userProgress),
}))

export const lessonActivitiesRelations = relations(lessonToActivities, ({ one }) => ({
  lesson: one(lessons, {
    fields: [lessonToActivities.lessonId],
    references: [lessons.id],
  }),
  activity: one(activities, {
    fields: [lessonToActivities.activityId],
    references: [activities.id],
  }),
}))

export const questionsRelations = relations(questions, ({ many }) => ({
  activityToQuestions: many(activityToQuestions),
  questionOptions: many(questionOptions),
  matchingSubquestions: many(matchingSubquestions),
  matchingOptions: many(matchingOptions),
}))

export const questionOptionsRelations = relations(questionOptions, ({ one }) => ({
  question: one(questions, {
    fields: [questionOptions.questionId],
    references: [questions.id],
  }),
}))

export const matchingSubquestionsRelations = relations(matchingSubquestions, ({ one, many }) => ({
  question: one(questions, {
    fields: [matchingSubquestions.questionId],
    references: [questions.id],
  }),
  correctMatchingOption: one(matchingOptions, {
    fields: [matchingSubquestions.correctMatchingOptionId],
    references: [matchingOptions.id],
  }),
}))

export const matchingOptionsRelations = relations(matchingOptions, ({ one }) => ({
  question: one(questions, {
    fields: [matchingOptions.questionId],
    references: [questions.id],
  }),
}))

export const activityQuestionsRelations = relations(activityToQuestions, ({ one }) => ({
  activity: one(activities, {
    fields: [activityToQuestions.activityId],
    references: [activities.id],
  }),
  question: one(questions, {
    fields: [activityToQuestions.questionId],
    references: [questions.id],
  }),
}))

export const standardsRelations = relations(standards, ({ many }) => ({
  activityToStandards: many(activityToStandards),
}))

export const activityStandardsRelations = relations(activityToStandards, ({ one }) => ({
  activity: one(activities, {
    fields: [activityToStandards.activityId],
    references: [activities.id],
  }),
  standard: one(standards, {
    fields: [activityToStandards.standardId],
    references: [standards.id],
  }),
}))

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, {
    fields: [userProgress.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [userProgress.courseId],
    references: [courses.id],
  }),
  module: one(modules, {
    fields: [userProgress.moduleId],
    references: [modules.id],
  }),
  lesson: one(lessons, {
    fields: [userProgress.lessonId],
    references: [lessons.id],
  }),
  activity: one(activities, {
    fields: [userProgress.activityId],
    references: [activities.id],
  }),
}))