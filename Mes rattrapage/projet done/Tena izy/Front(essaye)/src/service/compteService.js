// authService.js

const TOKEN_KEY = 'token'; // Clé utilisée pour stocker le token

// Fonction pour stocker le token
export const storeToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Fonction pour supprimer le token
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// Fonction pour récupérer le token
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Fonction pour vérifier si l'utilisateur est connecté
export const isAuthenticated = () => {
  return !!getToken(); // Retourne true si un token est présent
};
