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
                                            {{filterTotalPresent.length == 0 ? 0 : filterTotalPresent.length + 1}}
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
                                            <v-btn icon fab small><v-icon>mdi-pencil</v-icon></v-btn>
                                        </td>
                                        <td v-else>
                                            <v-btn icon fab small><v-icon>mdi-eye</v-icon></v-btn>
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
    </v-main>
</template>

<script>
export default {
    data() {
        return {
            dialog: false,
            loading: true,
            pageCount: 0,
            page: 1,
            dtLogtime: '',
            employeesLogtime: [],
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
                return this.moment(rec.LogDateTime).format('YYYY-MM-DD').includes(this.dtLogtime)
            })
        },
        filterTotalPresent() {
            return this.employeesLogtime.filter(rec => {
                return (
                    this.moment(rec.LogDateTime).format('YYYY-MM-DD').includes(this.dtLogtime) &&
                    rec.TimeIn != null
                    )
            })
        },
        filterTotalAbsent() {
            return this.employeesLogtime.filter(rec => {
                return (
                    this.moment(rec.LogDateTime).format('YYYY-MM-DD').includes(this.dtLogtime) &&
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
    }
}
</script>