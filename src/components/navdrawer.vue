<template>
    <v-app-bar fixed app>
        <v-spacer></v-spacer>
        <v-avatar size="40">
            <v-img :src="`${photo}/${logtimeInfo.userinfo.EmployeeCode}.jpg`"></v-img>
        </v-avatar>
        <v-toolbar-items>
            <v-card-text>{{logtimeInfo.userinfo.FirstName}}</v-card-text>
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
        userLoggedOut(value) {
            if(!value.TimeOut && value.LogType == 1) {
                this.swal.fire({
                    text: 'Do you want to logged out?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: 'teal',
                    confirmButtonText: 'Log out'
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.setUserLogOut(value)
                    }
                })
            } else {
                this.setUserLogOut(value)
            }
        },
        setUserLogOut(value) {
            //Compute duration
            let timeInVal = this.moment.utc(value.TimeIn)
            let timeOutVal  = this.moment.utc(this.logtimeInfo.serverDateTime)
            let timeLogOut = timeOutVal.format('YYYY-MM-DD HH:mm:ss')
            if(this.moment(value.LogDateTime).format('YYYY-MM-DD') != timeOutVal.format('YYYY-MM-DD')) {
                timeLogOut = `${this.moment(value.LogDateTime).format('YYYY-MM-DD')} ${this.moment(value.EndTime).format('HH:mm:ss')}`
            }
            let duration = this.calculateDates(timeOutVal, timeInVal)
            let body = {
                procedureName: 'Logtime.dbo.ProcInsertLogTimeData',
                values: [
                    `LT${this.moment(value.LogDateTime).format('MMYYYY')}`, 
                    value.ShortName, 
                    value.IDCode,
                    value.EmployeeCode, 
                    value.LogDateTime,
                    value.TimeIn,
                    timeLogOut, //TimeOut
                    duration.hours >= 8 ? 8 : parseFloat((duration.hours).toFixed(2)), //NoHrs
                    this.computeUndertime(value, timeOutVal), //value.Undertime, 
                    value.Tardiness, 
                    this.computeOvertime(value, timeLogOut), //value.Overtime,
                    value.ND, 
                    value.Shift, 
                    value.SW1, 
                    1, 
                    value.UserAcct, 
                    value.UserAcctO, 
                    value.UserTime, 
                    value.UserTimeO, 
                    value.ManualRem, 
                    '121', //ManualRemO, 
                    value.ND1, 
                    value.ND2, 
                    value.NoHrs1, 
                    value.OTCode == 'RD' ? 'R' : 'O', // PayCode
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
            // Work From Home
            if(value.LogType == 1 && !value.TimeOut) {
                this.axios.post(`${this.api}/execute`, {data: JSON.stringify(body)})
            }
            this.$store.commit('CHANGE_USER_INFO', {})
            this.$store.commit('CHANGE_USER_LOGGING', false)
            this.$store.commit('CHANGE_SERVERDATETTIME', '')
            this.$router.push("/")
        },
        computeOvertime(value, timeOut) {
            let dtToday = this.moment.utc(value.LogDateTime).format('YYYY-MM-DD')
            let timeOutVal = this.moment.utc(timeOut)
            let shiftEnd = this.moment.utc(value.EndTime)
            let tempEndTime = this.moment.utc(`${dtToday} ${shiftEnd.format('HH:mm:ss')}`) 

            if(timeOutVal > tempEndTime) {
                let duration = this.calculateDates(timeOutVal, tempEndTime)
                if(!isNaN(duration.hours) || duration.hours != undefined) {
                    return duration.hours.toFixed(2) < 0.5 ? 0 : duration.hours.toFixed(2)
                } else {
                    return 0
                }
            } else {
                return 0
            }
        },
        computeUndertime(value, timeOut) {
            let dtToday = this.moment.utc(value.LogDateTime).format('YYYY-MM-DD')
            let timeOutVal = this.moment.utc(timeOut)
            let shiftEnd = this.moment.utc(value.EndTime)
            let tempEndTime = this.moment.utc(`${dtToday} ${shiftEnd.format('HH:mm:ss')}`)
            let duration = this.calculateDates(tempEndTime, timeOutVal)
            if(!isNaN(duration.hours) || duration.hours != undefined) {
                return duration.hours <= 0 ? 0 : duration.hours - 1
            } else {
                return 0
            }
        },
    }
}
</script>       