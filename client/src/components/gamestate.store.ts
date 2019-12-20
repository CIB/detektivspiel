import Vuex from 'vuex'

import { isEqual } from 'lodash'

export interface GameState {
  phoneRinging: boolean
  bookOrder: number[]
  dialogActivated: boolean
}

const gameStateDefault: GameState = {
  phoneRinging: false,
  bookOrder: [0, 1, 2, 3, 4, 5],
  dialogActivated: false,
}

export const gamestate = {
  namespaced: true,
  state: gameStateDefault,
  mutations: {
    togglePhone(state: GameState, value: boolean) {
      state.phoneRinging = value
    },
    sortBooks(state: GameState, value: number[]) {
      console.log('sortBooks', value)
      state.bookOrder = value
      if (isEqual(value, [5, 4, 3, 2, 1, 0])) {
        state.dialogActivated = true
        console.log('yay')
      }
    },
  },
}
