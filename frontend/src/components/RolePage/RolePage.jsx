const slugify = (str) =>
  str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");

const timeAgo = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};

const initialRole =
  data.roles.find(
    (r) =>
      r._id === roleSlugFromState ||
      slugify(r.roleName) === roleSlugFromState ||
      r._id === roleSlugFromUrl ||
      slugify(r.roleName) === roleSlugFromUrl,
  ) || data.roles[0];

const toggleSave = async (id, openSaved = false) => {
  try {
    const rawUser = localStorage.getItem("jobportal_user");
    const token = rawUser ? JSON.parse(rawUser).token : null;
    if (!token) {
      setToast({
        show: true,
        message: "Please login to save this question.",
        type: "error",
      });
      return;
    }

    const res = await fetch(
      `http://localhost:5000/api/saved/question/${id}?type=role`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const data = await res.json();

    if (data.success) {
      const ns = `role:${id}`;
      setSavedIds((prev) => {
        const next = prev.includes(ns)
          ? prev.filter((x) => x !== ns)
          : [...prev, ns];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });

      if (openSaved) {
        navigate("/saved", {
          state: { filterType: "role", id: selectedRoleId, focusRaw: ns },
        });
      }
    } else {
      setToast({
        show: true,
        message: data.message || "Failed to save question.",
        type: "error",
      });
    }
  } catch (error) {
    console.error("Error saving question:", error);
    setToast({
      show: true,
      message: "An error occurred while saving.",
      type: "error",
    });
  }
};

{
  loadingQuestions ? (
    <div className={s.questionsSkeletonGrid}>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className={s.questionSkeleton} />
      ))}
    </div>
  ) : questions.length === 0 ? (
    <div className={s.emptyState}>
      <Briefcase className={s.emptyStateIcon} />
      <p className={s.emptyStateText}>No questions yet for this role.</p>
    </div>
  ) : (
    <div className={s.questionsGrid}>
      {questions.map((q, index) => {
        const isSaved = savedIds.includes(`role:${q._id}`);

        return (
          <div key={q._id} className={s.questionCard}>
            {/* Save Button */}
            <button
              onClick={() => toggleSave(q._id)}
              className={`${s.saveButton} ${isSaved ? s.saveButtonActive : s.saveButtonInactive}`}
              title={isSaved ? "Unsave" : "Save"}
            >
              <Bookmark className={s.saveIcon} />
            </button>

            {/* Question */}
            <h3 className={s.questionTitle}>
              {index + 1}. {q.question.replace(/^\d+\.\s*/, "")}
            </h3>

            {/* Answer */}
            <div className={s.answerSection}>
              <span className={s.answerLabel}>Answer: </span>
              {q.answer}
            </div>

            {/* Key Points */}
            {q.keyPoints && q.keyPoints.length > 0 && (
              <div className={s.keyPointsSection}>
                <div className={s.keyPointsLabel}>KEY POINTS</div>
                <div className={s.keyPointsWrapper}>
                  {q.keyPoints.map((point, idx) => (
                    <span key={idx} className={s.keyPointTag}>
                      <CheckCircle2 className={s.keyPointIcon} />
                      {point}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* ASKED AT SECTION */}
            <div className={s.askedAtSection}>
              <div className={s.askedAtLabel}>
                <Building2 className={s.askedAtIcon} />
                Asked in
              </div>

              <div className={s.companiesWrapper}>
                {Array.isArray(q.askedBy) && q.askedBy.length > 0 ? (
                  q.askedBy.map((item, idx) => {
                    const name = item?.companyName || "Unknown";
                    const date = item?.dateAsked;

                    return (
                      <div key={idx} className={s.companyTag}>
                        <span className={s.companyName}>{name}</span>

                        {date && (
                          <>
                            <Dot className={s.companyDot} />
                            <span className={s.companyDate}>
                              {date.includes("-") || date.includes("/")
                                ? timeAgo(date)
                                : date}
                            </span>
                          </>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <span className={s.noCompanyData}>No company data</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
