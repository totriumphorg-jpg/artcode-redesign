import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const contests = mysqlTable("contests", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  shortTitle: varchar("shortTitle", { length: 160 }),
  discipline: mysqlEnum("discipline", [
    "vocal",
    "choreography",
    "theater",
    "instrumental",
    "circus",
    "art",
  ]).notNull(),
  disciplineLabel: varchar("disciplineLabel", { length: 80 }).notNull(),
  badge: varchar("badge", { length: 80 }).default("Регулярный проект").notNull(),
  status: mysqlEnum("status", ["active", "archived", "draft"]).default("active").notNull(),
  receptionPeriod: varchar("receptionPeriod", { length: 160 }).notNull(),
  resultsPeriod: varchar("resultsPeriod", { length: 160 }).notNull(),
  feeAmount: int("feeAmount").default(790).notNull(),
  cardImage: text("cardImage").notNull(),
  bannerImage: text("bannerImage"),
  accentColor: varchar("accentColor", { length: 32 }).default("#2563eb").notNull(),
  description: text("description").notNull(),
  juryNames: text("juryNames").notNull(), // три члена жюри
  isSeasonal: boolean("isSeasonal").default(false).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Contest = typeof contests.$inferSelect;
export type InsertContest = typeof contests.$inferInsert;

export const contestRegulations = mysqlTable("contest_regulations", {
  id: int("id").autoincrement().primaryKey(),
  contestId: int("contestId").notNull(),
  sectionKey: varchar("sectionKey", { length: 64 }).notNull(),
  title: varchar("title", { length: 160 }).notNull(),
  content: text("content").notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ContestRegulation = typeof contestRegulations.$inferSelect;
export type InsertContestRegulation = typeof contestRegulations.$inferInsert;

export const contestReports = mysqlTable("contest_reports", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 140 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 120 }).notNull(),
  publishedDate: varchar("publishedDate", { length: 64 }).notNull(),
  periodLabel: varchar("periodLabel", { length: 120 }),
  summary: text("summary").notNull(),
  fullReport: text("fullReport").notNull(),
  protocolUrl: text("protocolUrl"),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ContestReport = typeof contestReports.$inferSelect;
export type InsertContestReport = typeof contestReports.$inferInsert;

export const applications = mysqlTable("applications", {
  id: int("id").autoincrement().primaryKey(),
  contestId: int("contestId").notNull(),
  contestSlug: varchar("contestSlug", { length: 120 }).notNull(),
  contestTitle: varchar("contestTitle", { length: 255 }).notNull(),
  discipline: varchar("discipline", { length: 64 }).notNull(),
  participantName: varchar("participantName", { length: 200 }).notNull(),
  collectiveName: varchar("collectiveName", { length: 200 }),
  ageCategory: varchar("ageCategory", { length: 100 }).notNull(),
  nomination: varchar("nomination", { length: 180 }).notNull(),
  performanceTitle: varchar("performanceTitle", { length: 255 }).notNull(),
  videoUrl: text("videoUrl").notNull(),
  teacherName: varchar("teacherName", { length: 200 }),
  institution: varchar("institution", { length: 255 }),
  city: varchar("city", { length: 120 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 60 }).notNull(),
  comment: text("comment"),
  status: mysqlEnum("status", ["new", "paid", "reviewed", "rejected"]).default("new").notNull(),
  paymentAmount: int("paymentAmount").default(790).notNull(),
  paymentInvoiceId: varchar("paymentInvoiceId", { length: 120 }),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "paid", "failed"]).default("pending").notNull(),
  paidAt: timestamp("paidAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Application = typeof applications.$inferSelect;
export type InsertApplication = typeof applications.$inferInsert;

export const paymentTransactions = mysqlTable("payment_transactions", {
  id: int("id").autoincrement().primaryKey(),
  applicationId: int("applicationId"),
  orderId: varchar("orderId", { length: 100 }).notNull().unique(),
  amount: int("amount").notNull(),
  clientEmail: varchar("clientEmail", { length: 255 }).notNull(),
  clientPhone: varchar("clientPhone", { length: 60 }),
  serviceName: varchar("serviceName", { length: 255 }).notNull(),
  status: mysqlEnum("status", ["created", "paid", "failed", "cancelled"]).default("created").notNull(),
  paykeeperId: varchar("paykeeperId", { length: 120 }),
  payUrl: text("payUrl"),
  callbackPayload: text("callbackPayload"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PaymentTransaction = typeof paymentTransactions.$inferSelect;
export type InsertPaymentTransaction = typeof paymentTransactions.$inferInsert;
