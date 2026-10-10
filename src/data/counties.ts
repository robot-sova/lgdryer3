// The seven counties we serve (owner decision 2026-10-10 — the same seven as SDAR).
// One entry = two pages: /washer-repair/<slug>/ and /dryer-repair/<slug>/, plus a row on /service-area/.
//
// RULES — these pages must not turn into doorways:
//   - Only facts we can stand behind. No "same-day" promise for a county unless the owner confirms
//     it (`sameDay`); otherwise the page says the arrival window is confirmed when you book.
//   - `cities` are places we actually drive to. `page` links the existing city page when there is one.
//   - `local` is written per county — it is what makes the page about THIS county. Keep it to things
//     that are true of the area (housing, geography, how we route), not invented statistics.
//   - Real calls come from src/data/recentCalls.ts by `county`; a county with none shows none.

export type County = {
  slug: string; // URL part: /washer-repair/<slug>/
  name: string; // "Orange County"
  short: string; // "OC" — used in titles when space is tight
  sameDay: boolean; // owner-confirmed same-day coverage
  cities: { label: string; page?: string }[]; // page = existing /areas/<page>/ slug
  local: string; // one paragraph about this county, our routing and what we see there
  washerNote: string; // one county-specific line for the washer page
  dryerNote: string; // one county-specific line for the dryer page
};

export const COUNTIES: County[] = [
  {
    slug: 'los-angeles-county',
    name: 'Los Angeles County',
    short: 'LA County',
    sameDay: true,
    cities: [
      { label: 'Los Angeles', page: 'lg-dryer-repair-los-angeles' },
      { label: 'Pasadena', page: 'lg-dryer-repair-pasadena' },
      { label: 'Glendale', page: 'lg-dryer-repair-glendale' },
      { label: 'Burbank', page: 'lg-dryer-repair-burbank' },
      { label: 'Santa Monica', page: 'lg-dryer-repair-santa-monica' },
      { label: 'Beverly Hills', page: 'lg-dryer-repair-beverly-hills' },
      { label: 'West Hollywood', page: 'lg-dryer-repair-west-hollywood' },
      { label: 'Culver City', page: 'lg-dryer-repair-culver-city' },
      { label: 'Sherman Oaks', page: 'lg-dryer-repair-sherman-oaks' },
      { label: 'Studio City', page: 'lg-dryer-repair-studio-city' },
      { label: 'Woodland Hills', page: 'lg-dryer-repair-woodland-hills' },
      { label: 'Calabasas', page: 'lg-dryer-repair-calabasas' },
      { label: 'Malibu', page: 'lg-dryer-repair-malibu' },
      { label: 'Manhattan Beach', page: 'lg-dryer-repair-manhattan-beach' },
      { label: 'Torrance', page: 'lg-dryer-repair-torrance' },
      { label: 'Long Beach', page: 'lg-dryer-repair-long-beach' },
      { label: 'Santa Clarita' },
      { label: 'Pomona' },
    ],
    local:
      'Los Angeles County is where most of our calls come from. A large share of the work is in apartments and condos — stacked washer-dryer units in a closet, shared laundry rooms, long dryer vents that run through the building — and in hillside homes where the laundry sits in a garage or a basement. We plan visits by area — the Westside and the beach cities, the San Fernando Valley, the San Gabriel Valley, the South Bay — and tell you the arrival window when you book.',
    washerNote:
      'In older LA buildings a washer that drains slowly or throws an OE code is often a partly blocked standpipe or a kinked drain hose behind a stacked unit — we check the line before we sell you a pump.',
    dryerNote:
      'Long, shared vent runs in LA apartment buildings are the most common reason a dryer that "works" takes two cycles to dry. We measure the airflow before replacing a heating element.',
  },
  {
    slug: 'orange-county',
    name: 'Orange County',
    short: 'OC',
    sameDay: true,
    cities: [
      { label: 'Irvine', page: 'lg-dryer-repair-irvine' },
      { label: 'Newport Beach', page: 'lg-dryer-repair-newport-beach' },
      { label: 'Costa Mesa', page: 'lg-dryer-repair-costa-mesa' },
      { label: 'Huntington Beach', page: 'lg-dryer-repair-huntington-beach' },
      { label: 'Anaheim', page: 'lg-dryer-repair-anaheim' },
      { label: 'Fullerton', page: 'lg-dryer-repair-fullerton' },
      { label: 'Orange', page: 'lg-dryer-repair-orange-ca' },
      { label: 'Tustin', page: 'lg-dryer-repair-tustin' },
      { label: 'Yorba Linda', page: 'lg-dryer-repair-yorba-linda' },
      { label: 'Mission Viejo', page: 'lg-dryer-repair-mission-viejo' },
      { label: 'Lake Forest', page: 'lg-dryer-repair-lake-forest' },
      { label: 'Laguna Niguel', page: 'lg-dryer-repair-laguna-niguel' },
      { label: 'Laguna Beach', page: 'lg-dryer-repair-laguna-beach' },
      { label: 'Dana Point', page: 'lg-dryer-repair-dana-point' },
      { label: 'Ladera Ranch', page: 'lg-dryer-repair-ladera-ranch' },
      { label: 'Rancho Santa Margarita', page: 'lg-dryer-repair-rancho-santa-margarita' },
      { label: 'Santa Ana' },
      { label: 'Garden Grove' },
    ],
    local:
      'In Orange County most of our calls are from single-family homes and townhomes built from the 1990s on — laundry rooms inside the house, often upstairs, with front-load washers and newer electric or gas dryers. We plan coastal cities (Huntington Beach to Dana Point) and inland cities (Anaheim to Yorba Linda) as separate routes, so the window we give you depends on where you are.',
    washerNote:
      'An upstairs laundry room makes a small leak urgent: water from a torn door boot or a loose drain hose ends up in the ceiling below. Turn the water valves off and call — we check the boot, the hoses and the pump housing first.',
    dryerNote:
      'Newer OC homes often route the dryer vent up through the roof. Lint builds up at the top where you cannot see it, and the dryer starts tripping the thermal fuse — we check the full run, not just the back of the machine.',
  },
  {
    slug: 'ventura-county',
    name: 'Ventura County',
    short: 'Ventura',
    sameDay: true,
    cities: [
      { label: 'Thousand Oaks', page: 'lg-dryer-repair-thousand-oaks' },
      { label: 'Newbury Park', page: 'lg-dryer-repair-newbury-park' },
      { label: 'Westlake Village', page: 'lg-dryer-repair-westlake-village' },
      { label: 'Simi Valley', page: 'lg-dryer-repair-simi-valley' },
      { label: 'Moorpark', page: 'lg-dryer-repair-moorpark' },
      { label: 'Camarillo', page: 'lg-dryer-repair-camarillo' },
      { label: 'Oxnard', page: 'lg-dryer-repair-oxnard' },
      { label: 'Ventura', page: 'lg-dryer-repair-ventura' },
      { label: 'Agoura Hills', page: 'lg-dryer-repair-agoura-hills' },
      { label: 'Ojai' },
      { label: 'Fillmore' },
      { label: 'Santa Paula' },
    ],
    local:
      'Ventura County calls split into two areas: the Conejo Valley (Thousand Oaks, Newbury Park, Westlake Village) and Simi Valley and Moorpark on one side, and the coastal plain — Camarillo, Oxnard, Ventura — on the other. Many homes here have the laundry in the garage, where the machines see summer heat and, near the coast, damp air.',
    washerNote:
      'Garage laundry near the coast means corroded hose fittings and rusted shock-absorber mounts show up sooner than inland. A washer that suddenly walks across the floor is usually worn shocks, not a bad bearing.',
    dryerNote:
      'Garage dryers in Ventura County pull in dust and leaves through the vent hood; a clogged hood flap is a cheap fix that looks like a failed heater.',
  },
  {
    slug: 'santa-barbara-county',
    name: 'Santa Barbara County',
    short: 'Santa Barbara',
    sameDay: false,
    cities: [
      { label: 'Santa Barbara' },
      { label: 'Montecito' },
      { label: 'Goleta' },
      { label: 'Carpinteria' },
      { label: 'Summerland' },
      { label: 'Santa Ynez' },
      { label: 'Solvang' },
      { label: 'Buellton' },
      { label: 'Lompoc' },
      { label: 'Santa Maria' },
    ],
    local:
      'Santa Barbara County is the far north end of our area. We schedule visits here by arrangement and group calls along the 101 — Carpinteria, Montecito, Santa Barbara and Goleta first, the Santa Ynez Valley and Santa Maria by arrangement. Tell us the model and the symptom on the phone so the technician comes with the likely part and finishes in one trip.',
    washerNote:
      'Because a return trip to Santa Barbara costs you another day, we ask for the model number and the error code before the visit and bring the most likely part on the truck.',
    dryerNote:
      'Coastal homes in Montecito and Carpinteria see salt air at the vent hood; a seized flap or a corroded vent cap blocks airflow and makes a dryer run hot. We check it on every visit.',
  },
  {
    slug: 'san-bernardino-county',
    name: 'San Bernardino County',
    short: 'San Bernardino',
    sameDay: false,
    cities: [
      { label: 'Rancho Cucamonga' },
      { label: 'Ontario' },
      { label: 'Upland' },
      { label: 'Chino' },
      { label: 'Chino Hills' },
      { label: 'Fontana' },
      { label: 'Redlands' },
      { label: 'San Bernardino' },
      { label: 'Yucaipa' },
      { label: 'Montclair' },
    ],
    local:
      'In San Bernardino County we cover the western Inland Empire — Chino Hills, Chino, Ontario, Upland and Rancho Cucamonga — and east through Fontana and San Bernardino to Redlands. Summers here are hot, and many laundry rooms are in the garage or on an outside wall, which is hard on dryers. We confirm the arrival window when you book.',
    washerNote:
      'Hard water in much of the Inland Empire leaves scale in the inlet valve screens; a washer that fills slowly or shows an IE code often needs the screens cleaned before anything is replaced.',
    dryerNote:
      'When the garage is already over 100°F, a dryer with a partly blocked vent overheats fast and blows the thermal fuse. A new fuse without clearing the vent just fails again — we fix the cause.',
  },
  {
    slug: 'riverside-county',
    name: 'Riverside County',
    short: 'Riverside',
    sameDay: false,
    cities: [
      { label: 'Riverside' },
      { label: 'Corona' },
      { label: 'Eastvale' },
      { label: 'Norco' },
      { label: 'Jurupa Valley' },
      { label: 'Moreno Valley' },
      { label: 'Temecula' },
      { label: 'Murrieta' },
      { label: 'Menifee' },
      { label: 'Lake Elsinore' },
    ],
    local:
      'In Riverside County our routes run from Corona, Eastvale and Norco through Riverside and Moreno Valley, and south along the 15 to Lake Elsinore, Menifee, Murrieta and Temecula. Most homes are newer tract houses with an indoor laundry room and front-load machines. We confirm the arrival window when you book.',
    washerNote:
      'Newer front-loaders in Temecula and Murrieta homes are often installed on a second floor. Heavy vibration on spin is usually worn shocks or an unbalanced load sensor, and it is worth fixing before it cracks a floor tile.',
    dryerNote:
      'Inland heat plus long vent runs in newer two-story homes is a common combination behind slow drying in Riverside County. We measure the airflow at the vent before replacing any part.',
  },
  {
    slug: 'san-diego-county',
    name: 'San Diego County',
    short: 'San Diego',
    sameDay: false,
    cities: [
      { label: 'San Diego' },
      { label: 'Oceanside' },
      { label: 'Carlsbad' },
      { label: 'Encinitas' },
      { label: 'Del Mar' },
      { label: 'Rancho Santa Fe' },
      { label: 'Escondido' },
      { label: 'San Marcos' },
      { label: 'Vista' },
      { label: 'Poway' },
      { label: 'La Jolla' },
      { label: 'Chula Vista' },
    ],
    local:
      'San Diego County is the south end of our area. We schedule here by arrangement and group visits along the coast — Oceanside, Carlsbad, Encinitas, Del Mar and La Jolla — and inland through Escondido, San Marcos, Vista and Poway. Tell us the model and the symptom when you book so the technician arrives with the likely part.',
    washerNote:
      'Coastal San Diego homes with the washer in a garage or a side yard closet see corroded hose fittings and mildew in the door boot sooner than inland. A smell that comes back after cleaning usually means the boot or the drain pump filter needs attention.',
    dryerNote:
      'Salt air near the coast corrodes vent caps and dryer vent hoods; a stuck flap cuts airflow and the dryer runs hot and slow. We check the outside of the vent, not only the machine.',
  },
];

export const countyBySlug = (slug: string) => COUNTIES.find((c) => c.slug === slug);
