import Button from '../ui/Button'
import Textarea from '../ui/Textarea'

function AiBriefHelper({ draft, onDraftChange, onGenerate }) {
  return (
    <div className="ruk-surface p-4">
      <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-3">
        <div>
          <h2 className="h5 fw-bold">Bantu buat brief</h2>
          <p className="ruk-muted mb-0">Draft ini bisa kamu baca dan ubah sebelum dikirim.</p>
        </div>
        <Button onClick={onGenerate} variant="secondary">Bantu buat brief</Button>
      </div>
      <Textarea
        helperText="Ubah bagian yang belum sesuai dengan kebutuhan promosi."
        id="ai-brief-draft"
        label="Draft brief"
        onChange={(event) => onDraftChange(event.target.value)}
        value={draft}
      />
    </div>
  )
}

export default AiBriefHelper
