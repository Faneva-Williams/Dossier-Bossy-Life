<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {storeTokenKey } from '../service/serviceAdmin';

const email = ref('');
const pswd = ref('');
const showPassword = ref(false); // État pour gérer la visibilité du mot de passe
const router = useRouter();

const login = async () => {
  await axios.post('http://localhost:2005/utilisateurs/login', {
    email: email.value,
    password: pswd.value,
  })
  .then(res => {
    console.log(res)
    if(res.data.message === "Adresse email ou mot de passe incorrect") {
      alert(res.data.message);
    } else {
       storeTokenKey(res.data.tokenKey);
      //console.log(stock)
       //console.log(storeTokenKey(res.data.tokenKey))
        router.push('/admin/home'); 
    }
  });
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value; // Inverser l'état de visibilité
};
</script>

<template>
<main>
  <div class="container">
    <section class="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <img src="@/assets/top-view-desk-calendar-cute-indoors-plant.jpg" alt="Login Image" class="img-fluid rounded h-100" />
        </div>
        <div class="card mb-3 col-md-6 h-100">
          <div class="card-body d-flex flex-column">
            <div class="pt-4 pb-2">
              <h5 class="card-title text-center pb-0 fs-4">LOGIN</h5>
              <p class="text-center small">Veuillez compléter ce champ</p>
            </div>
            <form class="row g-3 needs-validation" novalidate>
              <div class="col-12">
                <label for="yourUsername" class="form-label">Adresse email</label>
                <div class="input-group has-validation">
                  <input type="text" class="form-control" id="yourUsername" v-model="email" required>
                  <div class="invalid-feedback">Entrez l'adresse email.</div>
                </div>
              </div>
              <div class="col-12 position-relative">
                <label for="yourPassword" class="form-label">Mot de passe</label>
                <input 
                  :type="showPassword ? 'text' : 'password'" 
                  class="form-control" 
                  id="yourPassword" 
                  v-model="pswd" 
                  required
                />
                <div class="invalid-feedback">Entrez le mot de passe!</div>
                <span class="toggle-password" @click="togglePasswordVisibility">
                  <i :class="showPassword ? 'bi bi-eye' : 'bi bi-eye-slash'"></i>
                </span>
              </div>
              <div class="col-12">
                <button class="btn btn-primary w-100" type="button" @click="login()">Login</button>
              </div>
                <p class="mt-3">
                        <RouterLink to="/home" class="admin-login-link">Se connecter en tant qu'utilisateur</RouterLink>
                    </p>
            </form> 
          </div>
        </div>
      </div>
    </section>
  </div>
</main>
</template>

<style>
.container {
  max-width: 1200px;
  margin: auto;
}

.card {
  border-radius: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.card-body {
  padding: 2rem;
}

.btn-primary {
  background-color: #007bff;
  border: none;
}

.btn-primary:hover {
  background-color: #0056b3;
}

img {
  max-width: 100%;
  height: auto;
}

.toggle-password {
  position: absolute;
  top: 38px; /* Ajustez selon votre design */
  right: 10px; /* Ajustez selon votre design */
  cursor: pointer;
  color: #007bff; /* Couleur de l'icône */
}
</style>
