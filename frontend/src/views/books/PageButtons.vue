<script>
export default {
    props: {
        page: {type: Number, required: true},
        totalPages: {type: Number, required: true},
        maxPageButtons: {type:Number, default: 8}
    },
    emits: ["changePage"],
    computed: {
        pageButtons(){
            const pages = [];
            const startPage = Math.max(1, this.$props.page+1-3);
            if (startPage != 1){
                pages.push(1);
            }
            const endPage = Math.min(this.$props.totalPages, startPage+this.$props.maxPageButtons);
            for (let i = startPage; i <= endPage; i++)
                pages.push(i);
            if (endPage != this.$props.totalPages){
                pages.push(this.$props.totalPages);
            }
            return pages;
        },
    },
}
</script>

<template>
    <div class="mb-2 ms-4">
        <template v-for="pg in pageButtons">
            <button @click="$emit('changePage',pg)" class="btn page-button" :class="{'btn-primary': page+1 == pg}">{{ pg }}</button>
        </template>
    </div>
</template>