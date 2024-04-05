import { ReactNode, createContext, useMemo, useReducer } from "react";
import {
  ActivityActions,
  ActivityReducer,
  ActivityState,
  initialState,
} from "../reducers/activity-reducer";
import { categories } from "../data/db";
import { Activity } from "../types";

type ActivityProviderProps = {
  children: ReactNode;
};

type ActivityContextProps = {
  state: ActivityState;
  dispatch: React.Dispatch<ActivityActions>;
  categoryName: (category: Activity["category"]) => string[];
  isEmptyActivities: boolean;
};

export const ActivityContext = createContext<ActivityContextProps>(null!);

export const ActivityProvider = ({ children }: ActivityProviderProps) => {
  const [state, dispatch] = useReducer(ActivityReducer, initialState);

  const categoryName = useMemo(
    () => (category: Activity["category"]) =>
      categories.map((cat) => (cat.id === category ? cat.name : "")),
    []
  );

  const isEmptyActivities = useMemo(
    () => state.activities.length === 0,
    [state.activities]
  );
  return (
    <ActivityContext.Provider
      value={{ state, dispatch, categoryName, isEmptyActivities }}
    >
      {children}
    </ActivityContext.Provider>
  );
};
