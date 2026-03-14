const BLOBS = [
  { cls: 'caustic-1', w: 520, h: 420, top: '-80px', left: '5%'  },
  { cls: 'caustic-2', w: 380, h: 460, top: '10%',   left: '40%' },
  { cls: 'caustic-3', w: 440, h: 350, top: '25%',   left: '65%' },
  { cls: 'caustic-4', w: 300, h: 500, top: '50%',   left: '15%' },
  { cls: 'caustic-5', w: 460, h: 400, top: '45%',   left: '55%' },
  { cls: 'caustic-6', w: 350, h: 380, top: '70%',   left: '30%' },
]

// Opacity controlled by CSS variable --caustic-op via .caustic-light class
export function CausticLight() {
  return (
    <div className="caustic-light fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {BLOBS.map(({ cls, w, h, top, left }) => (
        <div
          key={cls}
          className={`caustic-blob ${cls}`}
          style={{ position: 'absolute', width: w, height: h, top, left }}
        />
      ))}
    </div>
  )
}
