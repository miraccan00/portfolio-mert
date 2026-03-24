import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { MODELS } from './data/models.js'

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/')

const loader = new GLTFLoader()
loader.setDRACOLoader(dracoLoader)

// ============ ANA VIEWER ============
const viewerEl = document.getElementById('viewer')
const loaderEl = document.getElementById('loader')
const viewerTitle = document.getElementById('viewer-title')
const viewerTags = document.getElementById('viewer-tags')
const btnWireframe = document.getElementById('btn-wireframe')
const btnRotate = document.getElementById('btn-rotate')

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(45, 2, 0.1, 100)
camera.position.set(0, 1, 5)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
renderer.setClearColor(0x0a0a12)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
viewerEl.insertBefore(renderer.domElement, viewerEl.firstChild)

// Isiklar
scene.add(new THREE.AmbientLight(0xffffff, 0.6))
const dirLight = new THREE.DirectionalLight(0xffffff, 1.2)
dirLight.position.set(5, 8, 5)
scene.add(dirLight)
const backLight = new THREE.PointLight(0x4a7fe8, 0.4)
backLight.position.set(-4, 3, -4)
scene.add(backLight)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.autoRotate = true
controls.autoRotateSpeed = 1

let currentModel = null
let wireframe = false
let autoRotate = true

// Viewer boyutunu guncelle
function resizeViewer() {
  const rect = viewerEl.getBoundingClientRect()
  renderer.setSize(rect.width, rect.height)
  camera.aspect = rect.width / rect.height
  camera.updateProjectionMatrix()
}
window.addEventListener('resize', resizeViewer)

// Wireframe toggle
function setWireframe(model, enabled) {
  if (!model) return
  model.traverse((child) => {
    if (child.isMesh) {
      child.material.wireframe = enabled
    }
  })
}

btnWireframe.addEventListener('click', () => {
  wireframe = !wireframe
  btnWireframe.classList.toggle('active', wireframe)
  setWireframe(currentModel, wireframe)
})

btnRotate.addEventListener('click', () => {
  autoRotate = !autoRotate
  controls.autoRotate = autoRotate
  btnRotate.classList.toggle('active', autoRotate)
})
btnRotate.classList.add('active')

// Model yukle ve viewer'a koy
function loadIntoViewer(modelData) {
  loaderEl.classList.remove('hidden')
  viewerTitle.textContent = modelData.title
  viewerTags.textContent = modelData.tags

  // Eski modeli kaldir
  if (currentModel) {
    scene.remove(currentModel)
    currentModel.traverse((child) => {
      if (child.isMesh) {
        child.geometry.dispose()
        if (child.material.dispose) child.material.dispose()
      }
    })
    currentModel = null
  }

  loader.load(modelData.glb, (gltf) => {
    currentModel = gltf.scene

    // Modeli ortala ve olcekle
    const box = new THREE.Box3().setFromObject(currentModel)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    const scale = 3 / maxDim
    currentModel.scale.setScalar(scale)
    currentModel.position.sub(center.multiplyScalar(scale))

    setWireframe(currentModel, wireframe)
    scene.add(currentModel)

    // Kamerayi sifirla
    camera.position.set(0, 1, 5)
    controls.target.set(0, 0, 0)
    controls.update()

    loaderEl.classList.add('hidden')
  })

  // Aktif karti guncelle
  document.querySelectorAll('.model-card').forEach((card, i) => {
    card.classList.toggle('active', MODELS[i].id === modelData.id)
  })
}

// ============ KART ONIZLEMELERI ============
const gridEl = document.getElementById('model-grid')
const cardRenderers = []

function createCardPreview(modelData, container) {
  const cardScene = new THREE.Scene()
  cardScene.add(new THREE.AmbientLight(0xffffff, 0.5))
  const light = new THREE.DirectionalLight(0xffffff, 0.8)
  light.position.set(3, 5, 3)
  cardScene.add(light)

  const cardCamera = new THREE.PerspectiveCamera(40, 4 / 3, 0.1, 100)
  cardCamera.position.set(0, 0.8, 4)
  cardCamera.lookAt(0, 0, 0)

  const cardRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
  cardRenderer.setClearColor(0x0d0d16)
  cardRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  container.appendChild(cardRenderer.domElement)

  loader.load(modelData.glb, (gltf) => {
    const model = gltf.scene
    const box = new THREE.Box3().setFromObject(model)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    const scale = 2.2 / maxDim
    model.scale.setScalar(scale)
    model.position.sub(center.multiplyScalar(scale))
    cardScene.add(model)

    cardRenderers.push({ renderer: cardRenderer, scene: cardScene, camera: cardCamera, model, container })
    resizeCard(cardRenderer, container, cardCamera)
  })

  return { renderer: cardRenderer, scene: cardScene, camera: cardCamera, container }
}

function resizeCard(r, container, cam) {
  const rect = container.getBoundingClientRect()
  if (rect.width > 0 && rect.height > 0) {
    r.setSize(rect.width, rect.height)
    cam.aspect = rect.width / rect.height
    cam.updateProjectionMatrix()
  }
}

// Kartlari olustur
MODELS.forEach((m, i) => {
  const card = document.createElement('div')
  card.className = 'model-card'
  if (i === 0) card.classList.add('active')

  const preview = document.createElement('div')
  preview.className = 'card-preview'

  const info = document.createElement('div')
  info.className = 'card-info'
  info.innerHTML = `<div class="card-title">${m.title}</div><div class="card-tags">${m.tags}</div>`

  card.appendChild(preview)
  card.appendChild(info)
  card.addEventListener('click', () => loadIntoViewer(m))
  gridEl.appendChild(card)

  createCardPreview(m, preview)
})

// Pencere boyutu degisince kartlari da guncelle
window.addEventListener('resize', () => {
  cardRenderers.forEach(({ renderer: r, container, camera: c }) => resizeCard(r, container, c))
})

// ============ ANIMASYON ============
function animate() {
  requestAnimationFrame(animate)

  controls.update()
  resizeViewer()
  renderer.render(scene, camera)

  // Kart onizlemelerini dondur
  cardRenderers.forEach(({ renderer: r, scene: s, camera: c, model }) => {
    if (model) model.rotation.y += 0.005
    r.render(s, c)
  })
}

// Ilk modeli yukle
loadIntoViewer(MODELS[0])
resizeViewer()
animate()
