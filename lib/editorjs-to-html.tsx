// lib/editorjs-to-html.ts
import EditorJSHTML from 'editorjs-html';

const EJSH = EditorJSHTML();

export function renderEditorJsHTML(content: any) {
  if (!content || !Array.isArray(content.blocks)) return null;

  const htmlBlocks = EJSH.parse(content);
  return htmlBlocks;
}
