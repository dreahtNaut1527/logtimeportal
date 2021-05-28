<template>
    <v-main>
        <v-subheader>Logtime Details</v-subheader>
        <v-snackbar 
            v-model="alert" 
            color="success" 
            transition="scroll-y-transition" 
            :timeout="4000"
            outlined 
            text
            top
        >
            <v-icon color="success" left>mdi-check-circle</v-icon>Record has been saved
            <!-- <template v-slot:action="{ attrs }">
                <v-btn v-bind="attrs" small icon><v-icon>mdi-close-circle</v-icon></v-btn>
            </template> -->
        </v-snackbar>
        <v-lazy transition="scroll-y-transition" :options="{ threshold: 0.8 }">
            <v-container>
                <v-row>
                    <v-col cols="12" md="12">
                        <v-card>
                            <v-toolbar color="teal" dark>
                                <v-btn to="/dashboardleaders" icon><v-icon>mdi-arrow-left</v-icon></v-btn>
                                <v-toolbar-title>Logtime</v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-btn @click="prevMonth" :disabled="loading" icon><v-icon>mdi-chevron-left</v-icon></v-btn>
                                <v-subheader class="font-weight-bold text-h6">{{moment(dtLogtime).format('MMMM YYYY')}}</v-subheader>
                                <v-btn @click="nextMonth" :disabled="loading" icon><v-icon>mdi-chevron-right</v-icon></v-btn>
                            </v-toolbar>
                            <v-container>
                                <v-data-table
                                    :headers="headers"
                                    :items="logtimeData"
                                    :loading="loading"
                                    :page.sync="page"
                                    :single-expand="true"
                                    :expanded.sync="expanded"
                                    item-key="LogDateTime"
                                    loading-text="Loading Data. . .Please Wait"
                                    @page-count="pageCount = $event"
                                    hide-default-footer
                                    show-expand
                                >
                                    <template v-slot:item="{ headers, item, expand, isExpanded }">
                                        <tr :style="!item.TimeIn ? 'color: #b71c1c;' : ''">
                                            <td class="text-center" :colspan="!item.TimeIn ? headers.length : 0">
                                                <div v-if="item.TimeIn">
                                                    <v-btn 
                                                        @click="expand(!isExpanded)" 
                                                        :disabled="moment(item.LogDateTime).format('YYYY-MM-DD') == moment(serverDateTime).format('YYYY-MM-DD')" 
                                                        color="teal" 
                                                        icon
                                                    >
                                                        <v-icon>{{isExpanded ? 'mdi-minus-box-outline' : 'mdi-plus-box-outline'}}</v-icon>
                                                    </v-btn>
                                                </div>
                                                <div v-else>
                                                    <v-row class="pa-0 ma-0" dense>
                                                        <v-col cols="12" md="2">
                                                            <div class="ml-6">{{moment(item.LogDateTime).format('YYYY-MM-DD')}}</div>
                                                        </v-col>
                                                        <v-col cols="12" md="10">
                                                            {{ getLeaveDesc(item.Leave, item.OTCode) }}
                                                        </v-col>
                                                    </v-row>
                                                </div>
                                            </td>
                                            <td v-if="item.TimeIn">{{moment(item.LogDateTime).format('YYYY-MM-DD')}}</td>
                                            <td v-if="item.TimeIn">{{!item.TimeIn ? 'test' : moment.utc(item.TimeIn).format('HH:mm:ss')}}</td>
                                            <td v-if="item.TimeIn">{{!item.TimeOut ? '' : moment.utc(item.TimeOut).format('HH:mm:ss')}}</td>
                                            <td v-if="item.TimeIn" class="text-center">{{!item.TimeIn ? "" : item.NoHrs}}</td>
                                            <td v-if="item.TimeIn" class="text-center">{{!item.TimeIn ? "" : item.Tardiness}}</td>
                                            <td v-if="item.TimeIn" class="text-center">{{!item.TimeIn ? "" : item.Undertime}}</td>
                                            <td v-if="item.TimeIn" class="text-center">{{!item.TimeIn ? "" : item.Overtime}}</td>
                                            <td v-if="item.TimeIn">
                                                <v-chip v-if="item.TimeIn" :color="item.LogType == 1 ? 'orange' : 'green'" dark>
                                                    {{item.LogTypeDesc}}
                                                </v-chip>
                                            </td>
                                        </tr>
                                    </template>
                                    <template v-slot:expanded-item="{ headers, item }">
                                        <td :colspan="headers.length">
                                            <v-card outlined>
                                                <v-card-title class="mb-n3 subtitle-2 font-weight-bold">
                                                    {{item.LogType == 1 ? 'Manual Entry' : 'Admin Record'}}
                                                </v-card-title>
                                                <v-divider class="mx-3"></v-divider>
                                                <v-container>
                                                    <v-row align="center" justify="center" dense>
                                                        <v-col cols="12" md="3">
                                                            <v-text-field
                                                                v-model="timeIn"
                                                                color="teal"
                                                                label="TimeIn"
                                                                append-icon="mdi-clock-outline"
                                                                v-mask="'##:##'"
                                                                hint="hh:mm"
                                                                persistent-hint
                                                                outlined
                                                                dense
                                                            ></v-text-field>                            
                                                        </v-col>
                                                        <v-col cols="12" md="3">
                                                            <v-text-field
                                                                v-model="timeOut"
                                                                color="teal"
                                                                label="TimeOut"
                                                                append-icon="mdi-clock-outline"
                                                                v-mask="'##:##'"
                                                                hint="hh:mm"
                                                                persistent-hint
                                                                outlined
                                                                dense
                                                            ></v-text-field>                            
                                                        </v-col>
                                                        <v-col cols="12" md="6">
                                                            <v-text-field
                                                                v-model="item.Remarks"
                                                                color="teal"
                                                                label="Remarks"
                                                                outlined
                                                                dense
                                                            ></v-text-field>                            
                                                        </v-col>
                                                    </v-row>
                                                </v-container>
                                                <v-card-actions v-if="item.LogType == 1">
                                                    <v-spacer></v-spacer>
                                                    <v-btn 
                                                        color="teal" 
                                                        dark
                                                        @click="saveEmployeeLogtimeData(item)"
                                                    >Save</v-btn>
                                                </v-card-actions>
                                            </v-card>
                                        </td>
                                    </template>
                                </v-data-table>
                                <v-pagination
                                    v-model="page"
                                    color="teal"
                                    :length="pageCount"
                                    :total-visible="10"
                                ></v-pagination>
                            </v-container>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-lazy>
    </v-main>
</template>

<script>

export default {
    data() {
        return {
            code: null,
            timeIn: null,
            timeOut: null,
            dtLogtime: null,
            alert: false,
            isHalfDay: false,
            dateDialog: false,
            loading: true,
            pageCount: 0,
            page: 1,
            expanded: [],
            logtimeData: [],
            headers: [
                {text: '', value: 'data-table-expand' },
                {text: 'Log Date', value: 'LogDateTime'},
                {text: 'Time In', value: 'TimeIn'},
                {text: 'Time Out', value: 'TimeOut'},
                {text: 'Hours', value: 'NoHrs'},
                {text: 'Tardiness', value: 'Tardiness'},
                {text: 'Undertime', value: 'Undertime'},
                {text: 'Overtime', value: 'Overtime'},
                {text: 'Type', value: 'LogTypeDesc'}
            ],
        }
    },
    created() {
        this.dtLogtime = this.moment(this.serverDateTime).format('YYYY-MM-DD')
        this.loadLogtime()
    },
    computed: {
        
    },
    methods: {
        prevMonth() {
            let dtToday = this.dtLogtime
            this.dtLogtime = this.moment(dtToday).subtract(1, 'months').format('YYYY-MM-DD')
            this.loadLogtime()
        },
        nextMonth() {
            let dtToday = this.dtLogtime
            this.dtLogtime = this.moment(dtToday).add(1, 'months').format('YYYY-MM-DD')
            this.loadLogtime()
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
                    this.code = this.$route.query.code
                    res.data.forEach(rec => {
                        if(rec.EmployeeCode == this.code) {
                            this.logtimeData.push(rec)
                        }
                    })
                }
                this.loading = false
            })
        },
        setHalfDay(val){
            let timeInVal = null
            let timeOutVal = null
            let dtToday = this.moment.utc(this.serverDateTime).format('YYYY-MM-DD')
            if(this.timeIn != null) {
                timeInVal = this.moment.utc(`${dtToday} ${this.timeIn}`, 'YYYY-MM-DD HH:mm:ss')
                if(this.isHalfDay) {
                    // Set Undertime Value
                    this.timeOut = timeInVal.add(4, 'hours')
                    this.timeOut = timeInVal.set({second: 0}).format('HH:mm:ss')
                    timeOutVal = this.moment.utc(`${dtToday} ${this.timeOut}`, 'YYYY-MM-DD HH:mm:ss')
                    val.TimeIn = timeInVal.format('YYYY-MM-DD HH:mm:ss')
                    val.timeOut = timeOutVal.format('YYYY-MM-DD HH:mm:ss')
                } else {
                    this.timeOut = null
                    val.NoHrs = 0
                    val.Undertime = 0
                    val.Overtime = 0
                    val.Tardiness = 0
                }
            }
        },
        setLogtimeValues(item) {
            let duration = null
            let dtToday = this.moment(item.LogDateTime).format('YYYY-MM-DD')
            // let timeInVal = this.timeIn ? this.moment.utc(`${dtToday} ${this.timeIn}`) : null
            let timeInVal = this.moment.utc(item.StartTime)
            let timeOutVal = this.timeOut ? this.moment.utc(`${dtToday} ${this.timeOut}`) : null
            
            if(this.timeOut != null && timeInVal.format('HH') < timeOutVal.format('HH')) {
                duration = this.calculateDates(timeOutVal, timeInVal)
                Object.assign(item, {
                    AdminTimeIn: `${dtToday} ${this.timeIn}`,
                    AdminTimeOut: `${dtToday} ${this.timeOut}`,
                    AdminNoHrs: (duration.hours) >= 8 ? 8 : parseFloat((duration.hours).toFixed(2)),
                    AdminOvertime: (duration.hours - 9).toFixed(2) >= 0.5 ? (duration.hours - 9).toFixed(2) : 0,
                    AdminUndertime: 0,
                    AdminTardiness: 0
                })
            } else {
                item.NoHrs = 0
                item.Undertime = 0
                item.Tardiness = 0
                item.Overtime = 0
            }
        },
        saveEmployeeLogtimeData(rec) {
            let body = null
            if(rec.TimeIn == null || rec.TimeOut == null) {
                this.swal.fire('Oh No!', 'Please fill up the required fields', 'error')
            } else {
                body = {
                    procedureName: 'Logtime.dbo.ProcLogtimeManualEncode',
                    values:  [
                        rec.ShortName,
                        rec.LogDateTime, 
                        rec.EmployeeCode,
                        rec.AdminTimeIn, 
                        rec.AdminTimeOut,
                        rec.AdminNoHrs,
                        rec.AdminUndertime,
                        rec.AdminTardiness,
                        rec.AdminOvertime,
                        rec.Meal,
                        this.isHalfDay,
                        rec.Remarks,
                        this.logtimeuserinfo.EmployeeCode,
                        1   
                    ]
                }
                console.log(body);
                this.swal.fire({
                    title: 'Are you sure?',
                    text: "This data will be uploaded to admin",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: 'teal',
                    confirmButtonText: 'Yes, Save it!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.axios.post(`${this.api}/execute`, {data: JSON.stringify(body)})
                        this.updateORALogtime(rec)
                        this.dialog = false
                        this.alert = true
                    }
                })
            }
        },
        getCutOffValues(val, code) {
            let lastDate = {}
            let dayVal = this.moment(val).format('DD')
            if(dayVal >= 6 && dayVal <= 20) {
                lastDate = {
                    Year: this.moment(val).format('YYYY'),
                    Month: this.moment(val).subtract(1, 'month').format('MM'),
                    Day: this.moment(val).subtract(1, 'month').daysInMonth('D')
                } 
                return {
                    cutOff: 2,
                    cutOffDate: `${lastDate.Year}-${lastDate.Month}-${lastDate.Day}`,
                    serialNo: `2${this.moment(val).format('YY')}${lastDate.Month}${code}`
                }
            } else {
                lastDate = {
                    Year: this.moment(val).format('YYYY'),
                    Month: this.moment(val).add(1, 'month').format('MM'),
                    Day: this.moment(val).add(1, 'month').daysInMonth('D')
                } 
                return {
                    cutOff: 1,
                    cutOffDate: this.moment(`${lastDate.Year}-${lastDate.Month}-${lastDate.Day}`).startOf('month').add(14, 'd').format('YYYY-MM-DD'),
                    serialNo: `1${this.moment(val).format('YY')}${lastDate.Month}${code}`
                }
            }
        },
        updateORALogtime(value) {
            let cutOffValues = this.getCutOffValues(value.LogDateTime, value.EmployeeCode)
            let body = {
                server: process.env.NODE_ENV ==='production' ? `HRIS${this.logtimeuserinfo.ShortName}` : `HRIS${this.logtimeuserinfo.ShortName.toLowerCase()}test`,
                procedureName: 'HRIS.PROCUPDATELOGTIME',
                values: [
                    value.EmployeeCode, 
                    this.moment(value.LogDateTime).format('YYYY-MM-DD'),
                    value.AdminTimeIn,
                    value.AdminTimeOut,
                    value.AdminNoHrs, 
                    value.AdminUndertime, 
                    value.AdminTardiness, 
                    value.AdminOvertime, 
                    1, 
                    1, 
                    value.PayCode,
                    value.ManualRem, 
                    '121', 
                    cutOffValues.serialNo,
                    cutOffValues.cutOffDate,
                    '4',
                    this.logtimeuserinfo.EmployeeCode,
                    this.moment().format('YYYY-MM-DD')
                ]
            }
            // console.log(body)
            this.axios.post(`${this.asd_sql}/oraprocedure.php`, {data: JSON.stringify(body)})
        },
    },
    watch: {
        expanded(data) {
            let value = data[0]
            if(data.length > 0) {
                this.timeIn = !value.AdminTimeIn ? null : this.moment.utc(value.AdminTimeIn).format('HH:mm')
                this.timeOut = !value.AdminTimeOut ? null : this.moment.utc(value.AdminTimeOut).format('HH:mm') 
            } else {
                this.timeIn = null
                this.timeOut = null
            }
        },
        timeOut(value) {
            let dtToday = this.moment(this.serverDateTime).format('YYYY-MM-DD')
            let valid = new Date(`${dtToday} ${value}`).getTime() > 0
            if(valid) {
                this.setLogtimeValues(this.expanded[0])
            }
        }
    },
    components: {
        
    }
}
</script>