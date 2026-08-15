"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import NeonText from "@/components/NeonText";

export default function NotFound() {
  return (
    <section className="min-h-full flex flex-col items-center justify-center text-center p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <NeonText className="text-6xl md:text-8xl">404</NeonText>
        <p className="text-gray-600 dark:text-gray-400 mt-4 text-base md:text-lg max-w-md mx-auto">
          This page drifted off the grid. The route you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="inline-block mt-8 px-6 py-3 font-semibold rounded-md bg-accent text-dark hover:bg-accent/80 transition-all duration-300"
        >
          Back to Home
        </Link>
      </motion.div>
    </section>
  );
}
