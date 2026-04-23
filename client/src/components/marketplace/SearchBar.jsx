import Button from '../ui/Button'

function SearchBar({ value, onChange, onSubmit }) {
  return (
    <form className="relative flex w-full" onSubmit={onSubmit}>
      <label className="sr-only" htmlFor="creator-search">Cari kreator</label>
      <input
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:border-ruk-primary focus:outline-none focus:ring-1 focus:ring-ruk-primary pr-24"
        id="creator-search"
        onChange={(event) => onChange(event.target.value)}
        placeholder="Cari kreator, niche, atau kota"
        type="search"
        value={value}
      />
      <div className="absolute right-1.5 top-1.5 bottom-1.5">
        <Button className="!py-1.5 !px-4 !text-sm h-full" type="submit">Cari</Button>
      </div>
    </form>
  )
}

export default SearchBar
