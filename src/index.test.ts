import Calendar from './index';
import { CalendarOptions } from "./types.d";

beforeEach(() => {
  // Inserts clean DIVs with id before each test
  document.body.innerHTML = `
    <div id="MyTestCalendar"></div>
    <div id="color-calendar"></div>
  `;
});

test('creates calendar with correct id', () => {
  const id = '#MyTestCalendar';
  const myCalendar = new Calendar({ id });
  const calendarHTMLElement = document.querySelector(`${id} .color-calendar`);

  expect(calendarHTMLElement).not.toBeNull();
});


describe('calendar has default options when instantiated', () => {
  let myCalendar;
  let calendarHTMLElement: HTMLElement;

  beforeEach(() => {
    myCalendar = new Calendar();
    calendarHTMLElement = document.querySelector('#color-calendar') as HTMLElement;
  });

  test('default option id', () => {
    expect(calendarHTMLElement?.firstElementChild?.classList).toContain('color-calendar--large');
  });

  test('default option calendarSize', () => {
    expect(calendarHTMLElement?.firstElementChild?.classList).toContain('color-calendar--large');
  });

  test('default option layoutModifiers', () => {
    expect(calendarHTMLElement?.firstElementChild?.classList).not.toContain('month-left-align');
  });
});


describe('custom calendar options passed when instantiated', () => {
  test('custom option calendarSize', () => {
    const options: CalendarOptions = {
      calendarSize: 'small'
    };
    const myCalendar = new Calendar(options);
    const calendarHTMLElement = document.querySelector('#color-calendar');

    expect(calendarHTMLElement?.firstElementChild?.classList).toContain('color-calendar--small');
  });
});
