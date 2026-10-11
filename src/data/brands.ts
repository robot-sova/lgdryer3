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
export type Brand = { slug: string; name: string; note: string; washer?: BrandAppliance; dryer?: BrandAppliance };

export const BRANDS_DATA: Brand[] = [
  {
    slug: 'samsung',
    name: 'Samsung',
    note: 'Samsung sells front-load and top-load washers and electric and gas dryers, including stacked and FlexWash/FlexDry models.',
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
      codesPage: false,
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
        { code: 'uL', meaning: 'Unbalanced load.', check: 'Redistribute and level.' },
        { code: 'Sd / Sud', meaning: 'Too many suds.', check: 'Less HE detergent; run a rinse.' },
      ],
      codesPage: false,
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
