<template>
<Sidebar/>
  <div class="container-fluid">
    <div class="row" >
      <div class="">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Diagramme des Rectifications</h5>
            <Bar
              v-if="chartData.labels.length > 0"
              ref=""
              id="my-chart-id"
              :options="chartOptions"
              :data="chartData"
            />
            <div v-else>
              Loading...
            </div>
          </div>
        </div>
         <button class="btn btn-warning ">
              <router-link to="/" class="nav-link">Retour</router-link>
        </button>
      </div>
    </div>
    </div>
</template>

<script setup>
import Sidebar from '@/components/Sidebar.vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
import { ref, onMounted } from 'vue';
import axios from 'axios';

const chartData = ref({
  labels: [],
  datasets: [{
    data: [],
    backgroundColor: 'rgba(54, 162, 235, 0.6)', // Bleu avec transparence
    borderColor: 'rgba(54, 162, 235, 1)', // Contour bleu foncé
    borderWidth: 1
  }]
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,  // Permet à la carte de s'ajuster sans barre de défilement
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Nombre de Rectifications'
      },
      ticks: {
        stepSize: 5,  // Intervalle de 5 unités pour l'axe des Y
        font: {
          size: 14  // Taille des chiffres sur l'axe Y
        }
      }
    },
    x: {
      title: {
        display: true,
        text: 'Mois'
      },
      ticks: {
        font: {
          size: 14  // Taille des étiquettes des mois sur l'axe X
        }
      }
    }
  },
  plugins: {
    legend: {
      display: false,
      labels: {
        color: 'rgba(0, 0, 0, 0.7)'  // Couleur des labels (pas affichés ici)
      }
    }
  }
});

const chartRef = ref(null);

const afficheDiagrame = async () => {
  try {
    const response = await axios.get('http://localhost:2005/rectifications/diagramme');
    const responseData = response.data;

    const moisNoms = [
      "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];

    chartData.value.labels = moisNoms;
    chartData.value.datasets[0].data = Array(12).fill(0);

    responseData.forEach(item => {
      const monthIndex = item.month - 1;
      chartData.value.datasets[0].data[monthIndex] = Math.round(item.rectifications_count);
    });

    if (chartRef.value) {
      chartRef.value.chart.data = chartData.value;
      chartRef.value.chart.update();
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des données du diagramme', error);
  }
}

onMounted(async () => {
  await afficheDiagrame();
});
</script>

<style scoped>
.container-fluid{
  padding: 0px;
}
.row{
  margin:0px;
  margin-left: -100px;

}
.card {
  border: 1px solid #ddd; /* Bordure pour le style de la carte */
  border-radius: 8px; /* Coins arrondis */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Ombre pour le style */
  height: 500px; /* Hauteur fixe de la carte */
  margin-top: -630px;
  margin-left: 350px;
}

.btn-warning {
  background-color: #ffc107; /* Couleur personnalisée */
  border: none;
  margin-top:-7Opx;
  margin-left: -55px
}
</style>
