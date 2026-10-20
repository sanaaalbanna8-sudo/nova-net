export const SLIDES = [
  {
    id: 'open',
    kicker: 'اجتماع سريع',
    title: 'أي شبكة أنسب لنوفا؟',
    lead: 'اليوم ما في وظائف ولا مقاعد. الشركة هي نوفا ترافل، والسؤال واحد: أي نوع شبكة يناسب هالموقف؟',
    cards: [
      { title: 'الصف 12', text: 'الأمن السيبراني · الوحدة 11 · نتاج التعلم ب.' },
      { title: 'النقاش ثم التصويت', text: 'نسمع الحالة، وبعدين كل طالبة تختار نوعاً من ثلاثة.' },
      { title: 'بعد الإغلاق', text: 'تظهر النسب، ويظهر الجواب الأصح وسبب الاختيار.' },
    ],
  },
  {
    id: 'types',
    kicker: 'ب1 · النطاق',
    title: 'خمسة أنواع، من راحة اليد إلى العالم',
    lead: 'النوع قرار عن المسافة، وعن الجمهور، وعن مكان البيانات. الاسم الأشهر مو دائماً الجواب.',
    cards: [
      { title: 'PAN الشخصية', text: 'مترات حول شخص. بلوتوث: سماعة، ساعة، فأرة.' },
      { title: 'LAN المحلية', text: 'مبنى مؤسسة واحدة. نحاس أو ألياف. سريعة لأن المسافة قصيرة.' },
      { title: 'WLAN اللاسلكية', text: 'نفس المبنى بلا كيبل. الموجة تُبث وتعبر الجدار.' },
      { title: 'SAN التخزين', text: 'مسار سريع بين الخوادم والأقراص، وليس للتصفح.' },
      { title: 'WAN الواسعة', text: 'مدن ودول، وأشهرها الإنترنت. الباب الأوسع من الخارج.' },
    ],
  },
  {
    id: 'ask',
    kicker: 'قبل الحالة',
    title: 'ثلاثة أسئلة قبل ما نختار',
    lead: 'كل خيار بيريح الناس وبيفتح باب لازم يُقفل بطريقة تناسب ذلك النوع.',
    cards: [
      { title: 'من يصل؟', text: 'موظف، ضيف، شريك، أو أي شخص داخل مدى الموجة.' },
      { title: 'ماذا يتوقف لو انقطعت؟', text: 'مختبر، فرع، عيادة، أو رحلة. التعطل أثر تشغيلي حتى بلا مخترق.' },
      { title: 'أي بيانات تخرج؟', text: 'إذا وصل البيان لليد الخطأ: جواز، حجز، أو قرص مشترك.' },
    ],
  },
]

export default function Briefing({ step }) {
  const slide = SLIDES[step] || SLIDES[0]
  return (
    <section className="case-story" style={{ gridRow: '1 / span 2' }}>
      <div className="case-kicker">
        <span className="chip border-gold/40 bg-[#fff8ea] text-gold2">{slide.kicker}</span>
        <span className="text-xs font-bold text-faint">
          {step + 1} / {SLIDES.length}
        </span>
      </div>
      <h2>{slide.title}</h2>
      <p className="case-lead">{slide.lead}</p>
      <div className="mt-2 grid gap-3 sm:grid-cols-2">
        {slide.cards.map((card) => (
          <article key={card.title} className="rounded-2xl border border-line bg-white/80 px-4 py-3">
            <strong className="block text-ink">{card.title}</strong>
            <p className="mt-1 text-sm leading-7 text-mist">{card.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
