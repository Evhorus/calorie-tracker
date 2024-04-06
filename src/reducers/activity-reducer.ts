import { Activity, DraftActivity } from "../types";
import { v4 as uuidv4 } from "uuid";
export type ActivityActions =
  | { type: "add-activity"; payload: { draftActivity: DraftActivity } }
  | { type: "update-activity"; payload: { draftActivity: DraftActivity } }
  | { type: "set-activeId"; payload: { id: Activity["id"] } }
  | { type: "delete-activeId"; payload: { id: Activity["id"] } }
  | { type: "restart-app" };

export type ActivityState = {
  activities: Activity[];
  activeId: Activity["id"];
};

const localStorageActivities = (): Activity[] => {
  const activities = localStorage.getItem("activities");
  return activities ? JSON.parse(activities) : [];
};
export const initialState: ActivityState = {
  activities: localStorageActivities(),
  activeId: "",
};

const createActivity = (draftActivity: DraftActivity): Activity => {
  const calories = parseInt(draftActivity.calories);

  return { ...draftActivity, id: uuidv4(), calories: calories };
};

export const ActivityReducer = (
  state: ActivityState = initialState,
  action: ActivityActions
) => {
  if (action.type === "add-activity") {
    const newActivity = createActivity(action.payload.draftActivity);
    return {
      ...state,
      activities: [...state.activities, newActivity],
    };
  }
  if (action.type === "update-activity") {
    const updateActivities: Activity[] = state.activities.map((activity) =>
      activity.id === state.activeId
        ? {
            id: state.activeId,
            ...action.payload.draftActivity,
            calories: parseInt(action.payload.draftActivity.calories),
          }
        : activity
    );
    return {
      ...state,
      activities: updateActivities,
      activeId: "",
    };
  }

  if (action.type === "set-activeId") {
    return {
      ...state,
      activeId: action.payload.id,
    };
  }

  if (action.type === "delete-activeId") {
    return {
      ...state,
      activities: state.activities.filter(
        (activity) => activity.id !== action.payload.id
      ),
      activeId: "",
    };
  }
  if (action.type === "restart-app") {
    return {
      activities: [],
      activeId: "",
    };
  }
  return state;
};
