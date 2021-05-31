import { mapState, mapMutations } from "vuex";
import store from '../store'

const plugins = {
    install(Vue) {
        Vue.mixin({
            data() {
                return {
                    // api: process.env.VUE_APP_LOCAL_URL,
                    // api: process.env.VUE_APP_URL,
                    api: null,
                    server: process.env.VUE_APP_SERVER,
                    asd_sql: process.env.VUE_APP_ASD_SQL,
                    photo: process.env.VUE_APP_PHOTO
                }
            },
            created() {
                this.getServerDateTime()
                this.api = process.env.NODE_ENV == 'production' ? process.env.VUE_APP_URL : process.env.VUE_APP_LOCAL_URL
                this.axios.defaults.headers.common['master-api'] = process.env.VUE_APP_URL_KEY
            },
            computed: {
                ...mapState([
                     'logtimeuserinfo', 
                     'isLoggedIn', 
                     'isConnect',
                     'appVersion',
                     'serverDateTime'
                ])
            },
            methods: {
                ...mapMutations([
                     'CHANGE_USER_INFO', 
                     'CHANGE_USER_LOGGING', 
                     'CHANGE_CONNECTION',
                     'CHANGE_APP_VERSION',
                     'CHANGE_SERVERDATETTIME'
                ]),
                getServerDateTime() {
                    this.axios.get(`${this.asd_sql}/getclientip.php`).then(res => {
                        //Get Server Date Time
                        let serverData = res.data
                        store.commit('CHANGE_SERVERDATETTIME', serverData.SERVERDATETIME)
                    })
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
                },
                checkAppVersion() {
                     let version = null
                     this.axios.get(`${this.server}/appversion`).then(res => {
                          version = res.data
                          if(version != this.appVersion) {
                                this.$store.commit('CHANGE_APP_VERSION', version)
                                this.$store.commit('CHANGE_USER_INFO', {})
                                this.$store.commit('CHANGE_USER_LOGGING', false)
                                this.$store.commit('CHANGE_SERVERDATETTIME', '')
                                if(this.$route.name != 'login') {
                                        this.$router.push('/')
                                }
                          }
                     })
                },
                zeroPad(num, numZeros) {
                    let n = Math.abs(num);
                    let zeros = Math.max(0, numZeros - Math.floor(n).toString().length );
                    let zeroString = Math.pow(10,zeros).toString().substr(1);
                    
                    if( num < 0 ) {
                        zeroString = '-' + zeroString;
                    }
                
                    return zeroString + n;
                },
                getLeaveDesc(leave, otcode, timein) {
                    let leaveDesc = null
                    let leaveList = [
                        {code: '1', text: 'Vacation'},
                        {code: '2', text: 'Sick'},
                        {code: '3', text: 'Emergency'},
                        {code: '4', text: 'Paternity'},
                        {code: '5', text: 'Bereavement'},
                        {code: '6', text: 'Maternity'},
                        {code: '7', text: 'Suspension'},
                        {code: 'S', text: 'Solo Parent'},
                        {code: 'P', text: '10 yrs P.A. Incentive'},
                        {code: 'L', text: 'NW Sick'},
                        {code: 'V', text: 'NW Vacation'},
                        {code: 'W', text: 'NW Without Pay'},
                        {code: 'I', text: 'Indefinite'},
                        {code: 'E', text: 'Allocation of Mat. Leave'},
                        {code: 'A', text: 'Maternity Solo Parent'}
                    ]

                    let otCodeList = [
                        {code: 'RD', text: 'Regular Day'},
                        {code: 'NW', text: 'Non-Working Holiday'},
                        {code: 'SR', text: 'Sunday/RestDay'},
                        {code: 'HL', text: 'Legal Holiday'},
                        {code: 'SL', text: 'Sunday Legal Holiday'},
                        {code: 'SS', text: 'Sunday Special Holiday'},
                        {code: 'HS', text: 'Special Holiday'},
                        {code: 'DH', text: 'Company Declared Holiday'}
                    ]
                    
                    // Return Leave
                    leaveList.forEach(rec => {
                        if(rec.code == leave) {
                            leaveDesc = rec.text
                        }
                    })


                    // Return OTCode
                    if(!leaveDesc) {
                        otCodeList.forEach(rec => {
                            if (rec.code == otcode) {
                                leaveDesc = (otcode == 'RD' && !timein ? 'Absent' : rec.text)
                            }
                        })
                    }

                    return leaveDesc
                }
            }
        })
    }
}

export default plugins