export const mockResults = {
  summary: {
    plainEnglish:
      "This is a Non-Disclosure Agreement (NDA) between CampBuzz and a UI/UX Designer. The designer will receive confidential business information about CampBuzz to evaluate and provide design services. In return, the designer must keep all information secret, not use it for other purposes, and only share it with authorized team members who also agree to confidentiality. The agreement lasts 1 year but confidentiality obligations continue for 3 years after termination. Any disputes go to binding arbitration in Nigeria under UNCITRAL rules.",
    documentType: "NDA",
  },
  riskAssessment: {
    overallDangerScore: 25,
    riskLevel: "Low",
    scamProbability: 15,
    reasoning:
      "This is a fairly standard NDA with reasonable terms. The confidentiality obligations are appropriate for the business purpose. However, there are some concerning elements like broad definition of confidential information, mandatory arbitration, and the recipient bears some enforcement costs. The 3-year post-termination confidentiality period is longer than typical but not unreasonable.",
  },
  keyClauses: [
    {
      title: "Broad Confidential Information Definition",
      explanation:
        "Covers all information shared regardless of format, including discussions about potential business relationships and any analyses you create",
      riskImpact: "Moderate",
    },
    {
      title: "Non-Use and Non-Disclosure Obligations",
      explanation:
        "You cannot use the information for any purpose other than the specific UI/UX design project or share it with unauthorized people",
      riskImpact: "Low",
    },
    {
      title: "3-Year Post-Termination Confidentiality",
      explanation:
        "Even after the 1-year agreement ends, you must keep information confidential for an additional 3 years",
      riskImpact: "Moderate",
    },
    {
      title: "Mandatory Arbitration in Nigeria",
      explanation:
        "All disputes must be resolved through binding arbitration in Nigeria under UNCITRAL rules with no right of appeal",
      riskImpact: "Moderate",
    },
    {
      title: "Injunctive Relief Rights",
      explanation:
        "CampBuzz can seek court orders to stop you from breaching the agreement without posting bond, in addition to monetary damages",
      riskImpact: "Moderate",
    },
    {
      title: "Shared Arbitration Costs",
      explanation:
        "If disputes arise, you'll split arbitration costs evenly with CampBuzz but pay your own legal fees",
      riskImpact: "Low",
    },
    {
      title: "Standard of Care Requirements",
      explanation:
        "You must protect their information with at least the same care you use for your own confidential information",
      riskImpact: "Low",
    },
  ],
  redFlags: [
    {
      issue: "Oral Information Documentation Requirement",
      whyItMatters:
        "Section 5.3 requires CampBuzz to document oral disclosures in writing within 14 days, but if they forget, you could still be bound by confidentiality for undocumented conversations",
      severity: "Moderate",
    },
    {
      issue: "Geographic Arbitration Limitation",
      whyItMatters:
        "Arbitration must occur in Nigeria, which could be expensive and inconvenient if you're located elsewhere, giving CampBuzz a strategic advantage in disputes",
      severity: "Moderate",
    },
  ],
  userImpact: {
    financialRisk: 30,
    privacyRisk: 20,
    legalExposure: 35,
    controlLossRisk: 40,
    explanation:
      "Financial risk is moderate due to potential arbitration costs and injunctive relief. Privacy risk is low as this protects their information, not yours. Legal exposure is moderate due to broad confidentiality definitions and long-term obligations. Control loss is moderate due to mandatory arbitration and limited appeal rights.",
  },
  negotiationTips: [
    {
      clause: "3-Year Post-Termination Period",
      suggestion:
        "Request reduction to 1-2 years, which is more standard for design work confidentiality",
    },
    {
      clause: "Arbitration Location",
      suggestion:
        "Propose neutral arbitration location or allow virtual proceedings to reduce travel costs",
    },
    {
      clause: "Oral Information Documentation",
      suggestion:
        "Add clause that oral information is only confidential if documented in writing within the 14-day period",
    },
    {
      clause: "Confidential Information Scope",
      suggestion:
        "Exclude publicly available information and information you independently develop",
    },
  ],
  finalVerdict: {
    recommendation: "Sign With Caution",
    explanation:
      "This is a relatively standard NDA with reasonable protections for both parties. The main concerns are the 3-year confidentiality period and mandatory arbitration in Nigeria. If you're comfortable with these terms and the business relationship seems legitimate, it's generally safe to sign. Consider negotiating the arbitration location and confidentiality period if possible.",
  },
};