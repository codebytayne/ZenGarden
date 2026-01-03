
import React, { useState, useEffect } from 'react';
import { UserStats, Plant, FocusSession, Language } from './types';
import { INITIAL_STATS, PLANT_TEMPLATES, FOCUS_DURATION } from './constants';
import { generatePlantLore, getCoachMessage } from './services/geminiService';
import { translations } from './translations';
import Timer from './components/Timer';
import Garden from './components/Garden';
import { LeafIcon, SunIcon, ChartIcon, GardenIcon, TrophyIcon } from './components/Icons';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [activeTab, setActiveTab] = useState<'focus' | 'garden' | 'stats'>('focus');
  const [isActive, setIsActive] = useState(false);
  const [coachMsg, setCoachMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const t = translations[lang];

  // Track the plant being grown right now
  const [currentPlantTemplate, setCurrentPlantTemplate] = useState(PLANT_TEMPLATES[0]);

  useEffect(() => {
    // Initial coach message or when language changes
    const fetchCoach = async () => {
      const msg = await getCoachMessage(0, stats.totalFocusTime, lang);
      setCoachMsg(msg);
    };
    fetchCoach();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const handleFocusComplete = async (minutes: number) => {
    setIsLoading(true);
    const newTotalTime = stats.totalFocusTime + minutes;
    const newSunlight = stats.sunlight + (minutes * 2);
    
    // Generate new plant lore using Gemini in the correct language
    const lore = await generatePlantLore(currentPlantTemplate.name, currentPlantTemplate.rarity, lang);
    
    const newPlant: Plant = {
      id: Math.random().toString(36).substr(2, 9),
      ...currentPlantTemplate,
      lore,
      stage: 'Mature',
      focusMinutes: minutes,
      discoveredAt: Date.now(),
    };

    setPlants(prev => [newPlant, ...prev]);
    setStats(prev => ({
      ...prev,
      totalFocusTime: newTotalTime,
      sunlight: newSunlight,
      plantsGrown: prev.plantsGrown + 1,
      currentStreak: prev.currentStreak + 1,
      bestStreak: Math.max(prev.bestStreak, prev.currentStreak + 1)
    }));

    // Update coach message
    const msg = await getCoachMessage(minutes, newTotalTime, lang);
    setCoachMsg(msg);

    // Pick a new template for the next session
    const nextIdx = Math.floor(Math.random() * PLANT_TEMPLATES.length);
    setCurrentPlantTemplate(PLANT_TEMPLATES[nextIdx]);
    
    setIsLoading(false);
    alert(`${t.congrats} ${newPlant.name}!`);
  };

  const toggleLang = () => {
    const langs: Language[] = ['en', 'pt', 'es'];
    const nextIdx = (langs.indexOf(lang) + 1) % langs.length;
    setLang(langs[nextIdx]);
  };

  return (
    <div className="min-h-screen max-w-md mx-auto relative flex flex-col bg-[#f0fdf4] shadow-2xl">
      {/* Header */}
      <header className="p-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-200">
            <LeafIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-green-900 leading-tight">{t.title}</h1>
            <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">{t.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={toggleLang}
            className="w-8 h-8 rounded-full bg-white border border-green-100 flex items-center justify-center text-xs font-bold text-green-700 hover:bg-green-50 transition-colors uppercase"
          >
            {lang}
          </button>
          <div className="flex items-center space-x-3 bg-white px-3 py-1.5 rounded-full border border-green-100 shadow-sm">
            <div className="flex items-center space-x-1">
              <SunIcon className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-bold text-green-900">{stats.sunlight}</span>
            </div>
            <div className="w-px h-4 bg-green-100" />
            <div className="flex items-center space-x-1 text-green-900 font-bold text-sm">
               <span>🔥 {stats.currentStreak}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Coach Bubble */}
      <div className="px-6 mb-2">
        <div className="bg-white/80 p-4 rounded-3xl border border-green-100 relative shadow-sm min-h-[80px] flex flex-col justify-center">
          <div className="text-xs text-green-500 font-bold mb-1 uppercase tracking-tighter">{t.coachPrefix}</div>
          <p className="text-green-800 text-sm italic font-medium leading-tight">
            "{coachMsg || t.initialCoach}"
          </p>
          <div className="absolute -bottom-2 left-8 w-4 h-4 bg-white/80 border-b border-r border-green-100 transform rotate-45" />
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto hide-scrollbar pb-24">
        {activeTab === 'focus' && (
          <Timer 
            initialMinutes={FOCUS_DURATION} 
            isActive={isActive}
            setIsActive={setIsActive}
            onComplete={handleFocusComplete}
            currentPlant={currentPlantTemplate}
            lang={lang}
          />
        )}

        {activeTab === 'garden' && (
          <Garden plants={plants} lang={lang} />
        )}

        {activeTab === 'stats' && (
          <div className="p-6 space-y-6">
             <div className="grid grid-cols-2 gap-4">
               <div className="bg-white p-5 rounded-3xl border border-green-100 shadow-sm">
                 <p className="text-xs font-bold text-green-500 uppercase tracking-wider mb-1">{t.totalFocus}</p>
                 <p className="text-3xl font-bold text-green-900">{stats.totalFocusTime}<span className="text-sm ml-1">{t.min}</span></p>
               </div>
               <div className="bg-white p-5 rounded-3xl border border-green-100 shadow-sm">
                 <p className="text-xs font-bold text-green-500 uppercase tracking-wider mb-1">{t.plantsGrown}</p>
                 <p className="text-3xl font-bold text-green-900">{stats.plantsGrown}</p>
               </div>
               <div className="bg-white p-5 rounded-3xl border border-green-100 shadow-sm">
                 <p className="text-xs font-bold text-green-500 uppercase tracking-wider mb-1">{t.bestStreak}</p>
                 <p className="text-3xl font-bold text-green-900">{stats.bestStreak}<span className="text-sm ml-1">{t.days}</span></p>
               </div>
               <div className="bg-white p-5 rounded-3xl border border-green-100 shadow-sm">
                 <p className="text-xs font-bold text-green-500 uppercase tracking-wider mb-1">{t.gardenHealth}</p>
                 <p className="text-3xl font-bold text-green-900">84%</p>
               </div>
             </div>

             <div className="bg-green-900 p-6 rounded-3xl text-white shadow-xl shadow-green-100">
                <div className="flex items-center space-x-3 mb-4">
                  <TrophyIcon className="w-8 h-8 text-yellow-400" />
                  <h3 className="text-lg font-bold">{t.milestones}</h3>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span>{t.centuryForest}</span>
                      <span>{Math.min(100, (stats.totalFocusTime / 100) * 100).toFixed(0)}%</span>
                    </div>
                    <div className="h-2 bg-green-800 rounded-full overflow-hidden">
                      <div className="h-full bg-green-400" style={{ width: `${Math.min(100, (stats.totalFocusTime / 100) * 100)}%` }} />
                    </div>
                    <p className="text-[10px] text-green-300 italic">{t.centuryForestDesc}</p>
                  </div>
                </div>
             </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm glass rounded-full p-2 flex items-center justify-between shadow-xl shadow-green-200/50 z-50">
        <button 
          onClick={() => setActiveTab('focus')}
          className={`flex-1 py-3 rounded-full flex flex-col items-center transition-all ${activeTab === 'focus' ? 'bg-green-600 text-white shadow-lg shadow-green-200' : 'text-green-800 hover:bg-white/50'}`}
        >
          <LeafIcon className={`w-5 h-5 mb-0.5 ${activeTab === 'focus' ? 'text-white' : 'text-green-600'}`} />
          <span className="text-[10px] font-bold uppercase tracking-widest">{t.focus}</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('garden')}
          className={`flex-1 py-3 rounded-full flex flex-col items-center transition-all ${activeTab === 'garden' ? 'bg-green-600 text-white shadow-lg shadow-green-200' : 'text-green-800 hover:bg-white/50'}`}
        >
          <GardenIcon className={`w-5 h-5 mb-0.5 ${activeTab === 'garden' ? 'text-white' : 'text-green-600'}`} />
          <span className="text-[10px] font-bold uppercase tracking-widest">{t.garden}</span>
        </button>

        <button 
          onClick={() => setActiveTab('stats')}
          className={`flex-1 py-3 rounded-full flex flex-col items-center transition-all ${activeTab === 'stats' ? 'bg-green-600 text-white shadow-lg shadow-green-200' : 'text-green-800 hover:bg-white/50'}`}
        >
          <ChartIcon className={`w-5 h-5 mb-0.5 ${activeTab === 'stats' ? 'text-white' : 'text-green-600'}`} />
          <span className="text-[10px] font-bold uppercase tracking-widest">{t.stats}</span>
        </button>
      </nav>

      {/* Overlay Loading */}
      {isLoading && (
        <div className="absolute inset-0 z-[100] bg-white/90 backdrop-blur-md flex flex-col items-center justify-center p-12 text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-6" />
          <h2 className="text-2xl font-bold text-green-900 mb-2">{t.plantingGrowth}</h2>
          <p className="text-green-600 italic">{t.geminiLoading}</p>
        </div>
      )}
    </div>
  );
};

export default App;
