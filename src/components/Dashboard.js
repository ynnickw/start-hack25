import React from "react";
import { Separator } from "./ui/separator";
import DashboardHeader from "./DashboardHeader";
import Timeline from "./Timeline";
import RiskCard from "./RiskCard";
import LongRisks from "./LongRisks";
import { TrendingUp, ShieldCheck, Sun, CloudRain, Thermometer } from "lucide-react";
import { motion } from "framer-motion";

const riskIcons = {
  S_heat: { icon: <Sun className="w-5 h-5" />, name: "Heat Stress", description: "Reduced plant growth from excess heat."},
  S_night: { icon: <CloudRain className="w-5 h-5" />, name: "Night Stress", description: "Reduced plant recovery due to warm nights"},
  S_frost: { icon: <Thermometer className="w-5 h-5" />, name: "Frost Stress", description: "Plant damage from freezing temperatures."},
};


const Dashboard = ({ apiResults, formData }) => {
  console.log(apiResults)
  const uniqueMonths = Object.keys(apiResults?.risk_factors?.S_heat || {});
  const currentMonthYear = new Date().toISOString().slice(0, 7); 

  // Find the index of the current month in the array, or return -1 if not found
  const currentMonthIndex = uniqueMonths.indexOf(currentMonthYear);
    // Process the API response to create the months array
  const months = uniqueMonths.map((monthYear) => {
    const [year, month] = monthYear.split("-");

    // Get risk values for this month
    const S_heat = apiResults?.risk_factors?.S_heat?.[monthYear] || 0;
    const S_night = apiResults?.risk_factors?.S_night?.[monthYear] || 0;
    const S_frost = apiResults?.risk_factors?.S_frost?.[monthYear] || 0;

    // Find the highest risk percentage for the month
    const maxRisk = Math.max(S_heat, S_night, S_frost) * 100; // Convert to percentage

    // Identify risks that exceed 70%
    const risks = [];
    if (S_heat > 0.3) risks.push(riskIcons.S_heat);
    if (S_night > 0.3) risks.push(riskIcons.S_night);
    if (S_frost > 0.3) risks.push(riskIcons.S_frost);

    return {
      name: new Date(year, month - 1).toLocaleString("en-US", { month: "long" }),
      hasRisks: maxRisk > 30,
      riskPercentage: maxRisk.toFixed(2), // Keep only 2 decimal places
      risks, // Includes array of risk icons and names
    };
  });

  const risks = [
    {
      name: "Yield Risk",
      hasRisks: apiResults?.risk_factors?.yield_risk > 0.4,
      riskPercentage: ((apiResults?.risk_factors?.yield_risk || 0) * 100).toFixed(2),
      risks: []
    },
    {
      name: "Drought Risk",
      hasRisks: apiResults?.risk_factors?.drought_risk > 0.4,
      riskPercentage: ((apiResults?.risk_factors?.drought_risk || 0) * 100).toFixed(2),
      risks: []
    }
  ];

  console.log(risks)

  const products = [
    {
      id: 1,
      title: "Stress Buster",
      description: "Protects crops from heat, cold, and drought for healthier, stronger growth.",
      icon: <ShieldCheck className="w-5 h-5" />,
      riskLevel: apiResults?.stress_buster_recommended ? "low" : "none",
      image: "stress_buster.png",
      price: 800
    },
    {
      id: 2,
      title: "Yield Buster",
      description: "Enhances nutrient transport, boosts growth, and maximizes crop yield.",
      icon: <TrendingUp className="w-5 h-5" />,
      riskLevel: apiResults?.yield_booster_recommended ? "low" : "none",
      image: "yield_booster.png",
      price: 700
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="bg-background overflow-y-auto">
      <DashboardHeader farmName={"Summary for your Farm in " + formData.location.name + " 🇮🇳"} cropType={formData.cropType} />

      <Separator className="my-4" />

      <Timeline months={months} currentMonth={currentMonthIndex} className="mb-2" />

      <div className="flex flex-col gap-4">
        <div>
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <h2 className="text-xl font-semibold mb-4">Season-Long Risks</h2>
            <LongRisks months={risks} currentMonth={-1} className="mb-2" />
          </motion.div>
        </div>

        <div className="lg:col-span-2">
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <h2 className="text-xl font-semibold mb-4">Products</h2>
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((risk) => (
                <RiskCard key={risk.id} title={risk.title} description={risk.description} icon={risk.icon} riskLevel={risk.riskLevel} image={risk.image} price={risk.price} />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
