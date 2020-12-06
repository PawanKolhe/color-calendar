import Calendar from '../index';

test('creates calendar with correct id', () => {
  document.body.innerHTML = `
    <div id="MyCalendar"></div>
  `;

  const myCalendar = new Calendar({
    id: '#MyCalendar',
    calendarSize: 'small'
  });

  expect(myCalendar.id).toBe('#MyCalendar');
});
