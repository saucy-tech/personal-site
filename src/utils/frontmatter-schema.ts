import { z } from 'zod';

import { CATEGORY_ALIASES } from '@/utils/post-taxonomy';

function isValidCalendarDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) {
    return false;
  }

  const [, year, month, day] = match;
  const parsedYear = Number(year);
  const parsedMonth = Number(month);
  const parsedDay = Number(day);
  const candidate = new Date(Date.UTC(0, parsedMonth - 1, parsedDay));

  candidate.setUTCFullYear(parsedYear);

  return (
    candidate.getUTCFullYear() === parsedYear &&
    candidate.getUTCMonth() === parsedMonth - 1 &&
    candidate.getUTCDate() === parsedDay
  );
}

export const frontmatterSchema = z.object({
  title: z.string().min(1, 'title must be a non-empty string'),
  date: z.string().superRefine((value, ctx) => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value.trim()) && isValidCalendarDate(value)) {
      return;
    }

    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'date must be a real calendar date in YYYY-MM-DD format',
    });
  }),
  excerpt: z.string().min(1, 'excerpt must be a non-empty string'),
  category: z.string().superRefine((val, ctx) => {
    if (val.toLowerCase().trim() in CATEGORY_ALIASES) {
      return;
    }

    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `"${val}" is not a valid category — valid values: ${[...new Set(Object.values(CATEGORY_ALIASES))].join(', ')}`,
    });
  }),
  tags: z.union([z.array(z.string()), z.string()]).optional(),
  series: z.string().optional(),
  cardTitle: z.string().optional(),
  shortTitle: z.string().optional(),
  audio: z.string().optional(),
});
