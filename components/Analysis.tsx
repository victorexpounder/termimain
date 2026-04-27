"use client"

import { AlertTriangle, CheckCircle, AlertCircle, TrendingUp, Shield, FileText, Zap } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { motion, useInView } from "framer-motion"
import { useEffect, useRef, useState } from "react"

interface FinePrintAnalysis {
  summary: {
    plainEnglish: string
    documentType: "Terms & Conditions" | "NDA" | "Privacy Policy" | "Contract" | "Other"
  }
  riskAssessment: {
    overallDangerScore: number
    riskLevel: "Low" | "Moderate" | "High" | "Severe"
    scamProbability: number
    reasoning: string
  }
  keyClauses: {
    title: string
    explanation: string
    riskImpact: "Low" | "Moderate" | "High"
  }[]
  redFlags: {
    issue: string
    whyItMatters: string
    severity: "Moderate" | "High" | "Critical"
  }[]
  userImpact: {
    financialRisk: number
    privacyRisk: number
    legalExposure: number
    controlLossRisk: number
    explanation: string
  }
  negotiationTips: {
    clause: string
    suggestion: string
  }[]
  finalVerdict: {
    recommendation: "Safe to Sign" | "Sign With Caution" | "High Risk – Review Carefully" | "Do Not Sign"
    explanation: string
  }
}

const getRiskColor = (level: string) => {
  switch (level) {
    case "Low":
      return "bg-emerald-50 border-emerald-200 text-emerald-900"
    case "Moderate":
      return "bg-amber-50 border-amber-200 text-amber-900"
    case "High":
      return "bg-orange-50 border-orange-200 text-orange-900"
    case "Severe":
    case "Critical":
      return "bg-red-50 border-red-200 text-red-900"
    default:
      return "bg-gray-50 border-gray-200 text-gray-900"
  }
}

const getRiskBadgeColor = (level: string) => {
  switch (level) {
    case "Low":
      return "bg-emerald-100 text-emerald-800 border-emerald-300"
    case "Moderate":
      return "bg-amber-100 text-amber-800 border-amber-300"
    case "High":
      return "bg-orange-100 text-orange-800 border-orange-300"
    case "Severe":
    case "Critical":
      return "bg-red-100 text-red-800 border-red-300"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getVerdictIcon = (recommendation: string) => {
  switch (recommendation) {
    case "Safe to Sign":
      return <CheckCircle className="w-8 h-8 text-emerald-600" />
    case "Sign With Caution":
      return <AlertCircle className="w-8 h-8 text-amber-600" />
    case "High Risk – Review Carefully":
      return <AlertTriangle className="w-8 h-8 text-orange-600" />
    case "Do Not Sign":
      return <AlertTriangle className="w-8 h-8 text-red-600" />
    default:
      return null
  }
}

const getVerdictColor = (recommendation: string) => {
  switch (recommendation) {
    case "Safe to Sign":
      return "bg-emerald-50 border-emerald-200"
    case "Sign With Caution":
      return "bg-amber-50 border-amber-200"
    case "High Risk – Review Carefully":
      return "bg-orange-50 border-orange-200"
    case "Do Not Sign":
      return "bg-red-50 border-red-200"
    default:
      return "bg-gray-50 border-gray-200"
  }
}

export const Typewriter = ({ text, className }: { text: string; className?: string }) => {
  const [displayText, setDisplayText] = useState('')
  const ref = useRef<HTMLParagraphElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      let i = 0
      const timer = setInterval(() => {
        if (i < text.length) {
          setDisplayText(text.slice(0, i + 1))
          i++
        } else {
          clearInterval(timer)
        }
      }, 10)
      return () => clearInterval(timer)
    }
  }, [isInView, text])

  return (
    <p ref={ref} className={className || "text-gray-700 leading-relaxed"}>
      {displayText}
    </p>
  )
}

export function AnalysisResults({ data }: { data: FinePrintAnalysis }) {
  return (
    <div className="w-full space-y-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="space-y-2"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
            <p className="text-sm text-gray-600">{data.summary.documentType}</p>
          </div>
        </div>
      </motion.div>

      {/* Final Verdict - Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <Card className={`border-2 p-8 ${getVerdictColor(data.finalVerdict.recommendation)}`}>
          <div className="flex flex-col items-start gap-6">
            <div className="flex-shrink-0 flex gap-4 ">
              {getVerdictIcon(data.finalVerdict.recommendation)}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{data.finalVerdict.recommendation}</h3>
            </div>
            <div className="flex-1">
              <Typewriter text={data.finalVerdict.explanation} className="text-gray-700 leading-relaxed text-left" />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <Card className="border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            Plain English Summary
          </h3>
          <Typewriter text={data.summary.plainEnglish} className="text-gray-700 leading-relaxed" />
        </Card>
      </motion.div>

      {/* Risk Assessment */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        viewport={{ once: true }}
        className="grid md:grid-cols-2 gap-6"
      >
        {/* Overall Risk Score */}
        <Card className="border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Overall Risk Score
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Danger Score</span>
                <span className={`text-2xl font-bold ${data.riskAssessment.overallDangerScore > 70 ? "text-red-600" : data.riskAssessment.overallDangerScore > 40 ? "text-amber-600" : "text-emerald-600"}`}>
                  {data.riskAssessment.overallDangerScore}
                </span>
              </div>
              <Progress value={data.riskAssessment.overallDangerScore} className="h-2" />
            </div>
            <div className="pt-2">
              <Badge className={`${getRiskBadgeColor(data.riskAssessment.riskLevel)} border`}>
                {data.riskAssessment.riskLevel}
              </Badge>
            </div>
            <Typewriter text={data.riskAssessment.reasoning} className="text-sm text-gray-600 pt-2" />
          </div>
        </Card>

        {/* Scam Probability */}
        <Card className="border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-600" />
            Scam Probability
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Likelihood</span>
                <span className={`text-2xl font-bold ${data.riskAssessment.scamProbability > 50 ? "text-red-600" : "text-emerald-600"}`}>
                  {data.riskAssessment.scamProbability}%
                </span>
              </div>
              <Progress value={data.riskAssessment.scamProbability} className="h-2" />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* User Impact Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        viewport={{ once: true }}
      >
        <Card className="border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-600" />
            Your Risk Exposure
          </h3>
          <div className="space-y-6">
            {[
              { label: "Financial Risk", value: data.userImpact.financialRisk },
              { label: "Privacy Risk", value: data.userImpact.privacyRisk },
              { label: "Legal Exposure", value: data.userImpact.legalExposure },
              { label: "Control Loss Risk", value: data.userImpact.controlLossRisk },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  <span className="text-sm font-bold text-gray-900">{item.value}%</span>
                </div>
                <Progress value={item.value} className="h-3" />
              </div>
            ))}
            <Typewriter text={data.userImpact.explanation} className="text-sm text-gray-600 pt-4 border-t border-gray-200 mt-4" />
          </div>
        </Card>
      </motion.div>

      {/* Red Flags */}
      {data.redFlags.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Red Flags
            </h3>
            <div className="space-y-3">
              {data.redFlags.map((flag, idx) => (
                <div key={idx} className={`border-l-4 p-4 rounded ${getRiskColor(flag.severity)}`}>
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">{flag.issue}</h4>
                    <Badge className={`${getRiskBadgeColor(flag.severity)} border text-xs`}>
                      {flag.severity}
                    </Badge>
                  </div>
                  <Typewriter text={flag.whyItMatters} className="text-sm leading-relaxed" />
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Key Clauses */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.7 }}
        viewport={{ once: true }}
      >
        <Card className="border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Key Clauses</h3>
          <div className="space-y-4">
            {data.keyClauses.map((clause, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{clause.title}</h4>
                  <Badge className={`${getRiskBadgeColor(clause.riskImpact)} border text-xs`}>
                    {clause.riskImpact} Risk
                  </Badge>
                </div>
                <Typewriter text={clause.explanation} className="text-sm text-gray-600 leading-relaxed" />
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Negotiation Tips */}
      {data.negotiationTips.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <Card className="border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Negotiation Tips</h3>
            <div className="space-y-4">
              {data.negotiationTips.map((tip, idx) => (
                <div key={idx} className="border-l-4 border-purple-300 bg-purple-50 p-4 rounded">
                  <h4 className="font-semibold text-gray-900 mb-2">{tip.clause}</h4>
                  <Typewriter text={tip.suggestion} className="text-sm text-gray-700" />
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
