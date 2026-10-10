// City pages: /washer-repair/<county>/<city>/ and /dryer-repair/<county>/<city>/ (stage 3, 2026-10-10).
//
// Which cities and which appliance: by search demand (Ahrefs, US, 2026-10-10) —
//   washer repair pasadena 200 · irvine 100 · temecula 100 · escondido 100 · rancho cucamonga 90 ·
//   anaheim 80 · washing machine repair riverside 80 · long beach 20;
//   dryer repair temecula 100 · rancho cucamonga 100 (no dryer page of ours there yet).
// Dryer searches in Irvine, Pasadena, Huntington Beach, Long Beach already land on the older LG dryer
// city pages (/areas/lg-dryer-repair-<city>/) — those are linked, not duplicated.
//
// RULES — same as counties.ts: nothing invented. Neighbourhoods and ZIP codes are public facts;
// housing notes describe the area in general terms; no statistics, no promises beyond the owner's
// (same-day in all seven counties, no trip fee, every brand, 90-day warranty, $69 diagnostic).
// Real calls are pulled from recentCalls.ts by `place` matching `city` or `neighborhoods`.

export type CityPage = {
  slug: string; // URL part: /washer-repair/<county>/<slug>/
  city: string;
  county: string; // counties.ts slug
  appliances: ('washer' | 'dryer')[];
  zips: string[];
  neighborhoods: string[];
  nearby: string[];
  housing: string; // what homes and laundry setups look like here
  washerNote: string;
  dryerNote: string;
  lgDryerPage?: string; // existing /areas/<slug>/ page for LG dryers in this city
};

export const CITY_PAGES: CityPage[] = [
  {
    slug: 'pasadena',
    city: 'Pasadena',
    county: 'los-angeles-county',
    appliances: ['washer'],
    zips: ['91101', '91103', '91104', '91105', '91106', '91107'],
    neighborhoods: ['Old Pasadena', 'Bungalow Heaven', 'Linda Vista', 'San Rafael', 'Madison Heights', 'Hastings Ranch', 'East Pasadena'],
    nearby: ['Altadena', 'South Pasadena', 'San Marino', 'Arcadia', 'Sierra Madre', 'La Cañada Flintridge'],
    housing:
      'Pasadena has two very different kinds of laundry rooms. In the Craftsman bungalows and 1920s homes of Bungalow Heaven, Madison Heights and Linda Vista the washer usually sits on an old service porch or in a detached garage, on older plumbing. Around Old Pasadena and Lake Avenue it is the opposite: newer condos and apartments with a stacked washer-dryer in a closet.',
    washerNote:
      'On a service porch with older galvanized supply lines, a washer that fills slowly or throws an IE code is often a clogged inlet screen or a weak shut-off valve, not a failed machine. In a closet stack, a leak goes straight into the floor — turn the valves off and call.',
    dryerNote: '',
    lgDryerPage: 'lg-dryer-repair-pasadena',
  },
  {
    slug: 'irvine',
    city: 'Irvine',
    county: 'orange-county',
    appliances: ['washer'],
    zips: ['92602', '92603', '92604', '92606', '92612', '92614', '92617', '92618', '92620'],
    neighborhoods: ['Woodbridge', 'Northwood', 'Turtle Rock', 'University Park', 'Westpark', 'Great Park', 'Portola Springs', 'Orchard Hills', 'Quail Hill'],
    nearby: ['Tustin', 'Lake Forest', 'Costa Mesa', 'Newport Beach', 'Laguna Hills'],
    housing:
      'Irvine is master-planned, village by village. Townhomes and condos in Woodbridge, Westpark and University Park often have a stacked washer-dryer or a side-by-side pair in a hallway closet; the newer single-family homes in Great Park, Portola Springs and Orchard Hills usually have an upstairs laundry room with front-load machines.',
    washerNote:
      'With an upstairs laundry room, the problems that matter most are leaks — a torn door boot, a loose drain hose, a cracked pump housing. Many Irvine homes have a drain pan under the washer; if it is full, call before the next load.',
    dryerNote: '',
    lgDryerPage: 'lg-dryer-repair-irvine',
  },
  {
    slug: 'anaheim',
    city: 'Anaheim',
    county: 'orange-county',
    appliances: ['washer'],
    zips: ['92801', '92802', '92804', '92805', '92806', '92807', '92808'],
    neighborhoods: ['Anaheim Hills', 'West Anaheim', 'Platinum Triangle', 'Anaheim Colony', 'East Anaheim'],
    nearby: ['Fullerton', 'Orange', 'Yorba Linda', 'Placentia', 'Garden Grove'],
    housing:
      'Anaheim ranges from 1950s and 1960s single-story homes in West Anaheim and the Colony, where the washer is usually in the garage, to the hillside homes of Anaheim Hills and the new apartment buildings of the Platinum Triangle with stacked units in a closet.',
    washerNote:
      'Garage washers in older Anaheim homes often drain into an old standpipe; a slow drain or an OE code is worth checking at the standpipe before replacing the pump.',
    dryerNote: '',
    lgDryerPage: 'lg-dryer-repair-anaheim',
  },
  {
    slug: 'long-beach',
    city: 'Long Beach',
    county: 'los-angeles-county',
    appliances: ['washer'],
    zips: ['90802', '90803', '90804', '90805', '90806', '90807', '90808', '90815'],
    neighborhoods: ['Belmont Shore', 'Naples', 'Bixby Knolls', 'California Heights', 'Los Altos', 'Downtown', 'North Long Beach'],
    nearby: ['Lakewood', 'Signal Hill', 'Seal Beach', 'Carson', 'Bellflower'],
    housing:
      'Long Beach has a lot of older apartment buildings and duplexes, many with a washer squeezed into a kitchen corner or a closet, and single-family neighborhoods like Bixby Knolls, California Heights and Los Altos where the laundry is usually in the garage. Near the water — Belmont Shore and Naples — salt air is part of the picture.',
    washerNote:
      'Near the coast, hose fittings and shock-absorber mounts corrode sooner. A washer that starts walking across the floor in Belmont Shore is more often worn shocks than a bad bearing.',
    dryerNote: '',
    lgDryerPage: 'lg-dryer-repair-long-beach',
  },
  {
    slug: 'riverside',
    city: 'Riverside',
    county: 'riverside-county',
    appliances: ['washer', 'dryer'],
    zips: ['92501', '92503', '92504', '92505', '92506', '92507', '92508'],
    neighborhoods: ['Wood Streets', 'Canyon Crest', 'Mission Grove', 'Orangecrest', 'Arlington Heights', 'La Sierra', 'Downtown'],
    nearby: ['Corona', 'Moreno Valley', 'Jurupa Valley', 'Norco', 'Eastvale'],
    housing:
      'Riverside mixes historic homes around downtown and the Wood Streets, 1960s and 1970s ranch homes in Arlington and La Sierra, and newer tracts in Orangecrest and Mission Grove. In the older homes the laundry is usually in the garage; in the newer ones it is an indoor room, sometimes upstairs.',
    washerNote:
      'Hard water is common in the Inland Empire, and scale shows up first in the washer inlet valve screens — a slow fill or an IE code is often fixed by cleaning them.',
    dryerNote:
      'A garage that sits above 100°F in summer and a vent that is partly blocked is how dryers in Riverside blow thermal fuses. We clear the vent and check the airflow so the new fuse does not fail again.',
  },
  {
    slug: 'temecula',
    city: 'Temecula',
    county: 'riverside-county',
    appliances: ['washer', 'dryer'],
    zips: ['92590', '92591', '92592'],
    neighborhoods: ['Old Town', 'Redhawk', 'Harveston', 'Paloma del Sol', 'Wolf Creek', 'Vail Ranch', 'Crowne Hill'],
    nearby: ['Murrieta', 'Menifee', 'Wildomar', 'Fallbrook', 'Lake Elsinore'],
    housing:
      'Most Temecula homes were built from the 1990s on — two-story tract houses in Redhawk, Harveston, Paloma del Sol and Wolf Creek, many with the laundry room upstairs and front-load machines. The dryer vent in these homes often runs a long way through the walls to reach the outside.',
    washerNote:
      'An upstairs washer that shakes hard on spin is usually worn shocks or a load that is not balancing; it is worth fixing before the vibration cracks a tile or loosens the drain connection.',
    dryerNote:
      'Long vent runs in two-story Temecula homes are the usual reason a dryer takes two cycles. We measure the airflow at the vent before replacing a heating element or a sensor.',
  },
  {
    slug: 'rancho-cucamonga',
    city: 'Rancho Cucamonga',
    county: 'san-bernardino-county',
    appliances: ['washer', 'dryer'],
    zips: ['91701', '91730', '91737', '91739'],
    neighborhoods: ['Alta Loma', 'Etiwanda', 'Terra Vista', 'Victoria', 'Haven View Estates'],
    nearby: ['Upland', 'Fontana', 'Ontario', 'Claremont', 'Montclair'],
    housing:
      'Rancho Cucamonga is mostly single-family homes from the 1980s to the 2000s. In older Alta Loma homes the washer and dryer are often in the garage; the newer Etiwanda and Victoria tracts have indoor laundry rooms. Santa Ana winds push a lot of dust into garages and dryer vent hoods here.',
    washerNote:
      'Hard water leaves scale in the inlet valve screens and on the heater in washers with internal heating; a washer that fills slowly or will not heat is often a cleaning job before it is a parts job.',
    dryerNote:
      'After a windy week, a dryer vent hood full of dust and leaves can make a dryer run hot and slow. A blocked hood flap is a cheap fix that looks like a failed heater.',
  },
  {
    slug: 'escondido',
    city: 'Escondido',
    county: 'san-diego-county',
    appliances: ['washer', 'dryer'],
    zips: ['92025', '92026', '92027', '92029'],
    neighborhoods: ['Old Escondido', 'Felicita', 'Kit Carson', 'San Pasqual Valley', 'Rancho San Pasqual', 'Hidden Meadows'],
    nearby: ['San Marcos', 'Valley Center', 'Rancho Bernardo', 'Poway', 'Vista'],
    housing:
      'Escondido has historic homes in Old Escondido, mid-century houses across the central valley, and larger homes on lots in Felicita, Rancho San Pasqual and Hidden Meadows. Garage laundry is common, and inland Escondido summers are hot.',
    washerNote:
      'In a hot garage, rubber parts age faster — door boots, drain hoses and fill hoses. A washer that leaks only during the fill is usually a hose or the inlet valve, a short repair.',
    dryerNote:
      'A dryer in a hot garage with a long vent run overheats easily; if yours stops mid-cycle and restarts later, the cause is usually airflow, and the thermal fuse or cycling thermostat is next.',
  },
];

export const cityPagesInCounty = (county: string, appliance?: 'washer' | 'dryer') =>
  CITY_PAGES.filter((c) => c.county === county && (!appliance || c.appliances.includes(appliance)));
