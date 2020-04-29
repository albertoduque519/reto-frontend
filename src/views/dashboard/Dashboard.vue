<template>
  <v-container id="dashboard" fluid tag="section">
    <v-row>
      <v-col class="d-flex" cols="12" sm="6">
        <v-select
          v-model="cliente"
          :items="clientes"
          attach
          chips
          label="Clientes"
          multiple
          @change="reloadStats"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6" lg="4">
        <base-material-stats-card
          color="primary"
          icon="mdi-domain"
          title="Capacidad Total"
          :value="capacidadTotal + ' GB'"
        />
      </v-col>

      <v-col cols="12" sm="6" lg="4">
        <base-material-stats-card
          color="success"
          icon="mdi-widgets"
          title="Consumo Total"
          :value="consumoTotal + ' GB'"
        />
      </v-col>

      <v-col cols="12" sm="6" lg="4">
        <base-material-stats-card
          color="orange"
          icon="mdi-grid-large"
          title="Disponible"
          :value="disponible + ' GB'"
        />
      </v-col>

      <v-col cols="12" lg="12">
        <md-card class="md-primary" style="background-color: WHITE;">
          <md-card-area md-inset>
            <md-card-header style="background-color: WHITE;">
              <highcharts :options="chartOptions" />
            </md-card-header>
            <hr role="separator" aria-orientation="horizontal" class="mt-2 v-divider theme--light" />
          </md-card-area>
          <md-card-actions>
            <v-row justify="center">
              <v-dialog v-model="dialog" persistent max-width="290">
                <template v-slot:activator="{ on }">
                  <v-btn color="primary" dark v-on="on">Detalle</v-btn>
                </template>
                <v-card>
                  <v-card-title class="headline">Detalles del almacenamiento</v-card-title>
                  <v-card-text>
                    <ul>
                      <li v-for="tipo in tipos" :key="tipo">{{ tipo.tipo }} : {{ tipo.tamano }} GB</li>
                    </ul>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn color="light-blue darken-3" text @click="dialog = false">Entendido</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-row>
          </md-card-actions>
        </md-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { clientService } from "@/_services";
import { mapState, mapMutations } from "vuex";

export default {
  name: "DashboardDashboard",

  data() {
    return {
      dialog: false,
      menu: false,
      modal: false,
      menu2: false,
      capacidadTotal: 8000,
      consumoTotal: 0,
      disponible: 0,
      cliente: [],
      clientes: [],
      dataClientes: [],
      tipos: [],
      tabs: 0,
      chartOptions: {
        chart: {
          type: "pie",
          options3d: {
            enabled: false,
            alpha: 45
          }
        },
        title: {
          text: "Monitoreo"
        },
        plotOptions: {
          pie: {
            innerSize: 100,
            depth: 45
          },
          series: {
            cursor: "pointer",
            point: {
              events: {
                click: ({ point }) => {
                  this.showOverlay = !this.showOverlay;
                  this.$emit("point-click", { point });
                }
              }
            }
          }
        },
        series: [
          {
            name: "Uso de Disco",
            data: []
          }
        ]
      }
    };
  },

  computed: mapState(["empresa", "empresas", "dataEmpresas"]),

  created: function() {
    console.log("created");
    this.clientes = this.empresas;
    this.dataClientes = this.dataEmpresas;
    this.cliente = this.empresa;
  },
  async mounted() {
    console.log("mount", this.cliente);
    if (Object.keys(this.clientes).length == 0) this.getClients();
    if (this.cliente) this.reloadStats();
  },

  methods: {
    ...mapMutations(["setEmpresa", "loadClientes", "loadDataClientes"]),
    complete(index) {
      this.list[index] = !this.list[index];
    },
    async getClients() {
      try {
        let { data } = await clientService.getClients();
        this.dataClientes = data;
        this.clientes = data.map(item => item.cliente);
        if (Object.keys(this.clientes).length < 3) {
          this.setEmpresa(this.clientes[0]);
          this.cliente = this.empresa;
          this.reloadStats();
        } else {
          this.setEmpresa(this.cliente);
          this.cliente = this.empresa;
        }
        this.loadClientes(this.clientes);
        this.loadDataClientes(this.dataClientes);
      } catch (error) {
        console.log("Error", error);
      }
    },
    async getDiskSpaceStatsByClient(idClientes = {}) {
      let { data } = await clientService.getDiskSpaceStatsByClient(idClientes);
      let sumConsumoTotal = 0;
      this.tipos = data.map(item => {
        let tamano = parseInt(item.tamano) / 1024 / 1024 / 1024;

        tamano = parseFloat(tamano.toFixed(2));
        sumConsumoTotal += tamano;
        return {
          tipo: item.tipo,
          tamano
        };
      });
      this.consumoTotal = sumConsumoTotal;
      this.disponible = this.capacidadTotal - this.consumoTotal;
      this.disponible = parseFloat(this.disponible.toFixed(2));
      this.tipos.push({ tipo: "disponible", tamano: this.disponible });
      let result = [];
      //result.push(["disponible", this.disponible]);
      for (let i in this.tipos)
        result.push([this.tipos[i]["tipo"], this.tipos[i]["tamano"]]);
      this.chartOptions.series[0].data = result;
    },
    cleardata() {
      this.disponible = this.capacidadTotal;
      this.consumoTotal = 0;
      let result = [];

      this.chartOptions.series[0].data = result;
    },
    reloadStats() {
      if (Object.keys(this.cliente).length == 0) {
        this.cleardata();
        return;
      }
      this.setEmpresa(this.cliente);
      let idClientes = this.dataClientes
        .filter(tipo => {
          return this.cliente.includes(tipo.cliente);
        })
        .map(item => item.id);
      this.getDiskSpaceStatsByClient(idClientes);
    }
  }
};
</script>

<style lang="sass">
.v-card
  margin-top: 0px
  margin-bottom: 0px
.v-application .headline
  font-size: 18px !important
  padding-bottom: 0
</style>
