<script>
export default {
    // https://vuejs.org/guide/components/v-model.html
    props: {
        value: {},
        name: {type: String, required: true},
        error: {type: String, default: ""},
        accept: {type:String, default: '*'}
    },
    emits: ["update:value"],
    data(){
        return {
            identifier: "file-input-" + Math.random().toString(16).substring(2)
        }
    },
}
</script>

<template>
    <div class="mb-3">
        <label :for="identifier" class="form-label">{{ name }}</label>
        <input class="form-control" type="file" :id="identifier" @change="$emit('update:value', $event.target.files)" :accept="accept">
        <div class="invalid-feedback" :class="{'d-block': error.length > 0}">{{ error }}</div>
    </div>
</template>