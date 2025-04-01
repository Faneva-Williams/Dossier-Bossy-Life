// authService.js

const TOKEN_KEY_Admin = 'tokenAdmin'; // Clé utilisée pour stocker le token

// Fonction pour stocker le token
export const storeTokenKey = (tokenAdmin) => {
  localStorage.setItem(TOKEN_KEY_Admin, tokenAdmin);
};

// Fonction pour supprimer le token
export const removeTokenKey = () => {
  localStorage.removeItem(TOKEN_KEY_Admin);
};

// Fonction pour récupérer le token
export const getTokenKey = () => {
  return localStorage.getItem(TOKEN_KEY_Admin);
};

// Fonction pour vérifier si l'utilisateur est connecté
export const isAuthenticatedAdmin = () => {
  const token = getTokenKey();
  console.log('Admin Token:', token); // Ajoutez ce log
  return !!token;
};

