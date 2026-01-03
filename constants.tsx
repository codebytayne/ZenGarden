
import React from 'react';

export const FOCUS_DURATION = 25; // Default 25 mins
export const SHORT_BREAK = 5;
export const LONG_BREAK = 15;

export const INITIAL_STATS = {
  totalFocusTime: 0,
  sunlight: 50,
  currentStreak: 0,
  bestStreak: 0,
  plantsGrown: 0,
};

export const PLANT_TEMPLATES = [
  {
    name: "Sun-Kissed Fern",
    scientificName: "Pteridophyta Solaris",
    rarity: "Common",
    imageUrl: "https://images.unsplash.com/photo-1515444744559-7be63e1600de?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Azure Moonbloom",
    scientificName: "Luna Floris",
    rarity: "Rare",
    imageUrl: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Emerald Spire",
    scientificName: "Abies Smaragdus",
    rarity: "Rare",
    imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Crystal Weaver",
    scientificName: "Crystallo Arachne",
    rarity: "Legendary",
    imageUrl: "https://images.unsplash.com/photo-1466692479467-3e13e51a67e8?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Ancient Oak of Time",
    scientificName: "Quercus Chronos",
    rarity: "Mythic",
    imageUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=400"
  }
];
