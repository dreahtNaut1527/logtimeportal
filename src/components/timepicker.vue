<template>
     <v-dialog
          ref="menu"
          v-model="menuDialog"
          :return-value.sync="time"
          transition="scale-transition"
          width="290px"
          persistent
     >
          <template v-slot:activator="{ on, attrs }">
               <v-text-field
                    v-model="time"
                    :label="label"
                    append-icon="mdi-clock-outline"
                    color="teal"
                    v-bind="attrs"
                    v-on="on"
                    readonly
                    dense
                    outlined
               ></v-text-field>
          </template>
          <v-time-picker
               v-model="time"
               color="teal"
               full-width
          >
               <v-spacer></v-spacer>
               <v-btn
                    text
                    color="teal"
                    @click="menuDialog = false"
               >
                    Cancel
               </v-btn>
               <v-btn
                    text
                    color="teal"
                    @click="$refs.menu.save(time)"
               >
                    OK
               </v-btn>
          </v-time-picker>
     </v-dialog>
</template>

<script>
export default {
     props: [
          'menu',
          'timeValue',
          'timeLabel'
     ],
     data() {
          return {
               menuDialog: false,
               time: this.timeValue,
               label: this.timeLabel
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
          time(val) {
               this.$emit('update:timeValue', val)
               // this.menuDialog = false
          },
          timeValue(val) {
               this.time = val
          }
     }
}
</script>