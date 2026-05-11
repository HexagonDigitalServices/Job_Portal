  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loading, setLoading] = useState(false);
  const [animateCard, setAnimateCard] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [selectedCompanyData, setSelectedCompanyData] = useState(null);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const [savedIds, setSavedIds] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const VISIBLE_COUNT = 10;



          const fromState = location?.state?.companyId;
          const fromParam = params?.companyId;
          const initialCompany =
            fromState ||
            fromParam ||
            (response.data.companies.length > 0
              ? response.data.companies[0]._id
              : null);
          if (initialCompany && !selectedCompany) {
            setSelectedCompany(initialCompany);
          }
      
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
        `http://localhost:5000/api/saved/question/${id}?type=interview`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await res.json();

      if (data.success) {
        const ns = `company:${id}`;
        setSavedIds((prev) => {
          const next = prev.includes(ns)
            ? prev.filter((x) => x !== ns)
            : [...prev, ns];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          return next;
        });

        if (openSaved) {
          navigate("/saved", {
            state: {
              filterType: "company",
              id: selectedCompany,
              focusRaw: `company:${id}`,
            },
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

  useEffect(() => {
    const handler = (e) => {
      if (e.key === STORAGE_KEY) {
        try {
          setSavedIds(e.newValue ? JSON.parse(e.newValue) : []);
        } catch {
          setSavedIds([]);
        }
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const filteredAndSortedQuestions = interviewQuestions;

  const questionsToShow = showAllQuestions
    ? filteredAndSortedQuestions
    : filteredAndSortedQuestions.slice(0, VISIBLE_COUNT);

 
        {loading ? (
          <div className={s.skeletonGrid}>
            {[1, 2].map((i) => (
              <div key={i} className={s.skeletonCard}>
                <div className={s.skeletonLine1}></div>
                <div className={s.skeletonLine2}></div>
                <div className={s.skeletonLine3}></div>
              </div>
            ))}
          </div>
        ) : filteredAndSortedQuestions.length === 0 ? (
          <div className={s.emptyState}>
            <h3 className={s.emptyStateTitle}>No questions found</h3>
            <p className={s.emptyStateText}>
              Try selecting a different company
            </p>
          </div>
        ) : (
          <>
            <div className={s.questionsGrid}>
              {questionsToShow.map((question, index) => {
                const isSaved = savedIds.includes(`company:${question._id}`);
                const main = question.answer;
                const points = question.keyPoints || [];

                return (
                  <div
                    key={question._id}
                    className={s.questionCard}
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    <button
                      onClick={() => toggleSave(question._id)}
                      className={`${s.saveButton} ${isSaved ? s.saveButtonSaved : s.saveButtonUnsaved}`}
                      aria-label={isSaved ? "Unsave question" : "Save question"}
                    >
                      <Bookmark className={s.saveIcon} />
                    </button>
                    <div className={s.cardContent}>
                      <div className={s.cardHeader}>
                        <div className={s.cardHeaderContent}>
                          <div className={s.dateWrapper}>
                            <span className={s.date}>
                              <Calendar className={s.dateIcon} />
                              {question.postDate
                                ? new Date(
                                    question.postDate,
                                  ).toLocaleDateString()
                                : ""}
                            </span>
                          </div>

                          <h3 className={s.questionTitle}>
                            {index + 1}.{" "}
                            {question.question.replace(/^\d+\.\s*/, "")}
                          </h3>
                        </div>
                      </div>

                      <div className={s.answerSection}>
                        <div className={s.answerHeader}>
                          <Lightbulb className={s.answerIcon} />
                          <h4 className={s.answerTitle}>Recommended Answer</h4>
                        </div>

                        {main && <p className={s.answerText}>{main}</p>}

                        {points && points.length > 0 && (
                          <ul className={s.pointsList}>
                            {points.map((pt, i) => (
                              <li key={i} className={s.pointItem}>
                                <CircleDashed className={s.pointIcon} />
                                <span className={s.pointText}>{pt}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredAndSortedQuestions.length > VISIBLE_COUNT && (
              <div className={s.showMoreWrapper}>
                <button
                  onClick={() => setShowAllQuestions((show) => !show)}
                  className={s.showMoreButton}
                >
                  {showAllQuestions ? (
                    <>
                      <ChevronUp className={s.showMoreIcon} /> Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className={s.showMoreIcon} /> Show All{" "}
                      {filteredAndSortedQuestions.length} Questions
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
   
