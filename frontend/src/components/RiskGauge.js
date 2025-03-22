
import React from "react";
import { cn } from "../lib/utils";
import { Progress } from "./ui/progress";
import { motion } from "framer-motion";

const RiskGauge = ({ value, className }) => {
  // Calculate color based on risk value
  const getGaugeColor = (value) => {
    if (value === 0) return "bg-green-500";
    if (value < 30) return "bg-emerald-500";
    if (value < 60) return "bg-yellow-500";
    if (value < 80) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className={cn("w-full space-y-1", className)}>
      <Progress 
        value={value} 
        className="h-2 bg-gray-100"
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          className={cn("h-full rounded-full", getGaugeColor(value))}
        />
      </Progress>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Low Risk</span>
        <span>High Risk</span>
      </div>
    </div>
  );
};

export default RiskGauge;
