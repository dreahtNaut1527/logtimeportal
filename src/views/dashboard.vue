<template>
    <v-main class="grey lighten-4">
        <v-card-text class="display-1 font-weight-bold">Dashboard</v-card-text>
        <v-container fluid>
            <v-row>
                <v-col cols="12" md="9">
                    <v-row>
                        <v-col cols="12" md="12">
                            <v-row align="center" justify="center">
                                <v-col cols="12" md="4">
                                    <v-card class="rounded-xl" elevation="4">
                                        <v-toolbar flat>
                                            <v-toolbar-title class="subtitle-1 font-weight-light">Present</v-toolbar-title>
                                            <v-spacer></v-spacer>
                                            <v-avatar class="mt-n10 rounded-pill" color="#CCB96C" size="60" tile>
                                                <v-icon x-large dark>mdi-account-check-outline</v-icon>
                                            </v-avatar>
                                        </v-toolbar>
                                        <v-card-text class="mt-n3 ml-2 display-1 font-weight-bold">
                                            {{filterTotalPresent.length == 0 ? 0 : filterTotalPresent.length + 1}}
                                        </v-card-text>
                                    </v-card>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-card class="rounded-xl" elevation="4">
                                        <v-toolbar flat>
                                            <v-toolbar-title class="subtitle-2 font-weight-light">Absent</v-toolbar-title>
                                            <v-spacer></v-spacer>
                                            <v-avatar class="mt-n10 rounded-pill" color="teal" size="60" tile>
                                                <v-icon x-large dark>mdi-exclamation-thick</v-icon>
                                            </v-avatar>
                                        </v-toolbar>
                                        <v-card-text class="mt-n3 ml-2 display-1 font-weight-bold">
                                            {{filterTotalAbsent.length}}
                                        </v-card-text>
                                    </v-card>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-card class="rounded-xl" elevation="4">
                                        <v-toolbar flat>
                                            <v-toolbar-title class="subtitle-2 font-weight-light">Total Hours</v-toolbar-title>
                                            <v-spacer></v-spacer>
                                            <v-avatar class="mt-n10 rounded-pill" color="#CC95C7" size="60" tile>
                                                <v-icon x-large dark>mdi-timer-sand</v-icon>
                                            </v-avatar>
                                        </v-toolbar>
                                        <v-card-text class="mt-n3 ml-2 display-1 font-weight-bold">
                                            {{totalHours}}
                                        </v-card-text>
                                    </v-card>
                                </v-col>
                            </v-row>    
                        </v-col>
                        <v-col cols="12" md="12">
                            <v-card elevation="8" class="rounded-xl">
                                <v-container v-if="!calendarView" fluid>
                                    <v-toolbar flat>
                                        <v-toolbar-title class="font-weight-bold">Logtime</v-toolbar-title>
                                        <v-spacer></v-spacer>
                                        <v-btn class="mx-3" @click="prevMonth()" :disabled="loading" :dark="!loading" color="teal" x-small fab><v-icon>mdi-chevron-left</v-icon></v-btn>
                                        {{moment(dtLogtime).format("MMMM YYYY")}}
                                        <v-btn class="mx-3" @click="nextMonth()" :disabled="loading" :dark="!loading" color="teal" x-small fab><v-icon>mdi-chevron-right</v-icon></v-btn>
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-btn @click="calendarView = !calendarView" v-on="on" v-bind="attrs" color="teal" x-small dark fab>
                                                    <v-icon>mdi-calendar</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>Calendar View</span>
                                        </v-tooltip>
                                    </v-toolbar>
                                    <v-divider></v-divider>
                                    <v-data-table
                                        :headers="headers"
                                        :items="filterLogtime"
                                        :loading="loading"
                                        :page.sync="page"
                                        :items-per-page="9"
                                        loading-text=""
                                        @page-count="pageCount = $event"
                                        hide-default-footer
                                    >
                                    
                                        <template v-slot:progress>
                                            <v-sheet height="300">
                                                <v-container class="fill-height">
                                                    <v-row class="text-center" align="center" justify="center">
                                                        <v-col cols="12" md="12">
                                                            <v-progress-circular
                                                                :size="70"
                                                                :width="7"
                                                                color="teal"
                                                                indeterminate
                                                            ></v-progress-circular>
                                                        </v-col>
                                                        <v-subheader>Loading Data. . .Please Wait</v-subheader>
                                                    </v-row>
                                                </v-container>
                                            </v-sheet>
                                        </template>
                                        <template v-slot:item="props">
                                            <tr :style="!props.item.TimeIn ? 'background-color: rgb(255, 177, 193, 0.5);' : ''">
                                                <td>{{props.item.LogDateTime}}</td>
                                                <td v-if="!props.item.TimeIn" :colspan="!props.item.TimeIn ? 7 : 0">
                                                    <v-card-text class="text-center body-1" color="red">{{getLeaveDesc(props.item.Leave, props.item.OTCode, props.item.TimeIn)}}</v-card-text>
                                                </td>
                                                <td v-if="props.item.TimeIn">{{!props.item.TimeIn ? '' : moment(props.item.TimeIn).format('HH:mm:ss')}}</td>
                                                <td v-if="props.item.TimeIn">{{!props.item.TimeOut ? '' : moment(props.item.TimeOut).format('HH:mm:ss')}}</td>
                                                <td v-if="props.item.TimeIn" class="text-center">{{!props.item.TimeIn ? "" : props.item.NoHrs}}</td>
                                                <td v-if="props.item.TimeIn" class="text-center">{{!props.item.TimeIn ? "" : props.item.Tardiness}}</td>
                                                <td v-if="props.item.TimeIn" class="text-center">{{!props.item.TimeIn ? "" : props.item.Undertime}}</td>
                                                <td v-if="props.item.TimeIn" class="text-center">{{!props.item.TimeIn ? "" : props.item.Overtime}}</td>
                                                <td v-if="props.item.TimeIn">
                                                    <v-chip v-if="props.item.TimeIn" :color="props.item.LogType == 1 ? 'orange' : 'green'" dark>
                                                        {{props.item.LogTypeDesc}}
                                                    </v-chip>
                                                </td>
                                            </tr>
                                        </template>
                                    </v-data-table>
                                    <v-divider></v-divider>
                                    <v-pagination
                                        v-model="page"
                                        class="mt-5"
                                        color="teal"
                                        :length="pageCount"
                                        :total-visible="10"
                                    ></v-pagination>
                                </v-container>
                                <v-container v-else>
                                    <calendarview :IsCalendarView.sync="calendarView" />
                                </v-container>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="12" md="3">
                    <v-card elevation="7" class="rounded-xl">
                        <v-img :src="imgClock" :aspect-ratio="16/9"></v-img>
                        <v-card-text class="text-center font-weight-bold">{{strGreetings}}</v-card-text>
                        <v-sheet height="300">
                            <v-container class="fill-height">
                                <v-card-text class="text-center">
                                    <v-card-text class="font-weight-bold display-1">{{moment(datenow).format('h:mm:ss A')}}</v-card-text>
                                </v-card-text>
                            </v-container>
                        </v-sheet>
                        <v-card-actions class="px-7">
                            <v-btn class="font-weight-bold my-3 py-9 text-h5" @click="userLoggedOut()" color="teal darken-1" block dark>Log-out</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-main>
</template>

<script>
import calendarview from '@/components/calendarview'

export default {
    data() {
        return {
            loading: true,
            calendarView: false,
            totalHours: 0,
            pageCount: 0,
            page: 1,
            code: '',
            datenow: '',
            dtLogtime: '',
            imgClock: '',
            strGreetings: '',
            logtimeData: [],
            headers: [
                {text: 'Log Date', value: 'LogDateTime'},
                {text: 'Time In', value: 'TimeIn'},
                {text: 'Time Out', value: 'TimeOut'},
                {text: 'Hours', value: 'NoHrs'},
                {text: 'Tardiness', value: 'Tardiness'},
                {text: 'Undertime', value: 'Undertime'},
                {text: 'Overtime', value: 'Overtime'},
                {text: 'Type', value: 'LogTypeDesc'}
            ],
            logOutOptions: {
                title: 'Warning',
                text: "Do you want to logged out?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Logout',
            },
        }
    },
    created() {
        window.addEventListener("beforeunload", this.browserTabEvents)
        this.datenow = this.serverDateTime
        this.dtLogtime = this.moment().format('YYYY-MM-DD')
        if(this.moment.utc(this.logtimeuserinfo.LogDateTime).format('YYYY-MM-DD') != this.moment.utc(this.datenow).format('YYYY-MM-DD')) {
            this.updateLogtimeData(this.logtimeuserinfo)
        } else {
            this.loadLogtime()
        }
    },
    beforeDestroy() {
        window.removeEventListener("beforeunload", this.browserTabEvents)
    },
    computed: {
        filterLogtime() {
            return this.logtimeData.filter(rec => {
                return rec.EmployeeCode.includes(this.logtimeuserinfo.EmployeeCode || '')
            })
        },
        filterTotalPresent() {
            return this.logtimeData.filter(rec => {
                return (
                    rec.EmployeeCode.includes(this.logtimeuserinfo.EmployeeCode) &&
                    rec.TimeIn != null 
                )
            })
        },
        filterTotalAbsent() {
            return this.logtimeData.filter(rec => {
                return (
                    rec.EmployeeCode.includes(this.logtimeuserinfo.EmployeeCode) &&
                    rec.TimeIn == null &&
                    rec.OTCode == 'RD'
                )
            })
        }
    },
    mounted() {
        setInterval(() => {
            this.datenow = this.moment.utc(this.datenow).add(1, 'seconds')
            this.$store.commit('CHANGE_SERVERDATETTIME', this.datenow)
        }, 1000);
    },
    methods: {
        browserTabEvents(events) {
            events.preventDefault()
            events.returnValue = ""
        },
        loadLogtime() {
            this.loading = true
            this.logtimeData = []
            let body = {
                procedureName: 'Logtime.dbo.ProcGetLogTimeData',
                values: [
                    `LT${this.moment(this.dtLogtime).format('MMYYYY')}`,
                    this.logtimeuserinfo.ShortName,
                    this.logtimeuserinfo.DepartmentName,
                    null,
                    null,
                    0
                ]
            }
            this.axios.post(`${this.api}/executeselect`,  {data: JSON.stringify(body)}).then(res => {
                if(Array.isArray(res.data)) {
                    this.logtimeData = res.data
                }
                this.loading = false
            })
        },
        nextMonth() {
            this.dtLogtime = this.moment(this.dtLogtime).add(1, 'months')
            this.loadLogtime()
        },
        prevMonth() {
            this.dtLogtime = this.moment(this.dtLogtime).subtract(1, 'months')
            this.loadLogtime()
        },
        userLoggedOut() {
            this.swal.fire(this.logOutOptions).then(result => {
                if(result.isConfirmed) {
                    this.updateLogtimeData(this.logtimeuserinfo)
                }
            })
        },
        updateLogtimeData(value) {
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
            if(value.LogType == 1 && !value.TimeOut) {
                this.axios.post(`${this.api}/execute`, {data: JSON.stringify(body)})
            }
            this.$store.commit('CHANGE_USER_INFO', {})
            this.$store.commit('CHANGE_USER_LOGGING', false)
            this.$store.commit('CHANGE_SERVERDATETTIME', '')
            this.$router.push("/")
        },
    },
    watch: {
        datenow() {
            let time = this.moment().format('HH:mm')
            if(time >= '05:00' && time <= '09:00') {
                this.imgClock = require('../assets/morning.gif')
                this.strGreetings = 'Good Morning'
            } else if(time >= '09:01' && time <= '16:59') {
                this.imgClock = require('../assets/afternoon.gif')
                this.strGreetings = 'Good Afternoon'
            } else {
                this.imgClock = require('../assets/evening.gif')    
                this.strGreetings = 'Good Evening'
            }   
        },
        logtimeData(val) {
            this.totalHours = 0
            val.forEach(rec => {
                rec.LogDateTime = this.moment(rec.LogDateTime).format('YYYY-MM-DD')
                if(rec.EmployeeCode == this.logtimeuserinfo.EmployeeCode) {
                    this.totalHours += rec.NoHrs
                }
                rec.TimeIn = rec.TimeIn != null ? this.moment.utc(rec.TimeIn) : null
                rec.TimeOut = rec.TimeOut != null ? this.moment.utc(rec.TimeOut) : null
            })
        }
    },
    components: {
        calendarview
    }
}
</script>