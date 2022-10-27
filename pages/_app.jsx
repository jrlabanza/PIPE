import '../styles/index.css'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'


const activeLabelStyles = {
  transform: 'scale(0.85) translateY(-6px)',
}
export const theme = extendTheme({
  components: {
    Form: {
      variants: {
        floating: {
          container: {
            _focusWithin: {
              label: {
                ...activeLabelStyles,
              },
            },
            'input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) + label':
              {
                ...activeLabelStyles,
              },
            label: {
              top: 0,
              left: 3,
              zIndex: 2,
              position: 'absolute',
              backgroundColor: 'white',
              pointerEvents: 'none',
              mx: 3,
              px: 1,
              my: 2,
              transformOrigin: 'left top'
            },
          },
        },
      },
    },
  },
})

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <link rel="shortcut icon" href="#"></link>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp
