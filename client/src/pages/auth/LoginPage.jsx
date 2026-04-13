import LoginForm from '../../components/forms/LoginForm'

function LoginPage() {
  return (
    <div className="row justify-content-center">
      <div className="col-md-7 col-lg-5">
        <div className="ruk-surface p-4">
          <h1 className="fw-bold">Masuk</h1>
          <p className="ruk-muted">Lanjutkan mengelola profil, brief, dan permintaan kerja sama.</p>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}

export default LoginPage
