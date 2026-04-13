import PortfolioGrid from '../marketplace/PortfolioGrid'
import SectionHeader from '../ui/SectionHeader'

function RelatedPortfolio({ items }) {
  return (
    <section className="py-0">
      <SectionHeader description="Contoh hasil membantu kamu menilai gaya kreator." title="Contoh konten terkait" />
      <PortfolioGrid items={items} />
    </section>
  )
}

export default RelatedPortfolio
