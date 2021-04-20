<template>
    <v-menu
          ref="menu"
        v-model="menuDialog"
        :close-on-content-click="false"
        :return-value.sync="date"
        transition="scale-transition"
        offset-y
        min-width="290px"
     >
        <template v-slot:activator="{ on, attrs }">
            <v-text-field
               v-model="date"
               :label="label"
               color="teal"
               append-icon="mdi-calendar"
               v-bind="attrs"
               v-on="on"
               hide-details
               readonly
               dense
               outlined
            ></v-text-field>
        </template>
        <v-date-picker
               v-model="date"
               no-title
               scrollable
               color="teal"
               @change="$refs.menu.save(date)"
        >
        </v-date-picker>
    </v-menu>
</template>

<script>
export default {
     props: [
          'menu',
          'dateValue',
          'dateLabel'
     ],
     data() {
          return {
               events: [],
               menuDialog: false,
               date: this.dateValue,
               label: this.dateLabel
          }
     },
     created() { 
          
     },
     methods: {
          
     },
     watch: {
          menu() {
               this.menuDialog = true
          },
          date(val) {
               this.$emit('update:dateValue', val)
               this.menuDialog = false
          }
     }
}
</script>