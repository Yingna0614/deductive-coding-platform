"use client"

import type React from "react"

import { useState, useRef } from "react"

interface HighlightRange {
  start: number
  end: number
  text: string
  codeId: string
  color: string
}

interface TextHighlighterProps {
  text: string
  highlights: HighlightRange[]
  onTextSelect: (selectedText: string, range: { start: number; end: number }) => void
  className?: string
}

export function TextHighlighter({ text, highlights, onTextSelect, className = "" }: TextHighlighterProps) {
  const textRef = useRef<HTMLDivElement>(null)
  const [isSelecting, setIsSelecting] = useState(false)

  const handleMouseUp = () => {
    const selection = window.getSelection()
    if (!selection || selection.isCollapsed) {
      setIsSelecting(false)
      return
    }

    const selectedText = selection.toString().trim()
    if (!selectedText) {
      setIsSelecting(false)
      return
    }

    // Get the range relative to the text content
    const range = selection.getRangeAt(0)
    const textNode = textRef.current
    if (!textNode) return

    // Calculate the start and end positions in the full text
    const preCaretRange = range.cloneRange()
    preCaretRange.selectNodeContents(textNode)
    preCaretRange.setEnd(range.startContainer, range.startOffset)
    const start = preCaretRange.toString().length

    const end = start + selectedText.length

    onTextSelect(selectedText, { start, end })
    setIsSelecting(false)
  }

  const handleMouseDown = () => {
    setIsSelecting(true)
  }

  const renderTextWithHighlights = () => {
    if (!text || highlights.length === 0) {
      return <span>{text}</span>
    }

    // Sort highlights by start position
    const sortedHighlights = [...highlights].sort((a, b) => a.start - b.start)

    const elements: React.ReactNode[] = []
    let lastIndex = 0

    sortedHighlights.forEach((highlight, index) => {
      // Add text before highlight
      if (highlight.start > lastIndex) {
        elements.push(<span key={`text-${index}`}>{text.slice(lastIndex, highlight.start)}</span>)
      }

      // Add highlighted text
      elements.push(
        <mark
          key={`highlight-${index}`}
          className="px-1 py-0.5 rounded-sm font-medium cursor-pointer transition-opacity hover:opacity-80"
          style={{
            backgroundColor: highlight.color + "25",
            borderLeft: `3px solid ${highlight.color}`,
            color: highlight.color,
            marginRight: "1px",
          }}
          title={`Code: ${highlight.codeId}`}
        >
          {highlight.text}
        </mark>,
      )

      lastIndex = highlight.end
    })

    // Add remaining text
    if (lastIndex < text.length) {
      elements.push(<span key="text-end">{text.slice(lastIndex)}</span>)
    }

    return elements
  }

  return (
    <div
      ref={textRef}
      className={`prose prose-sm max-w-none leading-relaxed text-foreground cursor-text select-text ${className}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={{
        lineHeight: "1.8",
        userSelect: "text",
        WebkitUserSelect: "text",
      }}
    >
      {renderTextWithHighlights()}
    </div>
  )
}
