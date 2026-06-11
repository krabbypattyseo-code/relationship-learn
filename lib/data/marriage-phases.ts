export type WarningType = 'danger' | 'amber' | 'info' | 'success';

export interface MarriagePhase {
  id: number;
  name: string;
  duration: string;
  tagline: string;
  color: string;
  bg: string;
  icon: string;
  metrics: { label: string; value: string }[];
  learn: string[];
  green: string[];
  red: string[];
  progress: { label: string; val: number; color: string }[];
  warning: { type: WarningType; text: string };
}

export const marriagePhases: MarriagePhase[] = [
  {
    id: 0,
    name: 'Attraction & Infatuation',
    duration: '0 – 6 bulan',
    tagline:
      'Otak sedang dalam mode obsesi. Dopamin meledak, amigdala mati, critical thinking nonaktif. Ini bukan cinta — ini neurochemical high.',
    color: '#C94F7C',
    bg: 'rgba(201,79,124,0.12)',
    icon: '✦',
    metrics: [
      { label: 'Hormon Dominan', value: 'Dopamin, Norepinefrin, Serotonin (turun)' },
      { label: 'Brain State', value: 'Mirip kecanduan kokain — reward circuit aktif penuh' },
      { label: 'Durasi Rata-rata', value: '6–8 bulan hingga mulai mereda' },
      { label: 'Sternberg Triangle', value: 'Hanya Passion — belum ada Intimacy & Commitment' },
    ],
    learn: [
      'Kenali bahwa "rasa ini" adalah neurochemical state, bukan data valid tentang orangnya',
      'Amati cara dia mengelola frustrasi kecil, bukan hanya di momen romantis',
      'Perhatikan apakah nilai inti (bukan gaya hidup) kalian kompatibel',
      'Jangan buat keputusan besar di fase ini — otak sedang tidak reliable',
    ],
    green: [
      'Eksplorasi bebas tanpa tekanan',
      'Belajar love language masing-masing',
      'Bangun komunikasi jujur sejak awal',
    ],
    red: [
      'Menikah terlalu cepat karena "yakin banget"',
      'Mengabaikan red flag karena amigdala dinonaktifkan',
      'Mengira intensitas ini akan bertahan selamanya',
    ],
    progress: [
      { label: 'Passion', val: 95, color: '#C94F7C' },
      { label: 'Intimacy', val: 30, color: '#7F77DD' },
      { label: 'Commitment', val: 10, color: '#1D9E75' },
    ],
    warning: {
      type: 'danger',
      text: 'Fase ini adalah jebakan terbesar. Otak secara literal buta terhadap kekurangan pasangan. Keputusan permanen yang dibuat di sini punya risiko sangat tinggi.',
    },
  },
  {
    id: 1,
    name: 'Reality Check',
    duration: '6 bulan – 2 tahun',
    tagline:
      'Dopamin mulai turun. Otak kembali ke realita. Dua orang yang tadinya "selalu sepakat" tiba-tiba menemukan perbedaan nyata.',
    color: '#E8851A',
    bg: 'rgba(232,133,26,0.12)',
    icon: '◈',
    metrics: [
      { label: 'Hormon Dominan', value: 'Dopamin turun, Kortisol mulai naik (konflik pertama)' },
      { label: 'Brain State', value: 'Prefrontal cortex aktif kembali — penilaian kritis muncul' },
      { label: 'Momen Kritis', value: 'Kurang dari 1 tahun pertama & sekitar tahun ke-7' },
      { label: 'Sternberg Triangle', value: 'Passion turun, Intimacy diuji, Commitment dipertanyakan' },
    ],
    learn: [
      'Identifikasi dan diskusikan love language masing-masing secara eksplisit',
      'Pelajari cara pasangan merespons ketika "tidak sedang baik-baik saja"',
      'Bangun kemampuan conflict resolution — bukan menghindari, tapi mengelola',
      'Tanyakan: apakah ini perbedaan yang bisa dijembatani, atau perbedaan nilai inti?',
    ],
    green: [
      'Pertama kalinya kalian "lihat" satu sama lain secara nyata',
      'Konflik yang diselesaikan = fondasi kepercayaan',
      'Momentum untuk komunikasi jujur yang sustainable',
    ],
    red: [
      'Menafsirkan "dopamin turun" sebagai cinta yang hilang',
      'Kabur ke "in-love experience" baru dengan orang lain',
      'Menghindari konflik sampai menumpuk jadi resentment',
    ],
    progress: [
      { label: 'Passion', val: 55, color: '#C94F7C' },
      { label: 'Intimacy', val: 50, color: '#7F77DD' },
      { label: 'Commitment', val: 40, color: '#1D9E75' },
    ],
    warning: {
      type: 'amber',
      text: 'Penelitian longitudinal: penurunan marital satisfaction pertama terjadi di tahun pertama. Normal — tapi pasangan yang tidak siap akan salah mengartikannya sebagai "salah orang".',
    },
  },
  {
    id: 2,
    name: 'Building Partnership',
    duration: '2 – 7 tahun',
    tagline:
      'Fase kerja keras sesungguhnya. Otak berpindah dari dopamine-driven ke oxytocin-driven attachment. Dari "crave" menjadi "safe".',
    color: '#534AB7',
    bg: 'rgba(83,74,183,0.12)',
    icon: '⬡',
    metrics: [
      { label: 'Hormon Dominan', value: 'Oxytocin & Vasopressin (bonding jangka panjang)' },
      { label: 'Brain State', value: 'Attachment circuits aktif — menggantikan reward circuits' },
      { label: 'Tantangan Kunci', value: 'Menjaga emotional love tank tetap terisi secara konsisten' },
      { label: 'Sternberg Triangle', value: 'Passion stabil, Intimacy dalam, Commitment menguat' },
    ],
    learn: [
      'Praktikkan "Tank Check" harian — tanya level emotional tank pasangan secara aktif',
      'Kenali pola konflik dan bangun repair mechanism yang efektif',
      'Pahami bagaimana stress eksternal (karir, finansial) mempengaruhi dinamika relasi',
      'Investasi dalam shared growth — tumbuh ke arah yang sama, tidak hanya bersama',
    ],
    green: [
      'Kedalaman intimacy yang tidak ada di fase awal',
      'Kepercayaan yang dibangun dari menghadapi tantangan bersama',
      'Fondasi companionate love — deep friendship dalam relasi',
    ],
    red: [
      'Mengasumsikan pasangan "sudah tahu" tanpa komunikasi eksplisit',
      'Love tank dibiarkan kosong terlalu lama',
      'Rutinitas tanpa intention — hadir fisik tapi absen emosional',
    ],
    progress: [
      { label: 'Passion', val: 50, color: '#C94F7C' },
      { label: 'Intimacy', val: 75, color: '#7F77DD' },
      { label: 'Commitment', val: 70, color: '#1D9E75' },
    ],
    warning: {
      type: 'info',
      text: "Chapman: 'Few men with empty emotional love tanks leave their marriage until they have prospects elsewhere.' Berlaku untuk semua gender. Empty tank = vulnerability tinggi.",
    },
  },
  {
    id: 3,
    name: 'The Seven Year Itch',
    duration: 'Sekitar tahun ke-7',
    tagline:
      'Downturn kedua yang terdokumentasi secara ilmiah. Routine sets in. Banyak pasangan mencapai titik "I can\'t stand this anymore" tanpa tahu kenapa.',
    color: '#D85A30',
    bg: 'rgba(216,90,48,0.12)',
    icon: '◇',
    metrics: [
      { label: 'Hormon Dominan', value: 'Kortisol kronis (accumulated stress), Oxytocin defisit' },
      { label: 'Brain State', value: 'Intrapsychic phase — brooding diam, resentment menumpuk' },
      { label: 'Trigger Umum', value: 'Perubahan karir, anak, finansial, hilangnya identitas individu' },
      { label: "Duck's Model", value: 'Masuk Intrapsychic Phase — mulai menghitung exit cost' },
    ],
    learn: [
      'Audit hubungan secara jujur: apa yang sudah tidak dilakukan sejak fase awal?',
      'Identifikasi apakah masalahnya di relationship atau di diri sendiri',
      'Bedakan "aku bosan dengan rutinitas" vs "aku tidak kompatibel dengan orangnya"',
      'Investasi dalam novelty bersama — otak butuh stimulasi baru dalam konteks aman',
    ],
    green: [
      'Kesempatan untuk reinvent relasi secara sadar',
      'Kalau dihadapi bersama, bisa memperdalam commitment',
      'Moment of truth yang membawa kejujuran yang tertunda',
    ],
    red: [
      'Mencari dopamin rush di luar relasi (affair, emotional cheating)',
      'Membuat keputusan besar (cerai) di puncak kortisol',
      'Salah mengira relationship problem sebagai compatibility problem',
    ],
    progress: [
      { label: 'Passion', val: 30, color: '#C94F7C' },
      { label: 'Intimacy', val: 55, color: '#7F77DD' },
      { label: 'Commitment', val: 60, color: '#1D9E75' },
    ],
    warning: {
      type: 'danger',
      text: "Duck's Dissolution Model: proses breakup dimulai jauh sebelum seseorang berani bicara. Jika sudah masuk Intrapsychic Phase, intervensi aktif diperlukan — bukan menunggu.",
    },
  },
  {
    id: 4,
    name: 'Mature Partnership',
    duration: '10+ tahun',
    tagline:
      'Companionate love. Deep friendship. Cinta yang tidak butuh intensitas untuk terasa nyata. Ini target sesungguhnya — bukan "butterflies forever".',
    color: '#0F6E56',
    bg: 'rgba(15,110,86,0.12)',
    icon: '◉',
    metrics: [
      { label: 'Hormon Dominan', value: 'Oxytocin stabil, pada laki-laki testosteron turun + oxytocin naik' },
      { label: 'Brain State', value: 'Attachment circuits dominan — kritik melunak, acceptance meningkat' },
      { label: 'Karakteristik', value: 'Domestic partner + lover + companion + social network solid' },
      { label: 'Sternberg Triangle', value: 'Consummate Love — Passion + Intimacy + Commitment seimbang' },
    ],
    learn: [
      'Jaga ritual kecil yang bermakna — bukan grand gesture, tapi daily micro-connections',
      'Pertahankan identitas individu dalam relasi — enmeshment membunuh desire',
      'Navigasi perubahan besar (empty nest, pensiun, kehilangan) sebagai tim',
      'Forgiveness sebagai praktek aktif — bukan event sekali, tapi sistem yang dijalankan',
    ],
    green: [
      'Stability dan security yang tidak ada di fase manapun sebelumnya',
      'Kapasitas untuk be fully seen dan still chosen',
      'Legacy yang dibangun bersama — finansial, keluarga, shared identity',
    ],
    red: [
      'Mengambil satu sama lain for granted karena merasa "sudah aman"',
      'Menghentikan growth individu karena merasa "sudah tiba"',
      'Emotional negligence kronis — hadir tapi tidak connecting',
    ],
    progress: [
      { label: 'Passion', val: 45, color: '#C94F7C' },
      { label: 'Intimacy', val: 90, color: '#7F77DD' },
      { label: 'Commitment', val: 88, color: '#1D9E75' },
    ],
    warning: {
      type: 'success',
      text: 'Penelitian Huston: pasangan yang bertahan jangka panjang adalah domestic partner + lovers + companions + supported by social network. Semua empat dimensi harus hidup.',
    },
  },
];

export const marriageSources =
  "Sources: The Female Brain & The Male Brain (Louann Brizendine) · The 5 Love Languages (Gary Chapman) · Emotional Intelligence (Daniel Goleman) · Social Psychology (Hogg & Vaughan) · Sternberg's Triangular Theory of Love · Duck's Relationship Dissolution Model";
