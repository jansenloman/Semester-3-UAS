<script>
export default {
    // https://vuejs.org/guide/components/v-model.html
    props: {
        value: {},
        name: {type: String, required: true},
        error: {type: String, default: ""}
    },
    emits: ["update:value", "keyup"],
    data(){
        return {
            identifier: "text-input-" + Math.random().toString(16).substring(2)
        }
    }
}
</script>

<template>
<div class="form-floating mb-3">
    <input class="form-control" :id="identifier" type="email" name="email"
    placeholder="Email" :value="value" @input="$emit('update:value', $event.target.value)" @keyup="$emit('keyup', $event)"/>
    <label :for="identifier">{{ name }}</label>
    <div class="invalid-feedback" :class="{'d-block': error.length > 0}">{{ error }}</div>
</div>
</template>