<template>
    <v-main>
        <v-subheader>Dashboard</v-subheader>
        <v-container>
            <v-row>
                <v-col cols="12" md="8">
                    <v-card elevation="7">
                        <v-toolbar flat>
                            <v-toolbar-title>Logtime</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-btn @click="prevMonth()" icon><v-icon>mdi-chevron-left</v-icon></v-btn>
                            {{moment(dtLogtime).format("MMMM YYYY")}}
                            <v-btn @click="nextMonth()" icon><v-icon>mdi-chevron-right</v-icon></v-btn>
                        </v-toolbar>
                        <v-divider></v-divider>
                        <v-data-table
                            :headers="headers"
                            :items="filterLogtime"
                            :loading="loading"
                            :page.sync="page"
                            loading-text="Loading Data. . .Please Wait"
                            @page-count="pageCount = $event"
                            hide-default-footer
                        >
                            <template v-slot:item="props">
                                <tr :style="props.item.TIMEIN == null ? 'color: #b71c1c;' : ''">
                                    <td>{{moment(props.item.LOGDATE).format('YYYY-MM-DD')}}</td>
                                    <td>{{props.item.TIMEIN}}</td>
                                    <td>{{props.item.TIMEOUT}}</td>
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
                    </v-card>
                </v-col>
                <v-col cols="12" md="4">
                    <v-card elevation="7">
                        <v-img :src="imgClock" :aspect-ratio="16/9"></v-img>
                        <v-sheet height="300">
                            <v-container class="fill-height">
                                <v-card-text class="text-center">
                                    <v-card-text class="font-weight-bold display-1">{{datenow}}</v-card-text>
                                </v-card-text>
                            </v-container>
                        </v-sheet>
                        <v-card-actions>
                            <v-btn @click="userLoggedOut()" color="teal darken-1" x-large block dark>Log-out</v-btn>
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
    },
    computed: {
        filterLogtime() {
            return this.logtimeData.filter(rec => {
                return rec.EMPLCODE.includes(this.code || '')
            })
        }
    },
    mounted() {
        setInterval(() => {
            this.datenow = this.moment().format('H:mm:ss A')
            if(this.datenow >= '05:00' && this.datenow <= '10:00') {
                this.imgClock = require('../assets/morning.gif')
                this.strGreetings = 'Good Morning'
            } else if(this.datenow >= '10:01' && this.datenow <= '17:00') {
                this.imgClock = require('../assets/afternoon.gif')
                this.strGreetings = 'Good Afternoon'
            } else {
                this.imgClock = require('../assets/evening.gif')
                this.strGreetings = 'Good Evening'
            }
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
                    alert('You have logged out')
                }
            })
        } 
    }
}
</script>