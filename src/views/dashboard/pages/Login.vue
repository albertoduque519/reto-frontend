<template lang="pug">
  div(id="user-profile" class="container" tag="section")
    .row.row-base
      .col-md-4.col-md-offset-2
        <base-material-card>
          <template v-slot:heading>
            div(class="display-2 font-weight-light") Login
          </template>
          .main
            .row
              .col-md-12.col-md-offset-3.col-xs-12
                form(@submit.prevent="handleSubmit")
                  div.form-group
                    <v-text-field label="Username" placeholder='Username' name='username' v-model="username" class="purple-input"/>
                  div.form-group
                    <v-text-field label="Password" type='password' placeholder='password' name='password' v-model="password" class="purple-input"/>
                  <v-btn color="primary" default class="v-btn--block" type='submit' > Sign up  </v-btn>
        </base-material-card>
</template>

<script>
  export default {
    //
    name: 'Apps',
    data () {
      return {
        username: '',
        password: '',
        submitted: false,
      }
    },
    computed: {
      loggingIn () {
        return this.$store.state.authentication.status.loggingIn
      },
    },
    methods: {
      async handleSubmit () {
        this.submitted = true
        const { username, password } = this
        const { dispatch } = this.$store
        if (username && password) {
          await dispatch('authentication/logins', { username, password }).then(response => {
            if (typeof response.data.token !== 'undefined') {
              this.$router.push({ name: 'Dashboard' })
            }
          })
        }
      },
    },

  }
</script>

<style lang="sass">
  .row-base
    justify-content: center
</style>
