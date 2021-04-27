<template>
    <v-app-bar fixed app>
        <v-spacer></v-spacer>
        <v-avatar size="40">
            <v-img :src="`${photo}/${logtimeuserinfo.EmployeeCode}.jpg`"></v-img>
        </v-avatar>
        <v-toolbar-items>
            <v-card-text>{{logtimeuserinfo.FirstName}}</v-card-text>
            <v-spacer></v-spacer>
            <v-btn v-if="logtimeuserinfo.UserLevel != 0" @click="userLoggedOut(logtimeuserinfo)" icon><v-icon>mdi-logout</v-icon></v-btn>
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
            //Compute duration
            let timeInVal = this.moment.utc(value.TimeIn)
            let timeOutVal  = this.moment.utc(this.serverDateTime)
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
                    parseFloat(duration.hours.toFixed(2) - 1), //NoHrs
                    value.Undertime, 
                    value.Tardiness, 
                    value.Overtime, 
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
            if(value.LogType == 1) {
                this.axios.post(`${this.api}/execute`, {data: JSON.stringify(body)})
            }
            this.$store.commit('CHANGE_USER_INFO', {})
            this.$store.commit('CHANGE_SERVERDATETTIME', null)
            this.$router.push("/")
        }
    }
}
</script>   