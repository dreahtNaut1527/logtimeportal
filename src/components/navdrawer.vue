<template>
    <v-app-bar fixed app>
        <v-spacer></v-spacer>
        <v-avatar size="40">
            <v-img :src="`${photo}/${logtimeInfo.userinfo.EMPLCODE}.jpg`"></v-img>
        </v-avatar>
        <v-toolbar-items>
            <v-card-text>{{logtimeInfo.userinfo.EMPNAME}}</v-card-text>
        </v-toolbar-items>
    </v-app-bar>
</template>

<script>
export default {
    data() {
        return {
            
        }
    }
}
</script>       