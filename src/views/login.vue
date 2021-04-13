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
                            this.setTimeIn(this.employeeDetails)
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
        setTimeIn(value) {
            let dtToday = null
            let serverData = {}
            let startShift = this.moment.utc(value.StartTime)
            let endShift = this.moment.utc(value.EndTime)
            this.loading = true

            this.axios.get(`${this.asd_sql}/getclientip.php`).then(res => {
                //Get Server Date Time
                serverData = res.data
                this.$store.commit('CHANGE_SERVERDATETTIME', serverData.SERVERDATETIME)
                
                dtToday = this.moment(this.serverDateTime)

                // format shift for ORACLE
                value.StartTime = `${dtToday.format('YYYY-MM-DD')} ${startShift.format('HH:mm:ss')}`
                value.EndTime = `${dtToday.format('YYYY-MM-DD')} ${endShift.format('HH:mm:ss')}`
                
                // Check if employee already logged in 
                if(!value.TimeIn && value.UserLevel == 0) {                
                    let body = {
                        procedureName: 'Logtime.dbo.ProcInsertLogTimeData',
                        values: [
                            `LT${dtToday.format('MMYYYY')}`, 
                            value.ShortName, 
                            `${value.EmployeeCode}${dtToday.format('MMDDYYYY')}`,
                            value.EmployeeCode, 
                            dtToday.format('YYYY-MM-DD'), 
                            this.serverDateTime, // Time In
                            value.TimeOut, 
                            value.NoHrs, 
                            value.Undertime, 
                            this.setTardiness(this.serverDateTime, value.StartTime), //Tardiness, 
                            value.Overtime, 
                            value.ND, 
                            value.Shift, 
                            1, // SW1
                            value.SW2,
                            value.UserAcct, 
                            value.UserAcctO, 
                            value.UserTime, 
                            value.UserTimeO, 
                            '121', // Manual Rem
                            value.ManualRemO, 
                            value.ND1, 
                            value.ND2, 
                            value.NoHrs1, 
                            value.PayCode,
                            value.DayOff,
                            value.OTCode,
                            1, // Meal
                            value.MealOCC,
                            value.PostOT,
                            value.Leave,
                            value.TransIn,
                            value.TransOut,
                            value.DepartmentCode,
                            value.SectionCode,
                            value.TeamCode,
                            value.DesignationCode,
                            1
                        ]
                    }
                    // console.log(value)
                    this.axios.post(`${this.api}/execute`, {data: JSON.stringify(body)})
                }
                this.loading = false
                this.$store.commit('CHANGE_USER_INFO', value)
                this.$store.commit('CHANGE_USER_LOGGING', true)
                if(value.UserLevel == 0) {
                    this.$router.push('/dashboard')
                } else {
                    this.$router.push('/dashboardleaders')
                }
            })
        },
        setTardiness(timeIn, startTime) {
            let duration = null
            let timeInVal = this.moment(timeIn, 'YYYY-MM-DD HH:mm:ss')
            let startTimeVal = this.moment(startTime, 'YYYY-MM-DD HH:mm:ss')
            duration = this.calculateDates(startTimeVal, timeInVal)
            return duration.hours
        }, 
        calculateDates(date1, date2) {

            let years = date1.diff(date2, 'year');
            date2.add(years, 'years');

            let months = date1.diff(date2, 'months');
            date2.add(months, 'months');

            let days = date1.diff(date2, 'days');
            date2.add(days, 'days');

            let hours = date1.diff(date2, 'hours', true);
            date2.add(hours, 'hours');

            let minutes = date1.diff(date2, 'minutes', true);
            date2.add(minutes, 'minutes');

            let seconds = date1.diff(date2, 'seconds');

            return {years, months, days, hours, minutes, seconds};
        }
    }
} 
</script>