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
          disabled
          @change="reloadStats"
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
            @change="changeDate"
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
              @change="changeDate"
            />
          </template>
          <v-date-picker
            v-model="endDate"
            no-title
            scrollable
            locale="es-co"
            color="light-blue darken-3"
            @input="menu2 = false"
            @change="changeDate"
          />
        </v-menu>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" lg="12">
        <md-card class="md-primary" style="background-color: WHITE;">
          <md-card-area md-inset>
            <md-card-header style="background-color: WHITE;">
              <highcharts :options="chartOptions" />
            </md-card-header>
            <hr role="separator" aria-orientation="horizontal" class="mt-2 v-divider theme--light" />
          </md-card-area>
        </md-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { clientService } from "@/_services";
import { mapState } from "vuex";
export default {
  name: "DashboardDashboard",

  data() {
    return {
      dialog: false,
      startDate: new Date("2020-04-01").toISOString().substr(0, 10),
      endDate: new Date().toISOString().substr(0, 10),
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
      chartOptions: {
        chart: {
          type: "spline"
        },
        title: {
          text: "Monitoreo Historial"
        },
        xAxis: {
          type: "datetime",
          dateTimeLabelFormats: {
            // don't display the dummy year
            month: "%e. %b",
            year: "%b"
          },
          title: {
            text: "Fechas"
          }
        },
        yAxis: {
          title: {
            text: "GB"
          },
          labels: {
            formatter: function() {
              return this.value + "GB";
            }
          }
        },
        tooltip: {
          crosshairs: true,
          shared: true
        },
        plotOptions: {
          spline: {
            marker: {
              radius: 4,
              lineColor: "#666666",
              lineWidth: 1
            }
          }
        },
        series: []
      }
    };
  },

  computed: {
    ...mapState(["empresa", "empresas", "dataEmpresas"]),
    startDateFormatted() {
      return this.formatDate(this.startDate);
    },
    endDateFormatted() {
      return this.formatDate(this.endDate);
    }
  },

  async mounted() {
    this.clientes = this.empresas;
    this.dataClientes = this.dataEmpresas;
    this.cliente = this.empresa;
    if (Object.keys(this.clientes).length == 0) this.getClients();
    this.changeDate();
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
      this.clientes = data.map(item => item.cliente);
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
    async getDiskSpaceStatsByDate(
      idClientes = {},
      startDate = null,
      endDate = null
    ) {
      let { data } = await clientService.getDiskSpaceStatsByDate(
        idClientes,
        startDate,
        endDate
      );
      let response = [];
      response = this.setData(data, response, "backup");
      response = this.setData(data, response, "bd");
      response = this.setData(data, response, "log");
      response = this.setData(data, response, "archivos");
      this.chartOptions.series = response;
      /* this.chartOptions.series = [
        {
          name: "Tokyo",
          data: [
            [Date.UTC(2010, 1, 1), 20],
            [Date.UTC(2010, 1, 2), 70],
            [Date.UTC(2010, 1, 3), 50]
          ]
        },
        {
          name: "Tokyo44",
          data: [
            [Date.UTC(2010, 1, 1), 20],
            [Date.UTC(2010, 1, 2), 70],
            [Date.UTC(2010, 1, 3), 50]
          ]
        }
      ];*/
    },

    setData(data, response, item) {
      let backup = data
        .filter(items => items.tipo == item)
        .map(function(obj) {
          let tamano = parseInt(obj.tamano) / 1024 / 1024 / 1024;
          tamano = parseFloat(tamano.toFixed(2));
          let date = new Date(obj.fecha);
          let dt = date.getDate() + 1;
          return [Date.UTC(date.getFullYear(), date.getMonth(), dt), tamano];
        });
      if (backup) response.push({ name: item, data: backup });

      return response;
    },
    reloadStats() {
      let idClientes = this.dataClientes
        .filter(tipo => {
          return this.cliente.includes(tipo.cliente);
        })
        .map(item => item.id);
      this.getDiskSpaceStatsByClient(idClientes);
    },
    changeDate() {
      let idClientes = this.dataClientes
        .filter(tipo => {
          return this.cliente.includes(tipo.cliente);
        })
        .map(item => item.id);
      this.getDiskSpaceStatsByDate(idClientes, this.startDate, this.endDate);
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
