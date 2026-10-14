export const LEARN_DATA = {
  'es-ES': {
    name: 'Spanish', flag: '🇪🇸',
    lessons: [
      {
        title: 'Greetings & Basics', level: 'Beginner',
        phrases: [
          { native: 'Hola', roman: 'OH-lah', eng: 'Hello' },
          { native: 'Buenos días', roman: 'BWEH-nos DEE-as', eng: 'Good morning' },
          { native: 'Buenas tardes', roman: 'BWEH-nas TAR-des', eng: 'Good afternoon' },
          { native: 'Buenas noches', roman: 'BWEH-nas NO-ches', eng: 'Good night' },
          { native: '¿Cómo estás?', roman: 'KOH-mo es-TAS', eng: 'How are you?' },
          { native: 'Estoy bien', roman: 'es-TOY BYEN', eng: "I'm fine" },
        ],
        grammar: 'In Spanish, verbs change based on who is doing the action. "Estoy" means "I am" from the verb "estar" (to be). Spanish has two verbs for "to be": "ser" (permanent) and "estar" (temporary).',
        table: [['yo', 'I'], ['tú', 'you (informal)'], ['él/ella', 'he/she'], ['nosotros', 'we'], ['ellos', 'they']]
      },
      {
        title: 'Numbers 1–20', level: 'Beginner',
        phrases: [
          { native: 'uno, dos, tres', roman: 'OO-no, DOS, TRES', eng: 'one, two, three' },
          { native: 'cuatro, cinco', roman: 'KWAH-tro, SEEN-ko', eng: 'four, five' },
          { native: 'seis, siete, ocho', roman: 'SAYS, SYEH-te, OH-cho', eng: 'six, seven, eight' },
          { native: 'nueve, diez', roman: 'NWEH-be, DYEZ', eng: 'nine, ten' },
          { native: 'once, doce', roman: 'ON-se, DOH-se', eng: 'eleven, twelve' },
          { native: 'veinte', roman: 'BAYN-te', eng: 'twenty' },
        ],
        grammar: 'Numbers in Spanish are straightforward. After 15 (quince), numbers 16–19 combine "diez" (ten) and the unit: dieciséis (16), diecisiete (17), dieciocho (18), diecinueve (19).',
        table: [['1 uno','2 dos'],['3 tres','4 cuatro'],['5 cinco','6 seis'],['10 diez','20 veinte']]
      },
      {
        title: 'Common Phrases', level: 'Intermediate',
        phrases: [
          { native: '¿Dónde está…?', roman: 'DON-de es-TA', eng: 'Where is…?' },
          { native: 'No entiendo', roman: 'no en-TYEN-do', eng: "I don't understand" },
          { native: 'Habla más despacio', roman: 'AH-bla mas des-PA-syo', eng: 'Speak more slowly' },
          { native: '¿Cuánto cuesta?', roman: 'KWAN-to KWES-ta', eng: 'How much does it cost?' },
          { native: 'Gracias / De nada', roman: 'GRA-syas / de NA-da', eng: 'Thank you / You\'re welcome' },
          { native: 'Por favor / Perdón', roman: 'por fa-VOR / per-DON', eng: 'Please / Sorry' },
        ],
        grammar: 'Questions in Spanish use inverted punctuation (¿…?) at the start. The verb often comes before the subject in questions: "¿Habla usted inglés?" (Do you speak English?).',
        table: [['¿Qué?','What?'],['¿Quién?','Who?'],['¿Dónde?','Where?'],['¿Cuándo?','When?'],['¿Cómo?','How?'],['¿Por qué?','Why?']]
      },
    ]
  },
  'fr-FR': {
    name: 'French', flag: '🇫🇷',
    lessons: [
      {
        title: 'Greetings & Basics', level: 'Beginner',
        phrases: [
          { native: 'Bonjour', roman: 'bon-ZHOOR', eng: 'Hello / Good day' },
          { native: 'Bonsoir', roman: 'bon-SWAHR', eng: 'Good evening' },
          { native: 'Salut', roman: 'sah-LYU', eng: 'Hi (informal)' },
          { native: 'Comment allez-vous ?', roman: 'koh-MON ah-LAY VOO', eng: 'How are you? (formal)' },
          { native: 'Je vais bien', roman: 'zhuh VAY BYAN', eng: "I'm doing well" },
          { native: 'Au revoir', roman: 'oh ruh-VWAHR', eng: 'Goodbye' },
        ],
        grammar: 'French nouns have gender — masculine or feminine — which affects articles and adjectives. "Le" is used for masculine nouns, "La" for feminine. "Les" is used for plural nouns of either gender.',
        table: [['je','I'],['tu','you (informal)'],['il/elle','he/she'],['nous','we'],['vous','you (formal/plural)'],['ils/elles','they']]
      },
      {
        title: 'Essential Phrases', level: 'Beginner',
        phrases: [
          { native: 'S\'il vous plaît', roman: 'seel voo PLAY', eng: 'Please' },
          { native: 'Merci beaucoup', roman: 'mer-SEE bo-KOO', eng: 'Thank you very much' },
          { native: 'Je ne comprends pas', roman: 'zhuh nuh kom-PROHN pah', eng: "I don't understand" },
          { native: 'Parlez-vous anglais ?', roman: 'par-LAY voo ohn-GLAY', eng: 'Do you speak English?' },
          { native: 'Où est…?', roman: 'oo EH', eng: 'Where is…?' },
          { native: 'Combien ça coûte ?', roman: 'kom-BYAN sah KOOT', eng: 'How much does it cost?' },
        ],
        grammar: 'Negation in French wraps the verb: "Je comprends" (I understand) becomes "Je ne comprends pas" (I do not understand). The "ne" and "pas" surround the verb.',
        table: [['oui','yes'],['non','no'],['peut-être','maybe'],['bien sûr','of course'],['d\'accord','agreed/OK']]
      },
    ]
  },
  'de-DE': {
    name: 'German', flag: '🇩🇪',
    lessons: [
      {
        title: 'Greetings & Basics', level: 'Beginner',
        phrases: [
          { native: 'Guten Morgen', roman: 'GOO-ten MOR-gen', eng: 'Good morning' },
          { native: 'Guten Tag', roman: 'GOO-ten TAHK', eng: 'Good day' },
          { native: 'Guten Abend', roman: 'GOO-ten AH-bent', eng: 'Good evening' },
          { native: 'Wie geht es Ihnen?', roman: 'vee GAYT es EE-nen', eng: 'How are you? (formal)' },
          { native: 'Danke schön', roman: 'DAHN-kuh SHURN', eng: 'Thank you very much' },
          { native: 'Auf Wiedersehen', roman: 'owf VEE-der-zay-en', eng: 'Goodbye' },
        ],
        grammar: 'German has three genders: masculine (der), feminine (die), and neuter (das). These change depending on the case (nominative, accusative, dative, genitive). Start with der/die/das and build from there.',
        table: [['ich','I'],['du','you (informal)'],['er/sie/es','he/she/it'],['wir','we'],['Sie','you (formal)']]
      },
    ]
  },
  'ja-JP': {
    name: 'Japanese', flag: '🇯🇵',
    lessons: [
      {
        title: 'Greetings & Basics', level: 'Beginner',
        phrases: [
          { native: 'おはようございます', roman: 'Ohayou gozaimasu', eng: 'Good morning (formal)' },
          { native: 'こんにちは', roman: 'Konnichiwa', eng: 'Hello / Good afternoon' },
          { native: 'こんばんは', roman: 'Konbanwa', eng: 'Good evening' },
          { native: 'ありがとうございます', roman: 'Arigatou gozaimasu', eng: 'Thank you (formal)' },
          { native: 'すみません', roman: 'Sumimasen', eng: 'Excuse me / I\'m sorry' },
          { native: 'はい / いいえ', roman: 'Hai / Iie', eng: 'Yes / No' },
        ],
        grammar: 'Japanese sentence structure is Subject–Object–Verb (SOV). Politeness levels are crucial: add "masu" to verbs for polite speech. Particles like "wa" (topic), "ga" (subject), "wo" (object) mark grammatical roles.',
        table: [['私 (わたし)','I/me'],['あなた','you'],['彼 (かれ)','he'],['彼女 (かのじょ)','she'],['私たち','we']]
      },
      {
        title: 'Hiragana Basics', level: 'Beginner',
        phrases: [
          { native: 'あ い う え お', roman: 'a i u e o', eng: 'Vowels — the 5 core sounds' },
          { native: 'か き く け こ', roman: 'ka ki ku ke ko', eng: 'K-row' },
          { native: 'さ し す せ そ', roman: 'sa shi su se so', eng: 'S-row' },
          { native: 'た ち つ て と', roman: 'ta chi tsu te to', eng: 'T-row' },
          { native: 'な に ぬ ね の', roman: 'na ni nu ne no', eng: 'N-row' },
          { native: 'は ひ ふ へ ほ', roman: 'ha hi fu he ho', eng: 'H-row' },
        ],
        grammar: 'Hiragana is a syllabic alphabet with 46 base characters. Each character represents a syllable (e.g. か = "ka"). Mastering hiragana first is the fastest path into reading and writing Japanese.',
        table: [['あ','a'],['い','i'],['う','u'],['え','e'],['お','o'],['か','ka'],['き','ki'],['く','ku']]
      },
    ]
  },
  'zh-CN': {
    name: 'Chinese', flag: '🇨🇳',
    lessons: [
      {
        title: 'Greetings & Basics', level: 'Beginner',
        phrases: [
          { native: '你好', roman: 'Nǐ hǎo', eng: 'Hello' },
          { native: '早上好', roman: 'Zǎoshang hǎo', eng: 'Good morning' },
          { native: '谢谢', roman: 'Xièxiè', eng: 'Thank you' },
          { native: '不客气', roman: 'Bù kèqì', eng: "You're welcome" },
          { native: '对不起', roman: 'Duìbuqǐ', eng: "I'm sorry" },
          { native: '再见', roman: 'Zàijiàn', eng: 'Goodbye' },
        ],
        grammar: 'Mandarin Chinese has no verb conjugations or noun plurals. Meaning relies on word order (SVO) and context. The four tones (plus neutral) are critical: mā (mother), má (hemp), mǎ (horse), mà (scold).',
        table: [['我','wǒ — I'],['你','nǐ — you'],['他/她','tā — he/she'],['我们','wǒmen — we'],['你们','nǐmen — you (pl)']]
      },
    ]
  },
  'ar-SA': {
    name: 'Arabic', flag: '🇸🇦',
    lessons: [
      {
        title: 'Greetings & Basics', level: 'Beginner',
        phrases: [
          { native: 'السلام عليكم', roman: 'As-salamu alaykum', eng: 'Peace be upon you (Hello)' },
          { native: 'وعليكم السلام', roman: "Wa alaykum as-salam", eng: 'And upon you peace (reply)' },
          { native: 'مرحبا', roman: 'Marhaba', eng: 'Hi / Welcome' },
          { native: 'شكرًا', roman: 'Shukran', eng: 'Thank you' },
          { native: 'من فضلك', roman: 'Min fadlak', eng: 'Please' },
          { native: 'مع السلامة', roman: "Ma'a as-salama", eng: 'Goodbye' },
        ],
        grammar: 'Arabic is written right-to-left. It has a root-based system where most words share a 3-letter root (e.g. ك-ت-ب k-t-b relates to writing: كَتَبَ kataba = he wrote, كِتَاب kitāb = book).',
        table: [['أنا','ana — I'],['أنت','anta — you (m)'],['هو','huwa — he'],['هي','hiya — she'],['نحن','nahnu — we']]
      },
    ]
  },
  'hi-IN': {
    name: 'Hindi', flag: '🇮🇳',
    lessons: [
      {
        title: 'Greetings & Basics', level: 'Beginner',
        phrases: [
          { native: 'नमस्ते', roman: 'Namaste', eng: 'Hello / Greetings' },
          { native: 'आप कैसे हैं?', roman: 'Aap kaise hain?', eng: 'How are you? (formal)' },
          { native: 'मैं ठीक हूँ', roman: 'Main theek hoon', eng: "I'm fine" },
          { native: 'धन्यवाद', roman: 'Dhanyavaad', eng: 'Thank you' },
          { native: 'कृपया', roman: 'Kripaya', eng: 'Please' },
          { native: 'माफ़ कीजिए', roman: 'Maaf keejiye', eng: 'I\'m sorry / Excuse me' },
        ],
        grammar: 'Hindi uses the Devanagari script (46+ characters). Sentence structure is SOV. Verbs agree with the subject\'s gender and number. "Aap" is the formal "you", while "tum" and "tu" are increasingly informal.',
        table: [['मैं','main — I'],['तुम','tum — you (informal)'],['आप','aap — you (formal)'],['वह','vah — he/she'],['हम','ham — we']]
      },
    ]
  },
  'ur-PK': {
    name: 'Urdu', flag: '🇵🇰',
    lessons: [
      {
        title: 'Greetings & Basics', level: 'Beginner',
        phrases: [
          { native: 'آداب', roman: 'Adaab', eng: 'Greetings / Hello' },
          { native: 'السلام علیکم', roman: 'Assalamu alaikum', eng: 'Peace be upon you' },
          { native: 'آپ کیسے ہیں؟', roman: 'Aap kaise hain?', eng: 'How are you?' },
          { native: 'میں ٹھیک ہوں', roman: 'Main theek hoon', eng: "I'm fine" },
          { native: 'شکریہ', roman: 'Shukriya', eng: 'Thank you' },
          { native: 'خدا حافظ', roman: 'Khuda hafiz', eng: 'Goodbye' },
        ],
        grammar: 'Urdu is written in Nastaliq script, right-to-left. It shares grammatical structure with Hindi (SOV) but uses Persian–Arabic vocabulary. The script looks flowing and calligraphic. Honorifics are deeply important in Urdu culture.',
        table: [['میں','main — I'],['آپ','aap — you (formal)'],['تم','tum — you (informal)'],['وہ','voh — he/she'],['ہم','ham — we']]
      },
    ]
  },
};
