// router.js
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AboutView from '../views/AboutView.vue';
import CIFDetailsView from '../views/CIFDetailsView.vue';
import NotFoundView from '../views/NotFoundView.vue'; // Import the NotFoundView component

const routes = [
    { path: '/', component: HomeView },
    { path: '/cif/:id', component: CIFDetailsView, props: true }, // Dynamic route with parameter
    { path: '/about', component: AboutView },
    // Add the default route to handle any unmatched paths
    { path: '/:pathMatch(.*)', component: NotFoundView },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
