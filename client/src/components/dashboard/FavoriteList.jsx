import CreatorCard from '../marketplace/CreatorCard'

function FavoriteList({ creators }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {creators.map((creator) => <CreatorCard creator={creator} key={creator.id} />)}
    </div>
  )
}

export default FavoriteList
