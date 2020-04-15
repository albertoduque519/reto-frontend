<template lang="pug">
  container(id="user-profile" fluid tag="section")
    .row(justify="center")
      .col(cols="12" md="4")
        <base-material-card>
          <template v-slot:heading>
            div(class="display-2 font-weight-light") Edit Profile
            div(class="subtitle-1 font-weight-light") Complete your profile
          </template>

          .main.container
            .row
              .col-md-6.col-md-offset-3
                h1.display-4.m-b-2 Sign Up

                // register form
                form(method='POST' action='/registersss')
                  div.form-group
                     <v-text-field label="Email Address" type='email' placeholder='name@email.com' name='email' class="purple-input"/>
                  div.form-group
                    <v-text-field label="Name" placeholder='name' name='name' class="purple-input"/>
                  div.form-group
                    <v-text-field label="Password" type='password' placeholder='password' name='password' class="purple-input"/>
                  div.form-group
                    <v-text-field label="confirmPassword" type='password' placeholder='confirmPassword' name='confirmPassword' class="purple-input"/>
                  <v-btn color="primary" default class="v-btn--block" type='submit'  @click="randomColor(), direction = dir, snackbar = true" > Sign up  </v-btn>
        </base-material-card>
</template>

<script>
  export default {
    //
    name: 'Apps',
  }
</script>
