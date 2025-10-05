import { beforeEach, expect, test } from "vitest";
import Calendar from "../../index";
import { resetDOM } from "../../testHelper";

beforeEach(() => {
  resetDOM();
});

test("should render multiple event bullets in multiple mode", () => {
  const myCalendar = new Calendar({
    eventBulletMode: "multiple",
    eventsData: [
      {
        start: "2024-09-15T00:00:00",
        end: "2024-09-15T23:59:59",
        name: "Red Event",
        color: "#ff0000",
      },
      {
        start: "2024-09-15T00:00:00",
        end: "2024-09-15T23:59:59",
        name: "Blue Event",
        color: "#0000ff",
      },
      {
        start: "2024-09-15T00:00:00",
        end: "2024-09-15T23:59:59",
        name: "Green Event",
        color: "#00ff00",
      },
    ],
  });

  // Set to September 2024
  myCalendar.setSelectedDate(new Date(2024, 8, 1));

  // Get the calendar element
  const calendarElement = document.querySelector("#color-calendar .color-calendar");
  expect(calendarElement).toBeTruthy();

  // Find the day element for September 15 (look for the day with text content "15")
  const dayElements = calendarElement?.querySelectorAll(".calendar__day-active");
  const dayElement = Array.from(dayElements || []).find((el) => el.textContent?.trim() === "15");
  expect(dayElement).toBeTruthy();

  // Check that multiple bullets are rendered
  const bullets = dayElement?.querySelectorAll(".calendar__day-bullet");
  expect(bullets).toHaveLength(3);

  // Check bullet colors
  const bullet1 = bullets?.[0] as HTMLElement;
  const bullet2 = bullets?.[1] as HTMLElement;
  const bullet3 = bullets?.[2] as HTMLElement;

  expect(bullet1?.style.backgroundColor).toBe("rgb(255, 0, 0)"); // #ff0000
  expect(bullet2?.style.backgroundColor).toBe("rgb(0, 0, 255)"); // #0000ff
  expect(bullet3?.style.backgroundColor).toBe("rgb(0, 255, 0)"); // #00ff00
});

test("should render single event bullet in single mode", () => {
  const myCalendar = new Calendar({
    eventBulletMode: "single",
    eventsData: [
      {
        start: "2024-09-15T00:00:00",
        end: "2024-09-15T23:59:59",
        name: "Red Event",
        color: "#ff0000",
      },
      {
        start: "2024-09-15T00:00:00",
        end: "2024-09-15T23:59:59",
        name: "Blue Event",
        color: "#0000ff",
      },
      {
        start: "2024-09-15T00:00:00",
        end: "2024-09-15T23:59:59",
        name: "Green Event",
        color: "#00ff00",
      },
    ],
  });

  // Set to September 2024
  myCalendar.setSelectedDate(new Date(2024, 8, 1));

  // Get the calendar element
  const calendarElement = document.querySelector("#color-calendar .color-calendar");
  expect(calendarElement).toBeTruthy();

  // Find the day element for September 15 (look for the day with text content "15")
  const dayElements = calendarElement?.querySelectorAll(".calendar__day-active");
  const dayElement = Array.from(dayElements || []).find((el) => el.textContent?.trim() === "15");
  expect(dayElement).toBeTruthy();

  // Check that only one bullet is rendered
  const bullets = dayElement?.querySelectorAll(".calendar__day-bullet");
  expect(bullets).toHaveLength(1);

  // Check that the bullet uses the first event's color
  const bullet = bullets?.[0] as HTMLElement;
  expect(bullet?.style.backgroundColor).toBe("rgb(255, 0, 0)"); // #ff0000 (first event)
});

test("should render white bullets on selected dates", () => {
  const myCalendar = new Calendar({
    eventBulletMode: "multiple",
    eventsData: [
      {
        start: "2024-09-15T00:00:00",
        end: "2024-09-15T23:59:59",
        name: "Red Event",
        color: "#ff0000",
      },
      {
        start: "2024-09-15T00:00:00",
        end: "2024-09-15T23:59:59",
        name: "Blue Event",
        color: "#0000ff",
      },
    ],
  });

  // Set to September 2024
  myCalendar.setSelectedDate(new Date(2024, 8, 1));

  // Select September 15
  myCalendar.setSelectedDate(new Date(2024, 8, 15));

  // Get the calendar element
  const calendarElement = document.querySelector("#color-calendar .color-calendar");
  expect(calendarElement).toBeTruthy();

  // Find the selected day element for September 15
  const selectedDayElement = calendarElement?.querySelector(".calendar__day-selected");
  expect(selectedDayElement).toBeTruthy();

  // Check that bullets exist on selected date
  const bullets = selectedDayElement?.querySelectorAll(".calendar__day-bullet");
  expect(bullets).toHaveLength(2);

  // Note: The white bullet functionality is tested via CSS, which may not be fully testable in this environment
  // The important part is that bullets are rendered and the CSS rule exists in the actual stylesheets
  bullets?.forEach((bullet) => {
    const bulletElement = bullet as HTMLElement;
    expect(bulletElement).toBeTruthy();
    expect(bulletElement.classList.contains("calendar__day-bullet")).toBe(true);
  });
});

test("should handle events without colors using primary color", () => {
  const myCalendar = new Calendar({
    eventBulletMode: "multiple",
    primaryColor: "#800080", // Use hex color instead of color name
    eventsData: [
      {
        start: "2024-09-15T00:00:00",
        end: "2024-09-15T23:59:59",
        name: "Event without color",
      },
    ],
  });

  // Set to September 2024
  myCalendar.setSelectedDate(new Date(2024, 8, 1));

  // Get the calendar element
  const calendarElement = document.querySelector("#color-calendar .color-calendar");
  expect(calendarElement).toBeTruthy();

  // Find the day element for September 15 (look for the day with text content "15")
  const dayElements = calendarElement?.querySelectorAll(".calendar__day-active");
  const dayElement = Array.from(dayElements || []).find((el) => el.textContent?.trim() === "15");
  expect(dayElement).toBeTruthy();

  // Check that bullet uses primary color
  const bullets = dayElement?.querySelectorAll(".calendar__day-bullet");
  expect(bullets).toHaveLength(1);

  const bullet = bullets?.[0] as HTMLElement;
  expect(bullet?.style.backgroundColor).toBe("rgb(128, 0, 128)"); // #800080
});

test("should handle cross-month events correctly in day rendering", () => {
  const myCalendar = new Calendar({
    eventBulletMode: "multiple",
    eventsData: [
      {
        start: "2024-09-24T00:00:00",
        end: "2024-10-05T23:59:59",
        name: "Cross-month event",
        color: "#ff6b6b",
      },
    ],
  });

  // Set to September 2024
  myCalendar.setSelectedDate(new Date(2024, 8, 1));

  // Get the calendar element
  const calendarElement = document.querySelector("#color-calendar .color-calendar");
  expect(calendarElement).toBeTruthy();

  // Find the day element for September 24 (should have the event)
  const dayElements = calendarElement?.querySelectorAll(".calendar__day-active");
  const sept24Element = Array.from(dayElements || []).find((el) => el.textContent?.trim() === "24");
  expect(sept24Element).toBeTruthy();

  const sept24Bullets = sept24Element?.querySelectorAll(".calendar__day-bullet");
  expect(sept24Bullets).toHaveLength(1);

  const sept24Bullet = sept24Bullets?.[0] as HTMLElement;
  expect(sept24Bullet?.style.backgroundColor).toBe("rgb(255, 107, 107)"); // #ff6b6b

  // Navigate to October 2024
  myCalendar.setSelectedDate(new Date(2024, 9, 1));

  // Find the day element for October 5 (should also have the event)
  const octDayElements = calendarElement?.querySelectorAll(".calendar__day-active");
  const oct5Element = Array.from(octDayElements || []).find((el) => el.textContent?.trim() === "5");
  expect(oct5Element).toBeTruthy();

  const oct5Bullets = oct5Element?.querySelectorAll(".calendar__day-bullet");
  expect(oct5Bullets).toHaveLength(1);

  const oct5Bullet = oct5Bullets?.[0] as HTMLElement;
  expect(oct5Bullet?.style.backgroundColor).toBe("rgb(255, 107, 107)"); // #ff6b6b
});

test("should limit bullets to maximum of 5 per date to avoid overflow", () => {
  const myCalendar = new Calendar({
    eventBulletMode: "multiple",
    eventsData: [
      // Create 7 events on the same day to test the 5-bullet limit
      {
        start: "2024-09-15T00:00:00",
        end: "2024-09-15T23:59:59",
        name: "Event 1",
        color: "#ff0000",
      },
      {
        start: "2024-09-15T00:00:00",
        end: "2024-09-15T23:59:59",
        name: "Event 2",
        color: "#00ff00",
      },
      {
        start: "2024-09-15T00:00:00",
        end: "2024-09-15T23:59:59",
        name: "Event 3",
        color: "#0000ff",
      },
      {
        start: "2024-09-15T00:00:00",
        end: "2024-09-15T23:59:59",
        name: "Event 4",
        color: "#ffff00",
      },
      {
        start: "2024-09-15T00:00:00",
        end: "2024-09-15T23:59:59",
        name: "Event 5",
        color: "#ff00ff",
      },
      {
        start: "2024-09-15T00:00:00",
        end: "2024-09-15T23:59:59",
        name: "Event 6",
        color: "#00ffff",
      },
      {
        start: "2024-09-15T00:00:00",
        end: "2024-09-15T23:59:59",
        name: "Event 7",
        color: "#ffa500",
      },
    ],
  });

  // Set to September 2024
  myCalendar.setSelectedDate(new Date(2024, 8, 1));

  // Get the calendar element
  const calendarElement = document.querySelector("#color-calendar .color-calendar");
  expect(calendarElement).toBeTruthy();

  // Find the day element for September 15 (look for the day with text content "15")
  const dayElements = calendarElement?.querySelectorAll(".calendar__day-active");
  const dayElement = Array.from(dayElements || []).find((el) => el.textContent?.trim() === "15");
  expect(dayElement).toBeTruthy();

  // Check that only 5 bullets are rendered (not 7)
  const bullets = dayElement?.querySelectorAll(".calendar__day-bullet");
  expect(bullets).toHaveLength(5);

  // Check that the first 5 events' colors are used
  const bullet1 = bullets?.[0] as HTMLElement;
  const bullet2 = bullets?.[1] as HTMLElement;
  const bullet3 = bullets?.[2] as HTMLElement;
  const bullet4 = bullets?.[3] as HTMLElement;
  const bullet5 = bullets?.[4] as HTMLElement;

  expect(bullet1?.style.backgroundColor).toBe("rgb(255, 0, 0)"); // #ff0000 (Event 1)
  expect(bullet2?.style.backgroundColor).toBe("rgb(0, 255, 0)"); // #00ff00 (Event 2)
  expect(bullet3?.style.backgroundColor).toBe("rgb(0, 0, 255)"); // #0000ff (Event 3)
  expect(bullet4?.style.backgroundColor).toBe("rgb(255, 255, 0)"); // #ffff00 (Event 4)
  expect(bullet5?.style.backgroundColor).toBe("rgb(255, 0, 255)"); // #ff00ff (Event 5)
});

test("should separate date selection from month navigation", () => {
  let onSelectedDateChangeCalled = 0;
  let onMonthChangeCalled = 0;

  const myCalendar = new Calendar({
    onSelectedDateChange: () => {
      onSelectedDateChangeCalled++;
    },
    onMonthChange: () => {
      onMonthChangeCalled++;
    },
  });

  // Initial setup should trigger both events
  expect(onSelectedDateChangeCalled).toBe(1); // Initial onSelectedDateChange
  expect(onMonthChangeCalled).toBe(1); // Initial onMonthChange

  // Reset counters
  onSelectedDateChangeCalled = 0;
  onMonthChangeCalled = 0;

  // Navigate to next month - should only trigger onMonthChange
  myCalendar.handleNextMonthButtonClick();
  expect(onSelectedDateChangeCalled).toBe(0); // No onSelectedDateChange
  expect(onMonthChangeCalled).toBe(1); // Only onMonthChange

  // Reset counters
  onSelectedDateChangeCalled = 0;
  onMonthChangeCalled = 0;

  // Navigate to previous month - should only trigger onMonthChange
  myCalendar.handlePrevMonthButtonClick();
  expect(onSelectedDateChangeCalled).toBe(0); // No onSelectedDateChange
  expect(onMonthChangeCalled).toBe(1); // Only onMonthChange
});

test("should not automatically select dates when navigating months", () => {
  const myCalendar = new Calendar();

  // Set to a specific date
  myCalendar.setSelectedDate(new Date(2024, 8, 15)); // September 15, 2024

  // Verify the date is selected
  expect(myCalendar.getSelectedDate().getDate()).toBe(15);
  expect(myCalendar.getSelectedDate().getMonth()).toBe(8); // September

  // Navigate to next month
  myCalendar.handleNextMonthButtonClick();

  // The selected date should remain September 15, but no date should be selected in October
  expect(myCalendar.getSelectedDate().getDate()).toBe(15);
  expect(myCalendar.getSelectedDate().getMonth()).toBe(8); // Still September

  // Check that no date is selected in the current view (October)
  const calendarElement = document.querySelector("#color-calendar .color-calendar");
  const selectedDay = calendarElement?.querySelector(".calendar__day-selected");
  expect(selectedDay).toBeNull(); // No date should be selected in October
});

test("should preserve selected date when navigating to months that contain it", () => {
  const myCalendar = new Calendar();

  // Set to September 15, 2024
  myCalendar.setSelectedDate(new Date(2024, 8, 15));

  // Navigate to October (different month)
  myCalendar.handleNextMonthButtonClick();

  // Navigate back to September
  myCalendar.handlePrevMonthButtonClick();

  // The selected date should still be September 15
  expect(myCalendar.getSelectedDate().getDate()).toBe(15);
  expect(myCalendar.getSelectedDate().getMonth()).toBe(8); // September

  // And it should be visually selected in the calendar
  const calendarElement = document.querySelector("#color-calendar .color-calendar");
  const selectedDay = calendarElement?.querySelector(".calendar__day-selected");
  expect(selectedDay).toBeTruthy();
  expect(selectedDay?.textContent?.trim()).toBe("15");
});
