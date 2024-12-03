import Fact from "./Fact";

// Rule.ts
export default interface Rule {
    antecedents: Fact[];  // Lista de hechos como claves
    conclusion: Fact;  // Conclusión de la regla
}
