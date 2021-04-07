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
                                            @keypress.enter="getUserInfo()"
                                        ></v-text-field>
                                    </v-form>
                                    <v-card-actions class="ma-0 pa-0">
                                        <v-spacer></v-spacer>
                                        <v-btn class="px-7" @click="getUserInfo()" color="teal darken-1" dark >Login</v-btn>
                                    </v-card-actions>
                                </v-container>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
        <v-overlay :value="loading">
            <v-progress-circular
                indeterminate
                size="64"
            ></v-progress-circular>
        </v-overlay>
    </v-main>
</template>

<script>
export default {
    data() {
        return {
            valid: true,
            loading: false,
            username: '',
            password: '',
            employeeDetails: {}
        }
    },
    created() {
        this.$store.commit('CHANGE_USER_INFO', {})
        this.$store.commit('CHANGE_USER_LOGGING', false)
        this.$store.commit('CHANGE_SERVERDATETTIME', '')
    },
    methods: {
        getUserInfo() {
            let body = {
                procedureName: 'Logtime.dbo.ProcGetLogTimeDataUser',
                values: [
                    this.moment().format('YYYY-MM-DD'),
                    this.username
                ] 
            }
            this.axios.post(`${this.api}/executeselect`,  {data: JSON.stringify(body)}).then(res => {
                if(Array.isArray(res.data)) {
                    this.employeeDetails = res.data[0]
                    this.userLoggedIn()
                }
            })
        },
        userLoggedIn() { 
            // check if record exists
            if(this.employeeDetails != undefined) {
                // check logtime
                if(!this.checkLogtime()) {
                    this.swal.fire('Sorry! :(', 'Unable to login today. Already logged out', 'error')
                    this.clearVariables()
                } else {
                    // check leave
                    if(!this.checkLeave()) {
                        this.swal.fire('Sorry! :(', `You are currently on ${this.employeeDetails.LeaveDesc} leave`, 'error')
                        this.clearVariables()
                    } else {
                        // check password
                        if(this.md5(this.password) == this.employeeDetails.Password) {
                            // if(!this.employeeDetails.TimeIn && !this.employeeDetails.TimeOut) {
                            //     this.setTimeIn()
                            // } else {
                            // }
                            this.setTimeIn()
                        } else {
                            this.swal.fire('Oh no!', 'Username or Password is incorrect. Please try again', 'error')
                        }
                    }
                }
            } else {
                this.clearVariables()
                this.swal.fire('Sorry! :(', 'No record exists. Please contact your administrator', 'error')
            }
        },
        clearVariables() {
            this.employeeDetails = undefined
            this.username = ''
            this.password = ''
        },
        checkLeave() {
            if(this.employeeDetails.Leave != '0') {
                return false
            } else {
                return true
            }
        },
        checkLogtime() {
            if((this.employeeDetails.TimeIn && this.employeeDetails.TimeOut)) {
                return false
            } else {
                return true
            }
        },
        setTimeIn() {
            this.loading = true
            let serverData = {}
            let startShift = ''
            let endShift = ''

            //Get Server Date Time
            this.axios.get(`${this.asd_sql}/getclientip.php`).then(res => {
                serverData = res.data
                this.$store.commit('CHANGE_SERVERDATETTIME', serverData.SERVERDATETIME)

                // format shift for ORACLE
                startShift = `${this.moment().format('YYYY-MM-DD')} ${this.moment.utc(this.employeeDetails.StartTime).format('HH:mm:ss')}`
                endShift = `${this.moment().format('YYYY-MM-DD')} ${this.moment.utc(this.employeeDetails.EndTime).format('HH:mm:ss')}`

                this.employeeDetails.StartTime = this.moment(startShift).format('YYYY-MM-DD HH:mm:ss')
                this.employeeDetails.EndTime = this.moment(endShift).format('YYYY-MM-DD HH:mm:ss')
                // this.employeeDetails.TimeIn = this.moment('2021-04-06 05:25:22').format('YYYY-MM-DD HH:mm:ss')
                this.employeeDetails.TimeIn = this.serverDateTime
                this.employeeDetails.SW1 = 1
                this.employeeDetails.ManualRem = '121' 
                this.employeeDetails.ManualRemO = '121'
                let body = {
                    procedureName: 'Logtime.dbo.ProcInsertLogTimeData',
                    values: [
                        `LT${this.moment().format('MMYYYY')}`, 
                        this.employeeDetails.ShortName, 
                        `${this.employeeDetails.EmployeeCode}${this.moment(this.serverDateTime).format('MMDDYYYY')}`,
                        this.employeeDetails.EmployeeCode, 
                        this.moment(this.serverDateTime).format('YYYY-MM-DD'), 
                        this.employeeDetails.TimeIn,
                        null, 
                        this.employeeDetails.NoHrs, 
                        this.employeeDetails.Undertime, 
                        this.employeeDetails.Tardiness, 
                        this.employeeDetails.Overtime, 
                        this.employeeDetails.ND, 
                        this.employeeDetails.Shift, 
                        this.employeeDetails.SW1, 
                        0, 
                        null, 
                        null, 
                        null,
                        null, 
                        this.employeeDetails.ManualRem, 
                        this.employeeDetails.ManualRemO, 
                        this.employeeDetails.ND1, 
                        this.employeeDetails.ND2, 
                        this.employeeDetails.NoHrs1, 
                        this.employeeDetails.PayCode,
                        this.employeeDetails.DayOff,
                        this.employeeDetails.OTCode,
                        this.employeeDetails.Meal,
                        this.employeeDetails.MealOCC,
                        this.employeeDetails.PostOT,
                        this.employeeDetails.Leave,
                        this.employeeDetails.TransIn,
                        this.employeeDetails.TransOut,
                        this.employeeDetails.DepartmentCode,
                        this.employeeDetails.SectionCode,
                        this.employeeDetails.TeamCode,
                        this.employeeDetails.DesignationCode,
                        1
                    ]
                }
                console.log(body)
                // this.axios.post(`${this.api}/execute`, {data: JSON.stringify(body)})
                this.loading = false
                this.$store.commit('CHANGE_USER_INFO', this.employeeDetails)
                this.$store.commit('CHANGE_USER_LOGGING', true)
                if(this.employeeDetails.UserLevel == 0) {
                    this.$router.push('/dashboard')
                } else {
                    this.$router.push('/dashboardleaders')
                }
            })
        }
    }
} 
</script>