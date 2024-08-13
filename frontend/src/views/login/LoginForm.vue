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
                new InputObject("Email", "", x => (x.length == 0 ? "Email harus diisi" : "")),
                new InputObject("Password", "", x => (x.length == 0 ? "Password harus diisi" : "")),
            ],
            errMsg: "",
            loading: false,
        }
    },
    emits: ["changemode"],
    methods: {
        async login(body){
            this.loading = true;
            try {
                const res = await fetch(Config.backend + "/accounts/login", {
                    credentials: "include",
                    method: "post",
                    headers: {'Content-type': "application/json"},
                    body: JSON.stringify({
                        email: body["Email"],
                        password: body["Password"],
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
    components: { BootstrapForm, Alert, Spinner }
}
</script>

<template>
    <Spinner :loading="loading"/>
    <div class="center-screen">
        <BootstrapForm :inputs="inputs" method="post" action="/api/login" purpose="Daftar" @submit="login">
            <template v-slot:after>
                <Alert :message="errMsg"/>
                <p class="text-muted">
                    Belum ada akun? <a href="#" @click.prevent="$emit('changemode')">Daftar</a>
                </p>
            </template>
        </BootstrapForm>
    </div>
</template>