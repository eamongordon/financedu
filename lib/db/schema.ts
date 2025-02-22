import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  decimal
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
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date", withTimezone: true }).defaultNow().$onUpdateFn(() => new Date()),
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
  longDescription: text("longDescription"),
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
  icon: text("icon"),
})

export const lessons = pgTable("lesson", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  moduleId: text("moduleId")
    .notNull()
    .references(() => modules.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  objectives: text("objectives"),
  order: integer("order").notNull(),
})

export const lessonToActivities = pgTable("lessonToActivity", {
  lessonId: text("lessonId")
    .notNull()
    .references(() => lessons.id, { onDelete: "cascade" }),
  activityId: text("activityId")
    .notNull()
    .references(() => activities.id, { onDelete: "cascade" }),
  order: integer("order").notNull(),
}, (lessonToActivity) => [
  {
    compositePK: primaryKey({
      columns: [lessonToActivity.lessonId, lessonToActivity.activityId],
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
  topics: text("topics").array(),
})

export const activityToQuestions = pgTable("activityToQuestion", {
  activityId: text("activityId")
    .notNull()
    .references(() => activities.id, { onDelete: "cascade" }),
  questionId: text("questionId")
    .notNull()
    .references(() => questions.id, { onDelete: "cascade" }),
  order: integer("order").notNull(),
}, (activityToQuestion) => [
  {
    compositePK: primaryKey({
      columns: [activityToQuestion.activityId, activityToQuestion.questionId],
    }),
  },
])

export const questions = pgTable("question", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  type: text("type", { enum: ["matching", "numeric", "multiselect", "radio", "info", "text"] }).notNull(),
  difficulty: text("difficulty", { enum: ["easy", "medium", "hard"] }),
  placeholder: text("placeholder"),
  numericAnswer: decimal("numericAnswer", { precision: 10, scale: 2 }),
  tolerance: integer("tolerance"),
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
  value: text("value").notNull(),
  isCorrect: boolean("isCorrect").notNull(),
})

export const matchingSubquestions = pgTable("matchingSubquestion", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  questionId: text("questionId")
    .notNull()
    .references(() => questions.id, { onDelete: "cascade" }),
  instructions: text("instructions").notNull(),
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
  value: text("value").notNull(),
})

export const activityToStandards = pgTable("activityToStandard", {
  activityId: text("activityId")
    .notNull()
    .references(() => activities.id, { onDelete: "cascade" }),
  standardId: text("standardId")
    .notNull()
    .references(() => standards.id, { onDelete: "cascade" }),
}, (activityToStandard) => [
  {
    compositePK: primaryKey({
      columns: [activityToStandard.activityId, activityToStandard.standardId],
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

export const userCompletion = pgTable("userCompletion", {
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  courseId: text("courseId")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  moduleId: text("moduleId")
    .notNull()
    .references(() => modules.id, { onDelete: "cascade" }),
  lessonId: text("lessonId")
    .notNull()
    .references(() => lessons.id, { onDelete: "cascade" }),
  activityId: text("activityId")
    .notNull()
    .references(() => activities.id, { onDelete: "cascade" }),
  completedAt: timestamp("completedAt", { mode: "date", withTimezone: true }).defaultNow(),
}, (userCompletion) => [
  primaryKey({ columns: [userCompletion.userId, userCompletion.courseId, userCompletion.moduleId, userCompletion.lessonId, userCompletion.activityId] })
]);

export const parentChildInvitations = pgTable("parentChildInvitation", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  parentId: text("parentId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  childId: text("childId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true }).defaultNow(),
})

export const parentChild = pgTable("parentChild", {
  parentId: text("parentId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  childId: text("childId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
}, (parentChild) => [
  {
    compositePK: primaryKey({
      columns: [parentChild.parentId, parentChild.childId],
    }),
  },
]);

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  authenticators: many(authenticators),
  userCompletion: many(userCompletion),
  parentChild: many(parentChild),
  parentChildInvitations: many(parentChildInvitations),
  parentChildChildren: many(parentChild),
  parentChildParents: many(parentChild),
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
  userCompletion: many(userCompletion),
}))

export const modulesRelations = relations(modules, ({ one, many }) => ({
  course: one(courses, {
    fields: [modules.courseId],
    references: [courses.id],
  }),
  lessons: many(lessons),
  userCompletion: many(userCompletion),
}))

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  module: one(modules, {
    fields: [lessons.moduleId],
    references: [modules.id],
  }),
  lessonToActivities: many(lessonToActivities),
  userCompletion: many(userCompletion),
}))

export const activitiesRelations = relations(activities, ({ many }) => ({
  lessonToActivities: many(lessonToActivities),
  activityToQuestions: many(activityToQuestions),
  activityToStandards: many(activityToStandards),
  userCompletion: many(userCompletion),
}))

export const lessonToActivitiesRelations = relations(lessonToActivities, ({ one }) => ({
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

export const matchingSubquestionsRelations = relations(matchingSubquestions, ({ one }) => ({
  question: one(questions, {
    fields: [matchingSubquestions.questionId],
    references: [questions.id],
  }),
  correctMatchingOption: one(matchingOptions, {
    fields: [matchingSubquestions.correctMatchingOptionId],
    references: [matchingOptions.id],
  }),
}))

export const matchingOptionsRelations = relations(matchingOptions, ({ one, many }) => ({
  question: one(questions, {
    fields: [matchingOptions.questionId],
    references: [questions.id],
  }),
  matchingSubquestions: many(matchingSubquestions),
}))

export const activityToQuestionsRelations = relations(activityToQuestions, ({ one }) => ({
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

export const activityToStandardsRelations = relations(activityToStandards, ({ one }) => ({
  activity: one(activities, {
    fields: [activityToStandards.activityId],
    references: [activities.id],
  }),
  standard: one(standards, {
    fields: [activityToStandards.standardId],
    references: [standards.id],
  }),
}))

export const userCompletionRelations = relations(userCompletion, ({ one }) => ({
  user: one(users, {
    fields: [userCompletion.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [userCompletion.courseId],
    references: [courses.id],
  }),
  module: one(modules, {
    fields: [userCompletion.moduleId],
    references: [modules.id],
  }),
  lesson: one(lessons, {
    fields: [userCompletion.lessonId],
    references: [lessons.id],
  }),
  activity: one(activities, {
    fields: [userCompletion.activityId],
    references: [activities.id],
  }),
}))

export const parentChildInvitationsRelations = relations(parentChildInvitations, ({ one }) => ({
  parent: one(users, {
    fields: [parentChildInvitations.parentId],
    references: [users.id],
  }),
  child: one(users, {
    fields: [parentChildInvitations.childId],
    references: [users.id],
  }),
}));

export const parentChildRelations = relations(parentChild, ({ one }) => ({
  parent: one(users, {
    fields: [parentChild.parentId],
    references: [users.id],
  }),
  child: one(users, {
    fields: [parentChild.childId],
    references: [users.id],
  }),
}));