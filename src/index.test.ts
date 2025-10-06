import { beforeEach, describe, expect, test, vi } from "vitest";
import Calendar from "./index";
import { DEFAULT_ID, MONTH_NAMES_LONG, MONTH_NAMES_SHORT, resetDOM } from "./testHelper";

beforeEach(() => {
  resetDOM();
});

test("should initialize calendar", () => {
  vi.spyOn(Calendar.prototype, "togglePicker");
  vi.spyOn(Calendar.prototype, "configureStylePreferences");
  vi.spyOn(Calendar.prototype, "addEventListeners");
  vi.spyOn(Calendar.prototype, "reset");

  const myCalendar = new Calendar();

  expect(myCalendar.calendar).not.toBeNull();
  expect(myCalendar.togglePicker).toBeCalledTimes(1);
  expect(myCalendar.configureStylePreferences).toBeCalledTimes(1);
  expect(myCalendar.addEventListeners).toBeCalledTimes(1);
  expect(myCalendar.reset).toBeCalledTimes(1);
});

describe("default calendar options when instantiated", () => {
  let myCalendar: Calendar;
  let calendarHTMLElement: HTMLElement | null;

  beforeEach(() => {
    myCalendar = new Calendar();
    calendarHTMLElement = document.querySelector(DEFAULT_ID)?.firstElementChild as HTMLElement;
  });

  test("container should not be null", () => {
    calendarHTMLElement = document.querySelector(`${DEFAULT_ID} .color-calendar`);
    expect(myCalendar.container).toBe(DEFAULT_ID);
    expect(calendarHTMLElement).not.toBeNull();
  });

  test("calendarSize should be large", () => {
    expect(myCalendar.calendarSize).toBe("large");
    expect(calendarHTMLElement?.classList).toContain("color-calendar--large");
  });

  test("layoutModifiers should not be applied", () => {
    expect(myCalendar.layoutModifiers).toHaveLength(0);
    expect(calendarHTMLElement?.classList).not.toContain("month-left-align");
  });

  test("eventsData should be empty", () => {
    expect(myCalendar.eventsData).toHaveLength(0);
  });

  test("theme should be basic", () => {
    expect(myCalendar.theme).toBe("basic");
    expect(calendarHTMLElement?.classList).toContain("basic");
  });

  test("primaryColor should be undefined", () => {
    expect(myCalendar.primaryColor).toBeUndefined();
    expect(calendarHTMLElement?.style.getPropertyValue("--cal-color-primary")).toBe("");
  });

  test("headerColor should be undefined", () => {
    expect(myCalendar.headerColor).toBeUndefined();
    expect(calendarHTMLElement?.style.getPropertyValue("--cal-header-color")).toBe("");
  });

  test("headerBackgroundColor should be undefined", () => {
    expect(myCalendar.headerBackgroundColor).toBeUndefined();
    expect(calendarHTMLElement?.style.getPropertyValue("--cal-header-background-color")).toBe("");
  });

  test("weekdaysColor should be undefined", () => {
    expect(myCalendar.weekdaysColor).toBeUndefined();
    expect(calendarHTMLElement?.style.getPropertyValue("--cal-weekdays-color")).toBe("");
  });

  test("weekdayDisplayType should be long-lower", () => {
    expect(myCalendar.weekdayDisplayType).toBe("long-lower");
    expect(
      calendarHTMLElement?.querySelector(".calendar__weekdays")?.firstElementChild?.innerHTML
    ).toBe("Sun");
  });

  test("monthDisplayType should be long", () => {
    const todayMonth = MONTH_NAMES_LONG[new Date().getMonth()];
    expect(myCalendar.monthDisplayType).toBe("long");
    expect(calendarHTMLElement?.querySelector(".calendar__month")?.innerHTML).toBe(todayMonth);
  });

  test("startWeekday should be 0 (Sun)", () => {
    expect(myCalendar.startWeekday).toBe(0);
    expect(
      calendarHTMLElement?.querySelector(".calendar__weekdays")?.firstElementChild?.innerHTML
    ).toBe("Sun");
  });

  test("fontFamilyHeader should be undefined", () => {
    expect(myCalendar.fontFamilyHeader).toBeUndefined();
    expect(calendarHTMLElement?.style.getPropertyValue("--cal-font-family-header")).toBe("");
  });

  test("fontFamilyWeekdays should be undefined", () => {
    expect(myCalendar.fontFamilyWeekdays).toBeUndefined();
    expect(calendarHTMLElement?.style.getPropertyValue("--cal-font-family-weekdays")).toBe("");
  });

  test("fontFamilyBody should be undefined", () => {
    expect(myCalendar.fontFamilyBody).toBeUndefined();
    expect(calendarHTMLElement?.style.getPropertyValue("--cal-font-family-body")).toBe("");
  });

  test("dropShadow should be undefined", () => {
    expect(myCalendar.dropShadow).toBeUndefined();
    expect(calendarHTMLElement?.style.getPropertyValue("--cal-drop-shadow")).toBe("");
  });

  test("border should be undefined", () => {
    expect(myCalendar.border).toBeUndefined();
    expect(calendarHTMLElement?.style.getPropertyValue("--cal-border")).toBe("");
  });

  test("borderRadius should be 0.5rem", () => {
    expect(myCalendar.borderRadius).toBe("0.5rem");
    expect(calendarHTMLElement?.style.getPropertyValue("--cal-border-radius")).toBe("0.5rem");
  });

  test("disableMonthYearPickers should be false", () => {
    expect(myCalendar.disableMonthYearPickers).toBe(false);

    const monthButton = calendarHTMLElement?.querySelector(".calendar__month") as HTMLElement;
    const yearButton = calendarHTMLElement?.querySelector(".calendar__year") as HTMLElement;
    monthButton.click();
    yearButton.click();
    const picker = calendarHTMLElement?.querySelector(".calendar__picker") as HTMLElement;
    expect(picker.style.visibility).toBe("visible");
  });

  test("disableDayClick should be false", () => {
    expect(myCalendar.disableDayClick).toBe(false);
  });

  test("disableMonthArrowClick should be false", () => {
    expect(myCalendar.disableMonthArrowClick).toBe(false);
  });

  test("onMonthChange should be undefined", () => {
    expect(myCalendar.onMonthChange).toBeUndefined();
  });

  test("onSelectedDateChange should be undefined", () => {
    expect(myCalendar.onSelectedDateChange).toBeUndefined();
  });

  test("initialSelectedDate should be undefined by default", () => {
    expect(myCalendar.selectedDate).toBeInstanceOf(Date);
    expect(myCalendar.currentViewDate).toBeInstanceOf(Date);
    // Should default to today's date
    const today = new Date();
    expect(myCalendar.selectedDate?.getDate()).toBe(today.getDate());
    expect(myCalendar.selectedDate?.getMonth()).toBe(today.getMonth());
    expect(myCalendar.selectedDate?.getFullYear()).toBe(today.getFullYear());
  });
});

describe("custom calendar options when instantiated", () => {
  test("container should not be #MyTestCalendar", () => {
    const container = "#MyTestCalendar";
    const myCalendar = new Calendar({ container });
    const calendarHTMLElement = document.querySelector(`${container} .color-calendar`);
    expect(myCalendar.container).toBe(container);
    expect(calendarHTMLElement).not.toBeNull();
  });

  test("calendarSize should be small", () => {
    const myCalendar = new Calendar({
      calendarSize: "small",
    });
    const calendarHTMLElement = document.querySelector(`${DEFAULT_ID} .color-calendar`);
    expect(myCalendar.calendarSize).toBe("small");
    expect(calendarHTMLElement?.classList).toContain("color-calendar--small");
  });

  test("layoutModifiers should be applied", () => {
    const myCalendar = new Calendar({
      layoutModifiers: ["month-left-align"],
    });
    const calendarHTMLElement = document.querySelector(`${DEFAULT_ID} .color-calendar`);
    expect(myCalendar.layoutModifiers).toHaveLength(1);
    expect(calendarHTMLElement?.classList).toContain("month-left-align");
  });

  test("eventsData should be inserted", () => {
    const myCalendar = new Calendar({
      eventsData: [
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
      ],
    });
    expect(myCalendar.eventsData).toHaveLength(2);
    expect(myCalendar.eventsData).toMatchObject([
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
    ]);
  });

  test("theme should be glass", () => {
    const myCalendar = new Calendar({
      theme: "glass",
    });
    const calendarHTMLElement = document.querySelector(`${DEFAULT_ID} .color-calendar`);
    expect(myCalendar.theme).toBe("glass");
    expect(calendarHTMLElement?.classList).toContain("glass");
  });

  test("primaryColor should be #1877F2", () => {
    const myCalendar = new Calendar({
      primaryColor: "#1877F2",
    });
    const calendarHTMLElement = document.querySelector(
      `${DEFAULT_ID} .color-calendar`
    ) as HTMLElement;
    expect(calendarHTMLElement).not.toBeNull();
    expect(myCalendar.primaryColor).toBe("#1877F2");
    expect(calendarHTMLElement?.style.getPropertyValue("--cal-color-primary")).toBe("#1877F2");
  });

  test("headerColor should be #36057D", () => {
    const myCalendar = new Calendar({
      headerColor: "#36057D",
    });
    const calendarHTMLElement = document.querySelector(
      `${DEFAULT_ID} .color-calendar`
    ) as HTMLElement;
    expect(myCalendar.headerColor).toBe("#36057D");
    expect(calendarHTMLElement?.style.getPropertyValue("--cal-header-color")).toBe("#36057D");
  });

  test("headerBackgroundColor should be #E081C9", () => {
    const myCalendar = new Calendar({
      headerBackgroundColor: "#E081C9",
    });
    const calendarHTMLElement = document.querySelector(
      `${DEFAULT_ID} .color-calendar`
    ) as HTMLElement;
    expect(myCalendar.headerBackgroundColor).toBe("#E081C9");
    expect(calendarHTMLElement?.style.getPropertyValue("--cal-header-background-color")).toBe(
      "#E081C9"
    );
  });

  test("weekdaysColor should be #17CBB5", () => {
    const myCalendar = new Calendar({
      weekdaysColor: "#17CBB5",
    });
    const calendarHTMLElement = document.querySelector(
      `${DEFAULT_ID} .color-calendar`
    ) as HTMLElement;
    expect(myCalendar.weekdaysColor).toBe("#17CBB5");
    expect(calendarHTMLElement?.style.getPropertyValue("--cal-weekdays-color")).toBe("#17CBB5");
  });

  test("weekdayDisplayType should be short", () => {
    let myCalendar = new Calendar({
      weekdayDisplayType: "short",
    });
    let calendarHTMLElement = document.querySelector(
      `${DEFAULT_ID} .color-calendar`
    ) as HTMLElement;
    expect(myCalendar.weekdayDisplayType).toBe("short");
    expect(
      calendarHTMLElement?.querySelector(".calendar__weekdays")?.firstElementChild?.innerHTML
    ).toBe("S");
    myCalendar = new Calendar({
      weekdayDisplayType: "long-upper",
    });
    calendarHTMLElement = document.querySelector(`${DEFAULT_ID} .color-calendar`) as HTMLElement;
    expect(myCalendar.weekdayDisplayType).toBe("long-upper");
    expect(
      calendarHTMLElement?.querySelector(".calendar__weekdays")?.firstElementChild?.innerHTML
    ).toBe("SUN");
  });

  test("monthDisplayType should be short", () => {
    const myCalendar = new Calendar({
      monthDisplayType: "short",
    });
    const calendarHTMLElement = document.querySelector(
      `${DEFAULT_ID} .color-calendar`
    ) as HTMLElement;
    const todayMonth = MONTH_NAMES_SHORT[new Date().getMonth()];
    expect(myCalendar.monthDisplayType).toBe("short");
    expect(calendarHTMLElement?.querySelector(".calendar__month")?.innerHTML).toBe(todayMonth);
  });

  test("startWeekday should be 3 (Wed)", () => {
    const myCalendar = new Calendar({
      startWeekday: 3,
    });
    const calendarHTMLElement = document.querySelector(
      `${DEFAULT_ID} .color-calendar`
    ) as HTMLElement;
    expect(myCalendar.startWeekday).toBe(3);
    expect(
      calendarHTMLElement?.querySelector(".calendar__weekdays")?.firstElementChild?.innerHTML
    ).toBe("Wed");
  });

  test("fontFamilyHeader should be Open Sans", () => {
    const myCalendar = new Calendar({
      fontFamilyHeader: "'Open Sans', sans-serif",
    });
    const calendarHTMLElement = document.querySelector(
      `${DEFAULT_ID} .color-calendar`
    ) as HTMLElement;
    expect(myCalendar.fontFamilyHeader).toBe("'Open Sans', sans-serif");
    expect(calendarHTMLElement?.style.getPropertyValue("--cal-font-family-header")).toBe(
      "'Open Sans', sans-serif"
    );
  });

  test("fontFamilyWeekdays should be Open Sans", () => {
    const myCalendar = new Calendar({
      fontFamilyWeekdays: "'Open Sans', sans-serif",
    });
    const calendarHTMLElement = document.querySelector(
      `${DEFAULT_ID} .color-calendar`
    ) as HTMLElement;
    expect(myCalendar.fontFamilyWeekdays).toBe("'Open Sans', sans-serif");
    expect(calendarHTMLElement?.style.getPropertyValue("--cal-font-family-weekdays")).toBe(
      "'Open Sans', sans-serif"
    );
  });

  test("fontFamilyBody should be Open Sans", () => {
    const myCalendar = new Calendar({
      fontFamilyBody: "'Open Sans', sans-serif",
    });
    const calendarHTMLElement = document.querySelector(
      `${DEFAULT_ID} .color-calendar`
    ) as HTMLElement;
    expect(myCalendar.fontFamilyBody).toBe("'Open Sans', sans-serif");
    expect(calendarHTMLElement?.style.getPropertyValue("--cal-font-family-body")).toBe(
      "'Open Sans', sans-serif"
    );
  });

  test('dropShadow should be "0 7px 30px -10px rgba(150, 170, 180, 0.5)"', () => {
    const myCalendar = new Calendar({
      dropShadow: "0 7px 30px -10px rgba(150, 170, 180, 0.5)",
    });
    const calendarHTMLElement = document.querySelector(
      `${DEFAULT_ID} .color-calendar`
    ) as HTMLElement;
    expect(myCalendar.dropShadow).toBe("0 7px 30px -10px rgba(150, 170, 180, 0.5)");
    expect(calendarHTMLElement?.style.getPropertyValue("--cal-drop-shadow")).toBe(
      "0 7px 30px -10px rgba(150, 170, 180, 0.5)"
    );
  });

  test('border should be "5px solid red"', () => {
    const myCalendar = new Calendar({
      border: "5px solid red",
    });
    const calendarHTMLElement = document.querySelector(
      `${DEFAULT_ID} .color-calendar`
    ) as HTMLElement;
    expect(myCalendar.border).toBe("5px solid red");
    expect(calendarHTMLElement?.style.getPropertyValue("--cal-border")).toBe("5px solid red");
  });

  test("borderRadius should be 10px", () => {
    const myCalendar = new Calendar({
      borderRadius: "10px",
    });
    const calendarHTMLElement = document.querySelector(
      `${DEFAULT_ID} .color-calendar`
    ) as HTMLElement;
    expect(myCalendar.borderRadius).toBe("10px");
    expect(calendarHTMLElement?.style.getPropertyValue("--cal-border-radius")).toBe("10px");
  });

  test("disableMonthYearPickers should be true", () => {
    const myCalendar = new Calendar({
      disableMonthYearPickers: true,
    });
    const calendarHTMLElement = document.querySelector(
      `${DEFAULT_ID} .color-calendar`
    ) as HTMLElement;
    expect(myCalendar.disableMonthYearPickers).toBe(true);

    const monthButton = calendarHTMLElement.querySelector(".calendar__month") as HTMLElement;
    const yearButton = calendarHTMLElement.querySelector(".calendar__year") as HTMLElement;
    monthButton.click();
    yearButton.click();
    const picker = calendarHTMLElement.querySelector(".calendar__picker") as HTMLElement;
    expect(picker.style.visibility).toBe("hidden");
  });

  test("disableDayClick should be true", () => {
    const myCalendar = new Calendar({
      disableDayClick: true,
    });
    expect(myCalendar.disableDayClick).toBe(true);
  });

  test("disableMonthArrowClick should be true", () => {
    const myCalendar = new Calendar({
      disableMonthArrowClick: true,
    });
    expect(myCalendar.disableMonthArrowClick).toBe(true);
  });

  test("initialSelectedDate should be set to custom date", () => {
    const customDate = new Date(2024, 5, 15); // June 15, 2024
    const myCalendar = new Calendar({
      initialSelectedDate: customDate,
    });

    expect(myCalendar.selectedDate).toBeInstanceOf(Date);
    expect(myCalendar.currentViewDate).toBeInstanceOf(Date);

    // Should be set to the custom date
    expect(myCalendar.selectedDate?.getDate()).toBe(15);
    expect(myCalendar.selectedDate?.getMonth()).toBe(5); // June (0-indexed)
    expect(myCalendar.selectedDate?.getFullYear()).toBe(2024);

    expect(myCalendar.currentViewDate.getDate()).toBe(15);
    expect(myCalendar.currentViewDate.getMonth()).toBe(5);
    expect(myCalendar.currentViewDate.getFullYear()).toBe(2024);
  });

  test("initialSelectedDate should update calendar view to correct month", () => {
    const customDate = new Date(2024, 8, 20); // September 20, 2024
    new Calendar({
      initialSelectedDate: customDate,
    });

    const calendarHTMLElement = document.querySelector(
      `${DEFAULT_ID} .color-calendar`
    ) as HTMLElement;

    // Calendar should display September 2024
    expect(calendarHTMLElement?.querySelector(".calendar__month")?.innerHTML).toBe("September");
    expect(calendarHTMLElement?.querySelector(".calendar__year")?.innerHTML).toBe("2024");
  });

  test("initialSelectedDate should work with events data", () => {
    const customDate = new Date(2024, 5, 15); // June 15, 2024
    const myCalendar = new Calendar({
      initialSelectedDate: customDate,
      eventsData: [
        {
          start: "2024-06-15T10:00:00",
          end: "2024-06-15T12:00:00",
          name: "Test Event",
        },
      ],
    });

    expect(myCalendar.eventsData).toHaveLength(1);
    expect(myCalendar.selectedDate?.getDate()).toBe(15);
    expect(myCalendar.selectedDate?.getMonth()).toBe(5);
    expect(myCalendar.selectedDate?.getFullYear()).toBe(2024);
  });

  test("initialSelectedDate should be null when explicitly set to null", () => {
    const myCalendar = new Calendar({
      initialSelectedDate: null,
    });

    expect(myCalendar.selectedDate).toBeNull();
    expect(myCalendar.currentViewDate).toBeInstanceOf(Date);
    // Should still show current month
    const today = new Date();
    expect(myCalendar.currentViewDate.getMonth()).toBe(today.getMonth());
    expect(myCalendar.currentViewDate.getFullYear()).toBe(today.getFullYear());
  });

  test("setSelectedDate should handle null values", () => {
    const myCalendar = new Calendar();

    // Initially should have a selected date (today)
    expect(myCalendar.selectedDate).toBeInstanceOf(Date);

    // Set to null
    myCalendar.setSelectedDate(null);
    expect(myCalendar.selectedDate).toBeNull();

    // Set back to a date
    const testDate = new Date(2024, 5, 15);
    myCalendar.setSelectedDate(testDate);
    expect(myCalendar.selectedDate).toBeInstanceOf(Date);
    expect(myCalendar.selectedDate?.getDate()).toBe(15);
  });

  test("getSelectedDate should return null when no date is selected", () => {
    const myCalendar = new Calendar({
      initialSelectedDate: null,
    });

    expect(myCalendar.getSelectedDate()).toBeNull();
  });

  test.todo("onMonthChange should be executed");

  test.todo("onSelectedDateChange should be executed");
});

describe("function-based container parameter", () => {
  test("should work with function that returns HTMLElement", () => {
    const mockElement = document.createElement("div");
    mockElement.id = "test-calendar";
    document.body.appendChild(mockElement);

    const containerFunction = () => mockElement;
    const myCalendar = new Calendar({ container: containerFunction });

    expect(myCalendar.calendar).toBe(mockElement);
    expect(myCalendar.calendar).not.toBeNull();
  });

  test("should work with function that returns null", () => {
    const containerFunction = () => null;

    expect(() => {
      new Calendar({ container: containerFunction });
    }).toThrow("[COLOR-CALENDAR] Element with container function not found");
  });

  test("should work with function that returns different element each time", () => {
    const element1 = document.createElement("div");
    element1.id = "calendar-1";
    const element2 = document.createElement("div");
    element2.id = "calendar-2";
    document.body.appendChild(element1);
    document.body.appendChild(element2);

    let callCount = 0;
    const containerFunction = () => {
      callCount++;
      return callCount === 1 ? element1 : element2;
    };

    const myCalendar = new Calendar({ container: containerFunction });
    expect(myCalendar.calendar).toBe(element1);
    expect(callCount).toBe(1);
  });

  test("should maintain backward compatibility with string container", () => {
    const mockElement = document.createElement("div");
    mockElement.id = "string-calendar";
    document.body.appendChild(mockElement);

    const myCalendar = new Calendar({ container: "#string-calendar" });

    expect(myCalendar.calendar).toBe(mockElement);
    expect(myCalendar.calendar).not.toBeNull();
  });

  test("should work with HTMLElement directly", () => {
    const mockElement = document.createElement("div");
    mockElement.id = "direct-element";
    document.body.appendChild(mockElement);

    const myCalendar = new Calendar({ container: mockElement });

    expect(myCalendar.calendar).toBe(mockElement);
    expect(myCalendar.calendar).not.toBeNull();
  });

  test("should handle function that throws error", () => {
    const containerFunction = () => {
      throw new Error("Function error");
    };

    expect(() => {
      new Calendar({ container: containerFunction });
    }).toThrow("Function error");
  });
});
