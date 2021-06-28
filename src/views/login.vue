<template>
    <v-main class="teal lighten-3">
        <v-container class="fill-height" fluid>
            <v-row align="center" justify="center">
                <v-col cols="12" lg="3" md="5" sm="7">
                    <v-card class="rounded-lg" elevation="12">
                        <v-row align="center" justify="center">
                            <v-col class="mt-n9" cols="12" md="12" >
                                <v-card-text class="mt-n10 pa-0 text-center">
                                    <v-avatar size="126">
                                        <v-img src="../assets/5578.jpg">
                                            <template v-slot:placeholder>
                                                <v-sheet color="grey-lighten-4">
                                                    <v-skeleton-loader
                                                        class="mx-auto"
                                                        type="image"
                                                    ></v-skeleton-loader>
                                                </v-sheet>
                                            </template>
                                        </v-img>
                                    </v-avatar>
                                </v-card-text>
                            </v-col>
                        </v-row>
                        <v-row align="center" justify="center">
                            <v-col cols="12" md="11">                                
                                <v-card-text class="text-center headline">Login to your account</v-card-text>
                                <v-container fluid>
                                <v-alert
                                    class="pa-2 mb-5"
                                    v-model="alert"
                                    transition="scale-transition"
                                    type="error"
                                    border="left"
                                    outlined
                                    dismissible
                                    dense
                                    text
                                >
                                    <v-subheader class="pa-0 caption">{{alertText}}</v-subheader>
                                </v-alert>
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
                                            @keypress.enter="userLoggedIn()"
                                        ></v-text-field>
                                    </v-form>
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
            alertText: null,
            alert: false,
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
        userLoggedIn() { 
            let body = {
                procedureName: 'Logtime.dbo.ProcGetLogTimeDataUser',
                values: [
                    this.moment().format('YYYY-MM-DD'),
                    this.username
                ] 
            }
            this.axios.post(`${this.api}/executeselect`,  {data: JSON.stringify(body)}).then(res => {
                this.employeeDetails = res.data[0]
                // check if record exists
                if(this.employeeDetails != undefined) {
                    // check leave
                    if(!this.checkLeave()) {
                        this.alert = true
                        this.alertText = `You are currently on ${this.employeeDetails.LeaveDesc} leave`
                    } else {
                        // check password
                        if(this.md5(this.password) == this.employeeDetails.Password) {
                            this.setTimeIn(this.employeeDetails)
                        } else {
                            this.alert = true
                            this.alertText = 'Username and/or Password do not match. Please try again'
                        }
                    }
                } else {
                    this.alert = true
                    this.alertText = 'Account does not exists. Please contact your administrator'
                }
            })
        },
        checkLeave() {
            if(this.employeeDetails.Leave == '1') {
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
            this.loading = true
            let dtToday = null
            let startShift = this.moment.utc(value.StartTime)
            let endShift = this.moment.utc(value.EndTime)
                
            dtToday = this.moment.utc(this.serverDateTime)

            // format shift for ORACLE
            value.StartTime = `${dtToday.format('YYYY-MM-DD')} ${startShift.format('HH:mm:ss')}`
            value.EndTime = `${dtToday.format('YYYY-MM-DD')} ${endShift.format('HH:mm:ss')}`
            
            // Check if employee already logged in 
            if(value.TimeIn == null) {                
                let body = {
                    procedureName: 'Logtime.dbo.ProcInsertLogTimeData',
                    values: [
                        `LT${dtToday.format('MMYYYY')}`, 
                        value.ShortName, 
                        `${value.EmployeeCode}${dtToday.format('MMDDYYYY')}`,
                        value.EmployeeCode, 
                        dtToday.format('YYYY-MM-DD'), // LogDateTime
                        dtToday.format('YYYY-MM-DD HH:mm:ss'), // Time In
                        value.TimeOut, 
                        value.NoHrs, 
                        value.Undertime, 
                        this.computeTardiness(value, dtToday.format('YYYY-MM-DD HH:mm:ss')), //value.Tardiness,
                        value.Overtime, 
                        value.ND, 
                        value.Shift, 
                        1, // SW1
                        value.SW2,
                        'PORTAL', //value.UserAcct, 
                        value.UserAcctO, 
                        dtToday.format('YYYY-MM-DD HH:mm:ss'), //value.UserTime, 
                        value.UserTimeO, 
                        '121', // Manual Rem
                        value.ManualRemO, 
                        value.ND1, 
                        value.ND2, 
                        value.NoHrs1, 
                        value.PayCode,
                        value.DayOff,
                        value.OTCode,
                        value.Meal,
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
                // console.log(body)
                //Update Logtime Table
                this.axios.post(`${this.api}/execute`, {data: JSON.stringify(body)})
                setTimeout(() => {
                    this.getLogTimeTableRecord()
                    this.loading = false
                }, 2000)
            } else {
                this.getLogTimeTableRecord()
            }
        },
        computeTardiness(data, timeIn) {
            let dtToday = this.moment.utc(data.LogDateTime).format('YYYY-MM-DD')
            let timeInVal = this.moment.utc(timeIn)
            let shiftStartTime = this.moment.utc(data.StartTime)
            let tempStartTime = this.moment.utc(`${dtToday} ${shiftStartTime.format('hh:mm:ss')}`)
            let duration = this.calculateDates(timeInVal, tempStartTime)
            
            if(isNaN(duration.hours) || duration.hours == undefined) {
                return 0 
            } else {
                return duration.hours < 0 ? 0 : duration.hours.toFixed(2)
            }
        },
        getLogTimeTableRecord() {
            let tempEmployeeData = null
            let body = {
                procedureName: 'Logtime.dbo.ProcGetLogTimeDataUser',
                values: [
                    this.moment().format('YYYY-MM-DD'),
                    this.username
                ] 
            }
            this.axios.post(`${this.api}/executeselect`,  {data: JSON.stringify(body)}).then(res => {
                tempEmployeeData = res.data[0]
                if(!tempEmployeeData.TimeOut) {
                    this.updateORALogtime(tempEmployeeData)
                } else {
                    this.$store.commit('CHANGE_USER_INFO', tempEmployeeData)
                    this.$store.commit('CHANGE_USER_LOGGING', true)
                    this.$router.push(`/${this.md5('dashboard')}`)
                }
            })
        },
        updateORALogtime(value) {
            let dtToday = this.moment.utc(this.serverDateTime)
            let cutOffValues = this.getCutOffValues(value.LogDateTime, value.EmployeeCode)
            let body = {
                server: process.env.NODE_ENV ==='production' ? `HRIS${value.ShortName}` : `HRIS${value.ShortName.toLowerCase()}test`,
                procedureName: 'HRIS.PROCUPDATELOGTIME',
                values: [
                    value.EmployeeCode, 
                    this.moment(value.LogDateTime).format('YYYY-MM-DD'),
                    `${dtToday.format('YYYY-MM-DD')} ${this.moment.utc(value.StartTime).format('HH:mm:ss')}`,
                    `${dtToday.format('YYYY-MM-DD')} ${this.moment.utc(value.EndTime).format('HH:mm:ss')}`,
                    8, 
                    0, 
                    0,
                    0,
                    1, 
                    1, 
                    'R',
                    '121', 
                    '121', 
                    cutOffValues.serialNo,
                    cutOffValues.cutOffDate,
                    '4',
                    'PORTAL',
                    this.moment().format('YYYY-MM-DD')
                ]
            }
            // console.log(body)
            this.axios.post(`${this.asd_sql}/ora_procedure.php`, {data: JSON.stringify(body)}).then(() => {
                this.$store.commit('CHANGE_USER_INFO', value)
                this.$store.commit('CHANGE_USER_LOGGING', true)
                this.$router.push(`/${this.md5('dashboard')}`)
            })
        },
        getCutOffValues(val, code) {
            let lastDate = {}
            let dayVal = this.moment(val).format('DD')
            if(dayVal >= 6 && dayVal <= 20) {
                lastDate = {
                    Year: this.moment(val).format('YYYY'),
                    Month: this.moment(val).format('MM'),
                    Day: this.moment(val).daysInMonth('D')
                } 
                return {
                    cutOff: 2,
                    cutOffDate: this.moment(`${lastDate.Year}-${lastDate.Month}-${lastDate.Day}`).endOf('month').format('YYYY-MM-DD'),
                    serialNo: `2${this.moment(val).format('YY')}${lastDate.Month}${code}`
                }
            } else {
                lastDate = {
                    Year: this.moment(val).format('YYYY'),
                    Month: dayVal >= 1 && dayVal <= 5 ? this.moment(val).format('MM') : this.moment(val).add(1, 'months').format('MM'),
                    Day: this.moment(val).daysInMonth('D')
                } 
                return {
                    cutOff: 1,
                    cutOffDate: this.moment(`${lastDate.Year}-${lastDate.Month}-15`).format('YYYY-MM-DD'),
                    serialNo: `1${this.moment(val).format('YY')}${lastDate.Month}${code}`
                }
            }
        },
        clearVariables() {  
            this.alert = false
            this.alertText = null
            this.employeeDetails = null
            this.username = ''
            this.password = ''
        },
    },
    watch: {
        username() {
            this.alert = false
            this.alertText = null
        },
        password() {
            this.alert = false
            this.alertText = null
        }
    }
} 
</script>