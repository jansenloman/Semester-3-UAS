<script>
import Spinner from "../../components/Spinner.vue";
import Alert from '../../components/Alert.vue';
import BootstrapForm from '../../components/BootstrapForm.vue';
import { InputObject, FileInputObject } from "../../components/InputObject";
import Config from "../../config";

export default {
    data(){
        return {
            itemID: null,
            inputs: [],

            loading: false,
            errMsg: "",
        }
    },
    computed: {
        purpose(){ return (this.itemID === null ? "Buku Baru" : "Edit Buku");},
        method(){ return (this.itemID === null ? "post" : "put");},
        action(){ return (this.itemID === null ? Config.backend + '/books' : Config.backend + '/books/' + this.itemID)}
    },
    methods: {
        async modifyBook(book){
            // https://stackoverflow.com/questions/53914361/upload-a-file-in-react-and-send-it-to-an-express-server
            const body = new FormData();
            body.append("title", book["Judul"]);
            body.append("desc", book["Deskripsi"]);
            body.append("img", book["Thumbnail"].length == 0 ? null : book["Thumbnail"][0])
            body.append("file", book["File"][0]);
            try {
                let res;
                if (this.itemID === null){
                    res = await fetch(Config.backend + '/books/', {
                        method: "POST",
                        credentials: "include",
                        // headers: {'Content-Type': "multipart/form-data"},
                        body: body,
                    });
                } else {
                    res = await fetch(Config.backend + '/books/' + this.itemID, {
                        method: "PUT",
                        credentials: "include",
                        // headers: {'Content-Type': "multipart/form-data"},
                        body: body,
                    });
                }

                if (!res.ok){
                    this.errMsg = (await res.json()).message || Config.serverError;
                    return;
                }

                const book = await res.json();
                this.$store.commit("editBook", book);
                this.$router.go(-1);
            } catch (e){
                this.errMsg = Config.connectionError;
            }
        },
        async deleteBook(){
            this.loading = true;
            try {
                const res = await fetch(Config.backend + "/books/" + this.itemID, {
                    method: "DELETE",
                    credentials: "include",
                });
                this.loading = false;
                if (!res.ok){
                    this.errMsg = (await res.json()).message || Config.serverError;
                } else {
                    this.$store.commit("deleteBook", this.itemID);
                    this.$router.replace({name: "home"});
                }
            } catch (err){
                console.error(err);
                this.loading = false;
                this.errMsg = Config.connectionError;
            }
        }
    },
    mounted() {
        if (!this.$store.state.isBookInitialized){
            this.$router.replace({path: '/'});
            return;
        }
        
        if (!this.$router.currentRoute.value.params.id){
            this.itemID = null;

            this.inputs = [
                new InputObject("Judul", "", x => (x.length < 5 ? "Judul buku harus terdiri dari minimal 5 karakter" : "")),
                new InputObject("Deskripsi", ""),
                new FileInputObject("Thumbnail", [], "image/*", x => x.length == 0 ? "Thumbnail harus disediakan" : ""),
                new FileInputObject("File", [], "application/pdf,application/epub+zip,text/plain,text/html,text/markdown,.doc,.docx,application/msword", x => x.length == 0 ? "File harus disediakan" : "")
            ];
            return;
        }

        const item = this.$store.state.books.find(x => x.id == this.$router.currentRoute.value.params.id);
        if (!item || item.author.id != this.$store.state.user.id){
            this.$router.replace({path: '/edit'})
            return;
        }
        
        this.itemID = item.id;
        this.inputs = [
            new InputObject("Judul", item.title, x => (x.length < 5 ? "Judul buku harus terdiri dari minimal 5 karakter" : "")),
            new InputObject("Deskripsi", item.desc),
            new FileInputObject("Thumbnail", [], "image/*"),
            new FileInputObject("File", [], "application/pdf,application/epub+zip,text/plain,text/html,text/markdown,.doc,.docx,application/msword",)
        ]
    },
    components: { Alert, Spinner, BootstrapForm }
}
</script>

<template>
    <Spinner :loading="loading"/>

    <div class="center-screen">
        <BootstrapForm v-if="inputs.length > 0" :purpose="purpose" :method="method"
            :action="action" :inputs="inputs" @submit="modifyBook">
            <template v-slot:footer v-if="itemID">
                <button type="button" class="btn btn-lg btn-danger mt-2 w-100"
                    @click="deleteBook">
                    Hapus Buku
                </button>
            </template>
        </BootstrapForm>
    </div>
    
    <Alert :floating="true" :message="errMsg"/>
</template>