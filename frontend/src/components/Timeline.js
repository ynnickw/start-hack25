import React, { useState } from "react";
import { cn } from "../lib/utils";
import { motion } from "framer-motion";
import { Card } from "./ui/card";
import RiskGauge from "./RiskGauge";

const Timeline = ({ months, currentMonth, className }) => {
  return (
    <div className={cn("w-full pb-6 pt-4", className)}>
      <h3 className="text-sm font-medium text-muted-foreground mb-4 ml-1">
        Growing Season Timeline
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    <RiskItem key={index} risk={risk} />
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

const RiskItem = ({ risk }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="relative flex gap-2 items-center"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span>{risk.icon}</span>
      <span className="text-sm">{risk.name}</span>

      {showTooltip && (
        <div className="absolute left-1/2 top-6 transform -translate-x-1/2 bg-white text-black text-xs px-3 py-2 rounded-md shadow-md border border-gray-200 w-48 z-50">
          {risk.description}
        </div>
      )}
    </div>
  );
};

export default Timeline;
