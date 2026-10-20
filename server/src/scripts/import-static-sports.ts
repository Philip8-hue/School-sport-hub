import { readFile } from "node:fs/promises";
import vm from "node:vm";
import path from "node:path";
import { prisma } from "../lib/prisma.js";

type StaticPlayer = Record<string, unknown>;
const root = path.resolve(process.cwd(), "aul sports");
const sourceFiles = ["aupl.js", "volleyball.js"];
const sportByArray: Record<string, string> = {
  players: "Male Football",
  maleBasketballPlayers: "Male Basketball",
  femaleBasketballPlayers: "Female Basketball",
  femaleFootballPlayers: "Female Football",
  volleyballPlayers: "Volleyball",
};

function extractArrays(source: string): Array<{ name: string; values: StaticPlayer[] }> {
  const output: Array<{ name: string; values: StaticPlayer[] }> = [];
  const expression = /const\s+(\w+)\s*=\s*\[/g;
  let match: RegExpExecArray | null;
  while ((match = expression.exec(source))) {
    if (!sportByArray[match[1]]) continue;
    const start = match.index + match[0].lastIndexOf("[");
    let depth = 0;
    let quote = "";
    let escaped = false;
    let end = -1;
    for (let index = start; index < source.length; index += 1) {
      const character = source[index];
      if (quote) {
        if (escaped) escaped = false;
        else if (character === "\\") escaped = true;
        else if (character === quote) quote = "";
        continue;
      }
      if (character === '"' || character === "'") { quote = character; continue; }
      if (character === "[") depth += 1;
      if (character === "]") { depth -= 1; if (depth === 0) { end = index + 1; break; } }
    }
    if (end < 0) continue;
    const values = vm.runInNewContext(`(${source.slice(start, end)})`) as StaticPlayer[];
    output.push({ name: match[1], values });
  }
  return output;
}

function slugify(value: string): string { return value.toLowerCase().replace(/&copy;/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
function asString(value: unknown): string | null { return typeof value === "string" && value.trim() ? value.trim() : null; }
function asNumber(value: unknown): number | null { return typeof value === "number" && Number.isFinite(value) ? value : null; }

const imported: string[] = [];
for (const file of sourceFiles) {
  const source = await readFile(path.join(root, file), "utf8");
  for (const group of extractArrays(source)) {
    const sport = sportByArray[group.name];
    for (const item of group.values) {
      const name = asString(item.name);
      if (!name) continue;
      const clubName = asString(item.club);
      let clubId: number | null = null;
      if (clubName) {
        const slug = `${slugify(clubName)}-${slugify(sport)}`;
        const club = await prisma.club.upsert({ where: { slug }, update: {}, create: { name: clubName.replace(/&copy;/g, ""), slug, sport } });
        clubId = club.id;
      }
      const data = {
        name: name.replace(/&copy;/g, ""), fullName: asString(item.fullName), sport,
        position: asString(item.position), jerseyNumber: asNumber(item.number), photoUrl: asString(item.photo),
        price: asNumber(item.price), rating: asNumber(item.rating), matches: asNumber(item.matches) ?? 0,
        minutes: asNumber(item.minutes) ?? 0, goals: asNumber(item.goals) ?? 0, assists: asNumber(item.assists) ?? 0,
        aces: asNumber(item.aces) ?? 0, blocks: asNumber(item.blocks) ?? 0, captain: item.captain === true, clubId,
      };
      const existing = await prisma.player.findFirst({ where: { name: data.name, sport, clubId } });
      if (existing) await prisma.player.update({ where: { id: existing.id }, data });
      else await prisma.player.create({ data });
      imported.push(`${sport}: ${data.name}`);
    }
  }
}
console.log(`Imported or updated ${imported.length} static players and their clubs.`);
await prisma.$disconnect();
