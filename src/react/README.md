# Color Calendar React Component

A React wrapper component for the Color Calendar library, providing a React-friendly interface with full TypeScript support.

## Features

- 🚀 **React Integration**: Built specifically for React applications
- 📱 **TypeScript Support**: Full type safety and IntelliSense
- 🎨 **Customizable**: Extensive theming and styling options
- 📅 **Event Management**: Built-in event handling and display
- 🔄 **Imperative API**: Programmatic control via refs
- 🎯 **Accessible**: WCAG compliant with keyboard navigation

## Basic Usage

```tsx
import React from 'react';
import { ColorCalendar } from 'color-calendar/react';

function App() {
  return (
    <ColorCalendar
      calendarSize="large"
      theme="basic"
      onSelectedDateChange={(date, events) => {
        console.log('Selected date:', date);
        console.log('Events:', events);
      }}
    />
  );
}
```

## Controlled Component

The `ColorCalendar` supports controlled component pattern for managing the selected date:

```tsx
import React, { useState } from 'react';
import { ColorCalendar } from 'color-calendar/react';

function ControlledCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2024, 5, 15));

  const handlePreviousDay = () => {
    if (selectedDate) {
      const prevDay = new Date(selectedDate);
      prevDay.setDate(prevDay.getDate() - 1);
      setSelectedDate(prevDay);
    }
  };

  const handleNextDay = () => {
    if (selectedDate) {
      const nextDay = new Date(selectedDate);
      nextDay.setDate(nextDay.getDate() + 1);
      setSelectedDate(nextDay);
    }
  };

  const handleClearSelection = () => {
    setSelectedDate(null);
  };

  return (
    <div>
      <div>
        <button onClick={handlePreviousDay} disabled={!selectedDate}>Previous Day</button>
        <button onClick={handleNextDay} disabled={!selectedDate}>Next Day</button>
        <button onClick={handleClearSelection}>Clear Selection</button>
      </div>
      <ColorCalendar
        selectedDate={selectedDate}
        onSelectedDateChange={setSelectedDate}
        calendarSize="large"
        theme="basic"
      />
    </div>
  );
}
```

## No Initial Selection

You can also start with no date selected:

```tsx
import React, { useState } from 'react';
import { ColorCalendar } from 'color-calendar/react';

function NoInitialSelection() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <ColorCalendar
      selectedDate={selectedDate}
      onSelectedDateChange={setSelectedDate}
      calendarSize="large"
      theme="basic"
    />
  );
}
```

## Props

The `ColorCalendar` component accepts all the same props as the vanilla JavaScript version, plus React-specific props:

### React-Specific Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | CSS class name for the container |
| `style` | `React.CSSProperties` | - | Inline styles for the container |
| `selectedDate` | `Date` | - | Controlled selected date (for controlled component pattern) |

### Core Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `calendarSize` | `"small" \| "large"` | `"large"` | Size of the calendar |
| `theme` | `"basic" \| "glass"` | `"basic"` | Visual theme |
| `eventsData` | `EventData[]` | `[]` | Array of events to display |
| `primaryColor` | `string` | - | Primary color for the calendar |
| `onSelectedDateChange` | `(date?: Date, events?: EventData[]) => void` | - | Callback when selected date changes |
| `onMonthChange` | `(date?: Date, events?: EventData[]) => void` | - | Callback when month changes |
| `onSelectedDateClick` | `(date?: Date, events?: EventData[]) => void` | - | Callback when a date is clicked |

## Imperative API

You can control the calendar programmatically using refs:

```tsx
import React, { useRef } from 'react';
import { ColorCalendar, type ColorCalendarRef } from 'color-calendar/react';

function App() {
  const calendarRef = useRef<ColorCalendarRef>(null);

  const navigateToNextMonth = () => {
    if (calendarRef.current) {
      const calendar = calendarRef.current.getCalendar();
      if (calendar) {
        const currentDate = calendar.getSelectedDate();
        const nextMonth = new Date(currentDate);
        nextMonth.setMonth(currentDate.getMonth() + 1);
        calendarRef.current.setSelectedDate(nextMonth);
      }
    }
  };

  return (
    <div>
      <button onClick={navigateToNextMonth}>Next Month</button>
      
      <ColorCalendar
        ref={calendarRef}
        calendarSize="large"
        theme="basic"
        eventsData={[]}
      />
    </div>
  );
}
```

## Event Data Format

Events should be provided in the following format:

```tsx
interface EventData {
  start: string;        // ISO date string (YYYY-MM-DD)
  end: string;          // ISO date string (YYYY-MM-DD)
  color?: string;       // Hex color code
  name?: string;        // Event name
  title?: string;       // Alternative to name
  description?: string; // Event description
  [key: string]: any;   // Additional custom properties
}

const events: EventData[] = [
  {
    start: "2024-01-15",
    end: "2024-01-15",
    color: "#ff6b6b",
    name: "Team Meeting",
    description: "Daily standup meeting"
  }
];
```

## Testing

The component includes a `data-testid="color-calendar-container"` for easy testing:

```tsx
import { render, screen } from '@testing-library/react';
import { ColorCalendar } from 'color-calendar/react';

test('renders calendar', () => {
  render(<ColorCalendar calendarSize="large" theme="basic" />);
  expect(screen.getByTestId('color-calendar-container')).toBeInTheDocument();
});
```

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## License

MIT License - see the [GitHub repository](https://github.com/PawanKolhe/color-calendar) for details.