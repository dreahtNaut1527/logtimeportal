<template>
    <v-main class="grey lighten-4">
        <v-container class="fill-height">
            <v-row align="center" justify="center">
                <v-col cols="12" md="4">
                    <v-card elevation="7">
                        <v-card-text class="text-center">
                            <v-container>
                                <v-card-text class="display-1">Login</v-card-text>
                            </v-container>
                            <v-container>                      
                                <v-form ref="forms">
                                    <v-text-field
                                        v-model="username"
                                        label="Username"
                                        append-icon="mdi-account"
                                        rounded
                                        outlined
                                        dense
                                    ></v-text-field>
                                    <v-text-field
                                        v-model="password"
                                        label="Password"
                                        append-icon="mdi-lock"
                                        rounded
                                        outlined
                                        dense
                                    ></v-text-field>
                                </v-form>
                                <v-checkbox
                                    v-model="remember"
                                    label="Remember Me"
                                ></v-checkbox>
                            </v-container>
                            <v-card-actions>
                                <v-btn class="primary" block>Login to your account</v-btn>
                            </v-card-actions>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-main>
</template>

<script>
export default {
    data() {
        return {
            valid: true,
            remember: false,
            username: '',
            password: '',
            employeeDetails: {}
        }
    },
    methods: {
        getUserInfo() {

        }
    }
}
</script>