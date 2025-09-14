import { mapStringToEnum } from "services";

export const DashboardTabs = {
  EnrolledClasses: "EnrolledClasses",
  MyClasses: "MyClasses",
  Resources: "Resources",
  Tests: "Tests",
} as const;

export type DashboardTabs =
  (typeof DashboardTabs)[keyof typeof DashboardTabs];

export const mapDashboardPage = (key: string) =>
  mapStringToEnum(key, DashboardTabs);
