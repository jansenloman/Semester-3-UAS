<script>
import LoginForm from "./LoginForm.vue";
import RegisterForm from "./RegisterForm.vue";

export default {
    data(){
        return {isLogin: true}
    },
    methods: {
        changeMode(){
            this.isLogin = !this.isLogin;
        }
    },
    components: { LoginForm, RegisterForm }
}
</script>

<template>
    <LoginForm v-if="isLogin" @changemode="changeMode"/>
    <RegisterForm v-else @changemode="changeMode"/>
</template>