// Әкімші панелінің құрылымы.
// Each entry maps a path in the content object to a labelled form field.
// Adding a field here is all that is needed for it to appear in the panel.

const schema = [
  {
    title: 'Басты экран',
    fields: [
      { path: 'hero.titleLine1', label: 'Тақырып — 1-жол', type: 'text' },
      { path: 'hero.titleLine2', label: 'Тақырып — 2-жол', type: 'text' },
      { path: 'hero.subtitle', label: 'Қосымша жазу', type: 'text' },
    ],
  },
  {
    title: 'Мен туралы',
    fields: [
      { path: 'profile.eyebrow', label: 'Бөлім атауы', type: 'text' },
      { path: 'profile.photo', label: 'Сурет', type: 'image' },
      { path: 'profile.name', label: 'Аты-жөні', type: 'text' },
      { path: 'profile.credentials', label: 'Мамандығы', type: 'textarea' },
      {
        path: 'profile.stats',
        label: 'Көрсеткіштер',
        type: 'list',
        itemLabel: 'Көрсеткіш',
        max: 3,
        fields: [
          { key: 'value', label: 'Сан', type: 'text' },
          { key: 'label', label: 'Сипаттама', type: 'text' },
        ],
      },
      { path: 'profile.educationTitle', label: 'Білім — тақырып', type: 'text' },
      { path: 'profile.education', label: 'Білім — елдер', type: 'strings', itemLabel: 'Ел' },
    ],
  },
  {
    title: 'Бағдарлама кімге арналған',
    fields: [
      { path: 'audience.title', label: 'Тақырып', type: 'text' },
      { path: 'audience.subtitle', label: 'Қосымша жазу', type: 'textarea' },
      { path: 'audience.items', label: 'Тізім', type: 'strings', itemLabel: 'Жол' },
    ],
  },
  {
    title: 'Бағдарлама қалай жұмыс істейді',
    fields: [
      { path: 'howItWorks.title', label: 'Тақырып', type: 'text' },
      { path: 'howItWorks.partOne.title', label: '1-бөлім — тақырып', type: 'text' },
      { path: 'howItWorks.partOne.subtitle', label: '1-бөлім — сипаттама', type: 'text' },
      { path: 'howItWorks.partOne.intro', label: '1-бөлім — кіріспе', type: 'text' },
      {
        path: 'howItWorks.partOne.levels',
        label: 'Деңгейлер',
        type: 'list',
        itemLabel: 'Деңгей',
        fields: [
          { key: 'title', label: 'Атауы', type: 'text' },
          { key: 'note', label: 'Жақшадағы жазу', type: 'text' },
          { key: 'text', label: 'Сипаттама', type: 'textarea' },
        ],
      },
      { path: 'howItWorks.partOne.result', label: '1-бөлім — нәтиже', type: 'text' },
      { path: 'howItWorks.partTwo.title', label: '2-бөлім — тақырып', type: 'text' },
      { path: 'howItWorks.partTwo.subtitle', label: '2-бөлім — сипаттама', type: 'text' },
      { path: 'howItWorks.partTwo.intro', label: '2-бөлім — кіріспе', type: 'text' },
      { path: 'howItWorks.partTwo.items', label: '2-бөлім — тізім', type: 'strings', itemLabel: 'Жол' },
      { path: 'howItWorks.partTwo.result', label: '2-бөлім — нәтиже', type: 'text' },
    ],
  },
  {
    title: 'Жобалар',
    fields: [
      { path: 'projects.title', label: 'Тақырып', type: 'text' },
      {
        path: 'projects.items',
        label: 'Жобалар тізімі',
        type: 'list',
        itemLabel: 'Жоба',
        fields: [
          { key: 'name', label: 'Атауы', type: 'text' },
          { key: 'description', label: 'Сипаттама', type: 'textarea' },
          { key: 'logo', label: 'Логотип', type: 'image' },
          { key: 'emoji', label: 'Логотип орнына эмодзи', type: 'text' },
        ],
      },
      { path: 'projects.bottomMessage', label: 'Төмендегі жазу', type: 'textarea' },
    ],
  },
  {
    title: 'Бағдарлама туралы / Байланыс',
    fields: [
      { path: 'program.eyebrow', label: 'Бөлім атауы', type: 'text' },
      { path: 'program.title', label: 'Тақырып', type: 'text' },
      { path: 'program.subtitle', label: 'Қосымша жазу', type: 'textarea' },
      { path: 'program.formatLabel', label: 'Формат — атауы', type: 'text' },
      { path: 'program.formatValue', label: 'Формат — мәні', type: 'text' },
      { path: 'program.startLabel', label: 'Старт — атауы', type: 'text' },
      { path: 'program.startValue', label: 'Старт — мәні', type: 'text' },
      { path: 'program.priceLabel', label: 'Баға — атауы', type: 'text' },
      { path: 'program.priceValue', label: 'Баға — мәні', type: 'text' },
      { path: 'program.phoneDisplay', label: 'Көрінетін телефон нөмірі', type: 'text' },
      {
        path: 'program.whatsappNumber',
        label: 'WhatsApp нөмірі',
        type: 'text',
        hint: 'Тек сандар, «+» белгісіз. Мысалы: 77079562033',
      },
      { path: 'program.footnote', label: 'Түйме астындағы жазу', type: 'text' },
    ],
  },
  {
    title: 'Дипломдар',
    fields: [
      { path: 'diplomas.title', label: 'Тақырып', type: 'text' },
      {
        path: 'diplomas.items',
        label: 'Дипломдар',
        type: 'list',
        itemLabel: 'Диплом',
        fields: [
          { key: 'title', label: 'Атауы', type: 'text' },
          { key: 'src', label: 'Сурет', type: 'image' },
        ],
      },
      { path: 'diplomas.extraCardTitle', label: 'Соңғы карточка — тақырып', type: 'text' },
      { path: 'diplomas.extraCardSubtitle', label: 'Соңғы карточка — сипаттама', type: 'text' },
    ],
  },
  {
    title: 'Сертификаттар',
    fields: [
      { path: 'certificates.title', label: 'Тақырып', type: 'text' },
      {
        path: 'certificates.items',
        label: 'Сертификаттар',
        type: 'list',
        itemLabel: 'Сертификат',
        fields: [
          { key: 'title', label: 'Атауы', type: 'text' },
          { key: 'src', label: 'Сурет', type: 'image' },
        ],
      },
      { path: 'certificates.extraCardTitle', label: 'Соңғы карточка — тақырып', type: 'text' },
    ],
  },
];

export default schema;
