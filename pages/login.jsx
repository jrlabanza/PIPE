import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Image,
  useToast,
  Container,
  HStack
} from '@chakra-ui/react';
import { useState } from 'react';
import Cookies from 'js-cookie'
import axios from 'axios';
import Router from 'next/router'
import LargeWithLogoCentered from '@/components/footer';

export default function SplitScreen() {
  const [ ADAccount, setADAccount ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ submitting, setSubmitting ] = useState(false)
  const toast = useToast()
  const handleSubmit = async (event) => {
  
    try{
      event.preventDefault()
      setSubmitting(true)

      axios({
        method: 'post',
        url: '/api/auth/ldap',
        headers: { 'Accept': 'application/json',
        'Content-Type': 'application/json' 
        },
        data: {
          "username": ADAccount,
          "password": password
        }
      })
      .then(async function (response){
        // check if admin

        axios({
          method: 'post',
          url: '/api/auth/checkIfAdmin',
          headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
          },
          data: {
            "ffID": ADAccount
          }
        }).then((response => {
          console.log(response.data.is_admin)
          response.data.is_admin === 1 ? Cookies.set('isAdmin', true) : Cookies.set('isAdmin', false)
        }))

        setSubmitting(false)
        if(response.data.status_code != 200){
          return toast({
            title: "Login Error",
            description: response.data.error_message.lde_message,
            status: "error",
            duration: 4000,
            isClosable: true,
          })
        }
        //Get Supervisor Data
        const supervisorData = await axios({ 
          method: 'post',
          url: '/api/auth/searchManager',
          headers: { 'Accept': 'application/json',
          'Content-Type': 'application/json' 
          },
          data: {
            "username": ADAccount,
            "password": password,
            "managerAddress": response.data.user_data.manager
          }
        })

        //Set Cookie
        Cookies.set('ffID', response.data.user_data.sAMAccountName)
        Cookies.set('token', password)
        Cookies.set('fullname', response.data.user_data.displayName)
        Cookies.set('mail', response.data.user_data.mail)
        Cookies.set('department', response.data.user_data.department)
        Cookies.set('thumbnailPhoto', response.data.user_data.thumbnailPhoto)
        Cookies.set('title', response.data.user_data.title)
        Cookies.set('authorized', response.data.authorized)
        if((response.data.user_data.department).toString().substring(0,3) == "564"){
          Cookies.set('location', 'TAR')
        }
        else if((response.data.user_data.department).toString().substring(0,3) == "561"){
          Cookies.set('location', 'CAR')
        }
        else if((response.data.user_data.department).toString().substring(0,3) == "566"){
          Cookies.set('location', 'CEB')
        }
        else{
          Cookies.set('location', 'VIS')
        }
        Cookies.set("manager", supervisorData.data.user_data.displayName)
        Cookies.set("manager_mail", supervisorData.data.user_data.mail)
        Cookies.set("manager_ffID", supervisorData.data.user_data.sAMAccountName)

        toast({
          title: "Login Success",
          description: "Redirecting to dashboard",
          status: "success",
          duration: 4000,
          isClosable: true,
        })
        
        Router.push('/')
      })
      .catch(function (error){
        setSubmitting(false)
        return toast({
          title: "Login Error",
          description: error.message,
          status: "error",
          duration: 4000,
          isClosable: true,
        })
      })
    }
    catch(err){
      setSubmitting(false)
      return toast({
        title: "Login Error",
        description: err,
        status: "error",
        duration: 4000,
        isClosable: true,
      })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Container maxW="container.xl">
        <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
          <Flex p={8} flex={1} align={'center'} justify={'center'}>
            <Stack spacing={4} w={'full'} maxW={'md'}>
              {/* <Image width="300px" src="images/light-logo.png" objectFit="cover" objectPosition="-17px 0"></Image> */}
              <HStack spacing={0}>
                <Heading color={'#E97D2E'} 
                >
                  E
                </Heading>
                <Heading color={'#2C4C54'}>PIP</Heading>
              </HStack>
              <FormControl id="email">
                <FormLabel>AD Account</FormLabel>
                <Input 
                  type="text"
                  onChange={(e) => setADAccount(e.target.value)}
                  value={ADAccount}  
                />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input 
                  type="password"
                  onChange={(e) => setPassword(e.target.value)} 
                  value={password}
                />
              </FormControl>
              <Stack spacing={6}>
                <Stack
                  direction={{ base: 'column', sm: 'row' }}
                  align={'start'}
                  justify={'space-between'}>
                  <Checkbox>Non AD Account</Checkbox>
                  <Link color={'blue.500'}>Cannot use AD Account? Register here</Link>
                </Stack>
                <Button 
                  isLoading={submitting}
                  colorScheme="teal"
                  bgGradient="linear(to-r, teal.400, teal.500, teal.600)"
                  color="white"
                  variant="solid"
                  loadingText="Logging In"  
                  type="submit"
                >
                  Sign in
                </Button>
              </Stack>
            </Stack>
          </Flex>
          <Flex flex={1}>
            <Image
              alt={'Login Image'}
              objectFit={'cover'}
              src={
                'images/Screenshot 2022-07-05 105046.png'
              }
            />
          </Flex>
        </Stack>
        <LargeWithLogoCentered/>
      </Container>

    </form>
    
  );
}