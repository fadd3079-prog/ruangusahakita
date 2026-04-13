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
    <section className="ruk-section">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <h1 className="fw-bold">{page.title}</h1>
            <p className="lead ruk-muted">{page.description}</p>
            <div className="d-grid gap-3 my-4">
              {page.points.map((point) => (
                <div className="ruk-surface p-3" key={point}>{point}</div>
              ))}
            </div>
            <div className="d-flex flex-column flex-sm-row gap-2">
              <Button to={ROUTES.creators}>Cari kreator</Button>
              <Button to={ROUTES.register} variant="secondary">Daftar</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default InfoPage
