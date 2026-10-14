// Brand pages: /<brand>-washer-repair/, /<brand>-dryer-repair/ and /<brand>-<appliance>-error-codes/.
// Owner 2026-10-10: we repair every brand on the market. Rolled out in waves by search demand
// (Ahrefs US, 2026-10-10): wave 1 Samsung, Whirlpool, Maytag; wave 2 GE, Kenmore; wave 3 Bosch,
// Electrolux, Speed Queen. A brand without one documented code system gets codes: [] and the code
// block is hidden — better nothing than a guessed meaning.
//
// RULES — this text is read by people with a broken machine and by Google:
//   - Error codes: only the widely documented meaning. Codes differ between model years, so every
//     code page says so and tells people to check the sticker inside the machine.
//   - No made-up statistics, no "certified by <brand>" — we are an independent repair service.
//   - Prices are the site's own ranges (src/data/service.ts), not per-brand inventions.
//   - Problems are the ones these machines are known for; `causes` says what we check, in order.

export type Appliance = 'washer' | 'dryer';
export type ErrorCode = { code: string; meaning: string; check: string };
export type Problem = { title: string; causes: string };
export type BrandAppliance = {
  intro: string; // what owners of this brand's machine run into, in our words
  lines: string; // model families people know them by
  problems: Problem[];
  codes: ErrorCode[]; // the most common ones; the full list lives on the error-code page
  codesPage: boolean; // separate /<brand>-<appliance>-error-codes/ page
};
// sister: ONE contextual sentence pointing at our own single-brand site for another appliance of
// this brand. Owner rule: links between our sites live in body text only — never footers or
// site-wide blocks (risk of Google treating the sites as one network).
export type Sister = { before: string; anchor: string; href: string; after: string };
export type Brand = { slug: string; name: string; note: string; sister?: Sister; washer?: BrandAppliance; dryer?: BrandAppliance };

export const BRANDS_DATA: Brand[] = [
  {
    slug: 'samsung',
    name: 'Samsung',
    note: 'Samsung sells front-load and top-load washers and electric and gas dryers, including stacked and FlexWash/FlexDry models.',
    sister: {
      before: 'Samsung refrigerator acting up too? Our sister service ',
      anchor: 'Samsung Refrigerator Repair',
      href: 'https://samsungrefrigerator.repair/',
      after: ' handles iced-over freezers, frozen ice makers and 84C and 22E errors in the same seven counties.',
    },
    washer: {
      intro:
        'Samsung washers tell you a lot through the display: most calls start with a code — 4C, 5C, UB or dC. The fixes are often simpler than the code suggests (a clogged filter, a kinked hose, an unbalanced load), and when a part has failed it is usually the drain pump, the door lock or, on top-loaders, the suspension rods.',
      lines: 'Front-load (WF series, including steam and AddWash models) and top-load (WA series, including activewash and FlexWash).',
      problems: [
        { title: 'Won’t drain (5C / 5E / SE)', causes: 'We check the debris filter behind the small front panel first — coins, hair ties and lint stop the pump — then the drain hose and the pump itself.' },
        { title: 'Won’t fill (4C / 4E)', causes: 'Water valves behind the washer, the inlet hose screens and then the water inlet valve. Low household water pressure gives the same code.' },
        { title: 'Shakes, walks or stops with UB / UE', causes: 'An unbalanced load first; on top-loaders, worn suspension rods are the classic Samsung failure. Front-loaders: shock absorbers and leveling feet.' },
        { title: 'Door won’t lock or unlock (dC / dE / DC / LO)', causes: 'The door lock assembly and its wiring; on front-loaders also the door strike and hinge alignment.' },
        { title: 'Leaking (LC / LE)', causes: 'The door boot seal on front-loaders, hose connections, the pump housing; LC means water reached the leak sensor in the base.' },
        { title: 'Not spinning or loud on spin (3C / 3E)', causes: 'Motor and motor sensor, wiring to the control board; a grinding noise usually means the tub bearings.' },
        { title: 'Musty smell', causes: 'Front-loaders hold water in the door gasket and the filter; we clean or replace the gasket and check the drain path.' },
      ],
      codes: [
        { code: '4C / 4E / 4C2', meaning: 'Water supply problem — the washer cannot fill in time (4C2: hot water connected to the cold inlet).', check: 'Open both water valves, straighten the hoses, clean the inlet screens.' },
        { code: '5C / 5E / SE', meaning: 'Drain problem — water does not leave the tub in time.', check: 'Clean the debris filter behind the bottom-front panel; check the drain hose for kinks.' },
        { code: 'UB / UE / Ub', meaning: 'Unbalanced load.', check: 'Redistribute the load; level the washer. If it repeats with normal loads, the suspension or shocks are worn.' },
        { code: 'dC / dE / DC / dS', meaning: 'Door or lid open or not locking.', check: 'Close the door firmly, clear anything caught in the latch; repeated codes mean the door lock.' },
        { code: 'LC / LE / LE1', meaning: 'Water leak detected in the base, or a water level problem.', check: 'Turn off the water and check under the washer; call us — it is a leak, not a setting.' },
        { code: '3C / 3E', meaning: 'Motor or motor sensor fault.', check: 'Unplug for a minute and restart; if it returns, it needs a technician.' },
        { code: 'HC / HE / HE1', meaning: 'Heating problem — water too hot or not heating.', check: 'Check the hot/cold hoses are not reversed; otherwise the heater or temperature sensor.' },
        { code: 'tC / tE', meaning: 'Temperature sensor fault.', check: 'Needs a sensor check.' },
        { code: '1C / 1E', meaning: 'Water level sensor fault.', check: 'Needs a pressure sensor and hose check.' },
        { code: 'OF / OE', meaning: 'Overfilling.', check: 'Turn off the water; usually the inlet valve or the level sensor.' },
        { code: 'Sud / SUd / 5d', meaning: 'Too many suds — not a failure.', check: 'Use HE detergent and less of it; let the cycle continue.' },
        { code: 'nF / nF1', meaning: 'No fill on some models.', check: 'Same checks as 4C.' },
      ],
      codesPage: true,
    },
    dryer: {
      intro:
        'Samsung dryers fail in the same places most dryers do — heat, rollers, belts — with two Samsung habits on top: the HE/HC heating codes and thermal fuses that blow when the vent is restricted. Gas Samsung dryers add igniters and gas valve coils to the list.',
      lines: 'Electric and gas dryers (DV series), including steam, FlexDry and stacked units.',
      problems: [
        { title: 'Not heating (HE / HC)', causes: 'Electric: thermal fuse, heating element, high-limit thermostat. Gas: igniter, gas valve coils, flame sensor. We check the vent first — a restricted vent is why fuses blow.' },
        { title: 'Takes two cycles to dry', causes: 'Lint in the vent run or a crushed duct behind the dryer, then the moisture sensor bars and the thermostat.' },
        { title: 'Squeaking, thumping or grinding', causes: 'Drum rollers and their axles, the idler pulley, the drum glides.' },
        { title: 'Drum won’t turn', causes: 'Broken belt, idler pulley, or the motor.' },
        { title: 'Won’t start', causes: 'Door switch, thermal fuse, start button (bE code), control board.' },
        { title: 'Shuts off mid-cycle', causes: 'Overheating from airflow, then the thermostat and motor.' },
      ],
      codes: [
        { code: 'HE / HC / HE1', meaning: 'Heating problem — not heating or overheating.', check: 'Clean the lint filter and check the vent; if it repeats, element/fuse (electric) or igniter/valve (gas).' },
        { code: 'tS / tO / tE', meaning: 'Thermistor (temperature sensor) open or shorted.', check: 'Needs a thermistor and wiring check.' },
        { code: 'dE / dO / dC', meaning: 'Door open or door switch fault.', check: 'Close the door firmly; repeated codes mean the door switch.' },
        { code: '9C1', meaning: 'Power supply / voltage problem.', check: 'Check the breaker and that the dryer has its own outlet; if it persists, the power supply or board.' },
        { code: 'bE / bE2', meaning: 'A button is stuck.', check: 'Press each button once; if it stays, the control panel.' },
        { code: 'AE', meaning: 'Communication error between boards.', check: 'Unplug for five minutes; if it returns, a technician should check the boards.' },
      ],
      codesPage: true,
    },
  },
  {
    slug: 'whirlpool',
    name: 'Whirlpool',
    note: 'Whirlpool makes washers and dryers under its own name and builds Maytag, Kenmore (many models), Amana and KitchenAid laundry on shared platforms.',
    washer: {
      intro:
        'Whirlpool washers — Cabrio and other top-loaders, Duet and front-loaders — use F#E# codes that point straight at the system that failed. The usual suspects are long fill and long drain (F8E1, F9E1), the lid or door lock (F5E2), and on top-loaders the drive and suspension.',
      lines: 'Top-load (Cabrio, high-efficiency and agitator models) and front-load (Duet and current front-loaders).',
      problems: [
        { title: 'Won’t drain (F9E1 / F21 / LD)', causes: 'Drain hose and standpipe first, then the pump filter on front-loaders, then the drain pump.' },
        { title: 'Won’t fill (F8E1 / LF)', causes: 'Water valves and hose screens, then the inlet valve and the pressure sensor.' },
        { title: 'Lid or door won’t lock (F5E2 / F5E3)', causes: 'Lid lock or door lock assembly — one of the most common Whirlpool washer repairs.' },
        { title: 'Not spinning, or spins slow (F7E1)', causes: 'Motor, motor control unit, drive belt on some front-loaders, shifter on top-loaders.' },
        { title: 'Unbalanced and noisy (uL)', causes: 'Load balance first; then suspension rods on top-loaders, shocks and tub bearings on front-loaders.' },
        { title: 'Leaking', causes: 'Door boot seal, hoses, pump; on top-loaders the tub seal and bearing.' },
      ],
      codes: [
        { code: 'F8E1 / LF', meaning: 'Long fill — not enough water in time.', check: 'Open the water valves, check hose screens and household pressure.' },
        { code: 'F9E1 / F21 / LD', meaning: 'Long drain — water not pumped out in time.', check: 'Check the drain hose and standpipe; clean the pump filter on front-loaders.' },
        { code: 'F5E2', meaning: 'Lid or door lock failed to lock.', check: 'Make sure nothing blocks the lid/door; repeated codes mean the lock assembly.' },
        { code: 'F5E1', meaning: 'Lid or door switch fault.', check: 'Needs a switch check.' },
        { code: 'F5E3', meaning: 'Lid or door lock failed to unlock.', check: 'Unplug for a minute; if the door stays locked, the lock assembly.' },
        { code: 'F7E1', meaning: 'Motor/basket speed problem — basket will not turn.', check: 'Remove an oversized load; repeated codes need a technician.' },
        { code: 'F3E1', meaning: 'Pressure (water level) sensor fault.', check: 'Needs a sensor and hose check.' },
        { code: 'F1E1 / F01', meaning: 'Main control board fault.', check: 'Unplug for five minutes; if it returns, the board.' },
        { code: 'uL', meaning: 'Unbalanced load.', check: 'Redistribute the load and level the washer.' },
        { code: 'Sd / Sud', meaning: 'Too many suds.', check: 'HE detergent, less of it; run a rinse.' },
      ],
      codesPage: true,
    },
    dryer: {
      intro:
        'Whirlpool dryers are simple, rugged machines, and they fail in predictable places: the thermal fuse (which on many electric models also stops the dryer from starting), the heating element or gas igniter, the drum rollers, idler pulley and belt.',
      lines: 'Electric and gas dryers, including Cabrio/top-load matching dryers and stacked units.',
      problems: [
        { title: 'Not heating', causes: 'Thermal fuse, heating element, cycling thermostat (electric); igniter and gas valve coils (gas). We clear the vent so the new fuse does not blow again.' },
        { title: 'Won’t start', causes: 'On many electric Whirlpool dryers a blown thermal fuse stops the motor too; then the door switch, start switch and motor.' },
        { title: 'Squeaking or thumping', causes: 'Drum support rollers, idler pulley, front drum glides.' },
        { title: 'Drum won’t turn', causes: 'Belt, idler pulley, motor.' },
        { title: 'Takes too long (AF code)', causes: 'Airflow: lint filter, vent run, vent hood; then the moisture sensor.' },
      ],
      codes: [
        { code: 'AF', meaning: 'Airflow restricted.', check: 'Clean the lint filter and check the vent run and the outside hood.' },
        { code: 'PF', meaning: 'Power failure during the cycle.', check: 'Press Start to resume; if it repeats, check the breaker and outlet.' },
        { code: 'F01 / F1E1', meaning: 'Control board fault.', check: 'Unplug for five minutes; if it returns, the board.' },
        { code: 'F22 / F23 / F3E1 / F3E2', meaning: 'Exhaust thermistor open or shorted (code depends on model year).', check: 'Needs a thermistor check.' },
        { code: 'F26', meaning: 'Drive motor or heater circuit fault on some models.', check: 'Needs a technician.' },
      ],
      codesPage: false,
    },
  },
  {
    slug: 'maytag',
    name: 'Maytag',
    note: 'Maytag is built by Whirlpool, so most Maytag washers and dryers share parts and error codes with Whirlpool models.',
    washer: {
      intro:
        'Maytag washers — Bravos and other top-loaders, Maxima and front-loaders, the Commercial Technology line — share platforms with Whirlpool, so the codes and the common failures match: long fill and long drain, lid or door locks, drive and suspension on top-loaders.',
      lines: 'Top-load (Bravos, Centennial, Commercial Technology) and front-load (Maxima and current front-loaders).',
      problems: [
        { title: 'Won’t drain (F9E1 / F21)', causes: 'Drain hose and standpipe, pump filter on front-loaders, drain pump.' },
        { title: 'Won’t fill (F8E1 / LF)', causes: 'Water valves, hose screens, inlet valve, pressure sensor.' },
        { title: 'Lid locked, won’t start (F5E2 / LO FL)', causes: 'Lid lock assembly — the most common Bravos repair.' },
        { title: 'Not spinning (F7E1)', causes: 'Motor, motor control unit, shifter on top-loaders.' },
        { title: 'Shaking on spin', causes: 'Suspension rods on top-loaders; shocks and bearings on front-loaders.' },
        { title: 'Leaking', causes: 'Door boot, hoses, pump, tub seal.' },
      ],
      codes: [
        { code: 'F8E1 / LF', meaning: 'Long fill.', check: 'Water valves, hose screens, water pressure.' },
        { code: 'F9E1 / F21', meaning: 'Long drain.', check: 'Drain hose, standpipe, pump filter.' },
        { code: 'F5E2 / LO FL', meaning: 'Lid or door will not lock.', check: 'Clear the latch; repeated codes mean the lock.' },
        { code: 'F7E1', meaning: 'Basket will not turn.', check: 'Smaller load; repeated codes need a technician.' },
        { code: 'F5E1', meaning: 'Lid or door switch fault.', check: 'Needs a switch check.' },
        { code: 'F5E3', meaning: 'Lid or door will not unlock.', check: 'Unplug for a minute; if it stays locked, the lock assembly.' },
        { code: 'F3E1', meaning: 'Pressure (water level) sensor fault.', check: 'Needs a sensor and hose check.' },
        { code: 'F1E1 / F01', meaning: 'Main control board fault.', check: 'Unplug for five minutes; if it returns, the board.' },
        { code: 'uL', meaning: 'Unbalanced load.', check: 'Redistribute and level.' },
        { code: 'Sd / Sud', meaning: 'Too many suds.', check: 'Less HE detergent; run a rinse.' },
      ],
      codesPage: true,
    },
    dryer: {
      intro:
        'Maytag dryers (Bravos, Medallion, Commercial Technology and current models) are Whirlpool-built and fail the same way: thermal fuse, heating element or gas igniter, rollers, idler pulley and belt. The heavier Commercial Technology dryers add larger rollers and motors.',
      lines: 'Electric and gas dryers, including Commercial Technology and stacked units.',
      problems: [
        { title: 'Not heating', causes: 'Thermal fuse, element, thermostats (electric); igniter, valve coils (gas); vent first.' },
        { title: 'Won’t start', causes: 'Thermal fuse on many electric models, door switch, start switch, motor.' },
        { title: 'Noisy', causes: 'Drum rollers, idler pulley, glides.' },
        { title: 'Takes too long (AF)', causes: 'Lint filter, vent, vent hood, moisture sensor.' },
      ],
      codes: [
        { code: 'AF', meaning: 'Airflow restricted.', check: 'Lint filter, vent run, outside hood.' },
        { code: 'PF', meaning: 'Power failure.', check: 'Press Start; check the breaker if it repeats.' },
        { code: 'F01 / F1E1', meaning: 'Control board fault.', check: 'Unplug five minutes; then the board.' },
        { code: 'F22 / F3E1', meaning: 'Exhaust thermistor fault.', check: 'Thermistor check.' },
      ],
      codesPage: false,
    },
  },
  {
    slug: 'ge',
    name: 'GE',
    note: 'GE Appliances makes GE and GE Profile washers and dryers, top-load and front-load, electric and gas, plus Unitized Spacemaker laundry centers.',
    washer: {
      intro:
        'GE washers — agitator and impeller top-loaders, front-loaders and the Unitized Spacemaker laundry centers — mostly come to us not spinning, not draining or with a lid that will not lock. Many GE models signal faults with blinking lights rather than a code on a display, which is why we diagnose by model and symptom.',
      lines: 'Top-load (GE and GE Profile, agitator and impeller), front-load, and Unitized Spacemaker washer-dryer combos.',
      problems: [
        { title: 'Not spinning or agitating', causes: 'Lid switch or lid lock first, then the drive belt or coupling, the mode shifter on top-loaders, and the motor.' },
        { title: 'Won’t drain', causes: 'Drain hose and standpipe, a sock in the pump inlet, the drain pump.' },
        { title: 'Lid locked or won’t lock', causes: 'Lid lock assembly and its wiring.' },
        { title: 'Leaking', causes: 'Hoses, pump, tub seal on top-loaders; door boot on front-loaders.' },
        { title: 'Loud on spin', causes: 'Suspension and dampers on top-loaders; tub bearings on front-loaders.' },
        { title: 'Won’t fill', causes: 'Water valves, hose screens, inlet valve.' },
      ],
      codes: [],
      codesPage: false,
    },
    dryer: {
      intro:
        'GE dryers are straightforward to repair and fail in the usual places: thermal fuse and heating element (electric), igniter and gas valve coils (gas), drum rollers or drum slides, idler pulley and belt.',
      lines: 'Electric and gas dryers (GE and GE Profile), stacked units and Unitized Spacemaker laundry centers.',
      problems: [
        { title: 'Not heating', causes: 'Thermal fuse, heating element, thermostats (electric); igniter, valve coils, flame sensor (gas). Vent first.' },
        { title: 'Squeaking or thumping', causes: 'Drum rollers, drum slides (glides), idler pulley.' },
        { title: 'Drum won’t turn', causes: 'Belt, idler pulley, motor.' },
        { title: 'Won’t start', causes: 'Door switch, start switch, thermal fuse on some models, motor, control board.' },
        { title: 'Takes too long', causes: 'Vent run and hood, then the moisture sensor and thermostat.' },
      ],
      codes: [],
      codesPage: false,
    },
  },
  {
    slug: 'kenmore',
    name: 'Kenmore',
    note: 'Kenmore never built its own machines: Kenmore washers and dryers were made by Whirlpool, LG, Electrolux/Frigidaire and others. The first three digits of the model number tell who built it — 110 is Whirlpool, 796 is LG, 417 is Electrolux/Frigidaire.',
    washer: {
      intro:
        'With a Kenmore, the first question is who made it. A 110-series washer behaves like a Whirlpool, a 796-series (many Kenmore Elite front-loaders) like an LG, a 417-series like a Frigidaire — same parts, same failures, same codes. Tell us the full model number on the phone and we come with the right parts.',
      lines: 'Kenmore and Kenmore Elite top-load and front-load washers — 110 (Whirlpool-built), 796 (LG-built), 417 (Electrolux/Frigidaire-built) and other series.',
      problems: [
        { title: 'Won’t drain', causes: 'Hose and standpipe, pump filter on front-loaders, drain pump.' },
        { title: 'Won’t spin', causes: 'Lid or door lock, drive motor or motor control, shifter on Whirlpool-built top-loaders.' },
        { title: 'Lid or door won’t lock', causes: 'Lock assembly — the part depends on the manufacturer series.' },
        { title: 'Leaking', causes: 'Door boot, hoses, pump, tub seal.' },
        { title: 'Shaking or loud', causes: 'Suspension rods or shocks, tub bearings.' },
      ],
      codes: [
        { code: 'F#E# (e.g. F9E1, F5E2)', meaning: '110-series, Whirlpool-built: same codes as Whirlpool washers.', check: 'See our Whirlpool washer error codes.' },
        { code: 'OE / IE / UE / dE', meaning: '796-series, LG-built: same codes as LG washers (drain, fill, unbalanced, door).', check: 'See our LG washer error codes.' },
        { code: 'E11 / E21 / E41', meaning: '417-series, Electrolux/Frigidaire-built: fill, drain, door lock.', check: 'See our Electrolux washer page.' },
      ],
      codesPage: false,
    },
    dryer: {
      intro:
        'Kenmore dryers follow their maker too: most are Whirlpool-built 110-series machines (thermal fuse, element, rollers, idler, belt), LG-built 796-series models share LG dryer parts and codes, and 417-series dryers are Frigidaire-built.',
      lines: 'Kenmore and Kenmore Elite electric and gas dryers — 110, 796, 417 and other series.',
      problems: [
        { title: 'Not heating', causes: 'Thermal fuse, element, thermostats (electric); igniter and valve coils (gas). Vent first.' },
        { title: 'Won’t start', causes: 'Thermal fuse (on Whirlpool-built models it also stops the motor), door switch, start switch.' },
        { title: 'Noisy', causes: 'Drum rollers, idler pulley, glides.' },
        { title: 'Drum won’t turn', causes: 'Belt, idler pulley, motor.' },
      ],
      codes: [],
      codesPage: false,
    },
  },
  {
    slug: 'bosch',
    name: 'Bosch',
    note: 'Bosch makes compact 24-inch front-load washers and condensation and heat-pump dryers that often sit stacked in a closet, plus full-size models.',
    washer: {
      intro:
        'Bosch washers are compact front-loaders, often stacked in a closet. Most calls are drain codes from a clogged pump filter, slow fill, a leak caught by the base sensor, or a door that will not lock. They are worth repairing — the parts are good and the machines last.',
      lines: '24-inch compact front-load washers (300, 500 and 800 Series; Axxis and Vision on older units) and full-size front-loaders.',
      problems: [
        { title: 'Won’t drain (E18 / F18)', causes: 'Pump filter behind the bottom-front cover, drain hose, drain pump.' },
        { title: 'Slow fill (E17 / F17)', causes: 'Water valve, hose screen, inlet valve.' },
        { title: 'Leak in the base (E23 / F23)', causes: 'Water in the base pan trips the float switch — door seal, hoses, detergent drawer, pump.' },
        { title: 'Drum won’t turn (E21 / F21)', causes: 'Something jammed between drum and tub, motor brushes or motor, control.' },
        { title: 'Door won’t lock or open', causes: 'Door lock and handle mechanism.' },
      ],
      codes: [
        { code: 'E18 / F18', meaning: 'Drain problem — water not pumped out.', check: 'Clean the pump filter behind the bottom-front cover; check the drain hose.' },
        { code: 'E17 / F17', meaning: 'Water fill too slow.', check: 'Open the water valve, clean the hose screen.' },
        { code: 'E23 / F23', meaning: 'Water in the base — leak protection triggered.', check: 'Turn off the water and call; the leak has to be found before the next cycle.' },
        { code: 'E21 / F21', meaning: 'Drum blocked or motor fault.', check: 'Unplug; make sure nothing is jammed in the drum; if it repeats, a technician.' },
      ],
      codesPage: false,
    },
    dryer: {
      intro:
        'Bosch dryers are mostly ventless condensation and heat-pump compacts. When they dry slowly, the cause is usually a clogged condenser or lint filter rather than a failed heater, so we clean the airflow path before replacing parts.',
      lines: '24-inch compact condensation and heat-pump dryers (300, 500 and 800 Series) and vented models.',
      problems: [
        { title: 'Dries slowly or not at all', causes: 'Lint filter and condenser clogged, then the heater or the heat-pump system.' },
        { title: 'Water tank or drain warning', causes: 'Full condensate container, or a blocked condensate pump or drain hose.' },
        { title: 'Noisy drum', causes: 'Drum rollers and belt.' },
        { title: 'Won’t start', causes: 'Door switch, control, motor.' },
      ],
      codes: [],
      codesPage: false,
    },
  },
  {
    slug: 'electrolux',
    name: 'Electrolux',
    note: 'Electrolux also builds Frigidaire laundry; many Electrolux and Frigidaire front-load washers share parts and error codes.',
    washer: {
      intro:
        'Electrolux front-load washers (and their Frigidaire cousins) usually come to us with a drain or fill code, a door that will not lock, or a musty smell from the door seal. The E-codes are consistent across the family.',
      lines: 'Electrolux front-load washers, including steam and stacked models; many Frigidaire front-loaders share the same platform.',
      problems: [
        { title: 'Won’t drain (E21)', causes: 'Pump filter, drain hose, drain pump.' },
        { title: 'Won’t fill (E11)', causes: 'Water valves, hose screens, inlet valve, pressure sensor.' },
        { title: 'Door won’t lock (E41 / E42)', causes: 'Door lock assembly and wiring.' },
        { title: 'Musty smell, mold on the seal', causes: 'Door boot seal and drain path; we clean or replace the seal.' },
        { title: 'Loud on spin', causes: 'Tub bearings and shocks.' },
      ],
      codes: [
        { code: 'E11', meaning: 'Water fill takes too long.', check: 'Water valves and hose screens.' },
        { code: 'E21', meaning: 'Drain takes too long.', check: 'Clean the pump filter, check the drain hose.' },
        { code: 'E41 / E42', meaning: 'Door open or door lock fault.', check: 'Close the door firmly; repeated codes mean the lock.' },
      ],
      codesPage: false,
    },
    dryer: {
      intro:
        'Electrolux and Frigidaire dryers share parts too: heating element and high-limit thermostat (electric), igniter and gas valve coils (gas), drum rollers, idler pulley, belt and front glides.',
      lines: 'Electrolux electric and gas dryers, including steam and stacked models; Frigidaire dryers share the platform.',
      problems: [
        { title: 'Not heating', causes: 'Element and thermostats (electric), igniter and valve coils (gas); vent first.' },
        { title: 'Noisy', causes: 'Drum rollers, idler pulley, front glides.' },
        { title: 'Drum won’t turn', causes: 'Belt, idler pulley, motor.' },
        { title: 'Takes too long', causes: 'Vent and moisture sensor.' },
      ],
      codes: [],
      codesPage: false,
    },
  },
  {
    slug: 'speed-queen',
    name: 'Speed Queen',
    note: 'Speed Queen builds commercial-grade washers and dryers for homes and for laundromats, laundry rooms and businesses.',
    washer: {
      intro:
        'Speed Queen machines are built to last, and owners keep them running for decades — which is exactly why they are worth repairing. We work on residential Speed Queen top-loaders and front-loaders and on the commercial-grade machines in laundry rooms, apartment buildings and small businesses.',
      lines: 'Top-load (TC and TR series), front-load (FF series) and commercial-grade washers.',
      problems: [
        { title: 'Won’t spin or agitate', causes: 'Lid switch or lock, drive belt, transmission or motor.' },
        { title: 'Won’t drain', causes: 'Drain hose, pump.' },
        { title: 'Leaking', causes: 'Hoses, pump, tub seal.' },
        { title: 'Won’t fill', causes: 'Water valves, hose screens, inlet valve.' },
        { title: 'Coin or card mechanism (commercial)', causes: 'Coin drop or card reader, timer, controls.' },
      ],
      codes: [],
      codesPage: false,
    },
    dryer: {
      intro:
        'Speed Queen dryers are simple and heavy-duty. They come to us not heating or noisy: igniter or heating element, drum rollers and belt — usually a single visit.',
      lines: 'Residential and commercial-grade electric and gas dryers.',
      problems: [
        { title: 'Not heating', causes: 'Element or igniter, thermostats, vent.' },
        { title: 'Noisy', causes: 'Drum rollers, belt, idler.' },
        { title: 'Won’t start', causes: 'Door switch, start circuit, motor.' },
      ],
      codes: [],
      codesPage: false,
    },
  },
  {
    slug: 'frigidaire',
    name: 'Frigidaire',
    note: 'Frigidaire is part of Electrolux; Frigidaire and Electrolux front-load washers and dryers share platforms, parts and error codes.',
    washer: {
      intro:
        'Frigidaire washers — Gallery and Affinity front-loaders, top-loaders and the stacked laundry centers — come to us with drain and fill codes, door locks that will not engage, and on older front-loaders worn tub bearings. Front-loaders use the same E-codes as Electrolux.',
      lines: 'Front-load (Gallery, older Affinity), top-load, and Frigidaire laundry centers (washer and dryer in one unit).',
      problems: [
        { title: 'Won’t drain (E21)', causes: 'Pump filter on front-loaders, drain hose, drain pump.' },
        { title: 'Won’t fill (E11)', causes: 'Water valves, hose screens, inlet valve.' },
        { title: 'Door won’t lock (E41 / E42)', causes: 'Door lock assembly; on older Affinity front-loaders a very common repair.' },
        { title: 'Loud grinding on spin', causes: 'Tub bearings and seal on front-loaders; suspension on top-loaders.' },
        { title: 'Laundry center won’t spin or heat', causes: 'Washer: lid switch, belt, motor. Dryer half: element or igniter, thermal fuse, belt.' },
      ],
      codes: [
        { code: 'E11', meaning: 'Water fill takes too long (front-load).', check: 'Water valves and hose screens.' },
        { code: 'E21', meaning: 'Drain takes too long.', check: 'Clean the pump filter, check the drain hose.' },
        { code: 'E41 / E42', meaning: 'Door open or door lock fault.', check: 'Close the door firmly; repeated codes mean the lock.' },
      ],
      codesPage: false,
    },
    dryer: {
      intro:
        'Frigidaire dryers, including the dryer half of Frigidaire laundry centers, fail in familiar places: heating element and high-limit thermostat, igniter and gas valve coils, drum rollers, front glides, idler pulley and belt.',
      lines: 'Electric and gas dryers (Gallery and standard), stacked units and laundry centers.',
      problems: [
        { title: 'Not heating', causes: 'Element, thermostats, thermal fuse (electric); igniter and valve coils (gas); vent first.' },
        { title: 'Squeaking or scraping', causes: 'Drum rollers, front drum glides, idler pulley.' },
        { title: 'Drum won’t turn', causes: 'Belt, idler pulley, motor.' },
        { title: 'Takes too long', causes: 'Vent and moisture sensor.' },
      ],
      codes: [],
      codesPage: false,
    },
  },
  {
    slug: 'amana',
    name: 'Amana',
    note: 'Amana laundry is built by Whirlpool, so Amana washers and dryers share parts and error codes with Whirlpool models.',
    washer: {
      intro:
        'Amana washers are mostly simple, budget top-loaders built by Whirlpool. They come to us not spinning, not agitating or not draining; the parts are inexpensive and the repairs are usually quick, which makes them very much worth fixing.',
      lines: 'Top-load agitator and impeller washers, and a few front-load models.',
      problems: [
        { title: 'Not spinning', causes: 'Lid switch, drive belt or motor coupler, shifter, motor.' },
        { title: 'Agitator not working', causes: 'Agitator dogs or agitator, transmission or shifter.' },
        { title: 'Won’t drain (F9E1 / F21)', causes: 'Drain hose and standpipe, drain pump.' },
        { title: 'Won’t fill (LF)', causes: 'Water valves, hose screens, inlet valve.' },
        { title: 'Unbalanced (uL)', causes: 'Load balance, then the suspension rods.' },
      ],
      codes: [
        { code: 'LF / F8E1', meaning: 'Long fill.', check: 'Water valves, hose screens, water pressure.' },
        { code: 'F21 / F9E1', meaning: 'Long drain.', check: 'Drain hose and standpipe.' },
        { code: 'uL', meaning: 'Unbalanced load.', check: 'Redistribute and level the washer.' },
        { code: 'Sd / Sud', meaning: 'Too many suds.', check: 'Less HE detergent; run a rinse.' },
      ],
      codesPage: false,
    },
    dryer: {
      intro:
        'Amana dryers are Whirlpool-built and among the simplest dryers to repair: thermal fuse, heating element or igniter, drum rollers, idler pulley and belt — usually one visit.',
      lines: 'Electric and gas dryers.',
      problems: [
        { title: 'Not heating', causes: 'Thermal fuse, element, cycling thermostat (electric); igniter and valve coils (gas).' },
        { title: 'Won’t start', causes: 'Thermal fuse (it also stops the motor on many electric models), door switch, start switch.' },
        { title: 'Noisy', causes: 'Drum rollers, idler pulley.' },
        { title: 'Drum won’t turn', causes: 'Belt, idler pulley, motor.' },
      ],
      codes: [],
      codesPage: false,
    },
  },
  {
    slug: 'kitchenaid',
    name: 'KitchenAid',
    note: 'KitchenAid laundry is built by Whirlpool and shares parts and error codes with Whirlpool washers and dryers.',
    washer: {
      intro:
        'KitchenAid washers are Whirlpool-built premium front-loaders and top-loaders. The F#E# codes are the same as Whirlpool’s, and so are the usual repairs: door or lid locks, drain pumps, long fill, and bearings on older front-loaders.',
      lines: 'Front-load and top-load washers.',
      problems: [
        { title: 'Won’t drain (F9E1)', causes: 'Pump filter, drain hose, drain pump.' },
        { title: 'Won’t fill (F8E1)', causes: 'Water valves, hose screens, inlet valve.' },
        { title: 'Door or lid lock (F5E2)', causes: 'Lock assembly and wiring.' },
        { title: 'Not spinning (F7E1)', causes: 'Motor, motor control unit, belt.' },
        { title: 'Loud on spin', causes: 'Tub bearings, shocks.' },
      ],
      codes: [
        { code: 'F8E1', meaning: 'Long fill.', check: 'Water valves, hose screens.' },
        { code: 'F9E1', meaning: 'Long drain.', check: 'Pump filter and drain hose.' },
        { code: 'F5E2', meaning: 'Door or lid will not lock.', check: 'Clear the latch; repeated codes mean the lock.' },
        { code: 'F7E1', meaning: 'Basket will not turn.', check: 'Smaller load; then a technician.' },
      ],
      codesPage: false,
    },
    dryer: {
      intro:
        'KitchenAid dryers are Whirlpool-built and share their parts: thermal fuse, heating element or igniter, thermistor, drum rollers, idler pulley and belt.',
      lines: 'Electric and gas dryers.',
      problems: [
        { title: 'Not heating', causes: 'Thermal fuse, element, thermostats (electric); igniter, valve coils (gas).' },
        { title: 'Takes too long (AF)', causes: 'Lint filter, vent, vent hood, moisture sensor.' },
        { title: 'Noisy', causes: 'Drum rollers, idler pulley, glides.' },
        { title: 'Won’t start', causes: 'Thermal fuse, door switch, motor.' },
      ],
      codes: [
        { code: 'AF', meaning: 'Airflow restricted.', check: 'Lint filter, vent run, outside hood.' },
        { code: 'PF', meaning: 'Power failure.', check: 'Press Start; check the breaker if it repeats.' },
      ],
      codesPage: false,
    },
  },
  {
    slug: 'miele',
    name: 'Miele',
    note: 'Miele makes premium 24-inch front-load washers and vented and heat-pump dryers, often stacked in a closet; newer models report faults as text messages rather than numeric codes.',
    washer: {
      intro:
        'Miele washers are built to run for twenty years, which is why they are worth repairing. Newer models tell you what is wrong in words — “Check inlet”, “Check drain”, “Waterproof system” — and most calls trace back to a blocked drain pump, a closed or clogged inlet, or water caught by the leak protection in the base.',
      lines: '24-inch front-load washers (W1 and earlier generations), including TwinDos models.',
      problems: [
        { title: '“Check drain”', causes: 'Drain filter behind the front panel and the drain pump, then the drain hose.' },
        { title: '“Check inlet”', causes: 'Water tap closed, inlet hose screen, the inlet valve.' },
        { title: '“Waterproof system” (WPS)', causes: 'Water in the base pan — hose, door seal, detergent dispenser or pump; the leak is found and fixed before the next cycle.' },
        { title: 'Door won’t open', causes: 'Water left in the drum, then the door lock.' },
        { title: 'Noisy on spin', causes: 'Foreign object between drum and tub, then shocks and bearings.' },
      ],
      codes: [
        { code: 'Check drain', meaning: 'Water is not draining.', check: 'Clean the drain filter behind the front access panel.' },
        { code: 'Check inlet', meaning: 'Water is not coming in.', check: 'Open the tap; check the inlet hose.' },
        { code: 'Waterproof system', meaning: 'Leak protection triggered — water in the base.', check: 'Turn off the water and call.' },
      ],
      codesPage: false,
    },
    dryer: {
      intro:
        'Miele dryers — vented and heat-pump T1 models — usually come to us drying slowly. On heat-pump dryers that almost always means lint in the filters or the heat exchanger, so we clean the airflow path before anything is replaced.',
      lines: '24-inch vented and heat-pump dryers (T1 and earlier).',
      problems: [
        { title: 'Dries slowly', causes: 'Lint filters and plinth filter, heat exchanger; then the heater or heat pump.' },
        { title: '“Clean airways” or filter messages', causes: 'Filters and airflow path; a persistent message points to a sensor.' },
        { title: 'Condensate container message', causes: 'Container full, or a blocked pump or drain hose.' },
        { title: 'Noisy drum', causes: 'Drum rollers and belt.' },
      ],
      codes: [],
      codesPage: false,
    },
  },
  {
    slug: 'fisher-paykel',
    name: 'Fisher & Paykel',
    note: 'Fisher & Paykel is a New Zealand brand owned by Haier; its top-load washers use a direct-drive motor with no belt or transmission.',
    washer: {
      intro:
        'Fisher & Paykel washers are known for their direct-drive motors — no belt, no gearbox — so most repairs are not mechanical wear but the drain pump, the water valves, the motor’s position sensor or the control electronics. Front-loaders add door seals and door locks to the list.',
      lines: 'Top-load (including the long-running SmartDrive / direct-drive models) and front-load washers.',
      problems: [
        { title: 'Won’t drain', causes: 'Drain hose and pump; lint and small items lodged in the pump are common.' },
        { title: 'Won’t spin or spins weakly', causes: 'Motor position sensor, motor rotor or stator, control board, lid lock.' },
        { title: 'Won’t fill', causes: 'Water valves, hose screens, inlet valve.' },
        { title: 'Lid or door won’t lock', causes: 'Lock assembly and wiring.' },
        { title: 'Leaking', causes: 'Hoses, pump, tub seal; door seal on front-loaders.' },
      ],
      codes: [],
      codesPage: false,
    },
    dryer: {
      intro:
        'Fisher & Paykel dryers — vented and heat-pump models — mostly come to us drying slowly or not heating. We clean the lint path and condenser first, then check the heater, thermostats and sensors.',
      lines: 'Vented, condensation and heat-pump dryers, including compact models.',
      problems: [
        { title: 'Not heating or drying slowly', causes: 'Lint filter and vent or condenser, then the heater, thermostats and sensors.' },
        { title: 'Noisy', causes: 'Drum rollers, belt, idler.' },
        { title: 'Won’t start', causes: 'Door switch, control, motor.' },
      ],
      codes: [],
      codesPage: false,
    },
  },
  {
    slug: 'asko',
    name: 'Asko',
    note: 'Asko is a Swedish brand of compact 24-inch washers and dryers with stainless steel drums, built for long service lives.',
    washer: {
      intro:
        'Asko washers are compact, heavy, stainless-steel machines that owners keep for many years — so when one stops, it is usually worth fixing. Most calls are drain problems, door locks and leaks; we bring the common parts when you tell us the model on the phone.',
      lines: '24-inch front-load washers, often stacked with an Asko dryer.',
      problems: [
        { title: 'Won’t drain', causes: 'Drain filter, drain hose, drain pump.' },
        { title: 'Door won’t lock or open', causes: 'Door lock assembly and wiring.' },
        { title: 'Leaking', causes: 'Door seal, hoses, detergent dispenser, pump.' },
        { title: 'Won’t fill', causes: 'Water valve, hose screen, inlet valve.' },
        { title: 'Not spinning', causes: 'Motor, motor control, balance.' },
      ],
      codes: [],
      codesPage: false,
    },
    dryer: {
      intro:
        'Asko dryers — vented, condensation and heat-pump compacts — usually need airflow work before parts: lint filters, the condenser or heat exchanger, then the heater and thermostats.',
      lines: '24-inch vented, condensation and heat-pump dryers.',
      problems: [
        { title: 'Dries slowly', causes: 'Filters, condenser or heat exchanger, then heater and thermostats.' },
        { title: 'Water container message', causes: 'Container full, blocked pump or drain hose.' },
        { title: 'Noisy', causes: 'Drum rollers and belt.' },
      ],
      codes: [],
      codesPage: false,
    },
  },
  {
    slug: 'haier',
    name: 'Haier',
    note: 'Haier makes compact and portable washers, 24-inch washer-dryer combos and full-size machines; Haier also owns GE Appliances and Fisher & Paykel.',
    washer: {
      intro:
        'Haier washers range from small portable top-loaders to 24-inch front-loaders and all-in-one washer-dryer combos. The usual repairs are drain pumps, door and lid locks, water valves and, on portable units, the drive motor and belt.',
      lines: 'Portable and compact top-loaders, 24-inch front-loaders, washer-dryer combos and full-size models.',
      problems: [
        { title: 'Won’t drain', causes: 'Drain filter and hose, drain pump.' },
        { title: 'Won’t spin', causes: 'Lid or door lock, belt or motor, control.' },
        { title: 'Won’t fill', causes: 'Water valve, hose screen, inlet valve.' },
        { title: 'Combo unit won’t dry', causes: 'Heater, condenser airflow, fan, thermostats.' },
        { title: 'Leaking', causes: 'Door seal, hoses, pump.' },
      ],
      codes: [],
      codesPage: false,
    },
    dryer: {
      intro:
        'Haier dryers, including compact and ventless models, come to us not heating or drying slowly. Airflow first — lint filter, vent or condenser — then the heater, thermal fuse and thermostats.',
      lines: 'Compact, ventless and full-size electric dryers.',
      problems: [
        { title: 'Not heating', causes: 'Thermal fuse, heater, thermostats.' },
        { title: 'Dries slowly', causes: 'Lint filter, vent or condenser.' },
        { title: 'Drum won’t turn', causes: 'Belt, motor.' },
      ],
      codes: [],
      codesPage: false,
    },
  },
  {
    slug: 'midea',
    name: 'Midea',
    note: 'Midea makes front-load and top-load washers and dryers under its own name and for several store brands.',
    washer: {
      intro:
        'Midea washers are newer to many US homes, and the repairs we see are the common ones: drain pumps, door and lid locks, water valves, and unbalanced or noisy spin. We repair them like any other front-loader or top-loader, with the model number in hand.',
      lines: 'Front-load and top-load washers, including stacked units.',
      problems: [
        { title: 'Won’t drain', causes: 'Drain filter and hose, drain pump.' },
        { title: 'Door or lid won’t lock', causes: 'Lock assembly and wiring.' },
        { title: 'Won’t fill', causes: 'Water valves, hose screens, inlet valve.' },
        { title: 'Noisy or shaking', causes: 'Leveling, shocks or suspension, bearings.' },
      ],
      codes: [],
      codesPage: false,
    },
    dryer: {
      intro:
        'Midea dryers fail like most dryers: heater or thermal fuse (electric), igniter (gas), rollers, belt — with a restricted vent behind many of the heat problems.',
      lines: 'Electric and gas dryers.',
      problems: [
        { title: 'Not heating', causes: 'Thermal fuse, heater, thermostats; igniter on gas models; vent first.' },
        { title: 'Noisy', causes: 'Drum rollers, idler pulley.' },
        { title: 'Drum won’t turn', causes: 'Belt, motor.' },
      ],
      codes: [],
      codesPage: false,
    },
  },
  {
    slug: 'hotpoint',
    name: 'Hotpoint',
    note: 'In the US, Hotpoint washers and dryers are built by GE Appliances and share many parts with GE models.',
    washer: {
      intro:
        'Hotpoint washers are simple, budget top-loaders built by GE Appliances. They usually come to us not spinning, not draining or with a lid switch fault, and the parts are the same affordable ones GE uses.',
      lines: 'Top-load agitator washers.',
      problems: [
        { title: 'Not spinning', causes: 'Lid switch, drive belt or coupling, mode shifter, motor.' },
        { title: 'Won’t drain', causes: 'Drain hose, a sock in the pump inlet, drain pump.' },
        { title: 'Won’t fill', causes: 'Water valves, hose screens, inlet valve.' },
        { title: 'Leaking', causes: 'Hoses, pump, tub seal.' },
      ],
      codes: [],
      codesPage: false,
    },
    dryer: {
      intro:
        'Hotpoint dryers are GE-built and among the easiest to repair: thermal fuse, heating element or igniter, drum rollers or slides, idler pulley and belt.',
      lines: 'Electric and gas dryers.',
      problems: [
        { title: 'Not heating', causes: 'Thermal fuse, element, thermostats (electric); igniter and valve coils (gas).' },
        { title: 'Noisy', causes: 'Drum rollers or slides, idler pulley.' },
        { title: 'Drum won’t turn', causes: 'Belt, idler pulley, motor.' },
      ],
      codes: [],
      codesPage: false,
    },
  },
  {
    slug: 'beko',
    name: 'Beko',
    note: 'Beko (part of Arçelik, like Blomberg) sells compact 24-inch washers and condensation and heat-pump dryers in the US.',
    washer: {
      intro:
        'Beko washers are compact 24-inch front-loaders, often stacked in a closet or apartment. The usual calls are drain problems, door locks, leaks caught in the base and noisy spin — all repairable with the model number in hand.',
      lines: '24-inch compact front-load washers.',
      problems: [
        { title: 'Won’t drain', causes: 'Pump filter, drain hose, drain pump.' },
        { title: 'Door won’t lock or open', causes: 'Door lock assembly.' },
        { title: 'Leaking', causes: 'Door seal, hoses, dispenser, pump.' },
        { title: 'Noisy on spin', causes: 'Foreign object, shocks, bearings.' },
      ],
      codes: [],
      codesPage: false,
    },
    dryer: {
      intro:
        'Beko compact dryers are mostly condensation and heat-pump models: slow drying usually means lint in the filters or the condenser, and we clean the airflow path before replacing parts.',
      lines: '24-inch condensation and heat-pump dryers.',
      problems: [
        { title: 'Dries slowly', causes: 'Filters and condenser, then heater or heat pump.' },
        { title: 'Water tank message', causes: 'Container full, blocked pump or drain hose.' },
        { title: 'Noisy', causes: 'Drum rollers and belt.' },
      ],
      codes: [],
      codesPage: false,
    },
  },
  {
    slug: 'blomberg',
    name: 'Blomberg',
    note: 'Blomberg (part of Arçelik, like Beko) makes compact 24-inch washers and dryers for small spaces.',
    washer: {
      intro:
        'Blomberg washers are compact 24-inch front-loaders built for closets and small laundry rooms. Like other compacts, they come to us with drain issues, door locks, leaks and noisy spin.',
      lines: '24-inch compact front-load washers.',
      problems: [
        { title: 'Won’t drain', causes: 'Pump filter, drain hose, drain pump.' },
        { title: 'Door won’t lock', causes: 'Door lock assembly.' },
        { title: 'Leaking', causes: 'Door seal, hoses, pump.' },
        { title: 'Noisy on spin', causes: 'Shocks, bearings, foreign object.' },
      ],
      codes: [],
      codesPage: false,
    },
    dryer: {
      intro:
        'Blomberg compact dryers — vented, condensation and heat-pump — need clean filters and a clean condenser to dry well; most slow-drying calls end there, the rest are heaters, thermostats and belts.',
      lines: '24-inch vented, condensation and heat-pump dryers.',
      problems: [
        { title: 'Dries slowly', causes: 'Filters, condenser, then heater and thermostats.' },
        { title: 'Noisy', causes: 'Drum rollers and belt.' },
        { title: 'Won’t start', causes: 'Door switch, control, motor.' },
      ],
      codes: [],
      codesPage: false,
    },
  },
];

export const brandBySlug = (slug: string) => BRANDS_DATA.find((b) => b.slug === slug);
export const brandPages = () =>
  BRANDS_DATA.flatMap((b) => (['washer', 'dryer'] as Appliance[]).filter((a) => b[a]).map((a) => ({ brand: b, appliance: a })));
export const brandPath = (slug: string, a: Appliance) => `/${slug}-${a}-repair/`;
export const codesPath = (slug: string, a: Appliance) => `/${slug}-${a}-error-codes/`;

/** Link for a brand name in "Brands we repair" lists, or null when the brand has no page yet. */
export const brandHref = (name: string, a: Appliance): string | null => {
  if (name === 'LG') return a === 'washer' ? '/washer/' : '/repairs/';
  const b = BRANDS_DATA.find((x) => x.name === name);
  return b && b[a] ? brandPath(b.slug, a) : null;
};
