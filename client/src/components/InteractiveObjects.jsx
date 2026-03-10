import { useRef, useState } from 'react'
import { useStore } from '../store/globalState'
import { Html } from '@react-three/drei'

const SECTIONS = {
  monitor: 'projects',
  hologram: 'skills',
  wall: 'about',
  tablet: 'contact',
  timeline: 'timeline',
}

const TARGETS = {
  monitor: {
    position: { x: -2.2, y: 1.8, z: 0.5 },
    lookAt: { x: -2, y: 1.5, z: 0 },
  },
  hologram: {
    position: { x: 0, y: 2.2, z: 1.5 },
    lookAt: { x: 0, y: 2, z: 0 },
  },
  wall: {
    position: { x: 0, y: 2.5, z: 4 },
    lookAt: { x: 0, y: 2, z: 0 },
  },
  tablet: {
    position: { x: 2.2, y: 1.4, z: 0.8 },
    lookAt: { x: 2, y: 1.2, z: 0 },
  },
  timeline: {
    position: { x: -3.5, y: 2, z: -2 },
    lookAt: { x: -3, y: 1.8, z: -1 },
  },
}

function InteractiveBox({ sectionKey, position, size = [1, 1, 0.1], label, color = '#00fff9' }) {
  const mesh = useRef()
  const [hover, setHover] = useState(false)
  const { setOpenSection, setCameraTarget } = useStore()
  const section = SECTIONS[sectionKey]
  const target = TARGETS[sectionKey]

  const handleClick = () => {
    setCameraTarget(target)
    setOpenSection(section)
  }

  return (
    <group position={position}>
      <mesh
        ref={mesh}
        onClick={handleClick}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        castShadow
        receiveShadow
      >
        <boxGeometry args={size} />
        <meshStandardMaterial
          color={hover ? color : '#1a1f2e'}
          emissive={color}
          emissiveIntensity={hover ? 0.4 : 0.1}
        />
      </mesh>
      <Html position={[0, size[1] / 2 + 0.15, 0]} center>
        <span
          style={{
            fontSize: 10,
            color: color,
            textShadow: `0 0 8px ${color}`,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </span>
      </Html>
    </group>
  )
}

export default function InteractiveObjects() {
  return (
    <group>
      {/* Computer Monitor → Projects */}
      <InteractiveBox
        sectionKey="monitor"
        position={[-2, 1.2, 0]}
        size={[1.4, 0.9, 0.08]}
        label="Projects"
        color="#00d4ff"
      />
      {/* Floating Hologram → Skills */}
      <InteractiveBox
        sectionKey="hologram"
        position={[0, 2, 0.5]}
        size={[1.2, 1.2, 0.05]}
        label="Skills"
        color="#bf00ff"
      />
      {/* Wall Screen → About */}
      <InteractiveBox
        sectionKey="wall"
        position={[0, 2.2, -4.5]}
        size={[2.5, 1.4, 0.05]}
        label="About"
        color="#00fff9"
      />
      {/* Tablet → Contact */}
      <InteractiveBox
        sectionKey="tablet"
        position={[2, 0.9, 0.3]}
        size={[0.7, 0.95, 0.04]}
        label="Contact"
        color="#39ff14"
      />
      {/* Timeline Board → Learning */}
      <InteractiveBox
        sectionKey="timeline"
        position={[-3, 1.5, -1.5]}
        size={[1.6, 1, 0.05]}
        label="Timeline"
        color="#ff00aa"
      />
    </group>
  )
}
