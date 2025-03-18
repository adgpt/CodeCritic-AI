
import React, { useState, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";
import Prism from 'prismjs';
// Import additional Prism components
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';

interface CodeEditorProps {
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, setCode, className }) => {
  const [language, setLanguage] = useState<string>('javascript');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setCode(value);
    updateLineNumbers(value);
  };

  // Update line numbers when code changes
  const updateLineNumbers = (text: string) => {
    if (!lineNumbersRef.current) return;
    
    const lines = text.split('\n').length;
    const lineNumbers = Array.from({ length: lines }, (_, i) => i + 1)
      .map(num => `<span class="line-number">${num}</span>`)
      .join('');
    
    lineNumbersRef.current.innerHTML = lineNumbers;
  };

  // Detect language from code content
  useEffect(() => {
    // Simple language detection based on file extensions or syntax
    if (code.includes('<?php')) {
      setLanguage('php');
    } else if (code.includes('import React') || code.includes('className=') || code.includes('jsx')) {
      setLanguage('jsx');
    } else if (code.includes('<template>') || code.includes('export default {')) {
      setLanguage('javascript'); // Vue
    } else if (code.includes('def ') && code.includes(':') && !code.includes('{')) {
      setLanguage('python');
    } else if (code.includes('public class ') || code.includes('private void')) {
      setLanguage('java');
    } else if (code.includes('using namespace') || code.includes('std::')) {
      setLanguage('cpp');
    } else if (code.includes('@import') || code.includes('@media') || code.includes('@keyframes')) {
      setLanguage('css');
    } else if (code.includes('interface ') || code.includes('type ') || code.includes(': string')) {
      setLanguage('typescript');
    }
  }, [code]);

  // Apply syntax highlighting
  useEffect(() => {
    if (preRef.current) {
      preRef.current.textContent = code;
      Prism.highlightElement(preRef.current);
    }
    
    // Initialize line numbers
    updateLineNumbers(code);
  }, [code, language]);

  // Sync scrolling between textarea and highlighted code
  useEffect(() => {
    const textarea = textareaRef.current;
    const pre = preRef.current;
    const lineNumbers = lineNumbersRef.current;
    
    if (!textarea || !pre || !lineNumbers) return;
    
    const syncScroll = () => {
      pre.scrollTop = textarea.scrollTop;
      pre.scrollLeft = textarea.scrollLeft;
      lineNumbers.scrollTop = textarea.scrollTop;
    };
    
    textarea.addEventListener('scroll', syncScroll);
    return () => textarea.removeEventListener('scroll', syncScroll);
  }, []);

  // Handle tab key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      
      // Insert 2 spaces at cursor position
      const newText = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newText);
      
      // Move cursor position
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl border border-border shadow-sm transition-all duration-200",
      className
    )}>
      <div className="flex items-center justify-between bg-secondary/50 px-4 py-2 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 rounded-full bg-red-500" />
          <div className="h-3 w-3 rounded-full bg-yellow-500" />
          <div className="h-3 w-3 rounded-full bg-green-500" />
        </div>
        <span className="ml-4 text-sm font-medium text-muted-foreground">Code Editor</span>
        <select 
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="text-xs bg-transparent border border-border rounded px-2 py-1 text-muted-foreground"
        >
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="jsx">JSX/React</option>
          <option value="tsx">TSX</option>
          <option value="css">CSS</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="c">C</option>
          <option value="cpp">C++</option>
        </select>
      </div>
      <div className="relative bg-card flex h-[400px]">
        {/* Line numbers */}
        <div 
          ref={lineNumbersRef}
          className="line-numbers text-right pr-2 py-4 select-none text-xs text-muted-foreground/60 min-w-[2rem] bg-secondary/30 border-r border-border overflow-y-auto"
        ></div>
        
        {/* Actual editor */}
        <div className="relative flex-grow">
          {/* Highlighted code */}
          <pre 
            ref={preRef}
            className="code-highlight absolute top-0 left-0 right-0 bottom-0 overflow-auto m-0 p-4 whitespace-pre font-mono text-sm bg-transparent pointer-events-none"
            aria-hidden="true"
          ><code className={`language-${language}`}>{code}</code></pre>

          {/* Editable textarea */}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="code-editor caret-foreground w-full h-full p-4 bg-transparent outline-none resize-none font-mono text-sm text-transparent !caret-foreground overflow-auto"
            placeholder="// Paste your code here for review..."
            spellCheck="false"
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
          />
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
