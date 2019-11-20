<template>
  <div class="hello">
    <img v-if="open" src="../assets/door_open.png" @click="clicked" />
    <img v-else src="../assets/door_closed.png" @click="clicked" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class GameScreen extends Vue {
  @Prop() private msg!: string;

  open: boolean = true;

  clicked() {
    this.open = !this.open;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
