import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from "react";
import Calendar from "../index";
import type { CalendarOptions, EventData } from "../types";

// React-specific props interface extending CalendarOptions
export interface ColorCalendarProps extends Omit<CalendarOptions, "container"> {
  // React-specific props
  className?: string;
  style?: React.CSSProperties;
  ref?: React.Ref<ColorCalendarRef>;
  // Controlled component props
  selectedDate?: Date | null;
  onSelectedDateChange?: (currentDate?: Date, filteredDateEvents?: EventData[]) => void;
}

// Ref interface to expose calendar methods
export interface ColorCalendarRef {
  getCalendar: () => Calendar | null;
  updateEvents: (events: EventData[]) => void;
  setSelectedDate: (date: Date | null) => void;
  getSelectedDate: () => Date | null;
}

// Main React wrapper component
const ColorCalendar = forwardRef<ColorCalendarRef, ColorCalendarProps>((props, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<Calendar | null>(null);

  // Extract React-specific props
  const { className, style, selectedDate, onSelectedDateChange, ...calendarOptions } = props;

  // Memoize calendar options to prevent unnecessary re-renders
  const memoizedCalendarOptions = useMemo(() => {
    return {
      calendarSize: calendarOptions.calendarSize,
      theme: calendarOptions.theme,
      primaryColor: calendarOptions.primaryColor,
      headerColor: calendarOptions.headerColor,
      headerBackgroundColor: calendarOptions.headerBackgroundColor,
      weekdaysColor: calendarOptions.weekdaysColor,
      weekdayDisplayType: calendarOptions.weekdayDisplayType,
      monthDisplayType: calendarOptions.monthDisplayType,
      startWeekday: calendarOptions.startWeekday,
      fontFamilyHeader: calendarOptions.fontFamilyHeader,
      fontFamilyWeekdays: calendarOptions.fontFamilyWeekdays,
      fontFamilyBody: calendarOptions.fontFamilyBody,
      dropShadow: calendarOptions.dropShadow,
      border: calendarOptions.border,
      borderRadius: calendarOptions.borderRadius,
      disableMonthYearPickers: calendarOptions.disableMonthYearPickers,
      disableDayClick: calendarOptions.disableDayClick,
      disableMonthArrowClick: calendarOptions.disableMonthArrowClick,
      customMonthValues: calendarOptions.customMonthValues,
      customWeekdayValues: calendarOptions.customWeekdayValues,
      eventBulletMode: calendarOptions.eventBulletMode,
      layoutModifiers: calendarOptions.layoutModifiers,
      eventsData: calendarOptions.eventsData,
      initialSelectedDate: calendarOptions.initialSelectedDate,
      onMonthChange: calendarOptions.onMonthChange,
      onSelectedDateChange: onSelectedDateChange,
      onSelectedDateClick: calendarOptions.onSelectedDateClick,
    };
  }, [
    calendarOptions.calendarSize,
    calendarOptions.theme,
    calendarOptions.primaryColor,
    calendarOptions.headerColor,
    calendarOptions.headerBackgroundColor,
    calendarOptions.weekdaysColor,
    calendarOptions.weekdayDisplayType,
    calendarOptions.monthDisplayType,
    calendarOptions.startWeekday,
    calendarOptions.fontFamilyHeader,
    calendarOptions.fontFamilyWeekdays,
    calendarOptions.fontFamilyBody,
    calendarOptions.dropShadow,
    calendarOptions.border,
    calendarOptions.borderRadius,
    calendarOptions.disableMonthYearPickers,
    calendarOptions.disableDayClick,
    calendarOptions.disableMonthArrowClick,
    calendarOptions.customMonthValues,
    calendarOptions.customWeekdayValues,
    calendarOptions.eventBulletMode,
    calendarOptions.layoutModifiers,
    calendarOptions.eventsData,
    calendarOptions.initialSelectedDate,
    calendarOptions.onMonthChange,
    calendarOptions.onSelectedDateClick,
    onSelectedDateChange,
  ]);

  // Initialize calendar on mount and when options change
  useEffect(() => {
    if (!containerRef.current) return;

    // Create new calendar instance
    const calendar = new Calendar({
      ...memoizedCalendarOptions,
      container: containerRef.current,
    });

    calendarRef.current = calendar;

    // Cleanup function - just clear the ref
    return () => {
      calendarRef.current = null;
    };
  }, [memoizedCalendarOptions]);

  // Handle initial selected date changes (only for updates after initial mount)
  useEffect(() => {
    if (calendarRef.current && calendarOptions.initialSelectedDate !== undefined) {
      calendarRef.current.setSelectedDate(calendarOptions.initialSelectedDate);
    }
  }, [calendarOptions.initialSelectedDate]);

  // Handle controlled selectedDate prop changes
  useEffect(() => {
    if (calendarRef.current && selectedDate !== undefined) {
      calendarRef.current.setSelectedDate(selectedDate);
    }
  }, [selectedDate]);

  // Expose calendar methods through ref
  useImperativeHandle(ref, () => ({
    getCalendar: () => calendarRef.current,
    updateEvents: (events: EventData[]) => {
      if (calendarRef.current) {
        calendarRef.current.setEventsData(events);
      }
    },
    setSelectedDate: (date: Date | null) => {
      if (calendarRef.current) {
        calendarRef.current.setSelectedDate(date);
      }
    },
    getSelectedDate: () => {
      if (calendarRef.current) {
        return calendarRef.current.getSelectedDate();
      }
      return null;
    },
  }));

  return (
    <div
      ref={containerRef}
      className={className}
      style={style}
      data-testid="color-calendar-container"
    />
  );
});

ColorCalendar.displayName = "ColorCalendar";

export default ColorCalendar;
