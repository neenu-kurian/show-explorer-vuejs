import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("@/views/HomeView.vue"),
    name: "home",
    meta: { title: "TV Maze" },
  },
  {
    path: "/show/:id(\\d+)",
    component: () => import("@/views/ShowDetailView.vue"),
    name: "show-detail",
    props: (route) => ({ id: Number(route.params.id) }),
    meta: { title: "TV Maze" },
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import("@/views/NotFoundView.vue"),
    name: "not-found",
    meta: { title: "Page Not Found | TV Maze" },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: (_, __, savedPosition) => {
    if (savedPosition) return savedPosition;
    return { top: 0, behavior: "smooth" };
  },
  routes,
});

router.afterEach((to) => {
  document.title = to.meta.title ?? "TV Maze";
});

export default router;
