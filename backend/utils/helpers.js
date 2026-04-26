
        return {
            ...(type === "company" && { company: id }),
            ...(type === "role" && { roleId: id }),
            question: q.question,
            answer: q.answer,
            keyPoints: Array.isArray(q.keyPoints) ? q.keyPoints : [q.keyPoints],
            postDate: date,
            createdBy: userId,
            askedBy: q.companies?.map((c) => ({
                companyName: c.name || "",
                dateAsked: c.date || "",
            })) || [],
        };
