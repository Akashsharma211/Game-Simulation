import * as THREE from 'three'

function createNoiseCanvas(width, height, noiseScale, noiseIntensity, baseColorStr, noiseColorStr) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  const baseColor = new THREE.Color(baseColorStr)
  const noiseColor = new THREE.Color(noiseColorStr)

  ctx.fillStyle = baseColorStr
  ctx.fillRect(0, 0, width, height)

  const imgData = ctx.getImageData(0, 0, width, height)
  const data = imgData.data

  for (let i = 0; i < data.length; i += 4) {
    const r = Math.random()
    if (r < noiseIntensity) {
      data[i] = noiseColor.r * 255
      data[i + 1] = noiseColor.g * 255
      data[i + 2] = noiseColor.b * 255
    }
  }

  ctx.putImageData(imgData, 0, 0)
  return canvas
}

function generateAsphaltTexture() {
  const canvas = createNoiseCanvas(512, 512, 1, 0.5, '#222222', '#333333')
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(10, 10)
  return texture
}

function generateConcreteTexture() {
  const canvas = createNoiseCanvas(512, 512, 1, 0.4, '#7a7a7a', '#8a8a8a')
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  return texture
}

function generateGrassTexture() {
  const canvas = createNoiseCanvas(512, 512, 1, 0.3, '#1f2d18', '#2d4023')
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(50, 50)
  return texture
}

function generateWindowEmissiveTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')

  // Dark background
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, 512, 512)

  // Draw bright windows
  ctx.fillStyle = '#ffffff'
  for (let x = 16; x < 512; x += 64) {
    for (let y = 16; y < 512; y += 64) {
      if (Math.random() > 0.3) { // 70% chance a window is lit
        ctx.fillRect(x, y, 32, 48)
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(2, 2)
  return texture
}

export const Textures = {
  get asphalt() { return this._asphalt || (this._asphalt = generateAsphaltTexture()) },
  get concrete() { return this._concrete || (this._concrete = generateConcreteTexture()) },
  get grass() { return this._grass || (this._grass = generateGrassTexture()) },
  get windowEmissive() { return this._windowEmissive || (this._windowEmissive = generateWindowEmissiveTexture()) }
}
