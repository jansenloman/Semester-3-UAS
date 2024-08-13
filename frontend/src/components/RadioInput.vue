<script>
export default {
    props: {
        value: {},
        name: {type: String, required: true},
        options: {
            type: Array, required: true,
            validator(value){
                return value.every(x => {
                    return x instanceof String || (x.hasOwnProperty("value") && x.hasOwnProperty("name"))
                })
            }
        },
        error: {type: String, default: ""}
    },
    data(){
        return {
            identifier: "radio-input-" + Math.random().toString(16).substring(2)
        }
    },
    emits: ["update:value"],
    computed: {
        radio(){
            const radio = this.$props.options.map(x => {
                if (x instanceof String) return {name: x, value: x}
                else return x;
            });
            return radio;
        }
    }
}
</script>

<template>
    <div class="mb-3">
        {{ name }}
        <template v-for="opt in radio">
            <div class="form-check">
                <label class="form-check-label" :for="identifier">{{ opt.name }}</label>
                <input class="form-check-input" type="radio" name="gender" :value="opt.value"
                :id="identifier" :checked="value == opt.value" @change="$emit('update:value', opt.value)"/>
            </div>
        </template>
        <div class="invalid-feedback" :class="{'d-block': error.length > 0}">{{ error }}</div>
    </div>
</template>