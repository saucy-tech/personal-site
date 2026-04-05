import { z } from 'zod';

import { CATEGORY_ALIASES } from '@/utils/post-taxonomy';

export const frontmatterSchema = z.object({
  title: z.string().min(1, 'title must be a non-empty string'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be in YYYY-MM-DD format'),
  excerpt: z.string().min(1, 'excerpt must be a non-empty string'),
  category: z.string().refine(
    (val) => val.toLowerCase().trim() in CATEGORY_ALIASES,
    (val) =>
      `"${val}" is not a valid category — valid values: ${[...new Set(Object.values(CATEGORY_ALIASES))].join(', ')}`
  ),
  tags: z.union([z.array(z.string()), z.string()]).optional(),
  series: z.string().optional(),
  cardTitle: z.string().optional(),
  shortTitle: z.string().optional(),
});
