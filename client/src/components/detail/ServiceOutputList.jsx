function ServiceOutputList({ outputs }) {
  return (
    <section className="py-0">
      <h2 className="h4 fw-bold mb-3">Yang kamu dapatkan</h2>
      <div className="ruk-grid ruk-grid-2">
        {outputs.map((output) => (
          <div className="ruk-surface p-3" key={output}>
            <span aria-hidden="true" className="text-success fw-bold">✓ </span>
            {output}
          </div>
        ))}
      </div>
    </section>
  )
}

export default ServiceOutputList
