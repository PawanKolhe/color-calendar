import type { Meta, StoryObj } from "@storybook/html-vite";

import { fn } from "storybook/test";

import type { CalendarProps } from "./CalendarExample";
import { createCalendar, sampleEvents } from "./CalendarExample";

// Interface for event data in the events list
interface EventListItem {
  name?: string;
  description?: string;
  start: string;
  end: string;
  color?: string;
}

// Helper function to update the events list in the UI
function updateEventsList(
  currentDate: Date | undefined,
  events: EventListItem[] | undefined,
  showAllMonth = false
) {
  const eventsContainer = document.getElementById("events-list");
  if (!eventsContainer) return;
  if (!currentDate) return;
  if (!events) return;

  const dateStr = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const title = showAllMonth
    ? `All Events in ${currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}`
    : `Events on ${dateStr}`;

  const eventCount = events.length;

  let eventsHTML = "";
  if (events.length === 0) {
    eventsHTML = '<div class="no-events">No events found</div>';
  } else {
    eventsHTML = events
      .map(
        (event) => `
      <div class="event-item" style="border-left: 4px solid ${event.color || "#007bff"}">
        <div class="event-name">${event.name || "Untitled Event"}</div>
        <div class="event-description">${event.description || "No description"}</div>
        <div class="event-dates">
          ${new Date(event.start).toLocaleDateString()} - ${new Date(event.end).toLocaleDateString()}
        </div>
      </div>
    `
      )
      .join("");
  }

  eventsContainer.innerHTML = `
    <div class="events-header">
      <h3>${title}</h3>
      <span class="event-count">${eventCount} event${eventCount !== 1 ? "s" : ""}</span>
    </div>
    <div class="events-content">
      ${eventsHTML}
    </div>
  `;
}

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/Calendar",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
# Color Calendar

A customizable events calendar component library with support for:

- **🎯 Interactive Event Handling**: Listen to date changes, month changes, and user interactions
- **🎨 Individual Event Colors**: Each event can have its own color displayed as colored bullets
- **📅 Cross-Month Date Ranges**: Events spanning multiple months display correctly across all months
- **⚙️ Configurable Event Bullet Modes**: Choose between multiple bullets (one per event) or single bullet per day
- **🎭 Multiple Themes**: Basic and Glass themes with full customization support
- **⚡ Zero Dependencies**: Lightweight and fast

## Key Features

### Event Colors
Events can have individual colors specified in the \`color\` property. Colors support any valid CSS color value (hex, rgb, hsl, etc.).

### Cross-Month Support
Events that span across multiple months (e.g., Sept 24 - Oct 5) will appear correctly in both months.

### Bullet Modes
- **Multiple Mode**: Shows one bullet per event, positioned side by side
- **Single Mode**: Shows only one bullet per day, using the first event's color

### Event Handling
The calendar provides powerful event handling capabilities:

- **\`dateChanged\`**: Fired when a user selects a different date
- **\`monthChanged\`**: Fired when navigating between months
- **\`selectedDateClicked\`**: Fired when clicking on the currently selected date

These events allow you to build interactive applications that respond to user actions, such as:
- Loading event details when a date is selected
- Updating UI components based on selected date
- Performing data fetching operations
- Implementing custom navigation logic

\`\`\`javascript
const calendar = new ColorCalendar({
  id: '#calendar',
  eventsData: myEvents,
  dateChanged: (currentDate, filteredDateEvents) => {
    console.log('Date changed to:', currentDate);
    console.log('Events on this date:', filteredDateEvents);
    // Update your UI, fetch data, etc.
  },
  monthChanged: (currentDate, filteredMonthEvents) => {
    console.log('Month changed to:', currentDate);
    console.log('Events this month:', filteredMonthEvents);
    // Refresh data for new month
  }
});
\`\`\`
        `,
      },
    },
  },
  render: (args) => {
    return createCalendar(args);
  },
  argTypes: {
    calendarSize: {
      control: { type: "select" },
      options: ["small", "large"],
      description: "Size of the calendar",
    },
    theme: {
      control: { type: "select" },
      options: ["basic", "glass"],
      description: "Theme style for the calendar",
    },
    primaryColor: {
      control: "color",
      description: "Primary color for the calendar",
    },
    headerColor: {
      control: "color",
      description: "Color of the header text",
    },
    headerBackgroundColor: {
      control: "color",
      description: "Background color of the header",
    },
    weekdaysColor: {
      control: "color",
      description: "Color of the weekday labels",
    },
    weekdayDisplayType: {
      control: { type: "select" },
      options: ["short", "long-lower", "long-upper"],
      description: "Display format for weekdays",
    },
    monthDisplayType: {
      control: { type: "select" },
      options: ["short", "long"],
      description: "Display format for month names",
    },
    startWeekday: {
      control: { type: "select" },
      options: [0, 1, 2, 3, 4, 5, 6],
      description: "First day of the week (0=Sunday, 1=Monday, etc.)",
    },
    fontFamilyHeader: {
      control: "text",
      description: "Font family for header text",
    },
    fontFamilyWeekdays: {
      control: "text",
      description: "Font family for weekday labels",
    },
    fontFamilyBody: {
      control: "text",
      description: "Font family for day numbers",
    },
    dropShadow: {
      control: "text",
      description: "CSS drop-shadow for the calendar",
    },
    border: {
      control: "text",
      description: "CSS border for the calendar",
    },
    borderRadius: {
      control: "text",
      description: "CSS border-radius for the calendar",
    },
    disableMonthYearPickers: {
      control: "boolean",
      description: "Disable month/year picker functionality",
    },
    disableDayClick: {
      control: "boolean",
      description: "Disable day click functionality",
    },
    disableMonthArrowClick: {
      control: "boolean",
      description: "Disable month navigation arrows",
    },
    sampleEvents: {
      control: "boolean",
      description: "Show sample events data",
    },
    eventBulletMode: {
      control: { type: "select" },
      options: ["multiple", "single"],
      description: "Display mode for event bullets - multiple bullets per day or single bullet",
    },
    monthChanged: { action: "monthChanged" },
    dateChanged: { action: "dateChanged" },
    selectedDateClicked: { action: "selectedDateClicked" },
  },
  args: {
    calendarSize: "large",
    theme: "basic",
    weekdayDisplayType: "long-lower",
    monthDisplayType: "long",
    startWeekday: 0,
    eventsData: sampleEvents,
    monthChanged: fn(),
    dateChanged: fn(),
    selectedDateClicked: fn(),
  },
} satisfies Meta<CalendarProps>;

export default meta;
type Story = StoryObj<CalendarProps>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    calendarSize: "large",
    theme: "basic",
  },
};

export const Small: Story = {
  args: {
    calendarSize: "small",
    theme: "basic",
  },
};

export const GlassTheme: Story = {
  args: {
    calendarSize: "large",
    theme: "glass",
  },
};

export const WithEvents: Story = {
  args: {
    calendarSize: "large",
    theme: "basic",
    eventsData: sampleEvents,
  },
};

export const MondayStart: Story = {
  args: {
    calendarSize: "large",
    theme: "basic",
    startWeekday: 1,
    weekdayDisplayType: "long-lower",
  },
};

export const ShortWeekdays: Story = {
  args: {
    calendarSize: "large",
    theme: "basic",
    weekdayDisplayType: "short",
  },
};

export const ShortMonths: Story = {
  args: {
    calendarSize: "large",
    theme: "basic",
    monthDisplayType: "short",
  },
};

export const DisabledPickers: Story = {
  args: {
    calendarSize: "large",
    theme: "basic",
    disableMonthYearPickers: true,
  },
};

export const DisabledDayClick: Story = {
  args: {
    calendarSize: "large",
    theme: "basic",
    disableDayClick: true,
  },
};

export const CustomFonts: Story = {
  args: {
    calendarSize: "large",
    theme: "basic",
    fontFamilyHeader: "Georgia, serif",
    fontFamilyWeekdays: "Arial, sans-serif",
    fontFamilyBody: "Courier New, monospace",
  },
};

export const CustomStyling: Story = {
  args: {
    calendarSize: "large",
    theme: "basic",
    dropShadow: "0 4px 8px rgba(0,0,0,0.3)",
    border: "2px solid #e0e0e0",
    borderRadius: "12px",
  },
};

// Stories showcasing different color themes and configurations from the image

export const SkyBlueTheme: Story = {
  args: {
    primaryColor: "#04AFDF",
    theme: "glass",
    border: "7px solid #04AFDF",
    weekdayDisplayType: "long-upper",
    monthDisplayType: "long",
    headerBackgroundColor: "#04AFDF",
    eventsData: sampleEvents,
  },
};

export const GlassLeftAlignTheme: Story = {
  args: {
    id: "#calendar-a",
    theme: "glass",
    weekdayDisplayType: "long-upper",
    monthDisplayType: "long",
    calendarSize: "small",
    layoutModifiers: ["month-left-align"],
    eventsData: sampleEvents,
  },
};

export const BlackYellowTheme: Story = {
  args: {
    primaryColor: "#000000",
    theme: "glass",
    border: "7px solid #000000",
    headerColor: "#eab308",
    weekdayDisplayType: "long-upper",
    monthDisplayType: "long",
    headerBackgroundColor: "#000000",
    eventsData: sampleEvents,
  },
};

export const CrossMonthDateRanges: Story = {
  args: {
    calendarSize: "large",
    theme: "basic",
    eventsData: [
      {
        start: "2024-09-24T00:00:00",
        end: "2024-10-05T23:59:59",
        name: "Cross-month event (Sept 24 - Oct 5)",
        color: "#ff6b6b",
      },
      {
        start: "2024-09-15T00:00:00",
        end: "2024-09-20T23:59:59",
        name: "Single month event (Sept 15-20)",
        color: "#4ecdc4",
      },
      {
        start: "2024-10-10T00:00:00",
        end: "2024-10-15T23:59:59",
        name: "Single month event (Oct 10-15)",
        color: "#45b7d1",
      },
      {
        start: "2024-08-15T00:00:00",
        end: "2024-09-15T23:59:59",
        name: "Long event (Aug 15 - Sep 15)",
        color: "#96ceb4",
      },
      {
        start: "2024-11-01T00:00:00",
        end: "2024-12-31T23:59:59",
        name: "Very long event (Nov 1 - Dec 31)",
        color: "#feca57",
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "This story demonstrates cross-month date ranges. Navigate between months to see how events spanning multiple months are displayed correctly. The cross-month event should appear in both September (from the 24th) and October (until the 5th).",
      },
    },
  },
};

export const CrossMonthDateRangesSeptember: Story = {
  args: {
    calendarSize: "large",
    theme: "glass",
    primaryColor: "#4ecdc4",
    initialDate: new Date(2024, 8, 1), // September 2024
    eventsData: [
      {
        start: "2024-09-24T00:00:00",
        end: "2024-10-05T23:59:59",
        name: "Cross-month event (Sept 24 - Oct 5)",
        color: "#ff6b6b",
      },
      {
        start: "2024-09-15T00:00:00",
        end: "2024-09-20T23:59:59",
        name: "Single month event (Sept 15-20)",
        color: "#4ecdc4",
      },
      {
        start: "2024-09-01T00:00:00",
        end: "2024-09-30T23:59:59",
        name: "Full month event (Sept 1-30)",
        color: "#45b7d1",
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "This story starts in September 2024 to better demonstrate cross-month functionality. The calendar is set to September 2024, and you can navigate to October to see how the cross-month event (Sept 24 - Oct 5) appears in both months. The full month event should appear throughout September.",
      },
    },
  },
};

export const EventColors: Story = {
  args: {
    calendarSize: "large",
    theme: "basic",
    eventBulletMode: "multiple",
    initialDate: new Date(2024, 8, 1), // September 2024
    eventsData: [
      {
        start: "2024-09-15T00:00:00",
        end: "2024-09-20T23:59:59",
        name: "Red Event (Sept 15-20)",
        color: "#ff0000",
      },
      {
        start: "2024-09-15T00:00:00",
        end: "2024-09-20T23:59:59",
        name: "Pink Event (Sept 15-20)",
        color: "pink",
      },
      {
        start: "2024-09-15T00:00:00",
        end: "2024-09-20T23:59:59",
        name: "Green Event (Sept 15-20)",
        color: "green",
      },
      {
        start: "2024-09-15T00:00:00",
        end: "2024-09-20T23:59:59",
        name: "Brown Event (Sept 15-20)",
        color: "brown",
      },
      {
        start: "2024-09-18T00:00:00",
        end: "2024-09-25T23:59:59",
        name: "Blue Event (Sept 18-25)",
      },
      {
        start: "2024-09-18T00:00:00",
        end: "2024-09-25T23:59:59",
        name: "Blue Event (Sept 18-25)",
      },
      {
        start: "2024-09-22T00:00:00",
        end: "2024-09-22T23:59:59",
        name: "Green Event (Sept 22)",
        color: "#00ff00",
      },
      {
        start: "2024-09-24T00:00:00",
        end: "2024-10-05T23:59:59",
        name: "Purple Cross-Month Event (Sept 24 - Oct 5)",
        color: "#800080",
      },
      {
        start: "2024-09-26T00:00:00",
        end: "2024-09-26T23:59:59",
        name: "Orange Event (Sept 26)",
        color: "#ffa500",
      },
      {
        start: "2024-09-28T00:00:00",
        end: "2024-09-28T23:59:59",
        name: "Cyan Event (Sept 28)",
        color: "#00ffff",
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "This story demonstrates individual event colors. Each event has its own color that is displayed as a colored bullet on the calendar. Notice how multiple events on the same day (like Sept 22, 24, 26, 28) show multiple colored bullets. The cross-month event maintains its purple color in both September and October. When you click on a date with events, the bullets will turn white to provide better contrast against the selected date background.",
      },
    },
  },
};

export const SingleBulletMode: Story = {
  args: {
    calendarSize: "large",
    theme: "basic",
    eventBulletMode: "single",
    initialDate: new Date(2024, 8, 1), // September 2024
    eventsData: [
      {
        start: "2024-09-15T00:00:00",
        end: "2024-09-20T23:59:59",
        name: "Red Event (Sept 15-20)",
        color: "#ff0000",
      },
      {
        start: "2024-09-15T00:00:00",
        end: "2024-09-20T23:59:59",
        name: "Blue Event (Sept 15-20)",
      },
      {
        start: "2024-09-15T00:00:00",
        end: "2024-09-20T23:59:59",
        name: "Green Event (Sept 15-20)",
        color: "#00ff00",
      },
      {
        start: "2024-09-18T00:00:00",
        end: "2024-09-25T23:59:59",
        name: "Purple Event (Sept 18-25)",
        color: "#800080",
      },
      {
        start: "2024-09-22T00:00:00",
        end: "2024-09-22T23:59:59",
        name: "Orange Event (Sept 22)",
        color: "#ffa500",
      },
      {
        start: "2024-09-24T00:00:00",
        end: "2024-10-05T23:59:59",
        name: "Cyan Cross-Month Event (Sept 24 - Oct 5)",
        color: "#00ffff",
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "This story demonstrates single bullet mode. When multiple events occur on the same day, only one bullet is shown (using the first event's color). This provides a cleaner, less cluttered appearance. Notice how Sept 15 has multiple events but only shows one red bullet.",
      },
    },
  },
};

export const AllFeaturesDemo: Story = {
  args: {
    calendarSize: "large",
    theme: "glass",
    eventBulletMode: "multiple",
    primaryColor: "#4ecdc4",
    initialDate: new Date(2024, 8, 1), // September 2024
    eventsData: [
      // Multiple events on same day (Sept 15) - shows multiple bullets (max 5)
      {
        start: "2024-09-15T00:00:00",
        end: "2024-09-15T23:59:59",
        name: "Team Meeting",
        color: "#ff6b6b",
      },
      {
        start: "2024-09-15T00:00:00",
        end: "2024-09-15T23:59:59",
        name: "Client Call",
        color: "#4ecdc4",
      },
      {
        start: "2024-09-15T00:00:00",
        end: "2024-09-15T23:59:59",
        name: "Project Review",
        color: "#45b7d1",
      },
      {
        start: "2024-09-15T00:00:00",
        end: "2024-09-15T23:59:59",
        name: "Design Review",
        color: "#96ceb4",
      },
      {
        start: "2024-09-15T00:00:00",
        end: "2024-09-15T23:59:59",
        name: "Code Review",
        color: "#feca57",
      },
      {
        start: "2024-09-15T00:00:00",
        end: "2024-09-15T23:59:59",
        name: "Extra Event 1",
        color: "#ff9ff3",
      },
      {
        start: "2024-09-15T00:00:00",
        end: "2024-09-15T23:59:59",
        name: "Extra Event 2",
        color: "#a8e6cf",
      },
      // Single event with custom color (Sept 18)
      {
        start: "2024-09-18T00:00:00",
        end: "2024-09-18T23:59:59",
        name: "Workshop",
        color: "#96ceb4",
      },
      // Cross-month event (Sept 24 - Oct 5)
      {
        start: "2024-09-24T00:00:00",
        end: "2024-10-05T23:59:59",
        name: "Conference (Sept 24 - Oct 5)",
        color: "#feca57",
      },
      // Event without color (uses primary color)
      {
        start: "2024-09-22T00:00:00",
        end: "2024-09-22T23:59:59",
        name: "No Color Event",
      },
      // Long single-day event
      {
        start: "2024-09-28T00:00:00",
        end: "2024-09-28T23:59:59",
        name: "All Day Event",
        color: "#ff9ff3",
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: `
# All Features Demo

This comprehensive story demonstrates all the new features of the Color Calendar:

## Features Showcased

### 1. Multiple Event Bullets (Max 5)
- **Sept 15**: Seven events with different colors, but only 5 bullets are shown to prevent overflow
- Notice how the bullets are positioned side by side and limited to 5 maximum

### 2. Individual Event Colors
- Each event has its own distinct color
- Colors support hex values, CSS color names, and other valid CSS color formats

### 3. Cross-Month Date Ranges
- **Conference event**: Spans from Sept 24 to Oct 5
- Navigate between September and October to see it appears in both months
- The event maintains its yellow color in both months

### 4. White Bullets on Selection
- Click on any date with events to see the bullets turn white
- This provides better contrast against the selected date background

### 5. Primary Color Fallback
- **Sept 22**: Event without a color uses the primary color (#4ecdc4)
- This ensures all events are visible even without explicit colors

### 6. Glass Theme
- Demonstrates the glass theme with transparency effects
- Shows how the calendar looks with different styling

## Interactive Testing

- **Navigate months**: Use the arrow buttons to see cross-month events
- **Select dates**: Click on dates with events to see white bullets
- **Toggle bullet mode**: Use the controls panel to switch between multiple and single bullet modes
- **Change colors**: Modify the primary color to see how it affects events without colors
        `,
      },
    },
  },
};

export const FiveDotLimit: Story = {
  args: {
    calendarSize: "large",
    theme: "basic",
    eventBulletMode: "multiple",
    initialDate: new Date(2024, 8, 1), // September 2024
    eventsData: [
      // Create 8 events on the same day to demonstrate the 5-dot limit
      {
        start: "2024-09-15T00:00:00",
        end: "2024-09-15T23:59:59",
        name: "Morning Standup",
        color: "#ff6b6b",
      },
      {
        start: "2024-09-15T00:00:00",
        end: "2024-09-15T23:59:59",
        name: "Client Meeting",
        color: "#4ecdc4",
      },
      {
        start: "2024-09-15T00:00:00",
        end: "2024-09-15T23:59:59",
        name: "Code Review",
        color: "#45b7d1",
      },
      {
        start: "2024-09-15T00:00:00",
        end: "2024-09-15T23:59:59",
        name: "Design Session",
        color: "#96ceb4",
      },
      {
        start: "2024-09-15T00:00:00",
        end: "2024-09-15T23:59:59",
        name: "Team Lunch",
        color: "#feca57",
      },
      {
        start: "2024-09-15T00:00:00",
        end: "2024-09-15T23:59:59",
        name: "Extra Event 1",
        color: "#ff9ff3",
      },
      {
        start: "2024-09-15T00:00:00",
        end: "2024-09-15T23:59:59",
        name: "Extra Event 2",
        color: "#a8e6cf",
      },
      {
        start: "2024-09-15T00:00:00",
        end: "2024-09-15T23:59:59",
        name: "Extra Event 3",
        color: "#dda0dd",
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: `
# 5-Dot Limit Feature

This story demonstrates the 5-dot limit feature that prevents calendar overflow when there are many events on the same day.

## What You'll See

- **Sept 15**: 8 events are defined, but only 5 bullets are displayed
- The first 5 events are shown with their respective colors
- The remaining 3 events are not visually represented to prevent UI overflow
- Bullets are properly positioned side by side

## Benefits

- **Prevents UI Overflow**: Keeps the calendar clean and readable
- **Maintains Performance**: Reduces DOM complexity
- **User Experience**: Clear visual indication without cluttering
- **Responsive Design**: Works well on all screen sizes

## Technical Details

- Maximum of 5 bullets per day in multiple bullet mode
- Single bullet mode is unaffected (always shows 1 bullet)
- Events beyond the limit are still stored and accessible via API
- Positioning automatically adjusts based on actual bullet count
        `,
      },
    },
  },
};

// Helper function to generate dynamic events for the current month
function generateDynamicEvents() {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Generate events for the current month and next month

  // Events for current month
  const currentMonthEvents = [
    {
      start: new Date(currentYear, currentMonth, 5).toISOString(),
      end: new Date(currentYear, currentMonth, 5, 23, 59, 59).toISOString(),
      name: "Team Meeting",
      color: "#ff6b6b",
      description: "Weekly team standup meeting",
    },
    {
      start: new Date(currentYear, currentMonth, 5).toISOString(),
      end: new Date(currentYear, currentMonth, 5, 23, 59, 59).toISOString(),
      name: "Client Call",
      color: "#4ecdc4",
      description: "Important client presentation",
    },
    {
      start: new Date(currentYear, currentMonth, 12).toISOString(),
      end: new Date(currentYear, currentMonth, 12, 23, 59, 59).toISOString(),
      name: "Workshop",
      color: "#96ceb4",
      description: "Technical workshop on new frameworks",
    },
    {
      start: new Date(currentYear, currentMonth, 18).toISOString(),
      end: new Date(currentYear, currentMonth, 18, 23, 59, 59).toISOString(),
      name: "Conference",
      color: "#feca57",
      description: "Annual developer conference",
    },
    {
      start: new Date(currentYear, currentMonth, 25).toISOString(),
      end: new Date(currentYear, currentMonth + 1, 3, 23, 59, 59).toISOString(),
      name: "Vacation",
      color: "#45b7d1",
      description: "Family vacation time",
    },
    {
      start: new Date(currentYear, currentMonth, 28).toISOString(),
      end: new Date(currentYear, currentMonth, 28, 23, 59, 59).toISOString(),
      name: "Project Review",
      color: "#9b59b6",
      description: "Monthly project review meeting",
    },
    {
      start: new Date(currentYear, currentMonth, 30).toISOString(),
      end: new Date(currentYear, currentMonth, 30, 23, 59, 59).toISOString(),
      name: "Training Session",
      color: "#e67e22",
      description: "New technology training",
    },
  ];

  // Add some events for next month too
  const nextMonthEvents = [
    {
      start: new Date(currentYear, currentMonth + 1, 2).toISOString(),
      end: new Date(currentYear, currentMonth + 1, 2, 23, 59, 59).toISOString(),
      name: "Planning Meeting",
      color: "#1abc9c",
      description: "Quarterly planning session",
    },
    {
      start: new Date(currentYear, currentMonth + 1, 8).toISOString(),
      end: new Date(currentYear, currentMonth + 1, 8, 23, 59, 59).toISOString(),
      name: "Product Demo",
      color: "#e74c3c",
      description: "Product demonstration for stakeholders",
    },
  ];

  return [...currentMonthEvents, ...nextMonthEvents];
}

export const FunctionIdDemo: Story = {
  args: {
    calendarSize: "large",
    theme: "basic",
    eventBulletMode: "multiple",
    eventsData: generateDynamicEvents(),
    id: () => {
      // This function dynamically creates and returns a calendar container
      let container = document.getElementById("dynamic-calendar-container");
      if (!container) {
        container = document.createElement("div");
        container.id = "dynamic-calendar-container";
        container.style.cssText = `
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        `;
        document.body.appendChild(container);
      }
      return container;
    },
  },
  parameters: {
    docs: {
      description: {
        story: `
# Function-Based ID Demo

This story demonstrates the **function-based id parameter** feature, which allows you to pass a function that returns an HTMLElement instead of a string selector.

## Key Features

### 🔧 Dynamic Element Resolution
- **Function ID**: Pass a function that returns an HTMLElement
- **Dynamic Creation**: Elements can be created on-demand
- **Flexible Integration**: Perfect for dynamic UIs and frameworks

### 💡 Use Cases
- **Dynamic UI Creation**: Create calendar containers programmatically
- **Framework Integration**: Work with React, Vue, Angular, etc.
- **Conditional Rendering**: Show/hide calendars based on conditions
- **Lazy Loading**: Create elements only when needed

## Code Examples

### Basic Function ID
\`\`\`javascript
const calendar = new ColorCalendar({
  id: () => document.getElementById("my-calendar"),
  // ... other options
});
\`\`\`

### Dynamic Element Creation
\`\`\`javascript
const calendar = new ColorCalendar({
  id: () => {
    let container = document.getElementById("calendar-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "calendar-container";
      document.body.appendChild(container);
    }
    return container;
  },
  // ... other options
});
\`\`\`

### Framework Integration Example
\`\`\`javascript
// React example
const calendar = new ColorCalendar({
  id: () => document.querySelector("#react-calendar-root"),
  // ... other options
});

// Vue example
const calendar = new ColorCalendar({
  id: () => this.$refs.calendarContainer,
  // ... other options
});
\`\`\`

## Benefits

- **Type Safety**: Full TypeScript support
- **Backward Compatible**: String IDs still work
- **Error Handling**: Clear error messages for failed lookups
- **Performance**: Function is only called once during initialization
- **Flexibility**: Can implement complex element resolution logic

## Try It Out!

This demo creates a dynamically styled calendar container with a gradient background. The function ensures the container exists before returning it, demonstrating real-world usage patterns.
        `,
      },
    },
  },
};

export const EventHandlingDemo: Story = {
  args: {
    calendarSize: "large",
    theme: "basic",
    eventBulletMode: "multiple",
    eventsData: generateDynamicEvents(),
    dateChanged: (currentDate, filteredDateEvents) => {
      console.log("📅 Date Changed Event Fired!");
      console.log("Selected Date:", currentDate);
      console.log("Events on this date:", filteredDateEvents);

      // Update the events list in the UI
      updateEventsList(currentDate, filteredDateEvents);
    },
    monthChanged: (currentDate, filteredMonthEvents) => {
      console.log("📆 Month Changed Event Fired!");
      console.log("Current Month:", currentDate);
      console.log("Events this month:", filteredMonthEvents);

      // Simulate refreshing data for the new month
      if (currentDate && filteredMonthEvents) {
        const eventCount = filteredMonthEvents.length;
        console.log(
          `Loaded ${eventCount} events for ${currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}`
        );
      }
    },
    selectedDateClicked: (currentDate, filteredMonthEvents) => {
      console.log("🖱️ Selected Date Clicked Event Fired!");
      console.log("Clicked Date:", currentDate);
      console.log("All month events:", filteredMonthEvents);

      // Show month events in the details panel
      updateEventsList(currentDate, filteredMonthEvents, true);
    },
  },
  render: (args) => {
    // Create a container with the calendar and events list
    const container = document.createElement("div");
    container.style.cssText = `
      display: flex;
      gap: 20px;
      padding: 20px;
      background: #f5f5f5;
      border-radius: 8px;
    `;

    // Create calendar container
    const calendarContainer = document.createElement("div");
    calendarContainer.style.cssText = `
      flex: 1;
      max-width: 400px;
    `;

    // Create events list container
    const eventsContainer = document.createElement("div");
    eventsContainer.id = "events-list";
    eventsContainer.style.cssText = `
      flex: 1;
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      min-height: 300px;
    `;

    // Add initial content to events list
    eventsContainer.innerHTML = `
      <div class="events-header">
        <h3>Select a date to view events</h3>
        <span class="event-count">0 events</span>
      </div>
      <div class="events-content">
        <div class="no-events">Click on any date with events to see them here</div>
      </div>
    `;

    // Add styles for the events list
    const style = document.createElement("style");
    style.textContent = `
      .events-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 2px solid #e0e0e0;
      }
      .events-header h3 {
        margin: 0;
        color: #333;
        font-size: 18px;
      }
      .event-count {
        background: #007bff;
        color: white;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: bold;
      }
      .event-item {
        background: #f8f9fa;
        border-radius: 6px;
        padding: 12px;
        margin-bottom: 8px;
        border-left: 4px solid #007bff;
      }
      .event-name {
        font-weight: bold;
        color: #333;
        margin-bottom: 4px;
      }
      .event-description {
        color: #666;
        font-size: 14px;
        margin-bottom: 4px;
      }
      .event-dates {
        color: #888;
        font-size: 12px;
      }
      .no-events {
        text-align: center;
        color: #999;
        font-style: italic;
        padding: 20px;
      }
    `;
    document.head.appendChild(style);

    // Create the calendar
    const calendarElement = createCalendar(args);
    calendarContainer.appendChild(calendarElement);

    // Set the calendar to the current month so users see events immediately
    // Use a timeout to ensure the calendar is fully initialized
    setTimeout(() => {
      const calendarElement = calendarContainer.querySelector(".color-calendar") as HTMLElement;
      if (
        calendarElement &&
        (
          calendarElement as HTMLElement & {
            __calendarInstance?: { setDate: (date: Date) => void };
          }
        ).__calendarInstance
      ) {
        (
          calendarElement as HTMLElement & { __calendarInstance: { setDate: (date: Date) => void } }
        ).__calendarInstance.setDate(new Date());
      }
    }, 100);

    // Add both containers to the main container
    container.appendChild(calendarContainer);
    container.appendChild(eventsContainer);

    return container;
  },
  parameters: {
    docs: {
      description: {
        story: `
# Event Handling Demo

This story demonstrates the powerful event handling capabilities of the Color Calendar with a **visual events list** that updates in real-time! 

**🎯 Dynamic Events**: Events are automatically generated for the current month, so you can immediately see and interact with them when you land on this story.

## Interactive Features

### 📅 Date Changed Event
- **Trigger**: When you click on any date
- **Data**: Provides the selected date and events for that specific date
- **Visual**: Events list updates to show events for the selected date
- **Use Cases**: 
  - Load event details for the selected date
  - Update a details panel or sidebar
  - Fetch additional data based on the date

### 📆 Month Changed Event  
- **Trigger**: When navigating between months (using arrows or month picker)
- **Data**: Provides the current date and all events for the month
- **Use Cases**:
  - Refresh data for the new month
  - Update month-specific UI elements
  - Preload events for better performance

### 🖱️ Selected Date Clicked Event
- **Trigger**: When clicking on the currently selected date
- **Data**: Provides the clicked date and all month events
- **Visual**: Shows all events for the month instead of just the selected date
- **Use Cases**:
  - Open detailed views or modals
  - Toggle additional information
  - Implement custom interactions

## Try It Out!

1. **Click on different dates** - See the events list update in real-time
2. **Navigate between months** - Watch the console for \`monthChanged\` events
3. **Click on the same date twice** - See all month events displayed
4. **Check the console** - See detailed event data being logged

## Real-World Applications

- **Event Management**: Load event details when dates are selected
- **Data Visualization**: Update charts and graphs based on selected dates
- **Form Integration**: Pre-populate forms with date-specific data
- **Navigation**: Build custom navigation flows based on user interactions
- **Analytics**: Track user interactions for better UX insights

## Code Example

\`\`\`javascript
const calendar = new ColorCalendar({
  id: '#calendar',
  eventsData: events,
  dateChanged: (currentDate, filteredDateEvents) => {
    // Update your UI with the selected date's events
    updateEventDetailsPanel(filteredDateEvents);
  },
  monthChanged: (currentDate, filteredMonthEvents) => {
    // Refresh data for the new month
    loadMonthData(currentDate);
  },
  selectedDateClicked: (currentDate, filteredMonthEvents) => {
    // Open detailed view or modal
    openEventModal(currentDate);
  }
});
\`\`\`
        `,
      },
    },
  },
};
