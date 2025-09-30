import Calendar, { CalendarOptions, EventData } from "../index";

export interface CalendarProps extends CalendarOptions {
  /** Sample events data for demonstration */
  sampleEvents?: EventData[];
}

/** Dynamically generate sample events for the current month */
const generateSampleEvents = (): EventData[] => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // Get the number of days in the current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Generate events spread throughout the current month
  const events: EventData[] = [
    {
      start: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(Math.min(3, daysInMonth)).padStart(2, "0")}`,
      end: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(Math.min(3, daysInMonth)).padStart(2, "0")}`,
      title: "Team Meeting",
      color: "#ff6b6b"
    },
    {
      start: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(Math.min(7, daysInMonth)).padStart(2, "0")}`,
      end: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(Math.min(7, daysInMonth)).padStart(2, "0")}`,
      title: "Project Kickoff",
      color: "#4ecdc4"
    },
    {
      start: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(Math.min(10, daysInMonth)).padStart(2, "0")}`,
      end: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(Math.min(10, daysInMonth)).padStart(2, "0")}`,
      title: "Client Review",
      color: "#45b7d1"
    },
    {
      start: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(Math.min(15, daysInMonth)).padStart(2, "0")}`,
      end: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(Math.min(15, daysInMonth)).padStart(2, "0")}`,
      title: "Deadline",
      color: "#96ceb4"
    },
    {
      start: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(Math.min(18, daysInMonth)).padStart(2, "0")}`,
      end: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(Math.min(20, daysInMonth)).padStart(2, "0")}`,
      title: "Conference",
      color: "#feca57"
    },
    {
      start: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(Math.min(22, daysInMonth)).padStart(2, "0")}`,
      end: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(Math.min(22, daysInMonth)).padStart(2, "0")}`,
      title: "Team Lunch",
      color: "#ff9ff3"
    },
    {
      start: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(Math.min(25, daysInMonth)).padStart(2, "0")}`,
      end: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(Math.min(25, daysInMonth)).padStart(2, "0")}`,
      title: "Workshop",
      color: "#54a0ff"
    },
    {
      start: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(Math.min(28, daysInMonth)).padStart(2, "0")}`,
      end: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(Math.min(30, daysInMonth)).padStart(2, "0")}`,
      title: "Training Session",
      color: "#5f27cd"
    },
    {
      start: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(daysInMonth).padStart(2, "0")}`,
      end: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(daysInMonth).padStart(2, "0")}`,
      title: "Monthly Review",
      color: "#00d2d3"
    }
  ];

  return events;
};

/** Sample events data for demonstration - dynamically generated for current month */
export const sampleEvents: EventData[] = generateSampleEvents();

/** Creates a Calendar component for Storybook */
export const createCalendar = (props: CalendarProps) => {
  // Generate unique ID for each calendar instance
  const uniqueId = `color-calendar-${Math.random().toString(36).substr(2, 9)}`;

  // Create a container div for the calendar
  const container = document.createElement("div");
  container.id = uniqueId;
  container.style.minHeight = "400px";
  container.style.width = "100%";

  // Initialize the calendar with the provided options
  const calendarOptions: CalendarOptions = {
    id: `#${uniqueId}`,
    calendarSize: props.calendarSize || "large",
    theme: props.theme || "basic",
    primaryColor: props.primaryColor,
    headerColor: props.headerColor,
    headerBackgroundColor: props.headerBackgroundColor,
    weekdaysColor: props.weekdaysColor,
    weekdayDisplayType: props.weekdayDisplayType || "long-lower",
    monthDisplayType: props.monthDisplayType || "long",
    startWeekday: props.startWeekday || 0,
    fontFamilyHeader: props.fontFamilyHeader,
    fontFamilyWeekdays: props.fontFamilyWeekdays,
    fontFamilyBody: props.fontFamilyBody,
    dropShadow: props.dropShadow,
    border: props.border,
    borderRadius: props.borderRadius,
    disableMonthYearPickers: props.disableMonthYearPickers || false,
    disableDayClick: props.disableDayClick || false,
    disableMonthArrowClick: props.disableMonthArrowClick || false,
    customMonthValues: props.customMonthValues,
    customWeekdayValues: props.customWeekdayValues,
    eventsData: props.sampleEvents ? sampleEvents : props.eventsData || [],
    monthChanged: props.monthChanged,
    dateChanged: props.dateChanged,
    selectedDateClicked: props.selectedDateClicked,
    layoutModifiers: props.layoutModifiers || []
  };

  // Use requestAnimationFrame for reliable DOM timing
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      try {
        new Calendar(calendarOptions);
      } catch (error) {
        console.error("Calendar initialization error:", error);
        // Fallback retry
        setTimeout(() => {
          try {
            new Calendar(calendarOptions);
          } catch (retryError) {
            console.error("Calendar initialization retry error:", retryError);
          }
        }, 100);
      }
    });
  });

  return container;
};
