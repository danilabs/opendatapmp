// router.js
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import DNIDetailsView from '../views/DNIDetailsView.vue';
import NotFoundView from '../views/NotFoundView.vue'; // Import the NotFoundView component

const routes = [
    { path: '/', component: HomeView },
    { path: '/dni/:id', component: DNIDetailsView, props: true }, // Dynamic route with parameter
    // Add the default route to handle any unmatched paths
    { path: '/:pathMatch(.*)', component: NotFoundView },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
