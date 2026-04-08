import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");

export function readJSON<T>(filename: string): T {
  const filePath = path.join(dataDir, `${filename}.json`);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

export function writeJSON<T>(filename: string, data: T): void {
  const filePath = path.join(dataDir, `${filename}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}
