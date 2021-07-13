import Calendar from '../../index';

import { resetDOM } from '../../testHelper';

beforeEach(() => {
  resetDOM();
});

test('should add events', () => {
  const myCalendar = new Calendar();

  const eventsData = [
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
  ];
  myCalendar.addEventsData(eventsData);

  expect(myCalendar.getEventsData()).toEqual(eventsData);
});

test('should get today month events', () => {
  const myCalendar = new Calendar();

  const todayYear = new Date().getFullYear();

  let todayMonth = (new Date().getMonth() + 1).toString();
  if (parseInt(todayMonth, 10) < 10) {
    todayMonth = `0${todayMonth}`
  }
  let nextMonth = parseInt(todayMonth) + 1;
  if (nextMonth > 12) {
    nextMonth = 1;
  }
  const eventsData = [
    {
      start: `${todayYear}-${todayMonth}-08T13:00:00`,
      end: `${todayYear}-${todayMonth}-08T17:30:00`,
      name: 'Sample Event 1'
    },
    {
      start: `${todayYear}-${nextMonth}-09T13:00:00`,
      end: `${todayYear}-${nextMonth}-09T17:30:00`,
      name: 'Sample Event 2'
    }
  ];
  myCalendar.addEventsData(eventsData);

  expect(myCalendar.getMonthEvents()).toEqual([
    {
      start: `${todayYear}-${todayMonth}-08T13:00:00`,
      end: `${todayYear}-${todayMonth}-08T17:30:00`,
      name: 'Sample Event 1'
    }
  ]);
});

