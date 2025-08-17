export const emitForceLogout = () => {
    window.dispatchEvent(new Event("forceLogout"));
  };