import Button from '../ui/Button'

function SearchBar({ value, onChange, onSubmit }) {
  return (
    <form className="ruk-search-form" onSubmit={onSubmit}>
      <label className="visually-hidden" htmlFor="creator-search">Cari kreator</label>
      <input
        className="form-control form-control-lg ruk-input"
        id="creator-search"
        onChange={(event) => onChange(event.target.value)}
        placeholder="Cari kreator, niche, atau kota"
        type="search"
        value={value}
      />
      <Button type="submit">Cari kreator</Button>
    </form>
  )
}

export default SearchBar
