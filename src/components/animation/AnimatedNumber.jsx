import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

const AnimatedNumber = ({ start = 0, end, duration, className = "" }) => {
  const controls = useAnimation();
  const [currentNumber, setCurrentNumber] = useState(start);

  // Start the animation
  const startAnimation = () => {
    controls.start({
      count: end,
      transition: { duration, ease: "easeInOut" },
    });
  };
  useEffect(() => {
    startAnimation();
  }, [end])
  const formatCurrency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  });

  return (
    <div className={`animated-number-container ${className}`}>
      <motion.span
        className="animated-number"
        animate={controls}
        initial={{ count: start }}
        onUpdate={(latest) => setCurrentNumber(Math.round(latest.count))}
      >
        {formatCurrency.format(currentNumber)}
      </motion.span>
    </div>
  );
};

export default AnimatedNumber;
