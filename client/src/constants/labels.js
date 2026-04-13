export const requestStatusLabels = {
  draft: 'Draft',
  submitted: 'Dikirim',
  reviewed: 'Ditinjau',
  accepted: 'Diterima',
  in_progress: 'Dikerjakan',
  done: 'Selesai',
}

export const requestStatusTone = {
  draft: 'muted',
  submitted: 'info',
  reviewed: 'warning',
  accepted: 'success',
  in_progress: 'primary',
  done: 'success',
}

export const dashboardMenu = {
  umkm: [
    { label: 'Dashboard', to: '/dashboard/umkm' },
    { label: 'Cari Kreator', to: '/cari-kreator' },
    { label: 'Favorit', to: '/dashboard/umkm/favorit' },
    { label: 'Permintaan Saya', to: '/dashboard/umkm/permintaan' },
    { label: 'Profil Usaha', to: '/dashboard/umkm/profil-usaha' },
    { label: 'Pengaturan', to: '/dashboard/umkm/pengaturan' },
  ],
  creator: [
    { label: 'Dashboard', to: '/dashboard/kreator' },
    { label: 'Profil', to: '/dashboard/kreator/profil' },
    { label: 'Layanan', to: '/dashboard/kreator/layanan' },
    { label: 'Portofolio', to: '/dashboard/kreator/portofolio' },
    { label: 'Permintaan Masuk', to: '/dashboard/kreator/permintaan' },
    { label: 'Pengaturan', to: '/dashboard/kreator/pengaturan' },
  ],
}
