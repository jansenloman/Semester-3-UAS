<script>
export default {
    // https://vuejs.org/guide/components/v-model.html
    props: {
        value: {type: Boolean, default: false},
        name: {type: String, required: true},
        error: {type: String, default: ""}
    },
    emits: ["update:value", "change"],
    data(){
        return {
            identifier: "toggle-input-" + Math.random().toString(16).substring(2)
        }
    }
}
</script>

<template>
    <div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" role="switch" :id="identifier" :checked="value" @change="$emit('update:value', !value)">
        <label class="form-check-label" :for="identifier">{{ name }}</label>
        <div class="invalid-feedback" :class="{'d-block': error.length > 0}">{{ error }}</div>
    </div>
</template>