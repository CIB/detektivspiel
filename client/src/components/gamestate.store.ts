import Vuex from 'vuex'

export interface GameState {
  doorOpen: boolean
}

const gameStateDefault: GameState = {
  doorOpen: false,
}

export const gamestate = {
  namespaced: true,
  state: gameStateDefault,
  mutations: {
    toggleDoor(state: GameState, value: boolean) {
      state.doorOpen = value
    },
  },
}
