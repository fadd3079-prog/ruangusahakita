import Button from '../ui/Button'
import Card from '../ui/Card'

function ProfileCompletionCard({ percent, to }) {
  return (
    <Card>
      <p className="small ruk-muted mb-1">Status profil</p>
      <h2 className="h4 fw-bold">{percent}% lengkap</h2>
      <div aria-label={`Profil ${percent} persen lengkap`} className="progress mb-3" role="progressbar">
        <div className="progress-bar bg-success" style={{ width: `${percent}%` }} />
      </div>
      <p className="ruk-muted">Lengkapi profil agar UMKM lebih mudah memahami jasamu.</p>
      <Button to={to} variant="secondary">Lengkapi profil</Button>
    </Card>
  )
}

export default ProfileCompletionCard
