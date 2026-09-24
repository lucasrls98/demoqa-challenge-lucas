const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const monthName = (monthNumber) => MONTHS[monthNumber - 1];

export const formatSubmittedDate = ({ day, month, year }) =>
  `${String(day).padStart(2, '0')} ${monthName(month)},${year}`;
