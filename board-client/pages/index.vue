<template>
  <div id="board" ref="board" class="container">
    <p>objects: {{ ops.length }}</p>
    <button @click="clear">clear</button>
    <button @click="render">render</button>
    <canvas ref="boardCanvas"></canvas>
  </div>
</template>

<script>
import { fabric } from 'fabric'
import WebSocket from 'isomorphic-ws'

export default {
  data() {
    return {
      canvas: null,
      ops: [],
      ws: null,
    }
  },
  mounted() {
    const canvasWrapper = this.$refs.boardCanvas
    this.canvas = new fabric.Canvas(canvasWrapper, { isDrawingMode: true })
    this.$nextTick(() => {
      this.onResize()
    })
    this.canvas.on('path:created', this.onAdded)
    window.addEventListener('resize', this.onResize)
    this.ws = new WebSocket('ws://localhost:8080')
    this.ws.onmessage = ({ data }) => {
      const op = JSON.parse(data)
      const klass = fabric.util.getKlass(op.type)
      klass.fromObject(op, (object) => {
        this.canvas.add(object)
      })
    }
    window.onbeforeunload = () => {
      this.ws.onclose = () => {}
      this.ws.close()
    }
  },
  methods: {
    onResize() {
      const boardWrapper = this.$refs.board
      const width = boardWrapper.clientWidth
      const height = boardWrapper.clientHeight
      this.canvas.setWidth(width)
      this.canvas.setHeight(height)
      this.canvas.renderAll()
    },
    onAdded(evt) {
      const path = evt.path
      const pathObj = path.toObject()
      const pathJSON = JSON.stringify(pathObj)
      console.log(pathJSON)
      this.ops.push(pathObj)
      this.ws.send(pathJSON)
    },
    clear() {
      this.canvas.clear()
    },
    render() {
      this.ops.forEach((item) => {
        const klass = fabric.util.getKlass(item.type)
        klass.fromObject(item, (object) => {
          this.canvas.add(object)
        })
      })
    },
  },
}
</script>

<style>
.container {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.container canvas {
  width: 100%;
  height: 100%;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
