// Single source of truth for every business fact shown on the site.
// The owner's corrections should only ever need to touch this file.
// No personal names are shown: instructors appear as male / female instructor.

/** While true: draft banner, highlighted placeholders, noindex everywhere. */
export const DRAFT = false;

// Values registered here are highlighted on the draft so the owner can see
// exactly what still needs his real information.
const placeholders = new Set<string>();
const ph = <T extends string>(value: T): T => {
  placeholders.add(value);
  return value;
};
export const isPlaceholder = (value: string) => DRAFT && placeholders.has(value);

export type Transmission = 'Manual' | 'Automatic';

export interface Instructor {
  id: 'male' | 'female';
  /** Shown instead of a name, e.g. "Male instructor". */
  label: string;
  role: string;
  transmission: Transmission;
  phoneDisplay: string;
  /** E.164 without the plus, e.g. 447432191584 */
  phoneE164: string;
  car: string;
  bio: string;
  tags: string[];
}

export const business = {
  name: 'Route 66 Driving School',
  shortName: 'Route 66',
  tagline: 'Driving lessons in Hadlow, Tonbridge & Tunbridge Wells',
  url: 'https://route66drivingschool.co.uk',
  locality: 'Hadlow',
  region: 'Kent',
  postcode: 'TN11',
  legalForm: 'sole trader',
  hours: 'Lessons 7 days a week. Times to suit you.',
  founded: '2026',
};

export const instructors: Instructor[] = [
  {
    id: 'male',
    label: 'Male instructor',
    role: 'DVSA Approved Driving Instructor (ADI)',
    transmission: 'Manual',
    phoneDisplay: '07432 191584',
    phoneE164: '447432191584',
    car: ph('Manual car, dual controls (model on request)'),
    bio: ph(
      'Calm, patient and straight-talking, with years of teaching across Kent and a good knowledge of the local test routes, from the Tunbridge Wells roundabouts to the lanes around Hadlow.',
    ),
    tags: ['Manual', 'Motorway', 'Pass Plus', 'Test-day car hire'],
  },
  {
    id: 'female',
    label: 'Female instructor',
    role: 'DVSA Approved Driving Instructor (ADI)',
    transmission: 'Automatic',
    // One school number for both instructors for now.
    phoneDisplay: '07432 191584',
    phoneE164: '447432191584',
    car: ph('Automatic car, dual controls (model on request)'),
    bio: ph(
      "Relaxed and encouraging, and she teaches in an automatic. A popular choice for nervous learners and anyone who'd rather not worry about gears and clutch control.",
    ),
    tags: ['Automatic', 'Nervous drivers', 'Refreshers'],
  },
];

export const primaryInstructor = instructors[0];

export const services = [
  {
    title: 'Beginners',
    text: 'Never driven before? We start somewhere quiet and build up at your pace, with a clear plan towards your test.',
  },
  {
    title: 'Nervous drivers',
    text: 'Calm, patient lessons with no shouting and no pressure. We explain everything before we do it.',
  },
  {
    title: 'Manual and automatic',
    text: "Manual with our male instructor, automatic with our female instructor. Not sure which suits you? Ask and we'll talk it through.",
  },
  {
    title: 'Intensive courses',
    text: 'Semi-intensive and intensive courses for learners in a hurry. Test date subject to DVSA availability.',
  },
  {
    title: 'Test-day car hire',
    text: 'Already confident? Use our dual-control car for your test, with a warm-up drive beforehand.',
  },
  {
    title: 'Refresher and foreign licence',
    text: 'Back behind the wheel after a break, or used to driving abroad? We get you ready for UK roads.',
  },
  {
    title: 'Motorway lessons',
    text: 'Learners can take motorway lessons with an ADI in a dual-control car. Useful before or after your test.',
  },
  {
    title: 'Pass Plus',
    text: 'Six extra modules after you pass: town, all weathers, rural roads, night, dual carriageways and motorways.',
  },
  {
    title: 'Theory test help',
    text: 'Tips, hazard perception practice and the questions learners get stuck on, built into your lessons.',
  },
];

export const steps = [
  {
    title: 'Message us',
    text: 'Send a WhatsApp or give us a call. Tell us your area, manual or automatic, and how much driving you have done.',
  },
  {
    title: 'Get a clear quote',
    text: 'We reply with prices and available times. The price we quote is what you pay. No extras later.',
  },
  {
    title: 'Start driving',
    text: 'We pick you up from home, school, college or work and your first lesson starts from there.',
  },
];

export const areas = [
  'Hadlow',
  'Tonbridge',
  'Tunbridge Wells',
  'Sevenoaks',
  'Maidstone',
  'West Malling',
  'Kings Hill',
  'Borough Green',
  'Wateringbury',
  'Mereworth',
  'East Peckham',
  'Hildenborough',
  'Paddock Wood',
  'Larkfield',
];

export const testCentres = ['Tunbridge Wells', 'Sevenoaks', 'Maidstone'];

/**
 * Why learners pick us. These are the school's own words, not pupil reviews:
 * only add pupil reviews here once real ones exist (DMCC Act 2024).
 */
export const reasons = [
  {
    title: 'Tricky roundabouts? Not for long',
    text: 'We practise the junctions and roundabouts on the Tunbridge Wells, Sevenoaks and Maidstone test routes until they feel easy.',
  },
  {
    title: 'Nervous? We get it',
    text: "Had a bad experience with another instructor, or just anxious behind the wheel? We're calm and patient from the very first lesson.",
  },
  {
    title: 'Driven abroad for years?',
    text: 'You may only need a couple of lessons on UK roads and a warm-up before your test in our car.',
  },
];

export const faqs = [
  {
    q: 'How many lessons will I need?',
    a: "Everyone is different. DVSA says learners who pass have had around 45 hours of lessons plus 22 hours of private practice on average. After your first lesson we'll give you an honest estimate.",
  },
  {
    q: 'Should I learn in a manual or an automatic?',
    a: 'Automatic is usually quicker to learn and less stressful, but an automatic licence only lets you drive automatic cars. Manual covers both. We teach both, so we can help you decide.',
  },
  {
    q: 'How much are lessons?',
    a: "Message us on WhatsApp with your area and whether you want manual or automatic, and we'll send our current prices and any block booking offers.",
  },
  {
    q: 'Do you pick up and drop off?',
    a: 'Yes. We collect you from home, school, college or work anywhere in our area and drop you back afterwards.',
  },
  {
    q: 'Which test centres do you use?',
    a: 'Mostly Tunbridge Wells, Sevenoaks and Maidstone. The nearest test centres to Tonbridge are Tunbridge Wells and Sevenoaks, so we practise on the routes around the centre you book.',
  },
  {
    q: 'Can I use your car for my driving test?',
    a: "Yes. Our test-day package includes a warm-up drive before the test and use of our dual-control car. It's popular with people who already drive but need a UK test car. Early-morning test slots carry a surcharge, which we include in your quote.",
  },
  {
    q: 'I have a foreign licence. Can you help?',
    a: 'Yes. We run refresher lessons that focus on UK roads, roundabouts and what examiners look for, then help you get test-ready.',
  },
  {
    q: 'Do you offer intensive courses?',
    a: "Yes, intensive and semi-intensive. How quickly you can take your test depends on DVSA test availability, so we'll be honest about realistic dates.",
  },
  {
    q: 'What if I need to cancel?',
    a: "Give us at least 48 hours' notice and we'll move your lesson for free. With less notice we may charge for the lesson, unless we can fill the slot. We're understanding about illness and emergencies.",
  },
  {
    q: 'What do I need before my first lesson?',
    a: "You need to be 17 or over (16 if you get the higher rate mobility component of PIP) and hold a valid provisional driving licence. Bring it to your first lesson, and glasses or contact lenses if you need them for driving.",
  },
];

export const whatsappText = (transmission?: Transmission) =>
  transmission
    ? `Hi! I found you on route66drivingschool.co.uk. I'd like ${transmission.toLowerCase()} driving lessons. My area is: `
    : `Hi! I found you on route66drivingschool.co.uk. I'd like to ask about driving lessons. My area is: `;

export const waLink = (e164: string, text: string) =>
  `https://wa.me/${e164}?text=${encodeURIComponent(text)}`;

export const telLink = (e164: string) => `tel:+${e164}`;
