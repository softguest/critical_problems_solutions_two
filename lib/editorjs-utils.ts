// lib/editorjs-utils.ts
export function editorJsToText(blocks: any): string {
  if (!blocks?.blocks) return "";
  return blocks.blocks
    .map((block: any) => {
      switch (block.type) {
        case "paragraph":
          return block.data.text;
        case "header":
          return block.data.text;
        case "list":
          return block.data.items.join(", ");
        default:
          return "";
      }
    })
    .join("\n");
}
