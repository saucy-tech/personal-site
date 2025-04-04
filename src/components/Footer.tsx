"use client";

import { motion } from "framer-motion";

interface FooterProps {
  name: string;
}

const Footer: React.FC<FooterProps> = ({ name }) => {
  return (
    <motion.footer
      className="text-center py-6 text-[#D4AF37]/70 text-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}>
      © {new Date().getFullYear()} {name}
    </motion.footer>
  );
};

export default Footer;
