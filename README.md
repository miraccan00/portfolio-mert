# 3D Portfolio — React Three Fiber

Blender modellerini web'de sergilemek için hazır başlangıç projesi.

## Kurulum

```bash
npm install
npm run dev
```

## Kendi modellerini eklemek

### 1. Blender'dan export

File → Export → **glTF 2.0 (.glb)**

Ayarlar:
- ✅ **Draco Mesh Compression** → dosya boyutunu 3-5x küçültür
- ✅ Apply Modifiers
- ✅ +Y Up
- Format: **glTF Binary (.glb)** — doku ve mesh tek dosyada

### 2. Dosyayı projeye koy

```
public/
  models/
    artifact-01.glb   ← buraya
    vessel-02.glb
    ...
```

### 3. Kataloğu güncelle

`src/data/models.js` dosyasında her modelin `glb` yolunu güncelle:

```js
{
  id: 'benim-modelim',
  title: 'Model Adı',
  year: '2024',
  tags: ['hard-surface', 'PBR'],
  description: 'Modelin kısa açıklaması...',
  glb: '/models/benim-modelim.glb',
  fallback: 'icosahedron',   // GLB yoksa gösterilecek primitif
  accentColor: '#4a7fe8',    // vurgu rengi
  bgColor: '#08080f',        // arka plan rengi
  scale: 1.4,
  autoRotateSpeed: 0.4,
}
```

GLB dosyası yoksa `fallback` primitifi otomatik gösterilir,
dosya yerleştirilince sayfa yenilenmeden yüklenir.

## Optimize etmek (isteğe bağlı)

Büyük modeller için:

```bash
npm install -g @gltf-transform/cli

# Draco ile sıkıştır
gltf-transform optimize model.glb model-opt.glb --compress draco

# Texture sıkıştır (KTX2/Basis)
gltf-transform etc1s model.glb model-opt.glb
```

## Deploy

```bash
npm run build    # dist/ klasörü oluşur
```

Vercel / Netlify / GitHub Pages için `dist/` klasörünü deploy et.

### miraccanyilmaz.me'ye entegre

Blogunun içinde bir `/3d` rotasına mount etmek için
`App.jsx` bileşenini istediğin router'a koy:

```jsx
// Astro / Next.js / Remix — dilediğin framework
import Portfolio from './r3f-portfolio/src/App'
// ...
<Portfolio />
```

## Stack

| Paket | Amaç |
|---|---|
| `@react-three/fiber` | React içinde Three.js |
| `@react-three/drei` | OrbitControls, Environment, ContactShadows, useGLTF |
| `leva` | Dev-time debug paneli |
| `vite` | Build tool |
