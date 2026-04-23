import { ROUTES } from '../../constants/routes'
import Button from '../../components/ui/Button'

const content = {
  about: {
    title: 'Tentang Platform',
    description: 'Ruang Usaha Kita membantu UMKM dan kreator memulai kerja sama promosi digital dengan lebih jelas.',
    points: ['Discovery kreator lebih mudah', 'Profil dan portofolio tertata', 'Brief membantu ekspektasi kerja sama'],
  },
  how: {
    title: 'Cara Kerja',
    description: 'Alurnya dibuat singkat agar pengguna awam tidak perlu menebak langkah berikutnya.',
    points: ['Cari kreator', 'Lihat profil dan layanan', 'Isi brief', 'Pantau status di dashboard'],
  },
  help: {
    title: 'Bantuan',
    description: 'Butuh arah? Mulai dari mencari kreator atau melengkapi profil sesuai peranmu.',
    points: ['Gunakan filter seperlunya', 'Baca harga dan output layanan', 'Isi brief dengan contoh yang jelas'],
  },
  faq: {
    title: 'FAQ',
    description: 'Jawaban singkat untuk pertanyaan umum MVP.',
    points: ['Payment penuh belum aktif', 'AI masih placeholder', 'Dashboard sudah tersedia untuk dua role'],
  },
}

function InfoPage({ type }) {
  const page = content[type]

  return (
    <section className="py-20 lg:py-32 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
          <h1 className="text-3xl md:text-4xl font-black text-ruk-navy tracking-tight mb-4">{page.title}</h1>
          <p className="text-xl text-slate-500 font-medium mb-10 leading-relaxed">{page.description}</p>
          <div className="grid gap-4 mb-10">
            {page.points.map((point) => (
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 text-slate-700 font-medium flex items-center gap-4" key={point}>
                <div className="w-2 h-2 rounded-full bg-ruk-primary shrink-0"></div>
                {point}
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-100">
            <Button className="w-full sm:w-auto" to={ROUTES.creators}>Cari kreator</Button>
            <Button className="w-full sm:w-auto" to={ROUTES.register} variant="outline">Daftar sekarang</Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default InfoPage
