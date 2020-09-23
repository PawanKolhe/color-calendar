export function togglePicker(shouldOpen?: boolean) {
  if(shouldOpen === true) {
    this.pickerContainer.style.visibility = 'visible';
    this.pickerContainer.style.opacity = '1';
    if(this.pickerType === 'year') {
      this.generatePickerYears();
    }
    this.removeYearPickerSelection();
    this.updateYearPickerSelection(this.currentDate.getFullYear());
  } else if(shouldOpen === false) {
    this.pickerContainer.style.visibility = 'hidden';
    this.pickerContainer.style.opacity = '0';
    if(this.monthDisplay && this.yearDisplay) {
      this.monthDisplay.style.opacity = '1';
      this.yearDisplay.style.opacity = '1';
    }
    this.yearPickerOffsetTemporary = 0;
  } else {
    if(this.pickerContainer.style.visibility === 'hidden') {
      this.pickerContainer.style.visibility = 'visible';
      this.pickerContainer.style.opacity = '1';
      if(this.pickerType === 'year') {
        this.generatePickerYears();
      }
      this.removeYearPickerSelection();
      this.updateYearPickerSelection(this.currentDate.getFullYear());
    } else {
      this.pickerContainer.style.visibility = 'hidden';
      this.pickerContainer.style.opacity = '0';
      if(this.monthDisplay && this.yearDisplay) {
        this.monthDisplay.style.opacity = '1';
        this.yearDisplay.style.opacity = '1';
      }
      this.yearPickerOffsetTemporary = 0;
    }
  }
}
