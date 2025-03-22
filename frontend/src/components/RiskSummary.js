
import React from "react";
import { Card } from "./ui/card";
import { Shield, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const RiskSummary = ({ lowRiskCount, noRiskCount }) => {
  const totalRisks = lowRiskCount + noRiskCount;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    >
      <Card className="bg-white border p-6 rounded-2xl shadow-sm">
        <div className="flex items-center mb-4">
          {lowRiskCount > 0 ? (
            <Shield className="w-5 h-5 text-amber-500 mr-2" />
          ) : (
            <ShieldCheck className="w-5 h-5 text-green-500 mr-2" />
          )}
          <h3 className="font-medium">Current Risk Assessment</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-muted-foreground">Risk Status</span>
              <span className="text-sm font-medium">
                {lowRiskCount > 0 ? "Low Risks Present" : "No Risks"}
              </span>
            </div>
            <div className="h-2 bg-secondary rounded-full">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(lowRiskCount / totalRisks) * 100}%` }}
                transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
                className="h-full bg-amber-400 rounded-full"
              />
            </div>
          </div>
          
          <div className="flex justify-between text-sm">
            <div>
              <div className="font-medium">{lowRiskCount}</div>
              <div className="text-muted-foreground">Low Risks</div>
            </div>
            <div className="text-right">
              <div className="font-medium">{noRiskCount}</div>
              <div className="text-muted-foreground">No Risks</div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default RiskSummary;
