import React, { useState, useEffect, useMemo, useRef } from 'react';


const GEOGRAPHY_REGISTRY = {
  'Gauteng': {
    locked: false,
    cities: {
      'Lenasia': {
        locked: false,
        cemeteries: [
          { id: 'lenasia_avalon', name: 'Lenasia Avalon Cemetery', address: 'Tshabuse St, Klipriviersoog', lat: -26.302314, lng: 27.871214, locked: false },
          { id: 'oliphantsvlei', name: 'Oliphantsvlei Cemetery (Coming Soon)', address: 'Olifantsvlei, Johannesburg', lat: -26.342115, lng: 27.892412, locked: true }
        ]
      },
      'Johannesburg South & West': {
        locked: true,
        cemeteries: [
          { id: 'newclare', name: 'Newclare Cemetery (Coming Soon)', address: 'Newclare, West of JHB', lat: -26.201211, lng: 27.970211, locked: true },
          { id: 'westpark', name: 'Westpark Muslim Cemetery (Coming Soon)', address: 'Beyers Naude Dr, Montgomery Park', lat: -26.170624, lng: 27.994231, locked: true }
        ]
      },
      'Pretoria': {
        locked: true,
        cemeteries: [
          { id: 'laudium', name: 'Laudium Cemetery (Coming Soon)', address: 'Laudium, Pretoria', lat: -25.792415, lng: 28.094112, locked: true }
        ]
      },
      'East Rand': {
        locked: true,
        cemeteries: [
          { id: 'benoni_actonville', name: 'Benoni & Actonville (Coming Soon)', address: 'Actonville, Benoni', lat: -26.192415, lng: 28.324112, locked: true }
        ]
      },
      'Midrand': {
        locked: true,
        cemeteries: [
          { id: 'midrand_grand', name: 'Midrand Muslim Cemetery (Coming Soon)', address: 'Grand Central, Midrand', lat: -25.991211, lng: 28.140211, locked: true }
        ]
      }
    }
  },
  'Western Cape': {
    locked: true,
    cities: {
      'Cape Town': {
        locked: true,
        cemeteries: [
          { id: 'mowbray', name: 'Mowbray Muslim Cemetery (Coming Soon)', lat: -33.937828, lng: 18.461824, locked: true },
          { id: 'johnstone_road', name: 'Johnstone Road Qabrastaan (Coming Soon)', lat: -33.968211, lng: 18.490122, locked: true },
          { id: 'vygieskraal', name: 'Vygieskraal Cemetery (Coming Soon)', lat: -33.951211, lng: 18.511211, locked: true }
        ]
      },
      'Paarl': {
        locked: true,
        cemeteries: [
          { id: 'paarl_cem', name: 'Paarl Muslim Cemetery (Coming Soon)', lat: -33.724122, lng: 18.961211, locked: true }
        ]
      },
      'Stellenbosch': {
        locked: true,
        cemeteries: [
          { id: 'stellenbosch_cem', name: 'Stellenbosch Muslim Cemetery (Coming Soon)', lat: -33.931211, lng: 18.864122, locked: true }
        ]
      }
    }
  },
  'KwaZulu-Natal': {
    locked: true,
    cities: {
      'Durban Central': {
        locked: true,
        cemeteries: [
          { id: 'brook_street', name: 'Brook Street Cemetery (Coming Soon)', lat: -29.856122, lng: 31.021211, locked: true }
        ]
      },
      'Durban North': {
        locked: true,
        cemeteries: [
          { id: 'kensington', name: 'Kensington Muslim Cemetery (Coming Soon)', lat: -29.791211, lng: 31.041211, locked: true }
        ]
      },
      'Pietermaritzburg': {
        locked: true,
        cemeteries: [
          { id: 'mountain_rise', name: 'Mountain Rise Cemetery (Coming Soon)', lat: -29.581211, lng: 30.401211, locked: true }
        ]
      },
      'Newcastle': {
        locked: true,
        cemeteries: [
          { id: 'newcastle_cem', name: 'Newcastle Muslim Cemetery (Coming Soon)', lat: -27.751211, lng: 29.931211, locked: true }
        ]
      },
      'Stanger': {
        locked: true,
        cemeteries: [
          { id: 'stanger_cem', name: 'Stanger Muslim Cemetery (Coming Soon)', lat: -29.331211, lng: 31.291211, locked: true }
        ]
      }
    }
  },
  'Eastern Cape': {
    locked: true,
    cities: {
      'Gqeberha': {
        locked: true,
        cemeteries: [
          { id: 'forest_hill', name: 'Forest Hill Muslim Sector (Coming Soon)', lat: -33.981211, lng: 25.621211, locked: true }
        ]
      },
      'East London': {
        locked: true,
        cemeteries: [
          { id: 'el_muslim_cem', name: 'East London Muslim Cemetery (Coming Soon)', lat: -32.991211, lng: 27.901211, locked: true }
        ]
      },
      'Mthatha': {
        locked: true,
        cemeteries: [
          { id: 'mthatha_cem', name: 'Mthatha Muslim Cemetery (Coming Soon)', lat: -31.591211, lng: 28.781211, locked: true }
        ]
      }
    }
  }
};


const BURIAL_SOCIETIES = [
  { name: "Saaberie Chishty Burial Society", base: "Lenasia", contact: "011 854 6062", service: "24/7 Janazah logistics, washing, shrouding & repatriation across greater JHB.", primary: true },
  { name: "Central Islamic Trust (CIT)", base: "Johannesburg", contact: "011 492 1317", service: "Burial administration, grave allocation, and Janazah notices.", primary: false },
  { name: "Pretoria Muslim Trust (PMT)", base: "Laudium", contact: "012 374 2515", service: "Burial arrangements and upkeep of Laudium Muslim cemetery.", primary: false }
];

const GRAVE_REGISTRY_SEED = [
  { id: 'QC-001', name: 'Abdul-Kadir', surname: 'Ebrahim', family: 'Beloved father, grandfather & dedicated community teacher.', qabr: 'G104', cemeteryId: 'lenasia_avalon', lat: -26.302314, lng: 27.871214, dod: '2023-04-12', dual_grave: false },
  { id: 'QC-002', name: 'Fatima', surname: 'Hendricks', family: 'Mother of Lenasia southern suburbs soup kitchen network.', qabr: 'F205', cemeteryId: 'lenasia_avalon', lat: -26.302514, lng: 27.871414, dod: '2025-01-08', dual_grave: false },
  { id: 'QC-003', name: 'Yusuf', surname: 'Kola', family: 'Beloved grandfather, remembering his beautiful Quran recitations.', qabr: 'E112-A', cemeteryId: 'lenasia_avalon', lat: -26.302111, lng: 27.871111, dod: '2021-11-03', dual_grave: true },
  { id: 'QC-004', name: 'Mariam', surname: 'Kola', family: 'Beloved grandmother, laying side-by-side with her life partner Yusuf.', qabr: 'E112-B', cemeteryId: 'lenasia_avalon', lat: -26.302111, lng: 27.871111, dod: '2026-02-14', dual_grave: true }
];

const HIJRI_MONTHS = [
  'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi ath-Thani', 
  'Jumada al-Ula', 'Jumada al-Akhirah', 'Rajab', 'Sha\'ban', 
  'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
];


const AUTHENTIC_DUAS = [
  {
    title: "1. Upon Entering the Graveyard / Cemetery",
    ar: "السَّلامُ عَلَيْكُمْ أَهْلَ الدِّيارِ مِنَ المُؤْمِنينَ وَالْمُسْلِمينَ، وَإِنَّا إِنْ شاءَ اللهُ بِكُمْ لاحِقُونَ، نَسْأَلُ اللهَ لَنَا وَلَكُمُ العَافِيَةَ",
    trans: "As-salāmu ʿalaykum ahlad-diyāri minal-muʾminīna wal-muslimīn, wa innā in shāʾa Allāhu bikum lāḥiqūn, nasʾalullāha lanā wa lakumul-ʿāfiyah.",
    en: "Peace be upon you, O inhabitants of these dwellings, from among the believers and the Muslims. We will soon, if Allah wills, be joining you. I ask Allah to grant well-being to us and to you.",
    ref: "Sahih Muslim 975"
  },
  {
    title: "2. When Placing the Deceased into the Grave",
    ar: "بِسْمِ اللهِ وَعَلَى مِلَّةِ رَسُولِ اللهِ",
    trans: "Bismillāhi wa ʿalā millati rasūlillāh.",
    en: "In the name of Allah and upon the religion/method of the Messenger of Allah.",
    ref: "Sunan Abi Dawud 3216 (Sahih)"
  },
  {
    title: "3. After the Burial (Seeking Steadfastness)",
    ar: "اللَّهُمَّ اغْفِرْ لَهُ اللَّهُمَّ ثَبِّتْهُ",
    trans: "Allāhummaghfir lahū, Allāhuma thabbit-hu.",
    en: "O Allah, forgive him. O Allah, make him steadfast.",
    ref: "Sunan Abi Dawud 3221 (Sahih)"
  },
  {
    title: "4. Comprehensive Dua for the Deceased",
    ar: "اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ، وَعَافِهِ وَاعْفُ عَنْهُ، وَأَكْرِمْ نُزُلَهُ، وَوَسِّعْ مُدْخَلَهُ، وَاغْسِلْهُ بِالْمَاءِ وَالثَّلْجِ وَالْبَرَدِ، وَنَقِّهِ مِنَ الْخَطَايَا كَمَا نَقَّيْتَ الثَّوْبَ الأَبْيَضَ مِنَ الدَّنَسِ",
    trans: "Allāhummaghfir lahū warḥamhu, wa ʿāfihī waʿfu ʿanhu, wa akrim nuzulahū, wa wassiʿ mudkhalahū, waghsilhu bil-māʾi wath-thalji wal-baradi, wa naqqihī minal-khaṭāyā kamā naqqaytath-thawbal-abyaḍa minad-danas.",
    en: "O Allah, forgive him and have mercy on him, keep him safe and sound and forgive him, honor his reception, widen his entry, and wash him with water and snow and hail, and clean him of sin as a white garment is cleansed of dirt.",
    ref: "Sahih Muslim 963"
  }
];

const OPENROUTER_MODELS = {
  chat: [
    { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Llama 3.3 70B (Free)' },
    { id: 'qwen/qwen-2.5-72b-instruct:free', name: 'Qwen 2.5 72B (Free)' },
    { id: 'google/gemma-2-9b-it:free', name: 'Gemma 2 9B (Free)' }
  ],
  vision: [
    { id: 'qwen/qwen-2-5-vl-7b-instruct:free', name: 'Qwen 2.5 Vision (Free)' },
    { id: 'meta-llama/llama-3.2-11b-vision-instruct:free', name: 'Llama 3.2 Vision (Free)' }
  ]
};

const OFFLINE_QURAN = {
  '1': {
    name: 'Al-Fatiha',
    translatedName: 'The Opening',
    revelation: 'Meccan',
    ayatsCount: 7,
    ayahs: [
      { text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ" },
      { text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ" },
      { text: "الرَّحْمَٰنِ الرَّحِيمِ" },
      { text: "مَالِكِ يَوْمِ الدِّينِ" },
      { text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ" },
      { text: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ" },
      { text: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ" }
    ],
    translationAyahs: [
      { text: "In the name of Allah, the Entirely Merciful, the Especially Merciful." },
      { text: "[All] praise is [due] to Allah, Lord of the worlds -" },
      { text: "The Entirely Merciful, the Especially Merciful," },
      { text: "Sovereign of the Day of Recompense." },
      { text: "It is You we worship and You we ask for help." },
      { text: "Guide us to the straight path -" },
      { text: "The path of those upon whom You have bestowed favor, not of those who have earned [Your] anger or of those who are astray." }
    ]
  },
  '112': {
    name: 'Al-Ikhlas',
    translatedName: 'Sincerity',
    revelation: 'Meccan',
    ayatsCount: 4,
    ayahs: [
      { text: "قُلْ هُوَ اللَّهُ أَحَدٌ" },
      { text: "اللَّهُ الصَّمَدُ" },
      { text: "لَمْ يَدِلْ وَلَمْ يُولَدْ" },
      { text: "وَمَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ" }
    ],
    translationAyahs: [
      { text: "Say, \"He is Allah, [who is] One," },
      { text: "Allah, the Eternal Refuge." },
      { text: "He neither begets nor is born," },
      { text: "Nor is there to Him any equivalent.\"" }
    ]
  },
  '113': {
    name: 'Al-Falaq',
    translatedName: 'Daybreak',
    revelation: 'Meccan',
    ayatsCount: 5,
    ayahs: [
      { text: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ" },
      { text: "مِن شَرِّ مَا خَلَقَ" },
      { text: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ" },
      { text: "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ" },
      { text: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ" }
    ],
    translationAyahs: [
      { text: "Say, \"I seek refuge in the Lord of daybreak" },
      { text: "From the evil of that which He created" },
      { text: "And from the evil of darkness when it settles" },
      { text: "And from the evil of the blowers in knots" },
      { text: "And from the evil of an envier when he envies.\"" }
    ]
  },
  '114': {
    name: 'An-Nas',
    translatedName: 'Mankind',
    revelation: 'Meccan',
    ayatsCount: 6,
    ayahs: [
      { text: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ" },
      { text: "مَلِكِ النَّاسِ" },
      { text: "إِلَٰهِ النَّاسِ" },
      { text: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ" },
      { text: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ" },
      { text: "مِنَ الْجِنَّةِ وَالنَّاسِ" }
    ],
    translationAyahs: [
      { text: "Say, \"I seek refuge in the Lord of mankind," },
      { text: "The Sovereign of mankind," },
      { text: "The God of mankind," },
      { text: "From the evil of the retreating whisperer -" },
      { text: "Who whispers [evil] into the breasts of mankind -" },
      { text: "From among the jinn and mankind.\"" }
    ]
  }
};


export function gregorianToHijri(dateObj) {
  try {
    const formatter = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', {
      day: 'numeric', month: 'numeric', year: 'numeric'
    });
    const parts = formatter.formatToParts(dateObj);
    const dict = {};
    parts.forEach(p => {
      if (['day', 'month', 'year'].includes(p.type)) {
        dict[p.type] = parseInt(p.value, 10);
      }
    });
    return { day: dict.day, month: dict.month, year: dict.year };
  } catch (e) {
    let y = dateObj.getFullYear();
    let m = dateObj.getMonth() + 1;
    let d = dateObj.getDate();
    if (m < 3) { y -= 1; m += 12; }
    let a = Math.floor(y / 100);
    let b = 2 - a + Math.floor(a / 4);
    let jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + b - 1524;
    let l = jd - 1948440 + 10632;
    let n = Math.floor((l - 1) / 10631);
    l = l - 10631 * n + 354;
    let j = Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719) + Math.floor(l / 5670) * Math.floor((43 * l) / 15238);
    l = l - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
    let m_hijri = Math.floor((24 * l) / 709);
    let d_hijri = l - Math.floor((709 * m_hijri) / 24);
    let y_hijri = 30 * n + j - 30;
    return { day: d_hijri, month: m_hijri, year: y_hijri };
  }
}

const showCustomToast = (title, message, iconType = "success") => {
  const modal = document.createElement('div');
  modal.className = "fixed bottom-6 right-6 bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-2xl text-xs z-[9999] animate-bounce max-w-sm";
  modal.innerHTML = `
    <div class="flex items-start gap-3 text-left">
      <div class="${iconType === 'success' ? 'text-emerald-400' : 'text-amber-400'} mt-0.5">
        <i class="fa-solid ${iconType === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation'} text-lg"></i>
      </div>
      <div>
        <h4 class="font-bold text-white">${title}</h4>
        <p class="text-slate-400 mt-1 leading-relaxed">${message}</p>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  setTimeout(() => modal.remove(), 4500);
};


export default function App() {
  const [activeTab, setActiveTab] = useState('search');
  const [records, setRecords] = useState(() => {
    const local = localStorage.getItem('qabrcare_records');
    return local ? JSON.parse(local) : GRAVE_REGISTRY_SEED;
  });
  const [pendingRecords, setPendingRecords] = useState(() => {
    const local = localStorage.getItem('qabrcare_pending_records');
    return local ? JSON.parse(local) : [];
  });
  
  const [focusedLocation, setFocusedLocation] = useState(null);
  const [currentMapCenter, setCurrentMapCenter] = useState({ lat: -26.302314, lng: 27.871214 });
  const [showSettings, setShowSettings] = useState(false);
  const [openRouterKey, setOpenRouterKey] = useState(() => localStorage.getItem('openrouter_api_key') || '');
  const [selectedChatModel, setSelectedChatModel] = useState(() => localStorage.getItem('openrouter_chat_model') || 'meta-llama/llama-3.3-70b-instruct:free');
  const [selectedVisionModel, setSelectedVisionModel] = useState(() => localStorage.getItem('openrouter_vision_model') || 'qwen/qwen-2-5-vl-7b-instruct:free');
  
  const [adminToken, setAdminToken] = useState(() => sessionStorage.getItem('mrkolapie_admin_token') || '');
  const [workerAuthenticated, setWorkerAuthenticated] = useState(() => sessionStorage.getItem('qabrcare_worker_auth') === 'true');

  useEffect(() => {
    localStorage.setItem('qabrcare_records', JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem('qabrcare_pending_records', JSON.stringify(pendingRecords));
  }, [pendingRecords]);

  const saveSettings = (e) => {
    e.preventDefault();
    localStorage.setItem('openrouter_api_key', openRouterKey);
    localStorage.setItem('openrouter_chat_model', selectedChatModel);
    localStorage.setItem('openrouter_vision_model', selectedVisionModel);
    setShowSettings(false);
    showCustomToast("Settings Saved", "Your OpenRouter configurations have been synchronized with the edge proxy.", "success");
  };

  const handleLocate = (loc) => {
    setFocusedLocation(loc);
    setCurrentMapCenter(loc);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      
      {/* GLOBAL SEO STRUCTURAL METADATA */}
      <div className="hidden" aria-hidden="true">
        <h2>QabrCare South Africa - Islamic Cemetery Map Finder</h2>
        <p>A corporate project of MrKolapie Pty Ltd ™. Search graves, view maps, purchase verified cleanups at Lenasia Avalon Cemetery.</p>
        <span id="google-search-console-verification">G-Gauteng-SearchConsoleHook</span>
      </div>

      {/* FLASHING NOTIFICATION BAR */}
      <div className="w-full bg-emerald-950/90 border-b border-emerald-500/35 text-emerald-400 text-[10px] md:text-xs py-2 px-4 font-bold text-center uppercase tracking-wider animate-pulse z-[99] absolute top-0 left-0 no-print">
        🚨 ALL OTHER SOUTH AFRICAN REGIONS COMING SOON INSHA ALLAH AMEEN - PLEASE MAKE DUA AND DONATE KINDLY!
      </div>

      {/* LEFT CONTAINER */}
      <div className="w-full lg:w-[480px] flex flex-col bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-800 h-[60vh] lg:h-full overflow-y-auto mt-8 no-print">
        
        {/* BRANDING HEADER */}
        <header className="p-5 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <i className="fa-solid fa-mosque text-xl"></i>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                QabrCare <span className="text-[10px] uppercase font-mono bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">Gauteng</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-medium">MrKolapie Pty Ltd ™ Islamic Cemetery Suite</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowSettings(true)}
              className="text-slate-400 hover:text-emerald-400 transition text-sm p-2 bg-slate-800/80 rounded-lg border border-slate-700"
              title="OpenRouter Configuration"
            >
              <i className="fa-solid fa-gears"></i>
            </button>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
              <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live DB
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20" title="This portal is completely ad-free.">
              <i className="fa-solid fa-shield-heart mr-1"></i>
              Ad-Free Waqf
            </span>
          </div>
        </header>

        {/* NAVIGATION PANEL */}
        <div className="grid grid-cols-5 border-b border-slate-800 text-center text-[10px] font-bold sticky top-[73px] bg-slate-900 z-10">
          <button 
            onClick={() => setActiveTab('search')} 
            className={`py-3 flex flex-col items-center justify-center gap-1 border-b-2 transition ${activeTab === 'search' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            <i className="fa-solid fa-magnifying-glass text-xs"></i>
            <span>Search</span>
          </button>
          <button 
            onClick={() => setActiveTab('service_bench')} 
            className={`py-3 flex flex-col items-center justify-center gap-1 border-b-2 transition ${activeTab === 'service_bench' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            <i className="fa-solid fa-camera text-xs"></i>
            <span>Service Bench</span>
          </button>
          <button 
            onClick={() => setActiveTab('clean')} 
            className={`py-3 flex flex-col items-center justify-center gap-1 border-b-2 transition ${activeTab === 'clean' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            <i className="fa-solid fa-broom text-xs"></i>
            <span>Services</span>
          </button>
          <button 
            onClick={() => setActiveTab('assistant')} 
            className={`py-3 flex flex-col items-center justify-center gap-1 border-b-2 transition ${activeTab === 'assistant' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            <i className="fa-solid fa-book-quran text-xs"></i>
            <span>Quran & Dua</span>
          </button>
          <button 
            onClick={() => setActiveTab('legal')} 
            className={`py-3 flex flex-col items-center justify-center gap-1 border-b-2 transition ${activeTab === 'legal' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            <i className="fa-solid fa-toolbox text-xs"></i>
            <span>Workbench</span>
          </button>
        </div>

        {/* TAB RENDER */}
        <div className="flex-1">
          {activeTab === 'search' && (
            <SearchTab onLocate={handleLocate} records={records} switchTab={setActiveTab} />
          )}
          {activeTab === 'service_bench' && (
            <UploaderTab 
              mapCenter={currentMapCenter} 
              onAddRecord={(newRec) => setPendingRecords(prev => [newRec, ...prev])} 
              openRouterKey={openRouterKey}
              selectedVisionModel={selectedVisionModel}
              workerAuthenticated={workerAuthenticated}
              setWorkerAuthenticated={setWorkerAuthenticated}
            />
          )}
          {activeTab === 'clean' && (
            <CleanTab />
          )}
          {activeTab === 'assistant' && (
            <AssistantTab 
              openRouterKey={openRouterKey}
              selectedChatModel={selectedChatModel}
            />
          )}
          {activeTab === 'legal' && (
            <WorkbenchTab 
              adminToken={adminToken} 
              setAdminToken={setAdminToken} 
              records={records}
              setRecords={setRecords}
              pendingRecords={pendingRecords}
              setPendingRecords={setPendingRecords}
            />
          )}
        </div>

        <NewsletterWidget />

        <footer className="p-4 bg-slate-950 border-t border-slate-800 text-[10px] text-slate-500 text-center font-sans">
          <p>© {new Date().getFullYear()} QabrCare. Engineered by MrKolapie (Pty) Ltd.</p>
          <p className="mt-1 font-mono text-emerald-600">Al-Mowt - Remembering the hereafter</p>
        </footer>
      </div>

      {/* RIGHT SIDE: INTERACTIVE LEAFLET CARTOGRAPHY */}
      <div className="flex-1 relative h-[40vh] lg:h-full bg-slate-950 pt-8">
        <Map records={records} focusedLocation={focusedLocation} onMapMove={(center) => setCurrentMapCenter(center)} />
        
        {/* HUD OVERLAY */}
        <div className="absolute top-12 left-4 z-[400] pointer-events-none hidden md:block">
          <div className="bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 shadow-xl max-w-xs text-left">
            <h3 className="text-xs font-bold text-white mb-1 flex items-center gap-1">
              <i className="fa-solid fa-map-location-dot text-emerald-400"></i> Gauteng Datasets
            </h3>
            <p className="text-[10px] text-slate-400 leading-normal">
              Selecting active markers queries plot IDs, dual grave layouts, AH dates, and lineage.
            </p>
          </div>
        </div>

        {/* SOCIALS & FLOATING HUD */}
        <div className="absolute bottom-4 right-4 z-[400] flex items-center space-x-2">
          <button 
            onClick={() => window.print()} 
            className="bg-emerald-600 hover:bg-emerald-500 text-white p-2.5 rounded-full shadow-lg transition pointer-events-auto"
            title="Print Current Map View"
          >
            <i className="fa-solid fa-print"></i>
          </button>
          
          <div className="bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800 shadow-lg text-[11px] font-mono font-medium text-emerald-400 flex items-center gap-3">
            <a href="https://www.tiktok.com/@MrKolapie" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition"><i className="fa-brands fa-tiktok"></i></a>
            <a href="https://www.facebook.com/MrKolapie" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition"><i className="fa-brands fa-facebook"></i></a>
            <a href="https://www.instagram.com/zahid.kola.9" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition"><i className="fa-brands fa-instagram"></i></a>
            <a href="https://www.youtube.com/@MrKolapie" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition"><i className="fa-brands fa-youtube"></i></a>
          </div>
        </div>
      </div>

      {/* GLOBAL SETTINGS MODAL */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[999] no-print font-sans">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <i className="fa-solid fa-cloud-bolt text-emerald-400"></i> OpenRouter Gateway Settings
              </h3>
              <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-200">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            
            <form onSubmit={saveSettings} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-semibold uppercase">OpenRouter API Key</label>
                <input 
                  type="password" 
                  value={openRouterKey} 
                  onChange={e => setOpenRouterKey(e.target.value)} 
                  placeholder="sk-or-v1-..." 
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-semibold uppercase">Chat Model</label>
                <select 
                  value={selectedChatModel} 
                  onChange={e => setSelectedChatModel(e.target.value)} 
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-xs text-slate-100 focus:outline-none"
                >
                  {OPENROUTER_MODELS.chat.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-semibold uppercase">Vision Model</label>
                <select 
                  value={selectedVisionModel} 
                  onChange={e => setSelectedVisionModel(e.target.value)} 
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-xs text-slate-100 focus:outline-none"
                >
                  {OPENROUTER_MODELS.vision.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button 
                  type="button" 
                  onClick={() => setShowSettings(false)} 
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs py-2 px-4 rounded-lg transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-4 rounded-lg transition shadow-lg"
                >
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}


function Map({ records, focusedLocation, onMapMove }) {
  const mapRef = useRef(null);
  const markersGroupRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !mapRef.current) {
      const L = window.L;
      if (!L) return;

      mapRef.current = L.map('map-canvas', { zoomControl: false }).setView([-26.302314, 27.871214], 16);
      L.control.zoom({ position: 'topright' }).addTo(mapRef.current);
      
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
      }).addTo(mapRef.current);

      markersGroupRef.current = L.layerGroup().addTo(mapRef.current);

      mapRef.current.on('moveend', () => {
        const center = mapRef.current.getCenter();
        onMapMove({ lat: center.lat, lng: center.lng });
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const L = window.L;
    if (mapRef.current && markersGroupRef.current && L) {
      markersGroupRef.current.clearLayers();

      const coordinateMap = {};
      records.forEach(rec => {
        const coordKey = `${rec.lat.toFixed(6)},${rec.lng.toFixed(6)}`;
        if (!coordinateMap[coordKey]) {
          coordinateMap[coordKey] = [];
        }
        coordinateMap[coordKey].push(rec);
      });

      Object.keys(coordinateMap).forEach(key => {
        const gravesAtCoord = coordinateMap[key];
        const primaryGrave = gravesAtCoord[0];

        const greenPin = L.divIcon({
          html: `<div class="relative flex items-center justify-center">
                   <div class="absolute w-4 h-4 bg-emerald-500/40 rounded-full animate-ping"></div>
                   <div class="bg-emerald-600 border-2 border-white w-3 h-3 rounded-full shadow-lg"></div>
                 </div>`,
          className: 'custom-pin-container',
          iconSize: [16, 16]
        });

        const marker = L.marker([primaryGrave.lat, primaryGrave.lng], { icon: greenPin });

        let popupContent = `<div class="p-2 text-xs bg-slate-900 text-slate-100 rounded-lg font-sans leading-relaxed min-w-[210px] text-left">`;
        
        gravesAtCoord.forEach((rec, idx) => {
          const h = gregorianToHijri(new Date(rec.dod));
          const monthName = HIJRI_MONTHS[h.month - 1] || 'Month';
          popupContent += `
            <div class="${idx > 0 ? 'border-t border-slate-800 pt-2.5 mt-2.5' : ''}">
              <div class="flex items-center justify-between pb-1.5 mb-1.5">
                <h4 class="font-bold text-emerald-400 text-sm">${rec.name} ${rec.surname}</h4>
                <span class="bg-emerald-950/80 text-[9px] text-emerald-400 px-1.5 py-0.5 rounded font-mono border border-emerald-900">${rec.qabr}</span>
              </div>
              <p class="text-slate-300 italic mb-2">"${rec.family}"</p>
              <div class="text-[9px] text-slate-500 font-mono flex items-center justify-between bg-slate-950/50 p-1.5 rounded">
                <span>CE: ${rec.dod}</span>
                <span class="text-emerald-500 font-semibold font-mono">AH: ${h.day} ${monthName} ${h.year}</span>
              </div>
            </div>
          `;
        });

        popupContent += `</div>`;
        marker.bindPopup(popupContent).addTo(markersGroupRef.current);
      });

      if (focusedLocation) {
        mapRef.current.setView([focusedLocation.lat, focusedLocation.lng], 18);
        markersGroupRef.current.eachLayer((m) => {
          if (m.getLatLng().lat === focusedLocation.lat && m.getLatLng().lng === focusedLocation.lng) {
            m.openPopup();
          }
        });
      }
    }
  }, [records, focusedLocation]);

  return (
    <div className="w-full h-full relative">
      <div id="map-canvas" className="w-full h-full z-0 bg-slate-950" />
      {!window.L && (
        <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center text-center p-6">
          <i className="fa-solid fa-earth-africa text-3xl text-emerald-500 animate-spin mb-3"></i>
          <p className="text-sm font-medium text-slate-300">Syncing Gauteng Mapping Framework...</p>
        </div>
      )}
    </div>
  );
}


function SearchTab({ onLocate, records, switchTab }) {
  const [selectedRegion, setSelectedRegion] = useState('Gauteng');
  const [selectedTown, setSelectedTown] = useState('Lenasia');
  const [selectedCemetery, setSelectedCemetery] = useState('lenasia_avalon');
  const [nameQuery, setNameQuery] = useState('');
  const [qabrQuery, setQabrQuery] = useState('');
  const [dateQuery, setDateQuery] = useState('');

  const townsOptions = useMemo(() => {
    return Object.keys(GEOGRAPHY_REGISTRY[selectedRegion]?.cities || {});
  }, [selectedRegion]);

  const cemeteriesOptions = useMemo(() => {
    return GEOGRAPHY_REGISTRY[selectedRegion]?.cities[selectedTown]?.cemeteries || [];
  }, [selectedRegion, selectedTown]);

  const filtered = useMemo(() => {
    return records.filter(rec => {
      const matchesCemetery = rec.cemeteryId === selectedCemetery;
      const matchesName = (
        rec.name.toLowerCase().includes(nameQuery.toLowerCase()) || 
        rec.surname.toLowerCase().includes(nameQuery.toLowerCase()) || 
        (rec.family && rec.family.toLowerCase().includes(nameQuery.toLowerCase()))
      );
      const matchesQabr = rec.qabr.toLowerCase().includes(qabrQuery.toLowerCase());
      const matchesDate = !dateQuery || rec.dod === dateQuery;
      return matchesCemetery && matchesName && matchesQabr && matchesDate;
    });
  }, [selectedCemetery, nameQuery, qabrQuery, dateQuery, records]);

  return (
    <div className="p-5 space-y-5 animate-fadeIn text-left">
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 shadow-inner">
        <div className="flex items-center justify-between">
          <h2 className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Hierarchical Lookups</h2>
          <button onClick={() => switchTab('service_bench')} className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 font-semibold">
            <i className="fa-solid fa-camera"></i> Scan Plate
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-semibold">Region / Province</label>
            <select 
              value={selectedRegion}
              onChange={e => {
                const regVal = e.target.value;
                if (GEOGRAPHY_REGISTRY[regVal]?.locked) {
                  showCustomToast("Region Locked", "This region is currently locked to preserve high-fidelity datasets.", "warning");
                } else {
                  setSelectedRegion(regVal);
                  const firstTown = Object.keys(GEOGRAPHY_REGISTRY[regVal].cities)[0];
                  setSelectedTown(firstTown);
                  setSelectedCemetery(GEOGRAPHY_REGISTRY[regVal].cities[firstTown].cemeteries[0]?.id || '');
                }
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg py-1.5 px-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            >
              {Object.keys(GEOGRAPHY_REGISTRY).map(r => (
                <option key={r} value={r}>{r} {GEOGRAPHY_REGISTRY[r].locked ? '🔒' : ''}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-semibold">Town / Area</label>
            <select 
              value={selectedTown}
              onChange={e => {
                const townVal = e.target.value;
                if (GEOGRAPHY_REGISTRY[selectedRegion].cities[townVal]?.locked) {
                  showCustomToast("Town Locked", "This town dataset is currently locked to ensure zero-contamination entries.", "warning");
                } else {
                  setSelectedTown(townVal);
                  setSelectedCemetery(GEOGRAPHY_REGISTRY[selectedRegion].cities[townVal].cemeteries[0]?.id || '');
                }
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg py-1.5 px-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            >
              {townsOptions.map(t => (
                <option key={t} value={t}>{t} {GEOGRAPHY_REGISTRY[selectedRegion].cities[t]?.locked ? '🔒' : ''}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] text-slate-400 font-semibold font-mono">Cemetery Registry</label>
          <select 
            value={selectedCemetery}
            onChange={e => {
              const selectedCemId = e.target.value;
              const matchingCem = cemeteriesOptions.find(c => c.id === selectedCemId);
              if (matchingCem?.locked) {
                showCustomToast("Cemetery Locked", "Upkeep and records for this cemetery are locked. Currently collecting active datasets.", "warning");
              } else {
                setSelectedCemetery(selectedCemId);
              }
            }}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-1.5 px-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
          >
            {cemeteriesOptions.map(c => (
              <option key={c.id} value={c.id}>{c.name} {c.locked ? '🔒' : ''}</option>
            ))}
          </select>
        </div>

        <hr className="border-slate-900 my-2" />

        <div className="space-y-1">
          <label className="text-[10px] text-slate-400 font-semibold">Deceased Search (Keyword / Surname)</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
              <i className="fa-solid fa-search text-xs"></i>
            </span>
            <input 
              type="text" 
              value={nameQuery} 
              onChange={e => setNameQuery(e.target.value)} 
              placeholder="Query names, surnames, epitaphs..." 
              className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-9 pr-3 text-xs text-slate-100 focus:outline-none focus:border-emerald-500" 
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-semibold">Qabr number : Name & Surname</label>
            <input 
              type="text" 
              value={qabrQuery} 
              onChange={e => setQabrQuery(e.target.value)} 
              placeholder="e.g. G104" 
              className="w-full bg-slate-900 border border-slate-700 rounded-lg py-1.5 px-2.5 text-xs text-slate-100 focus:outline-none" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-semibold">Gregorian DoD</label>
            <input 
              type="date" 
              value={dateQuery} 
              onChange={e => setDateQuery(e.target.value)} 
              className="w-full bg-slate-900 border border-slate-700 rounded-lg py-1 px-2 text-xs text-slate-100 focus:outline-none font-sans" 
            />
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Search Results ({filtered.length})</h3>
          <button 
            onClick={() => {setNameQuery(''); setQabrQuery(''); setDateQuery('');}} 
            className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold font-sans"
          >
            <i className="fa-solid fa-rotate-left mr-1"></i>Reset
          </button>
        </div>
        
        <div className="space-y-2.5 max-h-[300px] lg:max-h-[none] overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <div className="text-center py-10 bg-slate-950 rounded-xl border border-slate-800 text-slate-500 text-xs font-sans">
              <i className="fa-solid fa-folder-open text-2xl mb-2 text-slate-600 block"></i>
              No verified records found matching criteria.
            </div>
          ) : (
            filtered.map(rec => {
              const h = gregorianToHijri(new Date(rec.dod));
              return (
                <div 
                  key={rec.id} 
                  onClick={() => onLocate({lat: rec.lat, lng: rec.lng})} 
                  className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 hover:border-emerald-600 transition cursor-pointer shadow-md group"
                >
                  <div className="flex items-start justify-between text-xs">
                    <div>
                      <h4 className="font-bold text-slate-200 group-hover:text-emerald-400 transition">{rec.name} {rec.surname}</h4>
                      <p className="text-emerald-500 font-mono font-bold text-[10px] mt-0.5">Qabr No: {rec.qabr}</p>
                    </div>
                    {rec.dual_grave && (
                      <span className="text-[9px] bg-amber-500/10 border border-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded font-mono">Shared Plot</span>
                    )}
                  </div>
                  <hr className="border-slate-900 my-2" />
                  <p className="text-[11px] text-slate-300 italic font-sans leading-relaxed">"{rec.family || 'Lineage data registered.'}"</p>
                  <div className="grid grid-cols-2 mt-2.5 text-[9px] text-slate-500 border-t border-slate-900 pt-2 font-mono">
                    <div>CE: {rec.dod}</div>
                    <div className="text-right text-emerald-500 font-bold">AH: {h.day} {HIJRI_MONTHS[h.month - 1]} {h.year}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}


function UploaderTab({ mapCenter, onAddRecord, openRouterKey, selectedVisionModel, workerAuthenticated, setWorkerAuthenticated }) {
  const [workerPassword, setWorkerPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [realAIPending, setRealAIPending] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('Analyze this headstone picture. Extract Full Name, Surname, Grave Number, Gregorian Date of Death (YYYY-MM-DD), and epitaph/lineage.');
  const [base64Image, setBase64Image] = useState('');
  const [isDualGrave, setIsDualGrave] = useState(false);
  
  const [beforeImage, setBeforeImage] = useState('');
  const [afterImage, setAfterImage] = useState('');

  const fileInputRef = useRef(null);
  const beforeInputRef = useRef(null);
  const afterInputRef = useRef(null);

  const [ocrData, setOcrData] = useState({
    name: 'Moosa',
    surname: 'Kajee',
    qabr: 'G502',
    dod: '2026-07-09',
    lineage: 'Beloved father, counselor & dedicated helper to our community.'
  });

  const handleWorkerLogin = (e) => {
    e.preventDefault();
    if (workerPassword === 'Services786') {
      sessionStorage.setItem('qabrcare_worker_auth', 'true');
      setWorkerAuthenticated(true);
      showCustomToast("Access Granted", "Service Bench credentials verified.", "success");
    } else {
      showCustomToast("Unauthorized Access", "Invalid service passcode. Please contact MrKolapie administration.", "warning");
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setLoading(true);
      setScanned(false);

      const reader = new FileReader();
      reader.onload = (ev) => {
        setBase64Image(ev.target.result.split(',')[1]);
      };
      reader.readAsDataURL(file);

      setTimeout(() => {
        setLoading(false);
        setScanned(true);
      }, 1800);
    }
  };

  const compressImageAndSet = (file, setter) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 600;
        const scale = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        setter(dataUrl);
        showCustomToast("Image Compressed", "On-device optimization completed.");
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleRealVisionAI = async () => {
    if (!base64Image) return;
    if (!openRouterKey) {
      showCustomToast("Key Required", "To process visual data via AI, supply your OpenRouter API key in settings.", "warning");
      return;
    }
    
    setRealAIPending(true);
    const url = `https://openrouter.ai/api/v1/chat/completions`;
    const systemPrompt = `You are an expert Islamic epigraphy decipherer. Output your response as a strictly valid, flat JSON object with keys: "name", "surname", "qabr", "dod" (YYYY-MM-DD), and "epitaph".`;
    
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openRouterKey}`,
          "HTTP-Referer": "https://qabrcare.co.za",
          "X-Title": "QabrCare"
        },
        body: JSON.stringify({
          model: selectedVisionModel,
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: `${systemPrompt}\n\nUser request: ${customPrompt}` },
                { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
              ]
            }
          ]
        })
      });
      
      const result = await response.json();
      const content = result.choices?.[0]?.message?.content;
      const cleaned = content.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedText = JSON.parse(cleaned);

      if (parsedText) {
        setOcrData({
          name: parsedText.name || '',
          surname: parsedText.surname || '',
          qabr: parsedText.qabr || '',
          dod: parsedText.dod || '',
          lineage: parsedText.epitaph || ''
        });
        showCustomToast("AI Decipher Complete", "Grave registry fields updated successfully.", "success");
      }
    } catch (err) {
      console.error(err);
      showCustomToast("AI Processing Error", "Vision decoding failed. Using fallback simulation.", "warning");
    } finally {
      setRealAIPending(false);
    }
  };

  const handleCommit = (e) => {
    e.preventDefault();
    
    const newRecord = {
      id: 'QC-' + Math.floor(Math.random() * 90000 + 10000),
      name: ocrData.name,
      surname: ocrData.surname,
      qabr: ocrData.qabr,
      cemeteryId: 'lenasia_avalon',
      lat: mapCenter.lat,
      lng: mapCenter.lng,
      dod: ocrData.dod,
      family: ocrData.lineage,
      dual_grave: isDualGrave,
      before_image: beforeImage,
      after_image: afterImage,
      approved: false
    };

    onAddRecord(newRecord);
    setScanned(false);
    setBase64Image('');
    setBeforeImage('');
    setAfterImage('');
    setIsDualGrave(false);
    showCustomToast("Registered to Queue", `Plot ${newRecord.qabr} sent to Admin Workbench for validation.`, "success");
  };

  if (!workerAuthenticated) {
    return (
      <div className="p-5 space-y-5 animate-fadeIn text-left">
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 text-emerald-400 border-b border-slate-900 pb-2.5">
            <i className="fa-solid fa-shield-halved text-xl"></i>
            <h2 className="font-bold text-sm text-slate-200">Grave Workers Portal</h2>
          </div>
          <p className="text-[11px] text-slate-400 leading-normal font-sans">
            Authentication is required. To maintain high-fidelity data and clean registries from inception, scanning and upload functions are locked strictly to trained service field members.
          </p>
          <form onSubmit={handleWorkerLogin} className="space-y-3">
            <div>
              <label className="text-[10px] text-slate-400 font-semibold uppercase font-mono">Service Passcode</label>
              <input 
                type="password" 
                value={workerPassword} 
                onChange={e => setWorkerPassword(e.target.value)} 
                placeholder="Enter service passcode..." 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-mono" 
              />
            </div>
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-4 rounded-lg transition shadow-lg font-sans">
              Authenticate Scanner
            </button>
          </form>
        </div>
      </div>
    );
  }

  const h = ocrData.dod ? gregorianToHijri(new Date(ocrData.dod)) : null;

  return (
    <div className="p-5 space-y-5 animate-fadeIn text-left">
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-sans">
        <div className="flex items-center justify-between text-emerald-400">
          <div className="flex items-center space-x-2">
            <i className="fa-solid fa-microchip text-xl"></i>
            <h2 className="font-bold text-sm text-slate-200 font-mono">Edge Scanner (Lenasia Avalon)</h2>
          </div>
          <button 
            onClick={() => { setWorkerAuthenticated(false); sessionStorage.removeItem('qabrcare_worker_auth'); }} 
            className="text-[10px] font-mono text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded hover:bg-amber-500/5"
          >
            Lock
          </button>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Upload a high-contrast photo of a grave marker to extract name, qabr, and dates instantly.
        </p>

        <div 
          className="border-2 border-dashed border-slate-700 hover:border-emerald-600 rounded-xl p-5 text-center cursor-pointer transition relative" 
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileChange} 
          />
          <i className="fa-solid fa-camera-retro text-3xl text-slate-500 mb-2"></i>
          <p className="text-xs font-semibold">Scan Grave Plate</p>
        </div>

        {loading && (
          <div className="flex items-center justify-center space-x-2 text-emerald-400 py-3 text-xs bg-slate-900 rounded-lg border border-slate-800">
            <i className="fa-solid fa-circle-notch fa-spin"></i>
            <span>Analyzing epigraphy patterns...</span>
          </div>
        )}

        {base64Image && scanned && (
          <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-emerald-400 font-bold uppercase"><i className="fa-solid fa-brain mr-1"></i> Edge API Parser</span>
            </div>
            <input 
              type="text" 
              value={customPrompt} 
              onChange={e => setCustomPrompt(e.target.value)} 
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-[11px] text-slate-200" 
            />
            <button 
              onClick={handleRealVisionAI} 
              disabled={realAIPending}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] py-1 px-3 rounded border border-slate-700 transition cursor-pointer"
            >
              {realAIPending ? "Deciphering..." : "Run Optical Vision OCR"}
            </button>
          </div>
        )}

        {scanned && !loading && (
          <form className="space-y-3.5 pt-2" onSubmit={handleCommit}>
            
            {/* EVIDENCE PROOFS */}
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2">
              <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Grave Care Field Evidence Proofs</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <button 
                    type="button" 
                    onClick={() => beforeInputRef.current?.click()} 
                    className="w-full bg-slate-950 hover:bg-slate-800 border border-slate-700 rounded p-2 text-center text-xs"
                  >
                    <i className="fa-solid fa-camera text-slate-400 mr-1.5"></i>
                    {beforeImage ? "Before Captured ✓" : "Snap Before Care"}
                  </button>
                  <input 
                    type="file" 
                    ref={beforeInputRef} 
                    accept="image/*" 
                    className="hidden" 
                    onChange={e => compressImageAndSet(e.target.files[0], setBeforeImage)} 
                  />
                  {beforeImage && <img src={beforeImage} className="w-full h-16 object-cover mt-1 rounded border border-slate-700" alt="Before proof" />}
                </div>
                <div>
                  <button 
                    type="button" 
                    onClick={() => afterInputRef.current?.click()} 
                    className="w-full bg-slate-950 hover:bg-slate-800 border border-slate-700 rounded p-2 text-center text-xs"
                  >
                    <i className="fa-solid fa-camera text-slate-400 mr-1.5"></i>
                    {afterImage ? "After Captured ✓" : "Snap After Care"}
                  </button>
                  <input 
                    type="file" 
                    ref={afterInputRef} 
                    accept="image/*" 
                    className="hidden" 
                    onChange={e => compressImageAndSet(e.target.files[0], setAfterImage)} 
                  />
                  {afterImage && <img src={afterImage} className="w-full h-16 object-cover mt-1 rounded border border-slate-700" alt="After proof" />}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 font-semibold">First Name</label>
                <input 
                  type="text" 
                  value={ocrData.name} 
                  onChange={e => setOcrData({...ocrData, name: e.target.value})} 
                  required 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg py-1.5 px-2.5 text-xs text-slate-100" 
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-semibold">Surname</label>
                <input 
                  type="text" 
                  value={ocrData.surname} 
                  onChange={e => setOcrData({...ocrData, surname: e.target.value})} 
                  required 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg py-1.5 px-2.5 text-xs text-slate-100" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 font-semibold">Grave Plot Number</label>
                <input 
                  type="text" 
                  value={ocrData.qabr} 
                  onChange={e => setOcrData({...ocrData, qabr: e.target.value})} 
                  required 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg py-1.5 px-2.5 text-xs text-slate-100" 
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-semibold">DOD (Gregorian)</label>
                <input 
                  type="date" 
                  value={ocrData.dod} 
                  onChange={e => setOcrData({...ocrData, dod: e.target.value})} 
                  required 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg py-1 px-2 text-xs text-slate-100 font-sans" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 font-semibold">Islamic Hijri Date</label>
                <input 
                  type="text" 
                  readOnly 
                  value={h ? `${h.day} ${HIJRI_MONTHS[h.month - 1]} ${h.year} AH` : ''} 
                  className="w-full bg-slate-900/60 border border-slate-850 rounded-lg py-1.5 px-2.5 text-xs text-emerald-400 font-semibold cursor-not-allowed" 
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-semibold">Coordinates</label>
                <input 
                  type="text" 
                  readOnly 
                  value={`${mapCenter.lat.toFixed(6)}, ${mapCenter.lng.toFixed(6)}`} 
                  className="w-full bg-slate-900/60 border border-slate-850 rounded-lg py-1.5 px-2.5 text-xs text-slate-400 cursor-not-allowed" 
                />
              </div>
            </div>

            {/* DUAL QABR */}
            <div className="flex items-center space-x-2 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              <input 
                type="checkbox" 
                id="dual_grave_upload" 
                checked={isDualGrave} 
                onChange={e => setIsDualGrave(e.target.checked)} 
                className="w-4 h-4 text-emerald-500 accent-emerald-500"
              />
              <label htmlFor="dual_grave_upload" className="text-xs text-slate-300 font-semibold select-none cursor-pointer">
                Dual Burial (Shares plot coordinates with existing deceased)
              </label>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 font-semibold">Lineage / Epitaph</label>
              <textarea 
                rows={2} 
                value={ocrData.lineage} 
                onChange={e => setOcrData({...ocrData, lineage: e.target.value})} 
                required 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-1.5 px-2.5 text-xs text-slate-100 focus:outline-none"
              ></textarea>
            </div>

            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 px-4 rounded-lg transition shadow-lg flex items-center justify-center gap-1.5 cursor-pointer">
              <i className="fa-solid fa-upload"></i> Upload & Sync to Local Map
            </button>
          </form>
        )}
      </div>
    </div>
  );
}


function CleanTab() {
  const [qty, setQty] = useState(1);
  const [sponsorOption, setSponsorOption] = useState(0); 
  const [treeQty, setTreeQty] = useState(0);
  const [gateway, setGateway] = useState('Yoco');
  const [targetDetails, setTargetDetails] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [showInvoice, setShowInvoice] = useState(false);
  const [printInvoiceData, setPrintInvoiceData] = useState(null);

  const [graveDetails, setGraveDetails] = useState([{ qabr: '', name: '', surname: '', dod: '', family: '' }]);

  const [debitBank, setDebitBank] = useState('');
  const [debitAccount, setDebitAccount] = useState('');

  const handleQuantityChange = (val) => {
    const numericQty = parseInt(val, 10);
    setQty(numericQty);
    const updatedDetails = Array.from({ length: numericQty }, (_, i) => {
      return graveDetails[i] || { qabr: '', name: '', surname: '', dod: '', family: '' };
    });
    setGraveDetails(updatedDetails);
  };

  const handleGraveDetailChange = (index, field, value) => {
    const updated = [...graveDetails];
    updated[index][field] = value;
    setGraveDetails(updated);
  };

  const costs = useMemo(() => {
    let quantityCents = 0;
    if (qty === 1) quantityCents = 10000;
    else if (qty === 5) quantityCents = 25000;
    else if (qty === 10) quantityCents = 50000;
    else if (qty === 15) quantityCents = 75000;
    else if (qty === 20) quantityCents = 110000;

    let sponsorCents = 0;
    if (sponsorOption === 1) sponsorCents = 10000;
    else if (sponsorOption === 5) sponsorCents = 25000;
    else if (sponsorOption === 10) sponsorCents = 50000;
    else if (sponsorOption === 20) sponsorCents = 110000;

    const treeCents = treeQty * 15000;
    const totalCents = quantityCents + sponsorCents + treeCents;

    let targetYoco = "https://pay.yoco.com/mrkolapie";
    if (qty === 1 && sponsorOption === 0 && treeQty === 0) targetYoco = "https://pay.yoco.com/r/7KEpyq";
    else if (qty === 5 && sponsorOption === 0 && treeQty === 0) targetYoco = "https://pay.yoco.com/r/2Yv86B";
    else if (qty === 10 && sponsorOption === 0 && treeQty === 0) targetYoco = "https://pay.yoco.com/r/mRP8dQ";
    else if (qty === 15 && sponsorOption === 0 && treeQty === 0) targetYoco = "https://pay.yoco.com/r/2QV85R";
    else if (qty === 20 && sponsorOption === 0 && treeQty === 0) targetYoco = "https://pay.yoco.com/r/70GDoB";

    return {
      quantityPrice: `R${(quantityCents / 100).toFixed(2)}`,
      sponsorPrice: `R${(sponsorCents / 100).toFixed(2)}`,
      treePrice: `R${(treeCents / 100).toFixed(2)}`,
      totalPrice: `R${(totalCents / 100).toFixed(2)}`,
      totalCents,
      yocoUrl: targetYoco
    };
  }, [qty, sponsorOption, treeQty]);

  const generateInvoice = (e) => {
    e.preventDefault();
    setShowInvoice(true);

    const orderId = 'ORD-' + Math.floor(Math.random() * 90000 + 10000);
    const orderData = {
      id: orderId,
      client_name: clientName,
      client_email: clientEmail,
      client_phone: clientPhone,
      qty,
      sponsor_qty: sponsorOption,
      tree_qty: treeQty,
      gateway,
      total_price: costs.totalPrice,
      graves_detailed: JSON.stringify(graveDetails)
    };

    setPrintInvoiceData(orderData);

    const detailedGravesText = graveDetails.map((g, idx) => {
      return `Grave #${idx + 1}: ${g.name} ${g.surname} [Qabr: ${g.qabr || 'N/A'}, DoD: ${g.dod || 'N/A'}]`;
    }).join('\n');

    const msg = `Assalamu Alaikum QabrCare,\n\nI have placed a new grave maintenance order with MrKolapie Pty Ltd.\n\n` +
                `Order ID: ${orderId}\n` +
                `Client: ${clientName} (${clientEmail} / ${clientPhone})\n` +
                `Qty (Our Graves): ${qty} Plots\n` +
                `Qty (Waqf Sponsor): ${sponsorOption} Plots\n` +
                `Shrubs Planted: ${treeQty}\n` +
                `Payment Selected: ${gateway}\n` +
                `Total Sum: ${costs.totalPrice}\n\n` +
                `--- Target Grave Specifications ---\n` +
                `${detailedGravesText || 'Waqf General Sponsorship Campaign Only.'}\n\n` +
                `Please verify our payment status. Shukran!`;

    setTimeout(() => {
      window.open(`https://wa.me/27627947136?text=${encodeURIComponent(msg)}`, '_blank');
      setShowInvoice(false);
    }, 1500);
  };

  return (
    <div className="p-5 space-y-5 animate-fadeIn text-left font-sans">
      <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
        <div className="flex items-center space-x-2 text-emerald-400">
          <i className="fa-solid fa-broom-ball text-xl"></i>
          <div>
            <h2 className="font-bold text-sm text-slate-200">Lenasia Avalon Cleanup & Care</h2>
            <p className="text-[9px] text-emerald-500 uppercase tracking-widest font-mono">MrKolapie Pty Ltd ™ Official WAQF Care</p>
          </div>
        </div>

        <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 space-y-1.5 text-[11px] text-slate-400">
          <h3 className="font-bold text-slate-300 border-b border-slate-800 pb-1 text-xs">Care Campaigns</h3>
          <div className="grid grid-cols-2 gap-1 font-mono text-[10px]">
            <div>1 Grave Plot Upkeep:</div><div className="text-right text-emerald-400 font-bold">R100.00</div>
            <div>5 Grave Plots Campaign:</div><div className="text-right text-emerald-400 font-bold">R250.00</div>
            <div>10 Grave Plots Campaign:</div><div className="text-right text-emerald-400 font-bold">R500.00</div>
            <div>15 Grave Plots Campaign:</div><div className="text-right text-emerald-400 font-bold">R750.00</div>
            <div>20 Grave Plots Campaign:</div><div className="text-right text-emerald-400 font-bold">R1100.00</div>
          </div>
        </div>

        <form className="space-y-3" onSubmit={generateInvoice}>
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[10px] text-slate-400 font-semibold uppercase">Quantity (Own Graves)</label>
              <select 
                value={qty} 
                onChange={e => handleQuantityChange(e.target.value)} 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-1.5 px-2.5 text-xs text-slate-100 focus:outline-none"
              >
                <option value="1">1 Grave Plot (R100)</option>
                <option value="5">5 Grave Plots (R250)</option>
                <option value="10">10 Grave Plots (R500)</option>
                <option value="15">15 Grave Plots (R750)</option>
                <option value="20">20 Grave Plots (R1100)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-semibold uppercase">Optional Native Shrub</label>
              <select 
                value={treeQty} 
                onChange={e => setTreeQty(parseInt(e.target.value, 10))} 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-1.5 px-2.5 text-xs text-slate-100 focus:outline-none"
              >
                <option value="0">No Shrub (R0)</option>
                <option value="1">1 Native Shrub (+R150)</option>
                <option value="2">2 Native Shrubs (+R300)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[10px] text-slate-400 font-semibold uppercase">Sponsor Waqf</label>
              <select 
                value={sponsorOption}
                onChange={e => setSponsorOption(parseInt(e.target.value, 10))} 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-1.5 px-2.5 text-xs text-slate-100 focus:outline-none"
              >
                <option value="0">No Sponsorship (R0)</option>
                <option value="1">Sponsor 1 Grave Plot (R100)</option>
                <option value="5">Sponsor 5 Grave Plots (R250)</option>
                <option value="10">Sponsor 10 Grave Plots (R500)</option>
                <option value="20">Sponsor 20 Grave Plots (R1100)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-semibold uppercase">Payment Gateway</label>
              <select 
                value={gateway} 
                onChange={e => setGateway(e.target.value)} 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-1.5 px-2.5 text-xs text-slate-100 focus:outline-none"
              >
                <option value="Yoco">Yoco API (Instant EFT & Card)</option>
                <option value="Capitec">Capitec PayByLink</option>
                <option value="DebitOrder">Monthly Netcash Debit</option>
              </select>
            </div>
          </div>

          {gateway === 'DebitOrder' && (
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2.5 transition">
              <h4 className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                <i className="fa-solid fa-file-signature"></i> Netcash eMandate Authorization
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-slate-400">South African Bank</label>
                  <input 
                    type="text" 
                    value={debitBank} 
                    onChange={e => setDebitBank(e.target.value)} 
                    placeholder="e.g. Standard, Capitec, FNB" 
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-1 px-2 text-xs text-slate-100 focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="text-[9px] text-slate-400">Account Number</label>
                  <input 
                    type="text" 
                    value={debitAccount} 
                    onChange={e => setDebitAccount(e.target.value)} 
                    placeholder="e.g. 1012354920" 
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-1 px-2 text-xs text-slate-100 focus:outline-none" 
                  />
                </div>
              </div>
            </div>
          )}

          <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-4">
            <h4 className="text-[11px] font-bold text-emerald-400 border-b border-slate-800 pb-1.5">
              <i className="fa-solid fa-clipboard-list mr-1.5"></i> Target Grave Details ({qty} Plots)
            </h4>
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {graveDetails.map((grave, index) => (
                <div key={index} className="space-y-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs">
                  <div className="font-bold text-slate-400 text-[10px] uppercase font-mono">
                    Grave #{index + 1} Specifications
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="text"
                      placeholder="Qabr Number (e.g. G104)"
                      required
                      value={grave.qabr}
                      onChange={e => handleGraveDetailChange(index, 'qabr', e.target.value)}
                      className="bg-slate-900 border border-slate-700 p-1.5 rounded text-slate-200 text-[11px]"
                    />
                    <input 
                      type="date"
                      required
                      value={grave.dod}
                      onChange={e => handleGraveDetailChange(index, 'dod', e.target.value)}
                      className="bg-slate-900 border border-slate-700 p-1.5 rounded text-slate-200 text-[11px]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="text"
                      placeholder="Deceased First Name"
                      required
                      value={grave.name}
                      onChange={e => handleGraveDetailChange(index, 'name', e.target.value)}
                      className="bg-slate-900 border border-slate-700 p-1.5 rounded text-slate-200 text-[11px]"
                    />
                    <input 
                      type="text"
                      placeholder="Deceased Surname"
                      required
                      value={grave.surname}
                      onChange={e => handleGraveDetailChange(index, 'surname', e.target.value)}
                      className="bg-slate-900 border border-slate-700 p-1.5 rounded text-slate-200 text-[11px]"
                    />
                  </div>
                  <input 
                    type="text"
                    placeholder="Lineage description / Epitaph"
                    value={grave.family}
                    onChange={e => handleGraveDetailChange(index, 'family', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 p-1.5 rounded text-slate-200 text-[11px]"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 border-t border-slate-800 pt-3">
            <div>
              <label className="text-[10px] text-slate-400 font-semibold">General Sponsor Dedication Message (Optional)</label>
              <input 
                type="text" 
                value={targetDetails} 
                onChange={e => setTargetDetails(e.target.value)} 
                placeholder="e.g. In memory of the Jassiem family / Waqf Esal-e-Sawab" 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-1.5 px-2.5 text-xs text-slate-100 focus:outline-none" 
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 font-semibold">Your Full Name</label>
                <input 
                  type="text" 
                  value={clientName} 
                  onChange={e => setClientName(e.target.value)} 
                  required 
                  placeholder="e.g. Zahid Kola" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg py-1.5 px-2.5 text-xs text-slate-100 focus:outline-none" 
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-semibold">Email Address</label>
                <input 
                  type="email" 
                  value={clientEmail} 
                  onChange={e => setClientEmail(e.target.value)} 
                  required 
                  placeholder="e.g. support@mrkolapie.co.za" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg py-1.5 px-2.5 text-xs text-slate-100 focus:outline-none" 
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-semibold">Phone Number</label>
                <input 
                  type="text" 
                  value={clientPhone} 
                  onChange={e => setClientPhone(e.target.value)} 
                  required 
                  placeholder="e.g. 0627947136" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg py-1.5 px-2.5 text-xs text-slate-100 focus:outline-none" 
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1 text-xs">
            <div className="flex justify-between font-mono">
              <span className="text-slate-400">Grave Cleaning Total:</span>
              <span className="text-slate-200 font-semibold">{costs.quantityPrice}</span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-slate-400">Waqf Sponsorship Total:</span>
              <span className="text-slate-200 font-semibold">{costs.sponsorPrice}</span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-slate-400">Shrub & Greenery Planting:</span>
              <span className="text-slate-200 font-semibold">{costs.treePrice}</span>
            </div>
            <div className="flex justify-between border-t border-slate-800 pt-1 text-sm font-bold font-mono">
              <span className="text-emerald-400">Total Invoice Sum:</span>
              <span className="text-emerald-400">{costs.totalPrice}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button 
              type="submit" 
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 px-3 rounded-lg transition shadow-lg flex items-center justify-center gap-1.5 cursor-pointer font-sans"
            >
              <i className="fa-brands fa-whatsapp"></i> Order & Route
            </button>
            
            {gateway === 'Yoco' ? (
              <a 
                href={costs.yocoUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs py-2.5 px-3 rounded-lg border border-slate-700 transition flex items-center justify-center gap-1.5 cursor-pointer text-center font-sans"
              >
                <i className="fa-solid fa-credit-card"></i> Pay via Yoco Card
              </a>
            ) : (
              <button 
                type="button"
                onClick={() => showCustomToast("Direct EFT Instruction", "Account details: Capitec Business Bank, Branch Code: 450105, Acc: 1053933452. Please use your Surname & Plot number as reference.", "info")} 
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs py-2.5 px-3 rounded-lg border border-slate-700 transition flex items-center justify-center gap-1.5 cursor-pointer font-sans"
              >
                <i className="fa-solid fa-building-columns"></i> View EFT Details
              </button>
            )}
          </div>
        </form>

        {printInvoiceData && (
          <div className="bg-slate-900 border border-emerald-500/30 p-4 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <i className="fa-solid fa-file-pdf"></i> Branded PDF Receipt Ready
            </h4>
            <p className="text-[10px] text-slate-400">Click below to load a print-ready deed invoice of your sponsorship.</p>
            <button 
              type="button"
              onClick={() => {
                const printWindow = window.open('', '_blank');
                printWindow.document.write(`
                  <html>
                    <head>
                      <title>Invoice Certificate - MrKolapie Pty Ltd</title>
                      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                    </head>
                    <body class="bg-white text-slate-900 p-8 font-sans">
                      <div class="border-4 border-double border-emerald-600 p-8 rounded-2xl max-w-2xl mx-auto">
                        <div class="flex items-center justify-between border-b-2 border-slate-100 pb-4 mb-6">
                          <div>
                            <h1 class="text-2xl font-black text-emerald-700">MRKOLAPIE PTY LTD</h1>
                            <p class="text-xs text-slate-500 font-mono">Reg No: 2025/537780/07</p>
                          </div>
                          <div class="text-right">
                            <h2 class="text-lg font-bold text-slate-800">QABRCARE DEED</h2>
                            <p class="text-xs text-slate-500">Order Ref: ${printInvoiceData.id}</p>
                          </div>
                        </div>
                        <div class="space-y-4 text-xs">
                          <p><strong>Deceased Details / Message:</strong> ${printInvoiceData.target_details || 'General Waqf Sponsorship'}</p>
                          <p><strong>Sponsor Client:</strong> ${printInvoiceData.client_name} (${printInvoiceData.client_email})</p>
                          <p><strong>Own Clean Quantity:</strong> ${printInvoiceData.qty} Plots</p>
                          <p><strong>Sponsorship Campaign Qty:</strong> ${printInvoiceData.sponsor_qty} Plots</p>
                          <p><strong>Native Shrubs:</strong> ${printInvoiceData.tree_qty}</p>
                          <hr class="border-slate-100" />
                          <div class="flex justify-between font-mono font-bold text-sm bg-slate-50 p-3 rounded">
                            <span>Total Contribution:</span>
                            <span class="text-emerald-700">${printInvoiceData.total_price}</span>
                          </div>
                          <div class="pt-6 text-center text-[10px] text-slate-400 border-t border-slate-100 font-mono">
                            Thank you for your generous contribution to community grave maintenance waqf.
                          </div>
                        </div>
                      </div>
                      <script>window.print();</script>
                    </body>
                  </html>
                `);
                printWindow.document.close();
              }}
              className="w-full bg-slate-850 hover:bg-slate-800 text-slate-200 font-semibold text-xs py-1.5 px-3 rounded border border-slate-700 transition cursor-pointer text-center"
            >
              Print Clean PDF Receipt
            </button>
          </div>
        )}

        {showInvoice && (
          <div className="bg-emerald-950/40 p-3 rounded-lg border border-emerald-900/50 space-y-1.5 text-center text-[11px] animate-pulse">
            <p className="text-emerald-400 font-bold"><i className="fa-solid fa-spinner fa-spin mr-1.5"></i>Syncing details to WhatsApp flow...</p>
          </div>
        )}
      </div>
    </div>
  );
}


function AssistantTab({ openRouterKey, selectedChatModel }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Assalamu Alaikum. I am your serverless QabrCare Islamic Scholar & Cemetery Companion. Ask me about visiting etiquette (Ziyarah), du\'as, shroud requirements, or cemetery visitation standards.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedSurah, setSelectedSurah] = useState('1'); 
  const [selectedEdition, setSelectedEdition] = useState('eng-clearquran'); 
  const [quranData, setQuranData] = useState(null);
  const [quranLoading, setQuranLoading] = useState(false);

  useEffect(() => {
    async function fetchQuran() {
      setQuranLoading(true);
      try {
        const arabicUrlPrimary = `https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/ara-quranuthmani/${selectedSurah}.min.json`;
        const arabicUrlSecondary = `https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/ara-quranuthmani/${selectedSurah}.json`;
        
        const transUrlPrimary = `https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/${selectedEdition}/${selectedSurah}.min.json`;
        const transUrlSecondary = `https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/${selectedEdition}/${selectedSurah}.json`;

        const fetchWithFallback = async (primary, secondary) => {
          try {
            const res = await fetch(primary);
            if (!res.ok) throw new Error("Primary fetch failed");
            return await res.json();
          } catch (e) {
            const res = await fetch(secondary);
            if (!res.ok) throw new Error("Secondary fetch failed");
            return await res.json();
          }
        };

        const [araData, transData] = await Promise.all([
          fetchWithFallback(arabicUrlPrimary, arabicUrlSecondary),
          fetchWithFallback(transUrlPrimary, transUrlSecondary)
        ]);

        const araVerses = araData.chapter || araData.quran || [];
        const transVerses = transData.chapter || transData.quran || [];

        const surahMetadata = {
          '1': { name: 'Al-Fatiha', translatedName: 'The Opening', revelation: 'Meccan', count: 7 },
          '112': { name: 'Al-Ikhlas', translatedName: 'Sincerity', revelation: 'Meccan', count: 4 },
          '113': { name: 'Al-Falaq', translatedName: 'Daybreak', revelation: 'Meccan', count: 5 },
          '114': { name: 'An-Nas', translatedName: 'Mankind', revelation: 'Meccan', count: 6 },
        };

        const meta = surahMetadata[selectedSurah] || { name: 'Surah', translatedName: 'Chapter', revelation: 'Meccan', count: araVerses.length };

        setQuranData({
          name: meta.name,
          translatedName: meta.translatedName,
          revelation: meta.revelation,
          ayatsCount: meta.count,
          ayahs: araVerses,
          translationAyahs: transVerses
        });
      } catch (e) {
        console.warn("Quran API failed. Reverting to pristine on-device offline database.");
        setQuranData(OFFLINE_QURAN[selectedSurah] || OFFLINE_QURAN['1']);
      } finally {
        setQuranLoading(false);
      }
    }
    fetchQuran();
  }, [selectedSurah, selectedEdition]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    if (!openRouterKey) {
      setMessages(prev => [...prev, { role: 'assistant', content: "API Key is missing! To receive real-time scholar replies securely, click the settings gear icon in the top right header and enter your OpenRouter key." }]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openRouterKey}`,
          "HTTP-Referer": "https://qabrcare.co.za",
          "X-Title": "QabrCare Portal"
        },
        body: JSON.stringify({
          model: selectedChatModel,
          messages: [
            { 
              role: "system", 
              content: "You are a deeply respectful, compassionate Islamic cemetery visiting companion. Only provide authentic rulings from traditional consensus (Hanafi/Shafi'i). Never hallucinate or make up custom parameters. Speak softly and empathetically as users may be grieving the loss of loved ones." 
            },
            { role: "user", content: userMessage.content }
          ]
        })
      });

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || "No response received. Please try again.";
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "An error occurred. Standard serverless mock response: Ensure your OpenRouter API token has sufficient free quota." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 space-y-5 animate-fadeIn text-left font-sans">
      <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
        <div className="flex items-center space-x-3 text-emerald-400">
          <i className="fa-solid fa-book-quran text-2xl"></i>
          <div>
            <h2 className="font-bold text-slate-100 text-sm">Al-Quran Cloud Live Library</h2>
            <p className="text-[9px] text-slate-400 font-mono">100% Authentic Arabic Uthmani Recitation Engine</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <select 
              value={selectedSurah} 
              onChange={e => setSelectedSurah(e.target.value)} 
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-slate-100 focus:outline-none"
            >
              <option value="1">Surah Al-Fatiha (The Opening)</option>
              <option value="112">Surah Al-Ikhlas (Sincerity)</option>
              <option value="113">Surah Al-Falaq (Daybreak)</option>
              <option value="114">Surah An-Nas (Mankind)</option>
            </select>

            <select 
              value={selectedEdition} 
              onChange={e => setSelectedEdition(e.target.value)} 
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-slate-100 focus:outline-none"
            >
              <option value="eng-clearquran">The Clear Quran (Mustafa Khattab)</option>
              <option value="eng-sahih">Sahih International (Golden Standard)</option>
            </select>
          </div>

          <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 text-[10px] text-slate-400 space-y-1.5 font-mono">
            <div className="flex justify-between">
              <span>Ta'auz Arabic:</span>
              <span className="text-emerald-400" dir="rtl">أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ</span>
            </div>
            <div className="flex justify-between">
              <span>Bismillah Arabic:</span>
              <span className="text-emerald-400" dir="rtl">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
            </div>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-4 max-h-72 overflow-y-auto">
            {quranLoading ? (
              <div className="flex items-center justify-center space-x-2 text-emerald-400 text-xs py-10">
                <i className="fa-solid fa-spinner fa-spin"></i>
                <span>Fetching verified Uthmani script...</span>
              </div>
            ) : quranData ? (
              <>
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1 text-xs">
                  <h3 className="font-bold text-emerald-400">Surah {quranData.name} ({quranData.translatedName})</h3>
                  <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wide">
                    {quranData.revelation} • {quranData.ayatsCount} Ayats
                  </span>
                </div>
                {quranData.ayahs.map((ayah, i) => (
                  <div key={i} className="space-y-1.5 pt-2 text-xs border-b border-slate-900/50 pb-2 text-left">
                    <div className="text-right font-serif text-base leading-loose text-slate-100" dir="rtl">
                      {ayah.text} <span className="text-[10px] text-emerald-600 font-mono">({i + 1})</span>
                    </div>
                    <div className="text-slate-400 italic text-[11px]">{quranData.translationAyahs[i]?.text}</div>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-slate-500 text-xs text-center py-10">
                Could not establish secure connection to Al-Quran API.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-slate-300 border-b border-slate-800 pb-2 flex items-center gap-1.5">
          <i className="fa-solid fa-hands-praying text-emerald-400"></i> Authentic Sunnah Duas
        </h3>
        <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
          {AUTHENTIC_DUAS.map((d, i) => (
            <div key={i} className="space-y-2 pb-2 border-b border-slate-900/50">
              <h4 className="font-bold text-emerald-400 text-[11px] font-mono">{d.title}</h4>
              <p className="text-right font-serif text-sm leading-loose text-slate-100" dir="rtl">{d.ar}</p>
              <p className="text-slate-400 text-[11px] italic">{d.en}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col h-[350px] justify-between">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 mb-2 text-left">
          <i className="fa-solid fa-circle-question text-emerald-400"></i>
          <h3 className="font-bold text-xs text-slate-200 font-mono">Scholar Compassionate Companion AI</h3>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs text-left">
          {messages.map((m, idx) => (
            <div key={idx} className={`p-2.5 rounded-lg max-w-[85%] leading-relaxed ${m.role === 'assistant' ? 'bg-slate-900 text-slate-200 self-start border border-slate-800' : 'bg-emerald-950/80 text-emerald-100 self-end ml-auto border border-emerald-900/40'}`}>
              <p className="font-semibold text-[10px] text-slate-400 mb-0.5 uppercase tracking-wide">
                {m.role === 'assistant' ? 'Scholar' : 'You'}
              </p>
              <p className="whitespace-pre-wrap">{m.content}</p>
            </div>
          ))}
          {loading && (
            <div className="flex items-center space-x-2 text-slate-400 text-[11px] p-2 bg-slate-900/50 rounded-lg w-32 border border-slate-800">
              <i className="fa-solid fa-spinner fa-spin"></i>
              <span>Seeking knowledge...</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="mt-3 flex gap-2">
          <input 
            type="text" 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            placeholder="Ask respectful visiting or legal cemetery questions..." 
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg py-1.5 px-3 text-xs text-slate-100 focus:outline-none focus:border-emerald-500" 
          />
          <button 
            type="submit" 
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 rounded-lg transition cursor-pointer"
          >
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
  );
}


function WorkbenchTab({ adminToken, setAdminToken, records, setRecords, pendingRecords, setPendingRecords }) {
  const [password, setPassword] = useState('');
  const [showLegalPanel, setShowLegalPanel] = useState(true);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'MrKolapie786') {
      sessionStorage.setItem('mrkolapie_admin_token', 'AUTHORIZED');
      setAdminToken('AUTHORIZED');
      showCustomToast("Login Successful", "Zahid Kola, you have entered the secure workbench.", "success");
    } else {
      showCustomToast("Unauthorized", "Incorrect password credential provided.", "warning");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('mrkolapie_admin_token');
    setAdminToken('');
    setPassword('');
  };

  const handleApprove = (rec) => {
    const approvedRec = { ...rec, approved: true };
    setRecords(prev => [approvedRec, ...prev]);
    setPendingRecords(prev => prev.filter(p => p.id !== rec.id));
    showCustomToast("Record Approved", `${rec.name} ${rec.surname} merged into production registry and plotted on live maps.`, "success");
  };

  const handleDecline = (recId) => {
    setPendingRecords(prev => prev.filter(p => p.id !== recId));
    showCustomToast("Submission Declined", "Submission purged from pending validation queues.", "info");
  };

  return (
    <div className="p-5 space-y-5 animate-fadeIn text-left font-sans">
      {showLegalPanel && (
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-900 pb-2">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <i className="fa-solid fa-scale-balanced"></i> Public Governance & Legal Compliance
            </h3>
            <button onClick={() => setShowLegalPanel(false)} className="text-[10px] text-slate-500 hover:text-slate-300">Hide</button>
          </div>

          <div className="space-y-3.5 text-xs text-slate-300 leading-relaxed">
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
              <h4 className="font-bold text-white mb-1"><i className="fa-solid fa-fingerprint text-emerald-400 mr-2"></i>POPI Act Compliance Statement</h4>
              <p className="text-[11px] text-slate-400">
                MrKolapie Pty Ltd strictly monitors the collection and protection of personal identification elements. Deceased and family registry details remain under persistent encryption. No information is processed for monetization or shared with third-party networks under the guidelines of the Protection of Personal Information Act.
              </p>
            </div>

            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
              <h4 className="font-bold text-white mb-1"><i className="fa-solid fa-folder-open text-emerald-400 mr-2"></i>PAIA Section 51 Manual</h4>
              <p className="text-[11px] text-slate-400">
                Pursuant to the Promotion of Access to Information Act (PAIA), our internal directory records are made available exclusively for private genealogical tracking and spiritual navigation. Private, family-linked deletion demands are addressed dynamically via legal request forms processed at support@mrkolapie.com.
              </p>
            </div>

            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
              <h4 className="font-bold text-white mb-1"><i className="fa-solid fa-shield-heart text-emerald-400 mr-2"></i>100% Ad-Free Guarantee & Sanctuary of Memory</h4>
              <p className="text-[11px] text-slate-400">
                To honor the deceased and preserve the sanctity of sacred cemetery spaces, this portal contains absolutely zero advertisements, marketing trackers, or corporate monetization scripts. QabrCare is operated strictly as an ad-free communal Waqf initiative under MrKolapie Pty Ltd ™.
              </p>
            </div>

            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
              <h4 className="font-bold text-white mb-1"><i className="fa-solid fa-circle-check text-emerald-400 mr-2"></i>CPA & No-Refund Policy Declaration</h4>
              <p className="text-[11px] text-slate-400">
                In compliance with the South African Consumer Protection Act (CPA), all transactions relating to grave cleanup campaigns represent fully dedicated communal Waqf sponsorships. These donations trigger instant resource deployments for youth employment and do not constitute purchasing of real property or refundable physical assets.
              </p>
            </div>
          </div>
        </div>
      )}

      {adminToken !== 'AUTHORIZED' ? (
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-900 pb-2">
            <div className="flex items-center space-x-2 text-emerald-400">
              <i className="fa-solid fa-lock text-xl"></i>
              <h2 className="font-bold text-sm text-slate-200">Grave Workers Admin Login</h2>
            </div>
            {!showLegalPanel && (
              <button onClick={() => setShowLegalPanel(true)} className="text-[10px] text-emerald-400 underline">Show Legal</button>
            )}
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            Authentication is required to approve pending submissions, view before/after evidence photos, and eliminate dirty datasets.
          </p>
          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="text-[10px] text-slate-400 font-semibold uppercase font-mono">Workbench Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="Enter admin passcode..." 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-mono" 
              />
            </div>
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-4 rounded-lg transition shadow-lg">
              Enter Secure Workspace
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-900 pb-2.5">
            <div className="flex items-center space-x-2 text-emerald-400">
              <i className="fa-solid fa-toolbox text-xl"></i>
              <h2 className="font-bold text-sm text-slate-200">Zahid's Admin Workbench</h2>
            </div>
            <div className="flex items-center space-x-2">
              {!showLegalPanel && (
                <button onClick={() => setShowLegalPanel(true)} className="text-[10px] text-slate-400 mr-2 underline">Show Legal</button>
              )}
              <button 
                onClick={handleLogout} 
                className="text-[10px] font-mono text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded hover:bg-amber-500/5"
              >
                Lock Session
              </button>
            </div>
          </div>

          <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-emerald-400 uppercase font-mono"><i className="fa-solid fa-shield mr-1.5"></i> Gauteng Burial Societies</h4>
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {BURIAL_SOCIETIES.map((s, idx) => (
                <div key={idx} className="bg-slate-950 p-2.5 rounded border border-slate-850 text-xs">
                  <div className="flex justify-between font-bold text-slate-200">
                    <span>{s.name}</span>
                    <span className="text-emerald-500 text-[10px] font-mono">{s.contact}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">{s.service}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Pending Validations Queue ({pendingRecords.length})</h3>
            
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {pendingRecords.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500 border border-slate-850 rounded-xl">
                  No worker uploads awaiting validation.
                </div>
              ) : (
                pendingRecords.map(rec => (
                  <div key={rec.id} className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-2.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-slate-200">{rec.name} {rec.surname}</h4>
                        <p className="text-emerald-500 font-mono text-[10px] font-bold">Qabr No: {rec.qabr}</p>
                        <p className="text-[10px] text-slate-400">Lat: {rec.lat.toFixed(6)}, Lng: {rec.lng.toFixed(6)}</p>
                      </div>
                      {rec.dual_grave && (
                        <span className="text-[9px] bg-amber-500/10 border border-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded font-mono">Shared Coordinates</span>
                      )}
                    </div>
                    
                    {(rec.before_image || rec.after_image) && (
                      <div className="bg-slate-950 p-2 rounded border border-slate-850 space-y-1.5">
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Field Evidence Photos</p>
                        <div className="grid grid-cols-2 gap-1.5">
                          <div>
                            <span className="text-[8px] text-slate-500 block">Before:</span>
                            {rec.before_image ? (
                              <img src={rec.before_image} className="w-full h-16 object-cover rounded border border-slate-800" alt="Before Proof" />
                            ) : (
                              <span className="text-[8px] text-slate-600 italic block">No photo</span>
                            )}
                          </div>
                          <div>
                            <span className="text-[8px] text-slate-500 block">After:</span>
                            {rec.after_image ? (
                              <img src={rec.after_image} className="w-full h-16 object-cover rounded border border-slate-800" alt="After Proof" />
                            ) : (
                              <span className="text-[8px] text-slate-600 italic block">No photo</span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <hr className="border-slate-850" />
                    <p className="text-xs text-slate-300 italic">"{rec.family}"</p>
                    
                    <div className="flex justify-end space-x-2 pt-1.5">
                      <button 
                        onClick={() => handleDecline(rec.id)} 
                        className="bg-red-950 hover:bg-red-900 text-red-400 border border-red-900/40 text-[10px] px-2.5 py-1 rounded"
                      >
                        Decline & Purge
                      </button>
                      <button 
                        onClick={() => handleApprove(rec)} 
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] px-3 py-1 rounded shadow-lg"
                      >
                        Approve & Publish
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-normal">
            You are currently in active direct administration mode. Approved plots automatically bypass local memory hold queues and update across the live Gauteng cartography engine.
          </p>
        </div>
      )}
    </div>
  );
}

function NewsletterWidget() {
  const [emailInput, setEmailInput] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    const subject = encodeURIComponent("Waqf Newsletter Subscription Request");
    const body = encodeURIComponent(`Assalamu Alaikum MrKolapie,\n\nPlease subscribe me to the official QabrCare Waqf Circle updates.\n\nEmail: ${emailInput}\n\nJazakallah Khair!`);
    
    showCustomToast("Subscription Initiated", "Routing your request directly to support@mrkolapie.com...", "success");
    
    setTimeout(() => {
      window.location.href = `mailto:support@mrkolapie.com?subject=${subject}&body=${body}`;
      setEmailInput('');
    }, 1200);
  };

  return (
    <div className="p-5 bg-slate-950/40 border-t border-slate-800 space-y-3 text-left font-sans">
      <div className="flex items-center space-x-2 text-emerald-400">
        <i className="fa-solid fa-envelope-open-text text-lg animate-pulse"></i>
        <h4 className="font-bold text-xs text-slate-200">Join the MrKolapie Waqf Circle</h4>
      </div>
      <p className="text-[10px] text-slate-400 leading-normal">
        Receive historic community datasets, site update schedules, and support initiatives directly in your inbox.
      </p>
      <form onSubmit={handleSubscribe} className="flex gap-2">
        <input 
          type="email" 
          value={emailInput} 
          onChange={e => setEmailInput(e.target.value)} 
          required 
          placeholder="yourname@gmail.com" 
          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg py-1 px-3 text-xs text-slate-100 focus:outline-none focus:border-emerald-500" 
        />
        <button 
          type="submit" 
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 rounded-lg transition cursor-pointer"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
}