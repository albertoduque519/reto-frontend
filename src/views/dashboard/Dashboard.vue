<template>
  <v-container id="dashboard" fluid tag="section">
    <v-row>
      <v-col class="d-flex" cols="12" sm="6">
        <v-select
          v-model="cliente"
          :items="item"
          attach
          chips
          label="Clientes"
          multiple
          v-on:change="reloadStats"
        />
      </v-col>
      <v-col cols="12" sm="3">
        <v-menu
          v-model="menu"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="startDateFormatted"
              label="Fecha Inicial"
              prepend-icon="mdi-calendar"
              readonly
              v-on="on"
            />
          </template>
          <v-date-picker
            v-model="startDate"
            no-title
            scrollable
            locale="es-co"
            color="light-blue darken-3"
            @input="menu = false"
          />
        </v-menu>
      </v-col>
      <v-col cols="12" sm="3">
        <v-menu
          v-model="menu2"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="endDateFormatted"
              label="Fecha Final"
              prepend-icon="mdi-calendar"
              readonly
              v-on="on"
            />
          </template>
          <v-date-picker
            v-model="endDate"
            no-title
            scrollable
            locale="es-co"
            color="light-blue darken-3"
            @input="menu2 = false"
          />
        </v-menu>
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
                      <li
                        v-for="tipo in tipos"
                        v-bind:key="tipo"
                      >{{ tipo.tipo }} : {{ tipo.tamano }} GB</li>
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
export default {
  name: "DashboardDashboard",

  data() {
    return {
      dialog: false,
      startDate: new Date().toISOString().substr(0, 10),
      endDate: new Date().toISOString().substr(0, 10),
      menu: false,
      modal: false,
      menu2: false,
      capacidadTotal: 8000,
      consumoTotal: 0,
      disponible: 0,
      clientes: ["todos"],
      cliente: [],
      dataClientes: [],
      item: ["Todos"],
      tipos: [],
      dailySalesChart: {
        data: {
          labels: ["M", "T", "W", "T", "F", "S", "S"],
          series: [[12, 17, 7, 17, 23, 18, 38]]
        },
        options: {
          lineSmooth: this.$chartist.Interpolation.cardinal({
            tension: 0
          }),
          low: 0,
          high: 50, //  we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        }
      },
      dataCompletedTasksChart: {
        data: {
          labels: ["12am", "3pm", "6pm", "9pm", "12pm", "3am", "6am", "9am"],
          series: [[230, 750, 450, 300, 280, 240, 200, 190]]
        },
        options: {
          lineSmooth: this.$chartist.Interpolation.cardinal({
            tension: 0
          }),
          low: 0,
          high: 1000, //  we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        }
      },
      emailsSubscriptionChart: {
        data: {
          labels: [
            "Ja",
            "Fe",
            "Ma",
            "Ap",
            "Mai",
            "Ju",
            "Jul",
            "Au",
            "Se",
            "Oc",
            "No",
            "De"
          ],
          series: [[542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]]
        },
        options: {
          axisX: {
            showGrid: false
          },
          low: 0,
          high: 1000,
          chartPadding: {
            top: 0,
            right: 5,
            bottom: 0,
            left: 0
          }
        },
        responsiveOptions: [
          [
            "screen and (max-width: 640px)",
            {
              seriesBarDistance: 5,
              axisX: {
                labelInterpolationFnc: function(value) {
                  return value[0];
                }
              }
            }
          ]
        ]
      },
      headers: [
        {
          sortable: false,
          text: "ID",
          value: "id"
        },
        {
          sortable: false,
          text: "Name",
          value: "name"
        },
        {
          sortable: false,
          text: "Salary",
          value: "salary",
          align: "right"
        },
        {
          sortable: false,
          text: "Country",
          value: "country",
          align: "right"
        },
        {
          sortable: false,
          text: "City",
          value: "city",
          align: "right"
        }
      ],
      items: [
        {
          id: 1,
          name: "Dakota Rice",
          country: "Niger",
          city: "Oud-Tunrhout",
          salary: "$35,738"
        },
        {
          id: 2,
          name: "Minerva Hooper",
          country: "Curaçao",
          city: "Sinaai-Waas",
          salary: "$23,738"
        },
        {
          id: 3,
          name: "Sage Rodriguez",
          country: "Netherlands",
          city: "Overland Park",
          salary: "$56,142"
        },
        {
          id: 4,
          name: "Philip Chanley",
          country: "Korea, South",
          city: "Gloucester",
          salary: "$38,735"
        },
        {
          id: 5,
          name: "Doris Greene",
          country: "Malawi",
          city: "Feldkirchen in Kārnten",
          salary: "$63,542"
        }
      ],
      tabs: 0,
      tasks: {
        0: [
          {
            text:
              'Sign contract for "What are conference organizers afraid of?"',
            value: true
          },
          {
            text:
              "Lines From Great Russian Literature? Or E-mails From My Boss?",
            value: false
          },
          {
            text:
              "Flooded: One year later, assessing what was lost and what was found when a ravaging rain swept through metro Detroit",
            value: false
          },
          {
            text: "Create 4 Invisible User Experiences you Never Knew About",
            value: true
          }
        ],
        1: [
          {
            text:
              "Flooded: One year later, assessing what was lost and what was found when a ravaging rain swept through metro Detroit",
            value: true
          },
          {
            text:
              'Sign contract for "What are conference organizers afraid of?"',
            value: false
          }
        ],
        2: [
          {
            text:
              "Lines From Great Russian Literature? Or E-mails From My Boss?",
            value: false
          },
          {
            text:
              "Flooded: One year later, assessing what was lost and what was found when a ravaging rain swept through metro Detroit",
            value: true
          },
          {
            text:
              'Sign contract for "What are conference organizers afraid of?"',
            value: true
          }
        ]
      },
      list: {
        0: false,
        1: false,
        2: false
      },
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

  computed: {
    startDateFormatted() {
      return this.formatDate(this.startDate);
    },
    endDateFormatted() {
      return this.formatDate(this.endDate);
    }
  },

  async mounted() {
    this.getClients();
    //this.getDiskSpaceStatsByClient(null);
  },

  methods: {
    complete(index) {
      this.list[index] = !this.list[index];
    },
    formatDate(date) {
      if (!date) return null;
      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },
    async getClients() {
      let { data } = await clientService.getClients();
      this.dataClientes = data;
      this.clientes = data.map(item => item.id);
      this.item = data.map(item => item.cliente);
    },
    async getDiskSpaceStatsByClient(idClientes = {}) {
      let { data } = await clientService.getDiskSpaceStatsByClient(idClientes);
      let sumConsumoTotal = 0;
      this.tipos = data.map(item => {
        let tamano = parseInt(item.tamano) / 1024 / 1024 / 1024;

        tamano = parseFloat(tamano.toFixed(2));
        console.log("ss", tamano);
        sumConsumoTotal += tamano;
        return {
          tipo: item.tipo,
          tamano
        };
      });
      this.consumoTotal = sumConsumoTotal;
      console.log("consumoTotal", sumConsumoTotal);
      this.disponible = this.capacidadTotal - this.consumoTotal;
      this.disponible = parseFloat(this.disponible.toFixed(2));
      this.tipos.push({ tipo: "disponible", tamano: this.disponible });
      let result = [];
      //result.push(["disponible", this.disponible]);
      for (let i in this.tipos)
        result.push([this.tipos[i]["tipo"], this.tipos[i]["tamano"]]);
      console.log(result);
      this.chartOptions.series[0].data = result;
    },
    reloadStats() {
      let idClientes = this.dataClientes
        .filter(tipo => {
          return this.cliente.includes(tipo.cliente);
        })
        .map(item => item.id);
      if (idClientes) this.capacidadTotal = 800;
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
