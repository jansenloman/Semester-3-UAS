<script>
import { Book } from '../../classes';
import { RouterLink } from 'vue-router';

export default {
    props: {
        item: {
            type: Book,
            required: true,
        }
    },
    data(){
        return {showOriginalImage:true}
    },
    computed: {
        editPageHref(){
            return "/edit/" + this.item.id;
        },
        canEdit(){
            return (this.$store.state.user?.id === this.$props.item.author.id);
        }
    },
    methods: {
        imageNotAvailable(){
            this.showOriginalImage = false;
        },
        viewBookInfo(){
            this.$router.push({path: '/info/' + this.item.id});
        }
    },
    async mounted(){
        await this.$store.dispatch("whoAmI");
    },
    components: { RouterLink }
}
</script>

<template>
    <div class="card m-2" :title="item.desc"  @click="viewBookInfo">
        <img v-if="showOriginalImage" :src="item.img" :alt="item.title" class="card-img-top" loading="lazy" @error="imageNotAvailable">
        <img v-else src="../../assets/image-not-available.jpg" :alt="item.title" class="card-img-top">
        <div class="card-body">
            <h5 class="card-title">{{ item.title }}</h5>
            <p class="text-muted">{{ item.author.name }}</p>
            <p class="card-text d-md-block d-none">{{ item.desc }}</p>
        </div>
        <div class="card-footer bg-light-subtle d-flex justify-content-between" @click.stop>
            <a class="btn btn-primary" :href="item.filename" download>
                Download
            </a>
            <RouterLink class="btn btn-primary" :to="editPageHref" v-if="canEdit">
                Edit
            </RouterLink>
        </div>
    </div>
</template>

<style>
.card {transition: transform 0.2s ease-out, background-color 0.2s ease-out;}
.card:hover {
    transform: scale(102%, 102%);
    background-color: #f0f0f0;
}

.bookmark-btn:hover { background-color: var(--bs-primary); }
.bookmark-btn.is-bookmarked { background-color: var(--bs-primary); }
</style>