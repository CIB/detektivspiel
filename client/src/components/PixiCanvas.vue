<template lang="html">
  <div :class="'img-'+this.mainImgID" id="cvs_thumnails_box">
    <canvas id="cvs">
    </canvas>
  </div>
</template>

<script>
import { Container } from 'pixi.js'
import { WebGLRenderer } from 'pixi.js'
import { Sprite } from 'pixi.js'
import { Graphics } from 'pixi.js'
import { Filter } from 'pixi.js'
import { Matrix } from 'pixi.js'

@Component
export default class PixiCanvas extends Vue {
  mounted() {
    this.drawCanvas()
  }

  drawCanvas() {
    console.log('hello')
    let cvs = document.getElementById('cvs')
    cvs.width = 800
    cvs.height = 540
    let renderer = new PIXI.WebGLRenderer(cvs.width, cvs.height, {
      backgroundColor: 0xffffff,
      view: cvs,
      antialias: false,
    })
    let container = new PIXI.Container()
    let img = new Image()
    img.src = '/assets/door_open.png'
    img.onload = function() {
      let sprite = new PIXI.Sprite(new PIXI.Texture(new PIXI.BaseTexture(img)))
      sprite.width = cvs.width
      sprite.height = cvs.height
      container.addChild(sprite)
      renderer.render(container)
    }
  }
}
</script>
