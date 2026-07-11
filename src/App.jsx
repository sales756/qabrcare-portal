import React, { useState, useEffect, useMemo, useRef } from 'react';

// --- DATA REGISTRY (South African Islamic Cemeteries & Simulated Graves) ---
const CEMETERY_REGISTRY = [
  { id: 'mowbray', name: 'Mowbray Muslim Cemetery', region: 'Western Cape', city: 'Cape Town', lat: -33.937828, lng: 18.461824 },
  { id: 'westpark', name: 'Westpark Muslim Cemetery', region: 'Gauteng', city: 'Johannesburg', lat: -26.170624, lng: 27.994231 },
  { id: 'johnstone', name: 'Johnstone Road Cemetery', region: 'KwaZulu-Natal', city: 'Durban', lat: -29.897251, lng: 30.989214 },
  { id: 'malkopsvlei', name: 'Malkopsvlei Cemetery', region: 'Western Cape', city: 'Mitchells Plain', lat: -34.058312, lng: 18.608412 },
  { id: 'bosmont', name: 'Bosmont Cemetery', region: 'Gauteng', city: 'Johannesburg', lat: -26.202314, lng: 27.971214 }
];

const GRAVE_REGISTRY = [
  { id: 'QC-001', name: 'Abdul-Kadir', surname: 'Ebrahim', family: 'Beloved father, grandfather & dedicated community teacher.', qabr: 'G104', cemeteryId: 'mowbray', lat: -33.937928, lng: 18.461924, dod: '2023-04-12' },
  { id: 'QC-002', name: 'Fatima', surname: 'Hendricks', family: 'Mother of Cape Town’s southern suburbs soup kitchen network.', qabr: 'F205', cemeteryId: 'mowbray', lat: -33.937618, lng: 18.461712, dod: '2025-01-08' },
  { id: 'QC-003', name: 'Zubair', surname: 'Patel', family: 'Cherished scholar and loving helper to the poor.', qabr: 'A12', cemeteryId: 'westpark', lat: -26.170524, lng: 27.994131, dod: '2024-11-20' },
  { id: 'QC-004', name: 'Ayesha', surname: 'Moola', family: 'Graceful soul, beloved mother of 4. Always remembered in our Duas.', qabr: 'C88', cemeteryId: 'johnstone', lat: -29.897351, lng: 30.989114, dod: '2022-08-15' },
  { id: 'QC-005', name: 'Sulaiman', surname: 'Bhana', family: 'Dedicated family patriarch and pioneer of local educational waqf.', qabr: 'K09', cemeteryId: 'westpark', lat: -26.170824, lng: 27.994331, dod: '2021-06-30' },
  { id: 'QC-006', name: 'Yasmin', surname: 'Khan', family: 'Her smile lit up our hearts. Rest in eternal peace.', qabr: 'D54', cemeteryId: 'johnstone', lat: -29.897151, lng: 30.989314, dod: '2025-05-18' }
];

const HIJRI_MONTHS = [
  'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi ath-Thani', 
  'Jumada al-Ula', 'Jumada al-Akhirah', 'Rajab', 'Sha\'ban', 
  'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
];

const OPENROUTER_MODELS = {
  chat: [
    { id: 'qwen/qwen-2.5-72b-instruct:free', name: 'Qwen 2.5 72B (Free)' },
    { id: 'google/gemma-2-9b-it:free', name: 'Gemma 2 9B (Free)' },
    { id: 'meta-llama/llama-3-8b-instruct:free', name: 'Llama 3 8B (Free)' }
  ],
  vision: [
    { id: 'qwen/qwen-2-5-vl-7b-instruct:free', name: 'Qwen 2.5 Vision (Free)' },
    { id: 'meta-llama/llama-3.2-11b-vision-instruct:free', name: 'Llama 3.2 Vision (Free)' }
  ]
};

// --- QURANIC TEXTS DATA REGISTRY ---
const QURANIC_TEXTS = {
  fatiha: {
    title: "Surah Al-Fatiha (The Opening)",
    verses: [
      { ar: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", en: "In the name of Allah, the Entirely Merciful, the Especially Merciful." },
      { ar: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", en: "[All] praise is [due] to Allah, Lord of the worlds -" },
      { ar: "الرَّحْمَٰنِ الرَّحِيمِ", en: "The Entirely Merciful, the Especially Merciful," },
      { ar: "مَالِكِ يَوْمِ الدِّينِ", en: "Sovereign of the Day of Recompense." },
      { ar: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", en: "It is You we worship and You we ask for help." },
      { ar: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", en: "Guide us to the straight path -" },
      { ar: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", en: "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray." }
    ]
  },
  yaseen: {
    title: "Surah Yaseen (Verses 1-6)",
    verses: [
      { ar: "يس", en: "Ya, Seen." },
      { ar: "وَالْقُرْآنِ الْحَكِيمِ", en: "By the wise Qur'an," },
      { ar: "إِنَّكَ لَمِنَ الْمُرْسَلِينَ", en: "Indeed you, [O Muhammad], are from among the messengers," },
      { ar: "عَلَىٰ صِرَاطٍ مُسْتَقِيمٍ", en: "On a straight path." },
      { ar: "تَنْزِيلَ الْعَزِيزِ الرَّحِيمِ", en: "[This is] a revelation of the Exalted in Might, the Merciful," },
      { ar: "لِتُنْذِرَ قَوْمًا مَا أُنْذِرَ آبَاؤُهُمْ فَهُمْ غَافِلُونَ", en: "That you may warn a people whose forefathers were not warned, so they are unaware." }
    ]
  },
  mulk: {
    title: "Surah Al-Mulk (Verses 1-3)",
    verses: [
      { ar: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ", en: "Blessed is He in whose hand is dominion, and He is over all things competent -" },
      { ar: "الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ", en: "[He] who created death and life to test you [as to] which of you is best in deed - and He is the Exalted in Might, the Forgiving -" },
      { ar: "الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا ۖ مَا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِنْ تَفَاوُتٍ ۖ فَارْجِعِ الْبَصَرَ هَلْ تَرَىٰ مِنْ فُطُورٍ", en: "[And] who created seven heavens in layers. You do not see in the creation of the Most Merciful any inconsistency. So return [your] vision [to the heaven]; do you see any breaks?" }
    ]
  },
  duas: {
    title: "Sunnah Duas for Parents & Cemetery Visitation",
    verses: [
      { ar: "رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا", en: "\"My Lord, have mercy upon them as they brought me up [when I was] small.\" (Quran 17:24)" },
      { ar: "السَّلَامُ عَلَيْكُمْ يَا أَهْلَ القُبُورِ، يَغْفِرُ اللهُ لَنَا وَلَكُمْ، أَنْتُمْ سَلَفُنَا وَنَحْنُ بِالأَثَرِ", en: "\"Peace be upon you, O people of the graves. May Allah forgive us and you. You are our predecessors, and we are soon to follow.\"" }
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

// Custom Toast Event Helper for beautiful feedback instead of alerts
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
    return local ? JSON.parse(local) : GRAVE_REGISTRY;
  });
  const [focusedLocation, setFocusedLocation] = useState(null);
  const [currentMapCenter, setCurrentMapCenter] = useState({ lat: -33.937828, lng: 18.461824 });
  const [showSettings, setShowSettings] = useState(false);
  const [openRouterKey, setOpenRouterKey] = useState(() => localStorage.getItem('openrouter_api_key') || '');
  const [selectedChatModel, setSelectedChatModel] = useState(() => localStorage.getItem('openrouter_chat_model') || 'qwen/qwen-2.5-72b-instruct:free');
  const [selectedVisionModel, setSelectedVisionModel] = useState(() => localStorage.getItem('openrouter_vision_model') || 'qwen/qwen-2-5-vl-7b-instruct:free');

  // Sync state changes with localStorage
  useEffect(() => {
    localStorage.setItem('qabrcare_records', JSON.stringify(records));
  }, [records]);

  const saveSettings = (e) => {
    e.preventDefault();
    localStorage.setItem('openrouter_api_key', openRouterKey);
    localStorage.setItem('openrouter_chat_model', selectedChatModel);
    localStorage.setItem('openrouter_vision_model', selectedVisionModel);
    setShowSettings(false);
    showCustomToast("Settings Saved", "Your OpenRouter API configurations have been securely stored in this browser session.", "success");
  };

  const handleLocate = (loc) => {
    setFocusedLocation(loc);
    setCurrentMapCenter(loc);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      
      {/* LEFT CONTROL CENTER & TABS */}
      <div className="w-full lg:w-[480px] flex flex-col bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-800 h-[60vh] lg:h-full overflow-y-auto no-print">
        
        {/* BRANDING HEADER */}
        <header className="p-5 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <i className="fa-solid fa-mosque text-xl"></i>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                QabrCare <span className="text-[10px] uppercase font-mono bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">SA</span>
              </h1>
              <p className="text-[10px] text-slate-400">South Africa's Serverless Grave Locator</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowSettings(true)}
              className="text-slate-400 hover:text-emerald-400 transition text-sm p-2 bg-slate-800/80 rounded-lg border border-slate-700"
              title="OpenRouter Keys Config"
            >
              <i className="fa-solid fa-gears"></i>
            </button>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
              <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live DB
            </span>
          </div>
        </header>

        {/* TAB NAVIGATION */}
        <div className="grid grid-cols-5 border-b border-slate-800 text-center text-xs sticky top-[73px] bg-slate-900 z-10 font-medium">
          <button 
            onClick={() => setActiveTab('search')} 
            className={`py-3 flex flex-col items-center justify-center gap-1 border-b-2 transition ${activeTab === 'search' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            <i className="fa-solid fa-magnifying-glass"></i>
            <span>Search</span>
          </button>
          <button 
            onClick={() => setActiveTab('uploader')} 
            className={`py-3 flex flex-col items-center justify-center gap-1 border-b-2 transition ${activeTab === 'uploader' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            <i className="fa-solid fa-camera"></i>
            <span>Edge OCR</span>
          </button>
          <button 
            onClick={() => setActiveTab('clean')} 
            className={`py-3 flex flex-col items-center justify-center gap-1 border-b-2 transition ${activeTab === 'clean' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            <i className="fa-solid fa-broom"></i>
            <span>Services</span>
          </button>
          <button 
            onClick={() => setActiveTab('assistant')} 
            className={`py-3 flex flex-col items-center justify-center gap-1 border-b-2 transition ${activeTab === 'assistant' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            <i className="fa-solid fa-circle-nodes"></i>
            <span>Dua & AI</span>
          </button>
          <button 
            onClick={() => setActiveTab('legal')} 
            className={`py-3 flex flex-col items-center justify-center gap-1 border-b-2 transition ${activeTab === 'legal' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            <i className="fa-solid fa-scale-balanced"></i>
            <span>Legal</span>
          </button>
        </div>

        {/* TAB CONTENTS */}
        <div className="flex-1">
          {activeTab === 'search' && (
            <SearchTab onLocate={handleLocate} records={records} switchTab={setActiveTab} />
          )}
          {activeTab === 'uploader' && (
            <UploaderTab 
              mapCenter={currentMapCenter} 
              onAddRecord={(newRec) => setRecords(prev => [newRec, ...prev])} 
              openRouterKey={openRouterKey}
              selectedVisionModel={selectedVisionModel}
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
            <LegalTab />
          )}
        </div>

        {/* FOOTER */}
        <footer className="p-4 bg-slate-950 border-t border-slate-800 text-[10px] text-slate-500 text-center">
          <p>© {new Date().getFullYear()} QabrCare. Powered by MrKolapie (Pty) Ltd. All Rights Reserved.</p>
          <p className="mt-1 font-mono text-emerald-600">Al-Mowt - Remembering the hereafter</p>
        </footer>
      </div>

      {/* RIGHT SIDE: LEAFLET INTERACTIVE MAP */}
      <div className="flex-1 relative h-[40vh] lg:h-full bg-slate-950">
        <Map records={records} focusedLocation={focusedLocation} onMapMove={(center) => setCurrentMapCenter(center)} />
        
        {/* MAP HUD OVERLAY */}
        <div className="absolute top-4 left-4 z-[400] pointer-events-none hidden md:block">
          <div className="bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 shadow-xl max-w-xs">
            <h3 className="text-xs font-bold text-white mb-1 flex items-center gap-1">
              <i className="fa-solid fa-map-location-dot text-emerald-400"></i> Cape Peninsula & Gauteng Registry
            </h3>
            <p className="text-[10px] text-slate-400 leading-normal">
              Click green pins on the dark-mode layout map to query qabr identifiers, CE & AH dates of death, and lineage cards.
            </p>
          </div>
        </div>

        {/* PRINT / SOCIALS MAP OVERLAY */}
        <div className="absolute bottom-4 right-4 z-[400] flex items-center space-x-2">
          <button 
            onClick={() => window.print()} 
            className="bg-emerald-600 hover:bg-emerald-500 text-white p-2.5 rounded-full shadow-lg transition pointer-events-auto"
            title="Print Current View/Report"
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

      {/* SETTINGS / OPENROUTER GATEWAY CONFIG MODAL */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[999]">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
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
                <p className="text-[9px] text-slate-500 leading-normal">
                  Your OpenRouter credentials are saved directly in your browser. Leaving this empty disables live AI queries but keeps simulated OCR active.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-semibold uppercase">Chat Companion Model (Gemma, Llama, Qwen)</label>
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
                <label className="text-[10px] text-slate-400 font-semibold uppercase">Vision / OCR Model</label>
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

      mapRef.current = L.map('map-canvas', { zoomControl: false }).setView([-33.937828, 18.461824], 16);
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

      records.forEach(rec => {
        const greenPin = L.divIcon({
          html: `<div class="relative flex items-center justify-center">
                   <div class="absolute w-4 h-4 bg-emerald-500/40 rounded-full animate-ping"></div>
                   <div class="bg-emerald-600 border-2 border-white w-3 h-3 rounded-full shadow-lg"></div>
                 </div>`,
          className: 'custom-pin-container',
          iconSize: [16, 16]
        });

        const marker = L.marker([rec.lat, rec.lng], { icon: greenPin });
        const cemName = CEMETERY_REGISTRY.find(c => c.id === rec.cemeteryId)?.name || 'Cemetery';
        const h = gregorianToHijri(new Date(rec.dod));
        const monthName = HIJRI_MONTHS[h.month - 1] || 'Month';

        const popupContent = `
          <div class="p-2 text-xs bg-slate-900 text-slate-100 rounded-lg font-sans leading-relaxed min-w-[200px]">
            <div class="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5">
              <h4 class="font-bold text-emerald-400 text-sm">${rec.name} ${rec.surname}</h4>
              <span class="bg-emerald-950/80 text-[9px] text-emerald-400 px-1.5 py-0.5 rounded font-mono border border-emerald-900">${rec.qabr}</span>
            </div>
            <p class="text-slate-400 font-medium mb-1"><i class="fa-solid fa-tree text-emerald-600 mr-1.5"></i>${cemName}</p>
            <p class="text-slate-300 italic mb-2">"${rec.family}"</p>
            <div class="text-[9px] text-slate-500 font-mono flex items-center justify-between bg-slate-950/50 p-1.5 rounded">
              <span>CE: ${rec.dod}</span>
              <span class="text-emerald-500 font-semibold font-mono">AH: ${h.day} ${monthName} ${h.year}</span>
            </div>
          </div>
        `;

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
          <p className="text-sm font-medium text-slate-300">Loading Cape Peninsula Cartography Engine...</p>
        </div>
      )}
    </div>
  );
}

function SearchTab({ onLocate, records, switchTab }) {
  const [nameQuery, setNameQuery] = useState('');
  const [qabrQuery, setQabrQuery] = useState('');
  const [regionQuery, setRegionQuery] = useState('');
  const [dateQuery, setDateQuery] = useState('');

  const filtered = useMemo(() => {
    return records.filter(rec => {
      const cem = CEMETERY_REGISTRY.find(c => c.id === rec.cemeteryId);
      const matchesName = (
        rec.name.toLowerCase().includes(nameQuery.toLowerCase()) || 
        rec.surname.toLowerCase().includes(nameQuery.toLowerCase()) || 
        rec.family.toLowerCase().includes(nameQuery.toLowerCase())
      );
      const matchesQabr = rec.qabr.toLowerCase().includes(qabrQuery.toLowerCase());
      const matchesRegion = !regionQuery || (cem && cem.region === regionQuery);
      const matchesDate = !dateQuery || rec.dod === dateQuery;
      return matchesName && matchesQabr && matchesRegion && matchesDate;
    });
  }, [nameQuery, qabrQuery, regionQuery, dateQuery, records]);

  const calculatedHijri = useMemo(() => {
    if (!dateQuery) return '';
    const h = gregorianToHijri(new Date(dateQuery));
    return `${h.day} ${HIJRI_MONTHS[h.month - 1]} ${h.year} AH`;
  }, [dateQuery]);

  return (
    <div className="p-5 space-y-5 animate-fadeIn">
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 shadow-inner">
        <div className="flex items-center justify-between">
          <h2 className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Search Filters</h2>
          <button onClick={() => switchTab('uploader')} className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 font-semibold">
            <i className="fa-solid fa-camera"></i> Edge AI Scan
          </button>
        </div>
        
        <div className="space-y-1">
          <label className="text-[10px] text-slate-400 font-semibold">Deceased Name / Surname / Lineage Keyword</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
              <i className="fa-solid fa-search text-xs"></i>
            </span>
            <input 
              type="text" 
              value={nameQuery} 
              onChange={e => setNameQuery(e.target.value)} 
              placeholder="Search names, lineages, family..." 
              className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-9 pr-3 text-xs text-slate-100 focus:outline-none focus:border-emerald-500" 
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-semibold">Grave Number</label>
            <input 
              type="text" 
              value={qabrQuery} 
              onChange={e => setQabrQuery(e.target.value)} 
              placeholder="e.g. G104" 
              className="w-full bg-slate-900 border border-slate-700 rounded-lg py-1.5 px-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-semibold">Cemetery Region</label>
            <select 
              value={regionQuery} 
              onChange={e => setRegionQuery(e.target.value)} 
              className="w-full bg-slate-900 border border-slate-700 rounded-lg py-1.5 px-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            >
              <option value="">All Regions</option>
              <option value="Western Cape">Western Cape</option>
              <option value="Gauteng">Gauteng</option>
              <option value="KwaZulu-Natal">KwaZulu-Natal</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-semibold">Gregorian DOD</label>
            <input 
              type="date" 
              value={dateQuery} 
              onChange={e => setDateQuery(e.target.value)} 
              className="w-full bg-slate-900 border border-slate-700 rounded-lg py-1 px-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-sans" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-semibold">Calculated Hijri Date</label>
            <input 
              type="text" 
              readOnly 
              value={calculatedHijri} 
              placeholder="Auto-calculated AH Date" 
              className="w-full bg-slate-900/60 border border-slate-800 rounded-lg py-1.5 px-2 text-xs text-emerald-400 font-mono font-bold cursor-not-allowed" 
            />
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Search Results ({filtered.length})</h3>
          <button 
            onClick={() => {setNameQuery(''); setQabrQuery(''); setRegionQuery(''); setDateQuery('');}} 
            className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold"
          >
            <i className="fa-solid fa-rotate-left mr-1"></i>Reset
          </button>
        </div>
        
        <div className="space-y-2.5 max-h-[300px] lg:max-h-[none] overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <div className="text-center py-10 bg-slate-950 rounded-xl border border-slate-800 text-slate-500 text-xs font-sans">
              <i className="fa-solid fa-folder-open text-2xl mb-2 text-slate-600 block"></i>
              No matching records found in registry.
            </div>
          ) : (
            filtered.map(rec => {
              const cem = CEMETERY_REGISTRY.find(c => c.id === rec.cemeteryId);
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
                      <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1.5">
                        <i className="fa-solid fa-tree text-emerald-600"></i> {cem?.name} ({cem?.city})
                      </p>
                    </div>
                    <span className="text-[9px] bg-slate-900 border border-slate-800 text-slate-500 px-1.5 py-0.5 rounded font-mono">{rec.id}</span>
                  </div>
                  <hr className="border-slate-900 my-2" />
                  <p className="text-[11px] text-slate-300 italic font-sans leading-relaxed">"{rec.family}"</p>
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

function UploaderTab({ mapCenter, onAddRecord, openRouterKey, selectedVisionModel }) {
  const [loading, setLoading] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [realAIPending, setRealAIPending] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('Analyze this headstone picture. Extract the Full Name, Date of Death, and any poetic epitaph text clearly.');
  const [base64Image, setBase64Image] = useState('');
  const fileInputRef = useRef(null);

  const [ocrData, setOcrData] = useState({
    name: 'Mariam',
    surname: 'Yusuf',
    qabr: 'G502',
    dob: '1936-05-12',
    dod: '2026-07-09',
    lineage: 'Beloved daughter of Fatima and Ahmed, mother to Amina and Moosa. Deeply missed by grandchildren.'
  });

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

  const handleRealVisionAI = async () => {
    if (!base64Image) return;
    if (!openRouterKey) {
      showCustomToast("Key Required", "To process visual data via AI, click the settings gear in the top right and supply an OpenRouter API key.", "warning");
      return;
    }
    
    setRealAIPending(true);
    const url = `https://openrouter.ai/api/v1/chat/completions`;

    const systemPrompt = `You are an expert Islamic epigraphy and genealogy decipherer. Read Arabic text or worn English carving. Output your response as a strictly valid, flat JSON object (no nested keys, markdown code fences or wraps) with keys: "name", "surname", "qabr", "dob" (YYYY-MM-DD), "dod" (YYYY-MM-DD), and "epitaph".`;
    
    const payload = {
      model: selectedVisionModel,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: `${systemPrompt}\n\nUser prompt: ${customPrompt}` },
            { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
          ]
        }
      ]
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openRouterKey}`,
          "HTTP-Referer": "https://qabrcare.co.za",
          "X-Title": "QabrCare Portal"
        },
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();
      const content = result.choices?.[0]?.message?.content;
      
      // Attempt clean extraction of json out of potential markdown blocks
      const cleaned = content.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedText = JSON.parse(cleaned);

      if (parsedText) {
        setOcrData({
          name: parsedText.name || 'Extracted Name',
          surname: parsedText.surname || 'Extracted Surname',
          qabr: parsedText.qabr || 'Temp-' + Math.floor(Math.random() * 900 + 100),
          dob: parsedText.dob || '1950-01-01',
          dod: parsedText.dod || new Date().toISOString().split('T')[0],
          lineage: parsedText.epitaph || 'No epitaph extracted.'
        });
        showCustomToast("AI Decipher Complete", "Grave registry inputs have been populated with segmented vision data.", "success");
      }
    } catch (err) {
      console.error(err);
      showCustomToast("AI Processing Error", "Vision decoding failed. Standard mock segmentation is preserved.", "warning");
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
      cemeteryId: 'mowbray',
      lat: mapCenter.lat,
      lng: mapCenter.lng,
      dod: ocrData.dod,
      family: ocrData.lineage
    };

    onAddRecord(newRecord);
    setScanned(false);
    setBase64Image('');
    
    showCustomToast("Plot Registered", `Plot ${newRecord.qabr} for ${newRecord.name} ${newRecord.surname} is now live.`);
  };

  const h = ocrData.dod ? gregorianToHijri(new Date(ocrData.dod)) : null;

  return (
    <div className="p-5 space-y-5 animate-fadeIn">
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex items-center space-x-2 text-emerald-400">
          <i className="fa-solid fa-microchip text-xl"></i>
          <h2 className="font-bold text-sm text-slate-200">On-Device Edge OCR Scanner</h2>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
          Runs local machine learning character recognition to help digitize eroded headstones.
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
          <p className="text-xs font-semibold">Scan Grave Marker / Upload Photo</p>
        </div>

        {loading && (
          <div className="flex items-center justify-center space-x-2 text-emerald-400 py-3 text-xs bg-slate-900 rounded-lg border border-slate-800">
            <i className="fa-solid fa-circle-notch fa-spin"></i>
            <span>Segmenting characters...</span>
          </div>
        )}

        {base64Image && scanned && (
          <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-emerald-400 font-bold uppercase"><i className="fa-solid fa-brain mr-1"></i> OpenRouter Vision Deciphering</span>
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
              {realAIPending ? "Analyzing..." : "Decipher Arabic/English Carving"}
            </button>
          </div>
        )}

        {scanned && !loading && (
          <form className="space-y-3.5 pt-2" onSubmit={handleCommit}>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400">First Name</label>
                <input 
                  type="text" 
                  value={ocrData.name} 
                  onChange={e => setOcrData({...ocrData, name: e.target.value})} 
                  required 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg py-1.5 px-2.5 text-xs text-slate-100" 
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400">Surname</label>
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
                <label className="text-[10px] text-slate-400">Assigned Qabr ID</label>
                <input 
                  type="text" 
                  value={ocrData.qabr} 
                  onChange={e => setOcrData({...ocrData, qabr: e.target.value})} 
                  required 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg py-1.5 px-2.5 text-xs text-slate-100" 
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400">Death Date</label>
                <input 
                  type="date" 
                  value={ocrData.dod} 
                  onChange={e => setOcrData({...ocrData, dod: e.target.value})} 
                  required 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg py-1 px-2 text-xs text-slate-100" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400">Islamic Hijri Date</label>
                <input 
                  type="text" 
                  readOnly 
                  value={h ? `${h.day} ${HIJRI_MONTHS[h.month - 1]} ${h.year} AH` : ''} 
                  className="w-full bg-slate-900/60 border border-slate-850 rounded-lg py-1.5 px-2.5 text-xs text-emerald-400 font-semibold cursor-not-allowed" 
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400">Coordinates</label>
                <input 
                  type="text" 
                  readOnly 
                  value={`${mapCenter.lat.toFixed(6)}, ${mapCenter.lng.toFixed(6)}`} 
                  className="w-full bg-slate-900/60 border border-slate-850 rounded-lg py-1.5 px-2.5 text-xs text-slate-400 cursor-not-allowed" 
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400">Epitaph/Lineage Transcription</label>
              <textarea 
                rows={2} 
                value={ocrData.lineage} 
                onChange={e => setOcrData({...ocrData, lineage: e.target.value})} 
                required 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-1.5 px-2.5 text-xs text-slate-100 focus:outline-none"
              ></textarea>
            </div>

            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-4 rounded-lg transition shadow-lg flex items-center justify-center gap-1.5 cursor-pointer">
              <i className="fa-solid fa-check-double"></i> Validate & Add to Live Map
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function CleanTab() {
  const [qty, setQty] = useState(1);
  const [gateway, setGateway] = useState('Yoco');
  const [treeQty, setTreeQty] = useState(0);
  const [targetDetails, setTargetDetails] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [showInvoice, setShowInvoice] = useState(false);
  
  const [debitBank, setDebitBank] = useState('');
  const [debitAccount, setDebitAccount] = useState('');
  const [debitBranch, setDebitBranch] = useState('');
  const [debitType, setDebitType] = useState('Savings');

  const costs = useMemo(() => {
    let baseCents = 10000;
    if (qty === 5) baseCents = 25000;
    else if (qty === 10) baseCents = 50000;
    else if (qty === 15) baseCents = 75000;
    else if (qty === 20) baseCents = 110000;
    else if (qty > 20) baseCents = qty * 5500;
    else baseCents = qty * 10000;

    const treeCents = treeQty * 15000;
    const totalCents = baseCents + treeCents;

    let targetYoco = "https://pay.yoco.com/mrkolapie";
    if (qty === 1 && treeQty === 0) targetYoco = "https://pay.yoco.com/r/7KEpyq";
    else if (qty === 5 && treeQty === 0) targetYoco = "https://pay.yoco.com/r/2Yv86B";
    else if (qty === 10 && treeQty === 0) targetYoco = "https://pay.yoco.com/r/mRP8dQ";
    else if (qty === 15 && treeQty === 0) targetYoco = "https://pay.yoco.com/r/2QV85R";
    else if (qty === 20 && treeQty === 0) targetYoco = "https://pay.yoco.com/r/70GDoB";

    return {
      basePrice: `R${(baseCents / 100).toFixed(2)}`,
      treePrice: `R${(treeCents / 100).toFixed(2)}`,
      totalPrice: `R${(totalCents / 100).toFixed(2)}`,
      yocoUrl: targetYoco
    };
  }, [qty, treeQty]);

  const handleSponsorship = (val) => {
    if (val === "Sponsor1") setQty(1);
    else if (val === "Sponsor5") setQty(5);
    else if (val === "Sponsor10") setQty(10);
    else if (val === "Sponsor20") setQty(20);
  };

  const handleOfflinePhotoUpload = (phase) => {
    const fileInput = document.getElementById(`photo-${phase}`);
    if (fileInput) fileInput.click();
  };

  const saveClientPhoto = (e, phase) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = function (ev) {
        if (ev.target) {
          localStorage.setItem(`qabrcare_photo_${phase}`, ev.target.result);
          const badge = document.getElementById(`badge-${phase}`);
          if (badge) {
            badge.innerText = "Captured Successfully";
            badge.className = "text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30";
          }
          showCustomToast("Photo Saved", `Phase: "${phase}" photo successfully captured and archived to secure offline session.`);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const generateInvoice = (e) => {
    e.preventDefault();
    setShowInvoice(true);
    const msg = `Assalamu Alaikum QabrCare, I have initiated a grave maintenance request for plot: ${targetDetails}. Total service sum: ${costs.totalPrice}. Client: ${clientName} (${clientEmail}). Please confirm payment status.`;
    setTimeout(() => {
      window.open(`https://wa.me/27627947136?text=${encodeURIComponent(msg)}`, '_blank');
      setShowInvoice(false);
    }, 3000);
  };

  return (
    <div className="p-5 space-y-5 animate-fadeIn">
      <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
        <div className="flex items-center space-x-2 text-emerald-400">
          <i className="fa-solid fa-broom-ball text-xl"></i>
          <div>
            <h2 className="font-bold text-sm text-slate-200">Grave Maintenance & Care</h2>
            <p className="text-[9px] text-emerald-500 uppercase tracking-widest font-mono">Professional Cape Peninsula Cleanup WAQF</p>
          </div>
        </div>

        <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 space-y-1.5 text-[11px] text-slate-400">
          <h3 className="font-bold text-slate-300 border-b border-slate-800 pb-1 text-xs">Standard South African Rates</h3>
          <div className="grid grid-cols-2 gap-1 font-mono">
            <div>1 Grave Plot Cleanup:</div><div className="text-right text-emerald-400 font-bold">R100</div>
            <div>5 Grave Plots Campaign:</div><div className="text-right text-emerald-400 font-bold">R250</div>
            <div>10 Grave Plots Campaign:</div><div className="text-right text-emerald-400 font-bold">R500</div>
            <div>15 Grave Plots Campaign:</div><div className="text-right text-emerald-400 font-bold">R750</div>
            <div>20 Grave Plots Campaign:</div><div className="text-right text-emerald-400 font-bold">R1100</div>
          </div>
        </div>

        <form className="space-y-3" onSubmit={generateInvoice}>
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[10px] text-slate-400 font-semibold uppercase">Quantity</label>
              <select 
                value={qty} 
                onChange={e => setQty(parseInt(e.target.value))} 
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
                onChange={e => setTreeQty(parseInt(e.target.value))} 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-1.5 px-2.5 text-xs text-slate-100 focus:outline-none"
              >
                <option value="0">No Shrub Planted</option>
                <option value="1">1 Native Shrub (+R150)</option>
                <option value="2">2 Native Shrubs (+R300)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[10px] text-slate-400 font-semibold uppercase">Sponsor Campaign</label>
              <select 
                onChange={e => handleSponsorship(e.target.value)} 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-1.5 px-2.5 text-xs text-slate-100 focus:outline-none"
              >
                <option value="">Choose Campaign</option>
                <option value="Sponsor1">Sponsor 1 Grave Plot (R100)</option>
                <option value="Sponsor5">Sponsor 5 Grave Plots (R250)</option>
                <option value="Sponsor10">Sponsor 10 Grave Plots (R500)</option>
                <option value="Sponsor20">Sponsor 20 Grave Plots (R1100)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-semibold uppercase">Secure Gateway</label>
              <select 
                value={gateway} 
                onChange={e => setGateway(e.target.value)} 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-1.5 px-2.5 text-xs text-slate-100 focus:outline-none"
              >
                <option value="Yoco">Yoco API (Instant EFT & Card)</option>
                <option value="Capitec">Capitec Business PayByLink</option>
                <option value="DebitOrder">Monthly Netcash eMandate</option>
              </select>
            </div>
          </div>

          {gateway === 'DebitOrder' && (
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2.5 transition">
              <h4 className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                <i className="fa-solid fa-file-signature"></i> Netcash eMandate Setup
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-slate-400">South African Bank</label>
                  <input 
                    type="text" 
                    value={debitBank} 
                    onChange={e => setDebitBank(e.target.value)} 
                    placeholder="e.g. Capitec, FNB" 
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
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-slate-400">Branch Code</label>
                  <input 
                    type="text" 
                    value={debitBranch} 
                    onChange={e => setDebitBranch(e.target.value)} 
                    placeholder="e.g. 470010" 
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-1 px-2 text-xs text-slate-100 focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="text-[9px] text-slate-400">Account Type</label>
                  <select 
                    value={debitType} 
                    onChange={e => setDebitType(e.target.value)} 
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-1.5 px-2 text-[11px] text-slate-100 focus:outline-none"
                  >
                    <option value="Savings">Savings</option>
                    <option value="Cheque">Cheque/Current</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2 border-t border-slate-800 pt-3">
            <div>
              <label className="text-[10px] text-slate-400">Target Grave/Plot details or Sponsor message</label>
              <input 
                type="text" 
                value={targetDetails} 
                onChange={e => setTargetDetails(e.target.value)} 
                required 
                placeholder="e.g. Plot Mowbray G104 / General Waqf Donation" 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-1.5 px-2.5 text-xs text-slate-100 focus:outline-none" 
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400">Your Full Name</label>
                <input 
                  type="text" 
                  value={clientName} 
                  onChange={e => setClientName(e.target.value)} 
                  required 
                  placeholder="e.g. Yusuf Salie" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg py-1.5 px-2.5 text-xs text-slate-100 focus:outline-none" 
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400">Email Address</label>
                <input 
                  type="email" 
                  value={clientEmail} 
                  onChange={e => setClientEmail(e.target.value)} 
                  required 
                  placeholder="e.g. yusuf@gmail.co.za" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg py-1.5 px-2.5 text-xs text-slate-100 focus:outline-none" 
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Base Services:</span>
              <span className="text-slate-200 font-semibold">{costs.basePrice}</span>
            </div>
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Optional Native Shrubs:</span>
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
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-3 rounded-lg transition shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <i className="fa-brands fa-whatsapp"></i> Order & WhatsApp Sync
            </button>
            
            {gateway === 'Yoco' ? (
              <a 
                href={costs.yocoUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs py-2 px-3 rounded-lg border border-slate-700 transition flex items-center justify-center gap-1.5 cursor-pointer text-center"
              >
                <i className="fa-solid fa-credit-card"></i> Pay via Yoco Card
              </a>
            ) : (
              <button 
                type="button"
                onClick={() => showCustomToast("Direct EFT Instruction", "Account details: Standard Bank, Branch Code: 051001, Acc: 1021435212. Please use your Surname & Grave ID as reference.", "info")} 
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs py-2 px-3 rounded-lg border border-slate-700 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <i className="fa-solid fa-building-columns"></i> View EFT Details
              </button>
            )}
          </div>
        </form>

        {showInvoice && (
          <div className="bg-emerald-950/40 p-3 rounded-lg border border-emerald-900/50 space-y-1.5 text-center text-[11px] animate-pulse">
            <p className="text-emerald-400 font-bold"><i className="fa-solid fa-spinner fa-spin mr-1.5"></i>Initiating WhatsApp Order Flow</p>
          </div>
        )}

        {/* OFFLINE CAPTURING MODULES */}
        <div className="border-t border-slate-800 pt-4 space-y-3">
          <div className="flex items-center space-x-2 text-emerald-400">
            <i className="fa-solid fa-signature text-sm"></i>
            <h3 className="font-bold text-xs text-slate-200">Grave Care Proof Delivery System</h3>
          </div>
          <p className="text-[10px] text-slate-400">Capture proof of maintenance phases locally on disk.</p>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-center relative">
              <input 
                type="file" 
                id="photo-before" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => saveClientPhoto(e, 'before')} 
              />
              <span id="badge-before" className="text-[9px] text-slate-500 font-mono block mb-1">Phase: Before Care</span>
              <button 
                type="button"
                onClick={() => handleOfflinePhotoUpload('before')} 
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[10px] px-2 py-1 rounded cursor-pointer"
              >
                <i className="fa-solid fa-image mr-1"></i> Snap Photo
              </button>
            </div>

            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-center relative">
              <input 
                type="file" 
                id="photo-after" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => saveClientPhoto(e, 'after')} 
              />
              <span id="badge-after" className="text-[9px] text-slate-500 font-mono block mb-1">Phase: After Care</span>
              <button 
                type="button"
                onClick={() => handleOfflinePhotoUpload('after')} 
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[10px] px-2 py-1 rounded cursor-pointer"
              >
                <i className="fa-solid fa-image mr-1"></i> Snap Photo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AssistantTab({ openRouterKey, selectedChatModel }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Assalamu Alaikum. I am your serverless QabrCare Islamic Scholar & Cemetery Companion. Ask me about South African burial registries, Hanafi/Shafi\'i visiting codes, or specific Sunnah Duas.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedSurah, setSelectedSurah] = useState('fatiha');

  const surahData = QURANIC_TEXTS[selectedSurah];

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    if (!openRouterKey) {
      setMessages(prev => [...prev, { role: 'assistant', content: "API Key missing! To enable real-time replies from Qwen, Gemma, or Llama models, click the settings gear in the top right header and enter an OpenRouter API key." }]);
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
            { role: "system", content: "You are a polite, respectful Islamic burial coordinator and scholar. Assist users with queries about visiting cemeteries (Ziyarah), du'as, shroud parameters, or burial norms with supportive South African references." },
            { role: "user", content: userMessage.content }
          ]
        })
      });

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || "No response received. Please try again.";
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: "An error occurred. Check your network or OpenRouter API limits." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 space-y-5 animate-fadeIn">
      {/* QURANIC SELECTOR */}
      <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
        <div className="flex items-center space-x-3 text-emerald-400">
          <i className="fa-solid fa-book-quran text-2xl"></i>
          <h2 className="font-bold text-slate-100 text-sm">Spiritual Library & Duas</h2>
        </div>
        
        <div className="space-y-3">
          <select 
            value={selectedSurah} 
            onChange={e => setSelectedSurah(e.target.value)} 
            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-slate-100 focus:outline-none"
          >
            <option value="fatiha">Surah Al-Fatiha (The Opening)</option>
            <option value="yaseen">Surah Yaseen (Verses 1-6)</option>
            <option value="mulk">Surah Al-Mulk (Verses 1-3)</option>
            <option value="duas">Duas for Parents & Cemetery Visitation</option>
          </select>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-4 max-h-72 overflow-y-auto">
            {surahData && (
              <>
                <h3 className="font-bold text-emerald-400 text-xs border-b border-slate-800 pb-1">{surahData.title}</h3>
                {surahData.verses.map((v, i) => (
                  <div key={i} className="space-y-1.5 pt-2 text-xs border-b border-slate-900/50 pb-2 text-left">
                    <div className="text-right font-serif text-base leading-loose text-slate-100" dir="rtl">
                      {v.ar} <span className="text-[10px] text-emerald-600 font-mono">({i + 1})</span>
                    </div>
                    <div className="text-slate-400 italic text-[11px]">{v.en}</div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* AI COMPANION */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col h-[350px] justify-between">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 mb-2">
          <i className="fa-solid fa-circle-question text-emerald-400"></i>
          <h3 className="font-bold text-xs text-slate-200">Burial Guide AI ({selectedChatModel.split('/')[1]?.split(':')[0] || 'Qwen'})</h3>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs text-left">
          {messages.map((m, idx) => (
            <div key={idx} className={`p-2.5 rounded-lg max-w-[85%] leading-relaxed ${m.role === 'assistant' ? 'bg-slate-900 text-slate-200 self-start border border-slate-800' : 'bg-emerald-950/80 text-emerald-100 self-end ml-auto border border-emerald-900/40'}`}>
              <p className="font-semibold text-[10px] text-slate-400 mb-0.5 uppercase tracking-wide">
                {m.role === 'assistant' ? 'Scholar Assistant' : 'You'}
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
            placeholder="Ask about Ziyarah, shrouding, depths..." 
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

function LegalTab() {
  const handlePartnerSubmit = (e) => {
    e.preventDefault();
    const society = e.target.society.value;
    const email = e.target.email.value;
    const msg = `Assalamu Alaikum QabrCare, I would like to partner our Burial Society (${society}) with QabrCare. Contact: ${email}. Please reach back.`;
    window.open(`https://wa.me/27627947136?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="p-5 space-y-5 animate-fadeIn">
      <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4 text-left">
        <div className="flex items-center space-x-3 text-emerald-400">
          <i className="fa-solid fa-scale-balanced text-2xl"></i>
          <h2 className="font-bold text-slate-100 text-sm">Governance & Compliance</h2>
        </div>
        
        <div className="text-xs space-y-2 leading-relaxed text-slate-400 font-sans">
          <p><strong>MrKolapie (Pty) Ltd</strong> is a registered corporate entity under the South African Companies Act.</p>
          <ul className="space-y-1 font-mono text-slate-300">
            <li>Registration No: 2025/537780/07</li>
            <li>Tax Reference: 9726057202</li>
            <li>BBBEE Status: Level 1 Contributor (135% Recognition)</li>
          </ul>
        </div>

        <div className="border-t border-slate-800 pt-4 space-y-2">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wide">Legal Disclosures</h3>
          <div className="grid grid-cols-1 gap-2">
            <button 
              type="button"
              onClick={() => showCustomToast("POPIA Compliance", "All personal identities are encrypted in transit and under active Protection of Personal Information principles.", "info")} 
              className="text-left bg-slate-900 hover:bg-slate-800 p-3 rounded-xl border border-slate-800 text-xs text-emerald-400 flex items-center justify-between transition cursor-pointer"
            >
              <span><i className="fa-solid fa-shield-halved mr-2"></i>POPI Act Compliance Statement</span>
              <i className="fa-solid fa-chevron-right"></i>
            </button>
            <button 
              type="button"
              onClick={() => showCustomToast("PAIA Section 51", "Access requests for grave listings are mediated through local South African burial board guidelines.", "info")}
              className="text-left bg-slate-900 hover:bg-slate-800 p-3 rounded-xl border border-slate-800 text-xs text-emerald-400 flex items-center justify-between transition cursor-pointer"
            >
              <span><i className="fa-solid fa-folder-open mr-2"></i>PAIA Section 51 Manual</span>
              <i className="fa-solid fa-chevron-right"></i>
            </button>
            <button 
              type="button"
              onClick={() => showCustomToast("Sponsorship & Refund terms", "Waqf cleanup payments represent fully dedicated communal sponsorship and do not entail physical ownership.", "info")}
              className="text-left bg-slate-900 hover:bg-slate-800 p-3 rounded-xl border border-slate-800 text-xs text-emerald-400 flex items-center justify-between transition cursor-pointer"
            >
              <span><i className="fa-solid fa-circle-exclamation mr-2"></i>Refund Policy & Sunnah Terms</span>
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-emerald-950/40 p-5 rounded-xl border border-emerald-900/60 space-y-4 text-left">
        <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Burial Society Affiliation</h3>
        <p className="text-xs text-emerald-100 leading-relaxed">
          Burial societies and Masjids can integrate their registries into the QabrCare network. Contact us at support@mrkolapie.com or sales@mrkolapie.com.
        </p>
        <form onSubmit={handlePartnerSubmit} className="space-y-3">
          <input 
            type="text" 
            name="society" 
            required 
            placeholder="Masjid / Burial Society Name" 
            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-slate-100 focus:outline-none" 
          />
          <input 
            type="email" 
            name="email" 
            required 
            placeholder="Representative Email Address" 
            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-slate-100 focus:outline-none" 
          />
          <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl transition text-xs shadow-md cursor-pointer">
            Submit Integration Request
          </button>
        </form>
      </div>
    </div>
  );
}
