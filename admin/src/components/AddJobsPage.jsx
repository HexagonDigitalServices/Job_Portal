// Animated input field component
const AnimatedField = ({
  icon: Icon,
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  required,
  children,
  disabled,
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className={s.fieldContainer}>
      {label && (
        <label className={s.fieldLabel}>
          {label} {required && <span className={s.requiredStar}>*</span>}
        </label>
      )}
      <div
        className={`${s.fieldWrapper} ${focused ? s.fieldFocusedScale : ""}`}
      >
        <div className={s.fieldGlow} />
        <div
          className={`${s.fieldInner} ${
            error
              ? s.fieldInnerError
              : focused
                ? s.fieldInnerFocused
                : s.fieldInnerDefault
          }`}
        >
          <span className={s.fieldIconSpan}>
            {Icon && (
              <Icon
                size={18}
                className={`transition-colors duration-300 ${
                  focused ? s.fieldIconFocused : ""
                }`}
              />
            )}
          </span>
          <div className={s.fieldInputWrapper}>
            {type === "select" ? (
              <select
                name={name}
                value={value}
                onChange={onChange}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className={s.selectInput}
              >
                {children}
              </select>
            ) : type === "textarea" ? (
              <textarea
                name={name}
                value={value}
                onChange={onChange}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                rows={4}
                className={s.textareaInput}
                placeholder={placeholder}
              />
            ) : (
              <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className={s.inputBase}
                placeholder={placeholder}
                disabled={disabled}
              />
            )}
          </div>
          {required && <span className={s.requiredSpan}>*</span>}
        </div>
      </div>
      {error && <p className={s.errorText}>{error}</p>}
    </div>
  );
};

// Image Upload Component
const ImageUpload = ({ image, setImage, error }) => {
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const prevUrlRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (prevUrlRef.current) {
      URL.revokeObjectURL(prevUrlRef.current);
      prevUrlRef.current = null;
    }
    if (image) {
      const url = URL.createObjectURL(image);
      setPreview(url);
      prevUrlRef.current = url;
    } else {
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = null;
    }
    return () => {
      if (prevUrlRef.current) {
        URL.revokeObjectURL(prevUrlRef.current);
        prevUrlRef.current = null;
      }
    };
  }, [image]);

  const handleFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      setImage(file);
    }
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const removeImage = () => {
    setImage(null);
  };

  return (
    <div className={s.uploadContainer}>
      <label className={s.uploadLabel}>
        <ImageIcon size={16} className={s.uploadIcon} /> Company Logo{" "}
        <span className={s.uploadRequired}>*</span>
      </label>
      <div
        className={`${s.uploadDropzone} ${
          dragActive
            ? s.uploadDropzoneActive
            : error
              ? s.uploadDropzoneError
              : preview
                ? s.uploadDropzonePreview
                : s.uploadDropzoneDefault
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {preview ? (
          <div className={s.previewContainer}>
            <img src={preview} alt="Preview" className={s.previewImage} />
            <button
              type="button"
              onClick={removeImage}
              className={s.removeImageBtn}
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className={s.uploadPlaceholder}>
            <Upload className={s.uploadIconLarge} />
            <p className={s.uploadText}>
              Drag & drop an image here, or{" "}
              <label className={s.browseLabel}>
                Browse
                <input
                  ref={fileInputRef}
                  type="file"
                  className={s.fileInputHidden}
                  accept="image/*"
                  onChange={handleChange}
                />
              </label>
            </p>
          </div>
        )}
      </div>
      {error && <p className={s.errorText}>{error}</p>}
    </div>
  );
};

const initialFormState = {
  image: null,
  roleName: "",
  companyName: "",
  techStack: [""],
  location: "",
  experience: "",
  salary: { amount: "", period: "month" },
  jobType: "full-time",
  postDate: getTodayDate(),
  category: "",
  overview: "",
  openings: 1,
  responsibilities: [""],
  jobCriteria: [""],
  education: [""],
};

const categories = [
  "Engineering",
  "IT",
  "Data Science",
  "Design",
  "Product",
  "Marketing",
  "Sales",
  "Finance",
];



  const validateForm = () => {
    const newErrors = {};
    if (!formData.image) newErrors.image = "Company logo is required";
    if (!formData.roleName) newErrors.roleName = "Role name is required";
    if (!formData.companyName)
      newErrors.companyName = "Company name is required";
    if (!formData.techStack.some((item) => item.trim()))
      newErrors.techStack = "At least one tech stack is required";
    if (!formData.location || !formData.location.trim())
      newErrors.location = "Location is required";
    if (!formData.experience) newErrors.experience = "Experience is required";
    if (!formData.salary.amount) newErrors.salary = "Salary amount is required";
    if (!formData.postDate) newErrors.postDate = "Post date is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.overview) newErrors.overview = "Overview is required";
    if (!formData.openings)
      newErrors.openings = "Number of openings is required";
    if (!formData.responsibilities.some((item) => item.trim()))
      newErrors.responsibilities = "At least one responsibility is required";
    if (!formData.jobCriteria.some((item) => item.trim()))
      newErrors.jobCriteria = "At least one job criteria is required";
    if (!formData.education.some((item) => item.trim()))
      newErrors.education = "At least one education requirement is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


        formDataToSend.append("roleName", formData.roleName);
        formDataToSend.append("companyName", formData.companyName);
        formDataToSend.append("location", formData.location);
        formDataToSend.append("experience", formData.experience);
        formDataToSend.append("salary", formData.salary.amount);
        formDataToSend.append("salaryType", formData.salary.period);
        formDataToSend.append("jobType", formData.jobType);
        formDataToSend.append("postDate", formData.postDate);
        formDataToSend.append("category", formData.category);
        formDataToSend.append("openings", formData.openings);
        formDataToSend.append("overview", formData.overview);

        formDataToSend.append(
          "techStack",
          JSON.stringify(
            formData.techStack.filter((item) => item.trim() !== ""),
          ),
        );
        formDataToSend.append(
          "responsibilities",
          JSON.stringify(
            formData.responsibilities.filter((item) => item.trim() !== ""),
          ),
        );
        formDataToSend.append(
          "jobCriteria",
          JSON.stringify(
            formData.jobCriteria.filter((item) => item.trim() !== ""),
          ),
        );
        formDataToSend.append(
          "education",
          JSON.stringify(
            formData.education.filter((item) => item.trim() !== ""),
          ),
        );

        if (formData.image) {
          formDataToSend.append("companyLogo", formData.image);
        }

    

 

        
                  
                     <div className={s.salaryContainer}>
              <label className={s.salaryLabel}>
                Salary <span className={s.uploadRequired}>*</span>
              </label>
              <div className={s.salaryInputWrapper}>
                <div
                  className={`${s.salaryInputGroup} ${
                    errors.salary
                      ? s.salaryInputGroupError
                      : formData.salary.amount
                        ? s.salaryInputGroupFilled
                        : s.salaryInputGroupDefault
                  }`}
                >
                  <span className={s.salaryIconSpan}>
                    <DollarSign
                      size={18}
                      className={
                        formData.salary.amount ? s.salaryIconFilled : ""
                      }
                    />
                  </span>
                  <input
                    type="number"
                    value={formData.salary.amount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        salary: { ...formData.salary, amount: e.target.value },
                      })
                    }
                    className={s.salaryAmountInput}
                    placeholder="80000"
                  />
                  <select
                    value={formData.salary.period}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        salary: { ...formData.salary, period: e.target.value },
                      })
                    }
                    className={s.salaryPeriodSelect}
                  >
                    <option value="hour">/ hour</option>
                    <option value="day">/ day</option>
                    <option value="week">/ week</option>
                    <option value="month">/ month</option>
                    <option value="year">/ year</option>
                  </select>
                </div>
                {errors.salary && (
                  <p className={s.errorText}>{errors.salary}</p>
                )}
              </div>
            </div>
                 


              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>


               {/* Responsibilities */}
          <div className={s.arraySection}>
            <label className={s.arrayLabel}>
              <ListChecks size={16} className={s.uploadIcon} /> Responsibilities{" "}
              <span className={s.uploadRequired}>*</span>
            </label>
            {formData.responsibilities.map((resp, index) => (
              <div key={index} className={s.arrayItemRow}>
                <input
                  type="text"
                  value={resp}
                  onChange={(e) =>
                    handleArrayChange("responsibilities", index, e.target.value)
                  }
                  className={`${s.arrayInput} ${
                    errors.responsibilities && !resp.trim()
                      ? s.arrayInputError
                      : s.arrayInputDefault
                  }`}
                  placeholder="Develop new features..."
                />
                {formData.responsibilities.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayField("responsibilities", index)}
                    className={s.removeBtn}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField("responsibilities")}
              className={s.addBtn}
            >
              <Plus size={14} /> Add another responsibility
            </button>
            {errors.responsibilities && (
              <p className={s.errorText}>{errors.responsibilities}</p>
            )}
          </div>

          {/* Job Criteria */}
          <div className={s.arraySection}>
            <label className={s.arrayLabel}>
              <ListChecks size={16} className={s.uploadIcon} /> Job Criteria{" "}
              <span className={s.uploadRequired}>*</span>
            </label>
            {formData.jobCriteria.map((crit, index) => (
              <div key={index} className={s.arrayItemRow}>
                <input
                  type="text"
                  value={crit}
                  onChange={(e) =>
                    handleArrayChange("jobCriteria", index, e.target.value)
                  }
                  className={`${s.arrayInput} ${
                    errors.jobCriteria && !crit.trim()
                      ? s.arrayInputError
                      : s.arrayInputDefault
                  }`}
                  placeholder="5+ years experience..."
                />
                {formData.jobCriteria.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayField("jobCriteria", index)}
                    className={s.removeBtn}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField("jobCriteria")}
              className={s.addBtn}
            >
              <Plus size={14} /> Add another criterion
            </button>
            {errors.jobCriteria && (
              <p className={s.errorText}>{errors.jobCriteria}</p>
            )}
          </div>

          {/* Education */}
          <div className={s.arraySection}>
            <label className={s.arrayLabel}>
              <GraduationCap size={16} className={s.uploadIcon} /> Education{" "}
              <span className={s.uploadRequired}>*</span>
            </label>
            {formData.education.map((edu, index) => (
              <div key={index} className={s.arrayItemRow}>
                <input
                  type="text"
                  value={edu}
                  onChange={(e) =>
                    handleArrayChange("education", index, e.target.value)
                  }
                  className={`${s.arrayInput} ${
                    errors.education && !edu.trim()
                      ? s.arrayInputError
                      : s.arrayInputDefault
                  }`}
                  placeholder="Bachelor's in Computer Science"
                />
                {formData.education.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayField("education", index)}
                    className={s.removeBtn}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField("education")}
              className={s.addBtn}
            >
              <Plus size={14} /> Add another education requirement
            </button>
            {errors.education && (
              <p className={s.errorText}>{errors.education}</p>
            )}
          </div>
          
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%) translateY(-10px);
            opacity: 0;
          }
          to {
            transform: translateX(0) translateY(0);
            opacity: 1;
          }
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-2px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(2px);
          }
        }
        .animate-slide-in {
          animation: slideIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
 
