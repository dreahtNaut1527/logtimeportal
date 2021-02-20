<template>
    <v-main class="grey lighten-4">
        <v-card-text class="display-1 font-weight-bold">Dashboard</v-card-text>
        <v-container>
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
                                            <v-toolbar-title class="subtitle-2 font-weight-light">Hours</v-toolbar-title>
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
                            <v-sheet height="570" elevation="8" class="rounded-xl">
                                <v-container>
                                    <v-toolbar flat>
                                        <v-toolbar-title class="font-weight-bold">Logtime</v-toolbar-title>
                                        <v-spacer></v-spacer>
                                        <v-btn class="mx-3" @click="prevMonth()" color="teal" x-small dark fab><v-icon>mdi-chevron-left</v-icon></v-btn>
                                        {{moment(dtLogtime).format("MMMM YYYY")}}
                                        <v-btn class="mx-3" @click="nextMonth()" color="teal" x-small dark fab><v-icon>mdi-chevron-right</v-icon></v-btn>
                                    </v-toolbar>
                                    <v-divider></v-divider>
                                    <v-data-table
                                        :headers="headers"
                                        :items="filterLogtime"
                                        :loading="loading"
                                        :page.sync="page"
                                        :items-per-page="8"
                                        loading-text="Loading Data. . .Please Wait"
                                        @page-count="pageCount = $event"
                                        hide-default-footer
                                    >
                                        <template v-slot:item="props">
                                            <tr :style="!props.item.TimeIn ? 'color: #b71c1c;' : ''">
                                                <td>{{props.item.LogDateTime}}</td>
                                                <td>{{!props.item.TimeIn ? '' : moment(props.item.TimeIn).format('HH:mm:ss')}}</td>
                                                <td>{{!props.item.TimeOut ? '' : moment(props.item.TimeOut).format('HH:mm:ss')}}</td>
                                                <td>{{!props.item.TimeIn ? "" : props.item.NoHrs}}</td>
                                                <td>
                                                    <v-chip v-if="props.item.TimeIn" :color="props.item.LogType == 1 ? 'orange' : 'green'" dark>
                                                        {{props.item.LogTypeDesc}}
                                                    </v-chip>
                                                </td>
                                            </tr>
                                        </template>
                                    </v-data-table>
                                    <v-pagination
                                        v-model="page"
                                        color="teal"
                                        :length="pageCount"
                                        :total-visible="10"
                                    ></v-pagination>
                                </v-container>
                            </v-sheet>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="12" md="3">
                    <v-card elevation="7" class="rounded-xl">
                        <v-img :src="imgClock" :aspect-ratio="16/9"></v-img>
                        <v-sheet height="300">
                            <v-container class="fill-height">
                                <v-card-text class="text-center">
                                    <v-card-text class="font-weight-bold display-1">{{datenow}}</v-card-text>
                                </v-card-text>
                            </v-container>
                        </v-sheet>
                        <v-card-actions class="px-7">
                            <v-btn class="my-3" @click="userLoggedOut()" color="teal darken-1" block dark>Log-out</v-btn>
                        </v-card-actions>
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
            loading: true,
            hours: 0,
            totalHours: 0,
            pageCount: 0,
            page: 1,
            payCode: '',
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
                {text: 'Type', value: 'LogTypeDesc'}
            ],
            logOutOptions: {
                title: 'Are you sure?',
                text: "You won't be able to login in this system!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Logout',
            },
        }
    },
    created() {
        this.dtLogtime = this.moment().format('YYYY-MM-DD')
        this.loadLogtime()
        this.getDuration()
    },
    computed: {
        filterLogtime() {
            return this.logtimeData.filter(rec => {
                return rec.EmployeeCode.includes(this.logtimeuserinfo.EmployeeCode || '')
            }).sort().reverse()
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
            this.datenow = this.moment().format('hh:mm:ss A')
        }, 1000);
    },
    methods: {
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
                    null
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
                    this.getDuration()
                    let body = {
                        procedureName: 'Logtime.dbo.ProcInsertLogTimeData',
                        values: [
                            `LT${this.moment().format('MMYYYY')}`, 
                            this.logtimeuserinfo.ShortName, 
                            this.logtimeuserinfo.IDCode,
                            this.logtimeuserinfo.EmployeeCode, 
                            this.moment(this.logtimeuserinfo.LogDateTime).format('YYYY-MM-DD'),
                            this.logtimeuserinfo.TimeIn, 
                            this.moment().format('YYYY-MM-DD HH:mm:ss'),
                            this.hours, 
                            this.logtimeuserinfo.Undertime, 
                            this.logtimeuserinfo.Tardiness, 
                            this.logtimeuserinfo.Overtime, 
                            this.logtimeuserinfo.ND, 
                            this.logtimeuserinfo.Shift, 
                            this.logtimeuserinfo.SW1, 
                            1, 
                            null, 
                            null, 
                            null,
                            null, 
                            this.logtimeuserinfo.ManualRem, 
                            this.logtimeuserinfo.ManualRemO, 
                            this.logtimeuserinfo.ND1, 
                            this.logtimeuserinfo.ND2, 
                            this.logtimeuserinfo.NoHrs1, 
                            this.payCode,
                            this.logtimeuserinfo.DayOff,
                            this.logtimeuserinfo.OTCode,
                            this.logtimeuserinfo.Meal,
                            this.logtimeuserinfo.MealOCC,
                            this.logtimeuserinfo.PostOT,
                            this.logtimeuserinfo.Leave,
                            this.logtimeuserinfo.TransIn,
                            this.logtimeuserinfo.TransOut,
                            this.logtimeuserinfo.DepartmentCode,
                            this.logtimeuserinfo.SectionCode,
                            this.logtimeuserinfo.TeamCode,
                            this.logtimeuserinfo.DesignationCode,
                            1
                        ]
                    }
                    this.axios.post(`${this.api}/execute`, {data: JSON.stringify(body)})
                    // this.updateORALogtime()
                    this.$store.commit('CHANGE_USER_INFO', {})
                    this.$router.push("/")
                }
            })
        },
        getDuration() {
            let now  = this.moment().format('YYYY-MM-DD HH:mm:ss')
            let then = this.logtimeuserinfo.TimeIn
            this.hours = this.moment(now).diff(then, 'hours') >= 8 ? 8 : this.moment(now).diff(then, 'hours')
            this.payCode = this.logtimeuserinfo.OTCode == 'RD' ? 'R' : 'O'
        },
        updateORALogtime() {
            let body = {
                server: process.env.NODE_ENV == 'production' ? `HRIS${this.logtimeuserinfo.ShortName}` : 'HRIS',
                procedureName: 'PROCUPDATELOGTIME',
                values: [
                    this.logtimeuserinfo.EmployeeCode, 
                    this.moment(this.logtimeuserinfo.LogDateTime).format('YYYY-MM-DD'),
                    this.logtimeuserinfo.StartTime,
                    this.logtimeuserinfo.EndTime,
                    8, 
                    this.logtimeuserinfo.SW1, 
                    1, 
                    this.payCode,
                    this.logtimeuserinfo.ManualRem, 
                    this.logtimeuserinfo.ManualRemO, 
                ]
            }
            // console.log(body)
            this.axios.post(`${this.asd_sql}/oraprocedure.php`, {data: JSON.stringify(body)}).then(res => {
                console.log(res.data)
            })
        }
    },
    watch: {
        datenow(val) {
            if(val >= '05:00' && val <= '09:59') {
                this.imgClock = require('../assets/morning.gif')
                this.strGreetings = 'Good Morning'
            } else if(val >= '10:00' && val <= '16:59') {
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
    }
}
</script>