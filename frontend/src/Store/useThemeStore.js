import { create } from "zustand";

const useTheme = create((set => ({
    theme : localStorage.getItem('theme') || 'coffee',

    setTheme : (newTheme) => {
        localStorage.setItem('theme', newTheme);
        document.querySelector('html').setAttribute('data-theme', newTheme);
        set({ theme: newTheme });
    }
})))

export default useTheme