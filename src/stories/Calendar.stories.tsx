import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { fn } from "storybook/test";
import type Calendar from "../index";
import type { EventData } from "../types";
import { generateDynamicEvents, generateDynamicEventsForMonth } from "./generateDynamicEvents";
import type { HTMLCalendarWrapperProps } from "./HTMLCalendarWrapper";
import HTMLCalendarWrapper from "./HTMLCalendarWrapper";

const meta: Meta<HTMLCalendarWrapperProps> = {
  title: "HTML/Calendar",
  component: HTMLCalendarWrapper,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Color Calendar - A customizable events calendar component library.",
      },
    },
  },
  argTypes: {
    initialSelectedDate: {
      control: "date",
      description: "Initial selected date for the calendar",
    },
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
    onMonthChange: { action: "onMonthChange" },
    onSelectedDateChange: { action: "onSelectedDateChange" },
    onSelectedDateClick: { action: "onSelectedDateClick" },
  },
  args: {
    calendarSize: "large",
    theme: "basic",
    weekdayDisplayType: "long-lower",
    monthDisplayType: "long",
    startWeekday: 0,
    eventsData: generateDynamicEvents(),
    onMonthChange: fn(),
    onSelectedDateChange: fn(),
    onSelectedDateClick: fn(),
  },
};

export default meta;
type Story = StoryObj<HTMLCalendarWrapperProps>;

// ============================================================================
// BASIC CONFIGURATIONS
// ============================================================================

export const Default: Story = {
  args: {
    calendarSize: "large",
    theme: "basic",
    onSelectedDateChange: fn(),
    onMonthChange: fn(),
    onSelectedDateClick: fn(),
  },
};

// ============================================================================
// EVENTS LIST EXAMPLE
// ============================================================================

export const WithEventsList: Story = {
  render: () => {
    // Create a container for the calendar and event list
    const container = document.createElement("div");
    container.style.cssText = `
      display: flex;
      gap: 2rem;
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      min-height: 600px;
      flex-wrap: wrap;
    `;

    // Calendar container
    const calendarContainer = document.createElement("div");

    // Calendar title
    const calendarTitle = document.createElement("h2");
    calendarTitle.textContent = "Calendar";
    calendarTitle.style.cssText = `
      margin-bottom: 1.5rem;
      font-size: 1.5rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 1.5rem 0;
    `;

    // Calendar wrapper
    const calendarWrapper = document.createElement("div");
    calendarWrapper.id = `calendar-${Math.random().toString(36).substr(2, 9)}`;

    // Event list container
    const eventListContainer = document.createElement("div");
    eventListContainer.style.cssText = `
      flex: 1;
      background: #ffffff;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      border: 1px solid #f1f5f9;
      min-height: 500px;
      display: flex;
      flex-direction: column;
    `;

    // Event list header
    const eventListHeader = document.createElement("div");
    eventListHeader.style.cssText = `
      margin-bottom: 1.5rem;
    `;

    const eventListTitle = document.createElement("h3");
    eventListTitle.textContent = "Select a date";
    eventListTitle.style.cssText = `
      margin: 0 0 0.5rem 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
    `;

    const eventListSubtitle = document.createElement("p");
    eventListSubtitle.textContent = "Click on any date to view events";
    eventListSubtitle.style.cssText = `
      margin: 0;
      font-size: 0.875rem;
      color: #6b7280;
    `;

    // Event list content
    const eventListContent = document.createElement("div");
    eventListContent.style.cssText = `
      flex: 1;
      overflow: hidden;
    `;

    // Empty state
    const emptyState = document.createElement("div");
    emptyState.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: #9ca3af;
      text-align: center;
      padding: 2rem;
    `;

    const emptyIcon = document.createElement("div");
    emptyIcon.textContent = "📅";
    emptyIcon.style.cssText = `
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: #f3f4f6;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
      font-size: 1.5rem;
    `;

    const emptyText = document.createElement("p");
    emptyText.textContent = "Click on a date to view events";
    emptyText.style.cssText = `
      margin: 0;
      font-size: 0.875rem;
      font-weight: 500;
    `;

    emptyState.appendChild(emptyIcon);
    emptyState.appendChild(emptyText);
    eventListContent.appendChild(emptyState);

    // Assemble the layout
    calendarContainer.appendChild(calendarTitle);
    calendarContainer.appendChild(calendarWrapper);
    eventListHeader.appendChild(eventListTitle);
    eventListHeader.appendChild(eventListSubtitle);
    eventListContainer.appendChild(eventListHeader);
    eventListContainer.appendChild(eventListContent);
    container.appendChild(calendarContainer);
    container.appendChild(eventListContainer);

    // Generate dynamic events for current month
    const generateDynamicEvents = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

      return [
        {
          start: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(Math.min(3, daysInMonth)).padStart(2, "0")}`,
          end: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(Math.min(3, daysInMonth)).padStart(2, "0")}`,
          color: "#3b82f6",
          name: "Team Standup",
          description: "Daily team synchronization",
        },
        {
          start: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(Math.min(7, daysInMonth)).padStart(2, "0")}`,
          end: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(Math.min(7, daysInMonth)).padStart(2, "0")}`,
          color: "#10b981",
          name: "Client Meeting",
          description: "Quarterly business review",
        },
        {
          start: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(Math.min(12, daysInMonth)).padStart(2, "0")}`,
          end: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(Math.min(12, daysInMonth)).padStart(2, "0")}`,
          color: "#f59e0b",
          name: "Code Review",
          description: "Technical review session",
        },
        {
          start: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(Math.min(15, daysInMonth)).padStart(2, "0")}`,
          end: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(Math.min(17, daysInMonth)).padStart(2, "0")}`,
          color: "#ef4444",
          name: "Sprint Planning",
          description: "Planning next development sprint",
        },
        {
          start: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(Math.min(20, daysInMonth)).padStart(2, "0")}`,
          end: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(Math.min(20, daysInMonth)).padStart(2, "0")}`,
          color: "#8b5cf6",
          name: "Design Workshop",
          description: "UI/UX design session",
        },
        {
          start: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(Math.min(25, daysInMonth)).padStart(2, "0")}`,
          end: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(Math.min(25, daysInMonth)).padStart(2, "0")}`,
          color: "#06b6d4",
          name: "Demo Day",
          description: "Product demonstration",
        },
      ];
    };

    const dynamicEvents = generateDynamicEvents();

    // Function to update event list
    const updateEventList = (selectedDate?: Date, events?: EventData[]) => {
      if (selectedDate && events && events.length > 0) {
        const formatDate = (date: Date) => {
          return date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        };

        eventListTitle.textContent = formatDate(selectedDate);
        eventListSubtitle.textContent = `${events.length} event${events.length !== 1 ? "s" : ""} scheduled`;

        // Clear existing content
        eventListContent.innerHTML = "";

        // Create events container
        const eventsContainer = document.createElement("div");
        eventsContainer.style.cssText = `
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          height: 100%;
          overflow-y: auto;
          padding-right: 0.5rem;
        `;

        // Add each event
        events.forEach((event) => {
          const eventElement = document.createElement("div");
          eventElement.style.cssText = `
            padding: 1rem;
            background: #f8fafc;
            border-radius: 12px;
            border-left: 4px solid ${event.color};
            border: 1px solid #e2e8f0;
          `;

          const eventName = document.createElement("div");
          eventName.textContent =
            (event["name"] as string) || (event["title"] as string) || "Untitled Event";
          eventName.style.cssText = `
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 0.25rem;
            font-size: 0.875rem;
          `;

          const eventDescription = document.createElement("div");
          eventDescription.textContent = (event["description"] as string) || "";
          eventDescription.style.cssText = `
            color: #64748b;
            font-size: 0.75rem;
            margin-bottom: 0.5rem;
            line-height: 1.4;
          `;

          const eventDate = document.createElement("div");
          eventDate.innerHTML = `
            <span>📅</span>
            <span>
              ${new Date(event.start).toLocaleDateString()} - 
              ${new Date(event.end).toLocaleDateString()}
            </span>
          `;
          eventDate.style.cssText = `
            color: #94a3b8;
            font-size: 0.75rem;
            display: flex;
            align-items: center;
            gap: 0.25rem;
          `;

          eventElement.appendChild(eventName);
          eventElement.appendChild(eventDescription);
          eventElement.appendChild(eventDate);
          eventsContainer.appendChild(eventElement);
        });

        eventListContent.appendChild(eventsContainer);
      } else {
        eventListTitle.textContent = selectedDate ? "No events scheduled" : "Select a date";
        eventListSubtitle.textContent = selectedDate
          ? "No events scheduled"
          : "Click on any date to view events";

        // Clear and show empty state
        eventListContent.innerHTML = "";
        eventListContent.appendChild(emptyState);
      }
    };

    // Initialize calendar
    const calendarOptions = {
      container: calendarWrapper,
      calendarSize: "large" as const,
      theme: "glass" as const,
      primaryColor: "#3b82f6",
      eventsData: dynamicEvents,
      eventBulletMode: "multiple" as const,
      onSelectedDateChange: updateEventList,
    };

    // Use requestAnimationFrame for reliable DOM timing
    requestAnimationFrame(() => {
      try {
        // Import Calendar dynamically
        import("../index").then(({ default: Calendar }) => {
          new Calendar(calendarOptions);
        });
      } catch (error) {
        console.error("Calendar initialization error:", error);
      }
    });

    // Return a React element that renders the container
    return React.createElement("div", {
      ref: (el: HTMLDivElement | null) => {
        if (el) {
          el.appendChild(container);
        }
      },
    });
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Calendar with dynamic events and a clean, minimal event list design. Events are generated for the current month and are immediately visible on the calendar. Features professional styling and clean typography with responsive layout.",
      },
    },
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

// ============================================================================
// DISPLAY OPTIONS
// ============================================================================

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

// ============================================================================
// DISABLED FEATURES
// ============================================================================

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

export const DisabledMonthArrows: Story = {
  args: {
    calendarSize: "large",
    theme: "basic",
    disableMonthArrowClick: true,
  },
};

// ============================================================================
// STYLING OPTIONS
// ============================================================================

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

export const CustomColors: Story = {
  args: {
    calendarSize: "large",
    theme: "glass",
    primaryColor: "#4ecdc4",
    headerColor: "#2c3e50",
    headerBackgroundColor: "#ecf0f1",
    weekdaysColor: "#34495e",
  },
};

// ============================================================================
// EVENT FEATURES
// ============================================================================

export const WithEvents: Story = {
  args: {
    calendarSize: "large",
    theme: "basic",
    eventsData: generateDynamicEvents(),
  },
};

export const MultipleBulletMode: Story = {
  args: {
    calendarSize: "large",
    theme: "basic",
    eventBulletMode: "multiple",
    eventsData: generateDynamicEvents(),
  },
};

export const SingleBulletMode: Story = {
  args: {
    calendarSize: "large",
    theme: "basic",
    eventBulletMode: "single",
    eventsData: generateDynamicEvents(),
  },
};

// ============================================================================
// INITIAL SELECTED DATE
// ============================================================================

export const WithInitialSelectedDate: Story = {
  args: {
    calendarSize: "large",
    theme: "basic",
    initialSelectedDate: new Date(2024, 5, 15), // June 15, 2024
    eventsData: generateDynamicEventsForMonth(2024, 5), // Generate events for June 2024
  },
  parameters: {
    docs: {
      description: {
        story:
          "Calendar with a pre-selected date (June 15, 2024). The calendar will open with this date selected and the view will be set to the month containing this date.",
      },
    },
  },
};

// ============================================================================
// NO INITIAL SELECTION
// ============================================================================

export const NoInitialSelection: Story = {
  args: {
    calendarSize: "large",
    theme: "basic",
    initialSelectedDate: null, // No date selected initially
    eventsData: generateDynamicEventsForMonth(2024, 5), // Generate events for June 2024
  },
  parameters: {
    docs: {
      description: {
        story:
          "Calendar with no initial selection. The calendar shows the current month but no date is highlighted. Users can click on any date to select it.",
      },
    },
  },
};

// ============================================================================
// INTERACTIVE NULL SELECTION DEMO
// ============================================================================

export const InteractiveNullSelectionDemo: Story = {
  render: () => {
    // Create a container for the calendar and controls
    const container = document.createElement("div");
    container.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 2rem;
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    // Create control panel
    const controlPanel = document.createElement("div");
    controlPanel.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1.5rem;
      background-color: #f8fafc;
      border-radius: 0.5rem;
      border: 1px solid #e2e8f0;
    `;

    const title = document.createElement("h3");
    title.textContent = "Interactive Null Selection Demo";
    title.style.cssText = `
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
    `;

    const buttonContainer = document.createElement("div");
    buttonContainer.style.cssText = `
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    `;

    // Create buttons
    const setTodayBtn = document.createElement("button");
    setTodayBtn.textContent = "Set Today";
    setTodayBtn.style.cssText = `
      padding: 0.5rem 1rem;
      background-color: #3b82f6;
      color: white;
      border: none;
      border-radius: 0.375rem;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
    `;

    const setSpecificDateBtn = document.createElement("button");
    setSpecificDateBtn.textContent = "Set June 15, 2024";
    setSpecificDateBtn.style.cssText = `
      padding: 0.5rem 1rem;
      background-color: #10b981;
      color: white;
      border: none;
      border-radius: 0.375rem;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
    `;

    const clearSelectionBtn = document.createElement("button");
    clearSelectionBtn.textContent = "Clear Selection";
    clearSelectionBtn.style.cssText = `
      padding: 0.5rem 1rem;
      background-color: #ef4444;
      color: white;
      border: none;
      border-radius: 0.375rem;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
    `;

    // Status display
    const statusDisplay = document.createElement("div");
    statusDisplay.style.cssText = `
      padding: 0.75rem;
      background-color: #fef3c7;
      border-radius: 0.375rem;
      border: 1px solid #fde68a;
    `;

    const statusText = document.createElement("p");
    statusText.textContent = "Selected Date: None";
    statusText.style.cssText = `
      margin: 0;
      font-size: 0.875rem;
      font-weight: 500;
      color: #1e293b;
    `;

    statusDisplay.appendChild(statusText);

    // Calendar container
    const calendarContainer = document.createElement("div");
    calendarContainer.style.cssText = `
      display: flex;
      justify-content: center;
    `;

    // Calendar wrapper
    const calendarWrapper = document.createElement("div");
    calendarWrapper.id = `color-calendar-${Math.random().toString(36).substr(2, 9)}`;
    calendarWrapper.style.cssText = `
      width: 100%;
      max-width: 400px;
    `;

    // Assemble the UI
    buttonContainer.appendChild(setTodayBtn);
    buttonContainer.appendChild(setSpecificDateBtn);
    buttonContainer.appendChild(clearSelectionBtn);

    controlPanel.appendChild(title);
    controlPanel.appendChild(buttonContainer);
    controlPanel.appendChild(statusDisplay);

    calendarContainer.appendChild(calendarWrapper);

    container.appendChild(controlPanel);
    container.appendChild(calendarContainer);

    // Calendar instance
    let calendar: Calendar | null = null;

    // Update status display
    const updateStatus = (selectedDate: Date | null) => {
      if (selectedDate) {
        const formattedDate = selectedDate.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        statusText.textContent = `Selected Date: ${formattedDate}`;
        statusDisplay.style.backgroundColor = "#dcfce7";
        statusDisplay.style.borderColor = "#bbf7d0";
      } else {
        statusText.textContent = "Selected Date: None";
        statusDisplay.style.backgroundColor = "#fef3c7";
        statusDisplay.style.borderColor = "#fde68a";
      }
    };

    // Event handlers
    setTodayBtn.addEventListener("click", () => {
      if (calendar) {
        calendar.setSelectedDate(new Date());
      }
    });

    setSpecificDateBtn.addEventListener("click", () => {
      if (calendar) {
        calendar.setSelectedDate(new Date(2024, 5, 15));
      }
    });

    clearSelectionBtn.addEventListener("click", () => {
      if (calendar) {
        calendar.setSelectedDate(null);
      }
    });

    // Initialize calendar
    const dynamicEvents = generateDynamicEvents();

    const calendarOptions = {
      container: calendarWrapper,
      calendarSize: "large" as const,
      theme: "basic" as const,
      initialSelectedDate: null, // Start with no selection
      eventsData: dynamicEvents,
      onSelectedDateChange: (currentDate?: Date) => {
        updateStatus(currentDate || null);
      },
    };

    // Use requestAnimationFrame for reliable DOM timing
    requestAnimationFrame(() => {
      try {
        // Import Calendar dynamically
        import("../index").then(({ default: Calendar }) => {
          calendar = new Calendar(calendarOptions);
        });
      } catch (error) {
        console.error("Calendar initialization error:", error);
      }
    });

    // Return a React element that renders the container
    return React.createElement("div", {
      ref: (el: HTMLDivElement | null) => {
        if (el) {
          el.appendChild(container);
        }
      },
    });
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Interactive demonstration of null selection support in the HTML calendar. Use the control buttons to set specific dates, clear the selection, or set today's date. The status display shows the current selection state.",
      },
    },
  },
};
