<script>
import BookViewer from '../books/BookViewer.vue';
import { RouterLink } from 'vue-router';
import Config from '../../config';

export default {
    components: { BookViewer, RouterLink },
    methods: {
        async logout(){
            const res = await fetch(Config.backend + '/accounts/logout', {
                credentials: "include",
                method: "POST"
            });
            if (res.ok){
                this.$store.commit("logout");
                this.$router.replace({name: "login"});
            }
        }
    }
}
</script>

<template>
    <a class="position-absolute top-0 end-0 me-4 mt-2 fs-2 link-light underline-on-hover"
        @click="logout">
        Logout
    </a>
    <BookViewer/>
    <RouterLink class="btn btn-primary floating-action-button rounded-circle" to="/edit">
        +
    </RouterLink>
</template>

<style scoped>
a.underline-on-hover {
    z-index: 15;
    cursor: pointer;
    transition: background-color 0.2s;
}
.underline-on-hover {
    text-decoration: none;
    position: relative;
}
.underline-on-hover:before {
    content: '';
    width: 0%; height: 5%;
    bottom: 0%; left: 50%; transform: translateX(-50%);
    position: absolute;
    background-color: white;
    transition: width 0.2s;
}
.underline-on-hover:hover:before {
    width: 100%;
}
.floating-action-button {
    font-size: 4em;
    padding: 0px;
    width: 100px;
    height: 100px;
    position: absolute;
    right: 5%;
    bottom: 5%;
}
@media screen and (max-width: 768px){
    .floating-action-button {
        width: 75px;
        height: 75px;
        font-size: 3em;
    }
}
@media screen and (max-width: 576px){
    .floating-action-button {
        width: 50px;
        height: 50px;
        font-size: 2em;
    }
}
</style>
