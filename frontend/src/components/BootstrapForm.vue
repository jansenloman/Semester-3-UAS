<script>
import { InputObject, RadioInputObject } from "./InputObject";
import FloatingInput from "./FloatingInput.vue";
import RadioInput from "./RadioInput.vue";
import FileInput from "./FileInput.vue";

export default {
    props: {
        action: { type: String, required: true },
        method: {
            type: String,
            required: true,
            validator(value) {
                return ["get", "post", "put", "delete"].includes(value.toLowerCase());
            }
        },
        inputs: {
            type: Array,
            required: true,
            validator(value) {
                return value.every(x => x instanceof InputObject);
            }
        },
        validateFromStart: {
            type: Boolean,
            default: false,
        },
        purpose: {
            type: String,
            default: "Submit",
        }
    },
    emits: ["submit"],
    data() {
        const errors = {};
        const formBody = this.$props.inputs.map(x => x.copy());
        this.$props.inputs.forEach(x => {errors[x.name] = ""});
        return {
            isValidating: this.validateFromStart,
            formBody, errors,
        };
    },
    methods: {
        validate() {
            this.isValidating = true;
            let hasError = false;
            for (let input of this.formBody){
                this.errors[input.name] = input.validate();
                hasError = hasError || (this.errors[input.name].length > 0)
            }
            if (hasError) return;

            const response = {};
            this.formBody.forEach(x => {response[x.name] = x.value});
            this.$emit("submit", response);
        },
        validateInput(inputObj) {
            if (!this.isValidating)
                return;
            this.errors[inputObj.name] = inputObj.validate();
        }
    },
    components: { FloatingInput, RadioInput, FileInput }
}
</script>

<template>
    <div class="form col-xl-6 col-lg-8 col-10 shadow px-3 rounded-2 py-4">
        <form :action="action" :method="method" class="needs-validation" autocomplete="off"
            novalidate @submit.prevent="validate">
            <slot name="header"></slot>
            <template v-for="input in formBody">
                <FloatingInput v-if="input.type == 'text'" v-model:value="input.value"
                    :name="input.name" :error="errors[input.name]" @keyup="validateInput(input)"/>
                <RadioInput v-if="input.type == 'radio'" v-model:value="input.value"
                    :options="input.options" :name="input.name" :error="errors[input.name]"/>
                <FileInput v-if="input.type === 'file'" v-model:value="input.value"
                    :accept="input.accept" :name="input.name" :error="errors[input.name]"/>
            </template>
            <slot name="after"></slot>
            <input class="btn btn-primary w-100 py-2 fs-5" type="submit" :value="purpose"/>
            <slot name="footer"></slot>
        </form>
    </div>
</template>

<style>
.form {
    width: 90%;
    max-width: 996px;
    background-color: white;
}
</style>