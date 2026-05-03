const parseCountString = (str) => {
  if (!str) return NaN;
  const trimmed = str.trim().toLowerCase().replace(/,/g, "");
  const match = trimmed.match(/^(\d+(?:\.\d+)?)(k)?\+?$/);
  if (!match) return NaN;
  const num = parseFloat(match[1]);
  const isK = match[2] === "k";
  return isK ? num * 1000 : num;
};

const formatCountShort = (n) => {
  const num = Number(n) || 0;
  if (num >= 1000) {
    const k = num / 1000;
    if (num % 1000 === 0) return `${k}k`;
    return `${parseFloat(k.toFixed(1)).toString()}k+`;
  }
  return String(num);
};

const formatDatePretty = (dateInput) => {
  if (!dateInput) return "";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return dateInput;
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const parseCSVText = (text) => {
  const rows = [];
  let i = 0;
  const len = text.length;
  let cur = "";
  let row = [];
  let inQuotes = false;

  while (i < len) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < len && text[i + 1] === '"') {
          cur += '"';
          i += 2;
          continue;
        } else {
          inQuotes = false;
          i++;
          continue;
        }
      } else {
        cur += ch;
        i++;
        continue;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
        i++;
        continue;
      }

      if (ch === ",") {
        row.push(cur);
        cur = "";
        i++;
        continue;
      }

      if (ch === "\r") {
        if (i + 1 < len && text[i + 1] === "\n") i++;
        row.push(cur);
        rows.push(row);
        row = [];
        cur = "";
        i++;
        continue;
      }

      if (ch === "\n") {
        row.push(cur);
        rows.push(row);
        row = [];
        cur = "";
        i++;
        continue;
      }

      cur += ch;
      i++;
      continue;
    }
  }

  if (inQuotes) {
    row.push(cur);
    rows.push(row);
  } else {
    if (cur !== "" || row.length > 0) {
      row.push(cur);
      rows.push(row);
    }
  }

  return rows.map((r) => r.map((cell) => (cell == null ? "" : cell.trim())));
};


  const [companyName, setCompanyName] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [questionsCount, setQuestionsCount] = useState("");
  const [csvFile, setCsvFile] = useState(null);
  const [parsedQuestions, setParsedQuestions] = useState([]);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleCsvChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCsvFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const rows = parseCSVText(text);
      if (!rows || rows.length === 0) {
        setParsedQuestions([]);
        return;
      }

      const headers = rows[0].map((h) => (h || "").toString().toLowerCase());
      const questionIdx = headers.findIndex((h) => h.includes("question"));
      const answerIdx = headers.findIndex((h) => h.includes("answer"));
      const keyPointsIdx =
        headers.findIndex((h) => h.includes("key")) >= 0
          ? headers.findIndex((h) => h.includes("key"))
          : headers.findIndex((h) => h.includes("keypoints"));
      const postDateIdx =
        headers.findIndex((h) => h.includes("postdate")) >= 0
          ? headers.findIndex((h) => h.includes("postdate"))
          : headers.findIndex((h) => h.includes("date")) >= 0
            ? headers.findIndex((h) => h.includes("date"))
            : headers.findIndex((h) => h.includes("posted"));

      const fallbackQuestionIdx = questionIdx >= 0 ? questionIdx : 0;
      const fallbackAnswerIdx =
        answerIdx >= 0 ? answerIdx : fallbackQuestionIdx === 0 ? 1 : 0;
      const fallbackKeyPointsIdx =
        keyPointsIdx >= 0
          ? keyPointsIdx
          : Math.max(0, Math.min(rows[0].length - 1, fallbackAnswerIdx + 1));

      const defaultDate = file.lastModified
        ? new Date(file.lastModified)
        : new Date();

      const questions = [];
      for (let i = 1; i < rows.length; i++) {
        const values = rows[i];
        if (!values.some((v) => (v || "").toString().trim() !== "")) continue;

        const question =
          values[questionIdx] ?? values[fallbackQuestionIdx] ?? "";
        const answer = values[answerIdx] ?? values[fallbackAnswerIdx] ?? "";
        const keyRaw =
          values[keyPointsIdx] ?? values[fallbackKeyPointsIdx] ?? "";
        const postRaw =
          (postDateIdx >= 0 ? values[postDateIdx] : undefined) ?? "";

        let finalPostDate = postRaw.split(/[;|\n]/)[0]?.trim();
        const postDateValue = finalPostDate
          ? finalPostDate
          : defaultDate.toISOString();

        const keyPoints = (keyRaw || "")
          .split(/(?:;|\||\r?\n)+/)
          .map((k) => k.trim())
          .filter((k) => k !== "");

        questions.push({
          question: question || "",
          answer: answer || "",
          keyPoints,
          postDate: postDateValue,
        });
      }

      setParsedQuestions(questions);
    };
    reader.readAsText(file);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!companyName.trim()) newErrors.companyName = "Company name is required";

    const parsedCount = parseCountString(questionsCount);
    if (!questionsCount.trim() || isNaN(parsedCount) || parsedCount <= 0)
      newErrors.questionsCount =
        "Enter a valid number of questions (e.g., 1600, 10k+)";

    if (!csvFile) newErrors.csvFile = "CSV file is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


        formDataToSend.append("companyName", companyName);
        formDataToSend.append("questionsCount", questionsCount);
        if (logoFile) {
          formDataToSend.append("logoFile", logoFile);
        }
        if (csvFile) {
          formDataToSend.append("csvFile", csvFile);
          formDataToSend.append("csvFileName", csvFile.name);
        }
        formDataToSend.append("questionsData", JSON.stringify(parsedQuestions));

        

  

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }

        @keyframes cardFadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-card {
          animation: cardFadeIn 0.4s ease-out forwards;
          opacity: 0;
        }
      `}</style>
 