/*import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import DeclarationView from '../views/DeclarationView.vue'
import PaiementView from '../views/PaiementView.vue'
import VirementView from '../views/VirementView.vue'
import BlaView from '../views/BlaView.vue'
import RectificationView from '../views/RectificationView.vue'
import RecapitulatifView from '../views/RecapitulatifView.vue'
import LoginAdminView from '@/Admin/LoginAdminView.vue'
import HomeAdminView from '@/Admin/HomeAdminView.vue'
import ListesRectificationView from '@/views/ListesRectificationView.vue'
import RectificationAdminView from '@/Admin/RectificationAdminView.vue'
import AfficheRectificationView from '@/Admin/AfficheRectificationView.vue'
import PayementAdminView from '@/Admin/PayementAdminView.vue'
import ContriAdminView from '@/Admin/ContriAdminView.vue'
import AjoutContriAdminView from '../Admin/AjoutContriAdminView.vue'
import { isAuthenticated } from '../service/compteService';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/declaration',
      name: 'declaration',
      component: DeclarationView
    },
   
    {
      path: '/rectification',
      name: 'rectification',
      component: RectificationView
    },
    {
      path: '/recapitulatif',
      name: 'recapitulatif',
      component: RecapitulatifView
    },
    {
      path: '/blaview',
      name: 'blaview',
      component: BlaView
    },
    {
      path: '/virement',
      name: 'virement',
      component: VirementView
    },
    
    {
      path: '/paiement',
      name: 'paiement',
      component: PaiementView
    },
    {
      path: '/admin/login',
      name: 'adminLogin',
      component: LoginAdminView
    },
    {
      path: '/admin/home',
      name: 'adminHome',
      component: HomeAdminView
    },
    {
      path: '/admin/payements',
      name: 'Paymentadmin',
      component: PayementAdminView
    },
    {
      path: '/listes/rectification',
      name: 'ListesRectificationView',
      component: ListesRectificationView
    },
    {
      path: '/admin/listes/rectifications',
      name: 'rectificationAdmin',
      component: RectificationAdminView
    },
    {
      path: '/admin/contribuable',
      name: 'ContriAdmin',
      component: ContriAdminView
    },
    {
      path: '/admin/ajoutContri',
      name: 'AjoutContri',
      component: AjoutContriAdminView
    },
    {
      path: '/admin/affiche/rectification/:id_rect',
      name: 'AfficheRectificationView',
      component: AfficheRectificationView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
});
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated()) {
    next({ path: '/' }); // Rediriger vers la page d'accueil si non authentifié
  } else {
    next();
  }
});

/*const getRoleFromToken = (token) => {
  if (!token) return null;

  const payload = token.split(',')[1];
  if (!payload) return null; // Ajout d'une vérification

  const base64Url = payload.replace(/-/g, '+').replace(/_/g, '/');
  
  try {
    const jsonPayload = decodeURIComponent(atob(base64Url)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join(''));
    
    const parsedPayload = JSON.parse(jsonPayload);
    return parsedPayload.role;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null; // Retourner null en cas d'erreur
  }
};

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('access-token');

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) {
      localStorage.removeItem('access-token'); // Vérifiez la clé ici
      next({ name: 'home', replace: true });
    } else {
      const userRole = getRoleFromToken(token);

      if (to.meta.role && !to.meta.role.includes(userRole)) {
        localStorage.removeItem('access-token');
        next({ name: 'home', replace: true });
      } else {
        next();
      }
    }
  } else {
    next();
  }
});*/


import { createRouter, createWebHistory } from 'vue-router';
import { isAuthenticated } from '../service/compteService'; // Importer la fonction d'authentification
import { isAuthenticatedAdmin } from '../service/serviceAdmin';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import DeclarationView from '../views/DeclarationView.vue';
import PaiementView from '../views/PaiementView.vue';
import VirementView from '../views/VirementView.vue';
import RectificationView from '../views/RectificationView.vue';
import RecapitulatifView from '../views/RecapitulatifView.vue';
import LoginAdminView from '@/Admin/LoginAdminView.vue';
import HomeAdminView from '@/Admin/HomeAdminView.vue';
import ListesRectificationView from '@/views/ListesRectificationView.vue';
import RectificationAdminView from '@/Admin/RectificationAdminView.vue';
import AfficheRectificationView from '@/Admin/AfficheRectificationView.vue';
import PayementAdminView from '@/Admin/PayementAdminView.vue';
import ContriAdminView from '@/Admin/ContriAdminView.vue';
import AjoutContriAdminView from '../Admin/AjoutContriAdminView.vue';
import ModifieContriView from '@/Admin/ModifieContriView.vue';
const routes = [
  { path: '/', name: 'login', component: LoginView },
  { path: '/home', name: 'home', component: HomeView, meta: { requiresAuth: true } },
  { path: '/declaration', name: 'declaration', component: DeclarationView, meta: { requiresAuth: true } },
  { path: '/rectification', name: 'rectification', component: RectificationView, meta: { requiresAuth: true } },
  { path: '/recapitulatif', name: 'recapitulatif', component: RecapitulatifView, meta: { requiresAuth: true } },
  { path: '/virement', name: 'virement', component: VirementView, meta: { requiresAuth: true } },
  { path: '/paiement', name: 'paiement', component: PaiementView, meta: { requiresAuth: true } },
  { path: '/admin/login', name: 'adminLogin', component: LoginAdminView },
  { path: '/admin/home', name: 'adminHome', component: HomeAdminView, meta: { requiresAuth: true } },
  { path: '/admin/payements', name: 'Paymentadmin', component: PayementAdminView, meta: { requiresAuth: true } },
  { path: '/listes/rectification', name: 'ListesRectificationView', component: ListesRectificationView, meta: { requiresAuth: true } },
  { path: '/admin/listes/rectifications', name: 'rectificationAdmin', component: RectificationAdminView, meta: { requiresAuth: true } },
  { path: '/admin/contribuable', name: 'ContriAdmin', component: ContriAdminView, meta: { requiresAuth: true } },
  { path: '/admin/ajoutContri', name: 'AjoutContri', component: AjoutContriAdminView, meta: { requiresAuth: true } },
  { path: '/admin/affiche/rectification/:id_rect', name: 'AfficheRectificationView', component: AfficheRectificationView, meta: { requiresAuth: true } },
  { path:'/admin/contribuable/edit/:nif' , name: 'ModifieContri', component: ModifieContriView, meta: { requiresAuth: true} },
  { path: '/about', name: 'about', component: () => import('../views/AboutView.vue') },
 
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  if(isAuthenticatedAdmin()){
     next()
  }
  
  else if (to.meta.requiresAuth && !isAuthenticated()) {
    next({ name: 'login' }); // Redirige vers la page de connexion si non authentifié
  }
  
  else {
    next(); // Permet la navigation
  }
});
export default router;
