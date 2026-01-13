export const BASE_VALUES = {
    suns: 10,
    energy: 5
};

export const UPGRADE_SHOP = {
    golden_sun: {
    basePrice: 10,
    priceMultiplier: 1.2,
    suns: 3
  },

  energy_drink: {
    basePrice: 50,
    priceMultiplier: 1.3,
    energy: 2
  },

  study_book: {
    basePrice: 100,
    priceMultiplier: 1.4,
    suns: 6
  },

  magic_plant: {
    basePrice: 200,
    priceMultiplier: 1.5,
    suns: 4,
    energy: 2
  },

  solar_panel: {
    basePrice: 1000,
    priceMultiplier: 1.6,
    suns: 6,
    energy: 9
  }
  
};


export const ACHIEVEMENTS = {

  // sun achievements
  first_sun: {
    suns: 1
  },
  sun_seeker: {
    suns: 10
  },
  sun_chaser: {
    suns: 50
  },
  sun_collector: {
    suns: 100
  },
  solar_explorer: {
    suns: 250
  },
  super_suns: {
    suns: 500
  },
  sun_hacker: {
    suns: 1000
  },
  master_of_suns: {
    suns: 5000
  },
  solar_legend: {
    suns: 10000
  },
  sun_god: {
    suns: 50000
  },

  // energy achievements

  battery_saver: {
    energy: 50
  },

  watts_up: {
    energy: 100
  },

  overcharged: {
    energy: 200
  },

  full_circuit: {
    energy: 400
  },

  // overall study timer achievements

  warm_up: {
    overall: 3600 // 1h
  },

  power_hour: {
    overall: 7200 // 2h
  },

  brain_booster: {
    overall: 18000 // 5h
  },

  spark_of_focus: {
    overall: 36000 // 10h
  },

  mind_of_steel: {
    overall: 86400 // 24h
  },

  infinite_focus: {
    overall: 180000 // 50 h
  },

  getting_serious: {
    overall: 604800 // a full week
  },

  timeless: {
    overall: 1800000 // 500h
  },

  total_domination: {
    overall: 3600000 // 1000h
  },

  god_tier_study: {
    ovreall: 7200000 //2000h
  }
};