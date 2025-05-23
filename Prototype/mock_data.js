window.mockCompanies = [
  {
    id: "tesla",
    name: "Tesla, Inc.",
    sector: "Automotive",
    industry: "Electric Vehicles & Clean Energy",
    status: "Public",
    country: "USA",
    overview: "Tesla, Inc. is an American electric vehicle and clean energy company...",
    sustainabilityRating: 85,
    emissions: {
      2024: { scope1: 245890, scope2: 189650, scope3: 1245780 },
      2023: { scope1: 267430, scope2: 215320, scope3: 1387650 },
      2022: { scope1: 298750, scope2: 243780, scope3: 1543920 }
    },
    targets: { baseYear: 2020, baseEmissions: 2400000, current: 1680000, target2030: 960000 },
    strategies: [
      { name: "Supply Chain Optimization", percent: 45 },
      { name: "Renewable Energy", percent: 68 },
      { name: "Battery Recycling", percent: 72 }
    ],
    kpis: { emissionsIntensity: 24.8, reductionRate: 8.2, targetAmbition: 65, renewableEnergy: 68.5, sustainabilityRating: 85 }
  },
  {
    id: "apple",
    name: "Apple Inc.",
    sector: "Technology",
    industry: "Consumer Electronics",
    status: "Public",
    country: "USA",
    overview: "Apple Inc. is a global leader in technology and innovation...",
    sustainabilityRating: 92,
    emissions: {
      2024: { scope1: 120000, scope2: 95000, scope3: 800000 },
      2023: { scope1: 130000, scope2: 100000, scope3: 850000 },
      2022: { scope1: 140000, scope2: 110000, scope3: 900000 }
    },
    targets: { baseYear: 2020, baseEmissions: 1200000, current: 1015000, target2030: 600000 },
    strategies: [
      { name: "Renewable Energy", percent: 80 },
      { name: "Product Recycling", percent: 60 }
    ],
    kpis: { emissionsIntensity: 18.2, reductionRate: 10.1, targetAmbition: 80, renewableEnergy: 80, sustainabilityRating: 92 }
  },
  {
    id: "siemens",
    name: "Siemens AG",
    sector: "Industrial",
    industry: "Engineering",
    status: "Public",
    country: "Germany",
    overview: "Siemens AG is a German multinational conglomerate and Europe’s largest industrial manufacturing company...",
    sustainabilityRating: 88,
    emissions: {
      2024: { scope1: 90000, scope2: 70000, scope3: 600000 },
      2023: { scope1: 95000, scope2: 75000, scope3: 650000 },
      2022: { scope1: 100000, scope2: 80000, scope3: 700000 }
    },
    targets: { baseYear: 2020, baseEmissions: 900000, current: 760000, target2030: 400000 },
    strategies: [
      { name: "Process Electrification", percent: 55 },
      { name: "Green Procurement", percent: 50 }
    ],
    kpis: { emissionsIntensity: 22.5, reductionRate: 7.5, targetAmbition: 70, renewableEnergy: 60, sustainabilityRating: 88 }
  },
  {
    id: "toyota",
    name: "Toyota Motor Corp.",
    sector: "Automotive",
    industry: "Automobiles",
    status: "Public",
    country: "Japan",
    overview: "Toyota is a Japanese multinational automotive manufacturer...",
    sustainabilityRating: 80,
    emissions: {
      2024: { scope1: 300000, scope2: 200000, scope3: 1200000 },
      2023: { scope1: 320000, scope2: 210000, scope3: 1300000 },
      2022: { scope1: 340000, scope2: 220000, scope3: 1400000 }
    },
    targets: { baseYear: 2020, baseEmissions: 1800000, current: 1700000, target2030: 900000 },
    strategies: [
      { name: "Hybrid Vehicles", percent: 60 },
      { name: "Hydrogen Tech", percent: 40 }
    ],
    kpis: { emissionsIntensity: 30.1, reductionRate: 6.8, targetAmbition: 60, renewableEnergy: 55, sustainabilityRating: 80 }
  },
  {
    id: "unilever",
    name: "Unilever PLC",
    sector: "Consumer Goods",
    industry: "Food & Beverage",
    status: "Public",
    country: "UK",
    overview: "Unilever is a British multinational consumer goods company...",
    sustainabilityRating: 95,
    emissions: {
      2024: { scope1: 50000, scope2: 40000, scope3: 300000 },
      2023: { scope1: 55000, scope2: 45000, scope3: 350000 },
      2022: { scope1: 60000, scope2: 50000, scope3: 400000 }
    },
    targets: { baseYear: 2020, baseEmissions: 500000, current: 390000, target2030: 200000 },
    strategies: [
      { name: "Sustainable Sourcing", percent: 85 },
      { name: "Circular Packaging", percent: 70 }
    ],
    kpis: { emissionsIntensity: 12.5, reductionRate: 12.2, targetAmbition: 90, renewableEnergy: 90, sustainabilityRating: 95 }
  },
  {
    id: "nestle",
    name: "Nestlé S.A.",
    sector: "Food & Beverage",
    industry: "Food Processing",
    status: "Public",
    country: "Switzerland",
    overview: "Nestlé S.A. is a Swiss multinational food and drink processing conglomerate...",
    sustainabilityRating: 90,
    emissions: {
      2024: { scope1: 70000, scope2: 60000, scope3: 400000 },
      2023: { scope1: 75000, scope2: 65000, scope3: 450000 },
      2022: { scope1: 80000, scope2: 70000, scope3: 500000 }
    },
    targets: { baseYear: 2020, baseEmissions: 600000, current: 530000, target2030: 300000 },
    strategies: [
      { name: "Regenerative Agriculture", percent: 75 },
      { name: "Water Stewardship", percent: 60 }
    ],
    kpis: { emissionsIntensity: 15.8, reductionRate: 9.5, targetAmbition: 85, renewableEnergy: 75, sustainabilityRating: 90 }
  },
  {
    id: "samsung",
    name: "Samsung Electronics",
    sector: "Technology",
    industry: "Electronics",
    status: "Public",
    country: "South Korea",
    overview: "Samsung Electronics is a South Korean multinational electronics company...",
    sustainabilityRating: 87,
    emissions: {
      2024: { scope1: 110000, scope2: 90000, scope3: 700000 },
      2023: { scope1: 120000, scope2: 95000, scope3: 750000 },
      2022: { scope1: 130000, scope2: 100000, scope3: 800000 }
    },
    targets: { baseYear: 2020, baseEmissions: 900000, current: 800000, target2030: 500000 },
    strategies: [
      { name: "Energy Efficiency", percent: 70 },
      { name: "Green Manufacturing", percent: 65 }
    ],
    kpis: { emissionsIntensity: 20.3, reductionRate: 8.8, targetAmbition: 75, renewableEnergy: 70, sustainabilityRating: 87 }
  },
  {
    id: "enel",
    name: "Enel S.p.A.",
    sector: "Utilities",
    industry: "Electricity & Gas",
    status: "Public",
    country: "Italy",
    overview: "Enel S.p.A. is an Italian multinational manufacturer and distributor of electricity and gas...",
    sustainabilityRating: 83,
    emissions: {
      2024: { scope1: 150000, scope2: 120000, scope3: 900000 },
      2023: { scope1: 160000, scope2: 130000, scope3: 950000 },
      2022: { scope1: 170000, scope2: 140000, scope3: 1000000 }
    },
    targets: { baseYear: 2020, baseEmissions: 1200000, current: 1170000, target2030: 600000 },
    strategies: [
      { name: "Grid Decarbonization", percent: 60 },
      { name: "Renewable Expansion", percent: 70 }
    ],
    kpis: { emissionsIntensity: 28.1, reductionRate: 7.2, targetAmbition: 65, renewableEnergy: 72, sustainabilityRating: 83 }
  },
  {
    id: "bp",
    name: "BP PLC",
    sector: "Energy",
    industry: "Oil & Gas",
    status: "Public",
    country: "UK",
    overview: "BP PLC is a British multinational oil and gas company...",
    sustainabilityRating: 70,
    emissions: {
      2024: { scope1: 400000, scope2: 300000, scope3: 1400000 },
      2023: { scope1: 420000, scope2: 320000, scope3: 1450000 },
      2022: { scope1: 440000, scope2: 340000, scope3: 1500000 }
    },
    targets: { baseYear: 2020, baseEmissions: 2100000, current: 2000000, target2030: 1200000 },
    strategies: [
      { name: "Methane Reduction", percent: 50 },
      { name: "Renewables Investment", percent: 55 }
    ],
    kpis: { emissionsIntensity: 35.2, reductionRate: 5.5, targetAmbition: 50, renewableEnergy: 55, sustainabilityRating: 70 }
  },
  {
    id: "vw",
    name: "Volkswagen AG",
    sector: "Automotive",
    industry: "Automobiles",
    status: "Public",
    country: "Germany",
    overview: "Volkswagen AG is a German multinational automotive manufacturer...",
    sustainabilityRating: 78,
    emissions: {
      2024: { scope1: 320000, scope2: 210000, scope3: 1050000 },
      2023: { scope1: 340000, scope2: 220000, scope3: 1100000 },
      2022: { scope1: 360000, scope2: 230000, scope3: 1150000 }
    },
    targets: { baseYear: 2020, baseEmissions: 1700000, current: 1580000, target2030: 800000 },
    strategies: [
      { name: "EV Expansion", percent: 65 },
      { name: "Green Steel", percent: 50 }
    ],
    kpis: { emissionsIntensity: 27.7, reductionRate: 6.9, targetAmbition: 60, renewableEnergy: 65, sustainabilityRating: 78 }
  }
];
