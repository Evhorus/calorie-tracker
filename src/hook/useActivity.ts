import { useContext } from "react";
import { ActivityContext } from "../context/ActivityContext";

export const useActivity = () => {
  const context = useContext(ActivityContext);

  if (!context) {
    throw new Error(
      "el hook useActivity debe ser utlizado en un ActivityProvider"
    );
  }
  return context;
};
