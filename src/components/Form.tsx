import { useState, useEffect } from "react";

import { categories } from "../data/db";
import { DraftActivity } from "../types/";
import { useActivity } from "../hook/useActivity";

const initialState: DraftActivity = {
  category: 1,
  name: "",
  calories: "",
};

export default function Form() {
  const [draftActivity, setDraftActivity] =
    useState<DraftActivity>(initialState);
  const { state, dispatch } = useActivity();
  // console.log(state.activities);

  useEffect(() => {
    if (state.activeId) {
      const selectActivity = state.activities.find(
        (stateActivity) => stateActivity.id === state.activeId
      );

      if (selectActivity) {
        // Convertir el objeto Activity a DraftActivity
        const draftActivity: DraftActivity = {
          category: selectActivity.category,
          name: selectActivity.name,
          calories: selectActivity.calories.toString(), // Convertir calories de number a string
        };

        setDraftActivity(draftActivity);
      }
    } else {
      setDraftActivity(initialState);
    }
  }, [state.activeId, state.activities]);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLInputElement>
  ) => {
    const { id, value } = e.target;
    const isNumberField = ["category", "calories"].includes(id);

    setDraftActivity({
      ...draftActivity,
      [id]: isNumberField ? (value === "" ? "" : +value) : value,
    });
  };

  const isValidActivity = () => {
    const { name, calories } = draftActivity;
    const numCalories =
      typeof calories === "string" ? parseInt(calories) : calories;
    return name.trim() !== "" && numCalories > 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state.activeId) {
      dispatch({
        type: "update-activity",
        payload: { draftActivity: draftActivity },
      });
    } else {
      dispatch({
        type: "add-activity",
        payload: { draftActivity: draftActivity },
      });
    }
    setDraftActivity(initialState);
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 bg-white shadow p-10 rounded-lg"
    >
      <div>
        <label htmlFor="category" className="font-bold">
          Categoría
        </label>
        <select
          id="category"
          className="border border-slate-300 p-2 rounded-lg w-full bg-white"
          value={draftActivity.category}
          onChange={handleChange}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols1 gap-3">
        <label htmlFor="name" className="font-bold">
          Actividad
        </label>
        <input
          id="name"
          type="text"
          className="border border-slate-300 p-2 rounded-lg"
          placeholder="Ej. Comida, Jugo de NAranja, Ensalada, Ejercicio, Pesas , Bicicleta"
          value={draftActivity.name}
          onChange={handleChange}
        />
      </div>
      <div className="grid grid-cols1 gap-3">
        <label htmlFor="calories" className="font-bold">
          Calorias
        </label>
        <input
          id="calories"
          type="number"
          className="border border-slate-300 p-2 rounded-lg"
          placeholder="Calorias.ej. 300 o 500"
          value={draftActivity.calories}
          onChange={handleChange}
        />
      </div>
      <input
        type="submit"
        className="bg-gray-800 hover:bg-gray-900 w-full p-2 font-bold text-white cursor-pointer disabled:opacity-10"
        value={
          draftActivity.category === 1 ? "Guardar Comida" : "Guardar Ejercicio"
        }
        disabled={!isValidActivity()}
      />
    </form>
  );
}
