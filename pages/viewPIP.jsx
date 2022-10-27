import { Container } from '@chakra-ui/layout'
import { Flex, useToast } from '@chakra-ui/react'
import "react-step-progress-bar/styles.css"
import Cookies from 'js-cookie'
import Navbar from '../components/navbar'
import { useEffect, useState } from 'react'
import ViewForm from '../components/forms/view-form'
import { 
  getPIPData,
  getPIPGoals,
  getCAPAFirstPeriod,
  getCAPASecondPeriod, 
  getCAPAThirdPeriod,
  getUploadsFirstPeriod,
  getUploadsSecondPeriod,
  getUploadsThirdPeriod,
  getUploadsSummary,
  getFirstPIPGoalCount
} from '../lib/swr-hooks'
import { useRouter } from 'next/router'

export default function IndexPage({Component, pageProps}) {

  const router = useRouter()
  const { data: pipData } = getPIPData(router.query.ID)
  const { data: pipGoals } = getPIPGoals(router.query.ID)
  const { data: pipGoalsFirstPeriodCount } = getFirstPIPGoalCount(router.query.ID)
  const { data: CAPAFirstPeriod } = getCAPAFirstPeriod(router.query.ID)
  const { data: CAPASecondPeriod } = getCAPASecondPeriod(router.query.ID)
  const { data: CAPAThirdPeriod } = getCAPAThirdPeriod(router.query.ID)
  const { data: uploadsFirstPeriod } = getUploadsFirstPeriod(router.query.ID)
  const { data: uploadsSecondPeriod } = getUploadsSecondPeriod(router.query.ID)
  const { data: uploadsThirdPeriod } = getUploadsThirdPeriod(router.query.ID)
  const { data: uploadsSummary } = getUploadsSummary(router.query.ID)
  const [toastMessage, setToastMessage] = useState(undefined)
  const toast = useToast()
  
  useEffect(() => {
    if (toastMessage) {
      const [ title, body, status ] = toastMessage

      toast({
        title: title,
        description: body,
        status: status,
        duration: 4000,
        position: 'bottom-right'
      })
    }
  }, [toastMessage, toast])

  useEffect(() => {
    document.title = "View Form"
    var cookieObj = {}
    cookieObj = Cookies.get('authorized')
    !cookieObj ? router.push('/login') : ''
    
  }, [Cookies.get('authorized')]) 

  if(pipData && pipGoals){
    return(
      <Flex>
        <Container maxW="container.2xl">
          <Navbar />
          <ViewForm
            pipData={pipData}
            pipGoals={pipGoals}
            CAPAFirstPeriod={CAPAFirstPeriod}
            CAPASecondPeriod={CAPASecondPeriod}
            CAPAThirdPeriod={CAPAThirdPeriod}
            uploadsFirstPeriod={uploadsFirstPeriod}
            uploadsSecondPeriod={uploadsSecondPeriod}
            uploadsThirdPeriod={uploadsThirdPeriod}
            uploadsSummary={uploadsSummary}
            pipGoalsFirstPeriodCount={pipGoalsFirstPeriodCount}
            userData={Cookies.get()}
            setToastMessage={setToastMessage}
          />
        </Container>
      </Flex>
    )
  }
  else{
    return (
    <>
    </>
    )
  }

}
