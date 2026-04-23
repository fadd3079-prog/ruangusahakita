import Button from '../ui/Button'

function QuickActionPanel() {
  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col md:flex-row gap-4 mb-8">
      <Button className="w-full md:w-auto" to="/dashboard/kreator/layanan/tambah">Tambah layanan</Button>
      <Button className="w-full md:w-auto" to="/dashboard/kreator/portofolio/tambah" variant="outline">Tambah portofolio</Button>
    </div>
  )
}

export default QuickActionPanel
