// mock_data.js
// Mock data for 10 companies for CarbonTrack dashboard

const mockCompanies = [
  {
    id: "tesla",
    name: "Tesla, Inc.",
    sector: "Automotive",
    industry: "Electric Vehicles & Clean Energy",
    status: "Public",
    overview: "Tesla, Inc. is an American electric vehicle and clean energy company...",
    sustainabilityRating: 85,
    emissions: {
      2024: { scope1: 245890, scope2: 189650, scope3: 1245780 },
      2023: { scope1: 267430, scope2: 215320, scope3: 1387650 },
      2022: { scope1: 298750, scope2: 243780, scope3: 1543920 }
    },
    targets: { baseYear: 2020, baseEmissions: 2400000, current: 1681320, target2030: 960000 },
    strategies: [
      { name: "Supply Chain Optimization", percent: 45 },
      { name: "Renewable Energy", percent: 68 },
      { name: "Battery Recycling", percent: 72 }
    ],
    kpis: {
      emissionsIntensity: 24.8,
      reductionRate: 8.2,
      targetAmbition: 65,
      renewableEnergy: 68.5
    }
  },
  {
    id: "apple",
    name: "Apple Inc.",
    sector: "Technology",
    industry: "Consumer Electronics",
    status: "Public",
    overview: "Apple Inc. designs, manufactures, and markets smartphones, computers, and more...",
    sustainabilityRating: 92,
    emissions: {
      2024: { scope1: 120000, scope2: 95000, scope3: 980000 },
      2023: { scope1: 130000, scope2: 102000, scope3: 1050000 },
      2022: { scope1: 140000, scope2: 110000, scope3: 1120000 }
    },
    targets: { baseYear: 2020, baseEmissions: 1300000, current: 1195000, target2030: 650000 },
    strategies: [
      { name: "Green Manufacturing", percent: 60 },
      { name: "Renewable Energy", percent: 80 },
      { name: "Product Recycling", percent: 75 }
    ],
    kpis: {
      emissionsIntensity: 18.2,
      reductionRate: 10.1,
      targetAmbition: 80,
      renewableEnergy: 80.0
    }
  },
  {
    id: "unilever",
    name: "Unilever PLC",
    sector: "Consumer Goods",
    industry: "Food & Personal Care",
    status: "Public",
    overview: "Unilever is a British multinational consumer goods company...",
    sustainabilityRating: 88,
    emissions: {
      2024: { scope1: 90000, scope2: 70000, scope3: 600000 },
      2023: { scope1: 95000, scope2: 75000, scope3: 650000 },
      2022: { scope1: 100000, scope2: 80000, scope3: 700000 }
    },
    targets: { baseYear: 2020, baseEmissions: 900000, current: 760000, target2030: 400000 },
    strategies: [
      { name: "Sustainable Sourcing", percent: 55 },
      { name: "Energy Efficiency", percent: 70 },
      { name: "Packaging Reduction", percent: 60 }
    ],
    kpis: {
      emissionsIntensity: 20.5,
      reductionRate: 9.5,
      targetAmbition: 70,
      renewableEnergy: 72.0
    }
  },
  {
    id: "nestle",
    name: "Nestlé S.A.",
    sector: "Consumer Goods",
    industry: "Food & Beverage",
    status: "Public",
    overview: "Nestlé is the world's largest food & beverage company...",
    sustainabilityRating: 80,
    emissions: {
      2024: { scope1: 110000, scope2: 85000, scope3: 750000 },
      2023: { scope1: 120000, scope2: 90000, scope3: 800000 },
      2022: { scope1: 130000, scope2: 95000, scope3: 850000 }
    },
    targets: { baseYear: 2020, baseEmissions: 1100000, current: 945000, target2030: 600000 },
    strategies: [
      { name: "Regenerative Agriculture", percent: 50 },
      { name: "Renewable Energy", percent: 65 },
      { name: "Water Stewardship", percent: 55 }
    ],
    kpis: {
      emissionsIntensity: 22.1,
      reductionRate: 7.8,
      targetAmbition: 60,
      renewableEnergy: 65.0
    }
  },
  {
    id: "microsoft",
    name: "Microsoft Corporation",
    sector: "Technology",
    industry: "Software & Cloud",
    status: "Public",
    overview: "Microsoft develops, licenses, and supports software, services, and devices...",
    sustainabilityRating: 95,
    emissions: {
      2024: { scope1: 80000, scope2: 60000, scope3: 500000 },
      2023: { scope1: 85000, scope2: 65000, scope3: 550000 },
      2022: { scope1: 90000, scope2: 70000, scope3: 600000 }
    },
    targets: { baseYear: 2020, baseEmissions: 700000, current: 640000, target2030: 300000 },
    strategies: [
      { name: "Carbon Removal", percent: 70 },
      { name: "Renewable Energy", percent: 90 },
      { name: "Data Center Efficiency", percent: 80 }
    ],
    kpis: {
      emissionsIntensity: 15.0,
      reductionRate: 12.0,
      targetAmbition: 90,
      renewableEnergy: 90.0
    }
  },
  {
    id: "bp",
    name: "BP plc",
    sector: "Energy",
    industry: "Oil & Gas",
    status: "Public",
    overview: "BP is a British multinational oil and gas company...",
    sustainabilityRating: 60,
    emissions: {
      2024: { scope1: 500000, scope2: 200000, scope3: 2500000 },
      2023: { scope1: 520000, scope2: 210000, scope3: 2600000 },
      2022: { scope1: 540000, scope2: 220000, scope3: 2700000 }
    },
    targets: { baseYear: 2020, baseEmissions: 3000000, current: 3200000, target2030: 1800000 },
    strategies: [
      { name: "Methane Reduction", percent: 30 },
      { name: "Renewables Investment", percent: 40 },
      { name: "Carbon Capture", percent: 25 }
    ],
    kpis: {
      emissionsIntensity: 80.0,
      reductionRate: 4.5,
      targetAmbition: 40,
      renewableEnergy: 25.0
    }
  },
  {
    id: "ikea",
    name: "IKEA Group",
    sector: "Retail",
    industry: "Home Furnishings",
    status: "Private",
    overview: "IKEA is a Swedish-founded multinational group that designs and sells furniture...",
    sustainabilityRating: 78,
    emissions: {
      2024: { scope1: 60000, scope2: 40000, scope3: 350000 },
      2023: { scope1: 65000, scope2: 42000, scope3: 370000 },
      2022: { scope1: 70000, scope2: 44000, scope3: 390000 }
    },
    targets: { baseYear: 2020, baseEmissions: 500000, current: 450000, target2030: 250000 },
    strategies: [
      { name: "Circular Products", percent: 60 },
      { name: "Renewable Energy", percent: 75 },
      { name: "Sustainable Forestry", percent: 65 }
    ],
    kpis: {
      emissionsIntensity: 19.0,
      reductionRate: 8.0,
      targetAmbition: 75,
      renewableEnergy: 75.0
    }
  },
  {
    id: "samsung",
    name: "Samsung Electronics",
    sector: "Technology",
    industry: "Consumer Electronics",
    status: "Public",
    overview: "Samsung Electronics is a South Korean multinational electronics company...",
    sustainabilityRating: 82,
    emissions: {
      2024: { scope1: 150000, scope2: 120000, scope3: 900000 },
      2023: { scope1: 160000, scope2: 130000, scope3: 950000 },
      2022: { scope1: 170000, scope2: 140000, scope3: 1000000 }
    },
    targets: { baseYear: 2020, baseEmissions: 1200000, current: 1170000, target2030: 700000 },
    strategies: [
      { name: "Green Manufacturing", percent: 55 },
      { name: "Renewable Energy", percent: 70 },
      { name: "Product Recycling", percent: 60 }
    ],
    kpis: {
      emissionsIntensity: 21.5,
      reductionRate: 7.2,
      targetAmbition: 70,
      renewableEnergy: 70.0
    }
  },
  {
    id: "toyota",
    name: "Toyota Motor Corporation",
    sector: "Automotive",
    industry: "Automobiles",
    status: "Public",
    overview: "Toyota is a Japanese multinational automotive manufacturer...",
    sustainabilityRating: 75,
    emissions: {
      2024: { scope1: 300000, scope2: 180000, scope3: 1200000 },
      2023: { scope1: 320000, scope2: 190000, scope3: 1250000 },
      2022: { scope1: 340000, scope2: 200000, scope3: 1300000 }
    },
    targets: { baseYear: 2020, baseEmissions: 1500000, current: 1680000, target2030: 900000 },
    strategies: [
      { name: "Hybrid Technology", percent: 65 },
      { name: "Renewable Energy", percent: 60 },
      { name: "Supply Chain Optimization", percent: 50 }
    ],
    kpis: {
      emissionsIntensity: 28.0,
      reductionRate: 6.5,
      targetAmbition: 60,
      renewableEnergy: 60.0
    }
  },
  {
    id: "google",
    name: "Alphabet Inc. (Google)",
    sector: "Technology",
    industry: "Internet Services",
    status: "Public",
    overview: "Alphabet is the parent company of Google, specializing in internet-related services...",
    sustainabilityRating: 97,
    emissions: {
      2024: { scope1: 70000, scope2: 50000, scope3: 400000 },
      2023: { scope1: 75000, scope2: 55000, scope3: 420000 },
      2022: { scope1: 80000, scope2: 60000, scope3: 440000 }
    },
    targets: { baseYear: 2020, baseEmissions: 600000, current: 520000, target2030: 200000 },
    strategies: [
      { name: "AI Optimization", percent: 80 },
      { name: "Renewable Energy", percent: 95 },
      { name: "Data Center Efficiency", percent: 90 }
    ],
    kpis: {
      emissionsIntensity: 12.0,
      reductionRate: 15.0,
      targetAmbition: 95,
      renewableEnergy: 95.0
    }
  }
];

// Export for use in index.html
if (typeof window !== 'undefined') {
  window.mockCompanies = mockCompanies;
}
