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
  first_sun: {
    description: "Collect 1 sun",
    suns: 1
  },
  super_suns: {
    description: "Collect 50 suns",
    suns: 50
  },
  sun_hacker: {
    description: "Collect 100 suns",
    suns: 100
  },
  master_of_suns: {
    description: "Collect 500 suns",
    suns: 500
  },
  sun_god: {
    description: "Collect 10000 suns",
    suns: 10000
  }
};
