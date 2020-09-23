/** Configure calendar style preferences */
export function configureStylePreferences() {
  let root = this.calendarRoot;
  if (this.primaryColor) {
    root.style.setProperty("--cal-color-primary", this.primaryColor);
  }
  if (this.fontFamilyHeader) {
    root.style.setProperty("--cal-font-family-header", this.fontFamilyHeader);
  }
  if (this.fontFamilyWeekdays) {
    root.style.setProperty("--cal-font-family-weekdays", this.fontFamilyWeekdays);
  }
  if (this.fontFamilyBody) {
    root.style.setProperty("--cal-font-family-body", this.fontFamilyBody);
  }
  if (this.dropShadow) {
    root.style.setProperty("--cal-drop-shadow", this.dropShadow);
  }
  if (this.border) {
    root.style.setProperty("--cal-border", this.border);
  }
  if (this.borderRadius) {
    root.style.setProperty("--cal-border-radius", this.borderRadius);
  }
  if(this.headerColor) {
    root.style.setProperty("--cal-header-color", this.headerColor);
  }
  if(this.headerBackgroundColor) {
    root.style.setProperty("--cal-header-background-color", this.headerBackgroundColor);
  }
  if(this.weekdaysColor) {
    root.style.setProperty("--cal-weekdays-color", this.weekdaysColor);
  }
}