import { useMemo } from "react";
import CalorieDisplay from "./CalorieDisplay";
import { useActivity } from "../hook/useActivity";

export default function CalorieTracker() {
  const { state } = useActivity();
  const caloriesCosumed = useMemo(
    () =>
      state.activities.reduce(
        (total, activity) =>
          activity.category === 1 ? total + activity.calories : total,
        0
      ),
    [state.activities]
  );
  const caloriesBurned = useMemo(
    () =>
      state.activities.reduce(
        (total, activity) =>
          activity.category === 2 ? total + activity.calories : total,
        0
      ),
    [state.activities]
  );

  const netCalories = useMemo(
    () => caloriesCosumed - caloriesBurned,
    [caloriesCosumed, caloriesBurned]
  );
  return (
    <>
      <h2 className="text-4xl font-black text-white text-center">
        Resumen de Calorias
      </h2>
      <div className="flex flex-col items-center md:flex-row md:justify-between  gap-5 mt-10">
        <CalorieDisplay calories={caloriesCosumed} text="Cosumidas" />
        <CalorieDisplay calories={caloriesBurned} text="Ejercicio" />
        <CalorieDisplay calories={netCalories} text="Diferencia" />
      </div>
    </>
  );
}
