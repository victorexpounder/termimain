"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Upload, Send, FileText, Shield, AlertTriangle, PenBox } from "lucide-react"
import { useRouter } from "next/navigation"

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
  const router = useRouter()
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        providers: "openai/gpt-4",
        text: userMessageContent,
        chatbot_global_action: `Act as a legal Advisor Spot Red Flags
          Identify concerning clauses and potential risks, explain Complex legal terms help people
          Understand their obligations and protections in terms and conditions and fineprints`,
        previous_history: [],
        temperature: 0.0,
        max_tokens: 150,
      }),
    };

    try {
      setIsLoading(true)
      const response = await fetch("https://api.edenai.run/v2/text/chat", options);
      const data = await response.json();
      const generatedText = data['openai/gpt-4'].generated_text;
      const newAssistantMessage: Message = {
        id: Date.now().toString() + "-assistant",
        role: "assistant",
        content: generatedText,
      }

      setMessages((prevMessages) => [...prevMessages, newAssistantMessage])
      setIsLoading(false)
    } catch (error) {
      console.error(error);
      setIsLoading(false)
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

  const handleFileUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      const message = `Please analyze this document:\n\n${content.substring(0, 500)}... (truncated for simulation)` // Truncate for simulation
      handleSubmit(new Event("submit") as any, message) // Pass the message directly
    }
    reader.readAsText(file)
  }

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0])
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      {/* Header */}
      <div className="border-b border-purple-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                termi
              </h1>
              <p className="text-sm text-gray-600">AI-powered fine print & terms analysis</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto"
            onClick={() => {
               window.location.reload()
            }}
          >
            <PenBox className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Welcome Section */}
        {messages.length === 0 && (
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Never miss the fine print again</h2>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Upload your terms & conditions, privacy policies, or contracts. I'll break down the complex legal language
              and highlight what matters most.
            </p>

            {/* Upload Area */}
            <Card
              className={`p-8 border-2 border-dashed transition-all cursor-pointer bg-white hover:border-purple-400 ${
                dragActive ? "border-purple-500 bg-purple-50" : "border-gray-300"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">Drop your document here or click to upload</p>
              <p className="text-gray-600">Supports PDF, TXT, and DOC files</p>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.txt,.doc,.docx"
                onChange={onFileSelect}
              />
            </Card>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-4 mt-8">
              <Card className="p-4 text-left bg-white">
                <AlertTriangle className="w-6 h-6 text-purple-600 mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Spot Red Flags</h3>
                <p className="text-sm text-gray-600">Identify concerning clauses and potential risks</p>
              </Card>
              <Card className="p-4 text-left bg-white">
                <FileText className="w-6 h-6 text-purple-600 mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Plain English</h3>
                <p className="text-sm text-gray-600">Complex legal terms explained simply</p>
              </Card>
              <Card className="p-4 text-left bg-white">
                <Shield className="w-6 h-6 text-purple-600 mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Know Your Rights</h3>
                <p className="text-sm text-gray-600">Understand your obligations and protections</p>
              </Card>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        {messages.length > 0 && (
          <ScrollArea className="h-[60vh] mb-6">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white"
                        : "bg-white border border-gray-200 text-gray-900"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center">
                          <Shield className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm font-medium text-purple-700">termi</span>
                      </div>
                    )}
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center">
                        <Shield className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm font-medium text-purple-700">termi</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask me about terms & conditions, privacy policies, or upload a document..."
            className="flex-1 bg-white rounded-full shadow-sm border-purple-200 focus:ring-2 focus:border-transparent"
            disabled={isLoading}
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
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-purple-200 text-purple-700 hover:bg-purple-50 bg-transparent"
              onClick={(e) =>
                handleSubmit(e, "What are the most common red flags I should look for in terms of service?")
              }
            >
              Common red flags in ToS
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-purple-200 text-purple-700 hover:bg-purple-50 bg-transparent"
              onClick={(e) => handleSubmit(e, "Explain data collection practices in privacy policies")}
            >
              Data collection explained
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-purple-200 text-purple-700 hover:bg-purple-50 bg-transparent"
              onClick={(e) => handleSubmit(e, "What should I know about cancellation policies?")}
            >
              Cancellation policies
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
