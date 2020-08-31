<template lang="pug">
  div(id="user-profile" class="container" tag="section")
    .row.row-base
      .col-md-4.col-md-offset-2
        <base-material-card color="primary">
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
import { userService } from "@/_services";
export default {
  //
  name: "Apps",
  data() {
    return {
      username: "",
      password: "",
      submitted: false
    };
  },

  async mounted() {
    localStorage.setItem(
      "user",
      JSON.stringify({
        token: "Bearer " + this.$router.currentRoute.params.token
      })
    );
    // let response = await userService.login(username, password);
    // if (response.token) {
    this.$router.push({ name: "Dashboard" });
    // }
    //  console.log(response);
  }
};
</script>

<style lang="sass">
.row-base
  justify-content: center
.v-application .success
  background-color: #4095af !important
  border-color: #4095af !important
</style>