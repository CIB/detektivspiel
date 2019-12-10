<template>
  <div class="screen">
    <div class="container">
      <PixiCanvas
        v-if="playerTwo !== null"
        @phoneClicked="phoneClicked"
        :playerTwo="playerTwo"
      ></PixiCanvas>
      <SpeechBox
        v-if="!phoneRinging"
        class="speech-box"
        msg="Hello! I'm a talking telephone! Click on me now!"
      ></SpeechBox>
      <SpeechBox
        v-if="phoneRinging"
        class="speech-box"
        msg="Ring ring! Ring ring! Ring! Ringa-ding! Ring ring ring!"
      ></SpeechBox>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { GameState } from './gamestate.store'
import PixiCanvas from './PixiCanvas.vue'
import SpeechBox from './SpeechBox.vue'

@Component({
  components: {
    PixiCanvas,
    SpeechBox,
  },
})
export default class GameScreen extends Vue {
  @Prop() private msg!: string

  open: boolean = true
  playerTwo: boolean = null
  connection: any

  get gameState(): GameState {
    return this.$store.state.gamestate
  }

  get phoneRinging(): boolean {
    return this.gameState.phoneRinging
  }

  created() {
    this.connection = require('socket.io-client')('/', { path: '/napi' })
    this.connection.on('playerTwo', (value: boolean) => {
      console.log('playerTwo', value)
      this.playerTwo = value
    })
    this.connection.on('synchronizeState', ([action, value]: [string, any]) => {
      this.$store.commit(`gamestate/${action}`, value)
    })
    this.connection.on('connect', () => {
      this.connection.emit('startGame')
    })
  }

  phoneClicked() {
    this.emit('togglePhone', !this.phoneRinging)
  }

  emit(action: string, value: any) {
    this.connection.emit('synchronizeState', [action, value])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.screen {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.container {
  position: relative;
  width: 1600px;
  height: 800px;
}

.speech-box {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
}
</style>
