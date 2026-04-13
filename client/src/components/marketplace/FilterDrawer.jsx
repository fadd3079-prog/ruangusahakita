import Modal from '../ui/Modal'
import FilterPanel from './FilterPanel'

function FilterDrawer({ open, filters, onChange, onReset, onClose }) {
  return (
    <Modal onClose={onClose} open={open} title="Filter kreator">
      <FilterPanel filters={filters} onChange={onChange} onReset={onReset} />
    </Modal>
  )
}

export default FilterDrawer
