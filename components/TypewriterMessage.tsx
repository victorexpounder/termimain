"use client"

import { Shield } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { motion } from "framer-motion"
import { useTypewriter } from "@/lib/useTypewriter"

interface TypewriterMessageProps {
  content: string
  speed?: number
}

export function TypewriterMessage({ content, speed = 4 }: TypewriterMessageProps) {
  const { displayedText } = useTypewriter(content, speed)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-gray-200 rounded-2xl px-4 py-3"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center">
          <Shield className="w-3 h-3 text-white" />
        </div>
        <span className="text-sm font-medium text-purple-700">termi</span>
      </div>
      <ReactMarkdown
        components={{
          li: ({ children }) => (
            <li className="mb-4 leading-relaxed">{children}</li>
          ),
          p: ({ children }) => (
            <p className="mb-3">{children}</p>
          ),
        }}
      >
        {displayedText.replace(/\\n/g, "\n\n")}
      </ReactMarkdown>
    </motion.div>
  )
}
