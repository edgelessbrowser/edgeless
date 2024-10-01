export default function resetCss() {
  return `
    ::-webkit-scrollbar {
        width: 14px;
        height: 14px;
      }

      ::-webkit-scrollbar-track {
        background-color: rgba(255, 255, 255, 0.2);
      }

      ::-webkit-scrollbar-thumb {
        background-color: #d6dee1;
        border-radius: 8px;
        border: 2px solid transparent;
        border-left-width: 3px;
        border-right-width: 3px;
        background-clip: content-box;
      }

      ::-webkit-scrollbar-thumb:hover {
        background-color: #a8bbbf;
      }

      ::-webkit-scrollbar-corner { 
        background-color: transparent; 
      }
  `;
}
