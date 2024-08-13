<script>
import { Review } from "../../classes";
export default {
    props: {
        item: {
            type: Review,
            required: true,
        }
    },
    emits: ["delete"],
    data(){
        return {
            deleting: false,
        }
    },
    computed: {
        isMyReview(){
            return this.$store.state.user.id === this.$props.item.user.id;
        }
    },
    methods: {
        deleteReview(){
            this.deleting = true;
            setTimeout(()=>{
                this.$emit("delete");
            }, 500);
        },
    },
}
</script>

<template>
<li class="list-group-item bg-light-subtle py-1 px-2 my-2 rounded review-item"
    :class="{'d-flex': isMyReview, 'justify-content-between': isMyReview, 'deleting': deleting}">
    <div>
        <p class="my-0"><b>{{ item.user.name }}</b> <span class="text-muted">({{ item.timeString }})</span></p>
        <p>{{ item.comment }}</p>
    </div>
    <button v-if="isMyReview" class="btn btn-danger p-0" @click="deleteReview">
        <img src="../../assets/delete.svg" alt="Delete"/>
    </button>
</li>
</template>

<style>
.review-item {
    white-space: pre;
}
.deleting {
    animation: delete-animation 0.5s;
}
@keyframes delete-animation {
    from {
        transform: translateX(0vw);
    }
    to {
        transform: translateX(50vw);
        margin-bottom: -10%;
    }
}
</style>