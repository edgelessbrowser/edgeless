import { RootTypes } from "shared-types";
import { createSignal, createRoot } from "solid-js";

function RootState() {
  const [osName, setOsName] = createSignal<RootTypes.OSName>(
    RootTypes.OSName.Unknown
  );

  const [theme, setTheme] = createSignal<RootTypes.Theme>(
    RootTypes.Theme.Slate
  );

  const [architecture, setArchitecture] = createSignal<RootTypes.Architecture>(
    RootTypes.Architecture.Unknown
  );

  const [edglessVersion, setEdglessVersion] =
    createSignal<string>("stocholm-alpha");

  const [isMaximized, setIsMaximized] = createSignal<boolean>(false);

  return {
    osName,
    setOsName,

    architecture,
    setArchitecture,

    edglessVersion,
    setEdglessVersion,

    theme,
    setTheme,

    isMaximized,
    setIsMaximized,
  };
}

export default createRoot(RootState);
