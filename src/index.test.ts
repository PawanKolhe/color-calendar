import Calendar from './index';
import { DEFAULT_ID, MONTH_NAMES_SHORT, MONTH_NAMES_LONG, resetDOM } from './testHelper';

jest.autoMockOff();

beforeEach(() => {
  resetDOM();
});

test('should initialize calendar', () => {
  jest.spyOn(Calendar.prototype, 'togglePicker');
  jest.spyOn(Calendar.prototype, 'configureStylePreferences');
  jest.spyOn(Calendar.prototype, 'addEventListeners');
  jest.spyOn(Calendar.prototype, 'reset');

  const myCalendar = new Calendar();

  expect(myCalendar.calendar).not.toBeNull();
  expect(myCalendar.togglePicker).toBeCalledTimes(1);
  expect(myCalendar.configureStylePreferences).toBeCalledTimes(1);
  expect(myCalendar.addEventListeners).toBeCalledTimes(1);
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
    expect(myCalendar.weekdayDisplayType).toBe('long-lower');
    expect(calendarHTMLElement?.querySelector('.calendar__weekdays')?.firstElementChild?.innerHTML).toBe('Sun');
  });

  test('monthDisplayType should be long', () => {
    const todayMonth = MONTH_NAMES_LONG[new Date().getMonth()];
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
    expect(myCalendar.disableMonthYearPickers).toBe(false);

    const monthButton = calendarHTMLElement?.querySelector('.calendar__month') as HTMLElement;
    const yearButton = calendarHTMLElement?.querySelector('.calendar__year') as HTMLElement;
    monthButton.click();
    yearButton.click();
    const picker = calendarHTMLElement?.querySelector('.calendar__picker') as HTMLElement;
    expect(picker.style.visibility).toBe('visible');
  });

  test('disableDayClick should be false', () => {
    expect(myCalendar.disableDayClick).toBe(false);
  });

  test('disableMonthArrowClick should be false', () => {
    expect(myCalendar.disableMonthArrowClick).toBe(false);
  });

  test('monthChanged should be undefined', () => {
    expect(myCalendar.monthChanged).toBeUndefined();
  });

  test('dateChanged should be undefined', () => {
    expect(myCalendar.dateChanged).toBeUndefined();
  });
});


describe('custom calendar options when instantiated', () => {
  test('id should not be #MyTestCalendar', () => {
    const id = '#MyTestCalendar';
    const myCalendar = new Calendar({ id });
    const calendarHTMLElement = document.querySelector(`${id} .color-calendar`);
    expect(myCalendar.id).toBe(id);
    expect(calendarHTMLElement).not.toBeNull();
  });

  test('calendarSize should be small', () => {
    const myCalendar = new Calendar({
      calendarSize: 'small'
    });
    const calendarHTMLElement = document.querySelector(`${DEFAULT_ID} .color-calendar`);
    expect(myCalendar.calendarSize).toBe('small');
    expect(calendarHTMLElement?.classList).toContain('color-calendar--small');
  });

  test('layoutModifiers should be applied', () => {
    const myCalendar = new Calendar({
      layoutModifiers: ['month-left-align']
    });
    const calendarHTMLElement = document.querySelector(`${DEFAULT_ID} .color-calendar`);
    expect(myCalendar.layoutModifiers).toHaveLength(1);
    expect(calendarHTMLElement?.classList).toContain('month-left-align');
  });

  test('eventsData should be inserted', () => {
    const myCalendar = new Calendar({
      eventsData: [
        {
          start: '2020-12-08T13:00:00',
          end: '2020-12-08T17:30:00',
          name: 'GitHub Universe 2020 (Day 1)'
        },
        {
          start: '2020-12-09T13:00:00',
          end: '2020-12-09T17:30:00',
          name: 'GitHub Universe 2020 (Day 2)'
        }
      ]
    });
    const calendarHTMLElement = document.querySelector(`${DEFAULT_ID} .color-calendar`);
    expect(myCalendar.eventsData).toHaveLength(2);
    expect(myCalendar.eventsData).toMatchObject([
      {
        start: '2020-12-08T13:00:00',
        end: '2020-12-08T17:30:00',
        name: 'GitHub Universe 2020 (Day 1)'
      },
      {
        start: '2020-12-09T13:00:00',
        end: '2020-12-09T17:30:00',
        name: 'GitHub Universe 2020 (Day 2)'
      }
    ]);
  });

  test('theme should be glass', () => {
    const myCalendar = new Calendar({
      theme: 'glass'
    });
    const calendarHTMLElement = document.querySelector(`${DEFAULT_ID} .color-calendar`);
    expect(myCalendar.theme).toBe('glass');
    expect(calendarHTMLElement?.classList).toContain('glass');
  });

  test('primaryColor should be #1877F2', () => {
    const myCalendar = new Calendar({
      primaryColor: '#1877F2'
    });
    const calendarHTMLElement = document.querySelector(`${DEFAULT_ID} .color-calendar`) as HTMLElement;
    expect(calendarHTMLElement).not.toBeNull();
    expect(myCalendar.primaryColor).toBe('#1877F2');
    expect(calendarHTMLElement?.style.getPropertyValue('--cal-color-primary')).toBe('#1877F2');
  });

  test('headerColor should be #36057D', () => {
    const myCalendar = new Calendar({
      headerColor: '#36057D'
    });
    const calendarHTMLElement = document.querySelector(`${DEFAULT_ID} .color-calendar`) as HTMLElement;
    expect(myCalendar.headerColor).toBe('#36057D');
    expect(calendarHTMLElement?.style.getPropertyValue('--cal-header-color')).toBe('#36057D');
  });

  test('headerBackgroundColor should be #E081C9', () => {
    const myCalendar = new Calendar({
      headerBackgroundColor: '#E081C9'
    });
    const calendarHTMLElement = document.querySelector(`${DEFAULT_ID} .color-calendar`) as HTMLElement;
    expect(myCalendar.headerBackgroundColor).toBe('#E081C9');
    expect(calendarHTMLElement?.style.getPropertyValue('--cal-header-background-color')).toBe('#E081C9');
  });

  test('weekdaysColor should be #17CBB5', () => {
    const myCalendar = new Calendar({
      weekdaysColor: '#17CBB5'
    });
    const calendarHTMLElement = document.querySelector(`${DEFAULT_ID} .color-calendar`) as HTMLElement;
    expect(myCalendar.weekdaysColor).toBe('#17CBB5');
    expect(calendarHTMLElement?.style.getPropertyValue('--cal-weekdays-color')).toBe('#17CBB5');
  });

  test('weekdayDisplayType should be short', () => {
    let myCalendar = new Calendar({
      weekdayDisplayType: 'short'
    });
    let calendarHTMLElement = document.querySelector(`${DEFAULT_ID} .color-calendar`) as HTMLElement;
    expect(myCalendar.weekdayDisplayType).toBe('short');
    expect(calendarHTMLElement?.querySelector('.calendar__weekdays')?.firstElementChild?.innerHTML).toBe('S');
    myCalendar = new Calendar({
      weekdayDisplayType: 'long-upper'
    });
    calendarHTMLElement = document.querySelector(`${DEFAULT_ID} .color-calendar`) as HTMLElement;
    expect(myCalendar.weekdayDisplayType).toBe('long-upper');
    expect(calendarHTMLElement?.querySelector('.calendar__weekdays')?.firstElementChild?.innerHTML).toBe('SUN')
  });

  test('monthDisplayType should be short', () => {
    let myCalendar = new Calendar({
      monthDisplayType: 'short'
    });
    let calendarHTMLElement = document.querySelector(`${DEFAULT_ID} .color-calendar`) as HTMLElement;
    const todayMonth = MONTH_NAMES_SHORT[new Date().getMonth()];
    expect(myCalendar.monthDisplayType).toBe('short');
    expect(calendarHTMLElement?.querySelector('.calendar__month')?.innerHTML).toBe(todayMonth);
  });

  test('startWeekday should be 3 (Wed)', () => {
    let myCalendar = new Calendar({
      startWeekday: 3
    });
    let calendarHTMLElement = document.querySelector(`${DEFAULT_ID} .color-calendar`) as HTMLElement;
    expect(myCalendar.startWeekday).toBe(3);
    expect(calendarHTMLElement?.querySelector('.calendar__weekdays')?.firstElementChild?.innerHTML).toBe('Wed');
  });

  test('fontFamilyHeader should be Open Sans', () => {
    let myCalendar = new Calendar({
      fontFamilyHeader: "'Open Sans', sans-serif"
    });
    let calendarHTMLElement = document.querySelector(`${DEFAULT_ID} .color-calendar`) as HTMLElement;
    expect(myCalendar.fontFamilyHeader).toBe("'Open Sans', sans-serif");
    expect(calendarHTMLElement?.style.getPropertyValue('--cal-font-family-header')).toBe("'Open Sans', sans-serif");
  });

  test('fontFamilyWeekdays should be Open Sans', () => {
    let myCalendar = new Calendar({
      fontFamilyWeekdays: "'Open Sans', sans-serif"
    });
    let calendarHTMLElement = document.querySelector(`${DEFAULT_ID} .color-calendar`) as HTMLElement;
    expect(myCalendar.fontFamilyWeekdays).toBe("'Open Sans', sans-serif");
    expect(calendarHTMLElement?.style.getPropertyValue('--cal-font-family-weekdays')).toBe("'Open Sans', sans-serif");
  });

  test('fontFamilyBody should be Open Sans', () => {
    let myCalendar = new Calendar({
      fontFamilyBody: "'Open Sans', sans-serif"
    });
    let calendarHTMLElement = document.querySelector(`${DEFAULT_ID} .color-calendar`) as HTMLElement;
    expect(myCalendar.fontFamilyBody).toBe("'Open Sans', sans-serif");
    expect(calendarHTMLElement?.style.getPropertyValue('--cal-font-family-body')).toBe("'Open Sans', sans-serif");
  });

  test('dropShadow should be "0 7px 30px -10px rgba(150, 170, 180, 0.5)"', () => {
    let myCalendar = new Calendar({
      dropShadow: "0 7px 30px -10px rgba(150, 170, 180, 0.5)"
    });
    let calendarHTMLElement = document.querySelector(`${DEFAULT_ID} .color-calendar`) as HTMLElement;
    expect(myCalendar.dropShadow).toBe("0 7px 30px -10px rgba(150, 170, 180, 0.5)");
    expect(calendarHTMLElement?.style.getPropertyValue('--cal-drop-shadow')).toBe("0 7px 30px -10px rgba(150, 170, 180, 0.5)");
  });

  test('border should be "5px solid red"', () => {
    let myCalendar = new Calendar({
      border: "5px solid red"
    });
    let calendarHTMLElement = document.querySelector(`${DEFAULT_ID} .color-calendar`) as HTMLElement;
    expect(myCalendar.border).toBe("5px solid red");
    expect(calendarHTMLElement?.style.getPropertyValue('--cal-border')).toBe("5px solid red");
  });

  test('borderRadius should be 10px', () => {
    let myCalendar = new Calendar({
      borderRadius: "10px"
    });
    let calendarHTMLElement = document.querySelector(`${DEFAULT_ID} .color-calendar`) as HTMLElement;
    expect(myCalendar.borderRadius).toBe('10px');
    expect(calendarHTMLElement?.style.getPropertyValue('--cal-border-radius')).toBe('10px');
  });

  test('disableMonthYearPickers should be true', () => {
    const myCalendar = new Calendar({
      disableMonthYearPickers: true
    });
    const calendarHTMLElement = document.querySelector(`${DEFAULT_ID} .color-calendar`) as HTMLElement;
    expect(myCalendar.disableMonthYearPickers).toBe(true);

    const monthButton = calendarHTMLElement.querySelector('.calendar__month') as HTMLElement;
    const yearButton = calendarHTMLElement.querySelector('.calendar__year') as HTMLElement;
    monthButton.click();
    yearButton.click();
    const picker = calendarHTMLElement.querySelector('.calendar__picker') as HTMLElement;
    expect(picker.style.visibility).toBe('hidden');
  });

  test('disableDayClick should be true', () => {
    const myCalendar = new Calendar({
      disableDayClick: true
    });
    expect(myCalendar.disableDayClick).toBe(true);
  });

  test('disableMonthArrowClick should be true', () => {
    const myCalendar = new Calendar({
      disableMonthArrowClick: true
    });
    expect(myCalendar.disableMonthArrowClick).toBe(true);
  });

  test.todo('monthChanged should be executed');

  test.todo('dateChanged should be executed');
});
