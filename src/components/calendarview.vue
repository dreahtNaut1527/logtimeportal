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
                @change="loadLogtime()"
                @click:event="getCelendarEvent"
            ></v-calendar>
            <v-menu v-model="showEvent" :nudge-width="150" :activator="selectedEvent" :close-on-content-click="false" offset-x>
                <v-card>
                    <v-toolbar :color="eventDetails.TimeIn ? 'rgb(0, 150, 136)' : 'rgb(255, 177, 193)'" dense dark flat>
                        <v-toolbar-title class="overline">Details</v-toolbar-title>
                    </v-toolbar>
                    <v-list dense>
                        <v-list-item dense>
                            <v-list-item-content>
                                <v-list-item-subtitle>LogDate:</v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-list-item-action-text class="subtitle-2 font-weight-bold">{{ moment(eventDetails.LogDateTime).format('YYYY-MM-DD') }} </v-list-item-action-text>
                            </v-list-item-action>
                        </v-list-item>
                        <v-list-item dense>
                            <v-list-item-content>
                                <v-list-item-subtitle>TimeIn:</v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-list-item-action-text class="subtitle-2 font-weight-bold">
                                    {{ eventDetails.TimeIn ? moment.utc(eventDetails.TimeIn).format('hh:mm:ss a') : 'N/A' }} 
                                </v-list-item-action-text>
                            </v-list-item-action>
                        </v-list-item>
                        <v-list-item dense>
                            <v-list-item-content>
                                <v-list-item-subtitle>TimeOut:</v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-list-item-action-text class="subtitle-2 font-weight-bold">
                                    {{ eventDetails.TimeOut ? moment.utc(eventDetails.TimeOut).format('hh:mm:ss a') : 'N/A' }} 
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
            selectedEvent: null,
            loading: false,
            showEvent: false,
            calendarView: false,
            value: null,
            userInfo: {},
            events: [],
            holidays: [],
            logtimeData: [],
            eventDetails: [],
        }
    },
    created() {
        this.userInfo = this.logtimeInfo.userinfo
        this.value = this.moment(this.logtimeInfo.serverDateTime).format('YYYY-MM-DD')
    },
    mounted() {
        this.$refs.calendar.checkChange()
        this.getHolidays().then(res => this.holidays = res.data)
    },
    computed: {
        filterLogtime() {
            return this.logtimeData.filter(rec => {
                return rec.EmployeeCode.includes(this.userInfo.EmployeeCode || '')
            })
        }
    },
    methods: {
        nextMonth() {
            this.value = this.moment(this.value).add(1, 'months').format('YYYY-MM-DD')
            this.loadLogtime()
        },
        prevMonth() {
            this.value = this.moment(this.value).subtract(1, 'months').format('YYYY-MM-DD')
            this.loadLogtime()
        },
        changeView() {
            this.calendarView = false
            this.$emit('update:IsCalendarView', this.calendarView)
        },
        getCelendarEvent({ nativeEvent, event }) {
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
            return this.filterLogtime.filter(rec => this.moment(rec.LogDateTime).format('YYYY-MM-DD') == this.value)
        },
        loadLogtime() {
            this.loading = true
            this.logtimeData = []
            let body = {
                procedureName: 'Logtime.dbo.ProcGetLogTimeData',
                values: [
                    `LT${this.moment(this.value).format('MMYYYY')}`,
                    this.userInfo.ShortName,
                    this.userInfo.DepartmentName,
                    null,
                    null,
                    0
                ]
            }
            this.axios.post(`${this.api}/executeselect`,  {data: JSON.stringify(body)}).then(res => {
                if(Array.isArray(res.data)) {
                    this.logtimeData = res.data
                    this.getEvents()
                }
                this.loading = false
            })
        },
        getEvents() {
            this.events = []
            this.filterLogtime.forEach(rec => {
                this.events.push({
                    name: rec.TimeIn ? 'PRESENT' : this.getLeaveDesc(rec.Leave, rec.OTCode, rec.TimeIn),
                    start: this.moment(rec.LogDateTime).format('YYYY-MM-DD'),
                    end: this.moment(rec.LogDateTime).format('YYYY-MM-DD'),
                    color: rec.TimeIn ? 'rgb(0, 150, 136, 0.8)' : 'rgb(255, 177, 193)',
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