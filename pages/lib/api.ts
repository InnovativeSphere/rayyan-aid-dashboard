import axios from "axios";

// ------------------- AXIOS INSTANCE -------------------
export const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // optional: if you also use cookies
});

// ------------------- AUTH TOKEN -------------------
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// Attach token from localStorage only in the browser
if (typeof window !== "undefined") {
  const token = localStorage.getItem("token");
  if (token) setAuthToken(token);
}

// ------------------- USERS -------------------
export const getUsers = () => api.get("/users").then((res) => res.data);
export const createUser = (user: any) =>
  api.post("/users", user).then((res) => res.data);
export const loginUser = (credentials: any) =>
  api.post("/users", { ...credentials, login: true }).then((res) => res.data);
export const updateUser = (id: number, data: any) =>
  api.put("/users", { id, ...data }).then((res) => res.data);
export const deleteUser = (id: number) =>
  api.delete("/users", { data: { id } }).then((res) => res.data);

// ------------------- PARTNERS -------------------
export const getPartners = () => api.get("/partners").then((res) => res.data);
export const createPartner = (partner: any) =>
  api.post("/partners", partner).then((res) => res.data);
export const updatePartner = (id: number, data: any) =>
  api.put("/partners", { id, ...data }).then((res) => res.data);
export const deletePartner = (id: number) =>
  api.delete("/partners", { data: { id } }).then((res) => res.data);

// ------------------- PEOPLE -------------------
export const getPeople = () => api.get("/people").then((res) => res.data);
export const createPerson = (person: any) =>
  api.post("/people", person).then((res) => res.data);
export const updatePerson = (id: number, data: any) =>
  api.put("/people", { id, ...data }).then((res) => res.data);
export const deletePerson = (id: number) =>
  api.delete("/people", { data: { id } }).then((res) => res.data);

// ------------------- PROJECTS -------------------
export const getProjects = () => api.get("/projects").then((res) => res.data);
export const createProject = (project: any) =>
  api.post("/projects", project).then((res) => res.data);
export const updateProject = (id: number, data: any) =>
  api.put("/projects", { id, ...data }).then((res) => res.data);
export const deleteProject = (id: number) =>
  api.delete("/projects", { data: { id } }).then((res) => res.data);

// ------------------- PROJECT PEOPLE -------------------
export const getProjectPeople = (filters = {}) =>
  api.get("/project_people", { params: filters }).then((res) => res.data);
export const addPersonToProject = (link: any) =>
  api.post("/project_people", link).then((res) => res.data);
export const removePersonFromProject = (id: number) =>
  api.delete("/project_people", { data: { id } }).then((res) => res.data);

// ------------------- PROJECT IMAGES -------------------
export const getProjectImages = (project_id: number) =>
  api
    .get("/project_images", { params: { project_id } })
    .then((res) => res.data);

export const getAllProjectImages = () =>
  api.get("/project_images").then((res) => res.data);

export const addProjectImages = (project_id: number, images: any[]) =>
  api.post("/project_images", { project_id, images }).then((res) => res.data);

export const removeProjectImage = (id: number) =>
  api.delete("/project_images", { data: { id } }).then((res) => res.data);


// ------------------- DONATIONS -------------------
// Fetch donations (optionally by project)
export const getDonations = (project_id?: number) =>
  api
    .get("/donations", { params: project_id ? { project_id } : {} })
    .then((res) => res.data);

// Add a donation
export const addDonation = (donation: any) =>
  api.post("/donations", donation).then((res) => res.data);

// Update a donation
export const updateDonation = (id: number, data: any) =>
  api.put("/donations", { id, ...data }).then((res) => res.data);

// Delete a donation
export const deleteDonation = (id: number) =>
  api.delete("/donations", { data: { id } }).then((res) => res.data);

// Custom donation endpoints
export const getDonationsGroupedByAmount = () =>
  api
    .get("/donations", { params: { custom: "group_by_amount" } })
    .then((res) => res.data);

export const getTotalDonationsPerProject = () =>
  api
    .get("/donations", { params: { custom: "total_per_project" } })
    .then((res) => res.data);

// ------------------- CATEGORIES -------------------
export const getCategories = () =>
  api.get("/categories").then((res) => res.data);

export const createCategory = (category: any) =>
  api.post("/categories", category).then((res) => res.data);

export const updateCategory = (id: number, data: any) =>
  api.put("/categories", { id, ...data }).then((res) => res.data);

export const deleteCategory = (id: number) =>
  api.delete("/categories", { data: { id } }).then((res) => res.data);
