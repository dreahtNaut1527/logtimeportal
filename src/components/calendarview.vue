<template>
    <div>
        <v-toolbar flat>
            <v-toolbar-title class="font-weight-bold">Calendar</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn @click="changeView()" v-on="on" v-bind="attrs" color="teal" x-small dark fab>
                        <v-icon>mdi-table</v-icon>
                    </v-btn>
                </template>
                <span>Table View</span>
            </v-tooltip>
        </v-toolbar>
        <v-sheet height="570">
            <v-calendar
                ref="calendar"
                v-model="value"
                color="teal"
                :events="events"
                :now="value"
                @change="loadLogtime()"
                @click:event="getCelendarEvent"
            ></v-calendar>
            <v-menu v-model="showEvent" :activator="selectedEvent" :close-on-content-click="false" offset-x>
                <v-card>
                    <v-toolbar color="teal" dense dark flat>
                        <v-toolbar-title>Details</v-toolbar-title>
                    </v-toolbar>
                    <v-list>
                        <v-list-item>
                            <v-list-item-content>{{eventDetails}}</v-list-item-content>
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
            value: this.moment(this.serverDateTime).format('YYYY-MM-DD'),
            events: [],
            logtimeData: [],
            eventDetails: [],
        }
    },
    mounted() {
        this.$refs.calendar.checkChange()
    },
    computed: {
        filterLogtime() {
            return this.logtimeData.filter(rec => {
                return rec.EmployeeCode.includes(this.logtimeuserinfo.EmployeeCode || '')
            })
        }
    },
    methods: {
        changeView() {
            this.calendarView = false
            this.$emit('update:IsCalendarView', this.calendarView)
        },
        getCelendarEvent({ nativeEvent, event }) {
            const open = () => {
                this.eventDetails = event
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
                    this.getEvents()
                }
                this.loading = false
            })
        },
        getEvents() {
            this.events = []
            this.filterLogtime.forEach(rec => {
                this.events.push({
                    name: this.getLeaveDesc(rec.Leave, rec.OTCode, rec.TimeIn),
                    start: this.moment(rec.LogDateTime).format('YYYY-MM-DD'),
                    end: this.moment(rec.LogDateTime).format('YYYY-MM-DD'),
                    color: 'teal'
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