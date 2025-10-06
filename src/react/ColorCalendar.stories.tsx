import type { Meta, StoryObj } from "@storybook/react";
import { useCallback, useId, useMemo, useState } from "react";
import { fn } from "storybook/test";
import { generateDynamicEvents, generateDynamicEventsForMonth } from "../stories/DynamicEvents";
import type { EventData } from "../types";
import ColorCalendar from "./ColorCalendar";

const meta: Meta<typeof ColorCalendar> = {
  title: "React/ColorCalendar",
  component: ColorCalendar,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A React wrapper component for the Color Calendar library. This component provides a React-friendly interface to the vanilla JavaScript calendar with full TypeScript support.",
      },
    },
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
      description: "Visual theme of the calendar",
    },
    primaryColor: {
      control: { type: "color" },
      description: "Primary color for the calendar",
    },
    headerColor: {
      control: { type: "color" },
      description: "Color of the header text",
    },
    headerBackgroundColor: {
      control: { type: "color" },
      description: "Background color of the header",
    },
    weekdaysColor: {
      control: { type: "color" },
      description: "Color of the weekday labels",
    },
    weekdayDisplayType: {
      control: { type: "select" },
      options: ["short", "long-lower", "long-upper"],
      description: "Display format for weekday labels",
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
    eventBulletMode: {
      control: { type: "select" },
      options: ["multiple", "single"],
      description: "How to display multiple events on the same day",
    },
    disableMonthYearPickers: {
      control: { type: "boolean" },
      description: "Disable month and year picker functionality",
    },
    disableDayClick: {
      control: { type: "boolean" },
      description: "Disable day click functionality",
    },
    disableMonthArrowClick: {
      control: { type: "boolean" },
      description: "Disable month navigation arrows",
    },
    borderRadius: {
      control: { type: "text" },
      description: "Border radius of the calendar",
    },
    dropShadow: {
      control: { type: "text" },
      description: "Drop shadow CSS value",
    },
    border: {
      control: { type: "text" },
      description: "Border CSS value",
    },
    fontFamilyHeader: {
      control: { type: "text" },
      description: "Font family for the header",
    },
    fontFamilyWeekdays: {
      control: { type: "text" },
      description: "Font family for weekday labels",
    },
    fontFamilyBody: {
      control: { type: "text" },
      description: "Font family for the calendar body",
    },
    className: {
      control: { type: "text" },
      description: "CSS class name for the container",
    },
    style: {
      control: { type: "object" },
      description: "Inline styles for the container",
    },
  },
  args: {
    onSelectedDateChange: fn(),
    onMonthChange: fn(),
    onSelectedDateClick: fn(),
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic usage story
export const Default: Story = {
  args: {
    calendarSize: "large",
    theme: "basic",
  },
};

// ============================================================================
// EVENTS LIST EXAMPLE
// ============================================================================

export const WithEventsList: Story = {
  render: () => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [selectedEvents, setSelectedEvents] = useState<EventData[]>([]);

    // Memoize dynamic events to prevent infinite re-renders
    const dynamicEvents = useMemo(() => {
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
    }, []); // Empty dependency array since we want static events for current month

    const handleDateChange = useCallback((date?: Date, events?: EventData[]) => {
      console.log("handleDateChange", date, events);
      setSelectedDate(date);
      setSelectedEvents(events || []);
    }, []);

    const formatDate = (date: Date) => {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    return (
      <div
        style={{
          display: "flex",
          gap: "2rem",
          padding: "2rem",
          maxWidth: "1200px",
          margin: "0 auto",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          minHeight: "600px",
          flexWrap: "wrap",
        }}
      >
        {/* Calendar */}
        <div>
          <h2
            style={{
              marginBottom: "1.5rem",
              fontSize: "1.5rem",
              fontWeight: "600",
              color: "#1f2937",
              margin: "0 0 1.5rem 0",
            }}
          >
            Calendar
          </h2>
          <ColorCalendar
            calendarSize="large"
            theme="glass"
            primaryColor="#3b82f6"
            eventsData={dynamicEvents}
            eventBulletMode="multiple"
            onSelectedDateChange={handleDateChange}
          />
        </div>

        {/* Event List */}
        <div
          style={{
            flex: "1",
            background: "#ffffff",
            borderRadius: "16px",
            padding: "2rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            border: "1px solid #f1f5f9",
            minHeight: "500px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ marginBottom: "1.5rem" }}>
            <h3
              style={{
                margin: "0 0 0.5rem 0",
                fontSize: "1.25rem",
                fontWeight: "600",
                color: "#1f2937",
              }}
            >
              {selectedDate ? formatDate(selectedDate) : "Select a date"}
            </h3>
            <p
              style={{
                margin: "0",
                fontSize: "0.875rem",
                color: "#6b7280",
              }}
            >
              {selectedDate
                ? `${selectedEvents.length} event${selectedEvents.length !== 1 ? "s" : ""} scheduled`
                : "Click on any date to view events"}
            </p>
          </div>

          <div style={{ flex: "1", overflow: "hidden" }}>
            {selectedEvents.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  color: "#9ca3af",
                  textAlign: "center",
                  padding: "2rem",
                }}
              >
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    background: "#f3f4f6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1rem",
                    fontSize: "1.5rem",
                  }}
                >
                  📅
                </div>
                <p style={{ margin: "0", fontSize: "0.875rem", fontWeight: "500" }}>
                  {selectedDate ? "No events scheduled" : "Click on a date to view events"}
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                  height: "100%",
                  overflowY: "auto",
                  paddingRight: "0.5rem",
                }}
              >
                {selectedEvents.map((event, index) => (
                  <div
                    key={`${event.start}-${event["name"]}-${index}`}
                    style={{
                      padding: "1rem",
                      background: "#f8fafc",
                      borderRadius: "12px",
                      borderLeft: `4px solid ${event.color}`,
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "600",
                        color: "#1e293b",
                        marginBottom: "0.25rem",
                        fontSize: "0.875rem",
                      }}
                    >
                      {event["name"]}
                    </div>
                    <div
                      style={{
                        color: "#64748b",
                        fontSize: "0.75rem",
                        marginBottom: "0.5rem",
                        lineHeight: "1.4",
                      }}
                    >
                      {event["description"]}
                    </div>
                    <div
                      style={{
                        color: "#94a3b8",
                        fontSize: "0.75rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                    >
                      <span>📅</span>
                      <span>
                        {new Date(event.start).toLocaleDateString()} -{" "}
                        {new Date(event.end).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
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

// Small calendar
export const Small: Story = {
  args: {
    calendarSize: "small",
    theme: "basic",
    eventsData: generateDynamicEvents(),
  },
};

// Glass theme
export const GlassTheme: Story = {
  args: {
    calendarSize: "large",
    theme: "glass",
    eventsData: generateDynamicEvents(),
    primaryColor: "#007bff",
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
    eventsData: generateDynamicEvents(),
  },
};

export const ShortWeekdays: Story = {
  args: {
    calendarSize: "large",
    theme: "basic",
    weekdayDisplayType: "short",
    eventsData: generateDynamicEvents(),
  },
};

export const ShortMonths: Story = {
  args: {
    calendarSize: "large",
    theme: "basic",
    monthDisplayType: "short",
    eventsData: generateDynamicEvents(),
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
    eventsData: generateDynamicEvents(),
  },
};

export const DisabledDayClick: Story = {
  args: {
    calendarSize: "large",
    theme: "basic",
    disableDayClick: true,
    eventsData: generateDynamicEvents(),
  },
};

export const DisabledMonthArrows: Story = {
  args: {
    calendarSize: "large",
    theme: "basic",
    disableMonthArrowClick: true,
    eventsData: generateDynamicEvents(),
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
    eventsData: generateDynamicEvents(),
  },
};

export const CustomStyling: Story = {
  args: {
    calendarSize: "large",
    theme: "basic",
    dropShadow: "0 4px 8px rgba(0,0,0,0.3)",
    border: "2px solid #e0e0e0",
    borderRadius: "12px",
    eventsData: generateDynamicEvents(),
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
    eventsData: generateDynamicEvents(),
  },
};

// ============================================================================
// EVENT FEATURES
// ============================================================================

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
// CONTROLLED COMPONENT WITH NULL SUPPORT
// ============================================================================

export const ControlledWithNullSupport: Story = {
  render: () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedEvents, setSelectedEvents] = useState<EventData[]>([]);

    // Memoize dynamic events to prevent infinite re-renders
    const dynamicEvents = useMemo(() => generateDynamicEvents(), []);

    const handleDateChange = useCallback((date?: Date, events?: EventData[]) => {
      console.log("Controlled date change:", date, events);
      setSelectedDate(date || null);
      setSelectedEvents(events || []);
    }, []);

    const handleSetDate = useCallback((date: Date) => {
      setSelectedDate(date);
    }, []);

    const handleClearSelection = useCallback(() => {
      setSelectedDate(null);
    }, []);

    const handleToday = useCallback(() => {
      setSelectedDate(new Date());
    }, []);

    const formatDate = (date: Date) => {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          padding: "2rem",
          maxWidth: "800px",
          margin: "0 auto",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        {/* Control Panel */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            padding: "1.5rem",
            backgroundColor: "#f8fafc",
            borderRadius: "0.5rem",
            border: "1px solid #e2e8f0",
          }}
        >
          <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "600", color: "#1e293b" }}>
            Controlled Component with Null Support
          </h3>
          
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={handleToday}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "0.375rem",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: "500",
              }}
            >
              Set Today
            </button>
            
            <button
              type="button"
              onClick={() => handleSetDate(new Date(2024, 5, 15))}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#10b981",
                color: "white",
                border: "none",
                borderRadius: "0.375rem",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: "500",
              }}
            >
              Set June 15, 2024
            </button>
            
            <button
              type="button"
              onClick={handleClearSelection}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "0.375rem",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: "500",
              }}
            >
              Clear Selection
            </button>
          </div>

          <div
            style={{
              padding: "0.75rem",
              backgroundColor: selectedDate ? "#dcfce7" : "#fef3c7",
              borderRadius: "0.375rem",
              border: `1px solid ${selectedDate ? "#bbf7d0" : "#fde68a"}`,
            }}
          >
            <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: "500", color: "#1e293b" }}>
              Selected Date: {selectedDate ? formatDate(selectedDate) : "None"}
            </p>
            {selectedEvents.length > 0 && (
              <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.75rem", color: "#6b7280" }}>
                Events: {selectedEvents.length} event{selectedEvents.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>

        {/* Calendar */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <ColorCalendar
            calendarSize="large"
            theme="basic"
            selectedDate={selectedDate}
            onSelectedDateChange={handleDateChange}
            eventsData={dynamicEvents}
          />
        </div>
      </div>
    );
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Demonstrates a controlled React component that supports null values for selectedDate. You can set specific dates, clear the selection, or set today's date using the control buttons. The calendar will update accordingly and show the current selection state.",
      },
    },
  },
};

// ============================================================================
// EVENTS PERSISTENCE TEST
// ============================================================================

export const EventsPersistenceTest: Story = {
  render: () => {
    const [theme, setTheme] = useState<"basic" | "glass">("basic");
    const [calendarSize, setCalendarSize] = useState<"small" | "large">("large");
    const [primaryColor, setPrimaryColor] = useState("#3b82f6");
    
    // Generate unique IDs for form elements
    const themeId = useId();
    const sizeId = useId();
    const colorId = useId();
    
    // Memoize dynamic events to prevent re-creation
    const dynamicEvents = useMemo(() => generateDynamicEvents(), []);

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          padding: "2rem",
          maxWidth: "1000px",
          margin: "0 auto",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        {/* Control Panel */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "12px",
            padding: "1.5rem",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            border: "1px solid #e2e8f0",
          }}
        >
          <h3
            style={{
              margin: "0 0 1rem 0",
              fontSize: "1.25rem",
              fontWeight: "600",
              color: "#1f2937",
            }}
          >
            Events Persistence Test
          </h3>
          <p style={{ margin: "0 0 1rem 0", color: "#6b7280", fontSize: "0.875rem" }}>
            Change the props below to test if events are preserved when calendar re-renders.
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <label htmlFor={themeId} style={{ fontSize: "0.875rem", fontWeight: "500", color: "#374151" }}>
                Theme:
              </label>
              <select
                id={themeId}
                value={theme}
                onChange={(e) => setTheme(e.target.value as "basic" | "glass")}
                style={{
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "0.875rem",
                }}
              >
                <option value="basic">Basic</option>
                <option value="glass">Glass</option>
              </select>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <label htmlFor={sizeId} style={{ fontSize: "0.875rem", fontWeight: "500", color: "#374151" }}>
                Size:
              </label>
              <select
                id={sizeId}
                value={calendarSize}
                onChange={(e) => setCalendarSize(e.target.value as "small" | "large")}
                style={{
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "0.875rem",
                }}
              >
                <option value="small">Small</option>
                <option value="large">Large</option>
              </select>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <label htmlFor={colorId} style={{ fontSize: "0.875rem", fontWeight: "500", color: "#374151" }}>
                Primary Color:
              </label>
              <input
                id={colorId}
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                style={{
                  width: "40px",
                  height: "40px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              />
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            background: "#ffffff",
            borderRadius: "12px",
            padding: "2rem",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            border: "1px solid #e2e8f0",
          }}
        >
          <ColorCalendar
            calendarSize={calendarSize}
            theme={theme}
            primaryColor={primaryColor}
            eventsData={dynamicEvents}
            eventBulletMode="multiple"
          />
        </div>
        
        <div
          style={{
            background: "#f8fafc",
            borderRadius: "8px",
            padding: "1rem",
            border: "1px solid #e2e8f0",
          }}
        >
          <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "0.875rem", fontWeight: "600", color: "#1f2937" }}>
            Test Instructions:
          </h4>
          <ul style={{ margin: "0", paddingLeft: "1.25rem", fontSize: "0.75rem", color: "#6b7280", lineHeight: "1.5" }}>
            <li>Change the theme, size, or color using the controls above</li>
            <li>Verify that the events (colored dots) remain visible on the calendar</li>
            <li>Events should not disappear when props change</li>
            <li>If events disappear, there's a bug in the component</li>
          </ul>
        </div>
      </div>
    );
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Test story to verify that events are preserved when calendar props change. Use the controls to change theme, size, and color - events should remain visible throughout all changes.",
      },
    },
  },
};

// ============================================================================
// CONTROLLED COMPONENT
// ============================================================================

export const ControlledComponent: Story = {
  render: () => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date(2024, 5, 15));
    const [selectedEvents, setSelectedEvents] = useState<EventData[]>([]);

    // Memoize dynamic events to prevent infinite re-renders
    const dynamicEvents = useMemo(() => generateDynamicEvents(), []);

    const handleDateChange = useCallback((date?: Date, events?: EventData[]) => {
      console.log("Controlled date change:", date, events);
      setSelectedDate(date);
      setSelectedEvents(events || []);
    }, []);

    const handlePreviousDay = useCallback(() => {
      if (selectedDate) {
        const previousDay = new Date(selectedDate);
        previousDay.setDate(previousDay.getDate() - 1);
        setSelectedDate(previousDay);
      }
    }, [selectedDate]);

    const handleNextDay = useCallback(() => {
      if (selectedDate) {
        const nextDay = new Date(selectedDate);
        nextDay.setDate(nextDay.getDate() + 1);
        setSelectedDate(nextDay);
      }
    }, [selectedDate]);

    const handleToday = useCallback(() => {
      setSelectedDate(new Date());
    }, []);

    const formatDate = (date: Date) => {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          padding: "2rem",
          maxWidth: "800px",
          margin: "0 auto",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        {/* Control Panel */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "12px",
            padding: "1.5rem",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            border: "1px solid #e2e8f0",
          }}
        >
          <h3
            style={{
              margin: "0 0 1rem 0",
              fontSize: "1.25rem",
              fontWeight: "600",
              color: "#1f2937",
            }}
          >
            Controlled Component Demo
          </h3>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={handlePreviousDay}
              disabled={!selectedDate}
              style={{
                padding: "0.5rem 1rem",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: selectedDate ? "pointer" : "not-allowed",
                opacity: selectedDate ? 1 : 0.5,
                fontSize: "0.875rem",
                fontWeight: "500",
              }}
            >
              ← Previous Day
            </button>
            <button
              type="button"
              onClick={handleNextDay}
              disabled={!selectedDate}
              style={{
                padding: "0.5rem 1rem",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: selectedDate ? "pointer" : "not-allowed",
                opacity: selectedDate ? 1 : 0.5,
                fontSize: "0.875rem",
                fontWeight: "500",
              }}
            >
              Next Day →
            </button>
            <button
              type="button"
              onClick={handleToday}
              style={{
                padding: "0.5rem 1rem",
                background: "#10b981",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: "500",
              }}
            >
              Today
            </button>
            <div
              style={{
                padding: "0.5rem 1rem",
                background: "#f3f4f6",
                borderRadius: "6px",
                fontSize: "0.875rem",
                color: "#374151",
                fontWeight: "500",
              }}
            >
              {selectedDate ? formatDate(selectedDate) : "No date selected"}
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div
          style={{
            display: "flex",
            gap: "2rem",
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h3
              style={{
                margin: "0 0 1rem 0",
                fontSize: "1.25rem",
                fontWeight: "600",
                color: "#1f2937",
              }}
            >
              Calendar
            </h3>
            <ColorCalendar
              calendarSize="large"
              theme="glass"
              primaryColor="#3b82f6"
              eventsData={dynamicEvents}
              selectedDate={selectedDate}
              onSelectedDateChange={handleDateChange}
            />
          </div>

          {/* Event Details */}
          <div
            style={{
              flex: "1",
              background: "#ffffff",
              borderRadius: "12px",
              padding: "1.5rem",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              border: "1px solid #e2e8f0",
              minHeight: "300px",
            }}
          >
            <h3
              style={{
                margin: "0 0 1rem 0",
                fontSize: "1.25rem",
                fontWeight: "600",
                color: "#1f2937",
              }}
            >
              Events for Selected Date
            </h3>
            {selectedEvents.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "200px",
                  color: "#9ca3af",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    background: "#f3f4f6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "0.75rem",
                    fontSize: "1.25rem",
                  }}
                >
                  📅
                </div>
                <p style={{ margin: "0", fontSize: "0.875rem", fontWeight: "500" }}>
                  {selectedDate ? "No events scheduled" : "Select a date to view events"}
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                {selectedEvents.map((event, index) => (
                  <div
                    key={`${event.start}-${event["name"]}-${index}`}
                    style={{
                      padding: "1rem",
                      background: "#f8fafc",
                      borderRadius: "8px",
                      borderLeft: `4px solid ${event.color}`,
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "600",
                        color: "#1e293b",
                        marginBottom: "0.25rem",
                        fontSize: "0.875rem",
                      }}
                    >
                      {event["name"]}
                    </div>
                    <div
                      style={{
                        color: "#64748b",
                        fontSize: "0.75rem",
                        lineHeight: "1.4",
                      }}
                    >
                      {event["description"]}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Demonstrates the controlled component mode where the selected date is managed by React state. Use the navigation buttons to change the selected date programmatically, or click on the calendar to select dates. The calendar will sync with the external state.",
      },
    },
  },
};
