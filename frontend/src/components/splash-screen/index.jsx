import React from 'react'
import { AnimatePresence, motion } from "framer-motion";
import spinner from "@/assets/loading.gif";

export default function SplashScreen({ loading }) {
    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    exit={{ y: 2000 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="fixed inset-0 min-h-screen w-screen 
                             bg-white/50 backdrop-blur-md
                             flex flex-col justify-center items-center
                             z-[9999]"
                >
                    <img src={spinner} className="w-52" placeholder="loading" />
                </motion.div>
            )}
        </AnimatePresence>
    )
}