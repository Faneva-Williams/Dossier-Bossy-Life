<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Navbar from '@/components/Navbar.vue';
import Logout from '@/components/LogoutView.vue';

const nif = ref('');
const raisonSociale = ref('');
const adresse = ref('');
const cin = ref('');
const numStat = ref('');
const activite = ref('');

const handleLogin = async (nifInput, mdpInput) => {
    try {
        const response = await axios.post('http://localhost:2005/contribuables/login', { nif: nifInput, mdp: mdpInput });
        localStorage.setItem('token', response.data.token);
        console.log('Connexion réussie');
    } catch (error) {
        console.error('Erreur lors de la connexion', error);
        alert('Erreur de connexion : ' + error.message);
    }
};

const goToRectification = () => {
    router.push({ 
        name: 'RectificationView', 
        query: { nif: nif.value, raisonSociale: raisonSociale.value } 
    });
};

const fetchContribuable = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('Pas de token trouvé');
        return;
    }

    try {
        const response = await axios.get('http://localhost:2005/contribuables/infos', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const { data } = response;
        nif.value = data.nif;
        raisonSociale.value = data.raisonsociale;
        adresse.value = data.adresse;
        cin.value = data.cin;
        numStat.value = data.numStat;
        activite.value = data.activite;
        localStorage.setItem('contribuableInfo', JSON.stringify(data));

    } catch (error) {
        console.error('Erreur lors de la récupération des informations', error);
        alert('Erreur lors de la récupération des informations : ' + error.message);
    }
};

onMounted(fetchContribuable);
</script>
<template>
  <div class="app-container">
    <header class="header">
      <h1>Direction Générale des Impôts</h1>
    </header>
    <Navbar />
    <div class="content-container">
      <aside class="sidebar">
        <div class="card company-info">
          <h2 class="card-header">Société connectée</h2>
          <div class="card-body">
            <p><strong>NIF:</strong> {{ nif }}</p>
            <p><strong>Raison Sociale:</strong> {{ raisonSociale }}</p>
            <p><strong>Adresse:</strong> {{ adresse }}</p>
            <p><strong>CIN:</strong> {{ cin }}</p>
            <p><strong>Num Stat:</strong> {{ numStat }}</p>
            <p><strong>Activité:</strong> {{ activite }}</p>
          </div>
        </div>
      </aside>
      <main class="main-content">
        <div class="image-slider">
          <div class="images-wrapper">
            <div class="images">
              <img src="../assets/fiscalite-1430x804-1.jpg" alt="Fiscalité 1" />
              <img src="../assets/fiscalite-1430x804-1.jpg" alt="Fiscalité 2" />
              <img src="../assets/fiscalite-1430x804-1.jpg" alt="Fiscalité 3" />
            </div>
          </div>
        </div>
        <div class="action-panel">
            <Logout/>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  font-family: 'Arial', sans-serif;
  color: #333;
  background-color: #f5f5f5;
}

.header {
  background-color: #1a5276;
  color: #ffffff;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.content-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar {
  width: 300px;
  background-color: #ffffff;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

.company-info {
  margin: 1rem;
}

.card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #2980B9;
  color: #ffffff;
  padding: 1rem;
  font-size: 1.2rem;
  font-weight: 600;
  border-radius: 8px 8px 0 0;
}

.card-body {
  padding: 1rem;
}

.card-body p {
  margin: 0.5rem 0;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 1rem;
}

.image-slider {
  flex: 1;
  overflow: hidden;
  position: relative;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.images-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  animation: scroll 30s linear infinite;
}

.images {
  display: flex;
  height: 100%;
}

.images img {
  height: 100%;
  width: auto;
  object-fit: cover;
}

@keyframes scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.action-panel {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
}

.btn-logout {
  background-color: #E74C3C; /* Rouge pour indiquer une action de déconnexion */
  color: #ffffff;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  transition: background-color 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-logout:hover {
  background-color: #C0392B; /* Couleur plus foncée au survol */
}

.btn-icon {
  margin-right: 0.5rem;
  font-size: 1.2rem;
}
</style>
