import { usePlayerStore } from '../../store/gameStore'
import { PORTAL_POSITIONS, MAP, AREAS } from '../../utils/constants'
import { CITY_DATA } from '../../utils/cityGenerator'

const MAP_SIZE = 160

export default function MiniMap() {
  const position = usePlayerStore((s) => s.position)
  const cameraYaw = usePlayerStore((s) => s.cameraYaw)
  const discoveredPortals = usePlayerStore((s) => s.discoveredPortals)

  const scale = MAP_SIZE / MAP.SIZE
  const px = (position.x + MAP.HALF) * scale
  const pz = (position.z + MAP.HALF) * scale

  return (
    <div className="game-panel p-2 w-44 h-44 relative overflow-hidden">
      <div className="text-[10px] text-cyan-400 font-semibold mb-1 tracking-wider">MINI MAP</div>
      <svg width={MAP_SIZE - 16} height={MAP_SIZE - 16} viewBox={`0 0 ${MAP_SIZE} ${MAP_SIZE}`} className="rounded-lg">
        {/* Background */}
        <rect width={MAP_SIZE} height={MAP_SIZE} fill="#1a2332" rx="4" />

        {/* Map boundary */}
        <rect x="2" y="2" width={MAP_SIZE - 4} height={MAP_SIZE - 4} fill="none" stroke="#334155" strokeWidth="1" rx="2" />

        {/* Areas */}
        {AREAS.map((area) => {
          const { minX, maxX, minZ, maxZ } = area.bounds
          const ax = (minX + MAP.HALF) * scale
          const az = (minZ + MAP.HALF) * scale
          const aw = (maxX - minX) * scale
          const ah = (maxZ - minZ) * scale
          return (
            <rect key={area.id} x={ax} y={az} width={aw} height={ah} fill={area.color} opacity="0.15" />
          )
        })}

        {/* Roads */}
        {[-40, 0, 40].map((pos) => (
          <g key={`road-${pos}`}>
            <rect x="0" y={(pos + MAP.HALF) * scale - 2} width={MAP_SIZE} height="4" fill="#374151" />
            <rect x={(pos + MAP.HALF) * scale - 2} y="0" width="4" height={MAP_SIZE} fill="#374151" />
          </g>
        ))}

        {/* Buildings (simplified) */}
        {CITY_DATA.buildings.filter((b) => !b.isBoundary).slice(0, 40).map((b) => (
          <rect
            key={b.id}
            x={(b.x - b.width / 2 + MAP.HALF) * scale}
            y={(b.z - b.depth / 2 + MAP.HALF) * scale}
            width={Math.max(b.width * scale, 2)}
            height={Math.max(b.depth * scale, 2)}
            fill="#475569"
            opacity="0.6"
          />
        ))}

        {/* Portals */}
        {PORTAL_POSITIONS.map((portal) => {
          const discovered = discoveredPortals.includes(portal.level)
          const cx = (portal.x + MAP.HALF) * scale
          const cz = (portal.z + MAP.HALF) * scale
          return (
            <circle
              key={portal.level}
              cx={cx}
              cy={cz}
              r="3"
              fill={discovered ? '#7c3aed' : '#4b5563'}
              stroke={discovered ? '#a78bfa' : '#6b7280'}
              strokeWidth="1"
            />
          )
        })}

        {/* Player direction indicator */}
        <g transform={`translate(${px}, ${pz}) rotate(${(cameraYaw * 180) / Math.PI})`}>
          <polygon points="0,-6 4,4 -4,4" fill="#00d4ff" stroke="#ffffff" strokeWidth="0.5" />
        </g>

        {/* Player dot */}
        <circle cx={px} cy={pz} r="3" fill="#00d4ff" stroke="#ffffff" strokeWidth="1" />
      </svg>
    </div>
  )
}
