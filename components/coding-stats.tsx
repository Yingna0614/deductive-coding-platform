"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp } from "lucide-react"

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

interface CodingStatsProps {
  codeFramework: CodeItem[]
  codingResults: CodingResult[]
}

export function CodingStats({ codeFramework, codingResults }: CodingStatsProps) {
  const getCodeStats = () => {
    const stats = codeFramework
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

    return stats
  }

  const stats = getCodeStats()
  const totalSegments = codingResults.length
  const mostUsedCode = stats[0]

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Coding Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-foreground">{totalSegments}</div>
            <div className="text-xs text-muted-foreground">Total Segments</div>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-foreground">{stats.filter((s) => s.count > 0).length}</div>
            <div className="text-xs text-muted-foreground">Codes Used</div>
          </div>
        </div>

        {/* Most Used Code */}
        {mostUsedCode && mostUsedCode.count > 0 && (
          <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Most Used Code</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: mostUsedCode.color }} />
              <span className="text-sm font-medium">{mostUsedCode.name}</span>
              <Badge variant="secondary" className="text-xs ml-auto">
                {mostUsedCode.count} times
              </Badge>
            </div>
          </div>
        )}

        {/* Code Usage Breakdown */}
        <div className="space-y-3">
          <div className="text-sm font-medium">Code Usage</div>
          {stats.map((stat) => (
            <div key={stat.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stat.color }} />
                  <span className="text-sm">{stat.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{stat.count}</span>
                  <span className="text-xs text-muted-foreground">({stat.percentage.toFixed(1)}%)</span>
                </div>
              </div>
              <Progress
                value={stat.percentage}
                className="h-2"
                style={
                  {
                    "--progress-background": stat.color,
                  } as React.CSSProperties
                }
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
