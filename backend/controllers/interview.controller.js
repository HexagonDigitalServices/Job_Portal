// Update Company
export const updateInterviewCompany = async (req, res) => {
    try {
        const { companyId } = req.params;
        const { companyName, questionsCount, questionsData } = req.body;

        const company = await InterviewCompany.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        if (companyName) company.companyName = companyName;
        if (questionsCount) company.questionsCount = questionsCount;

        const uploads = await uploadFiles(req.files, {
            logoFile: { folder: "jobportal/logos", type: "image" },
            csvFile: { folder: "jobportal/csv", type: "raw" }
        });

        if (uploads.logoFile) company.logo = uploads.logoFile;
        if (uploads.csvFile) company.csvFileUrl = uploads.csvFile;

        await company.save();

        if (questionsData) {
            const formatted = parseQuestions(
                questionsData,
                "company",
                company._id,
                req.user.id
            );

            await replaceQuestions(
                InterviewQuestion,
                { company: companyId },
                formatted
            );
        }

        res.status(200).json({ success: true, company });

    } catch (err) {
        handleError(res, err);
    }
};


// Update Role
export const updateInterviewRole = async (req, res) => {
    try {
        const { roleId } = req.params;
        const { roleName, questionsCount, questionsData } = req.body;

        const role = await InterviewRole.findById(roleId);
        if (!role) {
            return res.status(404).json({ message: "Role not found" });
        }

        if (roleName) role.roleName = roleName;
        if (questionsCount) role.questionsCount = questionsCount;

        const uploads = await uploadFiles(req.files, {
            imageFile: { folder: "jobportal/roles", type: "image" },
            csvFile: { folder: "jobportal/csv", type: "raw" }
        });

        if (uploads.imageFile) role.image = uploads.imageFile;
        if (uploads.csvFile) role.csvFileUrl = uploads.csvFile;

        await role.save();

        if (questionsData) {
            const formatted = parseQuestions(
                questionsData,
                "role",
                role._id,
                req.user.id
            );

            await replaceQuestions(
                RoleQuestion,
                { roleId },
                formatted
            );
        }

        res.status(200).json({ success: true, role });

    } catch (err) {
        handleError(res, err);
    }
};