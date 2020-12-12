import Calendar from '../../../index';
import { resetDOM } from '../../../testHelper';

beforeEach(() => {
  resetDOM();
});

test('correct month selected as today month', () => {
  const myCalendar = new Calendar();

  const todayMonthIndex = new Date().getMonth().toString();
  const selectedMonthElement = myCalendar.pickerMonthContainer.querySelector('.calendar__picker-month-today') as HTMLElement;
  const selectedMonthIndex = selectedMonthElement.getAttribute('data-value');

  expect(todayMonthIndex).toBe(selectedMonthIndex);
});
