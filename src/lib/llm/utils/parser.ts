import { marked } from 'marked';
import { parse } from 'node-html-parser';
import { decodeHTML, encodeHTML } from 'entities';

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
    const attrs = artifactNode.attributes;
    // const artifactId = artifactNode.getAttribute('id') || '';
    // const artifactTitle = artifactNode.getAttribute('title') || '';

    const actionNodes = artifactNode.querySelectorAll('jitfile');
    const files = actionNodes.map((actionNode) => {
      const attrs = actionNode.attributes;
      // const type = actionNode.getAttribute('type') || '';
      // const filePath = actionNode.getAttribute('filePath') || undefined;

      // Можно взять `innerHTML` или `textContent`:
      // - `innerHTML` сохранит внутреннюю разметку (если она есть),
      // - `textContent` — только чистый текст.
      const content = actionNode.innerHTML.trim();

      // content = content.replaceAll("&gt;", ">").replaceAll("&lt;", "<")

      // console.log("entities.encodeHTML(", decodeHTML(content));
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
