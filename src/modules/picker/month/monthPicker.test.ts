import { beforeEach, expect, test } from "vitest";
import Calendar from "../../../index";
import { resetDOM } from "../../../testHelper";

beforeEach(() => {
  resetDOM();
});

test("correct month selected as today month", () => {
  const myCalendar = new Calendar();

  const todayMonthIndex = new Date().getMonth().toString();
  const selectedMonthElement = myCalendar.pickerMonthContainer.querySelector(
    ".calendar__picker-month-today"
  ) as HTMLElement;
  const selectedMonthIndex = selectedMonthElement.getAttribute("data-value");

  expect(todayMonthIndex).toBe(selectedMonthIndex);
});

test("should not show today marker when viewing different year", () => {
  const myCalendar = new Calendar();
  const today = new Date();

  // Navigate to next year
  const nextYear = new Date(today);
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  myCalendar.setSelectedDate(nextYear);

  // Get the month picker container
  const monthPickerContainer = myCalendar.pickerMonthContainer;
  expect(monthPickerContainer).toBeTruthy();

  // Check that no month has the today class when viewing a different year
  const todayMarker = monthPickerContainer?.querySelector(".calendar__picker-month-today");
  expect(todayMarker).toBeNull();
});

test("should show today marker when navigating back to current year", () => {
  const myCalendar = new Calendar();
  const today = new Date();
  const todayMonth = today.getMonth();

  // Navigate to next year
  const nextYear = new Date(today);
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  myCalendar.setSelectedDate(nextYear);

  // Verify no today marker
  const monthPickerContainer = myCalendar.pickerMonthContainer;
  const todayMarker = monthPickerContainer?.querySelector(".calendar__picker-month-today");
  expect(todayMarker).toBeNull();

  // Navigate back to current year
  myCalendar.setSelectedDate(today);

  // Verify today marker is back
  const todayMarkerAfter = monthPickerContainer?.querySelector(".calendar__picker-month-today");
  expect(todayMarkerAfter).toBeTruthy();

  const todayMonthIndex = todayMonth.toString();
  const selectedMonthIndex = todayMarkerAfter?.getAttribute("data-value");
  expect(todayMonthIndex).toBe(selectedMonthIndex);
});
