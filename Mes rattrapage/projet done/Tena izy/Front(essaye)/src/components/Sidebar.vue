<script setup>
import { ref, onMounted } from "vue";
import { RouterLink, RouterView } from "vue-router";
import axios from "axios";
import { useRouter } from "vue-router";
import { removeTokenKey } from "@/service/serviceAdmin";
const newRectificationsCount = ref(0);

const router = useRouter();

const fetchNewRectificationsCount = async () => {
  try {
    const response = await axios.get("/api/rectifications/count");
    newRectificationsCount.value = response.data.count;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération du nombre de nouvelles rectifications:",
      error
    );
  }
};

const listenForNewRectifications = () => {
  const eventSource = new EventSource("/api/notifications");
  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "newRectification") {
      newRectificationsCount.value += 1;
      showNotification("Nouvelle rectification ajoutée !");
    }
  };
};

const showNotification = (message) => {
  // Utilisez ici votre système de notification préféré (par exemple, une bibliothèque comme vue-toastification)
  alert(message); // Pour l'exemple, nous utilisons un simple alert
};

const logout = () => {
  removeTokenKey()
  router.push("/admin/login"); // Rediriger vers la page de connexion
};

onMounted(() => {
  fetchNewRectificationsCount();
  listenForNewRectifications();
  setInterval(fetchNewRectificationsCount, 60000);
});
</script>

<template>
  <div class="container-fluid">
    <div class="row flex-nowrap">
      <div class="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
        <div
          class="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100"
        >
          <span class="fs-5 d-none d-sm-inline">ADMINISTRATEUR</span>

          <ul
            class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
            id="menu"
          >
            <li class="nav-item">
              <RouterLink to="/admin/home" class="nav-link align-middle px-0">
                <i class="fs-4 bi-house"></i>
                <span class="ms-1 d-none d-sm-inline">Home</span>
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink
                to="/admin/listes/rectifications"
                class="nav-link align-middle px-0"
              >
                <i class="fs-4 bi-pencil"></i>
                <span class="ms-1 d-none d-sm-inline">Rectifications</span>
                <span
                  v-if="newRectificationsCount > 0"
                  class="badge bg-danger ms-2"
                  >{{ newRectificationsCount }}</span
                >
              </RouterLink>
            </li>

            <li>
              <RouterLink
                to="/admin/contribuable"
                class="nav-link align-middle px-0"
              >
                <i class="fs-4 bi-person"></i>
                <span class="ms-1 d-none d-sm-inline">Contribuable</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/admin/payements"
                class="nav-link px-0 align-middle"
              >
                <i class="fs-4 bi-credit-card"></i>
                <span class="ms-1 d-none d-sm-inline">Payements</span>
              </RouterLink>
            </li>
          </ul>
          <button class="btn btn-primary" @click="logout">
            Se Deconnecter
          </button>
          <hr />
        </div>
      </div>
      <div class="col py-3">
        <RouterView />
      </div>
    </div>
  </div>
</template>
<style scoped>
.container-fluid {
  height: 650px;
}
</style>
