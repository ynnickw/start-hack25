
import React from "react";
import { motion } from "framer-motion";
import { Leaf } from "lucide-react";

const DashboardHeader = ({ farmName, cropType }) => {
  return (
    <div className="flex flex-col w-full">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="flex items-center mb-1"
      >
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
        className="text-xl font-semibold tracking-tight mb-1"
      >
        {farmName}
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-muted-foreground"
      >
        Monitoring {cropType} throughout the growing season
      </motion.p>
    </div>
  );
};

export default DashboardHeader;
