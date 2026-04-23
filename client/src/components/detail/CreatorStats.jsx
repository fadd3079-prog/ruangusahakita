function CreatorStats({ creator }) {
  const stats = [
    { label: 'Rating Kreator', value: creator.ratingAvg },
    { label: 'Total Ulasan', value: creator.reviewCount },
    { label: 'Layanan Aktif', value: creator.services.length },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col justify-center items-center text-center shadow-sm" key={stat.label}>
          <p className="text-slate-500 font-bold uppercase tracking-wider text-xs mb-2">{stat.label}</p>
          <p className="text-4xl font-black text-ruk-primary">{stat.value}</p>
        </div>
      ))}
    </div>
  )
}

export default CreatorStats
