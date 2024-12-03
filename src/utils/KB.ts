import Fact from "../types/Fact";
import KnowledgeBase from "../types/KnowledgeBase";

// Función para sanitizar los nombres de las bases de conocimiento
function sanitizeKBName(name: string): string {
  return encodeURIComponent(name.trim());
}

// utils/createBK.ts

export const createBK = (kbName: string) => {
  const kb = {
    name: kbName,
    Facts: [],
    Rules: [],
  };
  localStorage.setItem(kbName, JSON.stringify(kb));
};

export const populateSelectWithLocalStorage = () => {
  const selectElement = document.getElementById('knowledgeBaseSelect') as HTMLSelectElement;
  selectElement.innerHTML = '<option value="">Selecciona una base de conocimientos</option>';
  Object.keys(localStorage).forEach((key) => {
    if (key !== 'selectedKB') {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = key;
      selectElement.appendChild(option);
    }
  });
};

export const deleteKB = (kbName: string) => {
  localStorage.removeItem(kbName);
};

// Recuperar una base de conocimiento desde localStorage
export function getKB(name: string): KnowledgeBase | null {
  const sanitizedName = sanitizeKBName(name);

  try {
    // Obtener los datos del localStorage
    const jsonData = localStorage.getItem(sanitizedName);

    if (jsonData) {
      return JSON.parse(jsonData);
    } else {
      console.log('No se encontró la base de conocimientos.');
      return null;
    }
  } catch (error) {
    console.error("Error al recuperar la base de conocimiento desde localStorage:", error);
    return null;
  }
}

// Actualizar la base de conocimiento en localStorage
export function updateKB(name: string, facts: Fact[]) {
  const data = getKB(name);
  if (data) {
    data.Facts = facts;

    const sanitizedName = sanitizeKBName(name);
    try {
      localStorage.setItem(sanitizedName, JSON.stringify(data));
    } catch (error) {
      console.error("Error al actualizar la base de conocimiento en localStorage:", error);
    }
  }
}
