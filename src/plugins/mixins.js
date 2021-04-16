import { mapState, mapMutations } from "vuex";

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
                setOvertime(hours) {
                    let decimal = (hours - 8).toFixed(2)
        
                    if(decimal.substr(2, 1) > 5) {
                        return parseFloat((decimal - 0.1).toFixed(2))
                    } else {
                        return (hours) > 8 ? parseFloat((hours - 8).toFixed(2)) : 0
                    }
                },
                setUnderTime(hours) {
                    return (hours - 8).toFixed(2) > 0 ? 0 : (hours - 8).toFixed(2)
                },
                // getWeather() {
                //     // let url = "https://maps.googleapis.com/maps/api/geocode/json?address=Cavite&key=AIzaSyCuugDMliUtuYZ1tT2PZbgB_LMvOYi0wFU"
                //     let url = "https://api.openweathermap.org/data/2.5/forecast?lang=zh_cn&units=metric&appid=c231437c38aeccd6596f746f3e95b155&q=Cavite"
                //     this.axios.get(url).then(res => {
                //         console.log(res.data)
                //     }).catch(err => console.log(err))
                // }
            }
        })
    }
}

export default plugins