<template>
    <v-main class="teal lighten-3">
        <v-container class="fill-height">
            <v-row align="center" justify="center">
                <v-col cols="12" md="4">
                    <v-card class="rounded-lg" elevation="12">
                        <v-row align="center" justify="center">
                            <v-col class="mt-n9" cols="12" md="12" >
                                <v-card-text class="mt-n10 pa-0 text-center">
                                    <v-avatar size="126">
                                        <v-img src="../assets/5578.jpg"></v-img>
                                    </v-avatar>
                                </v-card-text>
                            </v-col>
                        </v-row>
                        <v-row align="center" justify="center">
                            <v-col cols="12" md="11">                                
                                <v-card-text class="text-center headline">Login to your account</v-card-text>
                                <v-container>
                                    <v-form ref="forms">
                                        <v-text-field
                                            v-model="username"
                                            color="teal"
                                            label="Username"
                                            append-icon="mdi-account"
                                            @blur="getUserInfo()"
                                            rounded
                                            outlined
                                        ></v-text-field>
                                        <v-text-field
                                            v-model="password"
                                            color="teal"
                                            label="Password"
                                            type="password"
                                            append-icon="mdi-lock"
                                            rounded
                                            outlined
                                            @keypress.enter="userLoggedIn()"
                                        ></v-text-field>
                                    </v-form>
                                    <v-checkbox
                                        class="ma-0 pa-0"
                                        color="teal"
                                        v-model="remember"
                                        label="Remember Me"
                                        dense
                                    ></v-checkbox>
                                    <v-card-actions class="ma-0 pa-0">
                                        <v-spacer></v-spacer>
                                        <v-btn class="px-7" @click="userLoggedIn()" color="teal darken-1" dark >Login</v-btn>
                                    </v-card-actions>
                                </v-container>
                            </v-col>
                        </v-row>
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
            loading: false,
            remember: false,
            username: '',
            password: '',
            employeeDetails: {}
        }
    },
    created() {
        this.$store.commit('CHANGE_USER_INFO', {})
        this.$store.commit('CHANGE_USER_LOGGING', false)
    },
    methods: {
        getUserInfo() {
            this.loading = true
            let body = {
                procedureName: 'Logtime.dbo.ProcGetLogTimeDataUser',
                values: [
                    `LT${this.moment().format('MMYYYY')}`,
                    this.moment().format('YYYY-MM-DD'),
                    this.username
                ]
            }
            this.axios.post(`${this.api}/executeselect`,  {data: JSON.stringify(body)}).then(res => {
                if(Array.isArray(res.data)) {
                    this.employeeDetails = res.data[0]
                }
                this.loading = false
            })
        },
        userLoggedIn() {
            if(this.md5(this.password) == this.employeeDetails.PASSWORD) {
                this.$store.commit('CHANGE_USER_INFO', this.employeeDetails)
                this.$store.commit('CHANGE_USER_LOGGING', true)
                this.$router.push('/dashboard')
            } else {
                alert('Not okay')
            }
        }
    }
} 
</script>