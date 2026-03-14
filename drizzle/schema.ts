import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, float } from "drizzle-orm/mysql-core";

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

// Simulation results — stores each profit recovery calculation
export const simulationResults = mysqlTable("simulation_results", {
  id: int("id").autoincrement().primaryKey(),
  token: varchar("token", { length: 64 }).notNull().unique(),
  businessType: varchar("businessType", { length: 64 }).notNull(),
  adminStaff: int("adminStaff").notNull(),
  hoursPerWeek: float("hoursPerWeek").notNull(),
  loadedHourlyRate: float("loadedHourlyRate").notNull(),
  annualSavings: float("annualSavings").notNull(),
  hoursFreedPerYear: float("hoursFreedPerYear").notNull(),
  roiPercent: float("roiPercent").notNull(),
  ownerEmail: varchar("ownerEmail", { length: 320 }),
  ownerName: varchar("ownerName", { length: 128 }),
  businessName: varchar("businessName", { length: 256 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SimulationResult = typeof simulationResults.$inferSelect;
export type InsertSimulationResult = typeof simulationResults.$inferInsert;
