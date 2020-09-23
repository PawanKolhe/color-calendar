export function handleYearPickerClick(e: any) {
  // Filter out unwanted click events
  if (!(e.target.classList.contains("calendar__picker-year-option"))) {
    return;
  }

  this.yearPickerOffset += this.yearPickerOffsetTemporary;

  const newYearValue = parseInt(e.target.innerText);
  const newYearIndex = parseInt(e.target.dataset.value);
  this.updateYearPickerSelection(newYearValue, newYearIndex);
  this.updateCurrentDate(0, undefined, undefined, newYearValue);
  this.togglePicker(false);
}

export function updateYearPickerSelection(newYearValue: number, newYearIndex?: number) {
  if(newYearIndex === undefined) {
    for(let i = 0; i < 12; i++) {
      let yearPickerChildren = this.pickerYearContainer!.children[i] as HTMLElement;
      let elementYear = parseInt(yearPickerChildren.innerHTML)
      if(elementYear === newYearValue && yearPickerChildren.dataset.value) {
        newYearIndex = parseInt(yearPickerChildren.dataset.value);
        break;
      }
    }

    if(newYearIndex === undefined) {
      return;
    }
  }

  this.removeYearPickerSelection();
  this.pickerYearContainer!.children[newYearIndex].classList.add('calendar__picker-year-selected');
}

export function updateYearPickerTodaySelection() {
  // Add today year marker
  if(parseInt(this.pickerYearContainer!.children[4].innerHTML) === this.today.getFullYear()) {
    this.pickerYearContainer!.children[4].classList.add('calendar__picker-year-today');
  } else {
    this.pickerYearContainer!.children[4].classList.remove('calendar__picker-year-today');
  }
}

export function removeYearPickerSelection() {
  // Remove old year selection by scanning for the selected year
  for(let i = 0; i < 12; i++) {
    if(this.pickerYearContainer!.children[i].classList.contains('calendar__picker-year-selected')) {
      this.pickerYearContainer!.children[i].classList.remove('calendar__picker-year-selected');
    }
  }
}

export function generatePickerYears() {
  const currentYear = this.today.getFullYear() + this.yearPickerOffset + this.yearPickerOffsetTemporary;
  let count = 0;
  for(let i = currentYear - 4; i <= currentYear + 7; i++) {
    let element = this.pickerYearContainer!.children[count] as HTMLElement;
    element.innerText = i.toString();
    count++;
  }

  this.updateYearPickerTodaySelection();
}

export function handleYearChevronLeftClick() {
  this.yearPickerOffsetTemporary -= 12;
  this.generatePickerYears();
  this.removeYearPickerSelection();
  this.updateYearPickerSelection(this.currentDate.getFullYear());
  this.updateYearPickerTodaySelection();
}

export function handleYearChevronRightClick() {
  this.yearPickerOffsetTemporary += 12;
  this.generatePickerYears();
  this.removeYearPickerSelection();
  this.updateYearPickerSelection(this.currentDate.getFullYear());
  this.updateYearPickerTodaySelection();
}
