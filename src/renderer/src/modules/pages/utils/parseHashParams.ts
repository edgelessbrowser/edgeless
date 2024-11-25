type ParsedHashParams = {
  [key: string]: string | number;
};

export function decodeHashParams(
  key?: string
): ParsedHashParams | string | number | undefined {
  const hash = window.location.hash.substring(1); // Remove the leading '#'

  if (!hash) return key ? undefined : {};

  const params = new URLSearchParams(hash);
  const parsedParams: ParsedHashParams = {};

  params.forEach((value, paramKey) => {
    parsedParams[paramKey] = isNaN(Number(value)) ? value : Number(value);
  });

  if (key) {
    return parsedParams[key];
  }

  return parsedParams;
}

type ObjectHashParams = {
  [key: string]: string | number;
};

export function encodeHashParams(params: ObjectHashParams): string {
  const hashParams = new URLSearchParams();

  Object.keys(params).forEach((key) => {
    const value = params[key];
    hashParams.append(key, value.toString());
  });

  return `#${hashParams.toString()}`;
}
