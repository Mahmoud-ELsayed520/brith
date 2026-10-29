import type { BirthdayConfig } from '../types'

/**
 * ============================================================================
 *  BIRTHDAY CONFIG — the single file a customer edits.
 *  Everything marked SAMPLE is placeholder content: replace it before delivery.
 * ============================================================================
 */
export const birthdayConfig: BirthdayConfig = {
  // SAMPLE names — replace with the real recipient and sender.
  recipient: { ar: 'ليلى', en: 'Layla' },
  sender: { ar: 'من يحبّك', en: 'Someone who loves you' },

  /** Language shown first: 'ar' (RTL) or 'en' (LTR). Visitors can switch. */
  defaultLang: 'ar',

  /** Birthday WITHOUT a zone, e.g. "2027-03-14" or "2027-03-14T18:30:00". "" = no countdown (shows a notice). */
  birthday: '',
  /** Timezone of the birthday as a UTC offset, e.g. "+02:00" or "-05:00". */
  utcOffset: '+02:00',

  /** Optional scenes. */
  sections: { countdown: true, cake: true },
  /** Story paths offered in chapter 3. Turn any off with false. */
  paths: { memories: true, letter: true, wishes: true },

  /** Colour overrides: midnight, violet, blush, ivory, gold. */
  theme: { midnight: '#0d1233', violet: '#4b2a86', blush: '#f4b6c8', ivory: '#fbf3e4', gold: '#d9b26a' },

  /** Letter on the finale seal. "" = first letter of the recipient's name. */
  monogram: '',

  /** Optional music file in /public, e.g. "music/song.mp3". "" hides the sound button. Never autoplays. */
  music: '',

  /** WhatsApp: digits with country code (e.g. "201001234567"), or "" to let the sender pick a contact. */
  whatsapp: { enabled: true, number: '' },

  // SAMPLE story passages (chapter 2) — keep each one short.
  story: {
    ar: ['في مكانٍ ما بين النجوم، وُلدت حكاية صغيرة.', 'حكايةٌ عن {name}، وعن كل ما يجعل العالم أدفأ.', 'وهذا العالم الصغير صُنع لكِ، فتجولي فيه كما تشائين.'],
    en: ['Somewhere between the stars, a small story began.', 'It is about {name}, and everything that makes the world a little warmer.', 'This little world was made for you. Wander through it however you like.'],
  },

  text: {
    ar: {
      subtitle: 'قصة صُنعت لكِ وحدك.', sealedFor: 'رسالة مختومة إلى', enter: 'ادخلي عالمك ✨', skip: 'تخطَّ إلى الرحلة',
      next: 'متابعة', back: 'رجوع', skipScene: 'تخطَّ', progress: 'تقدّم القصة',
      stepNames: ['البداية', 'الرحلة', 'الكعكة', 'الختام'],
      chooseTitle: 'اختاري رحلتك', chooseHint: 'ابدئي من أي طريق. يمكنكِ العودة وتجربة البقية.',
      pathMemories: { title: 'ذكريات لا تُنسى', desc: 'عالمٌ من البطاقات المضيئة' },
      pathLetter: { title: 'رسالة من القلب', desc: 'كلماتٌ كُتبت لكِ' },
      pathWishes: { title: 'أمنيات للمستقبل', desc: 'نجومٌ تخبّئ أمنيات' },
      visited: 'تمت الزيارة', toCake: 'إلى الكعكة',
      memTitle: 'عالم الذكريات', memHint: 'المسي ذكرى لتقترب منكِ.', memPlaceholder: 'محتوى وصور تجريبية، تُستبدل بذكرياتكم الحقيقية.', close: 'إغلاق', backToJourney: 'العودة إلى الرحلة',
      wishesTitle: 'نجوم الأمنيات', wishesHint: 'كل نجمة متوهّجة تخبّئ أمنية. المسيها بهدوء، فلا حاجة للسرعة.',
      star: 'نجمة {n} من {total}', wishesFound: 'اكتُشف {n} من {total}', revealAll: 'اكشفي الكل', wishesReward: 'هذه أمنياتنا لكِ، وهي تكبر كل عام.',
      letterTitle: 'رسالة من القلب', unfold: 'اقرئي الرسالة كاملة',
      letter: ['عزيزتي {name}،', 'في كل عام أتأمل كم تغيّر العالم حين دخلتِ إليه، وكم صار أجمل بضحكتك.', 'شكراً لأنك تكونين دائماً الصدر الذي نلجأ إليه والضوء الذي لا ينطفئ.', 'اجعلي هذا العام صفحةً جديدة من أحلامك.'],
      cdTitle: 'العدّ التنازلي', cdUnits: ['يوم', 'ساعة', 'دقيقة', 'ثانية'],
      cdNone: 'أضيفوا تاريخ عيد الميلاد في ملف الإعدادات ليبدأ العدّ.', cdBad: 'تاريخ غير صالح. تحقّقوا من إعداد birthday.', cdPast: '🎉 حان وقت الاحتفال! كل عام وأنتِ بخير.',
      cakeTitle: 'أطفئي الشموع وتمنّي أمنية', cakeHint: 'المسي كل شمعة لتُطفئيها.', relight: 'أشعلي الشموع من جديد',
      wish: 'كل عام وأنتِ بخير يا {name}! تحققت أمنيتك بإذن الله ✨', candle: 'شمعة {n}', toFinale: 'إلى الخاتمة ✨',
      finTitle: 'كل عام وأنتِ أجمل ما في أيامنا', finMsg: 'أتمنى لكِ عاماً يشبه قلبك: دافئاً وواسعاً ومليئاً بالنور.',
      replay: 'أعيدي المفاجأة', share: 'شاركي عبر واتساب', copy: 'انسخي الرابط', copied: 'تم نسخ الرابط ✓',
      copyFail: 'تعذّر النسخ. انسخوا الرابط من شريط العنوان.', shareMsg: 'قصة عيد ميلاد صُنعت من أجلك 🎂',
      sound: 'الموسيقى', musicMissing: 'ملف الموسيقى غير موجود.', lang: 'English',
    },
    en: {
      subtitle: 'A story made just for you.', sealedFor: 'A sealed letter for', enter: 'Enter Your World ✨', skip: 'Skip to the journey',
      next: 'Continue', back: 'Back', skipScene: 'Skip', progress: 'Story progress',
      stepNames: ['Beginning', 'Journey', 'Cake', 'Finale'],
      chooseTitle: 'Choose your journey', chooseHint: 'Start with any path. You can come back and try the others.',
      pathMemories: { title: 'Unforgettable memories', desc: 'A world of glowing cards' },
      pathLetter: { title: 'A letter from the heart', desc: 'Words written for you' },
      pathWishes: { title: 'Wishes for the future', desc: 'Stars that hide wishes' },
      visited: 'Visited', toCake: 'On to the cake',
      memTitle: 'The memory universe', memHint: 'Touch a memory to bring it closer.', memPlaceholder: 'Sample content and placeholder images. Replace them with real memories.', close: 'Close', backToJourney: 'Back to the journey',
      wishesTitle: 'The wishing stars', wishesHint: 'Every glowing star hides a wish. Touch them gently; there is no rush.',
      star: 'Star {n} of {total}', wishesFound: '{n} of {total} found', revealAll: 'Reveal all', wishesReward: 'These are our wishes for you, and they grow every year.',
      letterTitle: 'A letter from the heart', unfold: 'Show the full letter',
      letter: ['Dear {name},', 'Every year I think about how much brighter the world became when you arrived.', 'Thank you for being the shoulder we lean on and the light that never dims.', 'May this year be a fresh page for all your dreams.'],
      cdTitle: 'Countdown', cdUnits: ['Days', 'Hours', 'Minutes', 'Seconds'],
      cdNone: 'Add the birthday date in the config file to start the countdown.', cdBad: 'Invalid date. Check the birthday setting.', cdPast: '🎉 Time to celebrate! Happy birthday.',
      cakeTitle: 'Make a wish and blow out the candles', cakeHint: 'Tap each candle to blow it out.', relight: 'Light the candles again',
      wish: 'Happy birthday, {name}! May your wish come true ✨', candle: 'Candle {n}', toFinale: 'On to the finale ✨',
      finTitle: 'Happy birthday to the brightest part of our days', finMsg: 'I wish you a year like your heart: warm, wide and full of light.',
      replay: 'Replay the story', share: 'Share on WhatsApp', copy: 'Copy link', copied: 'Link copied ✓',
      copyFail: 'Couldn’t copy. Copy the link from the address bar.', shareMsg: 'A birthday story made for you 🎂',
      sound: 'Music', musicMissing: 'Audio file not found.', lang: 'العربية',
    },
  },

  // SAMPLE memory cards (chapter 4) — add, remove or edit (3 to 6 works best).
  // `image: ''` shows a generated PLACEHOLDER. Real photos go in /public/photos, e.g. image: 'photos/1.jpg'.
  memories: [
    { date: '', image: '', hue: 340, alt: { ar: 'صورة تجريبية', en: 'Placeholder image' }, ar: { title: 'أول ضحكة', text: 'ذلك اليوم الذي لم نتوقف فيه عن الضحك.' }, en: { title: 'The first laugh', text: 'The day we couldn’t stop laughing.' } },
    { date: '', image: '', hue: 270, alt: { ar: 'صورة تجريبية', en: 'Placeholder image' }, ar: { title: 'رحلة لا تُنسى', text: 'طريق طويل وأغانٍ كثيرة وذكرى واحدة جميلة.' }, en: { title: 'An unforgettable trip', text: 'A long road, many songs, one lovely memory.' } },
    { date: '', image: '', hue: 30, alt: { ar: 'صورة تجريبية', en: 'Placeholder image' }, ar: { title: 'كلمة طيبة', text: 'جملة قلتِها في وقتها وبقيت معي.' }, en: { title: 'A kind word', text: 'A sentence you said at the right time, and it stayed.' } },
    { date: '', image: '', hue: 300, alt: { ar: 'صورة تجريبية', en: 'Placeholder image' }, ar: { title: 'يوم هادئ', text: 'لا شيء مميز سوى أننا كنا معاً.' }, en: { title: 'A quiet day', text: 'Nothing special, except that we were together.' } },
  ],

  // SAMPLE hidden wishes (chapter 5) — one per glowing star, 1 to 5 items.
  wishes: [
    { ar: 'عامٌ مليء بالضحك.', en: 'A year full of laughter.' },
    { ar: 'أحلامٌ تجد طريقها إليكِ.', en: 'Dreams that find their way to you.' },
    { ar: 'أيامٌ هادئة ودافئة.', en: 'Calm, warm days.' },
  ],
}
