"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { analyzeJobReadiness, type AnalysisResult, type SkillArea } from "@/lib/job-readiness"
import { cn } from "@/lib/utils"

const GAP_TO_SCALER: Record<string, { why: string; scaler: string }> = {
  DSA: {
    why: "DSA is the first filter in most technical interviews. Weak problem-solving here leads to early rejection.",
    scaler:
      "Scaler's structured DSA curriculum and practice with mentors helps you build pattern recognition and coding speed.",
  },
  "System Design": {
    why: "System Design rounds separate senior and staff-level candidates. Interviewers look for trade-off thinking and scalability sense.",
    scaler: "Live system design classes and real-world case studies at Scaler build the judgment interviewers expect.",
  },
  "Core Programming": {
    why: "Language depth, concurrency, and clean code come up in both coding and design discussions.",
    scaler: "Scaler's core programming track covers language fundamentals, concurrency, and best practices used in production.",
  },
  "Role Stack": {
    why: "Role-specific tech (APIs, databases, frameworks) is checked in projects and sometimes in live coding.",
    scaler: "Relevant Scaler programs include hands-on projects and stack-specific modules aligned with industry roles.",
  },
  "Projects / Experience": {
    why: "Interviewers probe real projects for depth. Thin or vague experience is a common red flag.",
    scaler: "Guided projects and portfolio-building at Scaler give you concrete stories to discuss in interviews.",
  },
}

export default function AnalyzerPage() {
  const [activeTab, setActiveTab] = useState<"resume" | "jd">("resume")
  const [activeSubTab, setActiveSubTab] = useState<"paste" | "upload">("paste")
  const [resumeText, setResumeText] = useState("")
  const [jdText, setJdText] = useState("")
  const [role, setRole] = useState("Backend Engineer")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "loading" | "error">("idle")
  const [uploadMessage, setUploadMessage] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const MIN_LENGTH = 80

  const getInputText = () => {
    return activeTab === "resume" ? resumeText.trim() : jdText.trim()
  }

  const handleAnalyze = () => {
    const text = getInputText()
    setError(null)
    setResult(null)

    if (!text) {
      setError("Paste your resume or job description and choose a target role, then click Check My Job Readiness.")
      return
    }

    if (text.length < MIN_LENGTH) {
      setError(
        `Please provide at least ${MIN_LENGTH} characters (a few lines of resume or job description) so we can analyze meaningfully.`
      )
      return
    }

    setIsAnalyzing(true)

    // Simulate async analysis
    setTimeout(() => {
      try {
        const analysisResult = analyzeJobReadiness(text, role)
        setResult(analysisResult)
      } catch {
        setError("Something went wrong. Please try again.")
      } finally {
        setIsAnalyzing(false)
      }
    }, 500)
  }

  const handleClear = () => {
    setResumeText("")
    setJdText("")
    setResult(null)
    setError(null)
    setActiveTab("resume")
    setActiveSubTab("paste")
  }

  const handleFileUpload = async (file: File) => {
    if (file.type !== "application/pdf") {
      setUploadStatus("error")
      setUploadMessage("PDF only. Drop a PDF file or paste text instead.")
      return
    }

    setUploadStatus("loading")
    setUploadMessage("Reading PDF...")

    try {
      // Dynamic import pdf.js
      const pdfjsLib = await import("pdfjs-dist")
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      const numPages = Math.min(pdf.numPages, 3)
      const texts: string[] = []

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        const pageText = content.items.map((item: { str?: string }) => item.str || "").join(" ")
        texts.push(pageText)
      }

      const fullText = texts.join("\n\n").trim()

      if (fullText.length < 30) {
        setUploadStatus("error")
        setUploadMessage("Couldn't read text from PDF. Try pasting instead.")
      } else {
        setUploadStatus("idle")
        setUploadMessage("")
        setActiveSubTab("paste")
        setResumeText(fullText)
        // Auto-analyze after successful upload
        setTimeout(() => handleAnalyze(), 100)
      }
    } catch {
      setUploadStatus("error")
      setUploadMessage("Couldn't read that PDF. Try pasting instead.")
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFileUpload(file)
  }

  const getScoreClass = (score: number) => {
    if (score >= 70) return "bg-green-500/20 text-green-500"
    if (score >= 50) return "bg-yellow-500/20 text-yellow-500"
    return "bg-red-500/20 text-red-500"
  }

  const getScoreSubtext = (score: number) => {
    if (score >= 70) return "You're in a strong position. Focus on weak areas to stand out."
    if (score >= 50) return "You have a base; closing the gaps below will improve your odds."
    return "Focus on the skill areas below to raise your readiness."
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-2xl mx-auto px-8 py-8">
        <Link href="/" className="inline-block text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors">
          &larr; Back
        </Link>

        <h1 className="text-3xl font-semibold mb-2">Are you actually ready for this software job?</h1>
        <p className="text-muted-foreground mb-8">
          Check your real job readiness for Backend, Full Stack, or Data roles. Paste your resume or a job description
          and we'll show you where you stand and what to learn next.
        </p>

        <form
          className="mb-8"
          onSubmit={(e) => {
            e.preventDefault()
            handleAnalyze()
          }}
        >
          {/* Tab buttons */}
          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={() => setActiveTab("resume")}
              className={cn(
                "px-4 py-2 text-sm rounded-md border transition-colors",
                activeTab === "resume"
                  ? "bg-primary/15 border-primary text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              Resume
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("jd")}
              className={cn(
                "px-4 py-2 text-sm rounded-md border transition-colors",
                activeTab === "jd"
                  ? "bg-primary/15 border-primary text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              Job Description
            </button>
          </div>

          {/* Resume panel */}
          {activeTab === "resume" && (
            <div>
              {/* Sub-tabs for paste/upload */}
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setActiveSubTab("paste")}
                  className={cn(
                    "px-3 py-1.5 text-sm rounded-md border transition-colors",
                    activeSubTab === "paste"
                      ? "bg-primary/12 border-primary text-primary"
                      : "border-border/50 text-muted-foreground hover:text-foreground"
                  )}
                >
                  Paste
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSubTab("upload")}
                  className={cn(
                    "px-3 py-1.5 text-sm rounded-md border transition-colors",
                    activeSubTab === "upload"
                      ? "bg-primary/12 border-primary text-primary"
                      : "border-border/50 text-muted-foreground hover:text-foreground"
                  )}
                >
                  Upload PDF
                </button>
              </div>

              {activeSubTab === "paste" ? (
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume here (from Word, PDF, or any doc). We use it only to detect skills — nothing is stored."
                  className="w-full min-h-[280px] p-5 bg-card/30 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-y transition-colors"
                />
              ) : (
                <div>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    className={cn(
                      "min-h-[200px] border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer transition-colors",
                      uploadStatus === "error"
                        ? "border-red-500"
                        : "border-border hover:border-primary hover:bg-primary/5"
                    )}
                  >
                    <p
                      className={cn(
                        "text-sm",
                        uploadStatus === "error" ? "text-red-500" : uploadStatus === "loading" ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {uploadStatus === "loading" || uploadStatus === "error" ? (
                        uploadMessage
                      ) : (
                        <>
                          Drop your PDF here or{" "}
                          <span className="text-primary underline">browse</span>
                        </>
                      )}
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload(file)
                        e.target.value = ""
                      }}
                    />
                  </div>
                  <p className="text-muted-foreground text-sm mt-2">
                    Scanned PDFs won't work — we need selectable text.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* JD panel */}
          {activeTab === "jd" && (
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste the job description you're targeting. We'll extract expected skills and compare them to a standard framework for the role."
              className="w-full min-h-[280px] p-5 bg-card/30 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-y transition-colors"
            />
          )}

          {/* Role select */}
          <div className="mt-5">
            <label className="block text-sm font-medium mb-2">Target role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full max-w-[280px] px-4 py-3 bg-card/50 border border-border rounded-lg text-foreground cursor-pointer focus:outline-none focus:border-primary transition-colors"
            >
              <option value="Backend Engineer">Backend Engineer</option>
              <option value="Full Stack Engineer">Full Stack Engineer</option>
              <option value="Data Engineer">Data Engineer</option>
            </select>
          </div>

          <p className="text-muted-foreground text-sm mt-4">
            Provide at least a few lines of text (resume or job description) so we can analyze skills meaningfully.
            This tool does not guarantee job outcomes or salary.
          </p>

          <div className="flex gap-4 mt-4">
            <button
              type="submit"
              disabled={isAnalyzing}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isAnalyzing ? "Checking..." : "Check My Job Readiness"}
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="px-6 py-3 rounded-lg font-medium border border-border text-foreground hover:bg-card/50 transition-colors"
            >
              Clear
            </button>
          </div>
        </form>

        {/* Error state */}
        {error && (
          <div className="border border-dashed border-red-500/30 rounded-xl p-8 text-center">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="bg-card/20 border border-border rounded-xl p-6 mt-8">
            <h2 className="text-xl font-semibold mb-4">Your job readiness</h2>

            {/* Score */}
            <div className="flex items-start gap-4 mb-6">
              <div
                className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl shrink-0",
                  getScoreClass(result.overallScore)
                )}
              >
                {result.overallScore}
              </div>
              <div>
                <p>
                  You are <strong>{result.overallScore}%</strong> ready for{" "}
                  <strong>{result.role}</strong> roles
                </p>
                <p className="text-muted-foreground text-sm mt-1">{getScoreSubtext(result.overallScore)}</p>
              </div>
            </div>

            {/* Insight */}
            <div className="bg-card/30 border-l-4 border-primary px-5 py-4 rounded-r-lg mb-6">
              <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">Insight</p>
              <p className="text-foreground leading-relaxed">{result.insight}</p>
            </div>

            {/* Skill gap table */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Skill gaps</h3>
              <div className="overflow-x-auto border border-border rounded-lg">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-card/40">
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Skill area</th>
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Expected</th>
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Your level</th>
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.skillAreas.map((area: SkillArea, i: number) => (
                      <tr key={i} className="border-t border-border/50">
                        <td className="px-4 py-3">{area.skillArea}</td>
                        <td className="px-4 py-3">{area.expectedLevel}</td>
                        <td className="px-4 py-3">{area.yourLevel}</td>
                        <td
                          className={cn(
                            "px-4 py-3 font-medium",
                            area.status === "Good" ? "text-green-500" : "text-red-500"
                          )}
                        >
                          {area.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* How to close gaps */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2">How to close these gaps</h3>
              <p className="text-muted-foreground mb-5">
                Weak areas matter in real interviews. Here's why they're important and how Scaler can help.
              </p>

              <ul className="space-y-3 mb-6">
                {result.weakAreas.length > 0 ? (
                  result.weakAreas.map((area: string, i: number) => {
                    const info = GAP_TO_SCALER[area] || {
                      why: "This area is often assessed in interviews.",
                      scaler: "Scaler's programs cover this with structured curriculum and mentor support.",
                    }
                    return (
                      <li key={i} className="bg-card/30 border border-border rounded-lg px-5 py-4">
                        <h4 className="text-primary font-medium mb-1">{area}</h4>
                        <p className="text-muted-foreground text-sm mb-1">
                          <strong>Why it matters:</strong> {info.why}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          <strong>How Scaler helps:</strong> {info.scaler}
                        </p>
                      </li>
                    )
                  })
                ) : (
                  <li className="bg-card/30 border border-border rounded-lg px-5 py-4">
                    <p className="text-muted-foreground">
                      Your profile looks aligned with expectations for this role. A career consultation can still help
                      you prioritize and plan next steps.
                    </p>
                  </li>
                )}
              </ul>

              <div className="space-y-4">
                <div>
                  <a
                    href="https://www.scaler.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    Book a Free 15-Minute Career Consultation
                  </a>
                  <p className="text-muted-foreground text-sm mt-2">
                    A Scaler career mentor can help you plan a focused learning path instead of random prep.
                  </p>
                </div>
                <div>
                  <a
                    href="https://www.scaler.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block border-2 border-primary text-primary px-6 py-3 rounded-lg font-medium hover:bg-primary/10 transition-colors"
                  >
                    Explore Relevant Scaler Programs
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
