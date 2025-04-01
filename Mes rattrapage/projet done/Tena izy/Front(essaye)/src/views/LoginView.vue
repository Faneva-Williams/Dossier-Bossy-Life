<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
// import { compteSerice } from '../service/compteService'
import { storeToken } from '../service/compteService';

const nif = ref('');
const mdp = ref('');
const router = useRouter();
const alertMessage = ref(''); // Ajout d'une référence pour le message d'alerte
const isAlertVisible = ref(false); // Référence pour contrôler la visibilité de l'alerte
const showPassword = ref(false); // État pour montrer/cacher le mot de passe

const handleLogin = async () => {
    try {
        const response = await axios.post('http://localhost:2005/contribuables/login', {
            nif: parseInt(nif.value),
            mdp: mdp.value
        });
        storeToken(response.data.token);
        router.push('/home');
    } catch (error) {
        console.error('Erreur lors de la connexion', error.response ? error.response.data : error);
        alertMessage.value = error.response ? error.response.data.message : 'Erreur lors de la connexion'; // Mettre à jour le message d'alerte
        isAlertVisible.value = true; // Afficher l'alerte
    }
};

const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value; // Inverser l'état de visibilité
};

const closeAlert = () => {
    isAlertVisible.value = false; // Fermer l'alerte
};
</script>

<template>
<main class="main-container">
    <section class="login-section">
        <div class="image-container">
            <img src="@/assets/IMG_3434.jpg" alt="Description de l'image" class="side-image" />
        </div>
        <div class="login-container">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Connexion</h5>
                    <p class="card-subtitle">Veuillez compléter les champs ci-dessous</p>
                    <form @submit.prevent="handleLogin" class="login-form">
                        <div class="form-group">
                            <label for="nif" class="form-label">NIF</label>
                            <input v-model="nif" type="text" id="nif" class="form-control" placeholder="Entrez votre NIF" required>
                            <div class="invalid-feedback">Veuillez entrer le NIF.</div>
                        </div>
                        <div class="form-group position-relative">
                            <label for="mdp" class="form-label">Mot de passe</label>
                            <input v-model="mdp" :type="showPassword ? 'text' : 'password'" id="mdp" class="form-control" placeholder="Entrez votre mot de passe" required>
                            <div class="invalid-feedback">Veuillez entrer le mot de passe.</div>
                            <span class="toggle-password" @click="togglePasswordVisibility">
                                <i :class="showPassword ? 'bi bi-eye' : 'bi bi-eye-slash'"></i>
                            </span>
                        </div>
                        <button type="submit" class="btn btn-primary">Se connecter</button>
                    </form>
                    <p class="mt-3">
                        <RouterLink to="/admin/login" class="admin-login-link">Se connecter en tant qu'admin</RouterLink>
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- Modal d'alerte -->
    <div v-if="isAlertVisible" class="modal">
        <div class="modal-content">
            <span class="close" @click="closeAlert">&times;</span>
            <p>{{ alertMessage }}</p>
        </div>
    </div>
</main>
</template>

<style>
/* Style pour le modal */
.admin-login-link {
    color: #007bff; /* Couleur du lien */
    text-decoration: underline; /* Souligné pour indiquer un lien */
    cursor: pointer; /* Curseur en forme de main */
}
.modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* Fond sombre semi-transparent */
    z-index: 1000; /* S'assurer que le modal est au-dessus des autres éléments */
}

.modal-content {
    background-color: white;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    text-align: center;
    position: relative;
    width: 300px; /* Largeur du modal */
}

.close {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 20px;
    cursor: pointer;
}

/* Autres styles restent inchangés */
.main-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f4f4f4;
    padding: 20px; /* Add some padding for breathing space */
}

.login-section {
    display: flex;
    align-items: stretch; /* Ensure both elements (form and image) are aligned */
    width: 100%;
    max-width: 1200px; /* Wider container for larger screens */
    background: white;
    border-radius: 12px; /* Slightly rounded corners */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    overflow: hidden; /* Make sure rounded corners work */
}

.login-container {
    width: 50%; /* Occupies half of the space */
    padding: 30px;
    background: rgba(255, 255, 255, 0.95); /* Slight transparency */
}

.card {
    border: none; /* Remove border */
}

.card-body {
    padding: 0;
}

.card-title {
    font-size: 1.75rem; /* Increased title size */
    margin-bottom: 15px;
    color: #333;
    font-weight: 600;
}

.card-subtitle {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 20px;
}

.login-form {
    display: flex;
    flex-direction: column;
}

.form-group {
    margin-bottom: 20px; /* Increased spacing */
}

.form-label {
    font-weight: 500;
    margin-bottom: 5px;
}

.form-control {
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 12px;
    font-size: 1rem;
    transition: border-color 0.2s;
}

.form-control:focus {
    border-color: #007bff;
    outline: none; /* Remove default focus outline */
}

.btn-primary {
    background-color: #007bff;
    border: none;
    color: #ffffff;
    padding: 12px;
    font-size: 1rem;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s;
    margin-top: 20px; /* Ajoutez cette ligne pour espacer le bouton */
}

.btn-primary:hover {
    background-color: #0056b3;
}

.invalid-feedback {
    color: #dc3545;
    font-size: 0.875rem;
}

.image-container {
    width: 50%; /* Occupies half of the space */
    overflow: hidden; /* Ensure image doesn't overflow */
}

.side-image {
    width: 100%;
    height: 100%;
    object-fit: cover; /* Cover the container while maintaining aspect ratio */
}

.toggle-password {
    position: absolute;
    top: 35px; /* Ajustez selon votre design */
    right: 10px; /* Ajustez selon votre design */
    cursor: pointer;
    color: #007bff; /* Couleur de l'icône */
}

@media (max-width: 768px) {
    .login-section {
        flex-direction: column; /* Stack elements vertically */
    }

    .login-container,
    .image-container {
        width: 100%; /* Full width */
    }

    .side-image {
        height: 300px; /* Set a fixed height for smaller screens */
    }
}
</style>
