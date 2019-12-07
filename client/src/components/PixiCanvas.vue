<template lang="html">
  <div id="cvs_thumnails_box">
    <canvas id="cvs"> </canvas>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Container } from 'pixi.js'
import { Application } from 'pixi.js'
import { Sprite, AnimatedSprite } from 'pixi.js'
import { Graphics } from 'pixi.js'
import { Filter } from 'pixi.js'
import { Matrix } from 'pixi.js'
import { keys, range } from 'lodash'

const atelier = require('../assets/Atelier.png')
const bibliothek = require('../assets/Bibliothek.png')
const phoneFrames = [
  require('../assets/kleinesTelefon_0000.png'),
  require('../assets/kleinesTelefon_0002.png'),
  require('../assets/kleinesTelefon_0003.png'),
]

@Component
export default class PixiCanvas extends Vue {
  @Prop() phoneRinging: boolean
  @Prop() playerTwo: boolean

  mounted() {
    this.drawCanvas()
  }

  drawCanvas() {
    let cvs = document.getElementById('cvs') as HTMLCanvasElement
    cvs.width = 1600
    cvs.height = 1200
    let app = new Application({
      view: cvs,
      width: 1600,
      height: 1200,
    })

    app.loader
      .add('atelier', atelier)
      .add('bibliothek', bibliothek)
      .add('phone0', phoneFrames[0])
      .add('phone1', phoneFrames[1])
      .add('phone2', phoneFrames[2])
      .load((loader, resources) => {
        const room = new Sprite(
          this.playerTwo
            ? resources.bibliothek.texture
            : resources.atelier.texture
        )

        room.x = 0
        room.y = 0
        room.zIndex = 9

        app.stage.addChild(room)

        const phoneTextures = range(0, 3).map(
          i => resources[`phone${i}`].texture
        )

        const phone = new AnimatedSprite(phoneTextures)

        if (this.playerTwo) {
          phone.x = 1350
          phone.y = 590
        } else {
          phone.x = 490
          phone.y = 540
        }
        phone.zIndex = 10

        phone.anchor.x = 0.5
        phone.anchor.y = 0.75

        phone.animationSpeed = 0.05
        phone.gotoAndPlay(0)

        phone.interactive = true
        phone.on('pointerdown', () => {
          this.$emit('phoneClicked')
        })

        app.stage.addChild(phone)

        let i = 0
        app.ticker.add(() => {
          if (this.phoneRinging) {
            if (!phone.playing) {
              phone.gotoAndPlay(0)
            }
            i++
            if (i % 30 < 15) {
              phone.rotation += 0.01
            } else {
              phone.rotation -= 0.01
            }

            if (i % 50 < 25) {
              phone.x += 0.3
            } else {
              phone.x -= 0.3
            }
          } else {
            if (phone.playing) {
              phone.gotoAndStop(0)
            }
          }
        })
      })
  }
}
</script>
