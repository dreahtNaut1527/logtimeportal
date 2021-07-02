<template>
    <div>
        <v-toolbar flat>
            <v-toolbar-title class="font-weight-bold">Calendar</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn class="mx-3" @click="prevMonth()" :disabled="loading" :dark="!loading" color="teal" x-small fab><v-icon>mdi-chevron-left</v-icon></v-btn>
            {{moment(value).format("MMMM YYYY")}}
            <v-btn class="mx-3" @click="nextMonth()" :disabled="loading" :dark="!loading" color="teal" x-small fab><v-icon>mdi-chevron-right</v-icon></v-btn>
            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn class="mx-3" @click="changeView()" v-on="on" v-bind="attrs" color="teal" x-small dark fab>
                        <v-icon>mdi-table</v-icon>
                    </v-btn>
                </template>
                <span>Table View</span>
            </v-tooltip>
        </v-toolbar>
        <v-sheet height="500">
            <v-calendar
                ref="calendar"
                v-model="value"
                color="teal"
                :events="events"
                @change="getUnionLogtime(dateRange)"
                @click:event="getCalendarEvent"
            ></v-calendar>
            <v-menu v-model="showEvent" :nudge-width="150" :activator="selectedEvent" :close-on-content-click="false" offset-x>
                <v-card>
                    <v-toolbar :color="eventDetails.TIMEIN ? eventDetails.MANUALREM == '121' ? 'warning' : 'rgb(0, 150, 136)' : 'rgb(255, 177, 193)'" dense dark flat>
                        <v-toolbar-title class="overline">Details</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-icon>{{ eventDetails.MANUALREM == '121' ? 'mdi-home-account' : 'mdi-clock-outline'}}</v-icon>
                    </v-toolbar>
                    <v-list dense>
                        <v-list-item dense>
                            <v-list-item-content>
                                <v-list-item-subtitle>LogDate:</v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-list-item-action-text class="subtitle-2 font-weight-bold">{{ moment(eventDetails.LOGDATE).format('YYYY-MM-DD') }} </v-list-item-action-text>
                            </v-list-item-action>
                        </v-list-item>
                        <v-list-item dense>
                            <v-list-item-content>
                                <v-list-item-subtitle>TimeIn:</v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-list-item-action-text class="subtitle-2 font-weight-bold">
                                    {{ eventDetails.TIMEIN ? eventDetails.TIMEIN : 'N/A' }} 
                                </v-list-item-action-text>
                            </v-list-item-action>
                        </v-list-item>
                        <v-list-item dense>
                            <v-list-item-content>
                                <v-list-item-subtitle>TimeOut:</v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-list-item-action-text class="subtitle-2 font-weight-bold">
                                    {{ eventDetails.TIMEOUT ? eventDetails.TIMEOUT : 'N/A' }} 
                                </v-list-item-action-text>
                            </v-list-item-action>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-menu>
        </v-sheet>
        <v-overlay :value="loading" absolute>
            <v-progress-circular
                indeterminate
                size="126"
            ></v-progress-circular>
        </v-overlay>
    </div>
</template>


<script>
export default {
    props: ['IsCalendarView'],
    data() {
        return {
            value: null,
            selectedEvent: null,
            loading: false,
            showEvent: false,
            calendarView: false,
            serverName: '',
            userInfo: {},
            events: [],
            holidays: [],
            dateRange: [],
            logtimeData: [],
            eventDetails: [],
        }
    },
    created() {
        this.userInfo = this.logtimeInfo.userinfo
        this.serverName = `HRIS${this.userInfo.SHORTNAME.toLowerCase()}test`
        this.value = this.moment(this.logtimeInfo.serverDateTime).format('YYYY-MM-DD')
        this.dateRange = [
            {text: 'Date From', value: this.moment.utc(this.value).startOf('month').format('YYYY-MM-DD'), dialog: false},
            {text: 'Date To', value: this.moment.utc(this.value).endOf('month').format('YYYY-MM-DD'), dialog: false}
        ]
    },
    mounted() {
        this.$refs.calendar.checkChange()
        this.getHolidays().then(res => this.holidays = res.data)
    },
    computed: {
        filterLogtime() {
            return this.logtimeData.filter(rec => {
                return rec.EMPLCODE.includes(this.userInfo.EMPLCODE)
            })
        }
    },
    methods: {
        nextMonth() {
            this.value = this.moment(this.value).add(1, 'months').format('YYYY-MM-DD')
            this.dateRange = [
                {text: 'Date From', value: this.moment.utc(this.value).startOf('month').format('YYYY-MM-DD'), dialog: false},
                {text: 'Date To', value: this.moment.utc(this.value).endOf('month').format('YYYY-MM-DD'), dialog: false}
            ]
            this.getUnionLogtime(this.dateRange)
        },
        prevMonth() {
            this.value = this.moment(this.value).subtract(1, 'months').format('YYYY-MM-DD')
            this.dateRange = [
                {text: 'Date From', value: this.moment.utc(this.value).startOf('month').format('YYYY-MM-DD'), dialog: false},
                {text: 'Date To', value: this.moment.utc(this.value).endOf('month').format('YYYY-MM-DD'), dialog: false}
            ]
            this.getUnionLogtime(this.dateRange)
        },
        changeView() {
            this.calendarView = false
            this.$emit('update:IsCalendarView', this.calendarView)
        },
        getCalendarEvent({ nativeEvent, event }) {
            if(event.value) {
                const open = () => {
                    this.eventDetails = event.value
                    this.selectedEvent = nativeEvent.target
                    requestAnimationFrame(() => requestAnimationFrame(() => this.showEvent = true))
                }

                if (this.showEvent) {
                    this.showEvent = false
                    requestAnimationFrame(() => requestAnimationFrame(() => open()))
                } else {
                    open()
                }

                nativeEvent.stopPropagation()
            }
        },
        getEventDetails() {
            return this.filterLogtime.filter(rec => this.moment(rec.LOGDATE).format('YYYY-MM-DD') == this.value)
        },
        loadLogtime(tableNames) {
            let body = {
                server: this.serverName,
                logdate: tableNames,
                company: this.userInfo.SHORTNAME,
                emplcode: this.userInfo.EMPLCODE
            }
            
            this.getUserLogtimeData(body).then(res => {
                if(Array.isArray(res.data)) {
                    this.logtimeData = res.data
                    this.getEvents()
                }
                this.loading = false
            })
        },
        getUnionLogtime(dateRange) {
            this.loading = true
            this.logtimeData = []
            let strUnion = ''
            let tableNames = []
            let dtCounter = this.moment.utc(dateRange[0].value).format('YYYY-MM-DD')
            let intYear = this.moment(dateRange[0]).format('YYYY')
            let dtFrom = parseInt(this.moment.utc(dateRange[0].value).format("DD"))
            let dtTo = parseInt(this.moment.utc(dateRange[0].value).endOf('month').format("DD"))
            if(dtFrom != dtTo) {

                // Get all Dates from daterange
                while(dtFrom <= dtTo) {
                    tableNames.push(dtCounter)
                    dtFrom++ 
                    dtCounter = this.moment.utc(dtCounter).add(1, 'days').format('YYYY-MM-DD')
                }
                
                tableNames.forEach((rec, index, array) => {
                    this.getTableExists(this.serverName, 'LOGTIME', `T01${this.moment.utc(rec).format('MMDDYY')}`).then(res => {
                        if(res.data[0].TOTAL == 1) {
                            strUnion += `SELECT * FROM LOGTIME.T01${this.moment.utc(rec).format('MMDDYY')} UNION ALL `
                        }

                        if(index == array.length - 1) {
                            this.loadLogtime(`(${strUnion.substring(0, strUnion.lastIndexOf('UNION ALL'))})`)
                        }
                    })
                })
             
            } else {
                this.loadLogtime( `${dtFrom > 9 ? dtFrom : `0${dtFrom}`}${intYear}`)
            }
        },
        getEvents() {
            this.events = []
            this.logtimeData.forEach(rec => {
                this.events.push({
                    name: rec.TIMEIN ? rec.MANUALREM == '121' ? rec.ISWFH.toUpperCase() : 'PRESENT' : this.getLeaveDesc(rec.LEAVE, rec.OTCODE, rec.TIMEIN),
                    start: this.moment(rec.LOGDATE).format('YYYY-MM-DD'),
                    end: this.moment(rec.LOGDATE).format('YYYY-MM-DD'),
                    color: rec.TIMEIN ? rec.MANUALREM == '121' ? 'warning' : 'rgb(0, 150, 136, 0.8)' : 'rgb(255, 177, 193)',
                    value: rec
                })
            })

            this.holidays.forEach(item => {
                this.events.push({
                    name: item.Description,
                    start: this.moment(item.HolDate).format('YYYY-MM-DD'),
                    end: this.moment(item.HolDate).format('YYYY-MM-DD'),
                    color: 'primary',
                    value: null
                })
            })
        }
    },
    watch: {
        IsCalendarView(val) {
            this.calendarView = !val
        } 
    }
}
</script>