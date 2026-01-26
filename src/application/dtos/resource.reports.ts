export type ResourceMetrics = {
  readonly totalViews: number;
  readonly uniqueStudentsCount: number;
  readonly averageDurationMinutes: number;
  readonly totalTimeSpentMinutes: number;
}

export type StudentActivityDetail = {
  readonly userId: number;
  readonly fullName: string;
  readonly viewCount: number;
  readonly totalMinutesSpent: number;
  readonly lastViewed: string;
};

export type ResourceClassReportResponse = {
  readonly resourceId: string;
  readonly resourceTitle: string;
  readonly classId: string;
  readonly summary: ResourceMetrics;
  readonly students: StudentActivityDetail[];
};
