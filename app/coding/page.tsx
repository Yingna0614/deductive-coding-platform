"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { FileText, Code, ArrowLeft, Highlighter, CheckCircle, Circle, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

import { TextHighlighter } from "@/components/text-highlighter"
import { MultiCodeSelector } from "@/components/multi-code-selector"
import { CodingStats } from "@/components/coding-stats"
import { ExportDialog } from "@/components/export-dialog"

interface CodeItem {
  id: string
  name: string
  definition: string
  color: string
}

interface CodingResult {
  id: string
  text: string
  codes: string[]
  startIndex: number
  endIndex: number
}

export default function CodingPage() {
  const [textContent, setTextContent] = useState("")
  const [codeFramework, setCodeFramework] = useState<CodeItem[]>([])
  const [selectedText, setSelectedText] = useState("")
  const [selectedRange, setSelectedRange] = useState<{ start: number; end: number } | null>(null)
  const [codingResults, setCodingResults] = useState<CodingResult[]>([])
  const [showCodeSelector, setShowCodeSelector] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Load data from localStorage
    const text = localStorage.getItem("textDocument")
    const framework = localStorage.getItem("codeFramework")

    if (!text || !framework) {
      router.push("/")
      return
    }

    setTextContent(text)

    try {
      const parsedFramework = JSON.parse(framework)
      setCodeFramework(parsedFramework.codes || [])
    } catch (error) {
      console.error("Error parsing code framework:", error)
      router.push("/")
    }
  }, [router])

  const getContextAroundSelection = (range: { start: number; end: number }) => {
    const contextStart = Math.max(0, range.start - 200)
    const contextEnd = Math.min(textContent.length, range.end + 200)
    return textContent.slice(contextStart, contextEnd)
  }

  const handleTextSelection = (selectedText: string, range: { start: number; end: number }) => {
    setSelectedText(selectedText)
    setSelectedRange(range)
    setShowCodeSelector(true)
  }

  const getHighlightRanges = () => {
    return codingResults.map((result) => ({
      start: result.startIndex,
      end: result.endIndex,
      text: result.text,
      codeId: result.codes[0],
      color: getCodeById(result.codes[0])?.color || "#3b82f6",
    }))
  }

  const handleCodesSelection = (codeIds: string[]) => {
    if (!selectedText || !selectedRange || codeIds.length === 0) return

    const newResult: CodingResult = {
      id: Date.now().toString(),
      text: selectedText,
      codes: codeIds,
      startIndex: selectedRange.start,
      endIndex: selectedRange.end,
    }

    setCodingResults((prev) => [...prev, newResult])
    setShowCodeSelector(false)
    setSelectedText("")
    setSelectedRange(null)

    // Clear selection
    window.getSelection()?.removeAllRanges()
  }

  const handleCancelSelection = () => {
    setShowCodeSelector(false)
    setSelectedText("")
    setSelectedRange(null)
    window.getSelection()?.removeAllRanges()
  }

  const handleRemoveResult = (resultId: string) => {
    setCodingResults((prev) => prev.filter((result) => result.id !== resultId))
  }

  const handleDownloadResults = () => {
    const results = {
      document: localStorage.getItem("textFileName") || "document.txt",
      framework: localStorage.getItem("codeFileName") || "framework.json",
      timestamp: new Date().toISOString(),
      totalSegments: codingResults.length,
      results: codingResults.map((result) => ({
        text: result.text,
        codes: result.codes.map((codeId) => {
          const code = codeFramework.find((c) => c.id === codeId)
          return {
            id: codeId,
            name: code?.name || "Unknown",
            definition: code?.definition || "",
            color: code?.color || "#000000",
          }
        }),
        position: {
          start: result.startIndex,
          end: result.endIndex,
        },
      })),
      statistics: getCodeStats(),
    }

    const blob = new Blob([JSON.stringify(results, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `coding-results-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getCodeStats = () => {
    return codeFramework
      .map((code) => {
        const count = codingResults.filter((result) => result.codes.includes(code.id)).length
        const percentage = codingResults.length > 0 ? (count / codingResults.length) * 100 : 0
        return {
          ...code,
          count,
          percentage,
        }
      })
      .sort((a, b) => b.count - a.count)
  }

  const getCodeById = (id: string) => codeFramework.find((code) => code.id === id)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Code className="h-4 w-4 text-primary-foreground" />
                </div>
                <h1 className="text-xl font-semibold text-foreground">Coding Analysis</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="gap-2">
                <CheckCircle className="h-3 w-3" />
                {codingResults.length} Coded Segments
              </Badge>
              <ExportDialog
                codeFramework={codeFramework}
                codingResults={codingResults}
                disabled={codingResults.length === 0}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
          {/* Document Display */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Document Analysis
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Highlighter className="h-4 w-4" />
                    Select text to code
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-[calc(100%-80px)]">
                <ScrollArea className="h-full">
                  <TextHighlighter
                    text={textContent}
                    highlights={getHighlightRanges()}
                    onTextSelect={handleTextSelection}
                  />
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Coding Panel */}
          <div className="space-y-6">
            {/* Code Selection */}
            {showCodeSelector && selectedRange && (
              <MultiCodeSelector
                selectedText={selectedText}
                codeFramework={codeFramework}
                onCodesSelect={handleCodesSelection}
                onCancel={handleCancelSelection}
                context={getContextAroundSelection(selectedRange)}
              />
            )}

            {/* Coding Statistics */}
            <CodingStats codeFramework={codeFramework} codingResults={codingResults} />

            {/* Coding Results */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Coding Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  {codingResults.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Circle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No coded segments yet</p>
                      <p className="text-xs">Select text to start coding</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {codingResults.map((result) => (
                        <div key={result.id} className="p-3 bg-muted/30 rounded-lg group">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex flex-wrap gap-1">
                              {result.codes.map((codeId) => {
                                const code = getCodeById(codeId)
                                return code ? (
                                  <Badge
                                    key={codeId}
                                    variant="secondary"
                                    className="text-xs"
                                    style={{
                                      backgroundColor: code.color + "20",
                                      color: code.color,
                                    }}
                                  >
                                    {code.name}
                                  </Badge>
                                ) : null
                              })}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveResult(result.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-xs text-foreground font-medium">"{result.text}"</p>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
