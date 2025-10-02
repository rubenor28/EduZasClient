import { mapStringToEnum } from "@application";

export const DashboardTabs = {
  SystemClasses: "SystemClasses",
  EnrolledClasses: "EnrolledClasses",
  MyClasses: "MyClasses",
  Resources: "AcademicResources",
  Tests: "Tests",
} as const;

export type DashboardTabs =
  (typeof DashboardTabs)[keyof typeof DashboardTabs];

export const mapDashboardPage = (key: string) =>
  mapStringToEnum(key, DashboardTabs);
