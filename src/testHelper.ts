export const DEFAULT_ID = '#color-calendar';

export const resetDOM = () => {
  // Inserts clean DIVs with id to the DOM before each test
  document.body.innerHTML = `
    <div id="color-calendar"></div>
    <div id="MyTestCalendar"></div>
  `;
}

export const MONTH_NAMES_SHORT= ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const MONTH_NAMES_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
