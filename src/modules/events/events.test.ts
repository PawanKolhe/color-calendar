import { beforeEach, expect, test } from "vitest";
import Calendar from "../../index";

import { resetDOM } from "../../testHelper";

beforeEach(() => {
  resetDOM();
});

test("should add events", () => {
  const myCalendar = new Calendar();

  const eventsData = [
    {
      start: "2020-12-08T13:00:00",
      end: "2020-12-08T17:30:00",
      name: "GitHub Universe 2020 (Day 1)",
    },
    {
      start: "2020-12-09T13:00:00",
      end: "2020-12-09T17:30:00",
      name: "GitHub Universe 2020 (Day 2)",
    },
  ];
  myCalendar.addEventsData(eventsData);

  expect(myCalendar.getEventsData()).toEqual(eventsData);
});

test("should get today month events", () => {
  const myCalendar = new Calendar();

  const todayYear = new Date().getFullYear();

  let todayMonth = (new Date().getMonth() + 1).toString();
  if (parseInt(todayMonth, 10) < 10) {
    todayMonth = `0${todayMonth}`;
  }
  let nextMonth = parseInt(todayMonth, 10) + 1;
  if (nextMonth > 12) {
    nextMonth = 1;
  }
  const eventsData = [
    {
      start: `${todayYear}-${todayMonth}-08T13:00:00`,
      end: `${todayYear}-${todayMonth}-08T17:30:00`,
      name: "Sample Event 1",
    },
    {
      start: `${todayYear}-${nextMonth}-09T13:00:00`,
      end: `${todayYear}-${nextMonth}-09T17:30:00`,
      name: "Sample Event 2",
    },
  ];
  myCalendar.addEventsData(eventsData);

  expect(myCalendar.getMonthEvents()).toEqual([
    {
      start: `${todayYear}-${todayMonth}-08T13:00:00`,
      end: `${todayYear}-${todayMonth}-08T17:30:00`,
      name: "Sample Event 1",
    },
  ]);
});

test("should handle cross-month date ranges correctly", () => {
  const myCalendar = new Calendar();

  // Set calendar to September 2024
  myCalendar.setSelectedDate(new Date(2024, 8, 1)); // September 2024

  const eventsData = [
    {
      start: "2024-09-24T00:00:00",
      end: "2024-10-05T23:59:59",
      name: "Cross-month event (Sept 24 - Oct 5)",
    },
    {
      start: "2024-09-15T00:00:00",
      end: "2024-09-20T23:59:59",
      name: "Single month event (Sept 15-20)",
    },
  ];
  myCalendar.addEventsData(eventsData);

  // Check September events - should include both events
  const septemberEvents = myCalendar.getMonthEvents();
  expect(septemberEvents).toHaveLength(2);
  expect(
    septemberEvents.some((event) => event["name"] === "Cross-month event (Sept 24 - Oct 5)")
  ).toBe(true);
  expect(septemberEvents.some((event) => event["name"] === "Single month event (Sept 15-20)")).toBe(
    true
  );

  // Navigate to October 2024
  myCalendar.setSelectedDate(new Date(2024, 9, 1)); // October 2024

  // Check October events - should include the cross-month event
  const octoberEvents = myCalendar.getMonthEvents();
  expect(octoberEvents).toHaveLength(1);
  expect(octoberEvents[0]?.["name"]).toBe("Cross-month event (Sept 24 - Oct 5)");

  // Test getDateEvents for specific dates
  const sept24Events = myCalendar.getDateEvents(new Date(2024, 8, 24)); // September 24
  expect(sept24Events).toHaveLength(1);
  expect(sept24Events[0]?.["name"]).toBe("Cross-month event (Sept 24 - Oct 5)");

  const oct5Events = myCalendar.getDateEvents(new Date(2024, 9, 5)); // October 5
  expect(oct5Events).toHaveLength(1);
  expect(oct5Events[0]?.["name"]).toBe("Cross-month event (Sept 24 - Oct 5)");
});

test("should handle events spanning multiple months", () => {
  const myCalendar = new Calendar();

  // Set calendar to August 2024
  myCalendar.setSelectedDate(new Date(2024, 7, 1)); // August 2024

  const eventsData = [
    {
      start: "2024-08-15T00:00:00",
      end: "2024-09-15T23:59:59",
      name: "Long event (Aug 15 - Sep 15)",
    },
  ];
  myCalendar.addEventsData(eventsData);

  // Check August events - should include the long event
  const augustEvents = myCalendar.getMonthEvents();
  expect(augustEvents).toHaveLength(1);
  expect(augustEvents[0]?.["name"]).toBe("Long event (Aug 15 - Sep 15)");

  // Navigate to September 2024
  myCalendar.setSelectedDate(new Date(2024, 8, 1)); // September 2024

  // Check September events - should still include the long event
  const septemberEvents = myCalendar.getMonthEvents();
  expect(septemberEvents).toHaveLength(1);
  expect(septemberEvents[0]?.["name"]).toBe("Long event (Aug 15 - Sep 15)");

  // Navigate to October 2024
  myCalendar.setSelectedDate(new Date(2024, 9, 1)); // October 2024

  // Check October events - should not include the long event (it ended in September)
  const octoberEvents = myCalendar.getMonthEvents();
  expect(octoberEvents).toHaveLength(0);
});

test("should handle event colors correctly", () => {
  const myCalendar = new Calendar();

  const eventsData = [
    {
      start: "2024-09-15T00:00:00",
      end: "2024-09-15T23:59:59",
      name: "Red Event",
      color: "#ff0000",
    },
    {
      start: "2024-09-16T00:00:00",
      end: "2024-09-16T23:59:59",
      name: "Blue Event",
      color: "#0000ff",
    },
    {
      start: "2024-09-17T00:00:00",
      end: "2024-09-17T23:59:59",
      name: "Event without color",
    },
  ];
  myCalendar.addEventsData(eventsData);

  const events = myCalendar.getEventsData();
  expect(events[0]?.color).toBe("#ff0000");
  expect(events[1]?.color).toBe("#0000ff");
  expect(events[2]?.color).toBeUndefined();
});

test("should handle eventBulletMode configuration", () => {
  // Test multiple bullet mode (default)
  const calendarMultiple = new Calendar({
    eventBulletMode: "multiple",
  });
  expect(calendarMultiple.eventBulletMode).toBe("multiple");

  // Test single bullet mode
  const calendarSingle = new Calendar({
    eventBulletMode: "single",
  });
  expect(calendarSingle.eventBulletMode).toBe("single");

  // Test default when not specified
  const calendarDefault = new Calendar();
  expect(calendarDefault.eventBulletMode).toBe("multiple");
});
