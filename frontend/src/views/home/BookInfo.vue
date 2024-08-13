<script>
import Alert from '../../components/Alert.vue';
import Spinner from '../../components/Spinner.vue';
import Config from '../../config';
import BookReview from './BookReview.vue';
import { Review } from '../../classes';

export default {
    data() {
        return {
            item: null,
            reviews: [],
            comment: "",
            
            showOriginalImage: true,
            intervalID: -1,
            errMsg: "",
            loading: false,
        };
    },
    methods: {
        imageNotAvailable(){
            this.showOriginalImage = false;
        },
        async addReview(){
            this.loading = true;
            try {
                const res = await fetch(Config.backend + '/reviews/' + this.item.id, {
                    method: "POST",
                    credentials: "include",
                    headers: {'Content-Type': "application/json"},
                    body: JSON.stringify({comment: this.comment})
                });
                if (!res.ok){
                    this.errMsg = (await res.json()).message || Config.serverError;
                } else {
                    this.comment = "";
                }
            } catch (e){
                this.errMsg = Config.connectionError;
            }
            this.loading = false;
        },
        async deleteReview(review){
            this.reviews = this.reviews.filter(x => x.id !== review.id);
            try {
                const res = await fetch(Config.backend + '/reviews/' + review.id, {
                    method: "DELETE",
                    credentials: "include",
                });
                if (!res.ok){
                    this.errMsg = (await res.json()).message || Config.serverError;
                    setTimeout(()=>{
                        this.errMsg = "";
                    }, 3000);
                }
            } catch (e) {
                console.error(e);
                this.errMsg = Config.connectionError;
            }
        },
        initializeBooks(){
            this.loading = true;
            return new Promise((resolve, reject)=>{
                this.intervalID = setInterval(async ()=>{
                    try {
                        await this.$store.dispatch("initializeBooks");
                        if (!this.$store.state.isBookInitialized){
                            this.errMsg = Config.serverError;
                        }
                        this.loading = false;
                        clearInterval(this.intervalID);
                        resolve();
                    } catch (e){
                        this.loading = false;
                        this.errMsg = Config.connectionError;
                    }
                }, 3000);
            });
        },
        returnToPreviousPage(){
            this.$router.go(-1);
        }
    },
    sockets: {
        newReview(review){
            this.reviews.splice(0, 0, new Review(review.id, review.user, review.comment, review.time));
        },
        deleteReview([id, cause]){
            if (cause !== this.$store.state.user.id){
                this.reviews = this.reviews.filter(x => x.id !== id);
            }
        }
    },
    async mounted() {
        await this.$store.dispatch("whoAmI");
        if (!this.$store.state.isBookInitialized){
            await this.initializeBooks();
        }

        this.item = this.$store.state.books.find(x => x.id == this.$router.currentRoute.value.params.id);
        if (!this.item) {
            this.$router.replace({ path: "/" });
            return;
        }

        this.loading = true;
        this.intervalID = setInterval(async () => {
            try {
                const res = await fetch(Config.backend + "/reviews/" + this.item.id);
                this.loading = false;
                clearInterval(this.intervalID);
                if (!res.ok) this.errMsg = Config.serverError;
                else this.reviews = (await res.json()).map(x => new Review(x.id, x.user, x.comment, x.time));
            }
            catch (e) {
                console.error(e);
                this.loading = false;
                this.errMsg = Config.connectionError;
            }
        }, 3000);

        this.$socket.emit("joinRoom", this.item.id);
        
        // this.sockets.subscribe("newReview");
        // this.sockets.subscribe("deleteReview");
    },
    beforeUnmount() {
        clearInterval(this.intervalID);
        // this.sockets.unsubscribe("newReview");
        // this.sockets.unsubscribe("deleteReview");
    },
    components: { Spinner, Alert, BookReview }
}
</script>

<template>
<Spinner :loading="loading"/>
<div v-if="item" class="mx-5">
    <div class="bg-light my-3 rounded-top-5 rounded-bottom-2">
        <button type="button" class="mt-2 ms-3 btn-close" aria-label="Close" @click="returnToPreviousPage"></button>
        <div class="px-5 py-3 book-info-top">
            <div>
                <h2>{{ item.title }}</h2>
                <p class="text-muted">{{ item.author.name }}</p>
                <p>{{ item.desc }}</p>
                <a class="btn btn-primary mb-3" :href="item.filename" download>
                    Download
                </a>
            </div>
            <div>
                <img v-if="showOriginalImage" :src="item.img" :alt="item.name" class="info-img" @error="imageNotAvailable">
                <img v-else src="../../assets/image-not-available.jpg" :alt="item.name" class="info-img">
            </div>
        </div>
    </div>

    <div class="bg-light px-5 pt-3 pb-5 rounded-top-2 rounded-bottom-5">
        <div class="mb-4">
            <textarea class="border-0 rounded shadow" placeholder="Komentar" v-model="comment"></textarea>
            <button class="btn btn-primary" @click="addReview">Buat Komentar</button>
        </div>
        <div id="review-section">
            <template v-for="review in reviews" :key="review.id">
                <BookReview :item="review" @delete="deleteReview(review)"/>
            </template>
        </div>
    </div>
</div>
<Alert :floating="true" :message="errMsg"/>
</template>

<style>
textarea {
    resize: none;
    width: 100%;
    height: 70px;
    padding: 5px;
}
.info-img {
    width: 200px;
}
#review-section {
    max-height: 500px;
    overflow-x: hidden;
}

.book-info-top {
    display: flex;
    justify-content: space-between
}
@media screen and (max-width: 768px){
    .book-info-top {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
}
</style>