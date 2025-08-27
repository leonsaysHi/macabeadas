import { parseISO, isValid, differenceInDays, formatDistanceStrict, parse } from 'date-fns';
const langCode = document.documentElement.lang || navigator.language;

export type DateStyle = 'full' | 'long' | 'medium' | 'short' | 'numeric' | null;
export type TimeStyle = 'full' | 'long' | 'medium' | 'short' | undefined;

interface Arguments {
  dateStyle?: DateStyle;
  timeStyle?: TimeStyle;
}

interface FormatedOptions {
  day?: string;
  month?: string;
  year?: string;
  hour?: string;
  minute?: string;
  timeZoneName?: string;
}

const Period = <const>{
  Today: 0,
  Far: -1,
};

export const parseAPIDate = (
  str: string | Date | undefined,
  strFormat: string,
): Date | null | undefined => {
  if (typeof str !== 'string') {
    return str;
  }

  if (strFormat) {
    const date = parse(str, strFormat, new Date());
    if (!isValid(date)) {
      return null;
    }
    return date;
  }

  const date = parseISO(str.toString());

  if (!isValid(date)) {
    return null;
  }

  // apply users timezone:
  const userTimezoneOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - userTimezoneOffset);
};

export const format = (
  myDate: Date,
  { dateStyle, timeStyle }: Arguments = {},
): string | string | undefined => {
  if (!isValid(myDate)) {
    return undefined;
  }
  const formatterOptions: FormatedOptions = {};
  if (dateStyle === 'numeric') {
    formatterOptions.day = '2-digit';
    formatterOptions.month = '2-digit';
    formatterOptions.year = 'numeric';
  } else if (dateStyle) {
    formatterOptions.day = 'numeric';
    formatterOptions.month = dateStyle === 'short' ? 'short' : 'long';
    formatterOptions.year = 'numeric';
  }
  if ((timeStyle && timeStyle.length) || !dateStyle) {
    formatterOptions.hour = 'numeric';
    formatterOptions.minute = 'numeric';
    if (timeStyle === 'long') {
      formatterOptions.timeZoneName = 'short';
    }
  }
  const formatter = new Intl.DateTimeFormat(langCode, formatterOptions);
  const result = formatter.format(myDate).split(' ');

  if (timeStyle === 'long') {
    // replaces EST/EDT with ET ... etc
    const customTimezones = [
      { _if: ['est', 'edt'], _then: 'et' },
      { _if: ['cst', 'cdt'], _then: 'ct' },
    ];
    const tz = result[result.length - 1].toLowerCase();
    const ctzIdx = customTimezones.findIndex(({ _if }) => {
      return _if.includes(tz);
    });
    if (ctzIdx > -1) {
      result[result.length - 1] = customTimezones[ctzIdx]._then.toLocaleUpperCase();
    }
  }

  return result.join(' ');
};

export const formatSince = (myDate: Date): string => {
  return formatDistanceStrict(myDate, new Date(), {
    addSuffix: true,
  });
};

// Example of using toRelativeDate:
//
// @code
// transChoice(
//   '{0} Created :label|{-1}Created on :label',
//   ...formatRelative(new Date(date)),
// );
// @endcode
// outcome will be: "Created X hours/minutes/seconds ago" or "Created on June 14, 2022 at 1:31 PM GMT+35400"
export const formatRelative = (
  value: Date,
  opts?: { formatOptions: Arguments },
): [number, { label: string }] => {
  const today = new Date();
  if (differenceInDays(today, value) === 0) {
    return [Period.Today, { label: formatDistanceStrict(value, today, { addSuffix: true }) }];
  }

  return [
    Period.Far,
    {
      label: format(value, {
        dateStyle: 'long',
        timeStyle: 'long',
        ...Object.assign({}, opts?.formatOptions),
      }) as string,
    },
  ];
};
