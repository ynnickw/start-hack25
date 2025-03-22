import React from "react";
import { Card } from "./ui/card";
import { cn } from "../lib/utils";
import { motion } from "framer-motion";

const RiskCard = ({ title, description, icon, riskLevel, image, price, className }) => {
  const riskClasses = {
    "none": "bg-risk-none border-risk-none-border text-risk-none-text",
    "low": "bg-risk-low border-risk-low-border text-risk-low-text",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -4 }}
      className={cn("risk-card", className)}
    >
      <Card className={cn(
        "flex flex-col p-6 border rounded-2xl shadow-sm transition-all duration-300",
        riskClasses[riskLevel],
      )}>
        <div className="flex items-center mb-4 justify-between">
          <div className="flex items-center">
            <div className={cn(
              "p-2 rounded-full mr-3",
              riskLevel === "none" ? "bg-risk-none-border/30" : "bg-risk-low-border/30"
            )}>
              {icon}
            </div>
            <h3 className="font-medium text-lg tracking-tight">{title}</h3>
          </div>

        </div>
        <div className="flex justify-between gap-4">
          <div className="flex flex-col gap-8">
            <p className="text-sm opacity-90 leading-relaxed">{description}</p>
            {price && (
              <div className="text-4xl font-semibold text-black">
                ₹{price}
              </div>
            )}
          </div>
          {image && (
            <img
              src={image}
              alt={title}
              className="w-[130px] object-cover rounded-xl"
            />
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default RiskCard;
