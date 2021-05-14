<template>
    <v-app id="inspire">
        <navdrawer v-if="logtimeuserinfo.EmployeeCode != undefined" />
        <router-view />
    </v-app>
</template>

<script>
import navdrawer from "@/components/navdrawer";

export default {
    mounted() {
        setInterval(() => {
            this.checkAppVersion()
        }, 1000);
    },
    components: {
        navdrawer
    }
}
</script>