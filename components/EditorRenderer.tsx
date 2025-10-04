// import React from "react";

// type EditorBlock = {
//   id: string;
//   type: string;
//   data: any;
// };

// interface EditorRendererProps {
//   blocks: EditorBlock[];
// }

// export const EditorRenderer: React.FC<EditorRendererProps> = ({ blocks }) => {
//   return (
//     <div className="prose prose-lg max-w-none">
//       {blocks.map((block) => {
//         const { id, type, data } = block;

//         switch (type) {
//           /** ================= HEADERS ================= */
//           case "header": {
//             const HeaderTag = `h${data.level}` as keyof JSX.IntrinsicElements;

//             const headerClasses: Record<number, string> = {
//               1: "text-4xl font-bold mt-6 mb-4",
//               2: "text-3xl font-semibold mt-5 mb-3",
//               3: "text-2xl font-semibold mt-4 mb-2",
//               4: "text-xl font-medium mt-3 mb-2",
//               5: "text-lg font-medium mt-2 mb-1",
//               6: "text-base font-medium mt-2 mb-1",
//             };

//             return (
//               <HeaderTag
//                 key={id}
//                 className={headerClasses[data.level] || "text-xl font-bold my-2"}
//                 dangerouslySetInnerHTML={{ __html: data.text }}
//               />
//             );
//           }

//           /** ================= PARAGRAPHS ================= */
//           case "paragraph":
//             return (
//               <p
//                 key={id}
//                 className="leading-relaxed text-gray-800"
//                 dangerouslySetInnerHTML={{ __html: data.text }}
//               />
//             );

//           /** ================= CODE BLOCK ================= */
//           case "code":
//             return (
//               <pre
//                 key={id}
//                 className="bg-gray-900 text-gray-100 text-sm rounded-lg p-4 overflow-x-auto"
//               >
//                 <code>{data.code}</code>
//               </pre>
//             );

//           /** ================= CHECKLIST ================= */
//           case "checklist":
//             return (
//               <ul key={id} className="space-y-2">
//                 {data.items.map((item: any, i: number) => (
//                   <li key={i} className="flex items-center gap-2">
//                     <input
//                       type="checkbox"
//                       checked={item.checked}
//                       readOnly
//                       className="h-4 w-4 accent-blue-600"
//                     />
//                     <span
//                       className={item.checked ? "line-through text-gray-500" : ""}
//                       dangerouslySetInnerHTML={{ __html: item.text }}
//                     />
//                   </li>
//                 ))}
//               </ul>
//             );

//           /** ================= LISTS ================= */
//           case "list":
//             return data.style === "ordered" ? (
//               <ol key={id} className="list-decimal list-inside space-y-1">
//                 {data.items.map((item: string, i: number) => (
//                   <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
//                 ))}
//               </ol>
//             ) : (
//               <ul key={id} className="list-disc list-inside space-y-1">
//                 {data.items.map((item: string, i: number) => (
//                   <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
//                 ))}
//               </ul>
//             );

//           /** ================= IMAGE ================= */
//           case "image":
//             return (
//               <figure key={id} className="my-6">
//                 <img
//                   src={data.file?.url}
//                   alt={data.caption || "Image"}
//                   className="mx-auto rounded-lg shadow-md max-h-[500px] object-contain"
//                 />
//                 {data.caption && (
//                   <figcaption className="text-sm text-center text-gray-500 mt-2">
//                     {data.caption}
//                   </figcaption>
//                 )}
//               </figure>
//             );

//           /** ================= QUOTE ================= */
//           case "quote":
//             return (
//               <blockquote
//                 key={id}
//                 className="border-l-4 border-blue-500 pl-4 italic text-gray-700 my-4"
//               >
//                 <p dangerouslySetInnerHTML={{ __html: data.text }} />
//                 {data.caption && (
//                   <footer className="text-sm text-gray-500 mt-2">
//                     — {data.caption}
//                   </footer>
//                 )}
//               </blockquote>
//             );

//           /** ================= DELIMITER ================= */
//           case "delimiter":
//             return (
//               <div key={id} className="flex justify-center my-6">
//                 <span className="text-2xl text-gray-400">***</span>
//               </div>
//             );

//           /** ================= EMBED ================= */
//           case "embed":
//             return (
//               <div key={id} className="my-4 aspect-video">
//                 <iframe
//                   className="w-full h-full rounded-lg shadow"
//                   src={data.embed}
//                   title={data.caption || "Embedded content"}
//                   allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
//                   allowFullScreen
//                 />
//                 {data.caption && (
//                   <p className="text-sm text-gray-500 mt-2 text-center">
//                     {data.caption}
//                   </p>
//                 )}
//               </div>
//             );

//           /** ================= UNSUPPORTED ================= */
//           default:
//             return (
//               <div key={id} className="text-red-500">
//                 Unsupported block type: <strong>{type}</strong>
//               </div>
//             );
//         }
//       })}
//     </div>
//   );
// };


import React from "react";

type EditorBlock = {
  id: string;
  type: string;
  data: any;
};

interface EditorRendererProps {
  blocks: EditorBlock[];
}

export const EditorRenderer: React.FC<EditorRendererProps> = ({ blocks }) => {
  return (
    <div className="prose prose-lg max-w-none">
      {blocks.map((block) => {
        const { id, type, data } = block;

        switch (type) {
          /** ================= HEADERS ================= */
          case "header": {
            const HeaderTag = `h${data.level}` as keyof JSX.IntrinsicElements;

            const headerClasses: Record<number, string> = {
              1: "text-4xl font-bold mt-6 mb-4",
              2: "text-3xl font-semibold mt-5 mb-3",
              3: "text-2xl font-semibold mt-4 mb-2",
              4: "text-xl font-medium mt-3 mb-2",
              5: "text-lg font-medium mt-2 mb-1",
              6: "text-base font-medium mt-2 mb-1",
            };

            return (
              <HeaderTag
                key={id}
                className={headerClasses[data.level] || "text-xl font-bold my-2"}
                dangerouslySetInnerHTML={{ __html: data.text }}
              />
            );
          }

          /** ================= PARAGRAPHS ================= */
          case "paragraph":
            return (
              <p
                key={id}
                className="leading-relaxed text-gray-800"
                dangerouslySetInnerHTML={{ __html: data.text }}
              />
            );

          /** ================= CODE BLOCK ================= */
          case "code":
            return (
              <pre
                key={id}
                className="bg-gray-900 text-gray-100 text-sm rounded-lg p-4 overflow-x-auto"
              >
                <code>{data.code}</code>
              </pre>
            );

          /** ================= CHECKLIST ================= */
          case "checklist":
            return (
              <ul key={id} className="space-y-2">
                {data.items.map((item: any, i: number) => (
                  <li key={i} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      readOnly
                      className="h-4 w-4 accent-blue-600"
                    />
                    <span
                      className={item.checked ? "line-through text-gray-500" : ""}
                      dangerouslySetInnerHTML={{ __html: item.text }}
                    />
                  </li>
                ))}
              </ul>
            );

          /** ================= LISTS ================= */
          case "list":
            return data.style === "ordered" ? (
              <ol key={id} className="list-decimal list-inside space-y-1">
                {data.items.map((item: string, i: number) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ol>
            ) : (
              <ul key={id} className="list-disc list-inside space-y-1">
                {data.items.map((item: string, i: number) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ul>
            );

          /** ================= IMAGE ================= */
          case "image":
            return (
              <figure key={id} className="my-6">
                <img
                  src={data.file?.url}
                  alt={data.caption || "Image"}
                  className="mx-auto rounded-lg shadow-md max-h-[500px] object-contain"
                />
                {data.caption && (
                  <figcaption className="text-sm text-center text-gray-500 mt-2">
                    {data.caption}
                  </figcaption>
                )}
              </figure>
            );

          /** ================= QUOTE ================= */
          case "quote":
            return (
              <blockquote
                key={id}
                className="border-l-4 border-blue-500 pl-4 italic text-gray-700 my-4"
              >
                <p dangerouslySetInnerHTML={{ __html: data.text }} />
                {data.caption && (
                  <footer className="text-sm text-gray-500 mt-2">
                    — {data.caption}
                  </footer>
                )}
              </blockquote>
            );

          /** ================= DELIMITER ================= */
          case "delimiter":
            return (
              <div key={id} className="flex justify-center my-6">
                <span className="text-2xl text-gray-400">***</span>
              </div>
            );

          /** ================= EMBED ================= */
          case "embed":
            return (
              <div key={id} className="my-4 aspect-video">
                <iframe
                  className="w-full h-full rounded-lg shadow"
                  src={data.embed}
                  title={data.caption || "Embedded content"}
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                {data.caption && (
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    {data.caption}
                  </p>
                )}
              </div>
            );

          /** ================= TABLE ================= */
          case "table":
            return (
              <div key={id} className="overflow-x-auto my-6">
                <table className="table-auto border-collapse border border-gray-300 w-full text-sm">
                  <tbody>
                    {data.content.map((row: string[], rowIndex: number) => (
                      <tr key={rowIndex}>
                        {row.map((cell: string, cellIndex: number) => (
                          <td
                            key={cellIndex}
                            className="border border-gray-300 px-3 py-2"
                            dangerouslySetInnerHTML={{ __html: cell }}
                          />
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          /** ================= UNSUPPORTED ================= */
          default:
            return (
              <div key={id} className="text-red-500">
                Unsupported block type: <strong>{type}</strong>
              </div>
            );
        }
      })}
    </div>
  );
};
