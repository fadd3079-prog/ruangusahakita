function DashboardSection({ title, children, action }) {
  return (
    <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] mb-8">
      <div className="flex justify-between items-center gap-4 mb-6">
        <h2 className="text-xl font-bold text-ruk-navy">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}

export default DashboardSection
