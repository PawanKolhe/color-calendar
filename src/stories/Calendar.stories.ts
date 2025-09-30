import type { Meta, StoryObj } from "@storybook/html-vite";

import { fn } from "storybook/test";

import type { CalendarProps } from "./CalendarExample";
import { createCalendar } from "./CalendarExample";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/Calendar",
  tags: ["autodocs"],
  render: args => {
    return createCalendar(args);
  },
  argTypes: {
    calendarSize: {
      control: { type: "select" },
      options: ["small", "large"],
      description: "Size of the calendar"
    },
    theme: {
      control: { type: "select" },
      options: ["basic", "glass"],
      description: "Theme style for the calendar"
    },
    primaryColor: {
      control: "color",
      description: "Primary color for the calendar"
    },
    headerColor: {
      control: "color",
      description: "Color of the header text"
    },
    headerBackgroundColor: {
      control: "color",
      description: "Background color of the header"
    },
    weekdaysColor: {
      control: "color",
      description: "Color of the weekday labels"
    },
    weekdayDisplayType: {
      control: { type: "select" },
      options: ["short", "long-lower", "long-upper"],
      description: "Display format for weekdays"
    },
    monthDisplayType: {
      control: { type: "select" },
      options: ["short", "long"],
      description: "Display format for month names"
    },
    startWeekday: {
      control: { type: "select" },
      options: [0, 1, 2, 3, 4, 5, 6],
      description: "First day of the week (0=Sunday, 1=Monday, etc.)"
    },
    fontFamilyHeader: {
      control: "text",
      description: "Font family for header text"
    },
    fontFamilyWeekdays: {
      control: "text",
      description: "Font family for weekday labels"
    },
    fontFamilyBody: {
      control: "text",
      description: "Font family for day numbers"
    },
    dropShadow: {
      control: "text",
      description: "CSS drop-shadow for the calendar"
    },
    border: {
      control: "text",
      description: "CSS border for the calendar"
    },
    borderRadius: {
      control: "text",
      description: "CSS border-radius for the calendar"
    },
    disableMonthYearPickers: {
      control: "boolean",
      description: "Disable month/year picker functionality"
    },
    disableDayClick: {
      control: "boolean",
      description: "Disable day click functionality"
    },
    disableMonthArrowClick: {
      control: "boolean",
      description: "Disable month navigation arrows"
    },
    sampleEvents: {
      control: "boolean",
      description: "Show sample events data"
    },
    monthChanged: { action: "monthChanged" },
    dateChanged: { action: "dateChanged" },
    selectedDateClicked: { action: "selectedDateClicked" }
  },
  args: {
    calendarSize: "large",
    theme: "basic",
    weekdayDisplayType: "long-lower",
    monthDisplayType: "long",
    startWeekday: 0,
    sampleEvents: true as any,
    monthChanged: fn(),
    dateChanged: fn(),
    selectedDateClicked: fn()
  }
} satisfies Meta<CalendarProps>;

export default meta;
type Story = StoryObj<CalendarProps>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    calendarSize: "large",
    theme: "basic"
  }
};

export const Small: Story = {
  args: {
    calendarSize: "small",
    theme: "basic"
  }
};

export const GlassTheme: Story = {
  args: {
    calendarSize: "large",
    theme: "glass"
  }
};

export const WithEvents: Story = {
  args: {
    calendarSize: "large",
    theme: "basic",
    sampleEvents: true as any
  }
};

export const MondayStart: Story = {
  args: {
    calendarSize: "large",
    theme: "basic",
    startWeekday: 1,
    weekdayDisplayType: "long-lower"
  }
};

export const ShortWeekdays: Story = {
  args: {
    calendarSize: "large",
    theme: "basic",
    weekdayDisplayType: "short"
  }
};

export const ShortMonths: Story = {
  args: {
    calendarSize: "large",
    theme: "basic",
    monthDisplayType: "short"
  }
};

export const DisabledPickers: Story = {
  args: {
    calendarSize: "large",
    theme: "basic",
    disableMonthYearPickers: true
  }
};

export const DisabledDayClick: Story = {
  args: {
    calendarSize: "large",
    theme: "basic",
    disableDayClick: true
  }
};

export const CustomFonts: Story = {
  args: {
    calendarSize: "large",
    theme: "basic",
    fontFamilyHeader: "Georgia, serif",
    fontFamilyWeekdays: "Arial, sans-serif",
    fontFamilyBody: "Courier New, monospace"
  }
};

export const CustomStyling: Story = {
  args: {
    calendarSize: "large",
    theme: "basic",
    dropShadow: "0 4px 8px rgba(0,0,0,0.3)",
    border: "2px solid #e0e0e0",
    borderRadius: "12px"
  }
};

// Stories showcasing different color themes and configurations from the image

export const SkyBlueTheme: Story = {
  args: {
    primaryColor: "#04AFDF",
    theme: "glass",
    border: "7px solid #04AFDF",
    weekdayDisplayType: "long-upper",
    monthDisplayType: "long",
    headerBackgroundColor: "#04AFDF",
    sampleEvents: true as any
  }
};

export const GlassLeftAlignTheme: Story = {
  args: {
    id: "#calendar-a",
    theme: "glass",
    weekdayDisplayType: "long-upper",
    monthDisplayType: "long",
    calendarSize: "small",
    layoutModifiers: ["month-left-align"],
    sampleEvents: true as any
  }
};

export const BlackYellowTheme: Story = {
  args: {
    primaryColor: "#000000",
    theme: "glass",
    border: "7px solid #000000",
    headerColor: "#eab308",
    weekdayDisplayType: "long-upper",
    monthDisplayType: "long",
    headerBackgroundColor: "#000000",
    sampleEvents: true as any
  }
};
