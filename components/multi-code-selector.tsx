"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Check, X, Sparkles, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { API_CONFIG } from "@/lib/api-config"

interface CodeItem {
  id: string
  name: string
  definition: string
  color: string
}

interface LLMSuggestion {
  codeName: string
  explanation: string
  confidence: number
}

interface MultiCodeSelectorProps {
  selectedText: string
  codeFramework: CodeItem[]
  onCodesSelect: (codeIds: string[]) => void
  onCancel: () => void
  context?: string
}

export function MultiCodeSelector({ 
  selectedText, 
  codeFramework, 
  onCodesSelect, 
  onCancel,
  context = ""
}: MultiCodeSelectorProps) {
  const [selectedCodes, setSelectedCodes] = useState<string[]>([])
  const [llmSuggestions, setLlmSuggestions] = useState<LLMSuggestion[]>([])
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [suggestionError, setSuggestionError] = useState<string | null>(null)

  const handleCodeToggle = (codeId: string) => {
    setSelectedCodes((prev) => (prev.includes(codeId) ? prev.filter((id) => id !== codeId) : [...prev, codeId]))
  }

  const handleApply = () => {
    if (selectedCodes.length > 0) {
      onCodesSelect(selectedCodes)
    }
  }

  const getLLMSuggestions = async () => {
    setIsLoadingSuggestions(true)
    setSuggestionError(null)

    try {
      // 调试信息
      console.log('=== AI Suggestion Debug ===')
      console.log('API Key:', API_CONFIG.OPENROUTER_API_KEY.substring(0, 20) + '...')
      console.log('API Key length:', API_CONFIG.OPENROUTER_API_KEY.length)
      console.log('Selected text:', selectedText)
      console.log('Code framework length:', codeFramework.length)
      
      // 检查API key是否有效
      if (!API_CONFIG.OPENROUTER_API_KEY || API_CONFIG.OPENROUTER_API_KEY === '<OPENROUTER_API_KEY>') {
        throw new Error('API key not configured properly')
      }

      // 检查输入
      if (!selectedText.trim()) {
        throw new Error('No text selected')
      }

      if (codeFramework.length === 0) {
        throw new Error('No code framework loaded')
      }

      // Create codebook description
      const codebookDescription = codeFramework.map(code => 
        `- ${code.name}: ${code.definition}`
      ).join('\n')

      const prompt = `You are a qualitative research coding assistant. Analyze the selected text and suggest relevant codes from the codebook.

CODEBOOK:
${codebookDescription}

SELECTED TEXT: "${selectedText}"

CONTEXT: ${context || "No additional context provided"}

TASK: Find the most relevant codes from the codebook that apply to the selected text. Even if the text is short or unclear, try to identify potential connections.

IMPORTANT INSTRUCTIONS:
1. Be generous in your suggestions - if there's any possible connection, suggest it
2. For short or unclear text, consider what the text might be referring to
3. Provide 1-3 suggestions maximum
4. Always include confidence scores (1-10)
5. If no clear connection exists, suggest the most general applicable code

RESPONSE FORMAT (JSON only):
{
  "suggestions": [
    {
      "codeName": "exact code name from codebook",
      "explanation": "why this code applies",
      "confidence": 8
    }
  ]
}

EXAMPLES:
- Text "leadership" → suggest "Leadership" code
- Text "team work" → suggest "Collaboration" code  
- Text "new ideas" → suggest "Innovation" code
- Short text "examples" → suggest "Training" code (if it's about learning)
- Unclear text → suggest the most general applicable code

Always respond with valid JSON. Include at least one suggestion unless absolutely no connection exists.`

      console.log('Prompt length:', prompt.length)
      console.log('Making API request...')

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_CONFIG.OPENROUTER_API_KEY}`,
          "HTTP-Referer": API_CONFIG.SITE_URL,
          "X-Title": API_CONFIG.SITE_NAME,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "openai/gpt-4o-mini",
          "messages": [
            {
              "role": "user",
              "content": prompt
            }
          ],
          "temperature": 0.5,
          "max_tokens": 800
        })
      })

      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error Response:', errorText)
        throw new Error(`API request failed: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log('Full API response:', data)
      
      const content = data.choices[0]?.message?.content
      console.log('Response content:', content)

      if (!content) {
        throw new Error("No response content received")
      }

      // Parse JSON response - handle markdown formatting
      let jsonContent = content.trim()
      
      // Remove markdown code blocks if present
      if (jsonContent.startsWith('```json')) {
        jsonContent = jsonContent.replace(/^```json\s*/, '').replace(/\s*```$/, '')
      } else if (jsonContent.startsWith('```')) {
        jsonContent = jsonContent.replace(/^```\s*/, '').replace(/\s*```$/, '')
      }
      
      console.log('Parsed JSON content:', jsonContent)
      
      const parsedResponse = JSON.parse(jsonContent)
      console.log('Parsed response:', parsedResponse)
      
      setLlmSuggestions(parsedResponse.suggestions || [])
    } catch (error) {
      console.error('=== AI Suggestion Error ===')
      console.error('Error details:', error)
      setSuggestionError(error instanceof Error ? error.message : 'Failed to get suggestions')
    } finally {
      setIsLoadingSuggestions(false)
    }
  }

  const applyLLMSuggestion = (suggestion: LLMSuggestion) => {
    const matchingCode = codeFramework.find(code => 
      code.name.toLowerCase() === suggestion.codeName.toLowerCase()
    )
    
    if (matchingCode && !selectedCodes.includes(matchingCode.id)) {
      setSelectedCodes(prev => [...prev, matchingCode.id])
    }
  }

  return (
    <Card className="border-primary bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Apply Codes to Selected Text</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Selected Text Display */}
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm font-medium text-foreground">"{selectedText}"</p>
        </div>

        {/* LLM Suggestions Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">AI Suggestions:</div>
            <Button
              onClick={getLLMSuggestions}
              disabled={isLoadingSuggestions}
              size="sm"
              variant="outline"
              className="gap-2"
            >
              {isLoadingSuggestions ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Sparkles className="h-3 w-3" />
              )}
              Get AI Suggestions
            </Button>
          </div>

          {suggestionError && (
            <Alert variant="destructive">
              <AlertDescription className="text-xs">
                {suggestionError}
              </AlertDescription>
            </Alert>
          )}

          {llmSuggestions.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">AI Suggestions:</div>
              <div className="space-y-2">
                {llmSuggestions.map((suggestion, index) => {
                  const matchingCode = codeFramework.find(code => 
                    code.name.toLowerCase() === suggestion.codeName.toLowerCase()
                  )
                  
                  if (!matchingCode) return null

                  return (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div 
                            className="w-2 h-2 rounded-full flex-shrink-0" 
                            style={{ backgroundColor: matchingCode.color }} 
                          />
                          <span className="font-medium text-sm">{matchingCode.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {suggestion.confidence}/10
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">
                          {matchingCode.definition}
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 italic">
                          AI: {suggestion.explanation}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Manual Code Selection */}
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground mb-2">Or manually select codes:</div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {codeFramework.map((code) => (
              <div
                key={code.id}
                className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer"
                onClick={() => handleCodeToggle(code.id)}
              >
                <Checkbox
                  checked={selectedCodes.includes(code.id)}
                  onChange={() => handleCodeToggle(code.id)}
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: code.color }} />
                    <span className="font-medium text-sm">{code.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{code.definition}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Codes Preview */}
        {selectedCodes.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Selected codes:</div>
            <div className="flex flex-wrap gap-1">
              {selectedCodes.map((codeId) => {
                const code = codeFramework.find((c) => c.id === codeId)
                return code ? (
                  <Badge
                    key={codeId}
                    variant="secondary"
                    className="text-xs"
                    style={{
                      backgroundColor: code.color + "20",
                      color: code.color,
                      borderColor: code.color + "40",
                    }}
                  >
                    {code.name}
                  </Badge>
                ) : null
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button onClick={handleApply} disabled={selectedCodes.length === 0} size="sm" className="gap-2">
            <Check className="h-3 w-3" />
            Apply Codes
          </Button>
          <Button variant="outline" size="sm" onClick={onCancel} className="gap-2 bg-transparent">
            <X className="h-3 w-3" />
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}