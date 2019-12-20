<template lang="html">
  <div id="cvs_thumnails_box">
    <canvas id="cvs"> </canvas>
  </div>
</template>

<script lang="ts">
import { GameState } from './gamestate.store'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Container } from 'pixi.js'
import { Application } from 'pixi.js'
import { Sprite, AnimatedSprite } from 'pixi.js'
import { Graphics } from 'pixi.js'
import { Filter } from 'pixi.js'
import { Matrix } from 'pixi.js'
import { LoaderResource } from 'pixi.js'
import { keys, range, toPairs, clone, sortBy } from 'lodash'

const assets = {
  atelier: require('../assets/Atelier.png'),
  bibliothek: require('../assets/Bibliothek.png'),
  phone0: require('../assets/kleinesTelefon_0000.png'),
  phone1: require('../assets/kleinesTelefon_0002.png'),
  phone2: require('../assets/kleinesTelefon_0003.png'),
}

@Component
export default class PixiCanvas extends Vue {
  @Prop() playerTwo: boolean
  @Prop() showingBookWindow: boolean

  app: Application
  tracker: {
    room?: Sprite
    phone?: AnimatedSprite
    bookWindow: Container[]
  } = { bookWindow: [] }

  mounted() {
    this.drawCanvas()
  }

  get gamestate(): GameState {
    return this.$store.state.gamestate
  }

  @Watch('showingBookWindow')
  onToggleBookWindow() {
    if (this.showingBookWindow) {
      this.addBookWindow()
    } else {
      this.removeBookWindow()
    }
  }

  setRoom(resources: Partial<Record<string, LoaderResource>>) {
    if (this.tracker.room) {
      return
    }

    this.tracker.room = new Sprite(
      this.playerTwo ? resources.bibliothek.texture : resources.atelier.texture
    )

    this.tracker.room.x = 0
    this.tracker.room.y = 0
    this.tracker.room.zIndex = 9

    this.app.stage.addChild(this.tracker.room)
  }

  addPhone(resources: Partial<Record<string, LoaderResource>>) {
    if (this.tracker.phone) {
      return
    }

    const phoneTextures = range(0, 3).map(i => resources[`phone${i}`].texture)

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

    this.app.stage.addChild(phone)
    this.tracker.phone = phone
  }

  animatePhone(i: number) {
    const phone = this.tracker.phone

    if (this.gamestate.phoneRinging) {
      if (!phone.playing) {
        phone.gotoAndPlay(0)
      }
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
  }

  addBookEntry(resources: Partial<Record<string, LoaderResource>>) {
    if (!this.playerTwo) {
      return
    }
    const graphics = new Graphics()
    graphics.beginFill(0xffffff)
    graphics.drawRect(220, 300, 150, 100)
    graphics.interactive = true
    graphics.cursor = 'pointer'
    graphics.on('pointerdown', () => {
      this.$emit('bookWindowOpened')
    })
    this.app.stage.addChild(graphics)
  }

  addBookWindow() {
    if (!this.showingBookWindow) {
      return
    }

    const instance = this
    const window = new Graphics()
    let dragging = false
    window.beginFill(0xffffff)
    window.drawRect(200, 300, 1200, 700)
    window.interactive = true
    window.zIndex = 15
    this.app.stage.addChild(window)
    this.tracker.bookWindow.push(window)

    const bookColors = [
      0xff3bc1,
      0x05ff8f,
      0x8f9119,
      0x878aad,
      0x00ff1e,
      0xdb9839,
    ]
    const bookPositions = range(0, 6).map(i => ({
      x: 335 + i * 190,
      y: 640,
    }))
    const books = { items: [] }
    function setBookPositions() {
      let i = 0
      for (let book of books.items) {
        book.x = bookPositions[i].x
        book.y = bookPositions[i].y
        i++
      }
    }
    let i = 0
    for (let bookColor of bookColors) {
      const book: Graphics & {
        bookIndex?: number
        originalIndex?: number
      } = new Graphics()
      book.cursor = 'pointer'
      book.bookIndex = book.originalIndex = i
      books.items.push(book)
      this.tracker.bookWindow.push(book)
      book.beginFill(bookColor)
      book.drawRect(-75, -200, 150, 400)
      book.interactive = true
      book.on('pointerover', function() {
        console.log(this.bookIndex)
        if (!dragging) {
          this.y -= 20
          this.movedY = 20
        }
      })
      book.on('pointerout', function() {
        console.log('test')
        if (!dragging) {
          this.y += this.movedY
          this.movedY = 0
        }
      })
      book.on('pointerdown', function(event) {
        dragging = true
        this.dragging = true
        this.data = event.data
        this.alpha = 0.5
      })
      book.on('pointerup', function() {
        dragging = false
        this.dragging = false
        this.alpha = 1
        setBookPositions()
      })
      book.on('pointermove', function() {
        // this.x += 5
        if (this.dragging) {
          const newPosition = this.data.getLocalPosition(this.parent)
          this.x = newPosition.x
          this.y = newPosition.y

          let newBookIndex = Math.round((this.x - 335) / 190)
          newBookIndex = Math.max(newBookIndex, 0)
          newBookIndex = Math.min(newBookIndex, 5)

          console.log('new', newBookIndex)

          if (newBookIndex !== this.bookIndex) {
            // Swap this book with the book at the new index
            const otherBook = books.items[newBookIndex]
            otherBook.bookIndex = this.bookIndex
            this.bookIndex = newBookIndex

            books.items = sortBy(books.items, ['bookIndex'])
            setBookPositions()
            this.x = newPosition.x
            this.y = newPosition.y
            this.movedY = 0

            instance.$emit(
              'sortBooks',
              books.items.map(book => book.originalIndex)
            )
          }
        }
      })
      i++
      this.app.stage.addChild(book)
    }
    setBookPositions()
  }

  removeBookWindow() {
    for (let item of this.tracker.bookWindow) {
      this.app.stage.removeChild(item)
    }
    this.tracker.bookWindow = []
  }

  drawCanvas() {
    let cvs = document.getElementById('cvs') as HTMLCanvasElement
    cvs.width = 1600
    cvs.height = 1200
    this.app = new Application({
      view: cvs,
      width: 1600,
      height: 1200,
    })

    this.app.loader
      .add(toPairs(assets).map(([key, value]) => ({ name: key, url: value })))
      .load((loader, resources) => {
        this.setRoom(resources)
        this.addPhone(resources)
        this.addBookEntry(resources)
        this.addBookWindow(resources)

        let i = 0
        this.app.ticker.add(() => {
          this.animatePhone(i)
          i++
        })
      })
  }
}
</script>
