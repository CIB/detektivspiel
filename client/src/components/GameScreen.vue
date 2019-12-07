<template>
  <div class="hello">
    <PixiCanvas
      v-if="playerTwo !== null"
      @phoneClicked="phoneClicked"
      :phoneRinging="doorOpen"
      :playerTwo="playerTwo"
    ></PixiCanvas>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { GameState } from './gamestate.store'
import PixiCanvas from './PixiCanvas.vue'

@Component({
  components: {
    PixiCanvas,
  },
})
export default class GameScreen extends Vue {
  @Prop() private msg!: string

  open: boolean = true
  phoneRinging: boolean = false
  playerTwo: boolean = null
  connection: any

  get gameState(): GameState {
    return this.$store.state.gamestate
  }

  get doorOpen(): boolean {
    return this.gameState.doorOpen
  }

  created() {
    this.connection = require('socket.io-client')('/', { path: '/napi' })
    this.connection.on('playerTwo', (value: boolean) => {
      console.log('playerTwo', value)
      this.playerTwo = value
      this.$store.commit('gamestate/toggleDoor', value)
    })
    this.connection.on('phoneRinging', (value: boolean) => {
      this.$store.commit('gamestate/toggleDoor', value)
    })
    this.connection.on('connect', () => {
      this.connection.emit('startGame')
    })
  }

  phoneClicked() {
    this.connection.emit('toggleDoor', !this.doorOpen)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@keyframes example {
  from {
    background-image: url('../assets/door_open.png');
  }
  to {
    background-image: url('../assets/door_open.png');
  }
}

/* The element to apply the animation to */
.door {
  width: 100px;
  height: 100px;
  animation-name: example;
  animation-duration: 4s;
  background-image: url('../assets/door_open.png');
}
</style>
