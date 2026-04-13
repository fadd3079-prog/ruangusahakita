import CreatorCard from '../marketplace/CreatorCard'

function FavoriteList({ creators }) {
  return (
    <div className="ruk-grid ruk-grid-3">
      {creators.map((creator) => <CreatorCard creator={creator} key={creator.id} />)}
    </div>
  )
}

export default FavoriteList
