import Fact from "../types/Fact"; // Asegúrate de importar Fact
import Rule from "../types/Rule";
import { getKB } from "./KB";

export function forwardChaining(selectedKB: string): Fact[] {
  const kb = getKB(selectedKB);
  if (!kb) return [];

  const { Facts, Rules }: { Facts: Fact[]; Rules: Rule[] } = kb; // Asegúrate de que Facts sea un arreglo de objetos Fact
  const inferredFacts: Fact[] = [...Facts]; // Hacer una copia de los hechos iniciales
  let newFactInferred = false;

  do {
    newFactInferred = false;
    for (const rule of Rules) {
      const allAntecedentsTrue = rule.antecedents.every((ant) => inferredFacts.some(fact => fact.key === ant.key)); // Verifica si todos los antecedentes son verdaderos

      if (allAntecedentsTrue && !inferredFacts.some(fact => fact.key === rule.conclusion.key)) {
        // Agregar el nuevo hecho como un objeto Fact
        inferredFacts.push({ key: rule.conclusion.key, value: rule.conclusion.value }); // Aquí asumimos que el valor es "Inferido", ajústalo según sea necesario
        newFactInferred = true;
      }
    }
  } while (newFactInferred);

  return inferredFacts.filter(fact => !Facts.some(existingFact => existingFact.key === fact.key)); // Solo hechos nuevos
}
