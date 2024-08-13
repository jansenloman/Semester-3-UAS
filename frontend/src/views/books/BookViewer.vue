<script>
import BookCard from './BookCard.vue';
import Spinner from '../../components/Spinner.vue';
import Alert from '../../components/Alert.vue';
import PageButtons from './PageButtons.vue';
import Config from '../../config';

export default {
    data(){
        return {
            loading: false,
            errMsg: "",
            intervalID: -1,
            searchTerm: "",
            page: 0,
        }
    },
    computed: {
        books(){
            return this.$store.state.books.filter(x => x.title.toLowerCase().includes(this.searchTerm.toLowerCase()));
        },
        totalPages(){ return Math.ceil(this.books.length / 20); }
    },
    methods: {
        changePage(pg){
            this.page = pg;
        }
    },
    async mounted(){
        await this.$store.dispatch("whoAmI");
        if (this.$store.state.isBookInitialized) return;
        this.loading = true;
        this.intervalID = setInterval(async ()=>{
            try {
                await this.$store.dispatch("initializeBooks");
                if (!this.$store.state.isBookInitialized){
                    this.errMsg = Config.serverError;
                }
                this.loading = false;
                clearInterval(this.intervalID);
            } catch (e){
                this.loading = false;
                this.errMsg = Config.connectionError;
            }
        }, 3000);
    },
    beforeUnmount(){
        clearInterval(this.intervalID);
    },
    components: { BookCard, Spinner, Alert, PageButtons }
}
</script>

<template>
    <Spinner :loading="loading"/>
    <div class="my-3 ms-4 search-input">
        <input type="search"
        v-model="searchTerm"/>
    </div>
    
    <div class="book-section px-5 py-3">
        <template v-for="book in books" :key="book.id">
            <BookCard :item="book" />
        </template>
    </div>
    <PageButtons :page="page" :totalPages="totalPages" @changepage="changePage"/>
    <Alert :floating="true" :message="errMsg"/>
</template>

<style scoped>
.book-section {
    display: grid;
    grid-template-columns: 20% 20% 20% 20% 20%;
}
@media screen and (max-width: 1200px){
    .book-section {grid-template-columns: 25% 25% 25% 25%;}
}
@media screen and (max-width: 992px){
    .book-section {grid-template-columns: 33.3% 33.3% 33.3%;}
}
@media screen and (max-width: 720px){
    .book-section {grid-template-columns: 50% 50%;}
}
@media screen and (max-width: 576px){
    .book-section {display: block;}
}

.search-input {
    position: relative;
}
.search-input>input[type=search] {
    border: none; outline: none;
    background-color: #fff;
    padding: 10px 15px 10px 45px;
    border-radius: 30px;
    width: 50%;
    box-shadow: 0px 2px 4px 0.5px rgba(0,0,0,0.2);
}
.search-input:before {
    content: url("../../assets/search.svg");
    position: absolute;
    top: 0%; left: 0%;
    opacity: 0.3;
    transform: scale(60%, 60%);
}
</style>