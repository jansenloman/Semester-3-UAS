<script>
export default {
    props: {
        title: {type: String, default: "Accordion Item"},
        class: {type: String, default: ""},
    },
    data(){
        const identifier = Math.random().toString(16).substring(2);
        return {
            headingID: "accordion-heading-" + identifier,
            bodyID: "accordion-body-" + identifier,
        }
    },
}
</script>

<template>
<div class="accordion-item">
    <h2 class="accordion-header" :id="headingID">
        <button class="accordion-button" :class="class" type="button" data-bs-toggle="collapse" :data-bs-target="`#${bodyID}`" aria-expanded="true" :aria-controls="bodyID">
            <slot name="header">
                {{ title }}
            </slot>
        </button>
    </h2>
    <div :id="bodyID" class="accordion-collapse collapse bg-light-subtle show" :aria-labelledby="headingID">
        <div class="accordion-body">
            <slot></slot>
        </div>
    </div>
</div>
</template>