import DashboardHeader from '../../components/dashboard/DashboardHeader'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { useUiStore } from '../../store/uiStore'

function UmkmSettingsPage() {
  const addToast = useUiStore((state) => state.addToast)

  const handleSubmit = (event) => {
    event.preventDefault()
    addToast('Pengaturan berhasil diperbarui')
  }

  return (
    <>
      <DashboardHeader description="Pengaturan dasar akun UMKM." title="Pengaturan Akun" />
      <form className="ruk-surface p-4" onSubmit={handleSubmit}>
        <Input id="settings-name" label="Nama" defaultValue="Fadhol" />
        <Input id="settings-email" label="Email" defaultValue="fadhol@example.com" type="email" />
        <Button type="submit">Simpan pengaturan</Button>
      </form>
    </>
  )
}

export default UmkmSettingsPage
