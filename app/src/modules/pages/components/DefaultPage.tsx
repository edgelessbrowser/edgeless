import Box from "../../ui/components/Box";

export default function DefaultPage() {
  return (
    <Box
      class={`
      w-full h-screen flex justify-center items-center flex-col 
      text-sm text-white bg-slate-700
    `}
    >
      <h1 class="font-bold text-3xl text-slate-800/60 select-none">
        Edgeless Browser
      </h1>
    </Box>
  );
}
