export default async (darkMode: 'dark' | 'light' | 'system') => {
  window.api.store.setItem('theme', {
    ...(await window.api.store.getItem('theme')),
    darkMode
  })
  if (darkMode === 'system') {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  } else if (darkMode === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}
