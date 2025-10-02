export interface OperatingHours {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isClosed: boolean;
}

export interface OperatingHoursForm {
  operatingHours: OperatingHours[];
}
