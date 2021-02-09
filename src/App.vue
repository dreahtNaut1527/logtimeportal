<template>
    <v-app id="inspire">
        <navdrawer />
        <router-view />
    </v-app>
</template>

<script>
import navdrawer from "@/components/navdrawer";

export default {
    components: {
        navdrawer
    }
}
</script>