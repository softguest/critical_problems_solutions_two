'use client';

import React, { useEffect, useRef } from 'react';
import EditorJS, { OutputData, API } from '@editorjs/editorjs';
import { EDITOR_JS_TOOLS } from './tools/Tool';

interface EditorProps {
  data: OutputData | null;
  onChange: (data: OutputData) => void;
}

const Editor: React.FC<EditorProps> = ({ data, onChange }) => {
  const editorRef = useRef<EditorJS | null>(null);
  const holderId = 'editorjs-container';
  const hasRenderedRef = useRef(false); // to avoid re-rendering the same content again

  useEffect(() => {
    if (!editorRef.current) {
      const editor = new EditorJS({
        holder: holderId,
        data: data ?? { blocks: [] },
        autofocus: true,
        tools: EDITOR_JS_TOOLS,
        async onChange(api: API) {
          const output = await api.saver.save();
          onChange(output);
        },
      });

      editorRef.current = editor;
    }

    return () => {
      if (editorRef.current?.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  // Re-render content only once after initial mount (if needed)
  useEffect(() => {
    if (editorRef.current && data && !hasRenderedRef.current) {
      editorRef.current.isReady
        .then(() => {
          editorRef.current?.render(data);
          hasRenderedRef.current = true;
        })
        .catch((e) => console.error("EditorJS render failed", e));
    }
  }, [data]);

  return <div id={holderId} className="border p-4 rounded min-h-[300px]" />;
};

export default Editor;
