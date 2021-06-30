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
                                            {{ filterGetTotalHours }}
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
                                        :items-per-page="8"
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
                                            <tr :style="!props.item.TIMEIN ? 'background-color: rgb(255, 177, 193, 0.5);' : ''">
                                                <td>{{ moment(props.item.LOGDATE).format('YYYY-MM-DD') }}</td>
                                                <td v-if="!props.item.TIMEIN" :colspan="!props.item.TIMEIN ? 6 : 0">
                                                    <v-card-text class="text-center body-1" color="red">{{getLeaveDesc(props.item.LEAVE, props.item.OTCODE, props.item.TIMEIN)}}</v-card-text>
                                                </td>
                                                <td v-if="props.item.TIMEIN">{{!props.item.TIMEIN ? '' : props.item.TIMEIN}}</td>
                                                <td v-if="props.item.TIMEIN">{{!props.item.TIMEOUT ? '' : props.item.TIMEOUT}}</td>
                                                <td v-if="props.item.TIMEIN" class="text-center">{{!props.item.TIMEIN ? "" : props.item.NOHRS}}</td>
                                                <td v-if="props.item.TIMEIN" class="text-center">{{!props.item.TIMEIN ? "" : props.item.TARDINESS}}</td>
                                                <td v-if="props.item.TIMEIN" class="text-center">{{!props.item.TIMEIN ? "" : props.item.UNDERTIME}}</td>
                                                <td v-if="props.item.TIMEIN">
                                                    <v-chip v-if="props.item.TIMEIN" :color="props.item.MANUALREM == '121' ? 'warning' : 'success'" dark>
                                                        {{ props.item.ISWFH ? props.item.ISWFH  : 'Office'}}
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
                                        :total-visible="6"
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
            serverName: '',
            strGreetings: '',
            userInfo: {},
            logtimeData: [],
            dateRange: [],
            headers: [
                {text: 'Log Date', value: 'LogDateTime'},
                {text: 'Time In', value: 'TimeIn'},
                {text: 'Time Out', value: 'TimeOut'},
                {text: 'Hours', value: 'NoHrs'},
                {text: 'Tardiness', value: 'Tardiness'},
                {text: 'Undertime', value: 'Undertime'},
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
        this.userInfo = this.logtimeInfo.userinfo
        this.datenow = this.logtimeInfo.serverDateTime
        this.serverName = process.env.NODE_ENV ==='production' ? `HRIS${this.userInfo.SHORTNAME}` : `HRIS${this.userInfo.SHORTNAME.toLowerCase()}test`
        this.dtLogtime = this.moment().format('YYYY-MM-DD')
        this.dateRange = [
            {text: 'Date From', value: this.moment.utc(this.datenow).startOf('month').format('YYYY-MM-DD'), dialog: false},
            {text: 'Date To', value: this.moment.utc(this.datenow).endOf('month').format('YYYY-MM-DD'), dialog: false}
        ]
        if(this.moment.utc(this.userInfo.LOGDATE).format('YYYY-MM-DD') != this.moment.utc(this.datenow).format('YYYY-MM-DD')) {
            this.userLoggedOut()
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
                return rec.EMPLCODE.includes(this.userInfo.EMPLCODE || '')
            })
        },
        filterTotalPresent() {
            return this.logtimeData.filter(rec => {
                return (
                    rec.EMPLCODE.includes(this.userInfo.EMPLCODE) &&
                    rec.TIMEIN != null 
                )
            })
        },
        filterTotalAbsent() {
            return this.logtimeData.filter(rec => {
                return (
                    rec.EMPLCODE.includes(this.userInfo.EMPLCODE) &&
                    rec.TIMEIN == null &&
                    rec.OTCODE == 'RD'
                )
            })
        },
        filterGetTotalHours() {
            return this.logtimeData.reduce((prev, cur) => {
                return prev + parseInt(cur.NOHRS)
            }, 0)
        }
    },
    mounted() {
        setInterval(() => {
            this.datenow = this.moment.utc(this.datenow).add(1, 'seconds')
            this.logtimeDateTime = this.datenow
            // this.$store.commit('CHANGE_SERVERDATETTIME', this.datenow)
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
                server: this.serverName,
                logdate: this.getUnionLogtime(this.dateRange),
                company: this.userInfo.SHORTNAME,
                emplcode: this.userInfo.EMPLCODE
            }
            
            this.getUserLogtimeData(body).then(res => {
                if(Array.isArray(res.data)) {
                    this.logtimeData = res.data
                }
                this.loading = false
            })
            // let body = {
            //     procedureName: 'Logtime.dbo.ProcGetLogTimeData',
            //     values: [
            //         `LT${this.moment(this.dtLogtime).format('MMYYYY')}`,
            //         this.userInfo.ShortName,
            //         this.userInfo.DepartmentName,
            //         null,
            //         null,
            //         0
            //     ]
            // }
            // this.axios.post(`${this.api}/executeselect`,  {data: JSON.stringify(body)}).then(res => {
            //     if(Array.isArray(res.data)) {
            //         this.logtimeData = res.data
            //     }
            //     this.loading = false
            // })
        },
        getUnionLogtime(dateRange) {
            let strUnion = ''
            let dtCounter = this.moment.utc(dateRange[0].value)
            let intYear = this.moment(dateRange[0]).format('YYYY')
            let dtFrom = parseInt(this.moment(dateRange[0].value).format("DD"))
            let dtTo = parseInt(this.moment(dateRange[1].value).format("DD"))
            if(dtFrom != dtTo) {
                while(dtFrom <= dtTo) {
                    strUnion += `SELECT * FROM LOGTIME.T01${this.moment.utc(dtCounter).format('MMDDYY')} UNION ALL `
                    dtCounter = this.moment.utc(dtCounter).add(1, 'days')
                    dtFrom++ 
                }
                return `(${strUnion.substring(0, strUnion.lastIndexOf('UNION ALL'))})`                
            } else {
                return `${dtFrom > 9 ? dtFrom : `0${dtFrom}`}${intYear}`
            }
        },
        nextMonth() {
            this.dtLogtime = this.moment(this.dtLogtime).add(1, 'months')
            this.dateRange = [
                {text: 'Date From', value: this.moment.utc(this.dtLogtime).startOf('month').format('YYYY-MM-DD'), dialog: false},
                {text: 'Date To', value: this.moment.utc(this.dtLogtime).endOf('month').format('YYYY-MM-DD'), dialog: false}
            ]
            this.loadLogtime()
        },
        prevMonth() {
            this.dtLogtime = this.moment(this.dtLogtime).subtract(1, 'months')
            this.dateRange = [
                {text: 'Date From', value: this.moment.utc(this.dtLogtime).startOf('month').format('YYYY-MM-DD'), dialog: false},
                {text: 'Date To', value: this.moment.utc(this.dtLogtime).endOf('month').format('YYYY-MM-DD'), dialog: false}
            ]
            this.loadLogtime()
        },
        userLoggedOut() {
            this.swal.fire(this.logOutOptions).then(result => {
                if(result.isConfirmed) {
                    this.updateORALogtime(this.userInfo)
                }
            })
        },
        // updateLogtimeData(value) {
        //     //Compute duration
        //     let timeInVal = this.moment.utc(value.TimeIn)
        //     let timeOutVal  = this.moment.utc(this.logtimeDateTime)
        //     let timeLogOut = timeOutVal.format('YYYY-MM-DD HH:mm:ss')
        //     if(this.moment(value.LogDateTime).format('YYYY-MM-DD') != timeOutVal.format('YYYY-MM-DD')) {
        //         timeLogOut = `${this.moment(value.LogDateTime).format('YYYY-MM-DD')} ${this.moment(value.EndTime).format('HH:mm:ss')}`
        //     }
        //     let duration = this.calculateDates(timeOutVal, timeInVal)
        //     let body = {
        //         procedureName: 'Logtime.dbo.ProcInsertLogTimeData',
        //         values: [
        //             `LT${this.moment(value.LogDateTime).format('MMYYYY')}`, 
        //             value.ShortName, 
        //             value.IDCode,
        //             value.EmployeeCode, 
        //             value.LogDateTime,
        //             value.TimeIn,
        //             timeLogOut, //TimeOut
        //             parseFloat(duration.hours.toFixed(2) - 1), //NoHrs
        //             value.Undertime, 
        //             value.Tardiness, 
        //             value.Overtime, 
        //             value.ND, 
        //             value.Shift, 
        //             value.SW1, 
        //             1, 
        //             value.UserAcct, 
        //             value.UserAcctO, 
        //             value.UserTime, 
        //             value.UserTimeO, 
        //             value.ManualRem, 
        //             '121', //ManualRemO, 
        //             value.ND1, 
        //             value.ND2, 
        //             value.NoHrs1, 
        //             value.OTCode == 'RD' ? 'R' : 'O', // PayCode
        //             value.DayOff,
        //             value.OTCode,
        //             value.Meal,
        //             value.MealOCC,
        //             value.PostOT,
        //             value.Leave,
        //             value.TransIn,
        //             value.TransOut,
        //             value.DepartmentCode,
        //             value.SectionCode,
        //             value.TeamCode,
        //             value.DesignationCode,
        //             1
        //         ]
        //     }
        //     // console.log(body)
        //     // Work From Home
        //     if(value.LogType == 1 && !value.TimeOut) {
        //         this.axios.post(`${this.api}/execute`, {data: JSON.stringify(body)})
        //     }
        //     this.$store.commit('CHANGE_USER_INFO', {})
        //     this.$store.commit('CHANGE_USER_LOGGING', false)
        //     this.$store.commit('CHANGE_SERVERDATETTIME', '')
        //     this.$router.push("/")
        // },
        updateORALogtime(value) {
            let dtToday = this.moment.utc(this.datenow)
            let cutOffValues = this.getCutOffValues(dtToday.format('YYYY-MM-DD'), value.EMPLCODE)
            let body = {
                server: this.serverName,
                procedureName: 'HRIS.PROCUPDATELOGTIME',
                values: [
                    value.EMPLCODE, 
                    dtToday.format('YYYY-MM-DD'),
                    `${dtToday.format('YYYY-MM-DD')} ${value.TIMEIN}`, // TIMEIN,
                    `${dtToday.format('YYYY-MM-DD')} ${dtToday.format('HH:mm:ss')}`, // TIMEOUT
                    this.computeTotalHours(value, `${dtToday.format('YYYY-MM-DD')} ${dtToday.format('HH:mm:ss')}`), // NOHRS
                    this.computeUndertime(value, `${dtToday.format('YYYY-MM-DD')} ${dtToday.format('HH:mm:ss')}`), // UNDERTIME
                    value.TARDINESS,
                    0,
                    1, 
                    1, 
                    'R',
                    '121', 
                    '121', 
                    cutOffValues.serialNo,
                    cutOffValues.cutOffDate,
                    '4',
                    'PORTA',
                    dtToday.format('YYYY-MM-DD')
                ]
            }
            if(!value.TIMEOUT) {
            // console.log(body)
                this.axios.post(`${this.asd_sql}/ora_procedure.php`, {data: JSON.stringify(body)}).then(res => {
                    if(res.data == '1') {
                        this.$store.commit('CHANGE_USER_INFO', {})
                        this.$store.commit('CHANGE_USER_LOGGING', false)
                        this.$store.commit('CHANGE_SERVERDATETTIME', '')
                        this.$router.push("/")
                    } else {
                        console.log(res.data);
                    }
                })
            } else {
                this.$store.commit('CHANGE_USER_INFO', {})
                this.$store.commit('CHANGE_USER_LOGGING', false)
                this.$store.commit('CHANGE_SERVERDATETTIME', '')
                this.$router.push("/")
            }
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
        computeTotalHours(value, timeOut) {
            let dtToday = this.moment.utc(value.LOGDATE).format('YYYY-MM-DD')
            let timeInVal = this.moment.utc(`${dtToday} ${this.moment.utc(value.STARTTIME).format('HH:mm:ss')}`)
            let duration = this.calculateDates(this.moment.utc(timeOut), timeInVal)
            
            return (duration.hours - 1) >= 8 ? 8 : parseFloat((duration.hours - 1).toFixed(2))
        },
        computeOvertime(value, timeOut) {
            let dtToday = this.moment.utc(value.LOGDATE).format('YYYY-MM-DD')
            let timeOutVal = this.moment.utc(timeOut)
            let shiftEnd = this.moment.utc(value.ENDTIME)
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
            let dtToday = this.moment.utc(value.LOGDATE).format('YYYY-MM-DD')
            let timeOutVal = this.moment.utc(timeOut)
            let shiftEnd = this.moment.utc(value.ENDTIME)
            let tempEndTime = this.moment.utc(`${dtToday} ${shiftEnd.format('HH:mm:ss')}`)
            let duration = this.calculateDates(tempEndTime, timeOutVal)
            if(!isNaN(duration.hours) || duration.hours != undefined) {
                return duration.hours <= 0 ? 0 : duration.hours - 1
            } else {
                return 0
            }
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
        }
    },
    components: {
        calendarview
    }
}
</script>