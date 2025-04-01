<template>
  <div>
    <button class="btn btn-danger" @click="logout">Déconnexion</button>
  </div>
</template>

<script setup>
import { removeToken } from '../service/compteService';
import { useRouter } from 'vue-router';

const router = useRouter();

const logout = () => {
  removeToken(); // Supprimer le token
  router.push('/'); // Rediriger vers la page de connexion
};
</script>
