import Fact from "./Fact";
import Rule from "./Rule";

export default interface KnowledgeBase {
    name: string;
    Facts: Fact[];  // Lista vacía por defecto si no se proporciona
    Rules: Rule[];  // Lista vacía por defecto si no se proporciona
}

// O, si se prefiere un constructor:
export const defaultKnowledgeBase: KnowledgeBase = {
    name: '',
    Facts: [],
    Rules: [],
};
