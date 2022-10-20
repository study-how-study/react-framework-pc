import React, { useState, useEffect } from 'react'
import './CodeViewer.less'

const CodeViewer: React.FC<ICodeViewerProps> = (props) => {

  useEffect(() => {
    let prism = (window as any).Prism
    if (prism) {
      prism.highlightAll()
    }
  }, [props.code])

  const language = props.language ? 'language-' + props.language : 'language-tsx'

  return (
    <div className="code-viewer">
      <pre>
        <code className={language}>{props.code}</code>
      </pre>
    </div>
  )
}

interface ICodeViewerProps {
  code: string
  language?: string
}

export { CodeViewer }
