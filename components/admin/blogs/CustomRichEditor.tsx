"use client";

import React, { useRef, useEffect } from 'react';
import { 
  Bold, Italic, List, ListOrdered, 
  Quote, Heading1, Heading2, Link as LinkIcon, 
  Undo, Redo, Code 
} from 'lucide-react';

interface Props {
  value: string;
  onChange: (html: string) => void;
}

export default function CustomRichEditor({ value, onChange }: Props) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, []);

  const exec = (command: string, arg: string = "") => {
    // Crucial: Ensure the editor is focused before executing
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
    handleInput();
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const addLink = () => {
    const url = prompt("Enter URL:");
    if (url) exec("createLink", url);
  };

  return (
    <div className="w-full border border-slate-200 rounded-3xl overflow-hidden bg-white shadow-sm focus-within:ring-4 focus-within:ring-indigo-50 focus-within:border-indigo-500 transition-all">
      
      {/* TOOLBAR */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 border-b border-slate-200">
        <ToolbarButton onClick={() => exec('undo')} icon={<Undo size={16} />} title="Undo" />
        <ToolbarButton onClick={() => exec('redo')} icon={<Redo size={16} />} title="Redo" />
        
        <div className="w-px h-6 bg-slate-200 mx-1" />
        
        {/* Important: formatBlock requires the tag name as the argument */}
        <ToolbarButton onClick={() => exec('formatBlock', 'h2')} icon={<Heading1 size={16} />} title="Heading 1" />
        <ToolbarButton onClick={() => exec('formatBlock', 'h3')} icon={<Heading2 size={16} />} title="Heading 2" />
        <ToolbarButton onClick={() => exec('formatBlock', 'p')} icon={<span className="text-[10px] font-bold">P</span>} title="Paragraph" />

        <div className="w-px h-6 bg-slate-200 mx-1" />

        <ToolbarButton onClick={() => exec('bold')} icon={<Bold size={16} />} title="Bold" />
        <ToolbarButton onClick={() => exec('italic')} icon={<Italic size={16} />} title="Italic" />
        <ToolbarButton onClick={addLink} icon={<LinkIcon size={16} />} title="Link" />
        
        <div className="w-px h-6 bg-slate-200 mx-1" />

        <ToolbarButton onClick={() => exec('insertUnorderedList')} icon={<List size={16} />} title="Bullet List" />
        <ToolbarButton onClick={() => exec('insertOrderedList')} icon={<ListOrdered size={16} />} title="Numbered List" />
        <ToolbarButton onClick={() => exec('formatBlock', 'blockquote')} icon={<Quote size={16} />} title="Quote" />
        <ToolbarButton onClick={() => exec('formatBlock', 'pre')} icon={<Code size={16} />} title="Code Block" />
      </div>

      {/* EDITABLE AREA */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="p-8 min-h-[500px] outline-none prose prose-slate max-w-none text-slate-800 leading-relaxed"
        data-placeholder="Start writing your article..." 
      />

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #cbd5e1;
          cursor: text;
          pointer-events: none;
        }
        /* Ensure lists look correct inside the editor */
        .prose ul { list-style-type: disc; padding-left: 1.5rem; }
        .prose ol { list-style-type: decimal; padding-left: 1.5rem; }
      `}</style>
    </div>
  );
}

function ToolbarButton({ onClick, icon, title }: { onClick: () => void, icon: React.ReactNode, title: string }) {
  return (
    <button
      type="button"
      title={title}
      // CRITICAL: onMouseDown prevents the editor from losing focus
      onMouseDown={(e) => {
        e.preventDefault(); 
        onClick();
      }}
      className="p-2 hover:bg-white hover:text-indigo-600 rounded-lg transition-all text-slate-600 active:scale-90"
    >
      {icon}
    </button>
  );
}