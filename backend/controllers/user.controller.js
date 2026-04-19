      // Sanitized filename but keep the extension for raw files
      const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "");
      const sanitizedBase = nameWithoutExt.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9\-_]/g, "");
      const sanitizedFileName = `${sanitizedBase}.${extension}`;

      // Determine resource type: images should be 'image', docs/pdfs often safer as 'raw' for delivery
      const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(extension);
      const resourceType = isImage ? "image" : "raw";



      const signedUrl = cloudinary.utils.private_download_url(publicId, format, {
        resource_type: "raw",
        type: "upload",
        secure: true,
        expires_at: Math.floor(Date.now() / 1000) + 300, // 5 minutes
      });

    const signedUrl = cloudinary.url(publicId, {
      resource_type: "image",
      type: "upload",
      secure: true,
      sign_url: true,
      expires_at: Math.floor(Date.now() / 1000) + 300,
    });