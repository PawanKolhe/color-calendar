export interface CalendarOptions {
  container?: string | HTMLElement | (() => HTMLElement | null);
  calendarSize?: CalendarSize;
  layoutModifiers?: LayoutModifier[];
  eventsData?: EventData[];
  theme?: string;
  primaryColor?: string;
  headerColor?: string;
  headerBackgroundColor?: string;
  weekdaysColor?: string;
  weekdayDisplayType?: WeekdayDisplayType;
  monthDisplayType?: MonthDisplayType;
  startWeekday?: StartWeekday;
  fontFamilyHeader?: string;
  fontFamilyWeekdays?: string;
  fontFamilyBody?: string;
  dropShadow?: string;
  border?: string;
  borderRadius?: string;
  disableMonthYearPickers?: boolean;
  disableDayClick?: boolean;
  disableMonthArrowClick?: boolean;
  customMonthValues?: string[];
  customWeekdayValues?: string[];
  eventBulletMode?: EventBulletMode;
  initialSelectedDate?: Date;
  onMonthChange?: (currentDate?: Date, filteredMonthEvents?: EventData[]) => void;
  onSelectedDateChange?: (currentDate?: Date, filteredDateEvents?: EventData[]) => void;
  onSelectedDateClick?: (currentDate?: Date, filteredDateEvents?: EventData[]) => void;
}

export interface EventData {
  start: string;
  end: string;
  color?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface Day {
  day: number;
  selected?: boolean;
}

export type CalendarSize = "small" | "large";

export type LayoutModifier = "month-left-align";

export type MonthDisplayType = "short" | "long";

export type WeekdayDisplayType = "short" | "long-lower" | "long-upper";

export type Weekdays = [string, string, string, string, string, string, string];

export type StartWeekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type EventBulletMode = "multiple" | "single";
