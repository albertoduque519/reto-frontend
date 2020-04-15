export const alert = {
    namespaced: true,
    state: {
        type: null,
        message: null,
        barColor: 'rgba(0, 0, 0, .8), rgba(0, 0, 0, .8)',
        barImage: 'https://www.solati.com.co//wp-content/uploads/2019/05/programa-de-cobranza.jpg',
        drawer: null,
    },
    actions: {
        success ({ commit }, message) {
            commit('success', message)
        },
        error ({ commit }, message) {
            commit('error', message)
        },
        clear ({ commit }) {
            commit('clear')
        },
    },
    mutations: {
        success (state, message) {
            state.type = 'alert-success'
            state.message = message
        },
        error (state, message) {
            state.type = 'alert-danger'
            state.message = message
        },
        clear (state) {
            state.type = null
            state.message = null
        },
        SET_BAR_IMAGE (state, payload) {
            state.barImage = payload
          },
          SET_DRAWER (state, payload) {
            state.drawer = payload
          },
    },
}
