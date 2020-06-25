<template>
  <v-container id="dashboard" fluid tag="section">
    <v-row>
      <v-col class="d-flex" cols="12" sm="6">
        <v-autocomplete
          v-model="cliente"
          :items="clientes"
          attach
          chips
          label="Clientes"
          multiple
          :clearable="Object.keys(clientes).length > 2"
          @change="reloadStats"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6" lg="4">
        <base-material-stats-card
          color="primary"
          icon="fas fa-server"
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
              <highcharts :options="chartOptions" :key="renderFitPage" />
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
                      <li v-for="tipo in tipos" :key="tipo">
                        <v-icon size="16" class="ml-2 mr-1">{{ tipo.icon }}</v-icon>
                        {{ tipo.tipo }} : {{ tipo.tamano }} GB
                      </li>
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
    <v-row>
      <v-col cols="12" lg="12">
        <md-card class="md-primary" style="background-color: WHITE;">
          <v-row>
            <v-col v-for="types in displayTypes" :key="types" cols="6" sm="6" lg="6">
              <v-row>
                <v-col cols="2" sm="2" lg="2">
                  <v-icon class="footer-icon" size="46" :class="types.class">{{ types.icon }}</v-icon>
                </v-col>
                <v-col cols="9" sm="9" lg="9">
                  <div class="ml-auto">
                    <h4 class="display-1 font-weight-light text--primary">{{ types.tipo }}</h4>
                    <p class="body-3 grey--text">
                      <small>{{ types.descripcion }}</small>
                    </p>
                  </div>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
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
      renderFitPage: 0,
      capacidadTotal: 0,
      consumoTotal: 0,
      disponible: 0,
      cliente: [],
      clientes: [],
      dataClientes: [],
      tipos: [],
      displayTypes: [
        {
          tipo: "Bases de datos",
          descripcion:
            "Todos las instancias de bases de datos disponibles para tu empresa: Base de datos en PDN, Base de datos en Contingencia, Base de Datos en Pruebas.",
          icon: "fa-database",
          class: "back"
        },
        {
          tipo: "Logs",
          descripcion:
            "Para que puedas conocer que pasa con Adminfo, se almacenan todas las transacciones que ocurren en la plataforma.",
          icon: "fa-archive",
          class: "color-yellow"
        },
        {
          tipo: "Archivos",
          descripcion:
            "Tus archivos de transferencia se respaldan para que puedas acceder a ellos en un futuro.",
          icon: "far fa-file-alt",
          class: "#4caf50"
        },
        {
          tipo: "Backups",
          descripcion:
            "Toda tu plataforma esta respalda y custodiada con los mas estrictos protocolos y almacenada por 3 meses.",
          icon: "fa-hdd",
          class: "color-blue"
        }
      ],
      icons: {
        Archivos: "far fa-file-alt",
        Backup: "fa-hdd",
        Bd: "fas fa-database",
        Logs: "fas fa-archive"
      },
      chartOptions: {
        chart: {
          type: "pie",
          events: {
            load() {
              setTimeout(this.reflow.bind(this));
            }
          },
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

  async mounted() {
    this.clientes = this.empresas;
    this.dataClientes = this.dataEmpresas;
    this.cliente = this.empresa;
    if (Object.keys(this.clientes).length == 0) await this.getClients();
    if (this.cliente) this.reloadStats();
    setTimeout(() => {
      this.forceRerenderFitPage();
    }, 100);
  },

  methods: {
    ...mapMutations(["setEmpresa", "loadClientes", "loadDataClientes"]),
    async getClients() {
      try {
        let { data } = await clientService.getClients();
        this.dataClientes = data;
        this.clientes = data.map(item => item.cliente);
        if (Object.keys(this.clientes).length < 3) {
          this.setEmpresa(this.clientes[0]);
          this.cliente = this.empresa;
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
      this.tipos = data.map((item, index) => {
        let tamano = Math.round(parseInt(item.tamano) / 1024 / 1024 / 1024);
        let tipo = item.tipo.charAt(0).toUpperCase() + item.tipo.substring(1);
        let icon = this.icons[tipo];
        tipo = tipo == "Bd" ? "Bases de datos" : tipo;
        sumConsumoTotal += tamano;
        return {
          tipo,
          tamano,
          icon
        };
      });
      this.consumoTotal = Math.round(sumConsumoTotal);
      this.disponible = Math.round(this.capacidadTotal - this.consumoTotal);
      this.tipos.push({
        tipo: "Disponible",
        tamano: this.disponible,
        icon: "mdi-grid-large"
      });
      let result = [];
      for (let i in this.tipos)
        result.push([this.tipos[i]["tipo"], this.tipos[i]["tamano"]]);
      this.chartOptions.series[0].data = result;
    },
    cleardata() {
      this.capacidadTotal = 0;
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
      this.getCapacidadTotal();
      this.getDiskSpaceStatsByClient(idClientes);
    },
    getCapacidadTotal() {
      this.capacidadTotal = this.dataClientes
        .filter(tipo => {
          return this.cliente.includes(tipo.cliente);
        })
        .reduce(function(accumulator, cliente) {
          let tamano = Math.round(
            parseInt(cliente.capacidadTotal) / 1024 / 1024 / 1024
          );
          return accumulator + tamano;
        }, 0);
    },
    forceRerenderFitPage() {
      this.renderFitPage += 1;
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
ul
  list-style-type: none
.footer-icon
  top: 20%
  left: 20%
p
  text-align: justify
  font-weight: 400 !important
display-1
  font-size: 14px
.color-blue
  -webkit-background-clip: text !important
  -webkit-text-fill-color: transparent
  background-color: #4095af !important
  border-color: #4095af !important
.color-yellow
  -webkit-background-clip: text !important
  -webkit-text-fill-color: transparent
  background-color: #f9d432 !important
  border-color: #f9d432 !important
.back
  -webkit-background-clip: text !important
  -webkit-text-fill-color: transparent
  background: conic-gradient(from -45deg, #ea4335 110deg, #4285f4 90deg 180deg, #34a853 180deg 270deg, #fbbc05 270deg) 73% 55%/150% 150% no-repeat
</style>
