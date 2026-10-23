const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");

const assets = path.resolve(__dirname, "../assets");
const glyph = ["1111111", "1111111", "1100000", "1100000", "1111110", "1111110", "1100000", "1100000", "1100000"];
const colors = { border: "#63b5ff", base: "#0b1420", shadow: "#285d96", face: "#d2eeff", light: "#ffffff" };
const rect = (x, y, width, height, fill) => ({ x, y, width, height, fill });
const silhouette = fill => [rect(4, 0, 24, 32, fill), rect(2, 2, 28, 28, fill), rect(0, 4, 32, 24, fill)];
const letter = (dx, dy, fill) => glyph.flatMap((row, y) => [...row].flatMap((pixel, x) => pixel === "1" ? [rect(9 + x * 2 + dx, 7 + y * 2 + dy, 2, 2, fill)] : []));
const appShapes = [
  ...silhouette(colors.border),
  rect(4, 2, 24, 28, colors.base), rect(2, 4, 28, 24, colors.base),
  ...letter(2, 2, colors.shadow), ...letter(0, 0, colors.face),
  rect(9, 7, 14, 2, colors.light),
];
const trayShapes = letter(0, 0, "#000000");

function svg(shapes) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">\n${shapes.map(s => `  <rect x="${s.x}" y="${s.y}" width="${s.width}" height="${s.height}" fill="${s.fill}"/>`).join("\n")}\n</svg>\n`;
}

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const name = Buffer.from(type);
  const header = Buffer.alloc(4);
  header.writeUInt32BE(data.length);
  const checksum = Buffer.alloc(4);
  checksum.writeUInt32BE(crc32(Buffer.concat([name, data])));
  return Buffer.concat([header, name, data, checksum]);
}

function png(size, shapes) {
  const pixels = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const gx = (x + 0.5) * 32 / size;
      const gy = (y + 0.5) * 32 / size;
      const shape = shapes.findLast(s => gx >= s.x && gx < s.x + s.width && gy >= s.y && gy < s.y + s.height);
      if (!shape) continue;
      const offset = y * (size * 4 + 1) + 1 + x * 4;
      pixels.set(Buffer.from(shape.fill.slice(1), "hex"), offset);
      pixels[offset + 3] = 255;
    }
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0); header.writeUInt32BE(size, 4);
  header[8] = 8; header[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", header), chunk("IDAT", zlib.deflateSync(pixels)), chunk("IEND", Buffer.alloc(0))]);
}

if (!process.argv.includes("--tray-only")) {
  fs.writeFileSync(path.join(assets, "icon.svg"), svg(appShapes));
  fs.writeFileSync(path.join(assets, "icon.png"), png(1024, appShapes));
  const sizes = [16, 24, 32, 48, 64, 128, 256];
  const images = sizes.map(size => png(size, appShapes));
  const directory = Buffer.alloc(6 + sizes.length * 16);
  directory.writeUInt16LE(1, 2); directory.writeUInt16LE(sizes.length, 4);
  let offset = directory.length;
  sizes.forEach((size, index) => {
    const entry = 6 + index * 16;
    directory[entry] = size % 256; directory[entry + 1] = size % 256;
    directory.writeUInt16LE(1, entry + 4); directory.writeUInt16LE(32, entry + 6);
    directory.writeUInt32LE(images[index].length, entry + 8); directory.writeUInt32LE(offset, entry + 12);
    offset += images[index].length;
  });
  fs.writeFileSync(path.join(assets, "icon.ico"), Buffer.concat([directory, ...images]));
}
fs.writeFileSync(path.join(assets, "tray-mark.svg"), svg(trayShapes));
for (const [size, name] of [[18, "trayTemplate.png"], [36, "trayTemplate@2x.png"]]) {
  fs.writeFileSync(path.join(assets, name), png(size, trayShapes));
}
console.log("Generated pixel F icons without interpolation.");
