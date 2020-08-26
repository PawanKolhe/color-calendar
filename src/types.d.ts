export interface CalendarOptions {
  id?: string;
  eventsData?: EventData[];
  theme?: string;
  primaryColor?: string;
  headerColor?: string;
  headerBackgroundColor?: string;
  weekdaysColor?: string;
  weekdayType?: WeekdayType;
  monthDisplayType?: MonthDisplayType;
  startWeekday?: StartWeekday;
  fontFamilyHeader?: string;
  fontFamilyWeekdays?: string;
  fontFamilyBody?: string;
  dropShadow?: boolean;
  border?: string;
  borderRadius?: string;
  disableMonthYearPickers?: boolean;
  monthChanged?: (currentDate?: Date, filteredMonthEvents?: EventData[]) => void;
  dateChanged?: (currentDate?: Date, filteredDateEvents?: EventData[]) => void;
}

export interface EventData {
  start: string,
  end: string,
  [key: string]: any,
}

export interface Day {
  day: number,
  selected?: boolean,
}

export type MonthDisplayType = "short" | "long";

export  type WeekdayType = "short" | "long-lower" | "long-upper";

export type Weekdays = [string, string, string, string, string, string, string];

export type StartWeekday =  0 | 1 | 2 | 3 | 4 | 5 | 6;
