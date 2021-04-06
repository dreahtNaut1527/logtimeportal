import { mapState, mapMutations } from "vuex";

const plugins = {
    install(Vue) {
        Vue.mixin({
            data() {
                return {
                    // api: process.env.VUE_APP_LOCAL_URL,
                    api: process.env.VUE_APP_URL,
                    asd_sql: process.env.VUE_APP_ASD_SQL,
                    photo: process.env.VUE_APP_PHOTO
                }
            },
            created() {
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