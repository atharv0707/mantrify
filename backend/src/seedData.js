// Seed content for Mantrify — see design/Mantrify-Design.md §9.1
//
// Each practice's `mantras` is an array of *sections*. A section has an optional `label`
// ("Opening Dohas", "Chaupais", ...), a `repetitionTarget` (for japa), and a list of `lines`.
// Every line carries its own `meaning` so the app can show/hide a per-line translation.

export const deities = [
  { id: 'shiva', name: 'Shiva', glyph: '🔱', glyphStyle: 'indigo' },
  { id: 'hanuman', name: 'Hanuman', glyph: '🪔', glyphStyle: 'rose' },
  { id: 'ganesha', name: 'Ganesha', glyph: '🐘', glyphStyle: 'default' },
  { id: 'lakshmi', name: 'Lakshmi', glyph: '🪷', glyphStyle: 'default' },
  { id: 'durga', name: 'Durga', glyph: '🔥', glyphStyle: 'rose' },
  { id: 'saraswati', name: 'Saraswati', glyph: '📖', glyphStyle: 'peacock' },
  { id: 'vishnu', name: 'Vishnu', glyph: '🌀', glyphStyle: 'peacock' },
];

export const practices = [
  // ---------------------------------------------------------------- mantras
  {
    id: 'om-namah-shivaya-japa',
    type: 'mantra',
    title: 'Om Namah Shivaya · Japa',
    deity: 'shiva',
    glyph: 'ॐ',
    glyphStyle: 'indigo',
    traditionTags: ['shaiva', 'universal'],
    regionTags: ['universal'],
    difficulty: 'beginner',
    estDurationMin: 6,
    summary: 'Mantra · 108 repetitions · ~6 min',
    why: 'One of the most beloved mantras to Shiva — the Panchakshara, or "five syllables". A simple, grounding chant said to quiet the mind. Perfect for a first daily practice.',
    occasions: [],
    calendarLinks: ['monday'],
    materials: ['A quiet space', 'A mala (optional)', 'A lamp (optional)'],
    mantras: [
      {
        repetitionTarget: 108,
        lines: [
          {
            devanagari: 'ॐ नमः शिवाय',
            transliteration: 'Oṃ Namaḥ Śivāya',
            meaning: 'I bow to Shiva — the auspicious one, the inner Self.',
          },
        ],
      },
    ],
    steps: [
      { order: 1, instruction: 'Sit comfortably facing east or north, with a calm, upright posture.', estSec: 30 },
      { order: 2, instruction: 'Take a few slow breaths and settle your attention.', estSec: 30 },
      { order: 3, instruction: 'Begin reciting the mantra, using the japa counter to track repetitions toward 108.', mantraRef: 0, estSec: 300 },
      { order: 4, instruction: 'Close with a moment of silence, offering the practice for the wellbeing of all.', estSec: 30 },
    ],
  },
  {
    id: 'gayatri-mantra',
    type: 'mantra',
    title: 'Gayatri Mantra',
    deity: 'saraswati',
    glyph: 'ॐ',
    glyphStyle: 'peacock',
    traditionTags: ['universal'],
    regionTags: ['universal'],
    difficulty: 'beginner',
    estDurationMin: 5,
    summary: 'Mantra · 3 or 108 repetitions · ~5 min',
    why: 'A Vedic mantra to Savitr (the sun as giver of life), invoking the light of wisdom and clarity. Traditionally recited at sunrise, noon and sunset.',
    occasions: [],
    calendarLinks: ['daily'],
    materials: ['A quiet space, ideally facing the rising sun'],
    mantras: [
      {
        repetitionTarget: 108,
        lines: [
          {
            devanagari: 'ॐ भूर्भुवः स्वः',
            transliteration: 'Oṃ bhūr bhuvaḥ svaḥ',
            meaning: 'Om — the earthly, the atmospheric and the heavenly realms.',
          },
          {
            devanagari: 'तत्सवितुर्वरेण्यं',
            transliteration: 'tat savitur vareṇyaṃ',
            meaning: 'That adorable light of the divine sun, Savitr,',
          },
          {
            devanagari: 'भर्गो देवस्य धीमहि',
            transliteration: 'bhargo devasya dhīmahi',
            meaning: 'on that radiant glory of the deity we meditate;',
          },
          {
            devanagari: 'धियो यो नः प्रचोदयात्',
            transliteration: 'dhiyo yo naḥ prachodayāt',
            meaning: 'may it inspire and illuminate our understanding.',
          },
        ],
      },
    ],
    steps: [
      { order: 1, instruction: 'Sit facing the rising sun if possible, and settle into a calm posture.', estSec: 20 },
      { order: 2, instruction: 'Recite the mantra slowly, at least 3 times, or work toward 108 with the japa counter.', mantraRef: 0, estSec: 240 },
      { order: 3, instruction: 'Sit quietly for a moment before continuing your day.', estSec: 20 },
    ],
  },
  {
    id: 'maha-mrityunjaya',
    type: 'mantra',
    title: 'Maha Mrityunjaya Mantra',
    deity: 'shiva',
    glyph: 'ॐ',
    glyphStyle: 'indigo',
    traditionTags: ['shaiva', 'universal'],
    regionTags: ['universal'],
    difficulty: 'intermediate',
    estDurationMin: 10,
    summary: 'Mantra · 108 repetitions · ~10 min',
    why: 'The "great death-conquering" mantra to Shiva (Tryambaka), recited for healing, protection and recovery — for oneself or someone unwell.',
    occasions: ['health', 'recovery'],
    calendarLinks: ['monday'],
    materials: ['A quiet space', 'A mala (optional)'],
    mantras: [
      {
        repetitionTarget: 108,
        lines: [
          {
            devanagari: 'ॐ त्र्यम्बकं यजामहे',
            transliteration: 'Oṃ tryambakaṃ yajāmahe',
            meaning: 'We worship the three-eyed one (Shiva),',
          },
          {
            devanagari: 'सुगन्धिं पुष्टिवर्धनम्',
            transliteration: 'sugandhiṃ puṣṭi-vardhanam',
            meaning: 'the fragrant one who nourishes and sustains all beings.',
          },
          {
            devanagari: 'उर्वारुकमिव बन्धनान्',
            transliteration: 'urvārukam-iva bandhanān',
            meaning: 'As a ripe cucumber is freed from its binding stem,',
          },
          {
            devanagari: 'मृत्योर्मुक्षीय माऽमृतात्',
            transliteration: 'mṛtyor-mukṣīya mā’mṛtāt',
            meaning: 'may we be released from death — but not from immortality.',
          },
        ],
      },
    ],
    steps: [
      { order: 1, instruction: 'Sit calmly and bring to mind the person (or yourself) the practice is for.', estSec: 30 },
      { order: 2, instruction: 'Recite the mantra slowly, working toward 108 repetitions with the japa counter.', mantraRef: 0, estSec: 540 },
      { order: 3, instruction: 'Close with a wish for healing and wellbeing for all beings.', estSec: 30 },
    ],
  },
  {
    id: 'ganesha-mantra',
    type: 'mantra',
    title: 'Vakratunda Mahakaya',
    deity: 'ganesha',
    glyph: 'ॐ',
    glyphStyle: 'default',
    traditionTags: ['universal'],
    regionTags: ['universal'],
    difficulty: 'beginner',
    estDurationMin: 4,
    summary: 'Shloka · invoked before any beginning · ~4 min',
    why: 'The most popular invocation to Ganesha, recited before starting any task, journey or ceremony to clear obstacles from the path ahead.',
    occasions: ['new-beginning'],
    calendarLinks: ['wednesday'],
    materials: ['A quiet space'],
    mantras: [
      {
        repetitionTarget: 11,
        lines: [
          {
            devanagari: 'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।',
            transliteration: 'Vakratuṇḍa mahākāya sūryakoṭi samaprabha,',
            meaning: 'O curved-trunk, great-bodied one, radiant as a million suns,',
          },
          {
            devanagari: 'निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥',
            transliteration: 'nirvighnaṃ kuru me deva sarvakāryeṣu sarvadā.',
            meaning: 'make my every undertaking free of obstacles, always, O Lord.',
          },
        ],
      },
    ],
    steps: [
      { order: 1, instruction: 'Pause before beginning your task and settle your breath.', estSec: 30 },
      { order: 2, instruction: 'Recite the shloka, ideally 3 or 11 times, asking for a clear path.', mantraRef: 0, estSec: 180 },
      { order: 3, instruction: 'Begin your work with a calm, focused mind.', estSec: 30 },
    ],
  },
  {
    id: 'saraswati-vandana',
    type: 'mantra',
    title: 'Saraswati Vandana',
    deity: 'saraswati',
    glyph: '📖',
    glyphStyle: 'peacock',
    traditionTags: ['universal'],
    regionTags: ['universal'],
    difficulty: 'beginner',
    estDurationMin: 4,
    summary: 'Shloka · for study & learning · ~4 min',
    why: 'A prayer to Saraswati, goddess of knowledge, music and the arts — recited before study, exams or any creative work.',
    occasions: ['exams', 'starting-studies'],
    calendarLinks: [],
    materials: ['A quiet space', 'Books or instrument (optional)'],
    mantras: [
      {
        repetitionTarget: null,
        lines: [
          {
            devanagari: 'या कुन्देन्दु तुषार हार धवला या शुभ्र वस्त्रावृता।',
            transliteration: 'Yā kundendu tuṣāra hāra dhavalā yā śubhra vastrāvṛtā,',
            meaning: 'She who is white as jasmine, the moon and snow, robed in spotless white,',
          },
          {
            devanagari: 'या वीणावरदण्डमण्डितकरा या श्वेतपद्मासना।',
            transliteration: 'yā vīṇā-vara-daṇḍa-maṇḍita-karā yā śveta-padmāsanā,',
            meaning: 'whose hands are graced with the veena, and who is seated on a white lotus,',
          },
          {
            devanagari: 'या ब्रह्माच्युत शंकर प्रभृतिभिर्देवैः सदा वन्दिता।',
            transliteration: 'yā brahmācyuta śaṅkara prabhṛtibhir devaiḥ sadā vanditā,',
            meaning: 'she who is ever revered by Brahma, Vishnu, Shiva and all the gods,',
          },
          {
            devanagari: 'सा मां पातु सरस्वती भगवती निःशेष जाड्यापहा॥',
            transliteration: 'sā māṃ pātu sarasvatī bhagavatī niḥśeṣa jāḍyāpahā.',
            meaning: 'may that goddess Saraswati, remover of all dullness, protect me.',
          },
        ],
      },
    ],
    steps: [
      { order: 1, instruction: 'Light a lamp before an image of Saraswati and offer flowers.', estSec: 60 },
      { order: 2, instruction: 'Recite the vandana, asking for clarity and focus.', mantraRef: 0, estSec: 120 },
      { order: 3, instruction: 'Place your books or instrument before the image briefly before you begin.', estSec: 60 },
    ],
  },
  {
    id: 'shanti-mantra',
    type: 'mantra',
    title: 'Sarve Bhavantu Sukhinah',
    deity: 'vishnu',
    glyph: 'ॐ',
    glyphStyle: 'peacock',
    traditionTags: ['universal'],
    regionTags: ['universal'],
    difficulty: 'beginner',
    estDurationMin: 3,
    summary: 'Shanti mantra · a prayer for all · ~3 min',
    why: 'A universal peace prayer wishing happiness, health and freedom from suffering for all beings — often used to close a practice or gathering.',
    occasions: [],
    calendarLinks: ['daily'],
    materials: ['A quiet space'],
    mantras: [
      {
        repetitionTarget: null,
        lines: [
          {
            devanagari: 'ॐ सर्वे भवन्तु सुखिनः।',
            transliteration: 'Oṃ sarve bhavantu sukhinaḥ,',
            meaning: 'May all beings be happy.',
          },
          {
            devanagari: 'सर्वे सन्तु निरामयाः।',
            transliteration: 'sarve santu nirāmayāḥ,',
            meaning: 'May all be free from illness.',
          },
          {
            devanagari: 'सर्वे भद्राणि पश्यन्तु।',
            transliteration: 'sarve bhadrāṇi paśyantu,',
            meaning: 'May all see what is good and auspicious.',
          },
          {
            devanagari: 'मा कश्चिद् दुःख भाग्भवेत्॥',
            transliteration: 'mā kaścid duḥkha bhāg-bhavet.',
            meaning: 'May no one suffer. Om, peace, peace, peace.',
          },
        ],
      },
    ],
    steps: [
      { order: 1, instruction: 'Sit quietly and bring to mind the wish for the wellbeing of all.', estSec: 30 },
      { order: 2, instruction: 'Recite the mantra slowly, three times.', mantraRef: 0, estSec: 120 },
      { order: 3, instruction: 'Rest in the feeling of goodwill for a moment.', estSec: 30 },
    ],
  },

  // ---------------------------------------------------------------- aartis
  {
    id: 'shiva-aarti',
    type: 'aarti',
    title: 'Om Jai Shiv Omkara',
    deity: 'shiva',
    glyph: '🪔',
    glyphStyle: 'default',
    traditionTags: ['shaiva'],
    regionTags: ['north'],
    difficulty: 'beginner',
    estDurationMin: 6,
    summary: 'Aarti · 7 verses · ~6 min',
    why: 'The aarti of light offered to Shiva at the close of worship — a gesture of devotion and gratitude, sung while circling a lamp before the deity.',
    occasions: [],
    calendarLinks: ['monday'],
    materials: ['A diya (lamp)', 'Ghee or oil', 'A small plate'],
    mantras: [
      {
        label: 'Refrain',
        repetitionTarget: null,
        lines: [
          {
            devanagari: 'ॐ जय शिव ओंकारा, स्वामी जय शिव ओंकारा।\nब्रह्मा विष्णु सदाशिव, अर्द्धांगी धारा॥',
            transliteration: 'Oṃ jaya Śiva oṃkārā, svāmī jaya Śiva oṃkārā,\nBrahmā Viṣṇu Sadāśiva, ardhāṅgī dhārā.',
            meaning: 'Victory to you, Shiva, the cosmic Om; Brahma, Vishnu and Shiva, with the Goddess as your half.',
          },
        ],
      },
      {
        label: 'Verses',
        repetitionTarget: null,
        lines: [
          {
            devanagari: 'एकानन चतुरानन पंचानन राजे।\nहंसासन गरुड़ासन वृषवाहन साजे॥',
            transliteration: 'Ekānana caturānana pañcānana rāje,\nhaṃsāsana garuḍāsana vṛṣavāhana sāje.',
            meaning: 'One-faced, four-faced and five-faced you shine — on swan, eagle and bull as mounts you are adorned.',
          },
          {
            devanagari: 'दो भुज चार चतुर्भुज दशभुज अति सोहे।\nत्रिगुण रूप निरखता त्रिभुवन जन मोहे॥',
            transliteration: 'Do bhuja cāra caturbhuja daśabhuja ati sohe,\ntriguṇa rūpa nirakhatā tribhuvana jana mohe.',
            meaning: 'With two, four or ten arms you appear most beautiful; beholding your three-fold form, all three worlds are enchanted.',
          },
          {
            devanagari: 'अक्षमाला वनमाला मुण्डमाला धारी।\nत्रिपुरारी कंसारी कर माला धारी॥',
            transliteration: 'Akṣamālā vanamālā muṇḍamālā dhārī,\ntripurārī kaṃsārī kara mālā dhārī.',
            meaning: 'Wearing garlands of beads, forest flowers and skulls, O slayer of Tripura, you hold the rosary in your hand.',
          },
          {
            devanagari: 'श्वेताम्बर पीताम्बर बाघम्बर अंगे।\nसनकादिक गरुणादिक भूतादिक संगे॥',
            transliteration: 'Śvetāmbara pītāmbara bāghāmbara aṅge,\nsanakādika garuṇādika bhūtādika saṅge.',
            meaning: 'Clad in white, in yellow, and in tiger-skin, attended by the sages, by Garuda and by your spirit-hosts.',
          },
          {
            devanagari: 'कर के मध्य कमण्डल चक्र त्रिशूलधारी।\nसुखकारी दुखहारी जगपालन कारी॥',
            transliteration: 'Kara ke madhya kamaṇḍala cakra triśūladhārī,\nsukhakārī dukhahārī jagapālana kārī.',
            meaning: 'Holding the water-pot, discus and trident, you give joy, remove sorrow, and sustain the world.',
          },
          {
            devanagari: 'ब्रह्मा विष्णु सदाशिव जानत अविवेका।\nप्रणवाक्षर के मध्ये ये तीनों एका॥',
            transliteration: 'Brahmā Viṣṇu Sadāśiva jānata avivekā,\npraṇavākṣara ke madhye ye tīnoṃ ekā.',
            meaning: 'Only the unwise see Brahma, Vishnu and Shiva as separate — within the syllable Om these three are one.',
          },
          {
            devanagari: 'त्रिगुण स्वामी की आरती जो कोई नर गावे।\nकहत शिवानन्द स्वामी सुख सम्पति पावे॥',
            transliteration: 'Triguṇa svāmī kī āratī jo koī nara gāve,\nkahata Śivānanda svāmī sukha sampati pāve.',
            meaning: 'Whoever sings this aarti to the Lord of the three qualities, says Shivananda, gains happiness and abundance.',
          },
        ],
      },
    ],
    steps: [
      { order: 1, instruction: 'Light the lamp and hold it gently in your right hand.', estSec: 20 },
      { order: 2, instruction: 'Sing the refrain, then each verse, moving the lamp in slow clockwise circles before the image of Shiva.', mantraRef: 0, estSec: 300 },
      { order: 3, instruction: 'Return to the refrain to close, then offer the light to your forehead and bow.', estSec: 40 },
    ],
  },
  {
    id: 'ganesh-aarti',
    type: 'aarti',
    title: 'Jai Ganesh Deva',
    deity: 'ganesha',
    glyph: '🪔',
    glyphStyle: 'default',
    traditionTags: ['universal'],
    regionTags: ['universal'],
    difficulty: 'beginner',
    estDurationMin: 4,
    summary: 'Aarti · 4 verses · ~4 min',
    why: 'The beloved aarti to Ganesha, sung at the start of worship and on Ganesh Chaturthi, invoking the remover of obstacles.',
    occasions: ['new-beginning'],
    calendarLinks: ['wednesday'],
    materials: ['A diya (lamp)', 'Modak or sweets (optional)'],
    mantras: [
      {
        label: 'Refrain',
        repetitionTarget: null,
        lines: [
          {
            devanagari: 'जय गणेश जय गणेश, जय गणेश देवा।\nमाता जाकी पार्वती, पिता महादेवा॥',
            transliteration: 'Jaya Gaṇeśa jaya Gaṇeśa, jaya Gaṇeśa devā,\nmātā jākī Pārvatī, pitā Mahādevā.',
            meaning: 'Victory to Ganesha! whose mother is Parvati and whose father is Mahadeva (Shiva).',
          },
        ],
      },
      {
        label: 'Verses',
        repetitionTarget: null,
        lines: [
          {
            devanagari: 'एक दन्त दयावन्त, चार भुजा धारी।\nमाथे सिंदूर सोहे, मूसे की सवारी॥',
            transliteration: 'Eka danta dayāvanta, cāra bhujā dhārī,\nmāthe sindūra sohe, mūse kī savārī.',
            meaning: 'Single-tusked and compassionate, bearing four arms; vermilion shines on your brow, and the mouse is your mount.',
          },
          {
            devanagari: 'पान चढ़े फूल चढ़े, और चढ़े मेवा।\nलड्डुअन का भोग लगे, संत करें सेवा॥',
            transliteration: 'Pāna caṛhe phūla caṛhe, aura caṛhe mevā,\nladduana kā bhoga lage, santa kareṃ sevā.',
            meaning: 'Betel leaves, flowers and dried fruits are offered; laddus are placed before you, and the devout do you service.',
          },
          {
            devanagari: 'अंधन को आँख देत, कोढ़िन को काया।\nबाँझन को पुत्र देत, निर्धन को माया॥',
            transliteration: 'Andhana ko āṅkha deta, koṛhina ko kāyā,\nbāṅjhana ko putra deta, nirdhana ko māyā.',
            meaning: 'You give sight to the blind, a whole body to the afflicted, a child to the childless, and means to the poor.',
          },
          {
            devanagari: 'सूर श्याम शरण आए, सफल कीजे सेवा।\nमाता जाकी पार्वती, पिता महादेवा॥',
            transliteration: 'Sūra Śyāma śaraṇa āe, saphala kīje sevā,\nmātā jākī Pārvatī, pitā Mahādevā.',
            meaning: 'Your devotees come to your refuge — let their service bear fruit; whose mother is Parvati and father Mahadeva.',
          },
        ],
      },
    ],
    steps: [
      { order: 1, instruction: 'Light the lamp before an image of Ganesha.', estSec: 20 },
      { order: 2, instruction: 'Sing the refrain and verses, circling the lamp slowly before the deity.', mantraRef: 0, estSec: 200 },
      { order: 3, instruction: 'Offer the light to your forehead, bow, and share the prasad.', estSec: 30 },
    ],
  },
  {
    id: 'lakshmi-aarti',
    type: 'aarti',
    title: 'Om Jai Lakshmi Mata',
    deity: 'lakshmi',
    glyph: '🪔',
    glyphStyle: 'default',
    traditionTags: ['vaishnava', 'universal'],
    regionTags: ['universal'],
    difficulty: 'beginner',
    estDurationMin: 6,
    summary: 'Aarti · 7 verses · ~6 min',
    why: 'The aarti to Lakshmi, goddess of wealth and wellbeing, sung especially on Fridays and at Diwali to invite abundance into the home.',
    occasions: ['diwali'],
    calendarLinks: ['friday'],
    materials: ['A diya (lamp)', 'Flowers', 'Sweets (optional)'],
    mantras: [
      {
        label: 'Refrain',
        repetitionTarget: null,
        lines: [
          {
            devanagari: 'ॐ जय लक्ष्मी माता, मैया जय लक्ष्मी माता।\nतुमको निशिदिन सेवत, हरि विष्णु धाता॥',
            transliteration: 'Oṃ jaya Lakṣmī mātā, maiyā jaya Lakṣmī mātā,\ntumako niśidina sevata, Hari Viṣṇu dhātā.',
            meaning: 'Victory to you, Mother Lakshmi; Vishnu the sustainer serves you day and night.',
          },
        ],
      },
      {
        label: 'Verses',
        repetitionTarget: null,
        lines: [
          {
            devanagari: 'उमा रमा ब्रह्माणी, तुम ही जग माता।\nसूर्य चंद्रमा ध्यावत, नारद ऋषि गाता॥',
            transliteration: 'Umā Ramā Brahmāṇī, tuma hī jaga mātā,\nsūrya candramā dhyāvata, Nārada ṛṣi gātā.',
            meaning: 'As Uma, Rama and Brahmani you are the mother of the world; sun and moon meditate on you, and sage Narada sings your praise.',
          },
          {
            devanagari: 'दुर्गा रूप निरंजनि, सुख सम्पत्ति दाता।\nजो कोई तुमको ध्यावत, ऋद्धि सिद्धि धन पाता॥',
            transliteration: 'Durgā rūpa niraṃjani, sukha sampatti dātā,\njo koī tumako dhyāvata, ṛddhi siddhi dhana pātā.',
            meaning: 'O spotless one, in the form of Durga, giver of joy and fortune; whoever meditates on you gains prosperity, attainment and wealth.',
          },
          {
            devanagari: 'तुम पाताल निवासिनि, तुम ही शुभदाता।\nकर्म प्रभाव प्रकाशिनि, भवनिधि की त्राता॥',
            transliteration: 'Tuma pātāla nivāsini, tuma hī śubhadātā,\nkarma prabhāva prakāśini, bhavanidhi kī trātā.',
            meaning: 'You dwell in the depths and are the giver of all good; you reveal the fruits of action and ferry us across the ocean of existence.',
          },
          {
            devanagari: 'जिस घर तुम रहती हो, ताहि में गुण आता।\nसब सम्भव हो जाता, मन नहीं घबराता॥',
            transliteration: 'Jisa ghara tuma rahatī ho, tāhi meṃ guṇa ātā,\nsaba sambhava ho jātā, mana nahīṃ ghabarātā.',
            meaning: 'The home where you dwell is filled with virtue; all becomes possible there, and the mind is never troubled.',
          },
          {
            devanagari: 'तुम बिन यज्ञ न होते, वस्त्र न हो पाता।\nखान पान का वैभव, सब तुमसे आता॥',
            transliteration: 'Tuma bina yajña na hote, vastra na ho pātā,\nkhāna pāna kā vaibhava, saba tumase ātā.',
            meaning: 'Without you no sacrifice is complete, nor is clothing obtained; the bounty of food and drink all comes from you.',
          },
          {
            devanagari: 'शुभ गुण मंदिर सुंदर, क्षीरोदधि जाता।\nरत्न चतुर्दश तुम बिन, कोई नहीं पाता॥',
            transliteration: 'Śubha guṇa mandira sundara, kṣīrodadhi jātā,\nratna caturdaśa tuma bina, koī nahīṃ pātā.',
            meaning: 'Beautiful temple of all good qualities, born of the ocean of milk; without you none can obtain its fourteen jewels.',
          },
          {
            devanagari: 'महालक्ष्मीजी की आरती, जो कोई नर गाता।\nउर आनंद समाता, पाप उतर जाता॥',
            transliteration: 'Mahālakṣmījī kī āratī, jo koī nara gātā,\nura ānanda samātā, pāpa utara jātā.',
            meaning: 'Whoever sings this aarti to Mahalakshmi, their heart fills with joy and their wrongs fall away.',
          },
        ],
      },
    ],
    steps: [
      { order: 1, instruction: 'Light the lamp before an image of Lakshmi and offer flowers.', estSec: 20 },
      { order: 2, instruction: 'Sing the refrain and verses, circling the lamp slowly before the deity.', mantraRef: 0, estSec: 300 },
      { order: 3, instruction: 'Offer the light to your forehead, bow, and share the prasad.', estSec: 40 },
    ],
  },
  {
    id: 'durga-aarti',
    type: 'aarti',
    title: 'Jai Ambe Gauri',
    deity: 'durga',
    glyph: '🪔',
    glyphStyle: 'rose',
    traditionTags: ['shakta'],
    regionTags: ['universal'],
    difficulty: 'beginner',
    estDurationMin: 7,
    summary: 'Aarti · 8 verses · ~7 min',
    why: 'The aarti to the Divine Mother, sung during Navratri and Durga Puja, praising her many forms and her victory over the demons.',
    occasions: ['navratri'],
    calendarLinks: ['tuesday', 'friday'],
    materials: ['A diya (lamp)', 'Red flowers', 'A small plate'],
    mantras: [
      {
        label: 'Refrain',
        repetitionTarget: null,
        lines: [
          {
            devanagari: 'जय अम्बे गौरी, मैया जय श्यामा गौरी।\nतुमको निशिदिन ध्यावत, हरि ब्रह्मा शिवरी॥',
            transliteration: 'Jaya Ambe Gaurī, maiyā jaya Śyāmā Gaurī,\ntumako niśidina dhyāvata, Hari Brahmā Śivarī.',
            meaning: 'Victory to you, Mother Ambe; Vishnu, Brahma and Shiva meditate on you day and night.',
          },
        ],
      },
      {
        label: 'Verses',
        repetitionTarget: null,
        lines: [
          {
            devanagari: 'माँग सिंदूर विराजत, टीको मृगमद को।\nउज्ज्वल से दोउ नैना, चंद्रवदन नीको॥',
            transliteration: 'Māṅga sindūra virājata, ṭīko mṛgamada ko,\nujjvala se dou nainā, candravadana nīko.',
            meaning: 'Vermilion graces your parting and a musk mark your brow; both your eyes are radiant, your face fair as the moon.',
          },
          {
            devanagari: 'कनक समान कलेवर, रक्ताम्बर राजै।\nरक्तपुष्प गल माला, कंठन पर साजै॥',
            transliteration: 'Kanaka samāna kalevara, raktāmbara rājai,\nraktapuṣpa gala mālā, kaṇṭhana para sājai.',
            meaning: 'Your form shines like gold, robed in red; a garland of red flowers adorns your throat.',
          },
          {
            devanagari: 'केहरि वाहन राजत, खड्ग खप्पर धारी।\nसुर-नर-मुनि-जन सेवत, तिनके दुखहारी॥',
            transliteration: 'Kehari vāhana rājata, khaḍga khappara dhārī,\nsura-nara-muni-jana sevata, tinake dukhahārī.',
            meaning: 'Riding your lion, bearing sword and skull-bowl; gods, humans and sages serve you, and you take away their sorrow.',
          },
          {
            devanagari: 'कानन कुण्डल शोभित, नासाग्रे मोती।\nकोटिक चंद्र दिवाकर, सम राजत ज्योती॥',
            transliteration: 'Kānana kuṇḍala śobhita, nāsāgre motī,\nkoṭika candra divākara, sama rājata jyotī.',
            meaning: 'Earrings adorn your ears and a pearl your nose; your light shines like millions of moons and suns.',
          },
          {
            devanagari: 'शुम्भ निशुम्भ बिदारे, महिषासुर घाती।\nधूम्र विलोचन नैना, निशिदिन मदमाती॥',
            transliteration: 'Śumbha niśumbha bidāre, mahiṣāsura ghātī,\ndhūmra vilocana nainā, niśidina madamātī.',
            meaning: 'Slayer of Shumbha and Nishumbha and of Mahishasura; with smoke-coloured eyes you are ever exultant.',
          },
          {
            devanagari: 'चण्ड मुण्ड संहारे, शोणित बीज हरे।\nमधु कैटभ दोउ मारे, सुर भयहीन करे॥',
            transliteration: 'Caṇḍa muṇḍa saṃhāre, śoṇita bīja hare,\nmadhu kaiṭabha dou māre, sura bhayahīna kare.',
            meaning: 'You destroyed Chanda and Munda and Raktabija; you slew the demons Madhu and Kaitabha, freeing the gods from fear.',
          },
          {
            devanagari: 'ब्रह्माणी रुद्राणी, तुम कमला रानी।\nआगम निगम बखानी, तुम शिव पटरानी॥',
            transliteration: 'Brahmāṇī rudrāṇī, tuma kamalā rānī,\nāgama nigama bakhānī, tuma Śiva paṭarānī.',
            meaning: 'As Brahmani, Rudrani and Lakshmi you reign; the scriptures extol you as the consort of Shiva.',
          },
          {
            devanagari: 'श्री अम्बेजी की आरती, जो कोई नर गावे।\nकहत शिवानन्द स्वामी, सुख सम्पत्ति पावे॥',
            transliteration: 'Śrī Ambejī kī āratī, jo koī nara gāve,\nkahata Śivānanda svāmī, sukha sampatti pāve.',
            meaning: 'Whoever sings this aarti to Mother Ambe, says Shivananda, gains happiness and abundance.',
          },
        ],
      },
    ],
    steps: [
      { order: 1, instruction: 'Light the lamp before an image of Durga and offer red flowers.', estSec: 20 },
      { order: 2, instruction: 'Sing the refrain and verses, circling the lamp slowly before the deity.', mantraRef: 0, estSec: 360 },
      { order: 3, instruction: 'Offer the light to your forehead, bow, and share the prasad.', estSec: 40 },
    ],
  },

  // ---------------------------------------------------------------- chalisas
  {
    id: 'hanuman-chalisa',
    type: 'chalisa',
    title: 'Hanuman Chalisa',
    deity: 'hanuman',
    glyph: '📿',
    glyphStyle: 'rose',
    traditionTags: ['vaishnava', 'universal'],
    regionTags: ['universal'],
    difficulty: 'intermediate',
    estDurationMin: 12,
    summary: 'Chalisa · 40 verses · ~12 min',
    why: 'Tulsidas’s devotional hymn of forty verses to Hanuman, recited for strength, courage and protection — especially loved on Tuesdays and Saturdays.',
    occasions: [],
    calendarLinks: ['tuesday', 'saturday'],
    materials: ['A quiet space', 'An image of Hanuman (optional)'],
    mantras: [
      {
        label: 'Opening Dohas',
        repetitionTarget: null,
        lines: [
          {
            devanagari: 'श्रीगुरु चरन सरोज रज, निज मनु मुकुरु सुधारि।\nबरनउँ रघुबर बिमल जसु, जो दायकु फल चारि॥',
            transliteration: 'Śrīguru carana saroja raja, nija manu mukuru sudhāri,\nbaranau Raghubara bimala jasu, jo dāyaku phala cāri.',
            meaning: 'Cleansing the mirror of my mind with the dust of my Guru’s lotus feet, I sing the pure glory of Rama, giver of life’s four fruits.',
          },
          {
            devanagari: 'बुद्धिहीन तनु जानिके, सुमिरौं पवन कुमार।\nबल बुधि बिद्या देहु मोहिं, हरहु कलेस बिकार॥',
            transliteration: 'Buddhihīna tanu jānike, sumirau pavana kumāra,\nbala budhi bidyā dehu mohi, harahu kalesa bikāra.',
            meaning: 'Knowing myself to be without wit, I call on the Son of the Wind: grant me strength, intelligence and knowledge, and remove my faults and sorrows.',
          },
        ],
      },
      {
        label: 'Chaupais',
        repetitionTarget: null,
        lines: [
          { devanagari: 'जय हनुमान ज्ञान गुन सागर।\nजय कपीस तिहुँ लोक उजागर॥', transliteration: 'Jaya Hanumāna jñāna guna sāgara,\njaya kapīsa tihu loka ujāgara.', meaning: 'Victory to Hanuman, ocean of wisdom and virtue; victory to the lord of monkeys, illumining all three worlds.' },
          { devanagari: 'राम दूत अतुलित बल धामा।\nअंजनि पुत्र पवनसुत नामा॥', transliteration: 'Rāma dūta atulita bala dhāmā,\nañjani putra pavanasuta nāmā.', meaning: 'Messenger of Rama, abode of matchless strength; son of Anjani, known as the Son of the Wind.' },
          { devanagari: 'महावीर विक्रम बजरंगी।\nकुमति निवार सुमति के संगी॥', transliteration: 'Mahāvīra vikrama bajaraṅgī,\nkumati nivāra sumati ke saṅgī.', meaning: 'Great hero, valiant, with a body strong as a thunderbolt; you dispel ill thoughts and befriend good sense.' },
          { devanagari: 'कंचन बरन बिराज सुबेसा।\nकानन कुंडल कुंचित केसा॥', transliteration: 'Kañcana barana birāja subesā,\nkānana kuṇḍala kuñcita kesā.', meaning: 'Golden of hue and beautifully adorned, with rings in your ears and curly hair.' },
          { devanagari: 'हाथ बज्र औ ध्वजा बिराजै।\nकाँधे मूँज जनेऊ साजै॥', transliteration: 'Hātha bajra au dhvajā birājai,\nkāndhe mūnja janeū sājai.', meaning: 'In your hands shine the mace and the banner; across your shoulder the sacred thread is worn.' },
          { devanagari: 'संकर सुवन केसरी नंदन।\nतेज प्रताप महा जग बंदन॥', transliteration: 'Saṅkara suvana kesarī nandana,\nteja pratāpa mahā jaga bandana.', meaning: 'Born of Shiva’s essence, joy of Kesari; your splendour and might are revered by the whole world.' },
          { devanagari: 'विद्यावान गुनी अति चातुर।\nराम काज करिबे को आतुर॥', transliteration: 'Vidyāvāna gunī ati cātura,\nRāma kāja karibe ko ātura.', meaning: 'Learned, virtuous and exceedingly clever, ever eager to do the work of Rama.' },
          { devanagari: 'प्रभु चरित्र सुनिबे को रसिया।\nराम लखन सीता मन बसिया॥', transliteration: 'Prabhu caritra sunibe ko rasiyā,\nRāma Lakhana Sītā mana basiyā.', meaning: 'You delight in hearing the Lord’s deeds; Rama, Lakshmana and Sita dwell within your heart.' },
          { devanagari: 'सूक्ष्म रूप धरि सियहिं दिखावा।\nबिकट रूप धरि लंक जरावा॥', transliteration: 'Sūkṣma rūpa dhari siyahi dikhāvā,\nbikaṭa rūpa dhari Laṅka jarāvā.', meaning: 'Taking a tiny form you appeared before Sita; taking a fearsome form you burned Lanka.' },
          { devanagari: 'भीम रूप धरि असुर सँहारे।\nरामचंद्र के काज सँवारे॥', transliteration: 'Bhīma rūpa dhari asura sanhāre,\nRāmacandra ke kāja sanvāre.', meaning: 'In a mighty form you destroyed the demons and accomplished the tasks of Ramachandra.' },
          { devanagari: 'लाय सजीवन लखन जियाये।\nश्रीरघुबीर हरषि उर लाये॥', transliteration: 'Lāya sajīvana Lakhana jiyāye,\nŚrīraghubīra haraṣi ura lāye.', meaning: 'You brought the life-giving herb and revived Lakshmana; joyfully Rama held you to his heart.' },
          { devanagari: 'रघुपति कीन्ही बहुत बड़ाई।\nतुम मम प्रिय भरतहि सम भाई॥', transliteration: 'Raghupati kīnhī bahuta baṛāī,\ntuma mama priya Bharatahi sama bhāī.', meaning: 'Rama praised you greatly, saying: you are as dear to me as my brother Bharata.' },
          { devanagari: 'सहस बदन तुम्हरो जस गावैं।\nअस कहि श्रीपति कंठ लगावैं॥', transliteration: 'Sahasa badana tumharo jasa gāvai,\nasa kahi Śrīpati kaṇṭha lagāvai.', meaning: 'The thousand-mouthed serpent sings your fame; so saying, the Lord embraced you.' },
          { devanagari: 'सनकादिक ब्रह्मादि मुनीसा।\nनारद सारद सहित अहीसा॥', transliteration: 'Sanakādika Brahmādi munīsā,\nNārada Sārada sahita ahīsā.', meaning: 'Sanaka and the sages, Brahma and the great seers, Narada, Saraswati and the serpent-king —' },
          { devanagari: 'जम कुबेर दिगपाल जहाँ ते।\nकबि कोबिद कहि सके कहाँ ते॥', transliteration: 'Jama Kubera digapāla jahā te,\nkabi kobida kahi sake kahā te.', meaning: 'Yama, Kubera and the guardians of the directions — how then can poets and scholars fully describe your glory?' },
          { devanagari: 'तुम उपकार सुग्रीवहिं कीन्हा।\nराम मिलाय राज पद दीन्हा॥', transliteration: 'Tuma upakāra Sugrīvahi kīnhā,\nRāma milāya rāja pada dīnhā.', meaning: 'You did Sugriva a great kindness, uniting him with Rama and restoring his kingdom.' },
          { devanagari: 'तुम्हरो मंत्र बिभीषन माना।\nलंकेस्वर भए सब जग जाना॥', transliteration: 'Tumharo mantra Bibhīṣana mānā,\nLaṅkeśvara bhae saba jaga jānā.', meaning: 'Vibhishana heeded your counsel and became lord of Lanka, as all the world knows.' },
          { devanagari: 'जुग सहस्र जोजन पर भानू।\nलील्यो ताहि मधुर फल जानू॥', transliteration: 'Juga sahasra jojana para bhānū,\nlīlyo tāhi madhura phala jānū.', meaning: 'The sun, thousands of leagues away, you swallowed thinking it a sweet fruit.' },
          { devanagari: 'प्रभु मुद्रिका मेलि मुख माहीं।\nजलधि लाँघि गये अचरज नाहीं॥', transliteration: 'Prabhu mudrikā meli mukha māhī,\njaladhi lāṅghi gaye acaraja nāhī.', meaning: 'Holding the Lord’s ring in your mouth, you leapt across the ocean — no wonder at all.' },
          { devanagari: 'दुर्गम काज जगत के जेते।\nसुगम अनुग्रह तुम्हरे तेते॥', transliteration: 'Durgama kāja jagata ke jete,\nsugama anugraha tumhare tete.', meaning: 'However hard the tasks of this world, by your grace they all become easy.' },
          { devanagari: 'राम दुआरे तुम रखवारे।\nहोत न आज्ञा बिनु पैसारे॥', transliteration: 'Rāma duāre tuma rakhavāre,\nhota na ājñā binu paisāre.', meaning: 'You are the guardian at Rama’s door; none may enter without your leave.' },
          { devanagari: 'सब सुख लहै तुम्हारी सरना।\nतुम रच्छक काहू को डर ना॥', transliteration: 'Saba sukha lahai tumhārī saranā,\ntuma racchaka kāhū ko ḍara nā.', meaning: 'All joys are found in your shelter; with you as protector there is nothing to fear.' },
          { devanagari: 'आपन तेज सम्हारो आपै।\nतीनों लोक हाँक तें काँपै॥', transliteration: 'Āpana teja samhāro āpai,\ntīnoṃ loka hāka te kāpai.', meaning: 'You alone can contain your own power; at your roar the three worlds tremble.' },
          { devanagari: 'भूत पिसाच निकट नहिं आवै।\nमहाबीर जब नाम सुनावै॥', transliteration: 'Bhūta pisāca nikaṭa nahi āvai,\nmahābīra jaba nāma sunāvai.', meaning: 'Ghosts and evil spirits dare not come near when the name of the great hero is spoken.' },
          { devanagari: 'नासै रोग हरै सब पीरा।\nजपत निरंतर हनुमत बीरा॥', transliteration: 'Nāsai roga harai saba pīrā,\njapata nirantara hanumata bīrā.', meaning: 'Illness is destroyed and all pain removed by ceaseless repetition of brave Hanuman’s name.' },
          { devanagari: 'संकट तें हनुमान छुड़ावै।\nमन क्रम बचन ध्यान जो लावै॥', transliteration: 'Saṅkaṭa te Hanumāna chuṛāvai,\nmana krama bacana dhyāna jo lāvai.', meaning: 'Hanuman frees from every distress whoever fixes mind, deed and word upon him.' },
          { devanagari: 'सब पर राम तपस्वी राजा।\nतिन के काज सकल तुम साजा॥', transliteration: 'Saba para Rāma tapasvī rājā,\ntina ke kāja sakala tuma sājā.', meaning: 'Rama the ascetic king is supreme over all, and you accomplish all his work.' },
          { devanagari: 'और मनोरथ जो कोई लावै।\nसोइ अमित जीवन फल पावै॥', transliteration: 'Aura manoratha jo koī lāvai,\nsoi amita jīvana phala pāvai.', meaning: 'Whoever brings any heartfelt wish to you receives boundless fruit in life.' },
          { devanagari: 'चारों जुग परताप तुम्हारा।\nहै परसिद्ध जगत उजियारा॥', transliteration: 'Cāroṃ juga paratāpa tumhārā,\nhai parasiddha jagata ujiyārā.', meaning: 'Your glory shines through all four ages, renowned and lighting up the world.' },
          { devanagari: 'साधु संत के तुम रखवारे।\nअसुर निकंदन राम दुलारे॥', transliteration: 'Sādhu santa ke tuma rakhavāre,\nasura nikandana Rāma dulāre.', meaning: 'You are the protector of saints and the sages, destroyer of demons, and beloved of Rama.' },
          { devanagari: 'अष्ट सिद्धि नौ निधि के दाता।\nअस बर दीन जानकी माता॥', transliteration: 'Aṣṭa siddhi nau nidhi ke dātā,\nasa bara dīna Jānakī mātā.', meaning: 'You can bestow the eight powers and nine treasures — such a boon Mother Sita granted you.' },
          { devanagari: 'राम रसायन तुम्हरे पासा।\nसदा रहो रघुपति के दासा॥', transliteration: 'Rāma rasāyana tumhare pāsā,\nsadā raho Raghupati ke dāsā.', meaning: 'The elixir of Rama’s devotion is yours; ever may you remain Rama’s servant.' },
          { devanagari: 'तुम्हरे भजन राम को पावै।\nजनम जनम के दुख बिसरावै॥', transliteration: 'Tumhare bhajana Rāma ko pāvai,\njanama janama ke dukha bisarāvai.', meaning: 'Through devotion to you one attains Rama and is freed from the sorrows of countless births.' },
          { devanagari: 'अंत काल रघुबर पुर जाई।\nजहाँ जन्म हरिभक्त कहाई॥', transliteration: 'Anta kāla raghubara pura jāī,\njahā janma haribhakta kahāī.', meaning: 'At life’s end one goes to Rama’s abode, and is thereafter known as a devotee of God.' },
          { devanagari: 'और देवता चित्त न धरई।\nहनुमत सेइ सर्ब सुख करई॥', transliteration: 'Aura devatā citta na dharaī,\nhanumata sei sarba sukha karaī.', meaning: 'Even without holding other gods in mind, serving Hanuman brings every happiness.' },
          { devanagari: 'संकट कटै मिटै सब पीरा।\nजो सुमिरै हनुमत बलबीरा॥', transliteration: 'Saṅkaṭa kaṭai miṭai saba pīrā,\njo sumirai hanumata balabīrā.', meaning: 'Troubles are cut away and all pain erased for whoever remembers mighty Hanuman.' },
          { devanagari: 'जय जय जय हनुमान गोसाईं।\nकृपा करहु गुरुदेव की नाईं॥', transliteration: 'Jaya jaya jaya Hanumāna gosāī,\nkṛpā karahu gurudeva kī nāī.', meaning: 'Victory, victory, victory to Lord Hanuman; show me grace as my own Guru would.' },
          { devanagari: 'जो सत बार पाठ कर कोई।\nछूटहि बंदि महा सुख होई॥', transliteration: 'Jo sata bāra pāṭha kara koī,\nchūṭahi bandi mahā sukha hoī.', meaning: 'Whoever recites this a hundred times is freed from bondage and gains great joy.' },
          { devanagari: 'जो यह पढ़ै हनुमान चालीसा।\nहोय सिद्धि साखी गौरीसा॥', transliteration: 'Jo yaha paṛhai Hanumāna cālīsā,\nhoya siddhi sākhī Gaurīsā.', meaning: 'Whoever reads this Hanuman Chalisa attains success — Shiva himself is witness.' },
          { devanagari: 'तुलसीदास सदा हरि चेरा।\nकीजै नाथ हृदय महँ डेरा॥', transliteration: 'Tulasīdāsa sadā Hari cerā,\nkījai nātha hṛdaya maha ḍerā.', meaning: 'Tulsidas is ever the servant of God; O Lord, make your home within my heart.' },
        ],
      },
      {
        label: 'Closing Doha',
        repetitionTarget: null,
        lines: [
          {
            devanagari: 'पवनतनय संकट हरन, मंगल मूरति रूप।\nराम लखन सीता सहित, हृदय बसहु सुर भूप॥',
            transliteration: 'Pavanatanaya saṅkaṭa harana, maṅgala mūrati rūpa,\nRāma Lakhana Sītā sahita, hṛdaya basahu sura bhūpa.',
            meaning: 'O Son of the Wind, remover of distress, embodiment of all that is auspicious — dwell in my heart, O king of gods, together with Rama, Lakshmana and Sita.',
          },
        ],
      },
    ],
    steps: [
      { order: 1, instruction: 'Begin with the two opening dohas (couplets).', mantraRef: 0, estSec: 60 },
      { order: 2, instruction: 'Recite the 40 chaupais (verses) one by one, at a steady pace.', mantraRef: 1, estSec: 600 },
      { order: 3, instruction: 'Close with the final doha and a moment of gratitude.', mantraRef: 2, estSec: 60 },
    ],
  },
  {
    id: 'durga-chalisa',
    type: 'chalisa',
    title: 'Durga Chalisa',
    deity: 'durga',
    glyph: '📿',
    glyphStyle: 'rose',
    traditionTags: ['shakta'],
    regionTags: ['universal'],
    difficulty: 'intermediate',
    estDurationMin: 12,
    summary: 'Chalisa · 40 verses · ~12 min',
    why: 'A devotional hymn of forty verses to Durga, invoking the Divine Mother’s strength and protection — especially meaningful during Navratri.',
    occasions: ['navratri'],
    calendarLinks: ['tuesday', 'friday'],
    materials: ['A quiet space', 'An image of Durga (optional)'],
    mantras: [
      {
        label: 'Verses',
        repetitionTarget: null,
        lines: [
          { devanagari: 'नमो नमो दुर्गे सुख करनी।\nनमो नमो अम्बे दुःख हरनी॥', transliteration: 'Namo namo Durge sukha karanī,\nnamo namo Ambe duḥkha haranī.', meaning: 'Salutations to Durga, giver of happiness; salutations to Mother Ambe, remover of sorrow.' },
          { devanagari: 'निरंकार है ज्योति तुम्हारी।\nतिहूँ लोक फैली उजियारी॥', transliteration: 'Niraṅkāra hai jyoti tumhārī,\ntihū loka phailī ujiyārī.', meaning: 'Your light is formless; its radiance spreads through all three worlds.' },
          { devanagari: 'शशि ललाट मुख महाविशाला।\nनेत्र लाल भृकुटि विकराला॥', transliteration: 'Śaśi lalāṭa mukha mahāviśālā,\nnetra lāla bhṛkuṭi vikarālā.', meaning: 'A moon on your brow, your face vast; your eyes red and your knit brows fearsome.' },
          { devanagari: 'रूप मातु को अधिक सुहावे।\nदरश करत जन अति सुख पावे॥', transliteration: 'Rūpa mātu ko adhika suhāve,\ndaraśa karata jana ati sukha pāve.', meaning: 'The Mother’s form is exceedingly lovely; those who behold it gain great joy.' },
          { devanagari: 'तुम संसार शक्ति लय कीना।\nपालन हेतु अन्न धन दीना॥', transliteration: 'Tuma saṃsāra śakti laya kīnā,\npālana hetu anna dhana dīnā.', meaning: 'You hold the power of the whole world, and give grain and wealth to sustain it.' },
          { devanagari: 'अन्नपूर्णा हुई जग पाला।\nतुम ही आदि सुन्दरी बाला॥', transliteration: 'Annapūrṇā huī jaga pālā,\ntuma hī ādi sundarī bālā.', meaning: 'As Annapurna you nourish the world; you are the primordial beautiful maiden.' },
          { devanagari: 'प्रलयकाल सब नाशन हारी।\nतुम गौरी शिव शंकर प्यारी॥', transliteration: 'Pralayakāla saba nāśana hārī,\ntuma Gaurī Śiva Śaṅkara pyārī.', meaning: 'At the time of dissolution you destroy all; you are Gauri, beloved of Shiva.' },
          { devanagari: 'शिव योगी तुम्हरे गुण गावें।\nब्रह्मा विष्णु तुम्हें नित ध्यावें॥', transliteration: 'Śiva yogī tumhare guṇa gāvai,\nBrahmā Viṣṇu tumheṃ nita dhyāvai.', meaning: 'Shiva and the yogis sing your virtues; Brahma and Vishnu meditate on you daily.' },
          { devanagari: 'रूप सरस्वती को तुम धारा।\nदे सुबुद्धि ऋषि मुनिन उबारा॥', transliteration: 'Rūpa Sarasvatī ko tuma dhārā,\nde subuddhi ṛṣi munina ubārā.', meaning: 'You took the form of Saraswati and, granting wisdom, uplifted the sages.' },
          { devanagari: 'धरयो रूप नरसिंह को अम्बा।\nप्रकट भईं फाड़ कर खम्बा॥', transliteration: 'Dharayo rūpa narasiṃha ko Ambā,\nprakaṭa bhaīṃ phāṛa kara khambā.', meaning: 'O Mother, you took the form of Narasimha, appearing by splitting open the pillar.' },
          { devanagari: 'रक्षा करि प्रह्लाद बचायो।\nहिरण्याकुश को स्वर्ग पठायो॥', transliteration: 'Rakṣā kari Prahlāda bacāyo,\nHiraṇyākuśa ko svarga paṭhāyo.', meaning: 'You protected and saved Prahlada, and sent Hiranyakashipu to his end.' },
          { devanagari: 'लक्ष्मी रूप धरो जग माहीं।\nश्री नारायण अंग समाहीं॥', transliteration: 'Lakṣmī rūpa dharo jaga māhī,\nŚrī Nārāyaṇa aṅga samāhī.', meaning: 'You take the form of Lakshmi in the world, abiding at Narayana’s side.' },
          { devanagari: 'क्षीरसिंधु में करत विलासा।\nदयासिंधु दीजै मन आसा॥', transliteration: 'Kṣīrasindhu meṃ karata vilāsā,\ndayāsindhu dījai mana āsā.', meaning: 'You dwell in the ocean of milk; O ocean of mercy, fulfil my heart’s hopes.' },
          { devanagari: 'हिंगलाज में तुम्हीं भवानी।\nमहिमा अमित न जात बखानी॥', transliteration: 'Hiṅgalāja meṃ tumhī Bhavānī,\nmahimā amita na jāta bakhānī.', meaning: 'At Hinglaj it is you, O Bhavani; your boundless glory cannot be told in full.' },
          { devanagari: 'मातंगी अरु धूमावति माता।\nभुवनेश्वरि बगला सुखदाता॥', transliteration: 'Mātaṅgī aru Dhūmāvati mātā,\nBhuvaneśvari Bagalā sukhadātā.', meaning: 'As Matangi and Mother Dhumavati, as Bhuvaneshwari and Bagala, you give joy.' },
          { devanagari: 'श्री भैरव तारा जग तारिणि।\nछिन्न भाल भव दुःख निवारिणि॥', transliteration: 'Śrī Bhairava Tārā jaga tāriṇi,\nchinna bhāla bhava duḥkha nivāriṇi.', meaning: 'With Bhairava as Tara you ferry the world across; as Chinnamasta you remove worldly sorrow.' },
          { devanagari: 'केहरि वाहन सोह भवानी।\nलांगुर वीर चलत अगवानी॥', transliteration: 'Kehari vāhana soha Bhavānī,\nlāṅgura vīra calata agavānī.', meaning: 'On your lion mount you shine, O Bhavani, with the brave Langur (Hanuman) going before you.' },
          { devanagari: 'कर में खप्पर खड्ग विराजै।\nजाको देख काल डर भाजै॥', transliteration: 'Kara meṃ khappara khaḍga virājai,\njāko dekha kāla ḍara bhājai.', meaning: 'In your hands the skull-bowl and sword shine; seeing them, even Death flees in fear.' },
          { devanagari: 'सोहे अस्त्र और त्रिशूला।\nजाते उठत शत्रु हिय शूला॥', transliteration: 'Sohe astra aura triśūlā,\njāte uṭhata śatru hiya śūlā.', meaning: 'Your weapons and trident gleam, striking pangs of dread in the hearts of enemies.' },
          { devanagari: 'नगरकोट में तुम्हीं विराजत।\nतिहुँलोक में डंका बाजत॥', transliteration: 'Nagarakoṭa meṃ tumhī virājata,\ntihu loka meṃ ḍaṅkā bājata.', meaning: 'At Nagarkot you are enthroned; your drum resounds through all three worlds.' },
          { devanagari: 'शुम्भ निशुम्भ दानव तुम मारे।\nरक्तबीज शंखन संहारे॥', transliteration: 'Śumbha niśumbha dānava tuma māre,\nraktabīja śaṅkhana saṃhāre.', meaning: 'You slew the demons Shumbha and Nishumbha and destroyed Raktabija by the thousand.' },
          { devanagari: 'महिषासुर नृप अति अभिमानी।\nजेहि अघ भार मही अकुलानी॥', transliteration: 'Mahiṣāsura nṛpa ati abhimānī,\njehi agha bhāra mahī akulānī.', meaning: 'The arrogant demon-king Mahishasura, by whose sins the earth was burdened —' },
          { devanagari: 'रूप कराल कालिका धारा।\nसेन सहित तुम तिहि संहारा॥', transliteration: 'Rūpa karāla Kālikā dhārā,\nsena sahita tuma tihi saṃhārā.', meaning: 'Taking the terrible form of Kali, you destroyed him along with all his army.' },
          { devanagari: 'परी गाढ़ सन्तन पर जब जब।\nभई सहाय मातु तुम तब तब॥', transliteration: 'Parī gāṛha santana para jaba jaba,\nbhaī sahāya mātu tuma taba taba.', meaning: 'Whenever hardship fell upon the devout, you came to their aid, O Mother.' },
          { devanagari: 'अमरपुरी अरु बासव लोका।\nतब महिमा सब रहें अशोका॥', transliteration: 'Amarapurī aru bāsava lokā,\ntaba mahimā saba raheṃ aśokā.', meaning: 'The city of the gods and Indra’s realm remain free of grief by your glory.' },
          { devanagari: 'ज्वाला में है ज्योति तुम्हारी।\nतुम्हें सदा पूजें नर नारी॥', transliteration: 'Jvālā meṃ hai jyoti tumhārī,\ntumheṃ sadā pūjeṃ nara nārī.', meaning: 'Your flame burns at Jwalaji; men and women worship you always.' },
          { devanagari: 'प्रेम भक्ति से जो यश गावें।\nदुःख दारिद्र निकट नहिं आवें॥', transliteration: 'Prema bhakti se jo yaśa gāvai,\nduḥkha dāridra nikaṭa nahi āvai.', meaning: 'Those who sing your praise with loving devotion are never approached by sorrow or poverty.' },
          { devanagari: 'ध्यावे तुम्हें जो नर मन लाई।\nजन्म-मरण ताकौ छुटि जाई॥', transliteration: 'Dhyāve tumheṃ jo nara mana lāī,\njanma-maraṇa tākau chuṭi jāī.', meaning: 'Whoever meditates on you wholeheartedly is freed from the cycle of birth and death.' },
          { devanagari: 'जोगी सुर मुनि कहत पुकारी।\nयोग न हो बिन शक्ति तुम्हारी॥', transliteration: 'Jogī sura muni kahata pukārī,\nyoga na ho bina śakti tumhārī.', meaning: 'Yogis, gods and sages proclaim: no union with the divine is possible without your power.' },
          { devanagari: 'शंकर आचारज तप कीनो।\nकाम क्रोध जीति सब लीनो॥', transliteration: 'Śaṅkara ācāraja tapa kīno,\nkāma krodha jīti saba līno.', meaning: 'Even Shiva, the teacher, performed austerity, conquering desire and anger.' },
          { devanagari: 'निशिदिन ध्यान धरो शंकर को।\nकाहु काल नहिं सुमिरो तुमको॥', transliteration: 'Niśidina dhyāna dharo Śaṅkara ko,\nkāhu kāla nahi sumiro tumako.', meaning: 'He meditated day and night on the absolute, but for a time did not remember you —' },
          { devanagari: 'शक्ति रूप को मरम न पायो।\nशक्ति गई तब मन पछितायो॥', transliteration: 'Śakti rūpa ko marama na pāyo,\nśakti gaī taba mana pachitāyo.', meaning: 'and not grasping the secret of your power, lost his strength and then repented.' },
          { devanagari: 'शरणागत हुई कीर्ति बखानी।\nजय जय जय जगदम्ब भवानी॥', transliteration: 'Śaraṇāgata huī kīrti bakhānī,\njaya jaya jaya jagadamba Bhavānī.', meaning: 'Taking refuge, he sang your fame: victory, victory, victory to the Mother of the World, Bhavani.' },
          { devanagari: 'भई प्रसन्न आदि जगदम्बा।\nदई शक्ति नहिं कीन विलम्बा॥', transliteration: 'Bhaī prasanna ādi jagadambā,\ndaī śakti nahi kīna vilambā.', meaning: 'The primordial Mother of the World was pleased and restored his power without delay.' },
          { devanagari: 'मोको मातु कष्ट अति घेरो।\nतुम बिन कौन हरै दुःख मेरो॥', transliteration: 'Moko mātu kaṣṭa ati ghero,\ntuma bina kauna harai duḥkha mero.', meaning: 'O Mother, great troubles surround me; who but you can take away my sorrow?' },
          { devanagari: 'आशा तृष्णा निपट सतावें।\nमोह मदादिक सब बिनशावें॥', transliteration: 'Āśā tṛṣṇā nipaṭa satāvai,\nmoha madādika saba binaśāvai.', meaning: 'Craving and longing torment me sorely; destroy in me delusion, pride and all such faults.' },
          { devanagari: 'शत्रु नाश कीजै महारानी।\nसुमिरौं इकचित तुम्हें भवानी॥', transliteration: 'Śatru nāśa kījai mahārānī,\nsumirau ikacita tumheṃ Bhavānī.', meaning: 'Destroy my enemies, O great Queen; with single-minded heart I remember you, Bhavani.' },
          { devanagari: 'करौ कृपा हे मातु दयाला।\nऋद्धि-सिद्धि दै करहु निहाला॥', transliteration: 'Karau kṛpā he mātu dayālā,\nṛddhi-siddhi dai karahu nihālā.', meaning: 'Show mercy, O compassionate Mother; bless me with prosperity and attainment, and make me content.' },
          { devanagari: 'जब लगि जिऊँ दया फल पाऊँ।\nतुम्हरो यश मैं सदा सुनाऊँ॥', transliteration: 'Jaba lagi jiū dayā phala pāū,\ntumharo yaśa maiṃ sadā sunāū.', meaning: 'As long as I live, may I receive the fruit of your grace and ever proclaim your glory.' },
          { devanagari: 'दुर्गा चालीसा जो नित गावै।\nसब सुख भोग परम पद पावै॥', transliteration: 'Durgā cālīsā jo nita gāvai,\nsaba sukha bhoga parama pada pāvai.', meaning: 'Whoever sings the Durga Chalisa daily enjoys every happiness and attains the highest state.' },
        ],
      },
      {
        label: 'Closing Doha',
        repetitionTarget: null,
        lines: [
          {
            devanagari: 'शरणागत रक्षा करे, भक्त रहे निःशंक।\nकरि विचार मन में सदा, करो सबका कल्याण॥',
            transliteration: 'Śaraṇāgata rakṣā kare, bhakta rahe niḥśaṅka,\nkari vicāra mana meṃ sadā, karo sabakā kalyāṇa.',
            meaning: 'She protects those who take refuge, so the devotee remains free of fear; ever reflecting on her in the heart, may all beings be blessed.',
          },
        ],
      },
    ],
    steps: [
      { order: 1, instruction: 'Light a lamp and sit facing an image of Durga if available.', estSec: 60 },
      { order: 2, instruction: 'Recite the forty verses one by one, at a steady pace.', mantraRef: 0, estSec: 600 },
      { order: 3, instruction: 'Close with the final doha and a short prayer of thanks.', mantraRef: 1, estSec: 60 },
    ],
  },

  // ---------------------------------------------------------------- stotra
  {
    id: 'travel-safety-prayer',
    type: 'stotra',
    title: 'Travel Safety Prayer',
    deity: 'hanuman',
    glyph: '✈️',
    glyphStyle: 'rose',
    traditionTags: ['universal'],
    regionTags: ['universal'],
    difficulty: 'beginner',
    estDurationMin: 4,
    summary: 'Stotra · for safe travels · ~4 min',
    why: 'A short prayer to Hanuman for protection and a smooth journey, recited before setting out.',
    occasions: ['travel', 'travel-safety'],
    calendarLinks: [],
    materials: ['No materials needed'],
    mantras: [
      {
        repetitionTarget: 11,
        lines: [
          {
            devanagari: 'ॐ हं हनुमते नमः',
            transliteration: 'Oṃ Haṃ Hanumate Namaḥ',
            meaning: 'Salutations to Hanuman, protector and guardian of travellers.',
          },
        ],
      },
    ],
    steps: [
      { order: 1, instruction: 'Before setting out, pause for a moment and recite the mantra.', mantraRef: 0, estSec: 120 },
      { order: 2, instruction: 'Set an intention for a safe and smooth journey.', estSec: 60 },
    ],
  },

  // ---------------------------------------------------------------- pujas
  {
    id: 'griha-pravesh',
    type: 'puja',
    title: 'Griha Pravesh',
    deity: 'ganesha',
    glyph: '🏠',
    glyphStyle: 'default',
    traditionTags: ['universal'],
    regionTags: ['universal'],
    difficulty: 'intermediate',
    estDurationMin: 45,
    summary: 'Puja · ~45 min · Moving into a new home',
    why: 'Griha Pravesh marks entry into a new home, inviting auspiciousness and removing obstacles before the family settles in.',
    occasions: ['new-house', 'housewarming'],
    calendarLinks: [],
    materials: ['Kalash (water vessel)', 'Mango leaves', 'Coconut', 'Diya', 'Rangoli colours', 'Milk (to boil over)'],
    mantras: [
      {
        repetitionTarget: 108,
        lines: [
          {
            devanagari: 'ॐ गं गणपतये नमः',
            transliteration: 'Oṃ Gaṃ Gaṇapataye Namaḥ',
            meaning: 'Salutations to Ganesha, remover of obstacles.',
          },
        ],
      },
    ],
    steps: [
      { order: 1, instruction: 'Begin with a Ganesha invocation to remove obstacles before entering the home.', mantraRef: 0, estSec: 120 },
      { order: 2, instruction: 'Perform the kalash sthapana (placing of the sacred water vessel) at the entrance.', estSec: 300 },
      { order: 3, instruction: 'Boil milk on the stove as the first act in the kitchen, symbolising abundance.', estSec: 300 },
      { order: 4, instruction: 'Walk through the home lighting a lamp in each room.', estSec: 300 },
      { order: 5, instruction: 'Conclude with a short aarti and distribute prasad.', estSec: 300 },
    ],
  },
  {
    id: 'vidyarambh',
    type: 'puja',
    title: 'Vidyarambh',
    deity: 'saraswati',
    glyph: '📖',
    glyphStyle: 'peacock',
    traditionTags: ['universal'],
    regionTags: ['universal'],
    difficulty: 'beginner',
    estDurationMin: 15,
    summary: 'Puja · ~15 min · Starting studies · Saraswati',
    why: 'Vidyarambh invokes Saraswati, goddess of knowledge, before beginning a course of study or a new academic year.',
    occasions: ['exams', 'starting-studies'],
    calendarLinks: [],
    materials: ['An image of Saraswati', 'A book or notebook', 'A diya', 'White or yellow flowers'],
    mantras: [
      {
        repetitionTarget: 108,
        lines: [
          {
            devanagari: 'ॐ ऐं सरस्वत्यै नमः',
            transliteration: 'Oṃ Aiṃ Sarasvatyai Namaḥ',
            meaning: 'Salutations to Saraswati, goddess of knowledge.',
          },
        ],
      },
    ],
    steps: [
      { order: 1, instruction: 'Light a lamp before an image of Saraswati and offer flowers.', estSec: 60 },
      { order: 2, instruction: 'Recite the Saraswati mantra, asking for clarity and focus.', mantraRef: 0, estSec: 300 },
      { order: 3, instruction: 'Place your books or study materials before the image briefly before beginning your work.', estSec: 60 },
    ],
  },
  {
    id: 'vahan-puja',
    type: 'puja',
    title: 'Vahan Puja',
    deity: 'ganesha',
    glyph: '🚗',
    glyphStyle: 'default',
    traditionTags: ['universal'],
    regionTags: ['universal'],
    difficulty: 'beginner',
    estDurationMin: 15,
    summary: 'Puja · ~15 min · Blessing a new vehicle',
    why: 'Vahan Puja blesses a new vehicle for safe travels, invoking Ganesha to remove obstacles on the road ahead.',
    occasions: ['new-car', 'new-vehicle'],
    calendarLinks: [],
    materials: ['A lemon', 'Flowers', 'A coconut', 'A diya', 'Vermillion (kumkum)'],
    mantras: [
      {
        repetitionTarget: 108,
        lines: [
          {
            devanagari: 'ॐ गं गणपतये नमः',
            transliteration: 'Oṃ Gaṃ Gaṇapataye Namaḥ',
            meaning: 'Salutations to Ganesha, remover of obstacles.',
          },
        ],
      },
    ],
    steps: [
      { order: 1, instruction: 'Clean the vehicle and place a small rangoli or kumkum mark on the dashboard.', estSec: 120 },
      { order: 2, instruction: 'Light a lamp near the vehicle and recite the Ganesha mantra.', mantraRef: 0, estSec: 300 },
      { order: 3, instruction: 'Place a lemon under each front tyre and drive forward gently to crush them, symbolising removal of obstacles.', estSec: 120 },
      { order: 4, instruction: 'Break a coconut nearby and distribute prasad.', estSec: 60 },
    ],
  },
];

// Named festival/observance dates — a curated, reviewed table for named festivals and regional
// variants. Recurring observances (Ekadashi, Pradosh, Purnima, Amavasya) are derived from the
// computed panchang flags instead, via flagObservances below. See design §9.2.
export const festivals = [];

// Recurring observances keyed off the panchang `flags` computed in panchang.js (every month, not
// tied to a specific date) — e.g. Ekadashi and Pradosh Vrat happen twice a month.
export const flagObservances = {
  ekadashi: { name: 'Ekadashi', icon: '☾', description: 'A fasting day observed twice a month, dedicated to Vishnu.', practiceIds: ['gayatri-mantra', 'shanti-mantra'] },
  pradosh: { name: 'Pradosh Vrat', icon: '🔥', description: 'Evening fast and worship of Shiva, observed on the 13th lunar day.', practiceIds: ['shiva-aarti', 'om-namah-shivaya-japa'] },
  purnima: { name: 'Purnima', icon: '🌕', description: 'The full moon day, traditionally observed with fasting, charity and worship.', practiceIds: ['gayatri-mantra', 'lakshmi-aarti'] },
  amavasya: { name: 'Amavasya', icon: '🌑', description: 'The new moon day, associated with remembrance of ancestors and quiet reflection.', practiceIds: ['maha-mrityunjaya', 'shanti-mantra'] },
};

// Weekly deity associations (design §5.2)
export const weeklyObservances = {
  0: { title: 'Sunday — a day for Surya', description: 'Sundays are associated with Surya, the sun. A simple prayer of gratitude for health and vitality.', practiceIds: ['gayatri-mantra', 'shanti-mantra'] },
  1: { title: 'Monday — a day for Shiva', description: 'Mondays are traditionally devoted to Lord Shiva. A short morning prayer and lamp is a gentle way to begin.', practiceIds: ['om-namah-shivaya-japa', 'shiva-aarti'] },
  2: { title: 'Tuesday — a day for Hanuman & Devi', description: 'Tuesdays honour Hanuman and the Devi — strength, courage and protection.', practiceIds: ['hanuman-chalisa', 'durga-chalisa'] },
  3: { title: 'Wednesday — a day for Ganesha', description: 'A good day to invoke Ganesha before starting something new.', practiceIds: ['ganesha-mantra', 'ganesh-aarti'] },
  4: { title: 'Thursday — a day for Vishnu & Guru', description: 'Thursdays are devoted to Vishnu and one’s teachers — a day for wisdom and guidance.', practiceIds: ['gayatri-mantra', 'shanti-mantra'] },
  5: { title: 'Friday — a day for Lakshmi', description: 'Fridays are associated with Lakshmi — a day to invite abundance and wellbeing.', practiceIds: ['lakshmi-aarti', 'durga-aarti'] },
  6: { title: 'Saturday — a day for Shani & Hanuman', description: 'Saturdays honour Shani and Hanuman — a day for resilience and steadiness.', practiceIds: ['hanuman-chalisa'] },
};

// Default routine for the demo user
export const defaultRoutine = [
  { practiceId: 'om-namah-shivaya-japa', titleOverride: 'Light the lamp', timeOfDay: '06:00', days: [0,1,2,3,4,5,6], reminder: true, group: 'morning' },
  { practiceId: 'gayatri-mantra', titleOverride: 'Gayatri Mantra ×3', timeOfDay: '06:05', days: [0,1,2,3,4,5,6], reminder: true, group: 'morning' },
  { practiceId: 'shiva-aarti', titleOverride: 'Evening aarti', timeOfDay: '19:00', days: [0,1,2,3,4,5,6], reminder: true, group: 'evening' },
  { practiceId: 'hanuman-chalisa', titleOverride: 'Hanuman Chalisa', timeOfDay: '19:30', days: [2,6], reminder: false, group: 'evening' },
];
