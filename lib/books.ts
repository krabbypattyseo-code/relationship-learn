import type { Mode } from '@/types';

export interface BookEntry {
  id: string;
  author: string;
  title: string;
  domain: string;
  coreTheory: string;
  keyConcepts: string[];
  applicationToRGP: string;
  primaryModes: Mode[];
}

export const BOOK_LIBRARY: BookEntry[] = [
  {
    id: 'barrett',
    author: 'Lisa Feldman Barrett',
    title: 'How Emotions Are Made',
    domain: 'Affective Neuroscience · Constructed Emotion Theory',
    coreTheory:
      'Emosi bukan reaksi otomatis terhadap dunia — emosi dibangun (constructed) oleh otak sebagai prediksi biologis berdasarkan interoception, konteks, dan konsep yang pernah dipelajari. Perasaan = otak memprediksi kebutuhan tubuh + makna situasi.',
    keyConcepts: [
      'Theory of Constructed Emotion',
      'Interoception & body budget',
      'Affect (valence + arousal) vs emotion concepts',
      'Emotional granularity',
      'Predictive processing dalam hubungan',
    ],
    applicationToRGP:
      'Gunakan saat user merasa "overreacting" atau bingung kenapa reaksi emosional muncul. Reframe: bukan "kamu terlalu sensitif", tapi "otak memprediksi ancaman/koneksi berdasarkan history + konteks LDR".',
    primaryModes: ['reflect', 'analisis', 'growth'],
  },
  {
    id: 'brizendine-female',
    author: 'Louann Brizendine',
    title: 'The Female Brain',
    domain: 'Neuroendocrinology · Female Brain Development',
    coreTheory:
      'Otak perempuan berkembang dengan dominasi estrogen-progesterone-oxytocin yang membentuk wiring untuk relational processing, verbal-emotional integration, dan bonding drive. Bukan "lebih emosional" — tapi sistem prioritas berbeda: koneksi, konteks relasi, dan detail emosional.',
    keyConcepts: [
      'Oxytocin-estrogen bonding circuit',
      'Hippocampus: emotional memory detail-rich',
      'Verbal-emotional processing integration (more words/day on average)',
      'Tend-and-befriend stress response (Taylor) via estrogen',
      'Mirror neuron empathy activation',
      'Menstrual cycle neurochemical fluctuation & mood sensitivity',
      'Relational aggression vs direct confrontation patterns',
    ],
    applicationToRGP:
      'Lens untuk memahami proses berpikir Dian: slow reply bukan selalu dismissive — bisa processing mode, overwhelm, atau need to respond "right". Connection = safety signal. Apply dengan nuance, bukan stereotype.',
    primaryModes: ['reflect', 'analisis', 'conversation'],
  },
  {
    id: 'brizendine-male',
    author: 'Louann Brizendine',
    title: 'The Male Brain',
    domain: 'Neuroendocrinology · Male Brain Development',
    coreTheory:
      'Otak laki-laki shaped by testosterone surges (in utero, puberty) yang mempengaruhi compartmentalization, spatial-task focus, dan default toward action/problem-solving over verbal emotional processing. Bukan "tidak peduli" — tapi routing berbeda.',
    keyConcepts: [
      'Testosterone & amygdala regulation (less verbalization of fear/sadness)',
      'Compartmentalization: "boxes" — work box, relationship box',
      'Rest-and-digest recovery (vs tend-and-befriend)',
      'Fix-it mode vs listen mode conflict',
      'Dopaminergic reward from pursuit, achievement, novelty',
      'Emotional expression often action-coded not word-coded',
      '"Cave time" — withdrawal as recharge not rejection',
    ],
    applicationToRGP:
      'Lens untuk memahami proses berpikir Harist: kangen + slow reply bisa trigger problem-solving ("what did I do wrong?") atau compartmental shut-down. Apply dengan nuance — Harist juga bisa secure attachment, ini bukan excuse.',
    primaryModes: ['reflect', 'analisis', 'conversation'],
  },
  {
    id: 'lembke',
    author: 'Anna Lembke',
    title: 'Dopamine Nation',
    domain: 'Psychiatry · Neuroscience of Addiction & Reward',
    coreTheory:
      'Otak mengejar homeostasis pleasure-pain. Dopamine bukan tentang pleasure semata — tapi tentang *anticipation* dan *wanting*. Over-stimulation (termasuk digital: notifikasi, reply, scroll) → tolerance → need more stimulus → pain in absence. LDR + messaging = potent dopamine loop.',
    keyConcepts: [
      'Pleasure-pain balance (hedonic homeostasis)',
      'Dopamine = anticipation/wanting vs liking',
      'Tolerance & sensitization cycle',
      'Digital dopamine: texts, likes, read receipts as micro-rewards',
      'Waiting for reply = intermittent reinforcement (slot machine effect)',
      'Self-binding & dopamine fasting',
      'Pain as pathway to pleasure reset',
      'Rich-get-richer: high-dopamine lifestyle erodes capacity for ordinary connection',
    ],
    applicationToRGP:
      'WAJIB di /reflect saat user nunggu balasan, checking phone, atau merasa "addicted" to connection signal. Reframe slow reply withdrawal sebagai dopamine dip — bukan moral failing. Both partners have dopamine systems — explain mutual loops.',
    primaryModes: ['reflect', 'analisis', 'growth'],
  },
  {
    id: 'goleman',
    author: 'Daniel Goleman',
    title: 'Emotional Intelligence',
    domain: 'Psychology · Emotional & Social Intelligence',
    coreTheory:
      'IQ alone tidak menentukan keberhasilan relasi. EQ = kemampuan mengenali emosi diri (self-awareness), mengelola (self-regulation), memotivasi diri, memahami emosi orang lain (empathy), dan navigasi sosial (social skill).',
    keyConcepts: [
      'Four domains of EQ (self-awareness, self-management, social awareness, relationship management)',
      'Amygdala hijack & pause technique',
      'Empathy: cognitive vs emotional vs compassionate',
      'Emotional contagion in couples',
      'Meta-emotion (how we feel about feelings)',
    ],
    applicationToRGP:
      'Gunakan untuk actionable skill-building: "skill EQ mana yang bisa dilatih minggu ini?" Ideal untuk /plan dan /conversation.',
    primaryModes: ['plan', 'conversation', 'growth'],
  },
  {
    id: 'chapman',
    author: 'Gary Chapman',
    title: 'The 5 Love Languages',
    domain: 'Relationship Psychology · Love Expression',
    coreTheory:
      'Orang merasa dicintai melalui saluran berbeda: Words of Affirmation, Quality Time, Receiving Gifts, Acts of Service, Physical Touch. Mismatch love language = feeling unloved meski partner sudah berusaha.',
    keyConcepts: [
      'Primary vs secondary love language',
      'Love tank metaphor',
      'Dialect within each language',
      'Love language under stress',
      'Intentional love vs default expression',
    ],
    applicationToRGP:
      'Wajib di setiap mode yang touch hubungan. Selalu dua sub-poin: lens Harist + lens Dian. LDR = physical touch perlu creative proxy.',
    primaryModes: ['reflect', 'analisis', 'plan', 'conversation', 'growth'],
  },
  {
    id: 'gottman',
    author: 'John & Julie Gottman',
    title: 'The Seven Principles for Making Marriage Work',
    domain: 'Relationship Science · Observational Research',
    coreTheory:
      'Berdasarkan 40+ tahun penelitian longitudinal: relationship success predictable dari pola interaksi sehari-hari. Four Horsemen (criticism, contempt, defensiveness, stonewalling) merusak; repair attempts & emotional bids membangun.',
    keyConcepts: [
      'Four Horsemen of the Apocalypse',
      'Emotional bids (turning toward/away/against)',
      'Love Maps & Fondness & Admiration',
      'Positive sentiment override',
      'Repair attempts & soft startup',
      '5:1 positive-to-negative interaction ratio',
    ],
    applicationToRGP:
      'Gunakan untuk /analisis konflik dan /conversation prep. Identifikasi: apakah ini failed bid? horseman mana? repair attempt seperti apa?',
    primaryModes: ['analisis', 'conversation', 'growth'],
  },
  {
    id: 'johnson',
    author: 'Sue Johnson',
    title: 'Hold Me Tight / Love Sense',
    domain: 'Clinical Psychology · Emotionally Focused Therapy (EFT)',
    coreTheory:
      'Konflik di permukaan hampir selalu protest against disconnection. Attachment panic drives fight/flight/freeze in couples. Secure bond = accessible, responsive, engaged (A.R.E.).',
    keyConcepts: [
      'Attachment theory (secure, anxious, avoidant, disorganized)',
      'Protest behavior vs authentic need',
      'Negative cycle (pursue-withdraw dynamic)',
      'Raw spots & triggers',
      'A.R.E. framework (Accessible, Responsive, Engaged)',
      'Hold Me Tight conversations',
    ],
    applicationToRGP:
      'Core framework untuk LDR. Withdrawal bukan "dia tidak peduli" — bisa jadi avoidant deactivation atau protest. Name the cycle, bukan blame the person.',
    primaryModes: ['reflect', 'analisis', 'conversation'],
  },
  {
    id: 'levine-heller',
    author: 'Amir Levine & Rachel Heller',
    title: 'Attached',
    domain: 'Attachment Theory · Adult Romantic Attachment',
    coreTheory:
      'Attachment style (secure, anxious, avoidant) shaped early tapi bisa di-work. Anxious-avoidant trap = most common painful pairing. Secure base enables exploration (termasuk growth individual).',
    keyConcepts: [
      'Attachment style assessment',
      'Anxious-avoidant trap',
      'Effective communication for each style',
      'Secure base & safe haven',
      'Protest behavior catalog',
      'Dependency paradox (healthy dependence enables independence)',
    ],
    applicationToRGP:
      'Map Harist & Dian attachment patterns. LDR amplifies anxious activation. Give style-specific scripts, not generic advice.',
    primaryModes: ['reflect', 'analisis', 'plan'],
  },
  {
    id: 'brown',
    author: 'Brené Brown',
    title: 'Daring Greatly / Atlas of the Heart',
    domain: 'Social Work · Vulnerability & Shame Research',
    coreTheory:
      'Vulnerability = birthplace of love, belonging, joy — bukan weakness. Shame drives disconnection. Emotional literacy (87 emotions) enables precise communication vs "fine/sedih/ga tau".',
    keyConcepts: [
      'Vulnerability vs weakness',
      'Shame vs guilt',
      'Shame resilience (recognize, critical awareness, reach out, speak shame)',
      'Emotional granularity (Atlas of the Heart)',
      'Armored vs daring leadership in relationship',
      'Trust = BRAVING inventory',
    ],
    applicationToRGP:
      'Gunakan saat user malu, takut di-judge, atau struggle express need. Name the shame underneath the anger.',
    primaryModes: ['reflect', 'conversation'],
  },
  {
    id: 'perel',
    author: 'Esther Perel',
    title: 'Mating in Captivity / The State of Affairs',
    domain: 'Psychotherapy · Erotic Intelligence & Modern Couples',
    coreTheory:
      'Love seeks closeness; desire often needs mystery & distance. LDR paradoxically can preserve erotic polarity. Autonomy + connection = healthy tension, not contradiction.',
    keyConcepts: [
      'Erotic intelligence vs domesticity',
      'Distance as ingredient of desire',
      'Dual narrative: security vs adventure',
      'Reimagining intimacy beyond proximity',
      'Conflict between caretaking and desiring',
    ],
    applicationToRGP:
      'Relevant untuk LDR framing positif. Jarak = space for individuation + anticipation. Avoid "distance = problem" default narrative.',
    primaryModes: ['reflect', 'growth', 'plan'],
  },
  {
    id: 'fisher',
    author: 'Helen Fisher',
    title: 'Why We Love / Anatomy of Love',
    domain: 'Anthropology · Neurochemistry of Love',
    coreTheory:
      'Romantic love = three brain systems: lust (sex drive), attraction (focused craving), attachment (deep bond). Each has distinct neurochemistry (testosterone, dopamine/norepinephrine, oxytocin/vasopressin).',
    keyConcepts: [
      'Three brain systems of love',
      'Dopamine & novelty in attraction phase',
      'Oxytocin & attachment maintenance',
      'Love addiction patterns',
      'Serial monogamy & pair-bonding biology',
    ],
    applicationToRGP:
      'Gunakan untuk normalize "honeymoon fade" vs "attachment deepening". Explain why LDR reunion feels intense (dopamine spike).',
    primaryModes: ['reflect', 'growth'],
  },
  {
    id: 'tatum',
    author: 'Beverly Daniel Tatum',
    title: 'Why Are All the Black Kids Sitting Together in the Cafeteria?',
    domain: 'Social Psychology · Identity Development',
    coreTheory:
      'Identity formation happens in context of social group membership. Understanding own identity development stages helps empathy for partner navigating identity + relationship intersection.',
    keyConcepts: [
      'Identity development stages',
      'In-group vs out-group dynamics',
      'Intersectionality in relationship context',
    ],
    applicationToRGP:
      'Use when cultural, identity, or family-system dynamics affect relationship. Optional — only when user context signals relevance.',
    primaryModes: ['analisis', 'reflect'],
  },
  {
    id: 'cain',
    author: 'Susan Cain',
    title: 'Quiet',
    domain: 'Psychology · Introversion & Temperament',
    coreTheory:
      'Introvert/extrovert = different optimal stimulation levels, bukan shy vs confident. Introverts process deeply, need recovery time. Relationship conflict often = stimulation mismatch.',
    keyConcepts: [
      'Restorative niche',
      'Free trait theory',
      'Introvert-extrovert communication gap',
      'Depth vs breadth in social energy',
    ],
    applicationToRGP:
      'Apply when one partner needs space vs connection — reframe as temperament, not rejection.',
    primaryModes: ['analisis', 'conversation'],
  },
];

export const MODE_BOOK_PRIORITY: Record<Mode, string[]> = {
  reflect: [
    'barrett',
    'lembke',
    'brizendine-female',
    'brizendine-male',
    'johnson',
    'chapman',
  ],
  analisis: [
    'gottman',
    'johnson',
    'lembke',
    'brizendine-female',
    'brizendine-male',
    'levine-heller',
    'goleman',
  ],
  plan: ['goleman', 'chapman', 'levine-heller', 'gottman', 'perel'],
  conversation: ['gottman', 'johnson', 'chapman', 'goleman', 'brown'],
  growth: ['gottman', 'fisher', 'perel', 'goleman', 'chapman'],
};

export function getBooksForMode(mode: Mode): BookEntry[] {
  const ids = MODE_BOOK_PRIORITY[mode];
  return ids
    .map((id) => BOOK_LIBRARY.find((b) => b.id === id))
    .filter((b): b is BookEntry => Boolean(b));
}

export function formatBookLibraryForPrompt(): string {
  return BOOK_LIBRARY.map(
    (b) =>
      `[${b.id.toUpperCase()}] ${b.author} — "${b.title}"
Domain: ${b.domain}
Core Theory: ${b.coreTheory}
Key Concepts: ${b.keyConcepts.join('; ')}
RGP Application: ${b.applicationToRGP}
Primary Modes: ${b.primaryModes.join(', ')}`
  ).join('\n\n');
}

export function formatModeBookPriority(mode: Mode): string {
  const books = getBooksForMode(mode);
  return books
    .map((b, i) => `${i + 1}. ${b.author} — ${b.title} (${b.domain})`)
    .join('\n');
}
