"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileText, Code, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const [textFile, setTextFile] = useState<File | null>(null)
  const [codeFramework, setCodeFramework] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()

  const handleTextFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === "text/plain") {
      setTextFile(file)
    }
  }

  const handleCodeFrameworkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && (file.type === "text/csv" || file.name.endsWith(".csv"))) {
      setCodeFramework(file)
    }
  }

  const parseCSVToCodeFramework = (csvContent: string) => {
    const lines = csvContent.trim().split('\n')
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    
    // Find code and definition column indices
    const codeIndex = headers.findIndex(h => h === 'code')
    const definitionIndex = headers.findIndex(h => h === 'definition')
    
    if (codeIndex === -1 || definitionIndex === -1) {
      throw new Error('CSV must contain "code" and "definition" columns')
    }
    
    const codes = []
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316']
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim())
      if (values[codeIndex] && values[definitionIndex]) {
        codes.push({
          id: `code_${i}`,
          name: values[codeIndex],
          definition: values[definitionIndex],
          color: colors[(i - 1) % colors.length]
        })
      }
    }
    
    return { codes }
  }

  const handleStartCoding = async () => {
    if (!textFile || !codeFramework) return

    setIsUploading(true)

    try {
      // Store files in localStorage for demo purposes
      const textContent = await textFile.text()
      const csvContent = await codeFramework.text()
      
      // Parse CSV to code framework format
      const codeFrameworkData = parseCSVToCodeFramework(csvContent)

      localStorage.setItem("textDocument", textContent)
      localStorage.setItem("codeFramework", JSON.stringify(codeFrameworkData))
      localStorage.setItem("textFileName", textFile.name)
      localStorage.setItem("codeFileName", codeFramework.name)

      setTimeout(() => {
        router.push("/coding")
      }, 1000)
    } catch (error) {
      console.error('Error parsing CSV:', error)
      alert('Error parsing CSV file. Please ensure it contains "code" and "definition" columns.')
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Code className="h-4 w-4 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold text-foreground">DeductiveCoder</h1>
            </div>
            <div className="text-sm text-muted-foreground">Qualitative Data Analysis Platform</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="mx-auto max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">
              Start Your Deductive Coding Analysis
            </h2>
            <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
              Upload your text document and coding framework to begin systematic qualitative analysis with our
              interactive platform.
            </p>
          </div>

          {/* Upload Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Text Document Upload */}
            <Card className="border-2 border-dashed border-border hover:border-primary/50 transition-colors">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Text Document</CardTitle>
                <CardDescription>Upload the text file you want to analyze (.txt format)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="text-file">Select Text File</Label>
                  <Input
                    id="text-file"
                    type="file"
                    accept=".txt"
                    onChange={handleTextFileChange}
                    className="cursor-pointer"
                  />
                </div>
                {textFile && (
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{textFile.name}</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {(textFile.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Code Framework Upload */}
            <Card className="border-2 border-dashed border-border hover:border-primary/50 transition-colors">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Code className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Code Framework</CardTitle>
                <CardDescription>
                  Upload your coding framework with codes and definitions (.csv format)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code-file">Select Framework File</Label>
                  <Input
                    id="code-file"
                    type="file"
                    accept=".csv"
                    onChange={handleCodeFrameworkChange}
                    className="cursor-pointer"
                  />
                </div>
                {codeFramework && (
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <Code className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{codeFramework.name}</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {(codeFramework.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Framework Format Example */}
          <Card className="mb-8 bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg">Code Framework Format</CardTitle>
              <CardDescription>
                Your CSV file should contain "code" and "definition" columns. You can also include some examples in your definition. Each row represents one code:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-card p-4 rounded-lg text-sm overflow-x-auto border">
                <code className="text-foreground">{`code,definition
Leadership,References to leadership behaviors and qualities
Collaboration,Instances of teamwork and cooperation
Innovation,Creative problem-solving and new ideas
Communication,Effective information sharing and dialogue`}</code>
              </pre>
            </CardContent>
          </Card>

          {/* Start Button */}
          <div className="text-center">
            <Button
              onClick={handleStartCoding}
              disabled={!textFile || !codeFramework || isUploading}
              size="lg"
              className="px-8 py-3 text-lg"
            >
              {isUploading ? (
                <>
                  <Upload className="mr-2 h-5 w-5 animate-spin" />
                  Processing Files...
                </>
              ) : (
                <>
                  Start Coding Analysis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
