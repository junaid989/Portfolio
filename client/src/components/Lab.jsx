import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, MeshTransmissionMaterial } from '@react-three/drei'
import InteractiveObjects from './InteractiveObjects'
import Particles from './Particles'

function GlowingSymbol({ position, color = '#00fff9', scale = 0.3 }) {
  const ref = useRef()
  useFrame((t) => {
    if (ref.current) ref.current.position.y = position[1] + Math.sin(t.clock.elapsedTime) * 0.1
  })
  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={ref} position={position} scale={scale}>
        <octahedronGeometry args={[0.5, 0]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} />
      </mesh>
    </Float>
  )
}

function HolographicPanel({ position, size = [2, 1.2], color = '#00fff9' }) {
  return (
    <mesh position={position} rotation={[0, 0, 0]}>
      <planeGeometry args={size} />
      <MeshTransmissionMaterial
        backside
        samples={4}
        thickness={0.2}
        chromaticAberration={0.1}
        anisotropy={0.3}
        distortion={0.1}
        distortionScale={0.2}
        temporalDistortion={0.1}
        iridescence={0.2}
        iridescenceIOR={1}
        iridescenceThicknessRange={[0, 800]}
        color={color}
        transmission={0.95}
      />
    </mesh>
  )
}

export default function Lab() {
  return (
    <group>
      {/* Floor - reflective feel */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#0d1117" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 3, -5]} receiveShadow>
        <planeGeometry args={[16, 8]} />
        <meshStandardMaterial color="#0a0e17" metalness={0.2} roughness={0.8} />
      </mesh>

      {/* Side walls subtle */}
      <mesh position={[-6, 3, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[12, 8]} />
        <meshStandardMaterial color="#0a0e17" metalness={0.2} roughness={0.8} />
      </mesh>
      <mesh position={[6, 3, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[12, 8]} />
        <meshStandardMaterial color="#0a0e17" metalness={0.2} roughness={0.8} />
      </mesh>

      <Particles count={80} />
      <GlowingSymbol position={[-3, 2.5, -2]} color="#bf00ff" />
      <GlowingSymbol position={[3, 2, -1.5]} color="#39ff14" />
      <GlowingSymbol position={[0, 3.5, -3]} color="#00fff9" scale={0.2} />
      <HolographicPanel position={[0, 2.5, -4.8]} size={[3, 1.5]} color="#00d4ff" />

      <InteractiveObjects />
    </group>
  )
}
