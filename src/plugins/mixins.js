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
                     'darkMode', 
                     'searchData',
                     'navDrawerVal',
                     'emplcode',
                     'isEmpEdit',
                     'isConnect',
                     'serverDateTime'
                ])
            },
            methods: {
                ...mapMutations([
                     'CHANGE_USER_INFO', 
                     'CHANGE_USER_LOGGING', 
                     'CHANGE_THEME', 
                     'CHANGE_SEARCHING',
                     'CHANGE_NAVDRAWER',
                     'CHANGE_EMPLCODE',
                     'CHANGE_EMP_EDIT',
                     'CHANGE_CONNECTION',
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
                }
            }
        })
    }
}

export default plugins