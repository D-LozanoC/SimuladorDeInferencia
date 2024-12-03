import { useState, useEffect } from 'react';
import { getKB } from '../utils/KB';
import Rule from '../types/Rule';
import Fact from '../types/Fact';

interface RulesAreaProps {
  selectedKB: string;
}

export default function RulesArea({ selectedKB }: RulesAreaProps) {
  const [rules, setRules] = useState<Rule[]>([]);
  const [newAntecedentKey, setNewAntecedentKey] = useState<string>("");  // Hecho clave
  const [newAntecedentValue, setNewAntecedentValue] = useState<string>("");  // Hecho valor
  const [newConclusionKey, setNewConclusionKey] = useState<string>("");  // Conclusión clave
  const [newConclusionValue, setNewConclusionValue] = useState<string>("");  // Conclusión valor
  const [errorMessage, setErrorMessage] = useState<string>("");  // Mensaje de error
  const [currentAntecedents, setCurrentAntecedents] = useState<Fact[]>([]);  // Antecedentes temporales

  useEffect(() => {
    if (selectedKB) {
      const data = getKB(selectedKB);
      setRules(data?.Rules || []);  // Cargar reglas existentes
    }
  }, [selectedKB]);

  // Validación para que los antecedentes no sean iguales a la conclusión
  const isAntecedentValid = (antecedent: Fact) => {
    return !(antecedent.key === newConclusionKey);
  };

  // Añadir antecedente
  const addAntecedent = () => {
    if (newAntecedentKey === "" || newAntecedentValue === "") {
      setErrorMessage("El antecedente debe tener clave y valor.");
      return;
    }

    if (newAntecedentKey === newAntecedentValue) {
      setErrorMessage("Es atributo o es valor");
      return;
    }

    const newFact: Fact = { key: newAntecedentKey, value: newAntecedentValue };

    // Validar que el antecedente no sea igual a la conclusión
    if (!isAntecedentValid(newFact)) {
      setErrorMessage("El antecedente no puede ser igual a la conclusión.");
      return;
    }

    // Añadir el antecedente a los antecedentes temporales
    setCurrentAntecedents([...currentAntecedents, newFact]);

    // Limpiar los campos de antecedente
    setNewAntecedentKey("");
    setNewAntecedentValue("");
    setErrorMessage(""); // Limpiar el mensaje de error
  };

  // Eliminar antecedente
  const removeAntecedent = (factToRemove: Fact) => {
    setCurrentAntecedents(currentAntecedents.filter((fact) => fact !== factToRemove));
  };

  // Añadir la regla
  const addRule = () => {
    // Validar que la conclusión y los antecedentes no sean vacíos
    if (!newConclusionKey || !newConclusionValue) {
      setErrorMessage("La conclusión debe tener una clave y un valor.");
      return;
    }

    if (!currentAntecedents.length) {
      setErrorMessage("La regla debe tener al menos un antecedente.");
      return;
    }

    // Validar que la conclusión no sea igual a los antecedentes
    if (!currentAntecedents.every(isAntecedentValid)) {
      setErrorMessage("La conclusión no puede ser igual a algún antecedente.");
      return;
    }

    const newFact: Fact = { key: newConclusionKey, value: newConclusionValue };

    // Crear una nueva regla con los antecedentes actuales
    const updatedRule: Rule = {
      antecedents: currentAntecedents,
      conclusion: newFact,
    };

    // Añadir la nueva regla a la lista de reglas
    const updatedRules = [...rules, updatedRule];
    setRules(updatedRules);
    updateKB(updatedRules);

    // Limpiar los campos después de añadir la regla
    setNewAntecedentKey("");
    setNewAntecedentValue("");
    setNewConclusionKey("");
    setNewConclusionValue("");
    setCurrentAntecedents([]);
    setErrorMessage(""); // Limpiar el mensaje de error
  };

  // Eliminar una regla
  const removeRule = (ruleToRemove: Rule) => {
    const updatedRules = rules.filter((rule) => rule !== ruleToRemove);
    setRules(updatedRules);
    updateKB(updatedRules);
  };

  // Actualizar la base de conocimiento
  const updateKB = (updatedRules: Rule[]) => {
    const kb = getKB(selectedKB);
    if (kb) {
      kb.Rules = updatedRules;
      localStorage.setItem(selectedKB, JSON.stringify(kb));
    }
  };

  return (
    <section className="rules">
      <h2>Reglas:</h2>

      <input
        type="text"
        placeholder="Clave del antecedente"
        value={newAntecedentKey}
        onChange={(e) => setNewAntecedentKey(e.target.value)}
      />

      <input
        type="text"
        placeholder="Valor de la condición"
        value={newAntecedentValue}
        onChange={(e) => setNewAntecedentValue(e.target.value)}
      />

      <button onClick={addAntecedent}>Añadir Antecedente</button>

      <h3>Conclusión:</h3>
      <input
        type="text"
        placeholder="Clave de la conclusión"
        value={newConclusionKey}
        onChange={(e) => setNewConclusionKey(e.target.value)}
      />

      <input
        type="text"
        placeholder="Valor de la conclusión"
        value={newConclusionValue}
        onChange={(e) => setNewConclusionValue(e.target.value)}
      />

      <button onClick={addRule}>Añadir Regla</button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      <h3>Antecedentes de la regla:</h3>
      {currentAntecedents.length > 0 ? (
        <ul>
          {currentAntecedents.map((fact, index) => (
            <li key={index}>
              {fact.key}: {fact.value} 
              <button onClick={() => removeAntecedent(fact)}>Eliminar</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay antecedentes para esta regla.</p>
      )}

      <h3>Reglas:</h3>
      <ul>
        {rules.map((rule, index) => (
          <li key={index}>
            Si {rule.antecedents.map((fact) => `${fact.key}: ${fact.value}`).join(", ")} entonces {rule.conclusion.key}: {rule.conclusion.value}
            <button onClick={() => removeRule(rule)}>Eliminar Regla</button>
          </li>
        ))}
      </ul>
    </section>
  );
}
