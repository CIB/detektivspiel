<template>
  <div class="screen">
    <div class="container">
      <PixiCanvas
        v-if="playerTwo !== null"
        @phoneClicked="phoneClicked"
        @sortBooks="sortBooks"
        @bookWindowOpened="bookWindowOpened"
        :playerTwo="playerTwo"
        :showingBookWindow="showingBookWindow && playerTwo"
      ></PixiCanvas>
      <SpeechBox
        v-if="dialogActivated && playerTwo"
        class="speech-box"
        msg="Hallo, ich bin ein sprechendes Telefon, und finde es toll, dass du das Rätsel gelöst hast!"
      ></SpeechBox>
      <SpeechBox
        v-if="dialogActivated && !playerTwo"
        class="speech-box"
        msg="Freude, jemand im anderen Raum hat das Rätsel gelöst!"
      ></SpeechBox>
      <div class="note-container" v-if="!dialogActivated && !playerTwo">
        <div class="note-box">Kehre die Reihenfolge der Bücher um.</div>
      </div>
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
  showingBookWindow = false

  get gameState(): GameState {
    return this.$store.state.gamestate
  }

  get phoneRinging(): boolean {
    return this.gameState.phoneRinging
  }

  get dialogActivated(): boolean {
    return this.gameState.dialogActivated
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

  sortBooks(bookOrder: number[]) {
    console.log('see', bookOrder)
    this.emit('sortBooks', bookOrder)
  }

  bookWindowOpened() {
    this.showingBookWindow = true
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

.note-container {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
}

.note-box {
  margin-top: 800px;
  margin-left: 400px;
  padding: 20px 10px 10px 10px;

  font-family: 'Ruge Boogie', cursive;
  font-size: 50px;
  text-align: left;
  background-color: #f7cf52;
  border-radius: 100%/50% 0 30px 30px;
  box-shadow: 0px 3px 0px white;
}
</style>
