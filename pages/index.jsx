import Skeleton from 'react-loading-skeleton'
import { Container } from '@chakra-ui/layout'
import Entries from '../components/entries'
import BasicStatistics from '../components/statistics'
import { usePIPEntries } from '../lib/swr-hooks'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import {
  Stack,
  Grid,
  GridItem,
  Box,
  useToast
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import Navbar from '@/components/navbar'
import LargeWithLogoCentered from '@/components/footer'
import { useColorModeValue } from '@chakra-ui/color-mode'

export default function IndexPage({Component, pageProps}) {
  const toast = useToast()
  const [ filter, setFilter ] = useState()
  const {
    entries,
    entryCount,
    isLoading,
    annoucement
  } = usePIPEntries(Cookies.get('ffID'), filter)
  const router = useRouter()
  const id = 'annoucement'

  useEffect(() => {
    document.title = "Dashboard"
    var cookieObj = {}
    cookieObj = Cookies.get('authorized')
    !cookieObj ? router.push('/login') : ''
  }, [Cookies.get('authorized')])

  useEffect(() => {
    if(annoucement){
      if (!toast.isActive(id)) {
        toast({
          id,
          title: annoucement.title,
          description: annoucement.annoucement,
          status: annoucement.status,
          duration: null,
          isClosable: false,
          position: 'top'
        })
      }
    }
  }, [annoucement])
  if (isLoading) {
    return (
      <>
        <Container maxW="container.2xl">
          <Grid
            h="30px"
            gap={6}
          >
            <GridItem colSpan={{sm: 12, lg: 12}}>
              <Navbar />
            </GridItem>
            <GridItem colSpan={{sm: 12, lg: 4}}>
              <Box
                mx="auto"
                borderWidth="1px"
                borderRadius="lg"
                borderColor={useColorModeValue('gray.800', 'gray.500')}
                p={5}
              >
                <Stack>
                  <Skeleton height="86px" />
                  <Skeleton height="86px" />
                  <Skeleton height="86px" />
                </Stack>
              </Box>
            </GridItem>
            <GridItem colSpan={{sm: 12, lg: 8}}>
              <Box
                mx="auto"
                borderWidth="1px"
                borderRadius="lg"
                boxShadow={'xl'}
                p={5}
                borderColor={useColorModeValue('gray.800', 'gray.500')}
              >
                <Stack>
                  <Skeleton height="33px" width="120px" />
                  <Skeleton height="50px" />
                  <Skeleton height="50px" />
                </Stack>
              </Box>
            </GridItem>
          </Grid>
        </Container>
      </>
    )
  }
  return (
    <Container maxW="container.2xl">
      <Grid
        h="30px"
        gap={6}
      >
        <GridItem colSpan={{sm: 12, lg: 12}}>
          <Navbar />
        </GridItem>
        <GridItem colSpan={{sm: 12, lg: 2}} >
          <Box
            // borderWidth="1px"
            borderRadius="xl"
            boxShadow={'xl'}
            borderColor={useColorModeValue('gray.800', 'gray.500')}
            p={5}
          >
            <BasicStatistics 
              totalEntries={entryCount} 
              setFilter={setFilter}
              isAdmin={Cookies.get('isAdmin')}
            />
          </Box>
        </GridItem>
        <GridItem colSpan={{sm: 12, lg: 10}} >
          <Box
            // borderWidth="1px"
            borderRadius="xl"
            boxShadow={'xl'}
            borderColor={useColorModeValue('gray.800', 'gray.500')}
            p={5}
          >
            <Entries entries={entries} />
          </Box>
        </GridItem>
        <GridItem colSpan={12}>
          <LargeWithLogoCentered />
        </GridItem>
      </Grid>
    </Container>
  )


}
