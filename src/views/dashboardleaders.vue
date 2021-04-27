<template>
    <v-main>
        <v-card-text class="display-1 font-weight-bold">Dashboard</v-card-text>                                 
        <v-container>
            <v-row justify="center">
                <v-col cols="12" md="9">
                    <v-row align="center" justify="space-between">
                        <v-col cols="12" md="4">
                            <v-card flat>
                                <v-subheader>Total Present: 
                                    <v-spacer></v-spacer>
                                    <div class="font-weight-bold text-h4">
                                        {{filterTotalPresent.length == 0 ? 0 : filterTotalPresent.length}}
                                    </div>
                                </v-subheader>
                                <v-container class="text-center pa-10 mt-n5">
                                    <v-progress-circular
                                        :rotate="90"
                                        :size="150"
                                        :width="10"
                                        :value="(filterTotalPresent.length / filterEmployeeLogtime.length) * 100"
                                        color="#CCB96C"
                                    >
                                        <v-icon color="#CCB96C" x-large>mdi-account</v-icon>
                                    </v-progress-circular>
                                </v-container>
                            </v-card>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-card flat>
                                <v-subheader>Total Absent: 
                                    <v-spacer></v-spacer>
                                    <div class="font-weight-bold text-h4">
                                         {{filterTotalAbsent.length}}
                                    </div>
                                </v-subheader>
                                <v-container class="text-center pa-10 mt-n5">
                                    <v-progress-circular
                                         :rotate="90"
                                        :size="150"
                                        :width="10"
                                        :value="(filterTotalAbsent.length / filterEmployeeLogtime.length) * 100"
                                        color="teal"
                                    >
                                        <v-icon color="teal" x-large>mdi-exclamation-thick</v-icon>
                                    </v-progress-circular>
                                </v-container>
                            </v-card>
                        </v-col>
                        <v-col cols="12" md="4">
                             <v-card flat>
                                <v-subheader>Percentage: 
                                    <v-spacer></v-spacer>
                                    <div class="font-weight-bold text-h4">
                                        {{((filterTotalPresent.length / filterEmployeeLogtime.length) * 100).toFixed(2)}}%
                                    </div>
                                </v-subheader>
                                <v-container class="text-center pa-10 mt-n5">
                                    <v-progress-circular
                                        :rotate="90"
                                        :size="150"
                                        :width="10"
                                        :value="(filterTotalPresent.length / filterEmployeeLogtime.length) * 100"
                                        color="#CC95C7"
                                    >
                                        <v-icon color="#CC95C7" x-large>mdi-percent</v-icon>
                                    </v-progress-circular>
                                </v-container>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="12" md="3">
                    <v-card outlined>
                        <v-toolbar color="teal" flat dark>
                            <v-toolbar-title>Today</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                        @click="logtimeDialog = !logtimeDialog"
                                        v-bind="attrs"
                                        v-on="on"
                                        dark
                                        icon
                                    >
                                        <v-icon>
                                            mdi-eye
                                        </v-icon>
                                    </v-btn>
                                </template>
                                <span>View Logtime</span>
                            </v-tooltip>
                        </v-toolbar>
                        <v-container>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-subtitle>TimeIn:</v-list-item-subtitle>
                                </v-list-item-content>
                                <v-spacer></v-spacer>
                                <v-subheader class="font-weight-bold">{{moment.utc(logtimeuserinfo.TimeIn).format('HH:mm:ss')}}</v-subheader>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-subtitle>TimeOut:</v-list-item-subtitle>
                                </v-list-item-content>
                                <v-spacer></v-spacer>
                                <v-subheader class="font-weight-bold" v-if="logtimeuserinfo.TimeOut != null">{{moment.utc(logtimeuserinfo.TimeOut).format('HH:mm:ss')}}</v-subheader>
                                <v-subheader class="font-weight-bold" v-else>N/A</v-subheader>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-subtitle>Logtype:</v-list-item-subtitle>
                                </v-list-item-content>
                                <v-spacer></v-spacer>
                                <v-chip color="teal" dark>
                                    {{logtimeuserinfo.LogType == 1 ? "Home" : "Office"}}
                                    <v-icon v-if="employeesLogtimeDetails.LogType == 1" right>mdi-home-map-marker</v-icon>
                                    <v-icon v-else right>mdi-office-building-marker</v-icon>
                                </v-chip>
                            </v-list-item>
                        </v-container>
                    </v-card>
                </v-col>    
                <v-col cols="12" md="12">
                    <v-card>
                        <v-container>
                            <v-toolbar flat>
                                <v-toolbar-title class="font-weight-bold hidden-md-and-down">Logtime</v-toolbar-title>
                                <v-spacer></v-spacer>
                                    <v-text-field
                                        v-model="searchTable"
                                        placeholder="Search" 
                                        append-icon="mdi-magnify"
                                        color="teal"
                                        hide-details
                                        outlined
                                        dense
                                    ></v-text-field>
                                    <datePicker :menu="dateDialog" :dateValue.sync="dtLogtime" dateLabel="Logdate" /> 
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-btn 
                                                @click="extractData(filterEmployeeLogtime)" 
                                                color="teal" 
                                                v-on="on"
                                                v-bind="attrs"
                                                x-large 
                                                icon
                                            >
                                                <v-icon>mdi-download</v-icon>
                                            </v-btn>
                                        </template>
                                        <span>Download CSV</span>
                                    </v-tooltip> 
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{on, attrs}">
                                            <v-btn
                                                @click="exporttoexcel()"
                                                color="teal"
                                                v-on="on"
                                                v-bind="attrs"
                                                icon
                                            >
                                                <v-icon>mdi-file-excel</v-icon>
                                            </v-btn>
                                        </template>
                                        <span>Download Excel</span>
                                    </v-tooltip>
                            </v-toolbar>
                            <v-divider></v-divider>
                            <v-data-table
                                :headers="headers"
                                :items="filterEmployeeLogtime"
                                :loading="loading"
                                :page.sync="page"
                                :search="searchTable"
                                :items-per-page="5"
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
                                        <td class="text-center">{{!props.item.TimeIn ? "" : props.item.NoHrs}}</td>
                                        <td class="text-center">{{!props.item.TimeIn ? "" : props.item.Overtime}}</td>
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
                            <v-card outlined>
                                <v-container class="my-n3">
                                    <v-row align="center" justify="center" dense>
                                        <v-col cols="12" md="3">
                                            <v-list-item>
                                                <v-list-item-content>
                                                    <v-list-item-subtitle>TimeIn:</v-list-item-subtitle>
                                                    <v-list-item-title class="font-weight-bold">
                                                        {{employeesLogtimeDetails.TimeIn != null ? moment.utc(employeesLogtimeDetails.TimeIn).format('HH:mm:ss') : "N/A"}}
                                                    </v-list-item-title>
                                                </v-list-item-content>
                                            </v-list-item>
                                        </v-col>
                                        <v-col cols="12" md="3">
                                            <v-list-item>
                                                <v-list-item-content>
                                                    <v-list-item-subtitle>TimeOut:</v-list-item-subtitle>
                                                    <v-list-item-title class="font-weight-bold">
                                                        {{employeesLogtimeDetails.TimeOut != null ? moment.utc(employeesLogtimeDetails.TimeOut).format('HH:mm:ss') : "N/A"}}
                                                    </v-list-item-title>
                                                </v-list-item-content>
                                            </v-list-item>
                                        </v-col>
                                        <v-col cols="12" md="6">
                                            <v-list-item>
                                                <v-list-item-content>
                                                    <v-list-item-subtitle>Shift:</v-list-item-subtitle>
                                                    <v-list-item-title class="font-weight-bold">
                                                        {{employeesLogtimeDetails.ShiftTime}}
                                                    </v-list-item-title>
                                                </v-list-item-content>
                                            </v-list-item>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card>
                            <v-card class="mt-2" outlined>
                                <v-subheader>Manual Encode:</v-subheader>
                                <v-divider></v-divider>
                                <v-container class="mb-n5">
                                    <v-row align="center" justify="center" dense>
                                        <v-col cols="12" md="6">
                                            <v-card-actions class="ma-0 pa-0">
                                                <v-card-text class="font-weight-bold">TimeIn:</v-card-text>
                                                <v-spacer></v-spacer>
                                                <timePicker :menu="timeInDialog" :timeValue.sync="timeIn" timeLabel="" />
                                            </v-card-actions>                                            
                                        </v-col>
                                        <v-col cols="12" md="6">
                                            <v-card-actions class="ma-0 pa-0">
                                                <v-card-text class="font-weight-bold">TimeOut:</v-card-text>
                                                <v-spacer></v-spacer>
                                                <timePicker :menu="timeOutDialog" :timeValue.sync="timeOut" timeLabel="" />
                                            </v-card-actions>                                            
                                        </v-col>
                                    </v-row>
                                    <v-row class="mb-n10" dense>
                                        <v-col cols="12" md="3">
                                            <v-text-field
                                                v-model="employeesLogtimeDetailsManual.NoHrs"
                                                label="Hours"
                                                type="number"
                                                color="teal" 
                                                outlined
                                                dense
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="3">
                                            <v-text-field
                                                v-model="employeesLogtimeDetailsManual.Undertime"
                                                label="Undertime"
                                                color="teal" 
                                                type="number"
                                                outlined
                                                dense
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="3">
                                            <v-text-field
                                                v-model="employeesLogtimeDetailsManual.Tardiness"
                                                label="Tardiness"
                                                color="teal" 
                                                type="number"
                                                outlined
                                                dense
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="3">
                                            <v-text-field
                                                v-model="employeesLogtimeDetailsManual.Overtime"
                                                label="Overtime"
                                                color="teal" 
                                                type="number"
                                                outlined
                                                dense
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-card-actions>
                                        <v-checkbox 
                                            v-model="employeesLogtimeDetailsManual.Meal" 
                                            label="Meal" 
                                            color="teal" 
                                            readonly
                                            dense
                                        ></v-checkbox>
                                        <v-spacer></v-spacer>
                                        <v-checkbox 
                                            v-model="isHalfDay" 
                                            @change="setHalfDay(employeesLogtimeDetailsManual)"
                                            label="Half Day" 
                                            color="teal" 
                                            dense
                                        ></v-checkbox>
                                    </v-card-actions>
                                    <v-textarea
                                        v-model="employeesLogtimeDetailsManual.Remarks"
                                        color="teal"
                                        :height="100"
                                        label="Remarks"
                                        outlined    
                                    ></v-textarea>
                                </v-container>
                            </v-card>
                            <!-- <v-card-text> -->
                                <!-- <v-row  class="mt-n5" dense>
                                    <v-col cols="12" md="6"> -->
                                            <!-- <v-list-item>
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
                                            </v-list-item> -->
                                    <!-- </v-col>
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
                                </v-row> -->
                            <!-- </v-card-text> -->
                        </v-col>
                    </v-row>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn @click="dialog = false" text>Cancel</v-btn>
                        <!-- <v-btn v-if="employeesLogtimeDetails.LogType == 1" @click="saveEmployeeLogtime(employeesLogtimeDetails)" color="teal" dark>Save</v-btn> -->
                        <v-btn v-if="employeesLogtimeDetails.LogType == 1" @click="saveEmployeeLogtimeData(employeesLogtimeDetailsManual)" color="teal" dark>Save</v-btn>
                    </v-card-actions>
                </v-container>
            </v-card>
        </v-dialog>
        <v-dialog v-model="logtimeDialog" width="700" persistent>
            <v-card>
                <v-toolbar color="teal" dark>
                    <v-toolbar-title><v-icon large left>mdi-calendar</v-icon>Your Logtime</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn @click="logtimeDialog = !logtimeDialog" icon><v-icon>mdi-close</v-icon></v-btn>
                </v-toolbar>
                <v-container>
                    <v-data-table
                        :headers="headersUser"
                        :items="filterEmployeeLogtimeUser"
                        :page.sync="pageUser"
                        :search="searchTable"
                        :items-per-page="6"
                        @page-count="pageCountUser = $event"
                        hide-default-footer
                    >
                        <template v-slot:item="props">
                            <tr :style="!props.item.TimeIn ? 'color: #b71c1c;' : ''">
                                <td>{{moment.utc(props.item.LogDateTime).format('MMMM DD, YYYY')}}</td>
                                <td>{{!props.item.TimeIn ? '' : moment.utc(props.item.TimeIn).format('HH:mm:ss')}}</td>
                                <td>{{!props.item.TimeOut ? '' : moment.utc(props.item.TimeOut).format('HH:mm:ss')}}</td>
                                <td class="text-center">{{!props.item.TimeIn ? "" : props.item.NoHrs}}</td>
                                <td class="text-center">{{!props.item.TimeIn ? "" : props.item.Overtime}}</td>
                                <td>
                                    <v-chip v-if="props.item.TimeIn" :color="props.item.LogType == 1 ? 'orange' : 'green'" dark>
                                        {{props.item.LogTypeDesc}}
                                    </v-chip>
                                </td>
                            </tr>
                        </template>
                    </v-data-table> 
                    <v-pagination
                        v-model="pageUser"
                        color="teal"
                        :length="pageCountUser"
                        :total-visible="10"
                    ></v-pagination>
                </v-container>
            </v-card>
        </v-dialog>
    </v-main>
</template>

<script>
import datePicker from '@/components/datepicker'
import timePicker from '@/components/timepicker'

export default {
    data() {
        return {
            timeIn: null,
            timeOut: null,
            isHalfDay: false,
            dateDialog: false,
            logtimeDialog: false,
            timeInDialog: false,
            timeOutDialog: false,
            dialog: false,
            loading: true,
            pageCount: 0,
            page: 1,
            pageCountUser: 0,
            pageUser: 1,
            dateToday: '',
            searchTable: '',
            dtLogtime: '',
            employeesLogtime: [],
            employeesLogtimeDetails: {},
            employeesLogtimeDetailsManual: {
                ShortName: null,
                LogDateTime: null,
                EmployeeCode: null,
                TimeIn: null, 
                TimeOut: null,
                NoHrs: 0.0000,
                Undertime: 0.0000,
                Tardiness: 0.0000,
                Overtime: 0.0000,
                Meal: 0,
                PayCode: null,
                ManualRem: null,
                ManualRemO: null,
                IsHalfDay: false,
                Remarks: null,
                UpdatedUserId: null,
            },
            headers: [
                {text: 'Code', value: 'EmployeeCode'},
                {text: 'Name', value: 'EmployeeName'},
                {text: 'Time In', value: 'TimeIn'},
                {text: 'Time Out', value: 'TimeOut'},
                {text: 'Hours', value: 'NoHrs'},
                {text: 'Overtime', value: 'Overtime'},
                {text: 'Type', value: 'LogTypeDesc'},
                {text: 'Actions', value: ''}
            ],
            headersUser: [
                {text: 'Date', value: 'LogDateTime'},
                {text: 'Time In', value: 'TimeIn'},
                {text: 'Time Out', value: 'TimeOut'},
                {text: 'Hours', value: 'NoHrs'},
                {text: 'Overtime', value: 'Overtime'},
                {text: 'Type', value: 'LogTypeDesc'}
            ],
        }
    },
    created() {
        this.dateToday = this.serverDateTime
        this.dtLogtime = this.moment().format('YYYY-MM-DD')
        this.loadEmployeesLogtime()
    },
    mounted() {
        setInterval(() => {
            this.dateToday = this.moment.utc(this.dateToday).add(1, 'seconds')
            this.$store.commit('CHANGE_SERVERDATETTIME', this.dateToday)
        }, 1000);   
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
        filterEmployeeLogtimeUser() {
            return this.employeesLogtime.filter(rec => {
                return (
                    this.moment(rec.LogDateTime).format('YYYY-MM-DD') != this.moment(this.logtimeuserinfo.LogDateTime).format('YYYY-MM-DD') &&
                    rec.EmployeeCode == this.logtimeuserinfo.EmployeeCode
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
        },
    },
    methods: {
        exporttoexcel() {
            let body = []
            this.filterEmployeeLogtime.forEach(rec => {
                body.push({
                    Date: rec.LogDateTime,
                    Code: rec.EmployeeCode,
                    Name: rec.EmployeeName,
                    TimeIn: rec.TimeIn,
                    TimeOut: rec.TimeOut
                })
            })
            console.log(body);
            this.axios.get(`${this.api}/exported`, {resposeType: 'blob'}).then(res => {
                const blob = new Blob(
                [res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
                const aEle = document.createElement('a');     // Create a label
                const href = window.URL.createObjectURL(blob);       // Create downloaded link
                aEle.href = href;
                aEle.download = 'test.xls';  // File name after download
                document.body.appendChild(aEle);
                aEle.click();     // Click to download
                document.body.removeChild(aEle); // Download complete remove element
                window.URL.revokeObjectURL(href) // Release blob object
            })
        },
        extractData(val) {
            let body = []
            let dtToday = this.moment.utc(this.serverDateTime).format('MMDDYYYY')
            val.forEach(rec => [
                body.push({
                    Code: rec.EmployeeCode.toString(),
                    Name: rec.EmployeeName,
                    TimeIn: rec.TimeIn == null ? '' : this.moment.utc(rec.TimeIn).format('HH:mm:ss'),
                    TimeOut: rec.TimeOut == null ? '' : this.moment.utc(rec.TimeOut).format('HH:mm:ss'),
                    LogType: rec.LogType == 1 ? 'Work From Home' : 'Office'
                })
            ])  
            this.axios.post(`${this.api}/exportcsv`, {data: JSON.stringify(body)}).then(res => {
                this.jsfiledownload(res.data, `Employee Logtime - ${dtToday}.csv`)
            })
        },
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
                        this.logtimeuserinfo.DepartmentName,
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
        viewEmployeeLogtimeDetails(val) {
            this.dialog = true
            this.employeesLogtimeDetails = val
            this.employeesLogtimeDetailsManual = {
                ShortName: val.ShortName,
                LogDateTime: val.LogDateTime,
                EmployeeCode: val.EmployeeCode,
                TimeIn: val.AdminTimeIn, 
                TimeOut: val.AdminTimeOut,
                NoHrs: val.AdminNoHrs,
                Undertime: val.AdminUndertime,
                Tardiness: val.AdminTardiness,
                Overtime: val.AdminOvertime,
                Meal: val.Meal,
                PayCode: val.PayCode,
                ManualRem: val.ManualRem,
                ManualRemO: val.ManualRemO,
                IsHalfDay: val.IsHalfDay,
                Remarks: val.Remakrs,
                UpdatedUserId: this.logtimeuserinfo.EmployeeCode,
            }
            // this.timeIn = val.TimeIn == null ? null : this.moment.utc(val.TimeIn).format('HH:mm:ss')
            // this.timeOut = val.TimeOut == null ? null : this.moment.utc(val.TimeOut).format('HH:mm:ss')
        },
        clearVariables() {
            this.timeIn = null
            this.timeOut = null
            this.employeesLogtimeDetails = {}
            this.loadEmployeesLogtime()
            this.employeesLogtimeDetailsManual = {
                ShortName: null,
                LogDateTime: null,
                EmployeeCode: null,
                TimeIn: null, 
                TimeOut: null,
                NoHrs: 0.0000,
                Undertime: 0.0000,
                Tardiness: 0.0000,
                Overtime: 0.0000,
                Meal: 0,
                PayCode: null,
                ManualRem: null,
                ManualRemO: null,
                IsHalfDay: false,
                Remarks: null,
                UpdatedUserId: null,
            }
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
                    this.timeOut = timeInVal.set({second: 0}).format('HH:mm')
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
        setLogtimeValues() {
            let duration = null
            let dtToday = this.moment.utc(this.serverDateTime).format('YYYY-MM-DD')
            let timeInVal = this.moment.utc(`${dtToday} ${this.timeIn}:00`)
            let timeOutVal = this.moment.utc(`${dtToday} ${this.timeOut}:00`)
            
            if(this.timeOut != null && timeInVal.format('HH') < timeOutVal.format('HH')) {
                duration = this.calculateDates(timeOutVal, timeInVal)
                Object.assign(this.employeesLogtimeDetailsManual, {
                    TimeIn: `${dtToday} ${this.timeIn}`,
                    TimeOut: `${dtToday} ${this.timeOut}`,
                    NoHrs: (duration.hours) >= 8 ? 8 : parseFloat((duration.hours).toFixed(2)),
                    Overtime: this.setOvertime(duration.hours),
                    Undertime: this.setUnderTime(duration.hours),
                    Tardiness: 0
                })
            } else {
                this.employeesLogtimeDetailsManual.NoHrs = 0
                this.employeesLogtimeDetailsManual.Undertime = 0
                this.employeesLogtimeDetailsManual.Tardiness = 0
                this.employeesLogtimeDetailsManual.Overtime = 0
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
                        rec.TimeIn, 
                        rec.TimeOut,
                        rec.NoHrs,
                        rec.Undertime,
                        rec.Tardiness,
                        rec.Overtime,
                        rec.Meal,
                        this.isHalfDay,
                        rec.Remarks,
                        rec.UpdatedUserId,
                        1   
                    ]
                }
                // console.log(body);
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
                        this.updateORALogtime(this.employeesLogtimeDetailsManual)
                        this.dialog = false
                        this.clearVariables()
                        this.swal.fire('Confirmed!', 'Record has been Uploaded to Admin.', 'success')
                    }
                })
            }
        },
        updateORALogtime(value) {
            let body = {
                server: `HRIS${value.ShortName}`,
                procedureName: 'PROCUPDATELOGTIME',
                values: [
                    value.EmployeeCode, 
                    this.moment(value.LogDateTime).format('YYYY-MM-DD'),
                    value.TimeIn,
                    value.TimeOut,
                    value.NoHrs, 
                    value.Undertime, 
                    value.Tardiness, 
                    value.Overtime, 
                    1, 
                    1, 
                    value.PayCode,
                    value.ManualRem, 
                    '121', 
                ]
            }
            console.log(body)
            // this.axios.post(`${this.asd_sql}/oraprocedure.php`, {data: JSON.stringify(body)})
        },
        // saveEmployeeLogtime(record) {
        //     this.swal.fire({
        //         title: 'Are you sure?',
        //         text: "You won't be able to revert this!",
        //         icon: 'warning',
        //         showCancelButton: true,
        //         confirmButtonColor: 'teal',
        //         confirmButtonText: 'Yes, Save it!'
        //     }).then((result) => {
        //         if (result.isConfirmed) {
        //             // this.setTimeOut(record)
        //             console.log(record)
        //             this.clearVariables()
        //             this.dialog = false
        //             this.swal.fire('Confirmed!', 'Record has been Updated.', 'success')
        //         }
        //     })
        // },
        // setTimeOut(value) {
        //     let timeLogIn = null
        //     let timeLogOut = null

        //     timeLogIn = `${this.moment(value.LogDateTime).format('YYYY-MM-DD')} ${this.timeIn}`
        //     if(this.timeOut) {
        //         timeLogOut = `${this.moment(value.LogDateTime).format('YYYY-MM-DD')} ${this.timeOut}`
        //     }

        //     let body = {
        //         procedureName: 'Logtime.dbo.ProcInsertLogTimeData',
        //         values: [
        //             `LT${this.moment().format('MMYYYY')}`, 
        //             value.ShortName, 
        //             value.IDCode,
        //             value.EmployeeCode, 
        //             this.moment(value.LogDateTime).format('YYYY-MM-DD'),
        //             timeLogIn, 
        //             timeLogOut,
        //             value.NoHrs, 
        //             value.Undertime, 
        //             value.Tardiness, 
        //             value.Overtime, 
        //             value.ND, 
        //             value.Shift, 
        //             value.SW1, 
        //             1, 
        //             this.logtimeuserinfo.EmployeeCode,  //UserAcct, 
        //             this.logtimeuserinfo.EmployeeCode,  //UserAcctO, 
        //             this.moment.utc().format('YYYY-MM-DD HH:mm:ss'), //UserTime, 
        //             this.moment.utc().format('YYYY-MM-DD HH:mm:ss'), //UserTimeO, 
        //             '121', //ManualRem, 
        //             '121', // Manual RemO
        //             value.ND1, 
        //             value.ND2, 
        //             value.NoHrs1, 
        //             value.OTCode == 'RD' ? 'R' : 'O', // OTCode
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
        //     console.log(body)
        //     this.axios.post(`${this.api}/execute`, {data: JSON.stringify(body)})
        //     if(this.isHalfDay) {
        //         body = {
        //             procedureName: 'Logtime.dbo.ProcLogtimeManualEncode',
        //             values: [
        //                 value.LogDateTime, 
        //                 value.EmployeeCode,
        //                 this.isHalfDay,
        //                 value.Remarks,
        //                 this.logtimeuserinfo.EmployeeCode,
        //                 1   
        //             ]
        //         }
        //         this.axios.post(`${this.api}/execute`, {data: JSON.stringify(body)})
        //     }   
        // },
        // setHalfDay(val){
        //     let timeInVal = this.moment.utc(`${val.StartTime}`, 'YYYY-MM-DD HH:mm:ss')
            
        //     if(this.isHalfDay) {
        //         // Set Undertime Value
        //         this.timeOut = timeInVal.add(4, 'hours')
        //         this.timeOut = timeInVal.set({second: 0}).format('HH:mm')
        //     } else {
        //         this.timeOut = null
        //         val.NoHrs = 0
        //         val.Undertime = 0
        //         val.Overtime = 0
        //         val.Tardiness = 0
        //     }
        // }, 
    },
    watch: {
        dialog(val) {
            if(!val) {
                this.clearVariables()
            }
        },
        dtLogtime() {
            if(this.filterEmployeeLogtime.length == 0) {
                this.loadEmployeesLogtime()
            }
        },
        timeIn() {
            this.setLogtimeValues()
        },
        timeOut() {
            this.setLogtimeValues()
        }
        // timeOut(val) {
        //     let duration = {}
        //     let dateToday = this.moment.utc(this.serverDateTime).format('YYYY-MM-DD')
        //     let timeInVal = this.moment.utc(`${this.employeesLogtimeDetails.StartTime}`, 'YYYY-MM-DD HH:mm:ss')
        //     let timeOutVal = this.moment.utc(`${dateToday} ${val}`, 'YYYY-MM-DD HH:mm:ss')
        //     let hours =  timeInVal.format('HH')

        //     //Calculate
        //     duration = this.calculateDates(timeOutVal, timeInVal)
        //     // console.log(Math.round(duration.hours));
        //     this.isHalfDay = duration.hours == 4 ? true : false
            
        //     if(!this.isHalfDay) {
        //         if (val && hours < timeOutVal.format('HH')) {
        //             this.employeesLogtimeDetails.TimeOut = `${dateToday} ${val}`

        //             this.employeesLogtimeDetails.NoHrs = (duration.hours - 1) >= 8 ? 8 : parseFloat((duration.hours - 1).toFixed(2))
        //             this.employeesLogtimeDetails.Overtime = this.setOvertime(duration.hours)
        //             this.employeesLogtimeDetails.Undertime = this.setUnderTime(duration.hours)
        //         } else {
        //             this.employeesLogtimeDetails.NoHrs = 0
        //             this.employeesLogtimeDetails.Overtime = 0
        //             this.employeesLogtimeDetails.TimeOut = null
        //         }
        //     } else {
        //         this.employeesLogtimeDetails.NoHrs = duration.hours
        //         this.employeesLogtimeDetails.Overtime = 0
        //         this.employeesLogtimeDetails.Undertime = duration.hours 
        //     }
        // }
    },
    components: {   
        datePicker,
        timePicker
    }
}
</script>