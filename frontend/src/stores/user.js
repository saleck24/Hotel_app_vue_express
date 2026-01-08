import { reactive } from "vue";

export const userState = reactive({
  nom: "",
  profile_image: "/default-avatar.jpg",
  role: "",
});

// Charger utilisateur depuis localStorage
export const loadUser = () => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const user = JSON.parse(storedUser);
    userState.nom = user.nom;
    userState.profile_image = user.profile_image || "/default-avatar.jpg";
    userState.role = user.role || "";
  }
};

// Mettre à jour userState et localStorage
export const updateUser = (user) => {
  const baseURL = "http://localhost:3000"; // à adapter selon le backend

  userState.nom = user.nom;
  userState.role = user.role || "";
  userState.profile_image = user.profile_image
    ? `${baseURL}${user.profile_image}`
    : "/default-avatar.jpg";

  // Stocker un objet simple dans localStorage
  const simpleUser = {
    nom: user.nom,
    role: userState.role,
    profile_image: userState.profile_image,
  };
  localStorage.setItem("user", JSON.stringify(simpleUser));
};
