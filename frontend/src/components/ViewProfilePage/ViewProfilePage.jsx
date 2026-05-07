 const validate = () => {
    if (!profile.name.trim()) return "Name is required";
    if (!profile.email.trim()) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(profile.email)) return "Email is invalid";
    if (!profile.phone) return "Phone is required";
    if (!/^\d{10}$/.test(profile.phone))
      return "Phone must be exactly 10 digits";

    return null;
  };

  const handleSave = async () => {
    const error = validate();
    if (error) {
      setToast({ message: error, type: "error" });
      return;
    }

    try {
      setIsSaving(true);
      const user = JSON.parse(localStorage.getItem("jobportal_user"));
      const formData = new FormData();
      formData.append("name", profile.name);
      formData.append("email", profile.email);
      formData.append("phone", profile.phone);

      if (profile.resume instanceof File) {
        formData.append("resume", profile.resume);
      }
      const res = await fetch("http://localhost:5000/api/user/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });
      const data = await res.json();
      setProfile({
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
        resume: data.user.resume,
      });
      setOriginalProfile(data.user);
      setIsEditing(false);
      setToast({ message: "profile updated!", type: "success" });
    } catch (err) {
      setToast({ message: "Update failed", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setProfile(originalProfile);
    setIsEditing(false);
  };

  const getFileName = (resume) => {
    if (!resume) return "";
    if (resume instanceof File) return resume.name;
    if (typeof resume === "string") {
      return (
        resume.split("/").pop().split("-").slice(1).join("-") ||
        resume.split("/").pop()
      );
    }
    return "Resume";
  };

  const handleViewResume = () => {
    if (!profile.resume) return;

    if (profile.resume instanceof File) {
      const url = URL.createObjectURL(profile.resume);
      window.open(url, "_blank");
    } else if (typeof profile.resume === "string") {
      const fullUrl = `http://localhost:5000/api/user/resume/${originalProfile._id}`;

      const link = document.createElement("a");
      link.href = fullUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

            {/* Resume */}
            <div className={s.resumeSection}>
              <label className={s.fieldLabel}>
                <FileText className={s.fieldIcon} />
                Resume (PDF or Word)
              </label>
              {isEditing ? (
                <div className={s.resumeUploadWrapper}>
                  <div className={s.resumeUploadRow}>
                    <label className={s.resumeUploadLabel}>
                      <div className={s.resumeUploadBox}>
                        <Upload className={s.resumeUploadIcon} />
                        <span className={s.resumeFileName}>
                          {profile.resume
                            ? getFileName(profile.resume)
                            : "Choose file..."}
                        </span>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={handleResumeUpload}
                      />
                    </label>
                    {profile.resume && (
                      <button
                        onClick={handleDeleteResume}
                        className={s.resumeDeleteButton}
                        title="Delete resume"
                      >
                        <Trash2 className={s.resumeDeleteIcon} />
                      </button>
                    )}
                  </div>
                  {profile.resume && (
                    <p className={s.resumeSuccessText}>
                      File uploaded: {profile.resume.name || "Uploaded Resume"}
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  {profile.resume ? (
                    <button
                      onClick={handleViewResume}
                      className={s.resumeViewButton}
                    >
                      <FileText className={s.resumeViewIcon} />
                      View Resume{" "}
                      {profile.resume ? `(${getFileName(profile.resume)})` : ""}
                    </button>
                  ) : (
                    <p className={s.noResumeText}>No resume uploaded</p>
                  )}
                </div>
              )}
            </div>
          