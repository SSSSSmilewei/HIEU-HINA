// VSCode 插件（vscode/，故事 2.3）打包成 .vsix，放到 dist/client/downloads/，平台「我的仓库」页提供下载。
// .vsix 就是一个 zip：extension.vsixmanifest、[Content_Types].xml、extension/ 下的插件文件。
// 不用 vsce（要多装一套依赖），zip 用 Node 自带的 zlib 自己写；时间戳固定，同样的源码打出同样的包。
import { build } from "esbuild";
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { deflateRawSync } from "node:zlib";

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

export function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

// 1980-01-01 00:00（zip 能表示的最早时间），DOS 格式
const DOS_TIME = 0;
const DOS_DATE = (0 << 9) | (1 << 5) | 1;

/** files：[路径, 内容][]，按给的顺序写进 zip */
export function zip(files) {
  const locals = [];
  const centrals = [];
  let offset = 0;
  for (const [name, content] of files) {
    const data = typeof content === "string" ? Buffer.from(content, "utf8") : Buffer.from(content);
    const packed = deflateRawSync(data, { level: 9 });
    const nameBuf = Buffer.from(name, "utf8");
    const crc = crc32(data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4); // 解压需要的版本
    local.writeUInt16LE(0x0800, 6); // 文件名是 UTF-8
    local.writeUInt16LE(8, 8); // deflate
    local.writeUInt16LE(DOS_TIME, 10);
    local.writeUInt16LE(DOS_DATE, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(packed.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    local.writeUInt16LE(0, 28);
    locals.push(local, nameBuf, packed);
    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x0800, 8);
    central.writeUInt16LE(8, 10);
    central.writeUInt16LE(DOS_TIME, 12);
    central.writeUInt16LE(DOS_DATE, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(packed.length, 20);
    central.writeUInt32LE(data.length, 24);
    central.writeUInt16LE(nameBuf.length, 28);
    central.writeUInt32LE(offset, 42);
    centrals.push(central, nameBuf);
    offset += local.length + nameBuf.length + packed.length;
  }
  const dir = Buffer.concat(centrals);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(files.length, 8);
  end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(dir.length, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, dir, end]);
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function manifest(pkg) {
  return `<?xml version="1.0" encoding="utf-8"?>
<PackageManifest Version="2.0.0" xmlns="http://schemas.microsoft.com/developer/vsx-schema/2011" xmlns:d="http://schemas.microsoft.com/developer/vsx-schema-design/2011">
  <Metadata>
    <Identity Language="en-US" Id="${esc(pkg.name)}" Version="${esc(pkg.version)}" Publisher="${esc(pkg.publisher)}" />
    <DisplayName>${esc(pkg.displayName)}</DisplayName>
    <Description xml:space="preserve">${esc(pkg.description)}</Description>
    <Tags></Tags>
    <Categories>${esc(pkg.categories.join(","))}</Categories>
    <GalleryFlags>Public</GalleryFlags>
    <Properties>
      <Property Id="Microsoft.VisualStudio.Code.Engine" Value="${esc(pkg.engines.vscode)}" />
      <Property Id="Microsoft.VisualStudio.Code.ExtensionDependencies" Value="${esc((pkg.extensionDependencies ?? []).join(","))}" />
      <Property Id="Microsoft.VisualStudio.Code.ExtensionPack" Value="" />
      <Property Id="Microsoft.VisualStudio.Code.ExtensionKind" Value="workspace" />
      <Property Id="Microsoft.VisualStudio.Code.LocalizedLanguages" Value="" />
      <Property Id="Microsoft.VisualStudio.Services.GitHubFlavoredMarkdown" Value="true" />
    </Properties>
  </Metadata>
  <Installation>
    <InstallationTarget Id="Microsoft.VisualStudio.Code" />
  </Installation>
  <Dependencies />
  <Assets>
    <Asset Type="Microsoft.VisualStudio.Code.Manifest" Path="extension/package.json" Addressable="true" />
    <Asset Type="Microsoft.VisualStudio.Services.Content.Details" Path="extension/readme.md" Addressable="true" />
  </Assets>
</PackageManifest>
`;
}

const CONTENT_TYPES = `<?xml version="1.0" encoding="utf-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension=".json" ContentType="application/json" /><Default Extension=".js" ContentType="application/javascript" /><Default Extension=".md" ContentType="text/markdown" /><Default Extension=".vsixmanifest" ContentType="text/xml" /><Default Extension=".svg" ContentType="image/svg+xml" /></Types>
`;

/** 打包到 <out>/downloads/hiana-oj.vsix，返回插件版本和包的大小 */
export async function buildVsix(root, out) {
  const dir = join(root, "vscode");
  const pkg = JSON.parse(readFileSync(join(dir, "package.json"), "utf8"));
  const bundled = await build({
    entryPoints: [join(dir, "src/extension.ts")],
    bundle: true,
    write: false,
    format: "cjs",
    platform: "node",
    target: "node18",
    external: ["vscode"],
    minify: true,
    legalComments: "none",
    logLevel: "silent",
  });
  const files = [
    ["[Content_Types].xml", CONTENT_TYPES],
    ["extension.vsixmanifest", manifest(pkg)],
    ["extension/package.json", JSON.stringify(pkg, null, 2)],
    ["extension/readme.md", readFileSync(join(dir, "README.md"), "utf8")],
    ["extension/dist/extension.js", bundled.outputFiles[0].contents],
    // 图标（左侧竖栏的 HIANA）
    ...readdirSync(join(dir, "media"))
      .sort()
      .map((f) => [`extension/media/${f}`, readFileSync(join(dir, "media", f))]),
  ];
  const vsix = zip(files);
  mkdirSync(join(out, "downloads"), { recursive: true });
  writeFileSync(join(out, "downloads", "hiana-oj.vsix"), vsix);
  return { version: pkg.version, bytes: vsix.length };
}
