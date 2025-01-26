import { definePreset, updatePreset } from '@primevue/themes'
import Aura from '@primevue/themes/aura'
import Nora from '@primevue/themes/nora'
import Lara from '@primevue/themes/lara'
import Material from '@primevue/themes/material'

const tGeSemantic = {
  semantic: {
    primary: {
      50: '{zinc.50}',
      100: '{zinc.100}',
      200: '{zinc.200}',
      300: '{zinc.300}',
      400: '{zinc.400}',
      500: '{zinc.500}',
      600: '{zinc.600}',
      700: '{zinc.700}',
      800: '{zinc.800}',
      900: '{zinc.900}',
      950: '{zinc.950}'
    },
    colorScheme: {
      light: {
        primary: {
          color: '{zinc.950}',
          inverseColor: '#ffffff',
          hoverColor: '{zinc.900}',
          activeColor: '{zinc.800}'
        },
        highlight: {
          background: '{zinc.950}',
          focusBackground: '{zinc.700}',
          color: '#ffffff',
          focusColor: '#ffffff'
        }
      },
      dark: {
        primary: {
          color: '{zinc.50}',
          inverseColor: '{zinc.950}',
          hoverColor: '{zinc.100}',
          activeColor: '{zinc.200}'
        },
        highlight: {
          background: 'rgba(250, 250, 250, .16)',
          focusBackground: 'rgba(250, 250, 250, .24)',
          color: 'rgba(255,255,255,.87)',
          focusColor: 'rgba(255,255,255,.87)'
        }
      }
    }
  }
}

export default async (theme: 'Aura' | 'Nora' | 'Lara' | 'Material') => {
  window.api.store.setItem('theme', {
    ...(await window.api.store.getItem('theme')),
    theme
  })
  if (theme === 'Aura') {
    return updatePreset(
      definePreset(Aura, {
        semantic: tGeSemantic
      })
    )
  } else if (theme === 'Nora') {
    return updatePreset(
      definePreset(Nora, {
        semantic: tGeSemantic
      })
    )
  } else if (theme === 'Lara') {
    return updatePreset(
      definePreset(Lara, {
        semantic: tGeSemantic
      })
    )
  } else if (theme === 'Material') {
    return updatePreset(
      definePreset(Material, {
        semantic: tGeSemantic
      })
    )
  } else {
    return updatePreset(
      definePreset(Aura, {
        semantic: tGeSemantic
      })
    )
  }
}
