export const symptoms: Record<string, { name: string; intro: string; faqs: { q: string; a: string }[] }> = {
  'lg-dryer-not-heating': {
    name: 'LG Dryer Not Heating',
    intro: 'An LG dryer that runs but does not heat is one of the most common issues we repair. The cause could range from a blown thermal fuse to a faulty heating element or gas valve solenoid. Our technicians quickly diagnose and fix the root cause.',
    faqs: [
      { q: 'Why is my LG dryer not heating?', a: 'Common causes include a blown thermal fuse, a burnt-out heating element (electric), faulty gas valve solenoids (gas), a broken igniter, or a clogged vent restricting airflow.' },
      { q: 'Is it safe to run my LG dryer if it is not heating?', a: 'While not dangerous, running a dryer that does not heat wastes energy and time. Continuing to run it can also stress other components. We recommend scheduling a repair promptly.' },
      { q: 'How much does it cost to fix an LG dryer not heating?', a: 'Repair costs range from $100–$300 depending on the cause. A thermal fuse is on the lower end, while a heating element or gas valve is on the higher end.' },
    ],
  },
  'lg-dryer-not-spinning': {
    name: 'LG Dryer Not Spinning',
    intro: 'If your LG dryer hums but the drum does not turn, or the dryer will not start at all, the issue is often a broken drive belt, worn drum rollers, or a faulty motor. We diagnose the exact cause and repair it the same day.',
    faqs: [
      { q: 'Why is my LG dryer not spinning?', a: 'The most common causes are a broken drive belt, worn drum rollers, a seized idler pulley, or a failed drive motor. A broken belt is the most frequent cause.' },
      { q: 'Can I still use my dryer if the drum is not spinning?', a: 'No. If the drum is not spinning, clothes will not dry and running the motor without drum rotation can cause additional damage.' },
      { q: 'How quickly can you fix a dryer that is not spinning?', a: 'Most not-spinning issues are resolved in under an hour. Belt replacement takes about 30–45 minutes; motor replacement takes 1–2 hours.' },
    ],
  },
  'lg-dryer-not-starting': {
    name: 'LG Dryer Not Starting',
    intro: 'An LG dryer that will not start can be caused by electrical issues, a faulty door switch, a broken start button, or a failed thermal fuse. Our technicians systematically troubleshoot to find and fix the issue quickly.',
    faqs: [
      { q: 'Why won\'t my LG dryer start?', a: 'Check the power supply first—ensure the breaker hasn\'t tripped and the outlet works. If power is fine, common causes include a faulty door switch, blown thermal fuse, broken start switch, or a failed control board.' },
      { q: 'My LG dryer has power but won\'t start—what\'s wrong?', a: 'If the display lights up but the dryer won\'t start when you press the button, the issue is likely a faulty door switch, start switch, or control board.' },
      { q: 'How much does it cost to fix an LG dryer that won\'t start?', a: 'Repairs range from $80–$350 depending on the cause. A door switch is inexpensive; a control board is on the higher end.' },
    ],
  },
  'lg-dryer-making-noise': {
    name: 'LG Dryer Making Noise',
    intro: 'Unusual noises from your LG dryer—thumping, squealing, grinding, or rattling—indicate worn mechanical parts. Identifying the type of noise helps us pinpoint whether it is the drum rollers, belt, bearing, or idler pulley.',
    faqs: [
      { q: 'Why is my LG dryer making a thumping noise?', a: 'Thumping usually indicates worn drum support rollers. As the rollers wear out, the drum wobbles slightly, creating a rhythmic thumping sound.' },
      { q: 'Why is my LG dryer squealing?', a: 'Squealing is typically caused by a worn idler pulley, worn drum bearing, or a fraying drive belt. The pitch and timing of the squeal help us diagnose the specific part.' },
      { q: 'Should I stop using my dryer if it is making noise?', a: 'Continuing to use a noisy dryer can cause secondary damage. We recommend scheduling a repair soon to prevent a minor issue from becoming a major one.' },
    ],
  },
  'lg-dryer-not-drying': {
    name: 'LG Dryer Not Drying Clothes',
    intro: 'If your LG dryer runs a full cycle but clothes are still damp, the issue may be a clogged vent, a failing heating element, a faulty moisture sensor, or an overloaded drum. We identify and fix the root cause.',
    faqs: [
      { q: 'Why are my clothes still wet after a full dryer cycle?', a: 'The most common cause is a clogged or kinked dryer vent. Other causes include a failing heating element, faulty moisture sensors, or simply overloading the dryer.' },
      { q: 'How do I know if my dryer vent is clogged?', a: 'Signs include longer drying times, the dryer getting very hot, excessive lint around the dryer, and the LG Flow Sense indicator lighting up.' },
      { q: 'How often should I clean my dryer vent?', a: 'We recommend professional dryer vent cleaning at least once a year. Homes with long vent runs or heavy dryer use may need cleaning more frequently.' },
    ],
  },
  'lg-dryer-door-wont-close': {
    name: "LG Dryer Door Won't Close",
    intro: 'If your LG dryer door will not latch or close properly, the dryer will not start due to the safety door switch. Common causes include a broken door latch, worn door strike, or a misaligned door catch. We fix door issues quickly.',
    faqs: [
      { q: "Why won't my LG dryer door close?", a: 'Common causes include a broken door latch or catch, a worn door strike, a warped door, or a faulty door switch. Sometimes the dryer door hinge pins wear out and need replacement.' },
      { q: 'Can I bypass the door switch?', a: 'We strongly advise against bypassing the door switch. It is a safety device that prevents the dryer from running with the door open, which could cause injury or fire.' },
      { q: 'How much does it cost to fix a dryer door?', a: 'Door latch and catch repairs typically cost $80–$150. Door switch replacement is $90–$175. Hinge replacement ranges from $100–$200.' },
    ],
  },
  'lg-dryer-flow-sense-error': {
    name: 'LG Dryer Flow Sense Error',
    intro: 'The Flow Sense indicator on your LG dryer alerts you to restricted exhaust airflow. This can cause longer drying times, overheating, and increased energy usage. Clearing the blockage and cleaning the vent system resolves the issue.',
    faqs: [
      { q: 'What does Flow Sense mean on my LG dryer?', a: 'Flow Sense is LG\'s airflow monitoring system. When the indicator lights up (bars or a "d80/d90/d95" code), it means the exhaust vent is partially or fully blocked, reducing airflow.' },
      { q: 'How do I fix the Flow Sense warning?', a: 'Start by cleaning the lint filter. If the warning persists, the exhaust vent duct needs professional cleaning. Long or kinked vent runs are common culprits.' },
      { q: 'Is Flow Sense a serious problem?', a: 'Yes. Restricted airflow forces the dryer to work harder, increasing energy costs and drying times. More importantly, lint buildup in vents is a leading cause of dryer fires.' },
    ],
  },
  'lg-dryer-overheating': {
    name: 'LG Dryer Overheating',
    intro: 'An overheating LG dryer is a safety concern. Common causes include a clogged vent, a faulty cycling thermostat, or a failed felt seal. Our technicians diagnose the cause and ensure safe operation.',
    faqs: [
      { q: 'Why is my LG dryer getting too hot?', a: 'The most common cause is a clogged exhaust vent restricting airflow. Other causes include a faulty cycling thermostat, worn felt drum seals, or a malfunctioning heating element that does not cycle off.' },
      { q: 'Is an overheating dryer dangerous?', a: 'Yes. An overheating dryer can damage clothes, warp internal components, and in extreme cases, create a fire hazard. Stop using the dryer and call for service immediately.' },
      { q: 'How do you fix an overheating LG dryer?', a: 'We clean the vent system, test all thermostats and thermal fuses, inspect the heating element, and check the felt seals. We address all contributing factors to ensure safe operation.' },
    ],
  },
};
