import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const csvPath = path.join(__dirname, "resultados.csv");

const raw = fs.readFileSync(csvPath, "utf-8").trim();
const [headerLine, ...rows] = raw.split(/\r?\n/);
const headers = headerLine.split(",");

const registros = rows
  .map((line) => {
    const cols = line.split(",");
    const obj = {};
    headers.forEach((h, i) => {
      obj[h.trim()] = (cols[i] || "").trim();
    });
    return obj;
  })
  .filter((r) => r.tipo === "usuario_real" && r.exito);

const prom = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);
const total = registros.length;
const exitos = registros.filter((r) => r.exito.toLowerCase() === "si").length;

console.log("=== MÉTRICAS CONSOLIDADAS (evaluacion/resultados.csv) ===");
console.log(`Registros reales (P01 y P02): ${total} tareas`);
console.log(`Tasa de éxito global: ${((exitos / total) * 100).toFixed(1)}% (${exitos}/${total})`);
console.log(`SEQ promedio global: ${prom(registros.map((r) => Number(r.seq_1_a_5))).toFixed(2)} / 5`);

for (const tarea of ["T1", "T2", "T3"]) {
  const sub = registros.filter((r) => r.tarea === tarea);
  const tProm = prom(sub.map((r) => Number(r.tiempo_seg)));
  const ex = sub.filter((r) => r.exito.toLowerCase() === "si").length;
  console.log(`- ${tarea}: éxito ${((ex / sub.length) * 100).toFixed(0)}% (${ex}/${sub.length}) | tiempo promedio = ${tProm.toFixed(1)} s`);
}
