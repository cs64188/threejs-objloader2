<template>
  <div>
    <div id="glFullscreen">
      <canvas id="three-scene"></canvas>
    </div>
  </div>
</template>

<script>
import ThreeSceneLoader from '../utils/three-loader'
import { initHomeScene } from './HomeScene'

let app

function initScene () {
  app = new ThreeSceneLoader(document.getElementById('three-scene'))
  initHomeScene(app)
  function resizeWindow () {
    app.resizeDisplayGL()
  }
  function render () {
    requestAnimationFrame(render)
    app.render()
  }
  render()
  window.addEventListener('resize', resizeWindow, false)
  app.resizeDisplayGL()
}

export default {
  mounted () {
    initScene()
  }
}
</script>

<style lang="sass" scoped>
#glFullscreen
  width: 100%
  height: 100vh
  min-width: 640px
  min-height: 360px
  position: relative
  overflow: hidden
  z-index: 0
  #three-scene
    width: 100%
    height: 100%
    top: 0
    left: 0
    background-color: #000000
</style>
