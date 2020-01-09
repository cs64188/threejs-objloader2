const HomeSceneData = [
  { filePath: 'outside/device1',
    clone: [
      { scale: 0.03, x: -150, y: 50, z: -150, rx: 0, ry: Math.PI / 2, rz: 0 },
      { scale: 0.03, x: -150, y: 50, z: -100, rx: 0, ry: Math.PI / 2, rz: 0 },
      { scale: 0.03, x: -210, y: 60, z: -150, rx: 0, ry: Math.PI / 2, rz: 0 },
      { scale: 0.03, x: -210, y: 60, z: -100, rx: 0, ry: Math.PI / 2, rz: 0 },
      { scale: 0.03, x: -290, y: 60, z: -150, rx: 0, ry: Math.PI / 2, rz: 0 },
      { scale: 0.03, x: -290, y: 60, z: -100, rx: 0, ry: Math.PI / 2, rz: 0 },
      { scale: 0.03, x: -350, y: 50, z: -150, rx: 0, ry: Math.PI / 2, rz: 0 },
      { scale: 0.03, x: -350, y: 50, z: -100, rx: 0, ry: Math.PI / 2, rz: 0 },
      { scale: 0.03, x: -150, y: 50, z: 150, rx: 0, ry: Math.PI / 2, rz: 0 },
      { scale: 0.03, x: -150, y: 50, z: 100, rx: 0, ry: Math.PI / 2, rz: 0 },
      { scale: 0.03, x: -210, y: 60, z: 150, rx: 0, ry: Math.PI / 2, rz: 0 },
      { scale: 0.03, x: -210, y: 60, z: 100, rx: 0, ry: Math.PI / 2, rz: 0 },
      { scale: 0.03, x: -290, y: 60, z: 150, rx: 0, ry: Math.PI / 2, rz: 0 },
      { scale: 0.03, x: -290, y: 60, z: 100, rx: 0, ry: Math.PI / 2, rz: 0 },
      { scale: 0.03, x: -350, y: 50, z: 150, rx: 0, ry: Math.PI / 2, rz: 0 },
      { scale: 0.03, x: -350, y: 50, z: 100, rx: 0, ry: Math.PI / 2, rz: 0 }
    ]
  }
]

export function initHomeScene (app) {
  app.initGL()
  for (let index in HomeSceneData) {
    app.useLoadParallel(HomeSceneData[index], true)
  }
  app.scene.name = 'Scene_Home'
}
