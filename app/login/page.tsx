'use client'
import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Upload, Send, FileText, Shield, AlertTriangle, PenBox, ArrowRight, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"
import { usePuterStore } from "@/lib/puter"

interface Props {
    
}

const page = (props: Props) => {
    const {isLoading, auth} = usePuterStore();
    const router = useRouter();
    const next = new URLSearchParams(window.location.search).get("next")

    useEffect(()=>{
        if(auth.isAuthenticated){
            router.push(next || "")
        }
    }, [auth.isAuthenticated])

    return (
        <div className="min-h-screen bg-[url('/bg-auth.svg')] bg-cover bg-center ">
        {/* Header */}
        <div className="border-b border-purple-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
            <div className="max-w-4xl mx-auto px-3 py-3 flex items-center">
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
            </div>
        </div>

        <div className="w-full h-[80vh] flex items-center justify-center  ">
            <div className="max-w-4xl mx-auto px-3 py-10 flex items-center justify-center"> 
                <Card className="p-8 bg-white/80 backdrop-blur-lg  shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Welcome Back!</h2>
                <p className="text-gray-600 mb-6">Please log in to your account to continue.</p>
                {auth.isAuthenticated ? (
                    <Button
                        variant="outline"
                        size="sm"
                        className={`w-full scale-1 bg-purple-500 text-white hover:bg-purple-600
                            hover:text-white hover:scale-[1.05]`
                        }
                        onClick={auth.signOut}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Log Out
                    </Button>
                )
                :
                <Button
                    variant="outline"
                    size="sm"
                    className={`w-full scale-1 bg-purple-500 text-white hover:bg-purple-600
                         hover:text-white hover:scale-[1.05] 
                         ${isLoading ? "cursor-not-allowed animate-pulse hover:scale-[1]" : ""}`
                    }
                    onClick={() =>{
                        auth.signIn()
                        console.log("Logging in...")
                    } }
                >
                    {isLoading ? "Logging in..." : "Login with Puter"}
                    {isLoading ? (
                    <svg
                        className="animate-spin h-4 w-4 text-white ml-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        ></circle>
                        <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                    </svg>
                    ) : ( 
                        <ArrowRight className="w-4 h-4 mr-2" />
                    )
                    }
                </Button>
                }
                </Card>
            </div>
        </div>
        </div>
    )
}

export default page
