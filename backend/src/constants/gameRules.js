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
    energy: 500
  },

  overcharged: {
    energy: 1000
  },

  full_circuit: {
    energy: 10000
  }
};