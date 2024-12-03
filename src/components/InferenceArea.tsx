import { useEffect } from 'react';
import { getKB } from '../utils/KB';
import { useDispatch, useSelector } from "react-redux";
import Fact from '../types/Fact';
import { setError, setFacts, setInferredFacts } from '../store/factsSlice';
import { RootState } from '../store/store';
import Rule from '../types/Rule';

interface InferenceAreaProps {
  selectedKB: string;
}

export default function InferenceArea({ selectedKB }: InferenceAreaProps) {
  const dispatch = useDispatch();
  const facts = useSelector((state: RootState) => state.facts.facts);
  const inferredFacts = useSelector((state: RootState) => state.facts.inferredFacts);  // Obtener los hechos inferidos
  const errorMessage = useSelector((state: RootState) => state.facts.error);  // Obtener mensaje de error


  useEffect(() => {
    if (selectedKB) {
      const kb = getKB(selectedKB);
      dispatch(setFacts(kb?.Facts || []));  // Cargar hechos existentes
    }
  }, [selectedKB, dispatch]);

  // Inferir hechos a partir de las reglas
  const inferFacts = () => {
    if (!selectedKB) {
      dispatch(setError("No se ha seleccionado ninguna base de conocimiento."));
      return;
    }

    const kb = getKB(selectedKB);
    if (!kb?.Rules || !kb?.Facts) {
      dispatch(setError("No se han encontrado reglas o hechos en la base de conocimiento."));
      return;
    }

    let newFacts = [...facts];
    const newInferredFacts: Fact[] = [];
    let activeRules = [...kb.Rules];  // Creamos una copia de las reglas

    let factsChanged = true;  // Bandera para indicar si hubo nuevos hechos inferidos

    while (factsChanged) {
      factsChanged = false;

      // Iterar sobre las reglas y verificar si se cumplen
      activeRules.forEach((rule: Rule) => {
        const antecedentsValid = rule.antecedents.every((antecedent) =>
          newFacts.some((fact) => fact.key === antecedent.key && fact.value === antecedent.value)
        );

        // Si los antecedentes se cumplen, agregar la conclusión como un hecho
        if (antecedentsValid) {
          const conclusion: Fact = rule.conclusion;
          if (!newFacts.some((fact) => fact.key === conclusion.key && fact.value === conclusion.value)) {
            newFacts = [...newFacts, conclusion];
            newInferredFacts.push(conclusion);
            factsChanged = true;  // Hubo un cambio, así que repetimos el ciclo
          }
        }
      });

      // Filtrar las reglas que ya fueron procesadas
      activeRules = activeRules.filter((rule: Rule) => {
        const antecedentsValid = rule.antecedents.every((antecedent) =>
          newFacts.some((fact) => fact.key === antecedent.key && fact.value === antecedent.value)
        );
        return !antecedentsValid;  // Si los antecedentes no se cumplen, mantén la regla
      });
    }

      // Si hay nuevos hechos, agregarlos a la lista de hechos inferidos
      if (newInferredFacts.length > 0) {
        dispatch(setInferredFacts(newInferredFacts));  // Actualizar los hechos inferidos en Redux

        // Guardar los nuevos hechos inferidos en la base de conocimiento
        const updatedFacts = [...facts, ...newInferredFacts];
        const updatedKB = { ...kb, Facts: updatedFacts };
        localStorage.setItem(selectedKB, JSON.stringify(updatedKB));

        // Actualizar los hechos actuales en Redux
        dispatch(setFacts(updatedFacts));
      } else {
        dispatch(setError("No se pudo inferir nuevos hechos."));
      }

    //   iteration++;
    // } while (factsToAdd.length > 0 && iteration < 10); // Limitamos las iteraciones para evitar un ciclo infinito
  };

  return (
    <section className="inference">
      <h2>Inferencia:</h2>

      <button onClick={inferFacts}>Inferir Conclusiones</button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      <h3>Hechos actuales:</h3>
      <ul>
        {facts.map((fact: Fact, index: number) => (
          <li key={index}>
            {fact.key}: {fact.value}
          </li>
        ))}
      </ul>

      <h3>Conclusiones inferidas:</h3>
      <ul>
        {inferredFacts.map((fact: Fact, index: number) => (
          <li key={index}>
            {fact.key}: {fact.value}
          </li>
        ))}
      </ul>
    </section>
  );
}
