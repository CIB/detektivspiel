import Vuex from 'vuex'

export interface GameState {
  phoneRinging: boolean
}

const gameStateDefault: GameState = {
  phoneRinging: false,
}

export const gamestate = {
  namespaced: true,
  state: gameStateDefault,
  mutations: {
    togglePhone(state: GameState, value: boolean) {
      state.phoneRinging = value
    },
  },
}
