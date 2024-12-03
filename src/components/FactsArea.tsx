import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFacts, addFact, removeFact, setError } from "../store/factsSlice";
import { getKB, updateKB } from "../utils/KB";
import Fact from "../types/Fact";
import { RootState } from "../store/store";

interface FactsAreaProps {
  selectedKB: string;
}

export default function FactsArea({ selectedKB }: FactsAreaProps) {
  const dispatch = useDispatch();
  const facts = useSelector((state: RootState) => state.facts.facts);
  const [newFactKey, setNewFactKey] = useState("");
  const [newFactValue, setNewFactValue] = useState("");
  const error = useSelector((state: RootState) => state.facts.error);

  // Cargar los hechos de la base de conocimiento seleccionada
  useEffect(() => {
    if (selectedKB) {
      const data = getKB(selectedKB);
      if (data) {
        dispatch(setFacts(data.Facts || [])); // Actualizamos los hechos en el store
      }
    }
  }, [selectedKB, dispatch]);

  // Agregar un nuevo hecho
  const handleAddFact = useCallback(() => {
    if (!newFactKey.trim() || !newFactValue.trim()) {
      dispatch(setError("Ambos campos son obligatorios."));
      return;
    }

    // Validación de claves duplicadas
    if (facts.some((fact: { key: string; }) => fact.key === newFactKey)) {
      dispatch(setError("La clave ya existe."));
      return;
    }

    const newFact: Fact = { key: newFactKey, value: newFactValue };
    dispatch(addFact(newFact)); // Agregar el hecho al estado global
    updateKB(selectedKB, [...facts, newFact]); // Actualizar el almacenamiento local
    setNewFactKey("");
    setNewFactValue("");
    dispatch(setError(null)); // Limpiar errores después de una acción exitosa
  }, [newFactKey, newFactValue, facts, selectedKB, dispatch]);

  // Eliminar un hecho
  const handleDeleteFact = useCallback((factKey: string) => {
    dispatch(removeFact(factKey)); // Eliminar el hecho del estado global
    updateKB(selectedKB, facts.filter((fact: { key: string; }) => fact.key !== factKey)); // Actualizar el almacenamiento local
  }, [facts, selectedKB, dispatch]);

  return (
    <section className="facts">
      <h2>Hechos:</h2>
      {error && <p className="error">{error}</p>} {/* Mostrar errores */}
      
      <div>
        <input
          type="text"
          placeholder="Clave"
          value={newFactKey}
          onChange={(e) => setNewFactKey(e.target.value)}
        />
        <input
          type="text"
          placeholder="Valor"
          value={newFactValue}
          onChange={(e) => setNewFactValue(e.target.value)}
        />
        <button onClick={handleAddFact}>Agregar</button>
      </div>

      <ul>
        {facts.map((fact, index) => (
          <li key={index}>
            {fact.key}: {fact.value}
            <button onClick={() => handleDeleteFact(fact.key)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </section>
  );
}
