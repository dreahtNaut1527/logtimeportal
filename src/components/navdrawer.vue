<template>
    <v-app-bar color="transparent" hide-on-scroll fixed app>
        <v-spacer></v-spacer>
        <v-avatar size="40">
            <v-img :src="`${photo}/${logtimeuserinfo.EmployeeCode}.jpg`"></v-img>
        </v-avatar>
        <v-toolbar-items>
            <v-card-text>{{logtimeuserinfo.FirstName}}</v-card-text>
            <v-spacer></v-spacer>
            <v-btn v-if="logtimeuserinfo.UserLevel != 0" @click="userLoggedOut()" icon><v-icon>mdi-logout</v-icon></v-btn>
        </v-toolbar-items>
    </v-app-bar>
</template>

<script>
export default {
    data() {
        return {
            
        }
    },
    methods: {
        userLoggedOut() {
            this.$store.commit('CHANGE_USER_INFO', {})
            this.$store.commit('CHANGE_SERVERDATETTIME', '')
            this.$router.push("/")
        }
    }
}
</script>   