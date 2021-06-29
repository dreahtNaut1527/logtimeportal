<template>
    <v-app id="inspire">
        <navdrawer v-if="logtimeInfo.userinfo.EmployeeCode != undefined" />
        <router-view />
        <navfooter v-if="logtimeInfo.userinfo.EmployeeCode != undefined" />
    </v-app>
</template>

<script>
import navdrawer from "@/components/navdrawer";
import navfooter from "@/components/navfooter";

export default {
    mounted() {
        setInterval(() => {
            this.checkAppVersion()
        }, 1000);
    },
    components: {
        navdrawer,
        navfooter
    }
}
</script>