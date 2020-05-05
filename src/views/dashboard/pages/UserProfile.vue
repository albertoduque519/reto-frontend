<template>
  <v-data-table :headers="headers" :items="users" sort-by="usuario" class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>Usuarios</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>

        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark class="mb-2" v-on="on">Nuevo Usuario</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field v-model="editedItem.usuario" label="Usuario"></v-text-field>
                  </v-col>
                  <v-col cols="12" v-if="editedIndex === -1">
                    <v-text-field v-model="editedItem.contrasena" label="Contraseña"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="editedItem.empresa" label="Empresa"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="editedItem.bd" label="Bd"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="editedItem.url" label="Url"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
              <v-btn color="primary" default type="submit" @click="save">{{ submitButton }}</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
    </template>
  </v-data-table>
</template>

<script>
import { clientService } from "@/_services";
import { userService } from "@/_services";
export default {
  data: () => ({
    dialog: false,
    headers: [
      { text: "Usuario", value: "usuario" },
      { text: "Empresa:", value: "empresa" },
      { text: "Bd", value: "bd" },
      { text: "Url", value: "url" },
      { text: "Acciones", value: "actions", sortable: false }
    ],
    users: [],
    editedIndex: -1,
    editedItem: {
      usuario: "",
      contrasena: "",
      empresa: "",
      url: "",
      bd: ""
    },
    defaultItem: {
      usuario: "",
      contrasena: "",
      empresa: "",
      url: "",
      bd: ""
    }
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Usuario" : "Editar Usuario";
    },
    submitButton() {
      return this.editedIndex === -1 ? "Crear" : "Editar";
    }
  },
  watch: {
    dialog(val) {
      val || this.close();
    }
  },
  created() {
    this.getUsers();
  },
  methods: {
    editItem(item) {
      this.editedIndex = this.users.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      const index = this.users.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.users.splice(index, 1);
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    async save() {
      if (this.editedIndex > -1) {
        try {
          let { data } = await userService.updateUser(this.editedItem);
          if (data.response == "Ok") {
            console.log("Guardado con exito");
          }
        } catch (error) {
          console.log("Error", error);
        }
        Object.assign(this.users[this.editedIndex], this.editedItem);
      } else {
        try {
          let { data } = await userService.createUser(this.editedItem);
          if (data.response == "Ok") {
            console.log("Guardado con exito");
          }
        } catch (error) {
          console.log("Error", error);
        }
        this.users.push(this.editedItem);
      }
      this.close();
    },
    async getUsers() {
      try {
        let { data } = await clientService.getUsers();
        this.users = data;
      } catch (error) {
        console.log("Error", error);
      }
    }
  }
};
</script>
<style lang="sass">
.row-base
  justify-content: center
.v-application .success
  background-color: #4095af !important
  border-color: #4095af !important
.v-data-table
  margin-left: 20px !important
  padding-left: 20px
</style>
