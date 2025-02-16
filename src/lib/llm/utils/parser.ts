import {marked} from 'marked';
import {parse} from 'node-html-parser';

/**
 * @typedef {{
 *   type: string;
 *   filePath?: string;
 *   content: string;
 * }} JitAction
 *
 * @typedef {{
 *   id: string;
 *   title: string;
 *   actions: JitAction[];
 * }} JitArtifact
 */

/**
 * Парсим строку с Markdown, ищем теги <jitArtifact> и <jitAction>.
 * @param {string} markdownString
 * @returns {JitArtifact[]}
 */
export function parseArtifacts(markdownString: any) {
  // 1. Markdown -> HTML через marked
  const html: any = marked.parse(markdownString);
  // console.log(html);

  // 2. Разбираем HTML в дерево
  const root = parse(html, {
    // lowerCaseTagName: false,
    // parseNoneClosedTags: true,
  });
  // console.log(root);

  // 3. Ищем все узлы <jitArtifact>
  const artifactNodes = root.querySelectorAll('jitproject');
  // console.log(artifactNodes);

  // 4. Пробегаемся по каждому artifact, извлекаем атрибуты + детей <jitAction>
  const artifacts = artifactNodes.map((artifactNode) => {
    const attrs = artifactNode.attributes
    // const artifactId = artifactNode.getAttribute('id') || '';
    // const artifactTitle = artifactNode.getAttribute('title') || '';

    const actionNodes = artifactNode.querySelectorAll('jitfile');
    const files = actionNodes.map((actionNode) => {
      const attrs = actionNode.attributes
      // const type = actionNode.getAttribute('type') || '';
      // const filePath = actionNode.getAttribute('filePath') || undefined;

      // Можно взять `innerHTML` или `textContent`:
      // - `innerHTML` сохранит внутреннюю разметку (если она есть),
      // - `textContent` — только чистый текст.
      const content = actionNode.innerHTML.trim();

      return { attrs, content };
    });

    return {
      attrs,
      files,
    };
  });

  return artifacts;
}

// -------------------
// Пример использования
// -------------------
async function main() {
  const markdown = `
Some random Markdown text…

<jitArtifact id="hello-world" title="Hello World HTML, CSS, and JavaScript">
  <jitAction type="file" filePath="package.json">
    {
      "name": "hello-world",
      "private": true,
      "version": "0.0.0",
      "scripts": {
        "dev": "vite"
      }
    }
  </jitAction>

  <jitAction type="shell">
    npm install --save-dev vite
  </jitAction>

  <jitAction type="file" filePath="index.html">
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Hello World</title>
      <link rel="stylesheet" href="style.css">
    </head>
    <body>
      <h1 id="greeting">Hello, World!</h1>
      <script src="script.js"></script>
    </body>
    </html>
  </jitAction>
</jitArtifact>

More Markdown, maybe?
`;

  const artifacts = parseArtifacts(markdown);
  console.log(JSON.stringify(artifacts, null, 2));
}

// main();





// // ts-nocheck
// import {unified} from 'unified';
// import remarkParse from 'remark-parse';
// import remarkGfm from 'remark-gfm';
// import remarkRehype from 'remark-rehype';
// import rehypeRaw from 'rehype-raw';
// import {visit} from 'unist-util-visit';
//
// // ------------------------------
// // Типы, чтобы было понятнее
// // ------------------------------
// /**
//  * @typedef {{
//  *   type: string,
//  *   filePath?: string,
//  *   content: string
//  * }} JitAction
//  *
//  * @typedef {{
//  *   id: string,
//  *   title: string,
//  *   actions: JitAction[]
//  * }} JitArtifact
//  */
//
// // ------------------------------
// // Плагин для извлечения <jitArtifact> / <jitAction>
// // ------------------------------
// /**
//  * Плагин, который обходит HAST-дерево (HTML-аст), ищет <jitArtifact> и <jitAction>.
//  * В результате в `file.data` будет сохранять массив `file.data.jitArtifacts`.
//  */
// function parseJitArtifactsPlugin() {
//   return (tree: any, file: any) => {
//     /** @type {JitArtifact[]} */
//     const artifacts: any = [];
//
//     // Обходим дерево HAST:
//     visit(tree, (node) => {
//       // Ищем тег <jitArtifact ...>
//       if (node.type === 'element' && node.tagName === 'jitArtifact') {
//         const props = node.properties || {};
//         const artifact: any = {
//           id: String(props.id ?? ''),
//           title: String(props.title ?? ''),
//           actions: [],
//         };
//
//         // Ищем все <jitAction> внутри данного <jitArtifact>
//         for (const child of node.children || []) {
//           if (child.type === 'element' && child.tagName === 'jitAction') {
//             const actionProps = child.properties || {};
//             const action: any = {
//               type: String(actionProps.type ?? ''),
//               filePath: actionProps.filePath ? String(actionProps.filePath) : undefined,
//               // Собираем весь текстовый контент внутри <jitAction> (упрощённо)
//               // Если нужно включать вложенные теги, можно использовать hast-util-to-html
//               content: collectText(child),
//             };
//             artifact.actions.push(action);
//           }
//         }
//
//         artifacts.push(artifact);
//       }
//     });
//
//     // Сохраняем результат в file.data
//     file.data.jitArtifacts = artifacts;
//   };
// }
//
// /**
//  * Вспомогательная функция, чтобы собрать текстовый контент из узла HAST.
//  * Делается рекурсивный обход дочерних текстовых узлов.
//  * (Если нужно сохранять HTML-разметку, используйте, например, hast-util-to-html).
//  * @param {any} node
//  * @return {string}
//  */
// function collectText(node: any) {
//   if (!node || typeof node !== 'object') return '';
//   if (node.type === 'text') {
//     return node.value;
//   }
//   if (Array.isArray(node.children)) {
//     return node.children.map(collectText).join('');
//   }
//   return '';
// }
//
// // ------------------------------
// // Пример использования
// // ------------------------------
// async function main() {
//   const data = {
//     type: 'text',
//     text: `
// Some random Markdown text…
//
// <jitArtifact id="hello-world" title="Hello World HTML, CSS, and JavaScript">
//   <jitAction type="file" filePath="package.json">
//     {
//       "name": "hello-world",
//       "private": true,
//       "version": "0.0.0",
//       "scripts": {
//         "dev": "vite"
//       }
//     }
//   </jitAction>
//
//   <jitAction type="shell">
//     npm install --save-dev vite
//   </jitAction>
//
//   <jitAction type="file" filePath="index.html">
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>Hello World</title>
//       <link rel="stylesheet" href="style.css">
//     </head>
//     <body>
//       <h1 id="greeting">Hello, World!</h1>
//       <script src="script.js"></script>
//     </body>
//     </html>
//   </jitAction>
// </jitArtifact>
//
// More Markdown, maybe?
// `
//   };
//
//   // Строим конвейер:
//   // 1) remarkParse/remarkGfm -> парсим как MD
//   // 2) remarkRehype -> переводим MDAST -> HAST
//   // 3) rehypeRaw -> разбираем встроенный HTML
//   // 4) parseJitArtifactsPlugin -> ищем наши custom-теги и складываем в file.data
//   const file = await unified()
//     .use(remarkParse)
//     .use(remarkGfm)
//     .use(remarkRehype, { allowDangerousHtml: true })
//     .use(rehypeRaw) // Нужно, чтобы встроенный HTML обрабатывался как HAST
//     .use(parseJitArtifactsPlugin)
//     .process(data.text);
//
//   // Извлекаем наш массив артефактов
//   const artifacts = file.data.jitArtifacts;
//
//   console.log('Parsed artifacts:', JSON.stringify(artifacts, null, 2));
// }
//
// // Запуск
// main().catch(console.error);
