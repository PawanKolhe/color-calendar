import Calendar from '../../index';

import { MONTH_NAMES_SHORT, resetDOM } from '../../testHelper';

beforeEach(() => {
  resetDOM();
});

test('go to next month on next month button click', () => {
  const myCalendar = new Calendar({ monthDisplayType: 'short' });

  const todayMonthIndex = new Date().getMonth();
  myCalendar.nextButton.click();
  const calendarMonth = myCalendar.monthDisplay.innerHTML;
  const calendarMonthIndex = MONTH_NAMES_SHORT.findIndex(month => calendarMonth === month);

  expect(calendarMonthIndex).toBe((todayMonthIndex + 1) % 12);
});

test('go to previous month on previous month button click', () => {
  const myCalendar = new Calendar({ monthDisplayType: 'short' });

  const todayMonthIndex = new Date().getMonth();
  myCalendar.prevButton.click();
  const calendarMonth = myCalendar.monthDisplay.innerHTML;
  const calendarMonthIndex = MONTH_NAMES_SHORT.findIndex(month => calendarMonth === month);

  expect(calendarMonthIndex).toBe((todayMonthIndex - 1) % 12);
});

test('open month picker on month text click', () => {
  const myCalendar = new Calendar();
  const monthPicker = myCalendar.pickerContainer.querySelector('.calendar__picker-month') as HTMLElement;
  const yearPicker = myCalendar.pickerContainer.querySelector('.calendar__picker-year') as HTMLElement;
  
  expect(myCalendar.pickerContainer.style.visibility).toBe('hidden');
  myCalendar.monthDisplay.click();
  expect(myCalendar.pickerContainer.style.visibility).toBe('visible');
  expect(monthPicker.style.display).toBe('grid');
  expect(yearPicker.style.display).toBe('none');
});

test('open year picker on year text click', () => {
  const myCalendar = new Calendar();
  const yearPicker = myCalendar.pickerContainer.querySelector('.calendar__picker-year') as HTMLElement;
  const monthPicker = myCalendar.pickerContainer.querySelector('.calendar__picker-month') as HTMLElement;
  
  expect(myCalendar.pickerContainer.style.visibility).toBe('hidden');
  myCalendar.yearDisplay.click();
  expect(myCalendar.pickerContainer.style.visibility).toBe('visible');
  expect(yearPicker.style.display).toBe('grid');
  expect(monthPicker.style.display).toBe('none');
});
