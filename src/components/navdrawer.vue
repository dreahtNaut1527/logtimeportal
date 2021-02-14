<template>
    <v-app-bar color="transparent" hide-on-scroll fixed flat dense app>
        <v-spacer></v-spacer>
        <v-toolbar-items>
            <v-card-text>{{userInfo.EMPLFNAME}}</v-card-text>
        </v-toolbar-items>
        <v-avatar size="40">
            <v-img :src="`${photo}/${userInfo.EMPLCODE}.jpg`"></v-img>
        </v-avatar>
    </v-app-bar>
</template>

<script>
export default {
    data() {
        return {
            
        }
    },
    methods: {
        myProfile() {
            window.open('http://adminsql1/employeemaster')
        }
    }
}
</script>   