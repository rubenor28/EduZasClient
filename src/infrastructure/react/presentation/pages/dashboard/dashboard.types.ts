import { mapStringToEnum } from "@application";
import { UserType } from "@domain";

export const DashboardTabs = {
  SystemClasses: "SystemClasses",
  EnrolledClasses: "EnrolledClasses",
  MyClasses: "MyClasses",
  Resources: "AcademicResources",
  Tests: "Tests",
} as const;

export type DashboardTabs = (typeof DashboardTabs)[keyof typeof DashboardTabs];

export const mapDashboardPage = (key: string) =>
  mapStringToEnum(key, DashboardTabs);

export const defaultTab = (role: UserType) => {
  const tabs = {
    [UserType.STUDENT]: DashboardTabs.EnrolledClasses,
    [UserType.PROFESSOR]: DashboardTabs.MyClasses,
    [UserType.ADMIN]: DashboardTabs.SystemClasses,
  };

  return tabs[role] ?? DashboardTabs.EnrolledClasses;
};
