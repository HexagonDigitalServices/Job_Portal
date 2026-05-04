function parseCSV(text) {
  if (!text) return [];
  text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const rows = [];
  let insideQuotes = false;
  let cur = "";
  let line = [];

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (ch === '"' && !insideQuotes) {
      insideQuotes = true;
      continue;
    }
    if (ch === '"' && insideQuotes && next === '"') {
      cur += '"';
      i++;
      continue;
    }
    if (ch === '"' && insideQuotes) {
      insideQuotes = false;
      continue;
    }
    if (ch === "," && !insideQuotes) {
      line.push(cur);
      cur = "";
      continue;
    }
    if (ch === "\n" && !insideQuotes) {
      line.push(cur);
      rows.push(line.slice());
      line = [];
      cur = "";
      continue;
    }
    cur += ch;
  }
  if (cur !== "" || line.length > 0) {
    line.push(cur);
    rows.push(line.slice());
  }

  const nonEmpty = rows.filter((r) =>
    r.some((c) => (c || "").toString().trim() !== ""),
  );
  if (nonEmpty.length === 0) return [];

  const headersRaw = nonEmpty[0].map((h) => (h || "").toString().trim());
  const headers = headersRaw.map((h) => h.toLowerCase().replace(/\s+/g, "_"));

  const data = [];
  for (let i = 1; i < nonEmpty.length; i++) {
    const row = nonEmpty[i];
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = row[idx] != null ? row[idx].toString().trim() : "";
    });
    obj.__rawCells = nonEmpty[i];
    data.push(obj);
  }
  return { headersRaw, headers, data };
}

const splitMulti = (cell) =>
  (cell || "")
    .toString()
    .split(/[\n;\|]+/)
    .map((s) => s.trim())
    .filter(Boolean);

function parseCompanyEntry(entry) {
  if (!entry) return { name: "", date: "" };
  const paren = entry.match(/^(.*?)\s*\(\s*([^)]+)\s*\)\s*$/);
  if (paren) return { name: paren[1].trim(), date: paren[2].trim() };
  const hyphen = entry.match(/^(.*?)\s*[-–—]\s*(.+)$/);
  if (hyphen && /\d/.test(hyphen[2]))
    return { name: hyphen[1].trim(), date: hyphen[2].trim() };
  return { name: entry.trim(), date: "" };
}

function uniqueStrings(arr) {
  const s = new Set();
  arr.forEach((x) => {
    if (x && x.toString().trim()) s.add(x.toString().trim());
  });
  return Array.from(s);
}

function uniquePairs(arr) {
  const seen = new Set();
  const out = [];
  arr.forEach((p) => {
    const k = `${(p.name || "").toLowerCase()}||${(p.date || "").toLowerCase()}`;
    if (!seen.has(k)) {
      seen.add(k);
      out.push({ name: p.name || "", date: p.date || "" });
    }
  });
  return out;
}

const findHeaderKey = (headers, variants) => {
  for (const v of variants) {
    const low = v.toLowerCase().replace(/\s+/g, "_");
    const idx = headers.indexOf(low);
    if (idx !== -1) return headers[idx];
  }
  return null;
};


  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [editFormData, setEditFormData] = useState({
    imageFile: null,
    imagePreview: "",
    roleName: "",
    totalQuestions: "",
    csvFile: null,
    csvFileName: "",
    questionsData: null,
  });
  const [deleteRoleId, setDeleteRoleId] = useState(null);
  const [toasts, setToasts] = useState([]);



  const handleCsvChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditFormData((prev) => ({
        ...prev,
        csvFile: file,
        csvFileName: file.name,
      }));

      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const { headers, data } = parseCSV(ev.target.result);
          if (!data || data.length === 0) return;

          const qKey = findHeaderKey(headers, ["question", "q", "prompt"]);
          const aKey = findHeaderKey(headers, ["answer", "ans", "response"]);
          const kpKey = findHeaderKey(headers, [
            "keypoints",
            "key_points",
            "key_point",
          ]);
          const companyKey = findHeaderKey(headers, [
            "company",
            "companies",
            "employer",
          ]);
          const dateKey = findHeaderKey(headers, [
            "date",
            "asked_date",
            "post_date",
          ]);

          const map = new Map();
          data.forEach((rowObj) => {
            const rawQuestion =
              (qKey && rowObj[qKey]) || Object.values(rowObj)[0] || "";
            const question = (rawQuestion || "").toString().trim();
            if (!question) return;

            const answer = (aKey && rowObj[aKey]) || "";
            const keypointsCell = (kpKey && rowObj[kpKey]) || "";
            const companyCell = (companyKey && rowObj[companyKey]) || "";
            const dateCell = (dateKey && rowObj[dateKey]) || "";

            const keypoints = uniqueStrings(splitMulti(keypointsCell));
            let pairs = [];
            const compEntries = splitMulti(companyCell);
            const dateEntries = splitMulti(dateCell);

            if (compEntries.length > 0) {
              const max = Math.max(compEntries.length, dateEntries.length);
              for (let i = 0; i < max; i++) {
                const comp = compEntries[i]
                  ? parseCompanyEntry(compEntries[i]).name
                  : "N/A";
                const dt = dateEntries[i] || dateEntries[0] || "";
                pairs.push({ name: comp, date: dt });
              }
            }

            const key = question.toLowerCase();
            if (!map.has(key)) {
              map.set(key, {
                question,
                answer: answer.toString().trim(),
                keyPoints: keypoints,
                companies: pairs,
              });
            } else {
              const ex = map.get(key);
              ex.keyPoints = uniqueStrings([...ex.keyPoints, ...keypoints]);
              ex.companies = uniquePairs([...ex.companies, ...pairs]);
              map.set(key, ex);
            }
          });

          setEditFormData((prev) => ({
            ...prev,
            questionsData: Array.from(map.values()),
          }));
        } catch (err) {
          console.error("CSV parse error on edit:", err);
        }
      };
      reader.readAsText(file);
    }
  };


      formData.append("roleName", editFormData.roleName);
      formData.append("questionsCount", editFormData.totalQuestions);
      formData.append("csvFileName", editFormData.csvFileName);

      if (editFormData.imageFile) {
        formData.append("imageFile", editFormData.imageFile);
      }

      if (editFormData.csvFile) {
        formData.append("csvFile", editFormData.csvFile);
      }

      if (editFormData.questionsData) {
        formData.append(
          "questionsData",
          JSON.stringify(editFormData.questionsData),
        );
      }
