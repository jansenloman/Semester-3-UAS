import { createRouter, createWebHistory } from 'vue-router'
import Home from "../views/home/App.vue";
import Config from "../config";

async function isAuthorized(){
	const res = await fetch(Config.backend + '/accounts/me', {
		credentials: "include"
	});
	return res.ok;
}

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: Home,
			async beforeEnter(to, from, next){
				if (await isAuthorized()) next();
				else next({name: 'login'});
			}
		},
		{
			path: '/info/:id',
			name: 'info',
			component: () => import("../views/home/BookInfo.vue"),
			async beforeEnter(to, from, next){
				if (await isAuthorized()) next();
				else next({name: 'login'});
			}
		},
		{
			path: '/edit/:id?',
			name: 'edit',
			component: () => import("../views/home/ModifyBook.vue"),
			async beforeEnter(to, from, next){
				if (await isAuthorized()) next();
				else next({name: 'login'});
			}
		},
		{
			path: '/login',
			name: 'login',
			component: () => import('../views/login/App.vue'),
			async beforeEnter(to, from, next){
				if (await isAuthorized()) next({name: 'home'});
				else next();
			}
		},
	]
})

export default router
