
import React from 'react';
import { Plant, Language } from '../types';
import { translations } from '../translations';

interface GardenProps {
  plants: Plant[];
  lang: Language;
}

const Garden: React.FC<GardenProps> = ({ plants, lang }) => {
  const t = translations[lang];
  
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-green-900">{t.mySanctuary}</h2>
        <span className="text-green-600 font-medium">{plants.length} {t.plantsCollected}</span>
      </div>

      {plants.length === 0 ? (
        <div className="bg-white/50 border-2 border-dashed border-green-200 rounded-3xl p-12 text-center">
          <div className="text-4xl mb-4">🌱</div>
          <p className="text-green-800 font-medium">{t.emptyGarden}</p>
          <p className="text-green-600 text-sm">{t.emptyGardenSub}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {plants.map((plant) => (
            <div key={plant.id} className="glass rounded-3xl overflow-hidden group cursor-pointer hover:shadow-xl hover:shadow-green-100 transition-all">
              <div className="aspect-square relative overflow-hidden">
                <img 
                  src={plant.imageUrl} 
                  alt={plant.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-full text-[10px] font-bold text-green-800">
                  {plant.rarity}
                </div>
              </div>
              <div className="p-3 bg-white">
                <h3 className="font-bold text-green-900 text-sm truncate">{plant.name}</h3>
                <p className="text-[10px] text-green-600 italic truncate mb-2">{plant.scientificName}</p>
                <div className="flex items-center text-[10px] font-bold text-orange-500 uppercase tracking-wider">
                  {plant.focusMinutes}{t.min} {t.focus}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Garden;
