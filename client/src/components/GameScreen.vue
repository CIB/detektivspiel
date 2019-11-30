<template>
  <div class="hello">
    <img v-if="doorOpen" src="../assets/door_open.png" @click="clicked" />
    <img v-else src="../assets/door_closed.png" @click="clicked" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { GameState } from './gamestate.store'

@Component
export default class GameScreen extends Vue {
  @Prop() private msg!: string

  open: boolean = true
  connection: any

  get gameState(): GameState {
    return this.$store.state.gamestate
  }

  get doorOpen(): boolean {
    return this.gameState.doorOpen
  }

  created() {
    this.connection = require('socket.io-client')('/', { path: '/napi' })
    this.connection.on('doorOpen', (value: boolean) => {
      this.$store.commit('gamestate/toggleDoor', value)
    })
  }

  clicked() {
    this.connection.emit('toggleDoor', !this.doorOpen)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
