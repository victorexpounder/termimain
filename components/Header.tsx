
import React from 'react'
import { Button } from './ui/button'
import { Upload, Send, FileText, Shield, AlertTriangle, PenBox } from "lucide-react"
import Link from 'next/link'


interface Props {
    
}

const Header = (props: Props) => {
    return (
        <div className="border-b border-purple-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
            <div className="max-w-4xl mx-auto px-4 py-4 flex items-center">
                <Link href="/" className="flex items-center gap-3 cursor-pointer">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                            termi
                            </h1>
                        </div>
                    </div>
                </Link>
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
    )
}

export default Header
