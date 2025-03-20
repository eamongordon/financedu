'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { Image as ImageIcon, SquareSplitVertical } from 'lucide-react'
import { useState } from 'react'
import { Textarea } from '../ui/textarea'

export default function Tiptap() {
  const [content, setContent] = useState('<p>Hello World! 🌎️</p>');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image
    ],
    content: content,
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
    editor?.commands.setContent(event.target.value);
  };

  return (
    <div>
      <Textarea value={content} onChange={handleTextareaChange} className="mb-4" />
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
} from "lucide-react";
import { Editor } from "@tiptap/react";
import { Toggle } from '../ui/toggle'
import { Button } from '../ui/button';

export function MenuBar({ editor }: { editor: Editor | null }) {
  if (!editor) {
    return null;
  }

  const Options = [
    {
      icon: <Heading1 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      pressed: editor.isActive("heading", { level: 1 }),
    },
    {
      icon: <Heading2 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      pressed: editor.isActive("heading", { level: 2 }),
    },
    {
      icon: <Heading3 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      pressed: editor.isActive("heading", { level: 3 }),
    },
    {
      icon: <Bold className="size-4" />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      pressed: editor.isActive("bold"),
    },
    {
      icon: <Italic className="size-4" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      pressed: editor.isActive("italic"),
    },
    {
      icon: <Strikethrough className="size-4" />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      pressed: editor.isActive("strike"),
    },
    {
      icon: <List className="size-4" />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      pressed: editor.isActive("bulletList"),
    },
    {
      icon: <ListOrdered className="size-4" />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      pressed: editor.isActive("orderedList"),
    },
    {
      icon: <SquareSplitVertical className="size-4" />,
      onClick: () => editor.chain().focus().setHorizontalRule().run(),
      pressed: editor.isActive("horizontalRule"),
    }
  ];

  const addImage = () => {
    const url = window.prompt('URL')

    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  };

  return (
    <div className="border rounded-md p-1 mb-1 bg-background space-x-2 z-50 sticky top-20">
      {Options.map((option, index) => (
        <Toggle
          key={index}
          pressed={option.pressed}
          onPressedChange={option.onClick}
        >
          {option.icon}
        </Toggle>
      ))}
      <Button variant="ghost" onClick={addImage}><ImageIcon /></Button>
    </div>
  );
}