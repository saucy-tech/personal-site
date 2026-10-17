import type { FieldNoteMark } from '@/data/field-notes';

/**
 * Monochrome marks for The X Subscription. Paths are the X and Cursor
 * logomarks plus traces of the Grok and Grok Bot marks. `currentColor`
 * follows light and dark themes.
 */
const MARKS: Record<
  FieldNoteMark,
  { label: string; viewBox: string; transform?: string; d: string }
> = {
  x: {
    label: 'X',
    viewBox: '0 0 24 24',
    d: 'M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z',
  },
  grok: {
    label: 'Grok',
    viewBox: '0 0 60 60',
    transform: 'translate(0 60) scale(0.1 -0.1)',
    d: 'M400 403 c-107 -108 -188 -192 -180 -186 8 5 65 47 126 91 62 45 117 82 123 82 33 0 41 -122 12 -185 -42 -93 -159 -148 -246 -115 -21 8 -35 5 -71 -13 l-45 -23 52 -24 c112 -53 248 -23 334 72 62 70 80 128 70 237 -11 114 -8 166 11 202 41 80 -3 48 -186 -138z M225 581 c-166 -44 -260 -213 -210 -377 19 -62 19 -88 -1 -125 -28 -55 -9 -53 58 7 57 51 64 61 52 74 -24 28 -44 89 -44 137 0 130 124 233 251 207 41 -9 53 -7 90 11 l42 22 -47 22 c-50 25 -142 35 -191 22z',
  },
  cursor: {
    label: 'Cursor',
    viewBox: '0 0 24 24',
    d: 'M11.503.131 1.891 5.678a.84.84 0 0 0-.42.726v11.188c0 .3.162.575.42.724l9.609 5.55a1 1 0 0 0 .998 0l9.61-5.55a.84.84 0 0 0 .42-.724V6.404a.84.84 0 0 0-.42-.726L12.497.131a1.01 1.01 0 0 0-.996 0M2.657 6.338h18.55c.263 0 .43.287.297.515L12.23 22.918c-.062.107-.229.064-.229-.06V12.335a.59.59 0 0 0-.295-.51l-9.11-5.257c-.109-.063-.064-.23.061-.23',
  },
  'grok-bot': {
    label: 'Grok Bot',
    viewBox: '0 0 73 73',
    transform: 'translate(0 73) scale(0.1 -0.1)',
    d: 'M270 715 c-121 -34 -222 -136 -256 -262 -42 -153 33 -326 174 -401 193 -103 412 -32 503 163 39 82 46 152 25 235 -51 198 -252 318 -446 265z m293 -105 c27 -21 77 -113 77 -141 0 -26 -25 -42 -47 -30 -25 13 -97 155 -90 175 9 22 29 20 60 -4z m-193 -60 c27 -15 82 -117 78 -148 -4 -36 -44 -57 -73 -38 -23 14 -84 122 -85 148 0 16 35 48 53 48 5 0 17 -4 27 -10z',
  },
};

export function PlanMarks({ ids }: { ids: FieldNoteMark[] }) {
  return (
    <ul aria-label="Included products" className="mt-3 flex flex-wrap items-start gap-x-5 gap-y-3">
      {ids.map((id) => {
        const mark = MARKS[id];
        return (
          <li key={id} className="flex flex-col items-center gap-1.5">
            <svg
              viewBox={mark.viewBox}
              aria-hidden="true"
              className="h-6 w-6 fill-current text-(--text-primary)"
            >
              <path d={mark.d} transform={mark.transform} />
            </svg>
            <span className="text-[10px] leading-none tracking-[0.06em] text-(--text-muted)">
              {mark.label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
