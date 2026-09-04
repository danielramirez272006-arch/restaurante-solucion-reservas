function EmptyState({ title = 'Sin resultados', description }) { return <div className="state-panel"><h3>{title}</h3>{description && <p>{description}</p>}</div> }
export default EmptyState