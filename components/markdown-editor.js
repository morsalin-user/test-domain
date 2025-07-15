"use client"

import { useState } from "react"

export function MarkdownEditor({ value, onChange, placeholder }) {
  const [isPreview, setIsPreview] = useState(false)

  const formatText = (format) => {
    const textarea = document.getElementById("markdown-textarea")
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)

    let newText = value
    let newCursorPos = start

    switch (format) {
      case "bold":
        newText = value.substring(0, start) + `**${selectedText}**` + value.substring(end)
        newCursorPos = start + 2
        break
      case "italic":
        newText = value.substring(0, start) + `*${selectedText}*` + value.substring(end)
        newCursorPos = start + 1
        break
      case "code":
        newText = value.substring(0, start) + `\`${selectedText}\`` + value.substring(end)
        newCursorPos = start + 1
        break
      case "link":
        newText = value.substring(0, start) + `[${selectedText || "Link Text"}](URL)` + value.substring(end)
        newCursorPos = start + 1
        break
      case "list":
        newText = value.substring(0, start) + `\n- ${selectedText || "List item"}` + value.substring(end)
        newCursorPos = start + 3
        break
      case "heading":
        newText = value.substring(0, start) + `## ${selectedText || "Heading"}` + value.substring(end)
        newCursorPos = start + 3
        break
    }

    onChange(newText)

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  const renderMarkdown = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, '<code class="bg-purple-900/30 px-1 rounded">$1</code>')
      .replace(/\[([^\]]+)\]$$([^)]+)$$/g, '<a href="$2" class="text-purple-400 hover:text-purple-300">$1</a>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold text-purple-100 mt-4 mb-2">$1</h2>')
      .replace(/^- (.*$)/gm, '<li class="ml-4">• $1</li>')
      .replace(/\n/g, "<br>")
  }

  return (
    <div className="border border-purple-500/30 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-purple-900/20 border-b border-purple-500/30 p-2 flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => formatText("bold")}
          className="p-1 hover:bg-purple-500/20 rounded text-sm"
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => formatText("italic")}
          className="p-1 hover:bg-purple-500/20 rounded text-sm italic"
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => formatText("code")}
          className="p-1 hover:bg-purple-500/20 rounded text-sm font-mono"
          title="Code"
        >
          {"<>"}
        </button>
        <button
          type="button"
          onClick={() => formatText("link")}
          className="p-1 hover:bg-purple-500/20 rounded text-sm"
          title="Link"
        >
          🔗
        </button>
        <button
          type="button"
          onClick={() => formatText("list")}
          className="p-1 hover:bg-purple-500/20 rounded text-sm"
          title="List"
        >
          •
        </button>
        <button
          type="button"
          onClick={() => formatText("heading")}
          className="p-1 hover:bg-purple-500/20 rounded text-sm font-bold"
          title="Heading"
        >
          H
        </button>
        <div className="ml-auto flex gap-2">
          <button
            type="button"
            onClick={() => setIsPreview(false)}
            className={`px-3 py-1 rounded text-sm ${!isPreview ? "bg-purple-500 text-white" : "text-purple-300 hover:bg-purple-500/20"}`}
          >
            Write
          </button>
          <button
            type="button"
            onClick={() => setIsPreview(true)}
            className={`px-3 py-1 rounded text-sm ${isPreview ? "bg-purple-500 text-white" : "text-purple-300 hover:bg-purple-500/20"}`}
          >
            Preview
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="min-h-[200px]">
        {isPreview ? (
          <div
            className="p-4 text-gray-300 prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(value || "Nothing to preview...") }}
          />
        ) : (
          <textarea
            id="markdown-textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-[200px] p-4 bg-transparent text-white resize-none focus:outline-none"
          />
        )}
      </div>
    </div>
  )
}
