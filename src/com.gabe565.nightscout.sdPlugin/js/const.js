const Unit = {
  Mgdl: "mgdl",
  Mmol: "mmol",
};

const ConversionFactor = 0.0555;

const DefaultSettings = {
  nightscoutUrl: "",
  token: "",
  updateInterval: 60000,
  unit: Unit.Mgdl,
  normalHigh: 180,
  normalLow: 80,
  urgentHigh: 200,
  urgentLow: 70,
  inRangeColor: "#55ff66",
  normalColor: "#ffff44",
  urgentColor: "#ff4444",
};
