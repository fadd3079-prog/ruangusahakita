import SectionHeader from '../ui/SectionHeader'

function CreatorAbout({ creator }) {
  return (
    <section className="py-0">
      <div className="mb-8"><SectionHeader title="Tentang kreator" /></div>
      <p className="text-slate-600 font-medium leading-relaxed text-lg max-w-[78ch]">{creator.fullBio}</p>
    </section>
  )
}

export default CreatorAbout
