<template>
    <v-main>
        <v-card-text class="display-1 font-weight-bold">Dashboard</v-card-text>                                 
        <v-container>
            <v-row justify="center">
                <v-col cols="12" md="12">
                    <v-card outlined>
                        <v-toolbar color="teal" dense dark>
                            <v-toolbar-title>Filter</v-toolbar-title>
                        </v-toolbar>
                        <v-container>
                            <v-row dense>
                                <!-- <v-col v-for="(item, i) in dateRange" :key="i" cols="12" md="2">
                                    <datePicker :menu="item.dialog" :dateValue.sync="item.value" :dateLabel="item.text" /> 
                                </v-col> -->
                                <v-col cols="12" md="2">
                                    <datePicker :menu="dateDialog" :dateValue.sync="dtLogtime" dateLabel="Logdate" /> 
                                </v-col>
                                <v-col v-if="logtimeuserinfo.UserLevel == 9" cols="12" md="3">
                                    <v-autocomplete
                                        v-model="department"
                                        label="Department"
                                        :items="departmentList"
                                        item-text="DepartmentName"
                                        item-value="DepartmentName"
                                        color="teal"
                                        hide-details
                                        clearable
                                        outlined
                                        dense
                                    ></v-autocomplete>
                                </v-col>
                                <v-col cols="12" md="3">
                                    <v-autocomplete
                                        v-model="section"
                                        label="Section"
                                        :items="sectionList"
                                        item-text="SectionName"
                                        item-value="SectionName"
                                        color="teal"
                                        hide-details
                                        clearable
                                        outlined
                                        dense
                                    ></v-autocomplete>
                                </v-col>
                                <v-col cols="12" md="3">
                                    <v-autocomplete
                                        v-model="team"
                                        label="Team"
                                        :items="teamList"
                                        item-text="TeamName"
                                        item-value="TeamName"
                                        color="teal"
                                        hide-details
                                        clearable
                                        outlined
                                        dense
                                    ></v-autocomplete>
                                </v-col>
                                <v-col cols="12" md="3">
                                    <v-select
                                        v-model="selectedOptions"
                                        :items="options"
                                        color="teal"
                                        hide-details
                                        outlined
                                        dense
                                    ></v-select>
                                </v-col>
                                <v-col cols="12" md="8">
                                    <v-text-field
                                        v-model="searchTable"
                                        placeholder="Search Code, Name, etc..." 
                                        append-icon="mdi-magnify"
                                        color="teal"
                                        hide-details
                                        clearable
                                        outlined
                                        dense
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-btn class="mx-2 caption" color="teal" dark>Confirm All</v-btn>
                                    <v-btn class="mx-2 caption" color="teal" dark>Half-Day All</v-btn>
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-btn 
                                                class="mx-2"
                                                @click="printDialog = !printDialog" 
                                                color="teal" 
                                                v-on="on"
                                                v-bind="attrs"
                                                dark
                                            >
                                                <v-icon>mdi-printer</v-icon>
                                            </v-btn>
                                        </template>
                                        <span>Print Data</span>
                                    </v-tooltip> 
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card>
                    <v-lazy transition="scroll-y-reverse-transition" :options="{ threshold: 0.8 }">
                        <v-card class="mt-4">
                            <v-container>
                                <v-data-table
                                    :headers="headers"
                                    :items="filterEmployeeLogtime"
                                    :loading="loading"
                                    :page.sync="page"
                                    :search="searchTable"
                                    :expanded.sync="expanded"
                                    :single-expand="true"
                                    loading-text="Loading Data. . .Please Wait"
                                    item-key="EmployeeCode"
                                    @page-count="pageCount = $event"
                                    hide-default-footer
                                    show-expand
                                    dense
                                >
                                    <template v-slot:item="{ item, expand, isExpanded }">
                                        <tr :style="!item.TimeIn ? 'color: #b71c1c;' : ''">
                                            <td>
                                                <v-btn @click="expand(!isExpanded)" small icon>
                                                    <v-icon>{{ isExpanded ? 'mdi-minus-box-outline' : 'mdi-plus-box-outline' }}</v-icon>
                                                </v-btn>
                                            </td>
                                            <td>{{item.EmployeeCode}}</td>
                                            <td>{{item.EmployeeName}}</td>
                                            <td>{{!item.TimeIn ? '' : moment.utc(item.TimeIn).format('HH:mm:ss')}}</td>
                                            <td>{{!item.TimeOut ? '' : moment.utc(item.TimeOut).format('HH:mm:ss')}}</td>
                                            <td class="text-center">{{!item.TimeIn ? "" : item.NoHrs}}</td>
                                            <td>
                                                <v-chip v-if="item.TimeIn" :color="item.IsAdminUpload == 1 ? 'success' : 'error'" small>
                                                    {{item.IsAdminUpload == 1 ? 'Confirmed' : 'For Confirmation'}}
                                                </v-chip>
                                                <v-chip v-else small>
                                                    {{getLeaveDesc(item.Leave, item.OTCode, item.TimeIn)}}
                                                </v-chip>
                                            </td>
                                            <td>
                                                <v-btn 
                                                    @click="viewEmployeeLogtimeDetails(item)" 
                                                    :disabled="!item.TimeOut"
                                                    :dark ="item.TimeOut !== null"
                                                    elevation="3" 
                                                    color="teal" 
                                                    x-small
                                                    fab 
                                                >
                                                    <v-icon small>{{ item.LogType == 1 ? 'mdi-pencil' : 'mdi-eye'}}</v-icon>
                                                </v-btn>
                                            </td>
                                        </tr>
                                    </template>
                                    <template v-slot:expanded-item="{ headers, item }">
                                        <td :colspan="headers.length">
                                            <v-card class="mt-2" outlined>
                                                <v-container>
                                                    {{item.StartTime}}
                                                </v-container>
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
                    </v-lazy>
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
                                    <v-img :src="`${photo}/${employeesLogtimeDetails.EmployeeCode}.jpg`">
                                        <template v-slot:placeholder>
                                            <v-sheet>
                                                <v-skeleton-loader
                                                    class="mx-auto"
                                                    type="image"
                                                ></v-skeleton-loader>
                                            </v-sheet>
                                        </template>
                                    </v-img>
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
                            <v-card v-if="employeesLogtimeDetails.LogType == 1" class="mt-2" outlined>
                                <v-subheader>Manual Encode:</v-subheader>
                                <v-divider></v-divider>
                                <v-container class="mb-n5">
                                    <v-row align="center" justify="center" dense>
                                        <v-col cols="12" md="6">
                                            <v-text-field
                                                v-model="timeIn"
                                                color="teal"
                                                label="TimeIn"
                                                append-icon="mdi-clock-outline"
                                                v-mask="'##:##:##'"
                                                hint="hh:mm:ss"
                                                :readonly="!isManual"
                                                persistent-hint
                                                outlined
                                                dense
                                            ></v-text-field>                                             
                                        </v-col>
                                        <v-col cols="12" md="6">
                                            <v-text-field
                                                v-model="timeOut"
                                                color="teal"
                                                label="TimeOut"
                                                append-icon="mdi-clock-outline"
                                                v-mask="'##:##:##'"
                                                hint="hh:mm:ss"
                                                :readonly="!isManual"
                                                persistent-hint
                                                outlined
                                                dense
                                            ></v-text-field>                                         
                                        </v-col>
                                    </v-row>
                                    <v-row class="mb-n10" dense>
                                        <v-col cols="12" md="3">
                                            <v-text-field
                                                v-model="employeesLogtimeDetails.AdminNoHrs"
                                                label="Hours"
                                                type="number"
                                                color="teal" 
                                                outlined
                                                dense
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="3">
                                            <v-text-field
                                                v-model="employeesLogtimeDetails.AdminUndertime"
                                                label="Undertime"
                                                color="teal" 
                                                type="number"
                                                outlined
                                                dense
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="3">
                                            <v-text-field
                                                v-model="employeesLogtimeDetails.AdminTardiness"
                                                label="Tardiness"
                                                color="teal" 
                                                type="number"
                                                outlined
                                                dense
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="3">
                                            <v-text-field
                                                v-model="employeesLogtimeDetails.AdminOvertime"
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
                                            v-model="isManual" 
                                            label="Manual Encode" 
                                            color="teal" 
                                            @change="changeManual"
                                            dense
                                        ></v-checkbox>
                                        <v-spacer></v-spacer>
                                        <v-checkbox 
                                            v-model="isHalfDay" 
                                            @change="setHalfDay(employeesLogtimeDetails)"
                                            :disabled="!isManual"
                                            label="Half Day" 
                                            color="teal" 
                                            dense
                                        ></v-checkbox>
                                    </v-card-actions>
                                </v-container>
                            </v-card>
                        </v-col>
                    </v-row>
                    <v-card-actions v-if="employeesLogtimeDetails.LogType == 1">
                        <v-spacer></v-spacer>
                        <v-btn @click="dialog = false" text>Cancel</v-btn>
                        <v-btn 
                            v-if="employeesLogtimeDetails.IsAdminUpload == 0"
                            @click="saveEmployeeLogtimeData(employeesLogtimeDetails)" 
                            v-show="employeesLogtimeDetails.TimeOut"
                            color="teal" 
                            dark
                        >Confirm</v-btn>
                    </v-card-actions>
                </v-container>
            </v-card>
        </v-dialog>

        <!-- Print Dialog -->
        <v-dialog v-model="printDialog" width="500" persistent>
            <v-card>
                <v-toolbar color="teal" dark>
                    <v-toolbar-title>Print</v-toolbar-title>
                </v-toolbar>
                <v-container>
                    <v-row class="pt-3" dense>
                        <v-col v-for="(item, i) in dateRange" :key="i" cols="12" md="6">
                            <datePicker :menu="item.dialog" :dateValue.sync="item.value" :dateLabel="item.text" /> 
                        </v-col>
                    </v-row>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn @click="printDialog = !printDialog" text>Cancel</v-btn>
                        <v-btn @click="extractData()" color="teal" dark>Print</v-btn>
                    </v-card-actions>
                </v-container>
            </v-card>
        </v-dialog>
        <!-- End of Print Dialog -->
    </v-main>
</template>

<script>
import datePicker from '@/components/datepicker'

export default {
    data() {
        return {
            cutOffDate: null,
            department: null,
            section: null,
            team: null,
            timeIn: null,
            timeOut: null,
            isHalfDay: false,
            isManual: false,
            dialog: false,
            dateDialog: false,
            printDialog: false,
            loading: true,
            pageCount: 0,
            pageCountUser: 0,
            selectedOptions: 0,
            page: 1,
            pageUser: 1,
            cutOff: 1,
            dateToday: '',
            searchTable: '',
            dtLogtime: '',
            expanded: [],
            employeesLogtime: [],
            tempLogtimeRecords: [],
            employeesLogtimeDetails: {},
            options: [
                {text: 'All', value: 2},
                {text: 'Confirmed', value: 1},
                {text: 'For Confirmation', value: 0}
            ],
            dateRange: [
                {text: 'Date From', value: this.moment.utc(this.serverDateTime).format('YYYY-MM-DD'), dialog: false},
                {text: 'Date To', value: this.moment.utc(this.serverDateTime).format('YYYY-MM-DD'), dialog: false}
            ],
            headers: [
                {text: '', value: 'data-table-expand' },
                {text: 'Code', value: 'EmployeeCode'},
                {text: 'Name', value: 'EmployeeName'},
                {text: 'Time In', value: 'TimeIn'},
                {text: 'Time Out', value: 'TimeOut'},
                {text: 'Hours', value: 'NoHrs'},
                {text: 'Status', value: ''},
                {text: 'Actions', value: ''}
            ],
        }
    },
    created() {
        this.moment.suppressDeprecationWarnings = true
        window.addEventListener("beforeunload", this.browserTabEvents)
        this.dateToday = this.serverDateTime
        this.dtLogtime = this.moment().format('YYYY-MM-DD')
        if(this.moment.utc(this.logtimeuserinfo.LogDateTime).format('YYYY-MM-DD') != this.moment.utc(this.dateToday).format('YYYY-MM-DD')) {
            this.userLoggedOut(this.logtimeuserinfo)
        } else {
            this.loadEmployeesLogtime()
        }
    },
    beforeDestroy() {
        window.removeEventListener("beforeunload", this.browserTabEvents)
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
                if (this.selectedOptions == 2) {
                    return (
                        this.moment(rec.LogDateTime).format('YYYY-MM-DD').includes(this.dtLogtime) &&
                        rec.DepartmentName.includes(this.department || '') &&
                        rec.SectionName.includes(this.section || '') &&
                        rec.TeamName.includes(this.team || '') &&
                        rec.LogType == 1 
                    )
                } else {
                    return (
                        this.moment(rec.LogDateTime).format('YYYY-MM-DD').includes(this.dtLogtime) &&
                        rec.DepartmentName.includes(this.department || '') &&
                        rec.SectionName.includes(this.section || '') &&
                        rec.TeamName.includes(this.team || '') &&
                        rec.LogType == 1 &&
                        rec.IsAdminUpload == this.selectedOptions
                    )
                }
            })
        },
        filterPrintLogtimeRange() {
            return this.tempLogtimeRecords.filter(rec => {
                return (
                    this.moment.utc(rec.LogDateTime).format('YYYY-MM-DD') >= this.dateRange[0].value &&
                    this.moment.utc(rec.LogDateTime).format('YYYY-MM-DD') <= this.dateRange[1].value &&
                    rec.LogType == 1
                )
            })
        },
        departmentList() {
            return this.filterEmployeeLogtime.map(rec => {
                return rec.DepartmentName
            })
        },
        sectionList() {
            return this.filterEmployeeLogtime.map(rec => {
                return rec.SectionName
            })
        },
        teamList() {
            return this.filterEmployeeLogtime.map(rec => {
                return rec.TeamName
            })
        }
    },
    methods: {
        changeManual(val) {
            let data = this.employeesLogtimeDetails
            if(val) {
                this.timeIn = this.moment.utc(data.TimeIn).format('HH:mm:ss')
                this.timeOut = this.moment.utc(data.TimeOut).format('HH:mm:ss')
            } else {
                this.timeIn = this.moment.utc(data.StartTime).format('HH:mm:ss')
                this.timeOut = this.moment.utc(data.EndTime).format('HH:mm:ss')
            }
            this.setLogtimeValues()
        },
        browserTabEvents(events) {
            events.preventDefault()
            events.returnValue = ""
        },
        extractData() {
            let data = []
            let counter = 0
            let dtCurDate = null
            let tempDateRange = this.dateRange
            
            // Query data
            if(tempDateRange[0].value <= tempDateRange[1].value) {
                let body = {
                    procedureName: 'Logtime.dbo.ProcGetLogTimeData',
                    values: this.getParameters(this.getUnionLogtime(tempDateRange), this.logtimeuserinfo.UserLevel, 1)
                }
                // console.log(body)
                this.axios.post(`${this.api}/executeselect`,  {data: JSON.stringify(body)}).then(res => {
                    this.tempLogtimeRecords = res.data
                    this.filterPrintLogtimeRange.forEach((rec, index) => {
                            if(index == 0) {
                                data.push({
                                    EmployeeCode: rec.EmployeeCode,
                                    Name: rec.EmployeeName,
                                    Division: rec.DepartmentName,
                                    From: this.moment(rec.LogDateTime).format('YYYY-MM-DD'),
                                    To: null,
                                    Days: 1,
                                    Amount: 35
                                })
                                dtCurDate = this.moment(rec.LogDateTime).format('YYYY-MM-DD')
                                counter += 1
                            } else {
                                if(rec.EmployeeCode == data[counter - 1].EmployeeCode && this.moment(dtCurDate).format('YYYY-MM-DD') == this.moment(rec.LogDateTime).format('YYYY-MM-DD')) {
                                    data[counter - 1].Days += 1
                                    data[counter - 1].Amount += 35
                                    data[counter - 1].To = dtCurDate
                                } else {
                                    //data[counter - 1].To = this.moment.utc(dtCurDate).subtract('1', 'days').format('YYYY-MM-DD')
                                    data.push({
                                        EmployeeCode: rec.EmployeeCode,
                                        Name: rec.EmployeeName,
                                        Division: rec.DepartmentName,
                                        From: this.moment(rec.LogDateTime).format('YYYY-MM-DD'),
                                        To: this.moment(rec.LogDateTime).format('YYYY-MM-DD') == this.moment(dtCurDate).format('YYYY-MM-DD') ? this.moment(rec.LogDateTime).format('YYYY-MM-DD') : dtCurDate, 
                                        Days: 1,
                                        Amount: 35
                                    })
                                    dtCurDate = this.moment(rec.LogDateTime).format('YYYY-MM-DD')
                                    counter += 1
                                }
                            }   
                            dtCurDate = this.moment.utc(rec.LogDateTime).add('1', 'days').format('YYYY-MM-DD')
                    })
                    // console.log(data)
                    this.reimbursementReport(data)
                })  
            }
        },
        getUnionLogtime(dateRange) {
            let strUnion = ''
            let intDay = 0
            let intYear = this.moment(dateRange[0]).format('YYYY')
            let dtFrom = parseInt(this.moment(dateRange[0].value).format("MM"))
            let dtTo = parseInt(this.moment(dateRange[1].value).format("MM"))
            if(dtFrom != dtTo) {
                while(dtFrom <= dtTo) {
                    intDay = dtFrom > 9 ? dtFrom : `0${dtFrom}`
                    strUnion += `SELECT * FROM Logtime.dbo.LT${intDay}${intYear} UNION ALL `
                    dtFrom++ 
                }
                return `(${strUnion.substring(0, strUnion.lastIndexOf('UNION ALL'))})`
                
            } else {
                return `LT${dtFrom > 9 ? dtFrom : `0${dtFrom}`}${intYear}`
            }
        },
        loadEmployeesLogtime() {
            this.loading = true
            let body = {
                procedureName: 'Logtime.dbo.ProcGetLogTimeData',
                values: this.getParameters(`LT${this.moment(this.dtLogtime).format('MMYYYY')}`, this.logtimeuserinfo.UserLevel, 0)
            }
            // console.log(body);
            this.axios.post(`${this.api}/executeselect`,  {data: JSON.stringify(body)}).then(res => {
                this.employeesLogtime = res.data
                this.loading = false
            })  
        },
        getParameters(strQuery, level, order) {
            let body = []
            switch (level) {
                case 2:
                    body.push(
                        strQuery,
                        this.logtimeuserinfo.ShortName,
                        this.logtimeuserinfo.DepartmentName,
                        this.logtimeuserinfo.SectionName,
                        null,
                        order
                    )
                    break;
                case 3:
                    body.push(
                        strQuery,
                        this.logtimeuserinfo.ShortName,
                        this.logtimeuserinfo.DepartmentName,
                        this.logtimeuserinfo.SectionName,
                        this.logtimeuserinfo.TeamName,
                        order
                    )
                    break;            
                default:
                    body.push(
                        strQuery,
                        this.logtimeuserinfo.ShortName,
                        this.logtimeuserinfo.DepartmentName,
                        null,
                        null,
                        order
                    )
                    break;
            }
            return body
        },
        viewEmployeeLogtimeDetails(val) {
            this.dialog = true
            Object.assign(this.employeesLogtimeDetails, val)

            if(val.IsAdminUpload == 1) {
                this.isManual = val.IsAdminUpload == 1 ? true : false
                this.changeManual(true)
            } else {
                this.timeIn = val.TimeIn == null ? null : this.moment.utc(val.StartTime).format('HH:mm:ss')
                this.timeOut = val.TimeIn == null ? null : this.moment.utc(val.EndTime).format('HH:mm:ss')
            }

        },
        clearVariables() {
            this.timeIn = null
            this.timeOut = null
            this.isManual = false
            this.employeesLogtimeDetails = {}
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
                }
            }
        },
        setLogtimeValues() {
            let duration = null
            let dtToday = this.moment(this.employeesLogtimeDetails.LogDateTime).format('YYYY-MM-DD')
            let timeInVal = this.timeIn ? this.moment.utc(`${dtToday} ${this.timeIn}`) : null
            let timeOutVal = this.timeOut ? this.moment.utc(`${dtToday} ${this.timeOut}`) : null

            if(this.timeIn && this.timeOut) {
                if(timeInVal.isValid() && timeOutVal.isValid()) {                    
                    if(this.timeOut != null && timeInVal.format('HH') <= timeOutVal.format('HH')) {
                        duration = this.calculateDates(timeOutVal, timeInVal)
                        Object.assign(this.employeesLogtimeDetails, {
                            AdminTimeIn: `${dtToday} ${this.timeIn}`,
                            AdminTimeOut: `${dtToday} ${this.timeOut}`,
                            AdminNoHrs: (duration.hours) >= 8 ? 8 : parseFloat((duration.hours).toFixed(2)),
                            AdminOvertime: this.computeOvertime(),
                            AdminUndertime: this.computeUndertime(),
                            AdminTardiness: this.computeTardiness(),
                        })
                    }
                } else {
                    Object.assign(this.employeesLogtimeDetails, {
                        AdminNoHrs: 0,
                        AdminOvertime: 0,
                        AdminUndertime: 0,
                        AdminTardiness: 0
                    })
                }
            } else {
                Object.assign(this.employeesLogtimeDetails, {   
                    AdminNoHrs: 0,
                    AdminOvertime: 0,
                    AdminUndertime: 0,
                    AdminTardiness: 0
                })
            }
        },
        computeOvertime() {
            if(this.timeOut) {
                let dtToday = this.moment.utc(this.employeesLogtimeDetails.LogDateTime).format('YYYY-MM-DD')
                let timeOutVal = this.moment.utc(`${dtToday} ${this.timeOut}`)
                let shiftEnd = this.moment.utc(this.employeesLogtimeDetails.EndTime)
                let tempEndTime = this.moment.utc(`${dtToday} ${shiftEnd.format('HH:mm:ss')}`) 

                if(timeOutVal > tempEndTime) {
                    let duration = this.calculateDates(timeOutVal, tempEndTime)
                    if(!isNaN(duration.hours) || duration.hours != undefined) {
                        return duration.hours.toFixed(2) < 0.5 ? 0 : duration.hours.toFixed(2)
                    } else {
                        return 0
                    }
                }
            }
        },
        computeUndertime() {
            if(this.timeOut) {
                let dtToday = this.moment.utc(this.employeesLogtimeDetails.LogDateTime).format('YYYY-MM-DD')
                let timeOutVal = this.moment.utc(`${dtToday} ${this.timeOut}`)
                let shiftEnd = this.moment.utc(this.employeesLogtimeDetails.EndTime)
                let tempEndTime = this.moment.utc(`${dtToday} ${shiftEnd.format('HH:mm:ss')}`)
                let duration = this.calculateDates(tempEndTime, timeOutVal)

                if(!isNaN(duration.hours) || duration.hours != undefined) {
                    return duration.hours <= 0 ? 0 : (duration.hours - 1).toFixed(2)
                } else {
                    return 0
                }
            }
        },
        computeTardiness() {
            if(this.timeIn) {
                let dtToday = this.moment.utc(this.employeesLogtimeDetails.LogDateTime).format('YYYY-MM-DD')
                let timeInVal = this.moment.utc(`${dtToday} ${this.timeIn}`)
                let shiftStartTime = this.moment.utc(this.employeesLogtimeDetails.StartTime)
                let tempStartTime = this.moment.utc(`${dtToday} ${shiftStartTime.format('hh:mm:ss')}`)
                let duration = this.calculateDates(timeInVal, tempStartTime)
                
                if(isNaN(duration.hours) || duration.hours == undefined) {
                    return 0 
                } else {
                    return duration.hours < 0 ? 0 : duration.hours.toFixed(2)
                }
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
                        this.isHalfDay,
                        this.logtimeuserinfo.EmployeeCode,
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
                        this.updateORALogtime(this.employeesLogtimeDetails)
                        this.dialog = false
                        this.clearVariables()
                        this.swal.fire('Confirmed!', 'Record has been Uploaded to Admin.', 'success')
                    }
                })
            }
        },
        userLoggedOut(value) {
            //Compute duration
            let timeInVal = this.moment.utc(value.TimeIn)
            let timeOutVal  = this.moment.utc(this.serverDateTime)
            let timeLogOut = timeOutVal.format('YYYY-MM-DD HH:mm:ss')
            if(this.moment(value.LogDateTime).format('YYYY-MM-DD') != timeOutVal.format('YYYY-MM-DD')) {
                timeLogOut = `${this.moment(value.LogDateTime).format('YYYY-MM-DD')} ${this.moment(value.EndTime).format('HH:mm:ss')}`
            }
            let duration = this.calculateDates(timeOutVal, timeInVal)
            let body = {
                procedureName: 'Logtime.dbo.ProcInsertLogTimeData',
                values: [
                    `LT${this.moment(value.LogDateTime).format('MMYYYY')}`, 
                    value.ShortName, 
                    value.IDCode,
                    value.EmployeeCode, 
                    value.LogDateTime,
                    value.TimeIn,
                    timeLogOut, //TimeOut
                    parseFloat(duration.hours.toFixed(2) - 1), //NoHrs
                    value.Undertime, 
                    value.Tardiness, 
                    value.Overtime, 
                    value.ND, 
                    value.Shift, 
                    value.SW1, 
                    1, 
                    value.UserAcct, 
                    value.UserAcctO, 
                    value.UserTime, 
                    value.UserTimeO, 
                    value.ManualRem, 
                    '121', //ManualRemO, 
                    value.ND1, 
                    value.ND2, 
                    value.NoHrs1, 
                    value.OTCode == 'RD' ? 'R' : 'O', // PayCode
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
            // Work From Home
            if(value.LogType == 1) {
                this.axios.post(`${this.api}/execute`, {data: JSON.stringify(body)})
            }
            this.$store.commit('CHANGE_USER_INFO', {})
            this.$store.commit('CHANGE_USER_LOGGING', false)
            this.$store.commit('CHANGE_SERVERDATETTIME', '')
            this.$router.push("/")
        },
        updateORALogtime(value) {
            let cutOffValues = this.getCutOffValues(value.LogDateTime, value.EmployeeCode)
            console.log(cutOffValues);
            let body = {
                server: process.env.NODE_ENV ==='production' ? `HRIS${this.logtimeuserinfo.ShortName}` : `HRIS${this.logtimeuserinfo.ShortName.toLowerCase()}test`,
                procedureName: 'HRIS.PROCUPDATELOGTIME',
                values: [
                    value.EmployeeCode, 
                    this.moment(value.LogDateTime).format('YYYY-MM-DD'),
                    this.moment.utc(value.TimeIn).format('YYYY-MM-DD HH:mm:ss'),
                    this.moment.utc(value.TimeOut).format('YYYY-MM-DD HH:mm:ss'),
                    value.NoHrs, 
                    value.Undertime, 
                    value.Tardiness, 
                    value.Overtime, 
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
    },
    components: {   
        datePicker
    }
}
</script>