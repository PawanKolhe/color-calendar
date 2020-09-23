export function addEventListeners() {
  // Event Listeners
  this.prevButton.addEventListener("click",
    this.handlePrevMonthButtonClick.bind(this)
  );
  this.nextButton.addEventListener("click",
    this.handleNextMonthButtonClick.bind(this)
  );
  this.monthyearDisplay.addEventListener("click",
    this.handleMonthYearDisplayClick.bind(this)
  );
  this.calendarDays.addEventListener("click",
    this.handleCalendarDayClick.bind(this)
  );
  this.pickerMonthContainer.addEventListener("click",
    this.handleMonthPickerClick.bind(this)
  );
  this.pickerYearContainer.addEventListener("click",
    this.handleYearPickerClick.bind(this)
  );
  this.yearPickerChevronLeft.addEventListener("click",
    this.handleYearChevronLeftClick.bind(this)
  );
  this.yearPickerChevronRight.addEventListener("click",
    this.handleYearChevronRightClick.bind(this)
  );
}
