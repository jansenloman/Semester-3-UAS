<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
<RouterView />
</template>

<style>
body {
	background-image: linear-gradient(
		rgba(0, 0, 0, 0.3), 
		rgba(0, 0, 0, 0.3)
	), url("./assets/pexels-rafael-cosquiere-2041540.jpg");
	background-repeat: no-repeat;
    background-attachment: fixed;
    background-position: center;
    background-size: cover;
}
</style>
