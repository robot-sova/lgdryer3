// The service itself, described once for every county and city page (CountyPage, CityPage).
// Prices are the ranges already published on the site's price pages — change them there first.
// Owner decisions 2026-10-10: $69 diagnostic (waived with repair), same-day in all seven counties,
// no trip fee, every brand, 90-day warranty on parts and labor.
export type Appliance = 'washer' | 'dryer';

export const BRANDS = ['LG', 'Samsung', 'Whirlpool', 'Maytag', 'GE', 'Kenmore', 'Electrolux', 'Frigidaire', 'Bosch', 'Speed Queen'];

// Problems link to the guides that already exist on the site (LG guides; the causes are the same
// on most front-load machines).
export const problemsFor = (a: Appliance) => a === 'washer'
  ? [
      { label: 'Won’t drain (OE code)', href: '/washer/symptoms/lg-washer-not-draining/' },
      { label: 'Won’t spin', href: '/washer/symptoms/lg-washer-not-spinning/' },
      { label: 'Leaking water', href: '/washer/symptoms/lg-washer-leaking/' },
      { label: 'Won’t fill (IE code)', href: '/washer/symptoms/lg-washer-not-filling/' },
      { label: 'Shaking or walking', href: '/washer/symptoms/lg-washer-shaking/' },
      { label: 'Won’t turn on', href: '/washer/symptoms/lg-washer-wont-turn-on/' },
      { label: 'Door locked / won’t open', href: '/washer/symptoms/lg-washer-door-wont-open/' },
      { label: 'Error codes', href: '/washer/' },
    ]
  : [
      { label: 'Not heating', href: '/symptoms/lg-dryer-not-heating/' },
      { label: 'Takes too long to dry', href: '/symptoms/lg-dryer-not-drying/' },
      { label: 'Won’t start', href: '/symptoms/lg-dryer-not-starting/' },
      { label: 'Drum won’t turn', href: '/symptoms/lg-dryer-not-spinning/' },
      { label: 'Loud noise or squeaking', href: '/symptoms/lg-dryer-making-noise/' },
      { label: 'Overheating', href: '/symptoms/lg-dryer-overheating/' },
      { label: 'Door won’t close', href: '/symptoms/lg-dryer-door-wont-close/' },
      { label: 'Flow Sense / vent warning', href: '/symptoms/lg-dryer-flow-sense-error/' },
    ];

// Ranges are the ones already published on the site's price pages — change them there first.
export const pricesFor = (a: Appliance) => a === 'washer'
  ? [
      { label: 'Drain pump replacement', range: '$280–360', href: '/washer/price-list/lg-washer-drain-pump-replacement-cost/' },
      { label: 'Door boot seal replacement', range: '$250–320', href: '/washer/price-list/lg-washer-door-seal-replacement-cost/' },
      { label: 'Control board replacement', range: '$300–420', href: '/washer/price-list/lg-washer-control-board-replacement-cost/' },
      { label: 'Tub bearing replacement', range: '$320–420', href: '/washer/price-list/lg-washer-bearing-replacement-cost/' },
      { label: 'Most washer repairs', range: '$150–480', href: '/washer/price-list/lg-washer-repair-cost/' },
    ]
  : [
      { label: 'Drum roller replacement (set of 4)', range: '$280–350', href: '/price-list/lg-dryer-drum-roller-replacement-cost/' },
      { label: 'Heating element replacement', range: '$300–380', href: '/price-list/lg-dryer-heating-element-replacement-cost/' },
      { label: 'Thermal fuse replacement', range: '$280–350', href: '/price-list/lg-dryer-thermal-fuse-replacement-cost/' },
      { label: 'Gas valve coils or assembly', range: '$280–450', href: '/price-list/lg-dryer-gas-valve-replacement-cost/' },
      { label: 'Igniter replacement (gas dryers)', range: '$280–350', href: '/price-list/lg-dryer-igniter-replacement-cost/' },
      { label: 'Most dryer repairs', range: '$150–480', href: '/price-list/lg-dryer-repair-cost/' },
    ];

/** Answers to the questions Google shows under "People also ask" for "<appliance> repair <place>"
 *  (Ahrefs SERP, 2026-10-10), plus trip fee, brands and warranty. `place` is "Orange County" / "Pasadena". */
export function serviceFaqs(a: Appliance, place: string) {
  const isWasher = a === 'washer';
  const machine = isWasher ? 'washing machine' : 'dryer';
  return [
    {
      q: `What is the average cost to repair a ${machine} in ${place}?`,
      a: `Most ${a} repairs we do run $150–480 including parts and labor${isWasher ? ' — a drain pump is $280–360, a door boot seal $250–320, a tub bearing $320–420' : ' — drum rollers are $280–350, a heating element $300–380, an igniter $280–350'}. The diagnostic is $69 and it is waived when you approve the repair, and you get the exact price before any work starts.`,
    },
    {
      q: `Is it worth repairing a ${machine}?`,
      a: `Usually yes when the machine is under about 8–10 years old and the repair costs less than half of a comparable new ${a}. Most repairs we do are a single part at $150–480, well under the price of a new machine plus delivery and installation. When the repair is not worth it — an old machine with ${isWasher ? 'a cracked outer tub or a failed bearing on a sealed tub' : 'a cracked drum and a worn motor at the same time'} — the technician tells you so before you pay for anything beyond the diagnostic.`,
    },
    {
      q: `What is the most expensive ${a} repair?`,
      a: isWasher
        ? `Tub bearings ($320–420) and control boards ($300–420) are the most expensive common washer repairs. On some front-loaders the bearing is pressed into a sealed tub, and then the whole tub assembly is replaced — that is the case where buying new can make more sense.`
        : `Drum replacement ($300–550) and motor or control board replacement are the most expensive common dryer repairs. Thermal fuses, belts, rollers and igniters — the most frequent failures — cost much less.`,
    },
    {
      q: `How soon can a technician come in ${place}?`,
      a: `The same day, Monday to Saturday, 8am–8pm, anywhere in ${place}. Call (323) 990-7550 and we give you the arrival window on the phone.`,
    },
    {
      q: `Is there a trip fee to come out to my home in ${place}?`,
      a: `No. There is no trip or travel fee anywhere in our seven counties. The only charge for the visit is the $69 diagnostic, and it is waived when you approve the repair.`,
    },
    {
      q: `Which ${a} brands do you repair?`,
      a: `All of them — ${BRANDS.join(', ')} and every other residential front-load, top-load and stacked ${a}.`,
    },
    {
      q: `Is the ${a} repair guaranteed?`,
      a: `Yes. Every repair carries a 90-day warranty on the parts we install and on the labor. If the same fault comes back within 90 days, we come back and fix it at no charge.`,
    },
    {
      q: `Do you also fix ${isWasher ? 'dryer' : 'washer'}s in ${place}?`,
      a: `Yes. The same technician can look at both machines in one visit — tell us when you book.`,
    },
  ];
}
