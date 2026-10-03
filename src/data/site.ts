// Single source of truth for every business fact shown on the site.
// Michael's corrections should only ever need to touch this file.

/** While true: draft banner, highlighted placeholders, noindex everywhere. */
export const DRAFT = true;

// Values registered here are highlighted on the draft so Michael can see
// exactly what still needs his real information.
const placeholders = new Set<string>();
const ph = <T extends string>(value: T): T => {
  placeholders.add(value);
  return value;
};
export const isPlaceholder = (value: string) => DRAFT && placeholders.has(value);

export type Transmission = 'Manual' | 'Automatic';

export interface Instructor {
  id: 'michael' | 'partner';
  firstName: string;
  fullName: string;
  role: string;
  transmission: Transmission;
  adiNumber: string;
  phoneDisplay: string;
  /** E.164 without the plus, e.g. 447592137400 */
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
  postcode: ph('TN11 0XX'),
  owner: ph('Michael Doe'),
  legalForm: 'sole trader',
  address: ph('1 Sample Lane, Hadlow, Tonbridge, Kent TN11 0XX'),
  email: ph('lessons@route66drivingschool.co.uk'),
  hours: 'Lessons 7 days a week. Times to suit you.',
  founded: '2026',
};

export const instructors: Instructor[] = [
  {
    id: 'michael',
    firstName: 'Michael',
    fullName: ph('Michael Doe'),
    role: 'DVSA Approved Driving Instructor (ADI)',
    transmission: 'Manual',
    adiNumber: ph('01234567'),
    phoneDisplay: '07592 137400',
    phoneE164: '447592137400',
    car: ph('Manual car, dual controls (model on request)'),
    bio: ph(
      'Calm, patient and straight-talking. Michael has taught learners across Kent and knows the local test routes well, from the Tunbridge Wells roundabouts to the lanes around Hadlow.',
    ),
    tags: ['Manual', 'Motorway', 'Pass Plus', 'Test-day car hire'],
  },
  {
    id: 'partner',
    firstName: ph('Sarah'),
    fullName: ph('Sarah Doe'),
    role: 'DVSA Approved Driving Instructor (ADI)',
    transmission: 'Automatic',
    adiNumber: ph('01234568'),
    phoneDisplay: ph('01234 566789'),
    phoneE164: ph('441234566789'),
    car: ph('Automatic car, dual controls (model on request)'),
    bio: ph(
      'A relaxed, encouraging female instructor in an automatic car. A popular choice for nervous learners and anyone who would rather not worry about gears and clutch control.',
    ),
    tags: ['Automatic', 'Female instructor', 'Nervous drivers', 'Refreshers'],
  },
];

export const primaryInstructor = instructors[0];
const partnerName = instructors[1].firstName;

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
    text: `Manual with Michael, automatic with ${partnerName}. Not sure which suits you? Ask and we will talk it through.`,
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
    text: 'Learners can now take motorway lessons with an ADI in a dual-control car. Ideal before or after your test.',
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
    text: 'We reply with prices and available times. The price we quote is the price you pay, with no extras added later.',
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

export interface Review {
  name: string;
  area: string;
  text: string;
}

/** SAMPLE reviews for the draft only. Must be deleted before launch. */
export const reviews: Review[] = DRAFT
  ? [
      {
        name: 'Sample review',
        area: 'Tonbridge',
        text: 'Passed first time at Tunbridge Wells. Michael kept me calm and we practised the tricky roundabouts until they felt easy.',
      },
      {
        name: 'Sample review',
        area: 'Hadlow',
        text: `I was really nervous after a bad experience with another instructor. ${partnerName} was patient from the first lesson. Could not recommend her more.`,
      },
      {
        name: 'Sample review',
        area: 'Kings Hill',
        text: 'Hired the car for my test after driving abroad for years. Two lessons and the test-day warm-up was all I needed.',
      },
    ]
  : [];

export const faqs = [
  {
    q: 'How many lessons will I need?',
    a: 'Everyone is different. DVSA says learners who pass have had around 45 hours of lessons plus 22 hours of private practice on average. After your first lesson we will give you an honest estimate.',
  },
  {
    q: 'Should I learn in a manual or an automatic?',
    a: 'Automatic is usually quicker to learn and less stressful, but an automatic licence only lets you drive automatic cars. Manual covers both. We teach both, so we can help you decide.',
  },
  {
    q: 'How much are lessons?',
    a: 'Message us on WhatsApp with your area and whether you want manual or automatic, and we will send our current prices and any block booking offers. The price we quote is the full price.',
  },
  {
    q: 'Do you pick up and drop off?',
    a: 'Yes. We collect you from home, school, college or work anywhere in our area and drop you back afterwards.',
  },
  {
    q: 'Which test centres do you use?',
    a: 'Mostly Tunbridge Wells, Sevenoaks and Maidstone. There is no test centre in Tonbridge itself, so we practise on the routes around the centre you book.',
  },
  {
    q: 'Can I use your car for my driving test?',
    a: 'Yes. Our test-day package includes a warm-up drive before the test and use of our dual-control car. It is popular with people who already drive but need a UK test car. Early-morning tests may cost a little more.',
  },
  {
    q: 'I have a foreign licence. Can you help?',
    a: 'Yes. We run refresher lessons that focus on UK roads, roundabouts and what examiners look for, then help you get test-ready.',
  },
  {
    q: 'Do you offer intensive courses?',
    a: 'Yes, intensive and semi-intensive. How quickly you can take your test depends on DVSA test availability, so we will be honest about realistic dates.',
  },
  {
    q: 'What if I need to cancel?',
    a: 'Please give us at least 48 hours notice and we will move your lesson for free. Lessons cancelled with less notice are normally charged in full.',
  },
  {
    q: 'What do I need before my first lesson?',
    a: 'You need to be 17 or over and hold a valid provisional driving licence. Bring it to your first lesson, and glasses or contact lenses if you need them for driving.',
  },
];

export const whatsappText = (transmission?: Transmission) =>
  transmission
    ? `Hi! I found you on route66drivingschool.co.uk. I'd like ${transmission.toLowerCase()} driving lessons. My area is: `
    : `Hi! I found you on route66drivingschool.co.uk. I'd like to ask about driving lessons. My area is: `;

export const waLink = (e164: string, text: string) =>
  `https://wa.me/${e164}?text=${encodeURIComponent(text)}`;

export const telLink = (e164: string) => `tel:+${e164}`;
