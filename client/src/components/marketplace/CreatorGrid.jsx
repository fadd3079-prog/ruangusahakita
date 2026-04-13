import EmptyState from '../common/EmptyState'
import CreatorCard from './CreatorCard'

function CreatorGrid({ creators }) {
  if (!creators.length) {
    return (
      <EmptyState
        actionLabel="Reset pencarian"
        actionTo="/cari-kreator"
        description="Coba ubah kata kunci atau filter agar pilihan kreator lebih luas."
        title="Belum ada kreator yang sesuai"
      />
    )
  }

  return (
    <div className="ruk-grid ruk-grid-3">
      {creators.map((creator) => (
        <CreatorCard creator={creator} key={creator.id} />
      ))}
    </div>
  )
}

export default CreatorGrid
