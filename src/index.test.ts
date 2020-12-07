import Calendar from './index';
import { CalendarOptions } from "./types.d";

import * as picker from "./modules/picker/picker";
import { addEventListeners } from "./modules/addEventListeners";
import { configureStylePreferences } from "./modules/stylePreference";

jest.mock('./modules/picker/picker');
jest.mock('./modules/addEventListeners');
jest.mock('./modules/stylePreference');

const DEFAULT_ID = '#color-calendar';

const resetDOM = () => {
  // Inserts clean DIVs with id to the DOM before each test
  document.body.innerHTML = `
    <div id="MyTestCalendar"></div>
    <div id="color-calendar"></div>
  `;
}

beforeEach(() => {
  resetDOM();
});

test('should initialize calendar', () => {
  const mockTogglePicker = picker.togglePicker as jest.MockedFunction<typeof picker.togglePicker>;
  const mockConfigureStylePreferences = configureStylePreferences as jest.MockedFunction<typeof configureStylePreferences>;
  const mockAddEventListeners = addEventListeners as jest.MockedFunction<typeof addEventListeners>;
  jest.spyOn(Calendar.prototype, 'reset');

  const myCalendar = new Calendar();

  expect(myCalendar.calendar).not.toBeNull();
  expect(mockTogglePicker).toBeCalledTimes(1);
  expect(mockConfigureStylePreferences).toBeCalledTimes(1);
  expect(mockAddEventListeners).toBeCalledTimes(1);
  expect(myCalendar.reset).toBeCalledTimes(1);
});


describe('default calendar options when instantiated', () => {
  let myCalendar: Calendar;
  let calendarHTMLElement: HTMLElement | null;

  beforeEach(() => {
    myCalendar = new Calendar();
    calendarHTMLElement = document.querySelector(DEFAULT_ID)?.firstElementChild as HTMLElement;
  });

  test('id should not be null', () => {
    calendarHTMLElement = document.querySelector(`${DEFAULT_ID} .color-calendar`);
    expect(myCalendar.id).toBe(DEFAULT_ID);
    expect(calendarHTMLElement).not.toBeNull();
  });

  test('calendarSize should be large', () => {
    expect(myCalendar.calendarSize).toBe('large');
    expect(calendarHTMLElement?.classList).toContain('color-calendar--large');
  });

  test('layoutModifiers should not be applied', () => {
    expect(myCalendar.layoutModifiers).toHaveLength(0);
    expect(calendarHTMLElement?.classList).not.toContain('month-left-align');
  });

  test('eventsData should be empty', () => {
    expect(myCalendar.eventsData).toHaveLength(0);
  });

  test('theme should be basic', () => {
    expect(myCalendar.theme).toBe('basic');
    expect(calendarHTMLElement?.classList).toContain('basic');
  });

  test('primaryColor should be undefined', () => {
    expect(myCalendar.primaryColor).toBeUndefined();
    expect(calendarHTMLElement?.style.getPropertyValue('--cal-color-primary')).toBe('');
  });

  test('headerColor should be undefined', () => {
    expect(myCalendar.headerColor).toBeUndefined();
    expect(calendarHTMLElement?.style.getPropertyValue('--cal-header-color')).toBe('');
  });

  test('headerBackgroundColor should be undefined', () => {
    expect(myCalendar.headerBackgroundColor).toBeUndefined();
    expect(calendarHTMLElement?.style.getPropertyValue('--cal-header-background-color')).toBe('');
  });

  test('weekdaysColor should be undefined', () => {
    expect(myCalendar.weekdaysColor).toBeUndefined();
    expect(calendarHTMLElement?.style.getPropertyValue('--cal-weekdays-color')).toBe('');
  });

  test('weekdayDisplayType should be long-lower', () => {
    expect(myCalendar.monthDisplayType).toBe('long');
    expect(calendarHTMLElement?.querySelector('.calendar__weekdays')?.firstElementChild?.innerHTML).toBe('Sun');
  });

  test('monthDisplayType should be long', () => {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const todayMonth = monthNames[new Date().getMonth()];
    expect(myCalendar.monthDisplayType).toBe('long');
    expect(calendarHTMLElement?.querySelector('.calendar__month')?.innerHTML).toBe(todayMonth);
  });

  test('startWeekday should be 0 (Sun)', () => {
    expect(myCalendar.startWeekday).toBe(0);
    expect(calendarHTMLElement?.querySelector('.calendar__weekdays')?.firstElementChild?.innerHTML).toBe('Sun');
  });

  test('fontFamilyHeader should be undefined', () => {
    expect(myCalendar.fontFamilyHeader).toBeUndefined();
    expect(calendarHTMLElement?.style.getPropertyValue('--cal-font-family-header')).toBe('');
  });

  test('fontFamilyWeekdays should be undefined', () => {
    expect(myCalendar.fontFamilyWeekdays).toBeUndefined();
    expect(calendarHTMLElement?.style.getPropertyValue('--cal-font-family-weekdays')).toBe('');
  });

  test('fontFamilyBody should be undefined', () => {
    expect(myCalendar.fontFamilyBody).toBeUndefined();
    expect(calendarHTMLElement?.style.getPropertyValue('--cal-font-family-body')).toBe('');
  });

  test('dropShadow should be undefined', () => {
    expect(myCalendar.dropShadow).toBeUndefined();
    expect(calendarHTMLElement?.style.getPropertyValue('--cal-drop-shadow')).toBe('');
  });

  test('border should be undefined', () => {
    expect(myCalendar.border).toBeUndefined();
    expect(calendarHTMLElement?.style.getPropertyValue('--cal-border')).toBe('');
  });

  test('borderRadius should be undefined', () => {
    expect(myCalendar.borderRadius).toBeUndefined();
    expect(calendarHTMLElement?.style.getPropertyValue('--cal-border-radius')).toBe('');
  });

  test('disableMonthYearPickers should be false', () => {
    expect(myCalendar.disableMonthYearPickers).toBeFalsy();
  });

  test('disableDayClick should be false', () => {
    expect(myCalendar.disableDayClick).toBeFalsy();
  });

  test('disableMonthArrowClick should be false', () => {
    expect(myCalendar.disableMonthArrowClick).toBeFalsy();
  });

  test('monthChanged should be false', () => {
    expect(myCalendar.monthChanged).toBeUndefined();
  });

  test('dateChanged should be false', () => {
    expect(myCalendar.dateChanged).toBeUndefined();
  });
});


describe('custom calendar options when instantiated', () => {

  test('creates calendar', () => {
    const id = '#MyTestCalendar';
    const myCalendar = new Calendar({ id });
    const calendarHTMLElement = document.querySelector(`${id} .color-calendar`);

    expect(calendarHTMLElement).not.toBeNull();
  });

  test('custom option calendarSize', () => {
    const options: CalendarOptions = {
      calendarSize: 'small'
    };
    const myCalendar = new Calendar(options);
    const calendarHTMLElement = document.querySelector(`${DEFAULT_ID} .color-calendar`);

    expect(calendarHTMLElement?.classList).toContain('color-calendar--small');
  });
});
