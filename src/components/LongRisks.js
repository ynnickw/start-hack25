import React from "react";
import { cn } from "../lib/utils";
import { motion } from "framer-motion";
import { Card } from "./ui/card";
import RiskGauge from "./RiskGauge";

const LongRisks = ({ months, currentMonth, className }) => {
  console.log(months);
  return (
    <div className={cn("w-full", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {months.map((month, index) => (
          <motion.div
            key={month.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              ease: [0.23, 1, 0.32, 1],
            }}
          >
            <Card
              className={cn(
                "p-5 border transition-all h-full",
                index === currentMonth ? "shadow-md" : "border-border"
              )}
              style={index === currentMonth ? { borderColor: "#36398E" } : {}}
            >
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="font-medium text-lg"
                  style={index === currentMonth ? { color: "#36398E" } : {}}
                >
                  {month.name}
                </h3>
                {index === currentMonth && (
                  <span
                    className="text-xs px-2 py-1 rounded-full"
                    style={{ backgroundColor: "#36398E10", color: "#36398E" }}
                  >
                    Current
                  </span>
                )}
              </div>

              <div className="space-y-4">
                <RiskGauge value={month.riskPercentage} />

                <div className="flex justify-between items-center">
                  {month.hasRisks ? (
                    <div className="text-sm">
                      <span className={month.riskPercentage > 70 ? "text-red-500" : "text-amber-500"}>
                        {month.riskPercentage > 70 ? "Attention needed" : "Monitor conditions"}
                      </span>
                    </div>
                  ) : (
                    <div className="text-sm text-green-600">Optimal conditions</div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  {month.risks.map((risk, index) => (
                    <div key={index} className="flex gap-2">
                      {risk.icon}
                      <span className="text-sm">{risk.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LongRisks;
