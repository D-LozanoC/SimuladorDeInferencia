import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import FactsArea from './FactsArea';
import InferenceArea from './InferenceArea';
import RulesArea from './RulesArea';
import { createBK, populateSelectWithLocalStorage, deleteKB } from '../utils/KB';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [selectedKB, setSelectedKB] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Llenar el selector con los datos de localStorage al cargar la aplicación
  useEffect(() => {
    populateSelectWithLocalStorage();
  }, []);

  // Manejo de creación de la base de conocimiento
  const handleCreateKB = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validar si la base de conocimiento ya existe
    if (inputValue.trim() === '') {
      setErrorMessage('El nombre de la base de conocimiento es obligatorio.');
      return;
    }

    const kbExists = localStorage.getItem(inputValue);
    if (kbExists) {
      setErrorMessage('Ya existe una base de conocimiento con ese nombre.');
      return;
    }

    setErrorMessage(''); // Limpiar errores previos
    createBK(inputValue); // Crear nueva base de conocimiento
    alert('Base de conocimiento creada con éxito');
    setInputValue('');
    populateSelectWithLocalStorage(); // Actualiza el select con la nueva base
  };

  // Manejo de cambio de base de conocimiento seleccionada
  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedKB(e.target.value);
  };

  // Manejo de borrado de base de conocimiento
  const handleDeleteKB = () => {
    if (!selectedKB) {
      alert('Por favor, selecciona una base de conocimientos para eliminar.');
      return;
    }

    const confirmDelete = window.confirm(`¿Estás seguro de que deseas eliminar la base de conocimiento "${selectedKB}"?`);
    if (confirmDelete) {
      deleteKB(selectedKB); // Eliminar la base de conocimiento
      alert('Base de conocimiento eliminada con éxito');
      setSelectedKB(''); // Limpiar selección
      populateSelectWithLocalStorage(); // Actualizar el select después de eliminarla
    }
  };

  return (
    <main>
      <header>
        <h1>Simulador de Inferencia hacia Adelante</h1>
      </header>

      {/* Formulario para crear nuevas bases de conocimiento */}
      <section className="create-kb">
        <h2>Crea una Base de Conocimiento</h2>
        <form onSubmit={handleCreateKB}>
          <label htmlFor="BK">Nombre:</label>
          <input
            id="BK"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            aria-describedby="error-message"
            required
          />
          <button type="submit">Crear</button>
          {errorMessage && <p id="error-message" style={{ color: 'red' }}>{errorMessage}</p>}
        </form>
      </section>

      {/* Selector de base de conocimiento */}
      <section className="kb-selector">
        <h2>Selecciona una base de conocimientos</h2>
        <label htmlFor="knowledgeBaseSelect">Nombre de la base de conocimientos:</label>
        <select
          id="knowledgeBaseSelect"
          value={selectedKB}
          onChange={handleSelectChange}
          aria-live="polite"
        >
          <option value="">Selecciona una base de conocimientos</option>
          {/* Las opciones se llenan desde localStorage */}
        </select>
        {/* Botón para borrar base de conocimiento debajo del selector */}
        <section className="delete-kb">
          <button onClick={handleDeleteKB} disabled={!selectedKB}>Eliminar Base de Conocimiento</button>
        </section>
      </section>


      {/* Secciones de gestión de hechos, reglas e inferencias */}
      {selectedKB ? (
        <>
          <FactsArea selectedKB={selectedKB} />
          <RulesArea selectedKB={selectedKB} />
          <InferenceArea selectedKB={selectedKB} />
        </>
      ) : (
        <p>Por favor, selecciona una base de conocimientos para continuar.</p>
      )}
    </main>
  );
}

export default App;
