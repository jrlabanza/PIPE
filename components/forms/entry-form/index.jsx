import { useState, useEffect, useRef } from 'react'
import Router from 'next/router'
import { 
  Heading,
  Container,
  Divider,
  Grid,
  GridItem,
  Box,
  Text
} from '@chakra-ui/layout'
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  InputGroup,
  Select,
  Textarea,
  RadioGroup,
  HStack,
  Radio,
  Checkbox,
  InputRightElement,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  IconButton,
  useToast
} from "@chakra-ui/react"
import { AddIcon, MinusIcon, SearchIcon } from '@chakra-ui/icons'
import { convertFD2JSON } from '../../functions'
import { useColorModeValue } from '@chakra-ui/color-mode'
import { Button } from '@chakra-ui/button'
import Cookies from 'js-cookie'
import { format } from 'path'

export default function EntryForm({setToastMessage}) {
  const toast = useToast()
  const axios = require('axios')
  const [goalCount, setGoalCount] = useState(1)
  const [searchQuery, setSearchQuery] = useState('') 
  const [searchResults, setSearchResults] = useState('')  
  const [jobDescriptiom, setJobDescription] = useState('')
  const [departmentCode, setDepartmentCode] = useState('')
  const [FFID, setFFID] = useState('')
  const [mail, setMail] = useState('')
  const searchEmployee = () => {
    setSearchResults('')
    setDepartmentCode('')
    setJobDescription('')
    setFFID('')
    setMail('')
    try{
      axios({
        method: 'get',
        url: process.env.NEXT_PUBLIC_LDAP_ADDRESS+`/api/user/search?searchString=${searchQuery}`,
        headers: { 'Accept': 'application/json',
        'Content-Type': 'application/json' 
        }
      })
      .then((response) => {
        var Myelement = document.getElementById("displayname")
        Myelement.value = response.data.Properties.displayname
        setSearchResults(response.data.Properties.displayname)
        setDepartmentCode(response.data.Properties.department)
        setJobDescription(response.data.Properties.title)
        setFFID(response.data.Properties.samaccountname)
        setMail(response.data.Properties.mail)
      })
      .catch((err) => {
        setSearchResults(err)
        console.log(err.message)
        toast({
          title: "Error",
          description: `No results found`,
          status: "error",
          duration: 4000,
          isClosable: true,
          position:"top-right"
        })
      })
    }
    catch(err){
      toast({
        title: "Error",
        description: err,
        status: "error",
        duration: 4000,
        isClosable: true,
        position:"top-right"
      })
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const formID = 'pipID'+ Date.now()
    const formData = new FormData(event.currentTarget)
    formData.append('formID', formID)
    formData.append('originator', Cookies.get('fullname'))
    formData.append('originator_ffid', Cookies.get('ffID'))
    formData.append('originator_mail', Cookies.get('mail'))
    formData.append('department_head_mail', Cookies.get('manager_mail'))
    formData.append('department_head_ffid', Cookies.get('manager_ffID'))
    formData.append('department_head_name', Cookies.get('manager'))
    formData.append('user_name', searchResults)
    formData.append('current_status', 'PIP SUBMITTED')
    formData.append('employee_ffid' , FFID)
        
    axios({
      method: 'post',
      url: '/api/form/create-pip',
      headers: { 'Accept': 'application/json',
      'Content-Type': 'application/json' 
      },
      data: convertFD2JSON(formData)
    })
    .then((response) => {
      console.log(response)
    })
    .catch((err) => {
      console.log(err)
    })

    handleGoal(formID)
  }

  function handleGoal(formID) {
    var goal = {}
    var target_area_for_improvement = document.getElementsByClassName("target_area_for_improvement");
    var expected_standards_of_performance = document.getElementsByClassName("expected_standards_of_performance");
    var target = document.getElementsByClassName("target");
    var action_plan_to_improve_performance = document.getElementsByClassName("action_plan_to_improve_performance");
    var support = document.getElementsByClassName("support");
    var first_expected_start_date = document.getElementsByClassName("first_expected_start_date");
    var second_expected_start_date = document.getElementsByClassName("second_expected_start_date");
    var third_expected_start_date = document.getElementsByClassName("third_expected_start_date");
    var first_expected_end_date = document.getElementsByClassName("first_expected_end_date");
    var second_expected_end_date = document.getElementsByClassName("second_expected_end_date");
    var third_expected_end_date = document.getElementsByClassName("third_expected_end_date");
    for (var i = 0; i < goalCount; i++) {
      goal[i] = {
        "pip_id": formID,
        "target_area_for_improvement": target_area_for_improvement[i].value,
        "expected_standards_of_performance": expected_standards_of_performance[i].value,
        "target": target[i].value,
        "action_plan_to_improve_performance": action_plan_to_improve_performance[i].value,
        "support": support[i].value,
        "first_expected_start_date": first_expected_start_date[i].value,
        "second_expected_start_date": second_expected_start_date[i].value,
        "third_expected_start_date": third_expected_start_date[i].value,
        "first_expected_end_date": first_expected_end_date[i].value,
        "second_expected_end_date": second_expected_end_date[i].value,
        "third_expected_end_date": third_expected_end_date[i].value
      }
      axios({
        method: 'post',
        url: '/api/form/create-goals',
        headers: { 'Accept': 'application/json',
        'Content-Type': 'application/json' 
        },
        data: goal[i]
      })
      .then((response) => {
        setToastMessage(['Form Submitted', response?.message, 'success'])
        Router.push('/')
      })
      .catch((err) => {
        console.log(err)
      })
    }
    console.log(goal)
  }

  return (
    <>
    <Container maxW="container.lg">
      <form onSubmit={handleSubmit} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault()}}>
        <Box
          bg="white"
          px={4}
          boxShadow={'xl'}
          rounded={'lg'}
          mb={4}
          borderColor={useColorModeValue('gray.800', 'gray.500')}
          // borderWidth={'1px'}
        >
          <HStack className="row">
            <Heading fontSize="4xl" fontWeight="0px">Performance Improvement Plan</Heading>
          </HStack>
          <Divider mb={2} width={'100%'}/>
          <FormLabel fontSize='xl' mt={5}>Employee Information</FormLabel>
          <Grid
            h='300px'
            templateColumns='repeat(2, 1fr)'
            gap={4}
          >
            <GridItem rowSpan={2}>
              <FormControl variant='floating' id='requestType' mt={2} ml={5}>
                <InputGroup size='md'>
                  <Input width={'sm'} mt={4} ml={4} id={'displayname'} onChange={(e) => setSearchQuery(e.target.value)}/>
                  <InputRightElement width='4.5rem' >
                    <IconButton h='2rem' size='sm' mr='7rem' mt='2rem' icon={<SearchIcon />} onClick={searchEmployee}/>
                  </InputRightElement>
                </InputGroup>
                <FormLabel>Name</FormLabel>
              </FormControl>
              <FormControl variant='floating' id='requestType' mt={2} ml={5}>
                <Input name="job_title" mt={4} ml={4} width={'sm'} value={jobDescriptiom} readOnly/>
                <FormLabel>Job Title</FormLabel>
              </FormControl>
              <FormControl variant='floating' id='requestType' mt={2} ml={5}>
                <Input name="department_code" mt={4} ml={4} width={'sm'} value={departmentCode} readOnly/>
                <FormLabel>Department Code</FormLabel>
              </FormControl>
              <FormControl variant='floating' id='requestType' mt={2} ml={5}>
                <Input name="mail" mt={4} ml={4} width={'sm'} value={mail} readOnly/>
                <FormLabel>Mail</FormLabel>
              </FormControl>
            </GridItem>
          </Grid>
          <Divider width={'100%'} mt={6}/>
          <FormLabel fontSize='xl' mt={5}>
            Actions to Improve Performance
          </FormLabel>
          <Tabs variant='solid-rounded' colorScheme='blue'>
            <HStack>
            <IconButton
              colorScheme='blue'
              aria-label='Search database'
              size={'sm'}
              icon={<AddIcon />}
              onClick={() =>{
                setGoalCount(goalCount + 1)
              }}
            />
            <TabList>
              {
                (() => {
                  var rows = []
                  for (var i = 0; i < goalCount ; i++){
                    rows.push(
                      <Tab key={i} className={"goalController_"+(i+1)}>
                        Goal #{i+1}
                        <IconButton
                          ml={2}
                          colorScheme='red'
                          aria-label='Search database'
                          size={'xs'}
                          icon={<MinusIcon boxSize={'.6em'}/>}
                          onClick={() =>{
                            setGoalCount(goalCount - 1)
                          }}
                          
                        />
                      </Tab>)
                  }
                  return rows
                })()
              }
            </TabList>
            </HStack>
            <TabPanels>
            {
                (() => {
                  var rows = []
                  for (var i = 0; i < goalCount ; i++){
                    rows.push(
                      <TabPanel key={i}>
                        <Grid
                          h="auto"
                          templateRows="repeat(3, 1fr)"
                          templateColumns="repeat(1, 1fr)"
                          mb={8}
                        >
                          <GridItem colSpan={1}>
                            <FormControl variant='floating' id='requestType' mt={2} ml={5}>
                              <Textarea className={"target_area_for_improvement"} mt={4} ml={4} width={'xl'}/>
                              <FormLabel>Target Area for Improvement</FormLabel>
                            </FormControl>
                          </GridItem>
                          <GridItem colSpan={1}>
                            <FormControl variant='floating' id='requestType' mt={2} ml={5}>
                              <Textarea className={"expected_standards_of_performance"} mt={4} ml={4} width={'xl'}/>
                              <FormLabel>Expected Standards of Performance</FormLabel>
                            </FormControl>
                          </GridItem>
                          <GridItem colSpan={1}>
                            <FormControl variant='floating' id='requestType' mt={2} ml={5}>
                              <Textarea className={"target"} mt={4} ml={4} width={'xl'}/>
                              <FormLabel>Target</FormLabel>
                            </FormControl>
                          </GridItem>
                          <GridItem colSpan={1}>
                            <FormControl variant='floating' id='requestType' mt={2} ml={5}>
                              <Textarea className={"action_plan_to_improve_performance"} mt={4} ml={4} width={'xl'}/>
                              <FormLabel>Action Plan to Improve Performance</FormLabel>
                            </FormControl>
                          </GridItem>
                          <GridItem colSpan={1}>
                            <FormControl variant='floating' id='requestType' mt={2} ml={5}>
                              <Textarea className={"support"} mt={4} ml={4} width={'xl'}/>
                              <FormLabel>Support</FormLabel>
                            </FormControl>
                          </GridItem>
                        </Grid>
                        <Grid
                          h='300px'
                          templateColumns='repeat(4, 1fr)'
                          gap={4}
                          px={4}
                          pt={3}
                        >
                          <GridItem colSpan={2}>
                            <FormLabel fontSize='md'>Expected Start Date of Periodic Review</FormLabel>
                            <FormControl variant='floating' id='requestType' mt={2} ml={5} isRequired>
                              <Input className={"first_expected_start_date"} mt={4} ml={4} width={'sm'} type="date"/>
                              <FormLabel>1st Period</FormLabel>
                            </FormControl>
                            <FormControl variant='floating' id='requestType' mt={2} ml={5} isRequired>
                              <Input className={"second_expected_start_date"} mt={4} ml={4} width={'sm'} type="date"/>
                              <FormLabel>2nd Period</FormLabel>
                            </FormControl>
                            <FormControl variant='floating' id='requestType' mt={2} ml={5} isRequired>
                              <Input className={"third_expected_start_date"} mt={4} ml={4} width={'sm'} type="date"/>
                              <FormLabel>3rd Period</FormLabel>
                            </FormControl>
                          </GridItem>
                          <GridItem colSpan={2}>
                            <FormLabel fontSize='md'>Expected End Date of Periodic Review</FormLabel>
                            <FormControl variant='floating' id='requestType' mt={2} ml={5} isRequired>
                              <Input className={"first_expected_end_date"} mt={4} ml={4} width={'sm'} type="date"/>
                              <FormLabel>1st Period</FormLabel>
                            </FormControl>
                            <FormControl variant='floating' id='requestType' mt={2} ml={5} isRequired>
                              <Input className={"second_expected_end_date"} mt={4} ml={4} width={'sm'} type="date"/>
                              <FormLabel>2nd Period</FormLabel>
                            </FormControl>
                            <FormControl variant='floating' id='requestType' mt={2} ml={5} isRequired>
                              <Input className={"third_expected_end_date"} mt={4} ml={4} width={'sm'} type="date"/>
                              <FormLabel>3rd Period</FormLabel>
                            </FormControl>
                          </GridItem>
                        </Grid>
                      </TabPanel>
                  )
                }
                return rows
              })()
            } 
            </TabPanels>
          </Tabs>
          <Divider width={'100%'} mt={4}/>
          <Grid
            h="auto"
            templateRows="repeat(2, 1fr)"
            templateColumns="repeat(12, 1fr)"
            mt={8}
            ml={8}
            maxW="100%"
          >
            <GridItem rowSpan={1} colSpan={12} >
              <Checkbox
                //onChange={() => terms === true ? setTerms(false) : setTerms(true)}
              >
                <Text 
                  fontSize="xs" 
                  ml={3}
                >
                  YOU AGREED AND REVIEWED ALL DETAILS AND WILL BE SUBMITTED TO THE NEXT LEVEL APPROVER FOR REVIEW
                </Text>
              </Checkbox>    
            </GridItem>
          </Grid> 
          <Divider width={'100%'}/>
          <Grid
            h="auto"
            templateRows="repeat(2, 1fr)"
            templateColumns="repeat(12, 1fr)"
            gap={6}
            mt={8}
            ml={3}
            maxW="100%"
          >
            <GridItem rowSpan={1} colSpan={12} alignContent="right" >
              <Button 
                colorScheme="teal" 
                //isLoading={submitting} 
                loadingText="Submitting" 
                spinnerPlacement="start"
                type="submit"
                //disabled={terms}
              >
                Submit
              </Button>
            </GridItem>
          </Grid> 
        </Box>
      </form>
    </Container>
    </>
  )
}
