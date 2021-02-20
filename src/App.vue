<template>
    <v-app id="inspire">
        <navdrawer v-if="logtimeuserinfo.EmployeeCode != undefined" />
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