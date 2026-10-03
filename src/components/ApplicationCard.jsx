import { stages, today } from "../lib/applications";
export default function ApplicationCard({
  application,
  onEdit,
  onStage,
  onDelete,
}) {
  const due =
    application.followUp &&
    application.followUp <= today() &&
    !["Offer", "Closed"].includes(application.stage);
  return (
    <article className="application-card">
      <div className="company-row">
        <span className="company-initial" aria-hidden="true">
          {application.company.slice(0, 2).toUpperCase()}
        </span>
        <span>{application.company}</span>
      </div>
      <h3>{application.role}</h3>
      <p className="application-date">Added {application.date}</p>
      {application.followUp && (
        <p className={`followup ${due ? "due" : ""}`}>
          ◷ {due ? "Follow-up due" : "Follow up"} · {application.followUp}
        </p>
      )}
      {application.notes && (
        <p className="application-notes">{application.notes}</p>
      )}
      {application.url && (
        <a
          className="job-link"
          href={application.url}
          target="_blank"
          rel="noreferrer"
        >
          Open job listing ↗
        </a>
      )}
      <label className="sr-only" htmlFor={"stage-" + application.id}>
        Stage for {application.company}
      </label>
      <select
        id={"stage-" + application.id}
        value={application.stage}
        onChange={(e) => onStage(e.target.value)}
      >
        {stages.map((stage) => (
          <option key={stage}>{stage}</option>
        ))}
      </select>
      <div className="card-actions">
        <button
          className="text-button"
          aria-label={`Edit ${application.company}`}
          onClick={onEdit}
        >
          Edit details
        </button>
        <button
          className="text-button danger-text"
          aria-label={`Delete ${application.company}`}
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </article>
  );
}
