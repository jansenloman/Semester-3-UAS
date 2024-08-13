<script>
import BootstrapForm from '../../components/BootstrapForm.vue';
import Alert from "../../components/Alert.vue";
import Spinner from "../../components/Spinner.vue";

import Config from "../../config.js";
import { InputObject } from '../../components/InputObject';

export default {
    data(){
        return {
            inputs: [
                new InputObject("Email", "", x =>{
                    if (x.length == 0) return "Email harus diisi";
                    else if (!x.match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) return "Format email tidak sesuai";
                }),
                new InputObject("Password", "", x => (x.length < 8 ? "Password harus terdiri dari minimal 8 karakter" : "")),
                new InputObject("Nama", "", x =>{
                    if (x.length < 5) return "Nama harus terdiri dari minimal 5 karakter";
                    else if (!x.match(/^[a-zA-Z0-9]+$/)) return "Nama hanya boleh terdiri dari huruf alfabet dan angka 0-9 saja";
                }),
            ],
            errMsg: "",
            loading: false,
        }
    },
    emits: ["changemode"],
    methods: {
        async register(body){
            this.loading = true;
            try {
                const res = await fetch(Config.backend + "/accounts/register", {
                    credentials: "include",
                    method: "post",
                    headers: {'Content-type': "application/json"},
                    body: JSON.stringify({
                        email: body["Email"],
                        password: body["Password"],
                        name: body["Nama"]
                    })
                });
                this.loading = false;
                if (!res.ok) this.errMsg = (await res.json()).message || Config.serverError;
                else this.$router.replace({name: "home"})
            } catch (e){
                this.loading = false;
                this.errMsg = Config.connectionError;
            }
        }  
    },
    components: { BootstrapForm, Alert }
}
</script>

<template>
    <Spinner :loading="loading"/>
    <div class="center-screen">
        <BootstrapForm :inputs="inputs" method="post" action="/api/register" purpose="Login" @submit="register">
            <template v-slot:after>
                <p class="text-muted">
                    Sudah ada akun? <a href="#" @click.prevent="$emit('changemode')">Login</a>
                </p>
                <Alert :message="errMsg"/>
            </template>
        </BootstrapForm>
    </div>
</template>