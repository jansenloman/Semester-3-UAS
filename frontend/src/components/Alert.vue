<script>
export default {
    props: {
        message: {
            type: String,
            default: "",
        },
        success: {
            type: Boolean,
            default: false,
        },
        floating: {
            type: Boolean,
            default: false,
        }
    },
}
</script>

<template>
    <div class="alert" :class="{'floating-error': floating, 'alert-success': success, 'alert-danger': !success}" role="alert" v-if="message.length > 0">
        <slot>{{ message }}</slot>
    </div>
</template>

<style>
.floating-error {
    position: fixed;
    bottom: 3%;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    max-width: 966px;
    text-align: center;
    z-index: 14;
}
</style>