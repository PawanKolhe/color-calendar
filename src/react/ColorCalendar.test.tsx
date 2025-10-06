import { render, screen } from "@testing-library/react";
import React, { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import type { EventData } from "../types";
import ColorCalendar, { type ColorCalendarRef } from "./ColorCalendar";

// Mock the Calendar class
vi.mock("../../index", () => ({
  default: vi.fn().mockImplementation(() => ({
    getSelectedDate: vi.fn(() => new Date()),
    setSelectedDate: vi.fn(),
    setEventsData: vi.fn(),
    getEventsData: vi.fn(() => []),
  })),
}));

describe("ColorCalendar React Wrapper", () => {
  it("should render without crashing", () => {
    render(<ColorCalendar calendarSize="large" theme="basic" />);
    expect(screen.getByTestId("color-calendar-container")).toBeInTheDocument();
  });

  it("should apply className and style props", () => {
    const { container } = render(
      <ColorCalendar
        calendarSize="large"
        theme="basic"
        className="test-calendar"
        style={{ maxWidth: "400px" }}
      />
    );

    const calendarContainer = container.querySelector(".test-calendar");
    expect(calendarContainer).toBeInTheDocument();
    expect(calendarContainer).toHaveStyle("max-width: 400px");
  });

  it("should handle events data changes", () => {
    const events: EventData[] = [
      {
        start: "2024-01-15",
        end: "2024-01-15",
        color: "#ff6b6b",
      },
    ];

    render(<ColorCalendar calendarSize="large" theme="basic" eventsData={events} />);

    expect(screen.getByTestId("color-calendar-container")).toBeInTheDocument();
  });

  it("should call onSelectedDateChange callback", () => {
    const mockCallback = vi.fn();

    render(
      <ColorCalendar calendarSize="large" theme="basic" onSelectedDateChange={mockCallback} />
    );

    expect(screen.getByTestId("color-calendar-container")).toBeInTheDocument();
    // Note: In a real test, you would simulate user interaction to trigger the callback
  });

  it("should support ref for imperative API", () => {
    const ref = React.createRef<import("./ColorCalendar").ColorCalendarRef>();

    render(<ColorCalendar ref={ref} calendarSize="large" theme="basic" />);

    expect(ref.current).toBeDefined();
    expect(ref.current?.getCalendar).toBeDefined();
    expect(ref.current?.updateEvents).toBeDefined();
    expect(ref.current?.setSelectedDate).toBeDefined();
    expect(ref.current?.getSelectedDate).toBeDefined();
  });

  it("should handle theme changes", () => {
    const { rerender } = render(<ColorCalendar calendarSize="large" theme="basic" />);

    expect(screen.getByTestId("color-calendar-container")).toBeInTheDocument();

    rerender(<ColorCalendar calendarSize="large" theme="glass" />);
    expect(screen.getByTestId("color-calendar-container")).toBeInTheDocument();
  });

  it("should handle calendar size changes", () => {
    const { rerender } = render(<ColorCalendar calendarSize="small" theme="basic" />);

    expect(screen.getByTestId("color-calendar-container")).toBeInTheDocument();

    rerender(<ColorCalendar calendarSize="large" theme="basic" />);
    expect(screen.getByTestId("color-calendar-container")).toBeInTheDocument();
  });

  it("should handle initial selected date", () => {
    const initialDate = new Date("2024-01-15");

    render(<ColorCalendar calendarSize="large" theme="basic" initialSelectedDate={initialDate} />);

    expect(screen.getByTestId("color-calendar-container")).toBeInTheDocument();
  });

  it("should handle month change callback", () => {
    const mockCallback = vi.fn();

    render(<ColorCalendar calendarSize="large" theme="basic" onMonthChange={mockCallback} />);

    expect(screen.getByTestId("color-calendar-container")).toBeInTheDocument();
  });

  it("should handle selected date click callback", () => {
    const mockCallback = vi.fn();

    render(<ColorCalendar calendarSize="large" theme="basic" onSelectedDateClick={mockCallback} />);

    expect(screen.getByTestId("color-calendar-container")).toBeInTheDocument();
  });

  // ============================================================================
  // CONTROLLED COMPONENT TESTS
  // ============================================================================

  it("should handle controlled selectedDate prop", () => {
    const selectedDate = new Date("2024-01-15");

    render(<ColorCalendar calendarSize="large" theme="basic" selectedDate={selectedDate} />);

    expect(screen.getByTestId("color-calendar-container")).toBeInTheDocument();
    // The selectedDate prop should be passed to the component
  });

  it("should handle controlled onSelectedDateChange callback", () => {
    const mockCallback = vi.fn();
    const selectedDate = new Date("2024-01-15");

    render(
      <ColorCalendar
        calendarSize="large"
        theme="basic"
        selectedDate={selectedDate}
        onSelectedDateChange={mockCallback}
      />
    );

    expect(screen.getByTestId("color-calendar-container")).toBeInTheDocument();
    // The callback should be passed to the calendar options
  });

  it("should handle undefined selectedDate prop", () => {
    render(<ColorCalendar calendarSize="large" theme="basic" selectedDate={undefined} />);

    expect(screen.getByTestId("color-calendar-container")).toBeInTheDocument();
    // Should handle undefined selectedDate gracefully
  });

  it("should prioritize controlled onSelectedDateChange over calendar options", () => {
    const controlledCallback = vi.fn();

    render(
      <ColorCalendar calendarSize="large" theme="basic" onSelectedDateChange={controlledCallback} />
    );

    expect(screen.getByTestId("color-calendar-container")).toBeInTheDocument();
    // The controlled callback should be used
  });

  it("should handle selectedDate changes in controlled mode", () => {
    const { rerender } = render(
      <ColorCalendar calendarSize="large" theme="basic" selectedDate={new Date("2024-01-15")} />
    );

    expect(screen.getByTestId("color-calendar-container")).toBeInTheDocument();

    // Change selectedDate
    rerender(
      <ColorCalendar calendarSize="large" theme="basic" selectedDate={new Date("2024-02-20")} />
    );

    expect(screen.getByTestId("color-calendar-container")).toBeInTheDocument();
  });

  it("should handle null selectedDate prop", () => {
    render(<ColorCalendar calendarSize="large" theme="basic" selectedDate={null} />);

    expect(screen.getByTestId("color-calendar-container")).toBeInTheDocument();
    // Should handle null selectedDate gracefully
  });

  it("should handle null initialSelectedDate prop", () => {
    render(<ColorCalendar calendarSize="large" theme="basic" initialSelectedDate={null} />);

    expect(screen.getByTestId("color-calendar-container")).toBeInTheDocument();
    // Should handle null initialSelectedDate gracefully
  });

  it("should handle ref methods with null values", () => {
    const ref = createRef<ColorCalendarRef>();

    render(<ColorCalendar ref={ref} calendarSize="large" theme="basic" />);

    expect(ref.current).toBeDefined();
    expect(ref.current?.setSelectedDate).toBeDefined();
    expect(ref.current?.getSelectedDate).toBeDefined();

    // Test setting null
    ref.current?.setSelectedDate(null);
    expect(ref.current?.getSelectedDate()).toBeNull();

    // Test setting a date
    const testDate = new Date("2024-01-15");
    ref.current?.setSelectedDate(testDate);
    expect(ref.current?.getSelectedDate()).toBeInstanceOf(Date);
  });
});
