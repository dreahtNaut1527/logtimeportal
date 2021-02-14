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
                                    <v-card class="rounded-xl" elevation="8">
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
                                    <v-card class="rounded-xl" elevation="8">
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
                                    <v-card class="rounded-xl" elevation="8">
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
                            <v-sheet height="570" elevation="7" class="rounded-xl">
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
                                            <tr :style="props.item.TIMEIN == null ? 'color: #b71c1c;' : ''">
                                                <td>{{moment(props.item.LOGDATE).format('YYYY-MM-DD')}}</td>
                                                <td>{{props.item.TIMEIN}}</td>
                                                <td>{{props.item.TIMEOUT}}</td>
                                                <td>{{props.item.NOHRS}}</td>
                                                <td>{{props.item.LOGTYPE}}</td>
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
                {text: 'Log Date', value: 'LOGDATE'},
                {text: 'Time In', value: 'TIMEIN'},
                {text: 'Time Out', value: 'TIMEOUT'},
                {text: 'Hours', value: 'NOHRS'},
                {text: 'Type', value: 'LOGTYPE'}
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
        this.code = '33959'
        this.dtLogtime = this.moment().format('YYYY-MM-DD')
        this.loadLogtime()
        this.getDuration()
    },
    computed: {
        filterLogtime() {
            return this.logtimeData.filter(rec => {
                return rec.EMPLCODE.includes(this.code || '')
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
                    rec.TIMEIN == null 
                )
            })
        }
    },
    mounted() {
        setInterval(() => {
            this.datenow = this.moment().format('H:mm:ss A')
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
                    'HRD',
                    'QA',
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
                    this.$store.commit('CHANGE_USER_INFO', {})
                    this.$store.commit('CHANGE_USER_LOGGING', false)
                    this.$router.push("/")
                }
            })
        },
        getDuration() {
            let x  = this.moment().format('YYYY-MM-DD HH:mm:ss')
            let y = `${this.moment().format('YYYY-MM-DD')} ${this.userInfo.TIMEIN}`
            let duration = this.moment(x).diff(y, 'hours')
            console.log(duration)
        }
    },
    watch: {
        datenow(val) {
            if(val >= '05:00' && val <= '10:00') {
                this.imgClock = require('../assets/morning.gif')
                this.strGreetings = 'Good Morning'
            } else if(val >= '10:01' && val <= '17:00') {
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
                if(rec.EMPLCODE == this.userInfo.EMPLCODE) {
                    this.totalHours += rec.NOHRS
                }
            })
        }
    }
}
</script>