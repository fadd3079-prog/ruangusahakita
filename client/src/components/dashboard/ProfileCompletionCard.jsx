import Button from '../ui/Button'
import Card from '../ui/Card'

function ProfileCompletionCard({ percent, to }) {
  return (
    <Card className="!p-8 bg-gradient-to-br from-teal-50/50 to-white border-slate-100">
      <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Status profil</p>
      <h2 className="text-2xl font-black text-ruk-navy mb-4">{percent}% lengkap</h2>
      <div aria-label={`Profil ${percent} persen lengkap`} className="h-3 w-full bg-slate-100 rounded-full overflow-hidden mb-6" role="progressbar">
        <div className="h-full bg-ruk-primary rounded-full transition-all duration-1000 ease-out" style={{ width: `${percent}%` }} />
      </div>
      <p className="text-slate-500 font-medium mb-6">Lengkapi profil agar UMKM lebih mudah memahami jasamu.</p>
      <Button to={to} variant="outline">Lengkapi profil</Button>
    </Card>
  )
}

export default ProfileCompletionCard
