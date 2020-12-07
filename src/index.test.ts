import Calendar from './index';
import { CalendarOptions } from "./types.d";

import * as picker from "./modules/picker/picker";
import { addEventListeners } from "./modules/addEventListeners";
import { configureStylePreferences } from "./modules/stylePreference";

jest.mock('./modules/picker/picker');
jest.mock('./modules/addEventListeners');
jest.mock('./modules/stylePreference');

const DEFAULT_ID = '#color-calendar';

beforeEach(() => {
  // Inserts clean DIVs with id to the DOM before each test
  document.body.innerHTML = `
    <div id="MyTestCalendar"></div>
    <div id="color-calendar"></div>
  `;
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
  let myCalendar;
  let calendarHTMLElement: HTMLElement | null;

  beforeEach(() => {
    myCalendar = new Calendar();
    calendarHTMLElement = document.querySelector(DEFAULT_ID)?.firstElementChild as HTMLElement;
  });

  test('default option id', () => {
    calendarHTMLElement = document.querySelector(`${DEFAULT_ID} .color-calendar`);
    expect(calendarHTMLElement).not.toBeNull();
  });

  test('default option calendarSize', () => {
    expect(calendarHTMLElement?.classList).toContain('color-calendar--large');
  });

  test('default option layoutModifiers', () => {
    expect(calendarHTMLElement?.classList).not.toContain('month-left-align');
  });

  test('default option monthDisplayType', () => {
    expect(calendarHTMLElement?.classList).not.toContain('month-left-align');
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
