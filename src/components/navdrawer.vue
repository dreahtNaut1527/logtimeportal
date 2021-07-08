<template>
    <v-app-bar fixed app>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
                <v-btn class="mx-2" v-bind="attrs" v-on="on" @click="goToManual()" icon>
                    <v-icon>mdi-help-circle-outline</v-icon>
                </v-btn>
            </template>
            <span>Help</span>
        </v-tooltip>
        <v-avatar size="40">
            <v-img :src="`${photo}/${logtimeInfo.userinfo.EMPLCODE}.jpg`"></v-img>
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
        goToManual() {
            window.open('http://10.169.141.8:5050/JaeAnn/logtimeportal_web/-/wikis/Manual', '_blank')
        },
    }
}
</script>       