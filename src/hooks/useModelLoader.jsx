import { useEffect, useState } from 'react'
import { useGLTF } from '@react-three/drei'

/**
 * GLB dosyası varsa yükler, yoksa null döner.
 * Ana bileşen fallback primitifi render eder.
 */
export function useModelLoader(glbPath) {
  const [available, setAvailable] = useState(null)

  useEffect(() => {
    // HEAD isteği ile dosyanın var olup olmadığını kontrol et
    fetch(glbPath, { method: 'HEAD' })
      .then((r) => setAvailable(r.ok))
      .catch(() => setAvailable(false))
  }, [glbPath])

  return available
}

/**
 * GLB yükle — sadece available=true olduğunda çağırılmalı
 */
export function GLBModel({ path, scale }) {
  const { scene } = useGLTF(path)
  return <primitive object={scene} scale={scale} />
}
