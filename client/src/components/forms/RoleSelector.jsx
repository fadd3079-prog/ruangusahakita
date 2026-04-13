import { useNavigate } from 'react-router-dom'
import { ROLE_OPTIONS } from '../../constants/roles'
import { ROUTES } from '../../constants/routes'
import { useAuthStore } from '../../store/authStore'
import Button from '../ui/Button'
import Card from '../ui/Card'

function RoleSelector() {
  const navigate = useNavigate()
  const setRole = useAuthStore((state) => state.setRole)

  const chooseRole = (role) => {
    setRole(role)
    navigate(role === 'creator' ? ROUTES.creatorProfile : ROUTES.umkmProfile)
  }

  return (
    <div className="ruk-grid ruk-grid-2">
      {ROLE_OPTIONS.map((role) => (
        <Card key={role.value}>
          <h2 className="h4 fw-bold">{role.title}</h2>
          <p>{role.description}</p>
          <p className="ruk-muted">{role.benefit}</p>
          <Button onClick={() => chooseRole(role.value)}>Pilih {role.title}</Button>
        </Card>
      ))}
    </div>
  )
}

export default RoleSelector
