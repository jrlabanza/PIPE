import { Container } from '@chakra-ui/layout'
import { useToast } from '@chakra-ui/react'
import EntryForm from '../components/forms/entry-form'
import Navbar from '@/components/navbar'
import LargeWithLogoCentered from '@/components/footer'
import { getData, approverList } from '@/lib/swr-hooks'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'


export default function NewEntryPage() {
  const router = useRouter()
  const [ toastMessage, setToastMessage ] = useState(undefined)
  const toast = useToast()

  useEffect(() => {
    if (toastMessage) {
      const [ title, body, status ] = toastMessage

      toast({
        title: title,
        description: body,
        status: status,
        duration: 4000,
        isClosable: true
      })
    }
  }, [toastMessage, toast])

  useEffect(() => {
    document.title = "Create Form"
    var cookieObj = {}
    cookieObj = Cookies.get('authorized')
    !cookieObj ? router.push('/login') : ''
    
  }, [Cookies.get('authorized')]) 

    return (
      <>
        <Container maxW="container.2xl">
          <Navbar />
          <EntryForm 
            setToastMessage={setToastMessage}
          />
          <LargeWithLogoCentered />
        </Container>
      </>
    )
}
