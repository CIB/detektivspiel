<template>
  <div class="dialog-box">
    <div class="speaker">
      <img class="avatar" src="../assets/kleinesTelefon_0000.png" />
      <div class="speaker-name">Telefon</div>
    </div>
    <div class="text-content">
      <span>{{ shownMessage }}</span
      ><span class="hiddenMessage">{{ hiddenMessage }} </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { GameState } from './gamestate.store'
import PixiCanvas from './PixiCanvas.vue'

@Component
export default class SpeechBox extends Vue {
  @Prop() private msg!: string
  numberOfLetters: number = 0

  @Watch('msg')
  onMsgChanged() {
    this.numberOfLetters = 0
  }

  get shownMessage() {
    return this.msg.substring(0, this.numberOfLetters)
  }

  get hiddenMessage() {
    return this.msg.substring(this.numberOfLetters)
  }

  created() {
    setTimeout(() => {
      setInterval(() => {
        this.numberOfLetters++
      }, 50)
    }, 200)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.hiddenMessage {
  opacity: 0;
}
.speaker {
  margin: 5px;
}
.speaker-name {
  font-family: 'Roboto';
  font-size: 30px;
  background-color: rgb(199, 118, 93);
  border-radius: 5px;
}
.avatar {
  margin-left: 5px;
  margin-right: 5px;
  border-width: 4px;
  border-color: rgb(235, 85, 39);
  border-style: solid;
  border-radius: 4px;
  background-color: rgba(201, 59, 40);
}
.text-content {
  margin-left: 8px;
  font-family: 'Ruge Boogie', cursive;
  font-size: 50px;
  text-align: left;
}
.dialog-box {
  margin-top: 100px;
  margin-left: 100px;
  width: 700px;
  height: 180px;
  background-color: rgba(175, 52, 36);
  border-width: 10px;
  border-color: rgb(97, 35, 16);
  border-style: solid;
  border-radius: 10px;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: top;

  user-select: none;
  pointer-events: none;
}
</style>
