import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import Store from './Store';
import VueSocketIO from "vue-socket.io";
import { io } from "socket.io-client";
import Config from './config';

import './assets/main.css'

const app = createApp(App)

app.use(router);
app.use(Store);

// https://www.npmjs.com/package/vue-socket.io
/*
https://github.com/MetinSeylan/Vue-Socket.io/issues/323
Entah kenapa ketika menggunakan versi vue-socket.io dari npm, terjadi error
bahwa tidak dapat set properti #socket dari undefined.
Dari link diatas terdapat dua solusi, namun saya kurang suka solusi pertama
apalagi karena diperlukan pihak dosen untuk secara manual mengubah linenya, jadi
pakai solusi kedua saja.

Jika dosen tidak dapat menjalankan proyek ini, silahkan mencoba menginstall vue-socket.io
langsung dari reponya dengan:
npm i https://github.com/MetinSeylan/Vue-Socket.io.git
*/

app.use(new VueSocketIO({
    // debug: true,
    connection: io(Config.backendRoot, {withCredentials: true, transports: ['websocket', 'polling', 'flashsocket']}),
    vuex: {
        store: Store,
        actionPrefix: "SOCKET_",
        mutationPrefix: "SOCKET_"
    }
}));
app.mount('#app')
