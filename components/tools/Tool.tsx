import Header from "@editorjs/header";
import List from "@editorjs/list";
import Checklist from "@editorjs/checklist";
import Paragraph from "@editorjs/paragraph";
import ImageTool from "@editorjs/image";
import CodeTool from "@editorjs/code";
import Embed from "@editorjs/embed";

export const EDITOR_JS_TOOLS = {
  header: Header,
  paragraph: Paragraph,
  list: List,
  checklist: Checklist,
  code: CodeTool,
  embed: Embed,
  image: {
    class: ImageTool,
    config: {
      uploader: {
        async uploadByFile(file: File) {
          // 1. Get signature from your API
          const sigRes = await fetch("/api/cloudinary/signature");
          const { timestamp, signature, folder } = await sigRes.json();

          // 2. Prepare Cloudinary upload
          const formData = new FormData();
          formData.append("file", file);
          formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
          formData.append("timestamp", timestamp);
          formData.append("signature", signature);
          formData.append("folder", folder);

          // 3. Upload to Cloudinary
          const cloudinaryRes = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            { method: "POST", body: formData }
          );

          const uploaded = await cloudinaryRes.json();

          if (!cloudinaryRes.ok || !uploaded.secure_url) {
            console.error("Cloudinary upload failed", uploaded);
            return { success: 0 };
          }

          return {
            success: 1,
            file: {
              url: uploaded.secure_url,
            },
          };
        },
      },
    },
  },
};
