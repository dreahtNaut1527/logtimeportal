<template>
    <v-main>
        <v-card-text class="display-1 font-weight-bold">Dashboard</v-card-text>
        <v-container>
            <v-row>
                <v-col cols="12" md="9">
                    <v-row>
                        <v-col cols="12" md="12">
                            <v-row align="center" justify="center">
                                <v-col cols="12" md="6">
                                    <v-card class="rounded-xl" elevation="4">
                                        <v-toolbar flat>
                                            <v-toolbar-title class="subtitle-1 font-weight-light">Present</v-toolbar-title>
                                            <v-spacer></v-spacer>
                                            <v-avatar class="mt-n10 rounded-pill" color="#CCB96C" size="60" tile>
                                                <v-icon x-large dark>mdi-account-check-outline</v-icon>
                                            </v-avatar>
                                        </v-toolbar>
                                        <v-card-text class="mt-n3 ml-2 display-1 font-weight-bold">
                                            {{filterTotalPresent.length == 0 ? 0 : filterTotalPresent.length}}
                                        </v-card-text>
                                    </v-card>
                                </v-col>
                                <v-col cols="12" md="6">
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
                            </v-row>    
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="12" md="12">
                    <v-card>
                        <v-container>
                            <v-toolbar flat>
                                <v-toolbar-title class="font-weight-bold">Logtime</v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-btn class="mx-3" @click="prevMonth()" color="teal" x-small dark fab><v-icon>mdi-chevron-left</v-icon></v-btn>
                                {{moment(dtLogtime).format("MMMM DD, YYYY")}}
                                <v-btn class="mx-3" @click="nextMonth()" color="teal" x-small dark fab><v-icon>mdi-chevron-right</v-icon></v-btn>
                            </v-toolbar>
                            <v-data-table
                                :headers="headers"
                                :items="filterEmployeeLogtime"
                                :loading="loading"
                                :page.sync="page"
                                :items-per-page="8"
                                loading-text="Loading Data. . .Please Wait"
                                @page-count="pageCount = $event"
                                hide-default-footer
                            >
                                <template v-slot:item="props">
                                    <tr :style="!props.item.TimeIn ? 'color: #b71c1c;' : ''">
                                        <td>{{props.item.EmployeeCode}}</td>
                                        <td>{{props.item.EmployeeName}}</td>
                                        <td>{{!props.item.TimeIn ? '' : moment.utc(props.item.TimeIn).format('HH:mm:ss')}}</td>
                                        <td>{{!props.item.TimeOut ? '' : moment.utc(props.item.TimeOut).format('HH:mm:ss')}}</td>
                                        <td>{{!props.item.TimeIn ? "" : props.item.NoHrs}}</td>
                                        <td>
                                            <v-chip v-if="props.item.TimeIn" :color="props.item.LogType == 1 ? 'orange' : 'green'" dark>
                                                {{props.item.LogTypeDesc}}
                                            </v-chip>
                                        </td>
                                        <td v-if="props.item.LogType == 1">
                                            <v-btn @click="viewEmployeeLogtimeDetails(props.item)" icon fab small>
                                                <v-icon>mdi-pencil</v-icon>
                                            </v-btn>
                                        </td>
                                        <td v-else>
                                            <v-btn @click="viewEmployeeLogtimeDetails(props.item)" icon fab small><v-icon>mdi-eye</v-icon></v-btn>
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
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
        <v-dialog v-model="dialog" width="600" persistent>
            <v-card>
                <v-toolbar color="teal" dark>
                    <v-toolbar-title>Employee Details</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn @click="dialog = false" fab icon><v-icon>mdi-close</v-icon></v-btn>
                </v-toolbar>
                <v-container>
                    <v-row align="center" justify="center" dense>
                        <v-col cols="12" md="12">
                            <v-list-item three-line>
                                <v-list-item-content>
                                    <v-list-item-title class="font-weight-bold">
                                        {{employeesLogtimeDetails.EmployeeName}} ({{employeesLogtimeDetails.EmployeeCode}})
                                    </v-list-item-title>
                                    <v-list-item-subtitle>{{employeesLogtimeDetails.DepartmentName}} / {{employeesLogtimeDetails.SectionName}}</v-list-item-subtitle>
                                    <v-list-item-subtitle>{{employeesLogtimeDetails.DesignationName}}</v-list-item-subtitle>
                                </v-list-item-content>
                                <v-list-item-avatar v-if="employeesLogtimeDetails.EmployeeCode != undefined" size="60">
                                    <v-img :src="`${photo}/${employeesLogtimeDetails.EmployeeCode}.jpg`"></v-img>
                                </v-list-item-avatar>
                            </v-list-item>
                        </v-col>
                        <v-divider class="mx-3"></v-divider>
                        <v-col cols="12" md="12">
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title class="font-weight-bold">
                                        {{moment(employeesLogtimeDetails.LogDateTime).format('MMMM DD, YYYY')}}
                                    </v-list-item-title>
                                </v-list-item-content>  
                                <v-subheader>
                                    <v-chip color="teal" dark>
                                        {{employeesLogtimeDetails.LogType == 1 ? "Work From Home" : "Office"}}
                                        <v-icon v-if="employeesLogtimeDetails.LogType == 1" right>mdi-home-map-marker</v-icon>
                                        <v-icon v-else right>mdi-office-building-marker</v-icon>
                                    </v-chip>
                                </v-subheader>
                            </v-list-item>
                            <v-card-text>
                                <v-row align="center" justify="center" dense>
                                    <v-col cols="12" md="3">
                                        <timePicker :menu="timeInDialog" :timeValue.sync="timeIn" timeLabel="Time In" />
                                    </v-col>
                                    <v-col cols="12" md="3">
                                        <timePicker :menu="timeOutDialog" :timeValue.sync="timeOut" timeLabel="Time Out" />
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field
                                            v-model="employeesLogtimeDetails.ShiftTime"
                                            label="Shift"
                                            color="teal"
                                            append-icon="mdi-calendar-range"
                                            readonly
                                            outlined
                                            dense
                                        ></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row  class="mt-n5" dense>
                                    <v-col cols="12" md="6">
                                        <v-subheader>Other Details</v-subheader>
                                        <v-card outlined>
                                            <v-list-item>
                                                <v-list-item-content>
                                                    <v-list-item-subtitle>Hours:</v-list-item-subtitle>
                                                </v-list-item-content>
                                                <v-subheader class="font-weight-bold">{{employeesLogtimeDetails.NoHrs}}</v-subheader>
                                            </v-list-item>
                                            <v-list-item>
                                                <v-list-item-content>
                                                    <v-list-item-subtitle>Overtime:</v-list-item-subtitle>
                                                </v-list-item-content>
                                                <v-subheader class="font-weight-bold">{{employeesLogtimeDetails.Overtime}}</v-subheader>
                                            </v-list-item>
                                            <v-list-item>
                                                <v-list-item-content>
                                                    <v-list-item-subtitle>Undertime:</v-list-item-subtitle>
                                                </v-list-item-content>
                                                <v-subheader class="font-weight-bold">{{employeesLogtimeDetails.Undertime}}</v-subheader>
                                            </v-list-item>
                                            <v-list-item>
                                                <v-list-item-content>
                                                    <v-list-item-subtitle>Tardiness:</v-list-item-subtitle>
                                                </v-list-item-content>
                                                <v-subheader class="font-weight-bold">{{employeesLogtimeDetails.Tardiness}}</v-subheader>
                                            </v-list-item>
                                        </v-card>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-checkbox 
                                            v-model="isHalfDay" 
                                            @change="setHalfDay(employeesLogtimeDetails)"
                                            label="Half Day" 
                                            color="teal" 
                                            dense
                                        ></v-checkbox>
                                        <v-textarea
                                            v-model="employeesLogtimeDetails.Remarks"
                                            :disabled="!isHalfDay"
                                            :height="175"
                                            color="teal"
                                            label="Remarks"
                                            outlined    
                                        ></v-textarea>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-col>
                    </v-row>
                    <v-card-actions v-if="employeesLogtimeDetails.LogType == 1">
                        <v-spacer></v-spacer>
                        <v-btn @click="dialog = false" text>Cancel</v-btn>
                        <v-btn @click="saveEmployeeLogtime(employeesLogtimeDetails)" color="teal" dark>Save</v-btn>
                    </v-card-actions>
                </v-container>
            </v-card>
        </v-dialog>
    </v-main>
</template>

<script>
import timePicker from '@/components/timepicker'

export default {
    data() {
        return {
            timeIn: null,
            timeOut: null,
            isHalfDay: false,
            timeInDialog: false,
            timeOutDialog: false,
            dialog: false,
            loading: true,
            pageCount: 0,
            page: 1,
            dtLogtime: '',
            employeesLogtime: [],
            employeesLogtimeDetails: {},
            headers: [
                {text: 'Code', value: 'EmployeeCode'},
                {text: 'Name', value: 'EmployeeName'},
                {text: 'Time In', value: 'TimeIn'},
                {text: 'Time Out', value: 'TimeOut'},
                {text: 'Hours', value: 'NoHrs'},
                {text: 'Type', value: 'LogTypeDesc'},
                {text: 'Actions', value: ''}
            ],
        }
    },
    created() {
        this.dtLogtime = this.moment().format('YYYY-MM-DD')
        this.loadEmployeesLogtime()
    },
    computed: {
        filterEmployeeLogtime() {
            return this.employeesLogtime.filter(rec => {
                return (
                    this.moment(rec.LogDateTime).format('YYYY-MM-DD').includes(this.dtLogtime) &&
                    rec.EmployeeCode != this.logtimeuserinfo.EmployeeCode
                )
            })
        },
        filterTotalPresent() {
            return this.employeesLogtime.filter(rec => {
                return (
                        this.moment(rec.LogDateTime).format('YYYY-MM-DD').includes(this.dtLogtime) &&
                        rec.EmployeeCode != this.logtimeuserinfo.EmployeeCode &&
                        rec.TimeIn != null
                    )
            })
        },
        filterTotalAbsent() {
            return this.employeesLogtime.filter(rec => {
                return (
                    this.moment(rec.LogDateTime).format('YYYY-MM-DD').includes(this.dtLogtime) &&
                    rec.EmployeeCode != this.logtimeuserinfo.EmployeeCode &&
                    rec.TimeIn == null &&
                    rec.OTCode == 'RD'
                )
            })
        }
    },
    methods: {
        loadEmployeesLogtime() {
            this.loading = true
            let body = {
                procedureName: 'Logtime.dbo.ProcGetLogTimeData',
                values: []
            }
            switch (this.logtimeuserinfo.UserLevel) {
                case 1:
                    body.values.push(
                        `LT${this.moment(this.dtLogtime).format('MMYYYY')}`,
                        this.logtimeuserinfo.ShortName,
                        this.logtimeuserinfo.DepartmentName,
                        null,
                        null
                    )
                    break;
                case 2:
                    body.values.push(
                        `LT${this.moment(this.dtLogtime).format('MMYYYY')}`,
                        this.logtimeuserinfo.ShortName,
                        this.logtimeuserinfo.DepartmentName,
                        this.logtimeuserinfo.SectionName,
                        null
                    )
                    break;
                case 3:
                    body.values.push(
                        `LT${this.moment(this.dtLogtime).format('MMYYYY')}`,
                        this.logtimeuserinfo.ShortName,
                        this.logtimeuserinfo.DepartmentName,
                        this.logtimeuserinfo.SectionName,
                        this.logtimeuserinfo.TeamName
                    )
                    break;            
                default:
                    body.values.push(
                        `LT${this.moment(this.dtLogtime).format('MMYYYY')}`,
                        this.logtimeuserinfo.ShortName,
                        null,
                        null,
                        null
                    )
                    break;
            }
            // console.log(body);
            this.axios.post(`${this.api}/executeselect`,  {data: JSON.stringify(body)}).then(res => {
                this.employeesLogtime = res.data
                this.loading = false
            })
        },
        nextMonth() {
            this.dtLogtime = this.moment(this.dtLogtime).add(1, 'days').format('YYYY-MM-DD')
            if(this.filterEmployeeLogtime.length == 0) {
                this.loadEmployeesLogtime()
            }
        },
        prevMonth() {
            this.dtLogtime = this.moment(this.dtLogtime).subtract(1, 'days').format('YYYY-MM-DD')
            if(this.filterEmployeeLogtime.length == 0) {
                this.loadEmployeesLogtime()
            }
        },
        viewEmployeeLogtimeDetails(val) {
            this.dialog = true
            Object.assign(this.employeesLogtimeDetails, val)
            this.timeIn = val.TimeIn == null ? null : this.moment.utc(val.TimeIn).format('HH:mm:ss')
            this.timeOut = val.TimeOut == null ? null : this.moment.utc(val.TimeOut).format('HH:mm:ss')
        },
        saveEmployeeLogtime(record) {
            this.swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: 'teal',
                confirmButtonText: 'Yes, Save it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.setTimeOut(record)
                    this.dialog = false
                    this.employeesLogtimeDetails = {}
                    this.loadEmployeesLogtime()
                    this.swal.fire(
                        'Confirmed!',
                        'Recored has been Updated.',
                        'success'
                    )
                }
            })
        },
        setTimeOut(value) {
            let timeLogOut = `${this.moment(value.LogDateTime).format('YYYY-MM-DD')} ${this.timeOut}`
            let body = {
                procedureName: 'Logtime.dbo.ProcInsertLogTimeData',
                values: [
                    `LT${this.moment().format('MMYYYY')}`, 
                    value.ShortName, 
                    value.IDCode,
                    value.EmployeeCode, 
                    this.moment(value.LogDateTime).format('YYYY-MM-DD'),
                    value.TimeIn, 
                    timeLogOut,
                    value.NoHrs, 
                    value.Undertime, 
                    value.Tardiness, 
                    value.Overtime, 
                    value.ND, 
                    value.Shift, 
                    value.SW1, 
                    1, 
                    value.UserAcct, 
                    this.logtimeuserinfo.EmployeeCode,  //UserAcctO, 
                    value.UserTime, 
                    this.moment.utc().format('YYYY-MM-DD HH:mm:ss'), //UserTimeO, 
                    value.ManualRem, 
                    '121', // Manual RemO
                    value.ND1, 
                    value.ND2, 
                    value.NoHrs1, 
                    value.OTCode == 'RD' ? 'R' : 'O', // OTCode
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
            this.axios.post(`${this.api}/execute`, {data: JSON.stringify(body)})
            if(this.isHalfDay) {
                body = {
                    procedureName: 'Logtime.dbo.ProcLogtimeManualEncode',
                    values: [
                        value.LogDateTime, 
                        value.EmployeeCode,
                        this.isHalfDay,
                        value.Remarks,
                        this.logtimeuserinfo.EmployeeCode,
                        1   
                    ]
                }
                this.axios.post(`${this.api}/execute`, {data: JSON.stringify(body)})
            }   
        },
        setHalfDay(val){
            let timeInVal = this.moment.utc(`${val.StartTime}`, 'YYYY-MM-DD HH:mm:ss')
            
            if(this.isHalfDay) {
                // Set Undertime Value
                this.timeOut = timeInVal.add(4, 'hours')
                this.timeOut = timeInVal.set({second: 0}).format('HH:mm')
            } else {
                this.timeOut = null
                val.NoHrs = 0
                val.Undertime = 0
                val.Overtime = 0
                val.Tardiness = 0
            }
        },
        setOvertime(hours) {
            let decimal = (hours - 9).toFixed(2)

            if(decimal.substr(2, 1) > 5) {
                return (decimal - 0.1).toFixed(2)
            } else {
                return (hours - 1) > 8 ? (hours - 9).toFixed(2) : 0
            }
        },
        setUnderTime(hours) {
            return (hours - 9) < 0 ? (hours - 9).toFixed(2) : 0
        },
        updateORALogtime(value) {
            let body = {
                server: process.env.NODE_ENV == 'production' ? `HRIS${value.ShortName}` : 'HRIS',
                procedureName: 'PROCUPDATELOGTIME',
                values: [
                    value.EmployeeCode, 
                    this.moment(value.LogDateTime).format('YYYY-MM-DD'),
                    value.StartTime,
                    value.EndTime,
                    8, 
                    value.SW1, 
                    1, 
                    this.payCode,
                    value.ManualRem, 
                    value.ManualRemO, 
                ]
            }
            // console.log(body)
            this.axios.post(`${this.asd_sql}/oraprocedure.php`, {data: JSON.stringify(body)})
        }, 
        calculateDates(date1, date2) {

            let years = date1.diff(date2, 'year');
            date2.add(years, 'years');

            let months = date1.diff(date2, 'months');
            date2.add(months, 'months');

            let days = date1.diff(date2, 'days');
            date2.add(days, 'days');

            let hours = date1.diff(date2, 'hours', true);
            date2.add(hours, 'hours');

            let minutes = date1.diff(date2, 'minutes', true);
            date2.add(minutes, 'minutes');

            let seconds = date1.diff(date2, 'seconds');

            return {years, months, days, hours, minutes, seconds};
        }
    },
    watch: {
        dialog(val) {
            if(!val) {
                this.employeesLogtimeDetails = {}
                this.isHalfDay = false
            }
        },
        timeOut(val) {
            let duration = {}
            let dateToday = this.moment.utc(this.serverDateTime).format('YYYY-MM-DD')
            let timeInVal = this.moment.utc(`${this.employeesLogtimeDetails.StartTime}`, 'YYYY-MM-DD HH:mm:ss')
            let timeOutVal = this.moment.utc(`${dateToday} ${val}`, 'YYYY-MM-DD HH:mm:ss')
            let hours =  timeInVal.format('HH')

            //Calculate
            duration = this.calculateDates(timeOutVal, timeInVal)
            this.isHalfDay = duration.hours > 4 ? false : true
            
            if(!this.isHalfDay) {
                if (val && hours < timeOutVal.format('HH')) {
                    this.employeesLogtimeDetails.TimeOut = `${dateToday} ${val}`

                    this.employeesLogtimeDetails.NoHrs = (duration.hours - 1) >= 8 ? 8 : (duration.hours - 1).toFixed(2)
                    this.employeesLogtimeDetails.Overtime = this.setOvertime(duration.hours)
                    this.employeesLogtimeDetails.Undertime = this.setUnderTime(duration.hours)
                } else {
                    this.employeesLogtimeDetails.NoHrs = 0
                    this.employeesLogtimeDetails.Overtime = 0
                    this.employeesLogtimeDetails.TimeOut = null
                }
            } else {
                this.employeesLogtimeDetails.NoHrs = duration.hours
                this.employeesLogtimeDetails.Overtime = 0
                this.employeesLogtimeDetails.Undertime = duration.hours 
            }
        }
    },
    components: {   
        timePicker
    }
}
</script>