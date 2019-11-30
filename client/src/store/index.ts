import Vue from 'vue'
import Vuex from 'vuex'

import { gamestate } from '../components/gamestate.store'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    gamestate: gamestate,
  },
})
