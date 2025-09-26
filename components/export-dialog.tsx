"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Download, FileText, FileSpreadsheet, FileCode } from "lucide-react"

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

interface ExportDialogProps {
  codeFramework: CodeItem[]
  codingResults: CodingResult[]
  disabled?: boolean
}

export function ExportDialog({ codeFramework, codingResults, disabled = false }: ExportDialogProps) {
  const [open, setOpen] = useState(false)
  const [exportFormat, setExportFormat] = useState<"json" | "csv" | "txt">("json")
  const [includeStats, setIncludeStats] = useState(true)
  const [includeDefinitions, setIncludeDefinitions] = useState(true)
  const [includePositions, setIncludePositions] = useState(true)

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

  const exportAsJSON = () => {
    const data = {
      metadata: {
        document: localStorage.getItem("textFileName") || "document.txt",
        framework: localStorage.getItem("codeFileName") || "framework.json",
        timestamp: new Date().toISOString(),
        totalSegments: codingResults.length,
        exportOptions: {
          includeStats,
          includeDefinitions,
          includePositions,
        },
      },
      results: codingResults.map((result) => ({
        text: result.text,
        codes: result.codes.map((codeId) => {
          const code = codeFramework.find((c) => c.id === codeId)
          const codeData: any = {
            id: codeId,
            name: code?.name || "Unknown",
          }
          if (includeDefinitions) {
            codeData.definition = code?.definition || ""
            codeData.color = code?.color || "#000000"
          }
          return codeData
        }),
        ...(includePositions && {
          position: {
            start: result.startIndex,
            end: result.endIndex,
          },
        }),
      })),
      ...(includeStats && {
        statistics: getCodeStats().map((stat) => ({
          code: stat.name,
          count: stat.count,
          percentage: stat.percentage,
          ...(includeDefinitions && {
            definition: stat.definition,
            color: stat.color,
          }),
        })),
      }),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    downloadFile(blob, `coding-results-${new Date().toISOString().split("T")[0]}.json`)
  }

  const exportAsCSV = () => {
    const headers = [
      "Text",
      "Codes",
      ...(includeDefinitions ? ["Code Definitions"] : []),
      ...(includePositions ? ["Start Position", "End Position"] : []),
    ]

    const rows = codingResults.map((result) => {
      const codes = result.codes
        .map((codeId) => {
          const code = codeFramework.find((c) => c.id === codeId)
          return code?.name || "Unknown"
        })
        .join("; ")

      const definitions = includeDefinitions
        ? result.codes
            .map((codeId) => {
              const code = codeFramework.find((c) => c.id === codeId)
              return `${code?.name || "Unknown"}: ${code?.definition || ""}`
            })
            .join("; ")
        : ""

      return [
        `"${result.text.replace(/"/g, '""')}"`,
        `"${codes}"`,
        ...(includeDefinitions ? [`"${definitions}"`] : []),
        ...(includePositions ? [result.startIndex.toString(), result.endIndex.toString()] : []),
      ]
    })

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    downloadFile(blob, `coding-results-${new Date().toISOString().split("T")[0]}.csv`)
  }

  const exportAsTXT = () => {
    const content = [
      `Deductive Coding Analysis Results`,
      `Generated: ${new Date().toLocaleString()}`,
      `Document: ${localStorage.getItem("textFileName") || "document.txt"}`,
      `Framework: ${localStorage.getItem("codeFileName") || "framework.json"}`,
      `Total Segments: ${codingResults.length}`,
      "",
      "=".repeat(50),
      "",
      "CODED SEGMENTS:",
      "",
    ]

    codingResults.forEach((result, index) => {
      content.push(`${index + 1}. "${result.text}"`)

      const codes = result.codes
        .map((codeId) => {
          const code = codeFramework.find((c) => c.id === codeId)
          return code?.name || "Unknown"
        })
        .join(", ")
      content.push(`   Codes: ${codes}`)

      if (includeDefinitions) {
        result.codes.forEach((codeId) => {
          const code = codeFramework.find((c) => c.id === codeId)
          if (code) {
            content.push(`   - ${code.name}: ${code.definition}`)
          }
        })
      }

      if (includePositions) {
        content.push(`   Position: ${result.startIndex}-${result.endIndex}`)
      }

      content.push("")
    })

    if (includeStats) {
      content.push("=".repeat(50))
      content.push("")
      content.push("CODING STATISTICS:")
      content.push("")

      const stats = getCodeStats()
      stats.forEach((stat) => {
        content.push(`${stat.name}: ${stat.count} times (${stat.percentage.toFixed(1)}%)`)
        if (includeDefinitions) {
          content.push(`  Definition: ${stat.definition}`)
        }
        content.push("")
      })
    }

    const blob = new Blob([content.join("\n")], { type: "text/plain" })
    downloadFile(blob, `coding-results-${new Date().toISOString().split("T")[0]}.txt`)
  }

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setOpen(false)
  }

  const handleExport = () => {
    switch (exportFormat) {
      case "json":
        exportAsJSON()
        break
      case "csv":
        exportAsCSV()
        break
      case "txt":
        exportAsTXT()
        break
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled} className="gap-2">
          <Download className="h-4 w-4" />
          Export Results
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Export Coding Results</DialogTitle>
          <DialogDescription>Choose your export format and options for the coding analysis results.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Format */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Export Format</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={exportFormat}
                onValueChange={(value: "json" | "csv" | "txt") => setExportFormat(value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="json" id="json" />
                  <Label htmlFor="json" className="flex items-center gap-2 cursor-pointer">
                    <FileCode className="h-4 w-4" />
                    JSON (Structured data)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="csv" id="csv" />
                  <Label htmlFor="csv" className="flex items-center gap-2 cursor-pointer">
                    <FileSpreadsheet className="h-4 w-4" />
                    CSV (Spreadsheet)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="txt" id="txt" />
                  <Label htmlFor="txt" className="flex items-center gap-2 cursor-pointer">
                    <FileText className="h-4 w-4" />
                    TXT (Plain text)
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Export Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="stats"
                  checked={includeStats}
                  onCheckedChange={(checked) => setIncludeStats(checked as boolean)}
                />
                <Label htmlFor="stats" className="text-sm cursor-pointer">
                  Include coding statistics
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="definitions"
                  checked={includeDefinitions}
                  onCheckedChange={(checked) => setIncludeDefinitions(checked as boolean)}
                />
                <Label htmlFor="definitions" className="text-sm cursor-pointer">
                  Include code definitions
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="positions"
                  checked={includePositions}
                  onCheckedChange={(checked) => setIncludePositions(checked as boolean)}
                />
                <Label htmlFor="positions" className="text-sm cursor-pointer">
                  Include text positions
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Export Summary */}
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="text-sm font-medium mb-2">Export Summary</div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>• {codingResults.length} coded segments</div>
              <div>
                •{" "}
                {codeFramework.filter((code) => codingResults.some((result) => result.codes.includes(code.id))).length}{" "}
                codes used
              </div>
              <div>• Format: {exportFormat.toUpperCase()}</div>
            </div>
          </div>

          {/* Export Button */}
          <Button onClick={handleExport} className="w-full gap-2">
            <Download className="h-4 w-4" />
            Export as {exportFormat.toUpperCase()}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
