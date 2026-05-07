 const placeholder = (name) =>
    `https://via.placeholder.com/560x320?text=${encodeURIComponent(
      (name || "Co").split(" ")[0].slice(0, 2).toUpperCase(),
    )}`;

  const isExternal = (url) => /^https?:\/\//i.test(url);