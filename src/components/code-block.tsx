'use client'

import {useState} from 'react'
import {Check, Copy} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {cn} from '@/lib/utils'

interface CodeBlockProps {
  code: string
  language: string
}

export function CodeBlock({code}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative">
      <pre
        className={cn(
          'p-4 rounded-md bg-muted overflow-x-auto',
          'text-sm font-mono'
        )}
      >
        <code>{code}</code>
      </pre>
      <Button
        size="sm"
        variant="ghost"
        className="absolute top-2 right-2 h-8 w-8 p-0"
        onClick={copyToClipboard}
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}
