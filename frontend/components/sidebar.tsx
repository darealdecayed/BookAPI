"use client";
import { Sparkles, Home, Menu, X, Shield, FileText, MessageSquare } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface SidebarProps {
  onOpenAIClick?: () => void;
}

export default function Sidebar({ onOpenAIClick }: SidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-5 left-4 z-50 w-12 h-12 bg-[#1c1e2b] rounded-xl flex items-center justify-center border border-zinc-700/50 shadow-lg hover:bg-[#252736] transition-colors"
      >
        {isMobileMenuOpen ? (
          <X size={22} className="text-white" />
        ) : (
          <Menu size={22} className="text-white" />
        )}
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          x: isMobileMenuOpen ? 0 : -320,
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed top-0 left-0 bottom-0 md:top-6 md:left-6 w-[280px] md:h-[calc(100vh-48px)] bg-[#1c1e2b] md:rounded-lg flex flex-col overflow-hidden shadow-2xl border-r md:border border-zinc-800/50 z-50 md:!transform-none"
      >
  <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {/* Home */}
          <div 
            onClick={() => {
              window.location.reload();
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center gap-3 px-4 py-3 bg-zinc-700/30 hover:bg-zinc-700/50 rounded-xl cursor-pointer transition-all min-h-[52px] w-full"
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <Home size={20} className="text-zinc-300" />
            </div>
            <span className="text-white font-medium text-base">Home!</span>
          </div>
          {/* AI */}
          <div 
            onClick={() => {
              onOpenAIClick?.();
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center gap-3 px-4 py-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-xl cursor-pointer transition-all min-h-[52px] w-full"
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <Sparkles size={20} className="text-purple-400" />
            </div>
            <span className="text-white font-medium text-base">AI</span>
          </div>

          {/* Divider removed: legal/contact moved to bottom icon row */}
        </div>
        {/* Bottom icon row */}
        <div className="border-t border-zinc-800/50 p-3 bg-[#1c1e2b] flex items-center justify-around">
          <button
            aria-label="Privacy Policy"
            title="Privacy Policy"
            onClick={() => {
              router.push("/privacy");
              setIsMobileMenuOpen(false);
            }}
            className="w-11 h-11 rounded-lg flex items-center justify-center hover:bg-zinc-700/30 transition-colors"
          >
            <Shield size={20} className="text-zinc-300" />
          </button>
          <button
            aria-label="Terms of Service"
            title="Terms of Service"
            onClick={() => {
              router.push("/terms");
              setIsMobileMenuOpen(false);
            }}
            className="w-11 h-11 rounded-lg flex items-center justify-center hover:bg-zinc-700/30 transition-colors"
          >
            <FileText size={20} className="text-zinc-300" />
          </button>
          <button
            aria-label="Contact Us"
            title="Contact Us"
            onClick={() => {
              router.push("/contact");
              setIsMobileMenuOpen(false);
            }}
            className="w-11 h-11 rounded-lg flex items-center justify-center hover:bg-zinc-700/30 transition-colors"
          >
            <MessageSquare size={20} className="text-zinc-300" />
          </button>
        </div>
      </motion.div>
    </>
  );
}
