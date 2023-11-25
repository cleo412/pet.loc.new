import { defineStore } from "pinia";

export const useKeyStore = defineStore("KeyStore", {
  state: () => {
    return {
      isAlphabet: false,
      isTooltip: true,
      isColorTheme: false,
    };
  },
  getters: {
    getStoreKey: (state) => () => state,

    getKeyInStoreKey: (state) => (key) => state[key],
  },

  actions: {
    setToggle(flag) {
      return (this.getStoreKey()[flag] = !this.getStoreKey()[flag]);
    },
  },
});
