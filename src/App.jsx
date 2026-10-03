import { useState } from "react";
import Shell from "./components/Shell";
import Dialog from "./components/Dialog";
import ApplicationForm from "./components/ApplicationForm";
import ApplicationCard from "./components/ApplicationCard";
import useSavedState from "./hooks/useSavedState";
import { stages, today, validApplications } from "./lib/applications";
export default function App() {
  const [applications, saveApplications, storageError] = useSavedState(
    "applytrack.applications.v1",
    [],
    validApplications,
  );
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [dueOnly, setDueOnly] = useState(false);
  const [notice, setNotice] = useState("");
  const isDue = (item) =>
    item.followUp &&
    item.followUp <= today() &&
    !["Offer", "Closed"].includes(item.stage);
  const visible = applications.filter(
    (item) =>
      (filter === "All" || item.stage === filter) &&
      (!dueOnly || isDue(item)) &&
      `${item.company} ${item.role} ${item.notes}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  function save(fields) {
    saveApplications(
      editing.id
        ? applications.map((item) =>
            item.id === editing.id ? { ...item, ...fields } : item,
          )
        : [...applications, { ...fields, id: crypto.randomUUID() }],
    );
    setEditing(null);
    setNotice("Application saved.");
  }
  function samples() {
    saveApplications([
      {
        id: "sample-1",
        company: "Demo North Studio",
        role: "Frontend Intern",
        stage: "Saved",
        date: today(),
        followUp: "",
        url: "https://example.com",
        notes: "Fictional example: review the role requirements.",
      },
      {
        id: "sample-2",
        company: "Demo Green Labs",
        role: "Junior Web Developer",
        stage: "Applied",
        date: today(),
        followUp: today(),
        url: "",
        notes: "Fictional example: prepare a short project walkthrough.",
      },
      {
        id: "sample-3",
        company: "Demo Bright Collective",
        role: "Volunteer Developer",
        stage: "Interview",
        date: today(),
        followUp: "",
        url: "",
        notes: "Fictional example: explain a recent bug fix.",
      },
    ]);
    setNotice("Fictional examples loaded.");
  }
  return (
    <Shell section="Application pipeline">
      <section className="heading">
        <div>
          <p className="eyebrow">YOUR NEXT CHAPTER, ONE STEP AT A TIME</p>
          <h1>Keep opportunity in view.</h1>
          <p className="subtitle">
            A calm place for applications, follow-ups, and the next
            conversation.
          </p>
        </div>
        <button className="primary" onClick={() => setEditing({})}>
          ＋ Add application
        </button>
      </section>
      <section className="stats">
        <div className="stat">
          <span>Total opportunities</span>
          <strong>{applications.length.toString().padStart(2, "0")}</strong>
          <small>Every possibility in one place</small>
        </div>
        <div className="stat">
          <span>In conversation</span>
          <strong>
            {applications
              .filter((item) => item.stage === "Interview")
              .length.toString()
              .padStart(2, "0")}
          </strong>
          <small>Applications at interview stage</small>
        </div>
        <div className="stat accent">
          <span>Follow-ups due</span>
          <strong>
            {applications.filter(isDue).length.toString().padStart(2, "0")}
          </strong>
          <small>Based on the dates you set</small>
        </div>
      </section>
      <div className="toolbar">
        <h2>
          Your pipeline <span className="count">{visible.length}</span>
        </h2>
        <div className="actions">
          <input
            className="control search"
            aria-label="Search applications"
            type="search"
            placeholder="Search a company or role…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            className="control"
            aria-label="Filter stage"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option>All</option>
            {stages.map((stage) => (
              <option key={stage}>{stage}</option>
            ))}
          </select>
          <button
            className={`secondary ${dueOnly ? "active-filter" : ""}`}
            aria-pressed={dueOnly}
            onClick={() => setDueOnly(!dueOnly)}
          >
            Follow-ups due
          </button>
        </div>
      </div>
      <p className="sr-only" role="status">
        {notice}
      </p>
      {storageError && (
        <p role="alert" className="error">
          {storageError}
        </p>
      )}
      {!applications.length ? (
        <div className="empty">
          <span>↗</span>
          <h2>Your next chapter starts here.</h2>
          <p>
            Add an opportunity, or explore a fictional application pipeline.
          </p>
          <button className="secondary" onClick={samples}>
            Load sample applications
          </button>
        </div>
      ) : (
        <>
          <div className="board">
            {stages
              .filter((stage) => filter === "All" || stage === filter)
              .map((stage, index) => (
                <section className={"column stage-" + index} key={stage}>
                  <div className="column-heading">
                    <h3>
                      <i />
                      {stage}
                    </h3>
                    <span>
                      {visible.filter((item) => item.stage === stage).length}
                    </span>
                  </div>
                  {visible
                    .filter((item) => item.stage === stage)
                    .map((item) => (
                      <ApplicationCard
                        key={item.id}
                        application={item}
                        onEdit={() => setEditing(item)}
                        onDelete={() => setDeleting(item)}
                        onStage={(next) => {
                          saveApplications(
                            applications.map((record) =>
                              record.id === item.id
                                ? { ...record, stage: next }
                                : record,
                            ),
                          );
                          setNotice(`${item.company} moved to ${next}.`);
                        }}
                      />
                    ))}
                  {!visible.some((item) => item.stage === stage) && (
                    <p className="column-empty">No applications here yet.</p>
                  )}
                </section>
              ))}
          </div>
          {!visible.length && (
            <p className="notice" role="status">
              No applications match your filters.
            </p>
          )}
        </>
      )}
      <p className="privacy-note">
        Stored in this browser. Sample companies are fictional; this is a
        portfolio learning tool.
      </p>
      {editing && (
        <Dialog
          title={editing.id ? "Edit application" : "Add an opportunity"}
          onClose={() => setEditing(null)}
        >
          <ApplicationForm
            application={editing}
            onSave={save}
            onCancel={() => setEditing(null)}
          />
        </Dialog>
      )}
      {deleting && (
        <Dialog title="Delete application?" onClose={() => setDeleting(null)}>
          <p>Remove the record for {deleting.company}?</p>
          <div className="form-actions">
            <button className="secondary" onClick={() => setDeleting(null)}>
              Keep application
            </button>
            <button
              className="danger"
              onClick={() => {
                saveApplications(
                  applications.filter((item) => item.id !== deleting.id),
                );
                setDeleting(null);
                setNotice("Application deleted.");
              }}
            >
              Delete application
            </button>
          </div>
        </Dialog>
      )}
    </Shell>
  );
}
