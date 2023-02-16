import {
  Box,
  Text,
  Flex,
  useColorModeValue,
  Image
} from '@chakra-ui/react'

const Logo = (props) => {
  return (
    <Image maxW="10%" src={"images/light-logo.png"} />
  )
}

export default function LargeWithLogoCentered() {
  return (
    <Box
      bg={useColorModeValue('blue.50', 'blue.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
    >
      <Box py={10} >
        <Flex
          align={'center'}
          _before={{
            content: '""',
            borderBottom: '1px solid',
            borderColor: useColorModeValue('gray.200', 'gray.700'),
            flexGrow: 1,
            mr: 8,
          }}
          _after={{
            content: '""',
            borderBottom: '1px solid',
            borderColor: useColorModeValue('gray.200', 'gray.700'),
            flexGrow: 1,
            ml: 8,
          }}>
          <Logo />
        </Flex>
        <Text pt={6} fontSize={'sm'} textAlign={'center'}>
          © {new Date().getFullYear()} APPLICATIONS ENGINEERING
        </Text>
        <Text pt={0} fontSize={'sm'} textAlign={'center'}>{process.env.NEXT_PUBLIC_VERSION}</Text>
      </Box>
    </Box>
  )
}
