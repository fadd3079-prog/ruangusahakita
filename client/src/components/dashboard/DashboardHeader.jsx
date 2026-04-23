function DashboardHeader({ title, description, action }) {
  return (
    <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-ruk-navy tracking-tight">{title}</h1>
        {description && <p className="text-slate-500 mt-2 text-base font-medium">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

export default DashboardHeader
