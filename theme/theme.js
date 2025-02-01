import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  colors: {
    brand: {
      50: '#e8f5e9',
      100: '#c8e6c9',
      500: '#4caf50',
      600: '#43a047',
      700: '#388e3c',
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand',
      },
    },
  },
})

export default theme