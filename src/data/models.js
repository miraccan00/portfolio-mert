const BASE = import.meta.env.BASE_URL

export const MODELS = [
  {
    id: 'site',
    title: 'Site Model',
    tags: 'Blender \u2022 PBR materials \u2022 2024',
    glb: BASE + 'models/site.glb',
    accent: '#4a7fe8',
  },
  {
    id: 'icosphere',
    title: 'Icosphere',
    tags: 'Sculpted \u2022 Subdivision surface \u2022 2024',
    glb: BASE + 'models/kup.glb',
    accent: '#e87a4a',
  },
]
