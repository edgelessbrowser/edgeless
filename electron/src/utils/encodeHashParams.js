function encodeHashParams(params) {
  const hashParams = new URLSearchParams();

  Object.keys(params).forEach((key) => {
    const value = params[key];
    hashParams.append(key, value.toString());
  });

  // Return the hash string, including the leading '#'
  return `#${hashParams.toString()}`;
}
