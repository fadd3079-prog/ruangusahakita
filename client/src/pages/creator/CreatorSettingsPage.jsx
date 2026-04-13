import DashboardHeader from '../../components/dashboard/DashboardHeader'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { useUiStore } from '../../store/uiStore'

function CreatorSettingsPage() {
  const addToast = useUiStore((state) => state.addToast)

  const handleSubmit = (event) => {
    event.preventDefault()
    addToast('Pengaturan berhasil diperbarui')
  }

  return (
    <>
      <DashboardHeader description="Pengaturan dasar akun kreator." title="Pengaturan Akun" />
      <form className="ruk-surface p-4" onSubmit={handleSubmit}>
        <Input id="creator-settings-name" label="Nama" defaultValue="Nadia Konten Kuliner" />
        <Input id="creator-settings-email" label="Email" defaultValue="nadia@example.com" type="email" />
        <Button type="submit">Simpan pengaturan</Button>
      </form>
    </>
  )
}

export default CreatorSettingsPage
