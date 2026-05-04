import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: (_, __, savedPosition) => {
    if (savedPosition) return savedPosition;
    return { top: 0, behavior: 'smooth' };
  },
  routes,
});

router.afterEach((to) => {
  document.title = to.meta.title ?? 'TV Maze';
});

export default router;
