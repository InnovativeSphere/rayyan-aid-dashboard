// redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import projectsReducer from "./slices/projectsSlice";
import donationsReducer from "./slices/donationSlice"; 
import peopleReducer from "./slices/peopleSlice";
// import projectPeopleReducer from "./slices/projectPeopleSlice";
import projectImagesReducer from "./slices/ProjectImagesSlice";
import partnersReducer from "./slices/partnersSlice";
import categoriesReducer from "./slices/categoriesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectsReducer,
    donations: donationsReducer,
    people: peopleReducer,
    // projectPeople: projectPeopleReducer,
    projectImages: projectImagesReducer,
    partners: partnersReducer,
    category: categoriesReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
