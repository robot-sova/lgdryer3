// Recent service calls that came through this site, shown on area pages ("Recent calls near X").
//
// RULES (owner decision 2026-10-04) — this block is evidence, so it must stay true:
//   - Only real calls: each entry is an order in ЦУП (number in `ref`) or a visit in Fixar.
//   - No customer names, no street addresses: month + neighbourhood/city only.
//   - `reported` is what the CUSTOMER said, not our diagnosis. We do not write what was
//     repaired unless the job record says so — for most of these jobs it does not.
//   - `visit`: 'on-site' only when Fixar confirms the technician was there; otherwise the
//     visit was booked ('booked-same-day' / 'booked-next-day').
//   - Brand/model only when the customer or the job record names it; otherwise just "dryer".
// Add new entries at the top. Keep 10–15 at most; older ones can go.

export type RecentCall = {
  month: string; // "Sep 2026"
  place: string; // where the call was, as a customer would say it
  appliance: string; // "LG DLG7301WE gas dryer", "dryer", "LG washer"
  reported: string; // customer's complaint, in plain words
  visit: 'on-site-same-day' | 'on-site-next-day' | 'booked-same-day' | 'booked-next-day';
  pages: string[]; // area page slugs (lg-dryer-repair-<slug>) where it is shown
  ref: string; // ЦУП order / Fixar job — internal, never rendered
};

export const RECENT_CALLS: RecentCall[] = [
  { month: 'Sep 2026', place: 'Carson', appliance: 'LG DLG7301WE gas dryer', reported: 'would not turn on', visit: 'on-site-next-day', pages: ['torrance', 'long-beach', 'los-angeles'], ref: 'ЦУП 260926-8 / Fixar 101254' },
  { month: 'Sep 2026', place: 'La Habra', appliance: 'dryer', reported: 'a broken drum baffle was catching clothes and stopping the drum', visit: 'booked-same-day', pages: ['fullerton'], ref: 'ЦУП 260927-1' },
  { month: 'Sep 2026', place: 'Santa Rosa Valley', appliance: 'dryer', reported: 'an H5 error on the display', visit: 'on-site-same-day', pages: ['camarillo', 'moorpark'], ref: 'ЦУП 260914-3 / Fixar 101085' },
  { month: 'Sep 2026', place: 'Redondo Beach', appliance: 'dryer', reported: 'a heating sensor problem', visit: 'booked-same-day', pages: ['torrance', 'manhattan-beach', 'los-angeles'], ref: 'ЦУП 260902-4' },
  { month: 'Aug 2026', place: 'Pasadena', appliance: 'LG washer', reported: 'stopped working with all the lights on', visit: 'booked-next-day', pages: ['pasadena', 'los-angeles'], ref: 'ЦУП 260815-4' },
  { month: 'Aug 2026', place: 'Van Nuys', appliance: 'dryer', reported: 'squeaking; the customer suspected worn drum rollers', visit: 'booked-next-day', pages: ['sherman-oaks', 'studio-city', 'los-angeles'], ref: 'ЦУП 260804-6' },
  { month: 'Jul 2026', place: 'Calabasas', appliance: 'LG DLG3401 gas dryer', reported: 'runs but does not heat', visit: 'on-site-next-day', pages: ['calabasas', 'agoura-hills', 'woodland-hills'], ref: 'Fixar 100512' },
];

export const VISIT_TEXT: Record<RecentCall['visit'], string> = {
  'on-site-same-day': 'technician on site the same day',
  'on-site-next-day': 'technician on site the next day',
  'booked-same-day': 'visit booked for the same day',
  'booked-next-day': 'visit booked for the next day',
};

export const recentCallsFor = (slug: string): RecentCall[] => RECENT_CALLS.filter((c) => c.pages.includes(slug));
