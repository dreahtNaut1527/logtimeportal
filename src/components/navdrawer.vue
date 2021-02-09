<template>
    <div>
        <v-navigation-drawer
            v-model="drawer"
            app
        >
            <v-list>
                <v-list-item>
                        <v-list-item-content class="ma-2 text-center">
                            <v-list-item-avatar size="112">                                        
                                <img :src="`${photo}/33959.jpg`" alt="nopic.jpg">
                            </v-list-item-avatar>
                            <v-list-item-title class="headline">33959</v-list-item-title>
                            <v-list-item-subtitle>TUBAT, RENZEL JOHN B.</v-list-item-subtitle>
                            <v-list-item-subtitle>Programmer</v-list-item-subtitle>
                        </v-list-item-content>
                </v-list-item>
            </v-list>
            <v-divider></v-divider>
            <v-list
                nav
                dense
            >
                <v-list-item link>
                    <v-list-item-icon>
                    <v-icon>mdi-home-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Dashboard</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
        <v-app-bar color="transparent" dense flat app>
            <v-app-bar-nav-icon class="hidden-sm-and-up" @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-btn @click="myProfile()" text>
                    <v-icon left>mdi-account-outline</v-icon>
                    Profile
                </v-btn>
            </v-toolbar-items>
        </v-app-bar>
    </div>
</template>

<script>
export default {
    data() {
        return {
            drawer: true
        }
    },
    methods: {
        myProfile() {
            window.open('http://adminsql1/employeemaster')
        }
    }
}
</script>