import * as THREE from 'three'
import TWEEN from '@tweenjs/tween.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'
import { MtlObjBridge } from 'three/examples/jsm/loaders/obj2/bridge/MtlObjBridge.js'
import { OBJLoader2Parallel } from 'three/examples/jsm/loaders/OBJLoader2Parallel.js'

// 循环调用tween动画,tween动画动起来的关键
function tweenAnimation () {
  requestAnimationFrame(tweenAnimation)
  TWEEN.update()
}
tweenAnimation()
let inTween = false

const _THREEScene = function (elementToBindTo) {
  this.renderer = null
  this.canvas = elementToBindTo
  this.aspectRatio = 1
  this.recalcAspectRatio()
  this.scene = null
  this.cameraDefaults = {
    posCamera: new THREE.Vector3(-500.0, 250.0, 1000.0),
    posCameraTarget: new THREE.Vector3(0, 0, 0),
    near: 0.1,
    far: 10000,
    fov: 45
  }
  this.camera = null
  this.cameraTarget = this.cameraDefaults.posCameraTarget
  this.controls = null
  this.pivot = null
}
_THREEScene.prototype = {
  constructor: _THREEScene,
  // init Default Scene
  initGL: function () {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      autoClear: true
    })
    this.renderer.setClearColor(0x050505)
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(this.cameraDefaults.fov, this.aspectRatio, this.cameraDefaults.near, this.cameraDefaults.far)
    this.resetCamera()
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.maxDistance = 5000
    let ambientLight = new THREE.AmbientLight(0xffffff)
    let directionalLight1 = new THREE.DirectionalLight(0xC0C090)
    let directionalLight2 = new THREE.DirectionalLight(0xC0C090)
    directionalLight1.position.set(-100, -50, 100)
    directionalLight2.position.set(100, 50, -100)
    this.scene.add(directionalLight1)
    this.scene.add(directionalLight2)
    this.scene.add(ambientLight)
    let helper = new THREE.GridHelper(4000, 100, 0xCC0000, 0x404040)
    this.scene.add(helper)
    this.pivot = new THREE.Object3D()
    this.pivot.name = 'Pivot'
    this.scene.add(this.pivot)
  },
  /**
   * 加载obj文件
   * filePath 模型public/objs下的文件路径
   * scale 缩放比例 0-1
   * x,y,z 坐标轴位置
   * clone = [{ scale, x, y, z }]
   * overrideMaterials Bool, 是否需要覆盖材质，并提供color, opacity
   */
  useLoadParallel: function (Object3D = { filePath: '', scale: 1, x: 0, y: 0, z: 0, clone: [], rx: 0, ry: 0, rz: 0 }, resetCenter = false) {
    const _scope = this
    const modelName = Object3D.filePath.split('/')[Object3D.filePath.split('/').length - 1]
    let objLoader = new OBJLoader2Parallel().setModelName(modelName)
    // 需要关注是否有clone项
    function callbackOnLoad (object3d, message) {
      if (Object3D.clone && Object3D.clone.length) {
        for (let index in Object3D.clone) {
          const _newModel = new THREE.Object3D()
          _newModel.copy(object3d)
          _newModel.name = 'Pivot_' + modelName + '_' + index
          _newModel.scale.set(Object3D.clone[index].scale, Object3D.clone[index].scale, Object3D.clone[index].scale)
          _newModel.position.set(Object3D.clone[index].x, Object3D.clone[index].y, Object3D.clone[index].z)
          _newModel.rotation.set(Object3D.clone[index].rx, Object3D.clone[index].ry, Object3D.clone[index].rz)
          _scope.pivot.add(_newModel)
          if (resetCenter) _scope.resetCenter(_newModel)
        }
      } else {
        object3d.name = 'Pivot_' + modelName
        object3d.scale.set(Object3D.scale, Object3D.scale, Object3D.scale)
        object3d.position.set(Object3D.x, Object3D.y, Object3D.z)
        object3d.rotation.set(Object3D.rx, Object3D.ry, Object3D.rz)
        _scope.pivot.add(object3d)
        if (resetCenter) _scope.resetCenter(object3d)
      }
    }
    function onLoadMtl (mtlParseResult) {
      objLoader.addMaterials(MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult), true)
      objLoader.load(`${process.env.BASE_URL}objs/${Object3D.filePath}.obj`, callbackOnLoad)
    }
    let mtlLoader = new MTLLoader()
    mtlLoader.load(`${process.env.BASE_URL}objs/${Object3D.filePath}.mtl`, onLoadMtl)
  },
  // 重置模型中心点
  resetCenter: function (object3D) {
    object3D.traverse(item => {
      if (item.type === 'Mesh') {
        item.geometry.computeBoundingBox()
        item.geometry.center()
      }
    })
  },
  // 重置画布
  resizeDisplayGL: function () {
    this.recalcAspectRatio()
    this.renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight, false)
    this.updateCamera()
  },
  // 重置时调整长宽比
  recalcAspectRatio: function () {
    this.aspectRatio = (this.canvas.offsetHeight === 0) ? 1 : this.canvas.offsetWidth / this.canvas.offsetHeight
  },
  // 重置时重置摄像机位
  resetCamera: function () {
    this.camera.position.copy(this.cameraDefaults.posCamera)
    this.cameraTarget.copy(this.cameraDefaults.posCameraTarget)
    this.updateCamera()
  },
  // 更新摄像机
  updateCamera: function () {
    this.camera.aspect = this.aspectRatio
    this.camera.lookAt(this.cameraTarget)
    this.camera.updateProjectionMatrix()
  },
  // 渲染
  render: function () {
    if (!this.renderer.autoClear) this.renderer.clear()
    this.controls.update()
    this.renderer.render(this.scene, this.camera)
  },
  // 清空场景
  clearScene: function () {
    const _scope = this
    _scope.pivot.traverse(function (item) {
      _scope.scene.remove(item)
    })
    _scope.scene.dispose()
    _scope.renderer.clear()
  },
  // rotationAnimation TWEEN旋转动画
  rotationAnimation: function (object3D, position, target) {
    if (inTween === false) {
      new TWEEN.Tween(position).to(target, 500).easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(() => {
          object3D.position.x = position.x
          object3D.position.z = position.z
          object3D.rotation.y = position.y
          inTween = true
        }).start()
        .onComplete(() => {
          inTween = false
        })
    }
  }
}

const ThreeSceneLoader = _THREEScene

export default ThreeSceneLoader
