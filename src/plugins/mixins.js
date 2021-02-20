import { mapState, mapMutations } from "vuex";

const plugins = {
    install(Vue) {
        Vue.mixin({
            data() {
                return {
                    // api: process.env.VUE_APP_LOCAL_URL,
                    // api: process.env.VUE_APP_URL,
                    api: process.env.NODE_ENV == 'production' ? process.env.VUE_APP_URL : process.env.VUE_APP_LOCAL_URL,
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
                     'isConnect'
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
                     'CHANGE_CONNECTION'
                ])
            }
        })
    }
}

export default plugins