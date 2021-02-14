import { mapState, mapMutations } from "vuex";

const plugins = {
    install(Vue) {
        Vue.mixin({
            data() {
                return {
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
                    'userInfo',
                    'isRemember',
                    'isLoggedIn',
                    'isConnect'
                ])
            },
            methods: {
                ...mapMutations([
                    'CHANGE_USER_INFO',
                    'CHANGE_REMEMBER_USER',
                    'CHANGE_USER_LOGGING',
                    'CHANGE_CONNECTION'
                ])
            }
        })
    }
}

export default plugins