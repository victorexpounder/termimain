"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Upload, Send, FileText, Shield, AlertTriangle, PenBox } from "lucide-react"
import { useRouter } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"
import { usePuterStore } from "@/lib/puter"
import { formatFileSize } from "@/lib/formatFileSize"
import { generateUUID } from "@/lib/utils"
import { prepareInstructions } from "@/constants" 
import Header from "@/components/Header"
import ReactMarkdown from "react-markdown";
import { AnalysisResults } from "@/components/Analysis"
import { mockResults } from "@/lib/mockResults"
import { motion } from "framer-motion"
import { TypewriterMessage } from "@/components/TypewriterMessage"

// Define a type for messages to match the structure expected by the UI
interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export default function TermiChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [analyzing, setAnalyzing] = useState<boolean>(false)
  const [status, setStatus] = useState<string>("")
  const [results, setResults] = useState<any>()
  const {auth, fs, kv, ai} = usePuterStore();
  const router = useRouter();
  const next = new URLSearchParams(window.location.search).get("next")
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent, customMessage?: string) => {
    e.preventDefault()
    const userMessageContent = customMessage || input.trim()
    if (!userMessageContent) return

    const newUserMessage: Message = {
      id: Date.now().toString() + "-user",
      role: "user",
      content: userMessageContent,
    }

    setMessages((prevMessages) => [...prevMessages, newUserMessage])
    setInput("")

    try {
      setIsLoading(true);

      const response = await ai.chat(
        [
          {
            role: "system",
            content: `Act as a legal advisor. 
            Spot red flags in contracts, NDAs, and terms & conditions.
            Explain complex legal terms in simple language.
            Help users understand risks, obligations, and protections.`,
          },
          {
            role: "user",
            content: userMessageContent,
          },
        ],
        {
          model: "gpt-4.1-mini", 
          temperature: 0.2,
          max_tokens: 500,
        }
      );

      
      const generatedText =
        (response as any)?.choices?.[0]?.message?.content ||
        JSON.stringify(response?.message.content);

      const newAssistantMessage: Message = {
        id: Date.now().toString() + "-assistant",
        role: "assistant",
        content: generatedText,
      };

      setMessages((prev) => [...prev, newAssistantMessage]);
    } catch (error) {
      console.error("AI error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileUpload = async(file: File) => {
    setFile(file)
    setAnalyzing(true)
    setStatus("Uploading the file...")

    const uploadedFile = await fs.upload([file])
    if(!uploadedFile) return setStatus("Failed to upload file. Please try again.")

    // setStatus("Converting to image...")
    // // const imageFile = await convertPdfToImage(file)
    // if(!imageFile) return setStatus("Failed to convert PDF to image. Please try again.")

    // setStatus("Uploading the image...")
    // const uploadedImage = await fs.upload([imageFile])
    // if(!uploadedImage) return setStatus("Failed to upload image file. Please try again.")

    setStatus("Preparing Data...")
    const uuid = generateUUID()
    const data ={
      id:  uuid,
      filepath: uploadedFile.path,
      filename: file.name,
      filesize: file.size,
      filetype: file.type,
      feedback: ''
    }
    const kvResult = await kv.set(`file-${uuid}`, JSON.stringify(data))
    if(!kvResult) return setStatus("Failed to save file data. Please try again.")

    setStatus("Analyzing the document...")
    const feedback = await ai.feedback( 
      uploadedFile.path,
      prepareInstructions()
    )
    if(!feedback) return setStatus("Failed to analyze the document. Please try again.")

    const rawText =
      typeof feedback.message.content === "string"
        ? feedback.message.content
        : feedback.message.content[0].text;

    // CLEAN and PARSE
    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (e) {
      console.error("Failed to parse AI JSON:", rawText);
      return setStatus("AI returned invalid format. Please try again.");
    }

    setStatus("Saving feedback...")
    data.feedback = parsed
    const feedbackResult = await kv.set(`file-${uuid}`, JSON.stringify(data))
    if(!feedbackResult) return setStatus("Failed to save feedback. Please try again.")

    setStatus("Analysis complete! Redirecting to results page...")

    console.log(parsed)
    setResults(parsed)

    
  }

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0])
    }
  }

  useEffect(()=>{
      if(typeof window === "undefined") return;
  }, [])

  useEffect(()=>{
      if(!auth.isAuthenticated){
        router.push(`/login?next=/${next || ""}`)
      }
  }, [auth.isAuthenticated])

  if(results){
    return (
      <div className="min-h-screen bg-[url('/bghome.png')] bg-cover bg-center">
       
        {/* Header */}
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-6">
          <AnalysisResults data={results} />
        </div>
      </div>
    ) 

  }else{
    return (
      <div className="min-h-screen bg-[url('/bghome.png')] bg-cover bg-center">
       
        {/* Header */}
        <Header />
  
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Welcome Section */}
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.3 }}
              className="text-center mb-8"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-4"
              >
                <FileText className="w-8 h-8 text-white" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-3xl font-bold text-gray-900 mb-2"
              >
                Never miss the fine print again
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto"
              >
                Upload your terms & conditions, privacy policies, or contracts. I'll break down the complex legal language
                and highlight what matters most.
              </motion.p>
  
              {/* Upload Area */}
              {file ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  viewport={{ once: true }}
                >
                  <Card className="p-6 gap-2 flex-col bg-white/80 backdrop-blur-lg shadow-lg">
                    <h3 className="text-lg font-medium text-purple-700 mb-2">{status}</h3>
                    <img
                      src={'/resume-scan-2.gif'}
                      alt="Uploaded document preview"
                      className="w-full h-64 object-contain"
                    />
                    <p className="text-sm text-green-600">{file.name}</p>
                    <p className="text-sm text-green-600">File size: {formatFileSize(file.size)}</p>
                  </Card>
                </motion.div>
                )
               :
               (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card
                    className={`p-8 border-2 border-dashed transition-all cursor-pointer bg-white hover:border-purple-400 ${
                      dragActive ? "border-purple-500 bg-purple-50 animate-pulse" : "border-gray-300"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Upload className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                    </motion.div>
                    <p className="text-lg font-medium text-gray-900 mb-2">Drop your document here or click to upload</p>
                    <p className="text-gray-600">Supports PDF, TXT, and DOC files</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept=".pdf,.txt,.doc,.docx"
                      onChange={onFileSelect}
                      // set file size limit of 5MB now
                      max={5 * 1024 * 1024}
                    />
                  </Card>
                </motion.div>
  
               )
              }
  
              {/* Feature Cards */}
              <div className="grid md:grid-cols-3 gap-4 mt-8">
                {[
                  { icon: AlertTriangle, title: "Spot Red Flags", desc: "Identify concerning clauses and potential risks", delay: 0.2 },
                  { icon: FileText, title: "Plain English", desc: "Complex legal terms explained simply", delay: 0.3 },
                  { icon: Shield, title: "Know Your Rights", desc: "Understand your obligations and protections", delay: 0.4 },
                ].map((card, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: card.delay }}
                    viewport={{ once: true, amount: 0.3 }}
                  >
                    <Card className="p-4 text-left bg-white hover:shadow-lg transition-shadow">
                      <card.icon className="w-6 h-6 text-purple-600 mb-2" />
                      <h3 className="font-semibold text-gray-900 mb-1">{card.title}</h3>
                      <p className="text-sm text-gray-600">{card.desc}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
  
          {/* Chat Messages */}
          {messages.length > 0 && (
            <ScrollArea className="h-[60vh] mb-6">
              <div className="space-y-4 pr-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    {message.role === "user" ? (
                      <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="max-w-[80%] rounded-2xl px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white"
                      >
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
                          {message.content.replace(/\\n/g, "\n\n")}
                        </ReactMarkdown>
                      </motion.div>
                    ) : (
                      <TypewriterMessage content={message.content} speed={15} />
                    )}
                  </div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center">
                          <Shield className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm font-medium text-purple-700">termi</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <motion.div
                          className="w-2 h-2 bg-purple-600 rounded-full"
                          animate={{ y: [0, -6, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-purple-600 rounded-full"
                          animate={{ y: [0, -6, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-purple-600 rounded-full"
                          animate={{ y: [0, -6, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>
          )}
  
          {/* Input Form */}
          <form onSubmit={handleSubmit} className="flex gap-2 bg-white rounded-2xl border-purple-200 items-center px-4 py-2">
            <Textarea
              value={input}
              onChange={handleInputChange}
              placeholder="Ask me about terms & conditions, privacy policies, or upload a document..."
              className="flex-1 bg-white border-0 outline-none ring-0 focus:outline-none focus:ring-0 min-h-[50px] max-h-[200px] resize-y p-3" // Adjusted styling for textarea
              disabled={isLoading}
              rows={1} // Start with 1 row, will expand
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="rounded-full bg-gradient-to-r text-white from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 px-6"
            >
              <Send className="w-6 h-6" />
            </Button>
          </form>
  
          {/* Quick Actions */}
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
              className="mt-6 flex flex-wrap gap-2 justify-center"
            >
              {[
                { text: "Common red flags in ToS", prompt: "What are the most common red flags I should look for in terms of service?", delay: 0.6 },
                { text: "Data collection explained", prompt: "Explain data collection practices in privacy policies", delay: 0.7 },
                { text: "Cancellation policies", prompt: "What should I know about cancellation policies?", delay: 0.8 },
              ].map((action, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: action.delay }}
                  viewport={{ once: true }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-purple-200 text-purple-700 hover:bg-purple-50 bg-transparent transition-all hover:shadow-md"
                    onClick={(e) => handleSubmit(e, action.prompt)}
                  >
                    {action.text}
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    )
  }

}
