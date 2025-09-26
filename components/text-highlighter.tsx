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
    if (!text) {
      return <span>No text content</span>
    }

    // Split text into paragraphs
    const paragraphs = text.split(/\n\s*\n/).filter(paragraph => paragraph.trim())
    
    return paragraphs.map((paragraph, paragraphIndex) => {
      // Process each paragraph for highlights
      const paragraphStart = text.indexOf(paragraph)
      const paragraphEnd = paragraphStart + paragraph.length
      
      // Find highlights within this paragraph
      const paragraphHighlights = highlights.filter(highlight => 
        highlight.start >= paragraphStart && highlight.end <= paragraphEnd
      ).map(highlight => ({
        ...highlight,
        start: highlight.start - paragraphStart,
        end: highlight.end - paragraphStart
      }))

      if (paragraphHighlights.length === 0) {
        return (
          <p key={`paragraph-${paragraphIndex}`} className="mb-4 last:mb-0">
            {paragraph.trim()}
          </p>
        )
      }

      // Sort highlights by start position
      const sortedHighlights = [...paragraphHighlights].sort((a, b) => a.start - b.start)

      const elements: React.ReactNode[] = []
      let lastIndex = 0

      sortedHighlights.forEach((highlight, index) => {
        // Add text before highlight
        if (highlight.start > lastIndex) {
          elements.push(<span key={`text-${paragraphIndex}-${index}`}>{paragraph.slice(lastIndex, highlight.start)}</span>)
        }

        // Add highlighted text
        elements.push(
          <mark
            key={`highlight-${paragraphIndex}-${index}`}
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
      if (lastIndex < paragraph.length) {
        elements.push(<span key={`text-end-${paragraphIndex}`}>{paragraph.slice(lastIndex)}</span>)
      }

      return (
        <p key={`paragraph-${paragraphIndex}`} className="mb-4 last:mb-0">
          {elements}
        </p>
      )
    })
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
      <div className="space-y-4">
        {renderTextWithHighlights()}
      </div>
    </div>
  )
}
