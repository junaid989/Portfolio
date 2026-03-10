import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { useStore } from '../store/globalState'
import * as THREE from 'three'

const LERP = 0.05
const IDLE_AMP = 0.2
const IDLE_SPEED = 0.25
const BASE_POS = new THREE.Vector3(0, 2, 8)
const LOOK_AT = new THREE.Vector3(0, 1.5, 0)

export default function CameraRig() {
  const pos = useRef(new THREE.Vector3(0, 2, 8))
  const { cameraTarget } = useStore()

  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (cameraTarget?.position) {
      pos.current.lerp(
        new THREE.Vector3(
          cameraTarget.position.x,
          cameraTarget.position.y,
          cameraTarget.position.z
        ),
        LERP
      )
      camera.position.copy(pos.current)
      const lookAt = cameraTarget.lookAt || cameraTarget.position
      const target = new THREE.Vector3(lookAt.x, lookAt.y, lookAt.z)
      camera.lookAt(target)
    } else {
      const x = BASE_POS.x + Math.sin(t * IDLE_SPEED) * IDLE_AMP * 4
      const y = BASE_POS.y + Math.cos(t * IDLE_SPEED * 0.7) * IDLE_AMP
      const z = BASE_POS.z + Math.cos(t * IDLE_SPEED) * IDLE_AMP * 2
      pos.current.set(x, y, z)
      camera.position.copy(pos.current)
      camera.lookAt(LOOK_AT)
    }
  })

  return null
}
