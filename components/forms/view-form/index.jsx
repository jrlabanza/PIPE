import { useState, useEffect } from 'react'
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
  Input,
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
  Button,
  Accordion,
  AccordionButton,
  AccordionPanel,
  AccordionItem,
  AccordionIcon,
  Table,
  TableContainer,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  Stack,
  Tag,
  TagLabel,
  TagCloseButton
} from "@chakra-ui/react"
import { AddIcon, MinusIcon, CheckIcon, CloseIcon, EditIcon, DownloadIcon } from '@chakra-ui/icons'
import { convertFD2JSON } from '../../functions'
import { useColorModeValue } from '@chakra-ui/color-mode'
import Summary from '../../summary'

export default function ViewForm(
  {
    pipData,
    pipGoals,
    CAPAFirstPeriod,
    CAPASecondPeriod,
    CAPAThirdPeriod,
    uploadsFirstPeriod,
    uploadsSecondPeriod,
    uploadsThirdPeriod,
    uploadsSummary,
    setToastMessage,
    pipGoalsFirstPeriodCount,
    userData
  }
  ){
  try{
    const axios = require('axios')
    const [goalCount] = useState(pipGoals.length)
    const [signoffStatus, setSignoffStatus] = useState('') 
    const [buttonControl, setButtonControl] = useState(false)
    const resSummaryAttachment = uploadsSummary?.filter(item => item.goalID == 0)
    
    /*Button Auto Disabler*/
    useEffect(() => { 
      pipData?.current_status == "PROGRAM CLOSED" ? setButtonControl(true) : null
    }, [pipData?.current_status])

    /*Period Date Controller*/
    const handlePeriod = (event) => {
      event.preventDefault()
      console.log(event.target)
      console.log("Goal ID",event.target[2].id)// goal id
      console.log("PIP ID", event.target[2].getAttribute(`data-pip-id`)) //pip id
      console.log("Actual Start", event.target[2].value)//start
      console.log("Actual End", event.target[3].value)//end
      console.log("Period Query Start", event.target[2].getAttribute(`data-query`))
      console.log("Period Query End", event.target[3].getAttribute(`data-query`))
      console.log("Period", event.target[4].id)
      console.log("Remarks", event.target[5].value)
      console.log("Remarks Query", event.target[5].getAttribute(`name`))
      const formData = new FormData(event.currentTarget)
      if(confirm("Confirm Action?")){
        setButtonControl(true)
        setToastMessage(["Saving Changes", "", "info"])
        formData.append('id', event.target[2].id)
        formData.append('pipID', event.target[4].getAttribute(`data-pip-id`))
        axios({
          method: 'POST',
          url: '/api/form/update-period',
          headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
          },
          data: {
            startDate: event.target[2].value,
            endDate: event.target[3].value,
            id: event.target[2].getAttribute(`data-pip-id`),
            startQuery: event.target[2].getAttribute(`data-query`),
            endQuery: event.target[3].getAttribute(`data-query`),
            remarks: event.target[5].value,
            period: event.target[4].id,
            goalID: event.target[2].id,
            remarksQuery: event.target[5].getAttribute(`name`)
          }
        })
        .then((response) => {
          setButtonControl(false)
          setToastMessage(["Saved Successful", response.message, "success"])
        })
        .catch((err)=> {
          setButtonControl(false)
          setToastMessage(["Error", err.message, "error"])
        })
        axios({
          method:'post',
          url: '/api/upload-file',
          headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
          },
          data: formData
        })
        .then(async response => {
          const uploadDBres = await axios({
            method:'post',
            url: '/api/upload-file/save-to-db',
            headers: { 
              'Accept': 'application/json',
              'Content-Type': 'application/json' 
            },
            data:{
              "file": response.data.file,
              "pip_id": event.target[4].getAttribute(`data-pip-id`),
              "goal_id": event.target[2].id,
              "period": event.target[4].id,
              "isSummary": 0,
            }
          })
          setButtonControl(false)
          setToastMessage(["Upload Successful", "", "success"])
        })
      }
    }

    /*Approval Controller*/
    const handleApproval = (event) => {
      event.preventDefault()
      if(confirm("Confirm Action?")){
        setButtonControl(true)
        setToastMessage(["Saving Changes", "", "info"])
        const formData = new FormData(event.currentTarget)
        formData.append('id', event.currentTarget[0].id)
        formData.append('status', signoffStatus)
        formData.append('remarksQuery', event.currentTarget[0].getAttribute('data-remarks-query'))
        formData.append('approvalQuery', event.currentTarget[0].getAttribute('data-approval-query'))
        formData.append('dateQuery', event.currentTarget[0].getAttribute('data-date-query'))
  
        axios({
          method: 'POST',
          url: '/api/form/update-signoff',
          headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
          },
          data: convertFD2JSON(formData)
        })
        .then((response) => {
          setButtonControl(false)
          setToastMessage(["Saved Successful", response.message, "success"])
        })
        .catch((err)=> {
          setButtonControl(false)
          setToastMessage(["Error", err.message, "error"])
        })
      }
    }

    /*CAPA Enabler*/
    const handleHasCAPA = (event) => {
      event.preventDefault()
      setButtonControl(true)
      setToastMessage(["Saving Changes", "", "info"])
      axios({
        method: 'POST',
        url: '/api/form/update-has-capa',
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json' 
        },
        data: {
          "id": event.target.id,
          "queryString": event.target.name,
          "hasCAPA": event.target.checked ? 1 : 0
        }
      })
      .then((response) => {
        setButtonControl(false)
        setToastMessage(["Saved Successful", response.message, "success"])
      })
      .catch((err)=> {
        setButtonControl(false)
        setToastMessage(["Error", err.message, "error"])
      })
    }

    /*CAPA Add*/
    const addCAPA = (event) => {
      event.preventDefault()
      setButtonControl(true)
      setToastMessage(["Saving Changes", "", "info"])
      const formData = new FormData(event.currentTarget)
      formData.append('pip_id', event.currentTarget[3].getAttribute('data-pip-id'))
      formData.append('goal_id', event.currentTarget[3].getAttribute('data-goal-id'))
      formData.append('period', event.currentTarget[3].id)
      axios({
        method: 'POST',
        url: '/api/form/add-capa',
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json' 
        },
        data: convertFD2JSON(formData)
      })
      .then((response) => {
        setButtonControl(false)
        setToastMessage(["Saved Successful", response.message, "success"])
      })
      .catch((err)=> {
        setButtonControl(false)
        setToastMessage(["Error", err.message, "error"])
      })
    }

    /*CAPA Remove*/
    const removeCAPA = (event) => {
      event.preventDefault()
      setButtonControl(true)
      setToastMessage(["Saving Changes", "", "info"])
      axios({
        method: 'POST',
        url: '/api/form/remove-capa',
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json' 
        },
        data: {
          'id':event.currentTarget[0].id
        }
      })
      .then((response) => {
        setButtonControl(false)
        setToastMessage(["Saved Successful", response.message, "success"])
      })
      .catch((err)=> {
        setButtonControl(false)
        setToastMessage(["Error", err.message, "error"])
      })
    }

    /*END Program Trigger*/
    const handleEndProgram = (event) => {
      event.preventDefault()
      if(confirm("Proceed to Final Sign Off Review?")){
        const formData = new FormData(event.currentTarget)
        formData.append("id", pipData.id)
        formData.append("current_status", "FINAL REVIEW")
        setButtonControl(true)
        setToastMessage(["Saving Changes", "", "info"])
        axios({
          method: 'POST',
          url: '/api/form/end-program',
          headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
          },
          data: convertFD2JSON(formData)
        })
        .then((response) => {
          setButtonControl(false)
          setToastMessage(["Saved Successful", response.message, "success"])
        })
        .catch((err)=> {
          setButtonControl(false)
          setToastMessage(["Error", err.message, "error"])
        })
      }
    }

    /*Summary Approval Controller*/
    const handleFinalReviewSignOff = (event) => {
      event.preventDefault()
      if(confirm("Confirm Action?")){
        setButtonControl(true)
        setToastMessage(["Saving Changes", "", "info"])
        const formData = new FormData(event.currentTarget)
        formData.append('id', event.currentTarget[0].id)
        formData.append('status', signoffStatus)
        formData.append('remarksQuery', event.currentTarget[0].getAttribute('data-remarks-query'))
        formData.append('approvalQuery', event.currentTarget[0].getAttribute('data-approval-query'))
        formData.append('dateQuery', event.currentTarget[0].getAttribute('data-date-query'))
        
        axios({
          method: 'POST',
          url: '/api/form/update-final-sign-off',
          headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
          },
          data: convertFD2JSON(formData)
        })
        .then((response) => {
          setButtonControl(false)
          setToastMessage(["Saved Successful", response.data.message, "success"])
          axios({
            method: 'POST',
            url: '/api/form/final-employee-signoff',
            headers: { 
              'Accept': 'application/json',
              'Content-Type': 'application/json' 
            },
            data: {'id': response.data.id}
          })
        })
        .catch((err)=> {
          setButtonControl(false)
          setToastMessage(["Error", err.message, "error"])
        })
      }
    }

    /*Supervisor Attachment Upload*/
    const handleFileUpload = async (event) => {
      event.preventDefault()
      setButtonControl(true)
      setToastMessage(["Saving Changes", "", "info"])
      const formData = new FormData(event.currentTarget)
      const pip_id = event.currentTarget[0].getAttribute('data-pip-id')
      const goal_id = event.currentTarget[0].getAttribute('data-goal-id')
      const period = event.currentTarget[0].id
      const isSummary = event.currentTarget[0].getAttribute('data-is-summary')
      const remarks = event.currentTarget[1].value

      if(isSummary == 1){
        axios({
          method:'post',
          url: '/api/form/update-final-supervisor-remarks',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
          },
          data:{
            "pip_id": pip_id,
            "remarks": remarks
          }
        })
      }else{
        axios({
          method:'post',
          url: '/api/form/update-supervisor-remarks',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
          },
          data:{
            "pip_id": pip_id,
            "goal_id": goal_id,
            "remarks": remarks
          }
        })
      }
      
      axios({
        method:'post',
        url: '/api/upload-file',
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json' 
        },
        data: formData
      })
      .then(async response => {
        const uploadDBres = await axios({
          method:'post',
          url: '/api/upload-file/save-to-db',
          headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
          },
          data:{
            "file": response.data.file,
            "pip_id": pip_id,
            "goal_id": goal_id,
            "period": period,
            "isSummary": isSummary,
          }
        })
        setButtonControl(false)
        setToastMessage(["Upload Successful", "", "success"])
      })
      
    }
    const handleShowPIPtoEmployee = (event) => {
      event.preventDefault()
      if(confirm("Show Final result to Employee?")){
        axios({
          method:'post',
          url: '/api/form/update-show-pip-to-employee',
          headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
          },
          data: {
            "pip_id": pipData.formID,
            "value": 1
          } 
        }).catch(err => {
          console.log(err)
        })
      }
    }
    return (
      <>
      <Container maxW="container.lg">
        <Box
          bg="white"
          px={4}
          boxShadow={'xl'}
          mb={4}
          borderColor={useColorModeValue('gray.800', 'gray.500')}
        >
          <HStack className="row" w={"100%"}>
            <Heading fontSize="4xl" fontWeight="0px">Performance Improvement Plan</Heading>
          </HStack>
          <Divider/>
          <Grid
            h='auto'
            templateColumns='repeat(12, 1fr)'
            p={4}
            mb={4}
          >
            <GridItem colSpan={6}>
              <HStack>
                <Text>Ticket #:</Text>
                <Text as={'b'}>{"PIP-"+(pipData.id).toLocaleString('en-US', {minimumIntegerDigits: 4, useGrouping:false})}</Text>
              </HStack>
              <HStack mt="3">
                <Text>Name:</Text>
                <Text as={'b'}>{pipData.employee_name}</Text>
              </HStack>
              <HStack mt="3">
                <Text>Job Title:</Text>
                <Text as={'b'}>{pipData.employee_title}</Text>
              </HStack>
              <HStack mt="3">
                <Text>Department Code:</Text>
                <Text as={'b'}>{pipData.employee_departmentcode}</Text>
              </HStack>
              <HStack mt="3">
                <Text>Mail:</Text>
                <Text as={'b'}>{pipData.employee_mail}</Text>
              </HStack>
            </GridItem>
            <GridItem colSpan={6}>
              <HStack>
                <Text>Status:</Text>
                <Text as={'b'}>{pipData.current_status}</Text>
              </HStack>
              <HStack mt="3">
                <Text>Submission Date:</Text>
                <Text as={'b'}>{new Date(pipData.date_submitted).toLocaleDateString()}</Text>
              </HStack>
              <HStack mt="3">
                <Text>Update Date:</Text>
                <Text as={'b'}>{new Date(pipData.last_updated).toLocaleDateString()}</Text>
              </HStack>
              <HStack mt="3">
                <Text>Originator:</Text>
                <Text as={'b'}>{pipData.originator}</Text>
              </HStack>
            </GridItem>
          </Grid>
          <div hidden={
          ((pipGoalsFirstPeriodCount == goalCount && pipData.originator_ffid == userData.ffID) && 
            (pipData.current_status != "FINAL REVIEW" && pipData.current_status != "PROGRAM CLOSED" &&
             pipData.current_status != "FINAL EMPLOYEE SIGNOFF")
            ) || (userData.isAdmin == "true" && pipData.evaluation_rate == 0) ? false : true}>
            <Divider mb={5}/>
            <form onSubmit={handleEndProgram} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault()}}>
              <Grid 
                templateColumns='repeat(3, 1fr)'
                gap={6}
                mb={8}
                h='200px'
              >
                <GridItem w='100%' h='10' colSpan={1}>
                  <Button type={'submit'} width={"100%"} colorScheme={'red'} isDisabled={buttonControl}>END PROGRAM</Button>
                </GridItem>
                <GridItem w='100%' h='10' colSpan={2}>
                  <FormControl isRequired>
                    <RadioGroup name="end_program_status">
                      <Stack>
                        <Radio value='1'>Released from the Program. Employee has met the requirements of the PIP.</Radio>
                        <Radio value='2'>Reassigned Provided there is business exigency. Eployee will continue to be under PIP based on new deliverables consistent to the new role.</Radio>
                        <Radio value='3'>Suspension/Termination in accordance with RCCD and Article 297 of the Philippine Labor Code</Radio>
                      </Stack>
                    </RadioGroup>
                  </FormControl>
                </GridItem>
              </Grid>
            </form>
          </div>
        </Box>
        <Tabs variant='enclosed' colorScheme='blue'>
        <HStack>
          <TabList mt={4}>
            {
              (() => {
                var rows = []
                for (var i = 0; i < goalCount ; i++){
                  rows.push(
                    <Tab key={i} className={"goalController_"+(i+1)} >
                      Goal #{i+1}
                    </Tab>)
                }
                return rows
              })()
            }
            <Tab
              hidden={(
                pipData.current_status == "FINAL REVIEW" ||
                pipData.current_status == "PROGRAM CLOSED" ||
                pipData.current_status == "FINAL EMPLOYEE SIGNOFF"
              ) ? false : true}
              style={{backgroundColor:"#60f0d8"}}>
              Summary
            </Tab>
          </TabList>
        </HStack>
        <Box
          bg="white"
          px={4}
          boxShadow={'xl'}
          mb={4}
          borderColor={useColorModeValue('gray.800', 'gray.500')}
        >
            <Grid
              h='auto'
              templateColumns='repeat(12, 1fr)'
              gap={4}
              mb={4}
            >
              <GridItem colSpan={12}>
                <TabPanels>
                {
                  (() => {
                    var rows = []
                    for (var i = 0; i < goalCount ; i++){
                      const resFirstPeriod = CAPAFirstPeriod?.filter(item => item.goalID == pipGoals[i].id)
                      const resSecondPeriod = CAPASecondPeriod?.filter(item => item.goalID == pipGoals[i].id)
                      const resThirdPeriod = CAPAThirdPeriod?.filter(item => item.goalID == pipGoals[i].id)
                      const resFirstPeriodAttachment = uploadsFirstPeriod?.filter(item => item.goalID == pipGoals[i].id)
                      const resSecondPeriodAttachment = uploadsSecondPeriod?.filter(item => item.goalID == pipGoals[i].id)
                      const resThirdPeriodAttachment = uploadsThirdPeriod?.filter(item => item.goalID == pipGoals[i].id)
                      /* View Controller for Period Inputs */
                      var defaultAccordion = [0] 
                      var firstPeriodController = false
                      var secondPeriodController = true
                      var thirdPeriodController = true
                      if(pipGoals[i].first_period_actual_end){
                        secondPeriodController = false
                        defaultAccordion = [0, 1]
                        if(pipGoals[i].second_period_actual_end){
                          secondPeriodController = false
                          thirdPeriodController = false
                          defaultAccordion = [0, 1, 2]
                          if(pipGoals[i].third_period_actual_end){
                            secondPeriodController = false
                            thirdPeriodController = false
                            defaultAccordion = [0, 1, 2]
                          }
                        }
                      }
                      // console.log(Date(pipGoals[i].first_period_actual_end).toLocaleDateString('en-CA'))
                      rows.push(
                        <TabPanel key={i}>
                          <FormLabel fontSize='xl'>
                            Actions to Improve Performance
                          </FormLabel>
                          <Grid
                            h="auto"
                            templateRows="repeat(3, 1fr)"
                            templateColumns="repeat(1, 1fr)"
                            mb={8}
                          >
                            <GridItem colSpan={1}>
                              <FormControl variant='floating' id='requestType' mt={2} ml={5}>
                                <Textarea className={"target_area_for_improvement"} mt={6} ml={4} width={'xl'} value={pipGoals[i].target_area_for_improvement} minHeight={"150px"} readOnly/>
                                <FormLabel fontSize={'24px'}>Target Area for Improvement</FormLabel>
                              </FormControl>
                            </GridItem>
                            <GridItem colSpan={1}>
                              <FormControl variant='floating' id='requestType' mt={2} ml={5}>
                                <Textarea className={"expected_standards_of_performance"} mt={6} ml={4} width={'xl'} value={pipGoals[i].expected_standards_of_performance} minHeight={"150px"} readOnly/>
                                <FormLabel fontSize={'24px'}>Expected Standards of Performance</FormLabel>
                              </FormControl>
                            </GridItem>
                            <GridItem colSpan={1}>
                              <FormControl variant='floating' id='requestType' mt={2} ml={5}>
                                <Textarea className={"target"} mt={6} ml={4} width={'xl'} value={pipGoals[i].target} minHeight={"150px"} readOnly/>
                                <FormLabel fontSize={'24px'}>Target</FormLabel>
                              </FormControl>
                            </GridItem>
                            <GridItem colSpan={1}>
                              <FormControl variant='floating' id='requestType' mt={2} ml={5}>
                                <Textarea className={"action_plan_to_improve_performance"} mt={6} ml={4} width={'xl'} value={pipGoals[i].action_plan_to_improve_performance} minHeight={"150px"} readOnly/>
                                <FormLabel fontSize={'24px'}>Action Plan to Improve Performance</FormLabel>
                              </FormControl>
                            </GridItem>
                            <GridItem colSpan={1}>
                              <FormControl variant='floating' id='requestType' mt={2} ml={5}>
                                <Textarea className={"support"} mt={6} ml={4} width={'xl'} value={pipGoals[i].support} minHeight={"150px"} readOnly/>
                                <FormLabel fontSize={'24px'}>Support</FormLabel>
                              </FormControl>
                            </GridItem>
                          </Grid>
                          <FormLabel fontSize='xl' mt={5}>
                            Expected and Actual Date of Periodic Review
                          </FormLabel>
                          <Accordion defaultIndex={defaultAccordion} allowMultiple>
                            <AccordionItem isDisabled={firstPeriodController}>
                              <h2>
                                <AccordionButton 
                                  _expanded={{ bg: 'teal', color: 'white' }}
                                  borderColor={useColorModeValue('gray.800', 'gray.500')}
                                  borderWidth={'1px'}
                                >
                                  <Box flex='1' textAlign='left'>
                                    First Period
                                  </Box>
                                  <AccordionIcon />
                                </AccordionButton>
                              </h2>
                              <AccordionPanel 
                                pb={4} 
                                
                              >
                                <form onSubmit={handlePeriod} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault()}}>
                                  <Grid
                                    templateColumns='repeat(8, 1fr)'
                                    gap={4}
                                    px={4}
                                    pt={3}
                                  >
                                    <GridItem colSpan={2}>
                                      <FormLabel fontSize='md'>Expected Start</FormLabel>
                                      <FormControl variant='floating' id='requestType' mt={2}>
                                        <Input className={"first_expected_start_date"} mt={4} type="text" defaultValue={new Date(pipGoals[i].first_period_expected_start).toLocaleDateString()} readOnly/>
                                        <FormLabel>1st Period</FormLabel>
                                      </FormControl>
                                    </GridItem>
                                    <GridItem colSpan={2}>
                                      <FormLabel fontSize='md'>Expected End</FormLabel>
                                      <FormControl variant='floating' id='requestType' mt={2}>
                                        <Input className={"first_expected_end_date"} mt={4} type="text" defaultValue={new Date(pipGoals[i].first_period_expected_end).toLocaleDateString()} readOnly/>
                                        <FormLabel>1st Period</FormLabel>
                                      </FormControl>
                                    </GridItem>
                                    <GridItem colSpan={2}>
                                      <FormLabel fontSize='md'>Actual Start</FormLabel>
                                        <FormControl variant='floating' id='requestType' mt={2}>
                                          <Input 
                                            name={"date"} 
                                            data-query={'first_period_actual_start'} 
                                            data-pip-id={pipData.id}
                                            id={pipGoals[i].id} 
                                            mt={4} 
                                            type="date" 
                                            defaultValue={pipGoals[i].first_period_actual_start ? new Date(pipGoals[i].first_period_actual_start).toISOString().substring(0, 10) : null} 
                                            readOnly={userData.ffID == pipData.originator_ffid ? false : true}
                                            data-for-mail={false}
                                          />
                                          <FormLabel>1st Period</FormLabel>
                                        </FormControl>
                                    </GridItem>
                                    <GridItem colSpan={2}>
                                      <FormLabel fontSize='md'>Actual End</FormLabel>
                                        <FormControl variant='floating' id='requestType' mt={2}>
                                          <Input 
                                            name={"date"}
                                            data-query={'first_period_actual_end'} 
                                            data-pip-id={pipData.id}
                                            id={pipGoals[i].id} 
                                            mt={4} 
                                            type="date" 
                                            defaultValue={pipGoals[i].first_period_actual_end ? new Date(pipGoals[i].first_period_actual_end).toISOString().substring(0, 10): null} 
                                            readOnly={userData.ffID == pipData.originator_ffid ? false : true}
                                            data-for-mail={true}
                                          />
                                          <FormLabel>1st Period</FormLabel>
                                        </FormControl>
                                    </GridItem>
                                  </Grid>
                                  <div
                                    hidden={userData.ffID == pipData.originator_ffid ? false : true} 
                                  >
                                    <Box
                                      borderRadius='lg' 
                                      overflow='hidden'
                                      borderWidth='1px'
                                      m={4}
                                      p={5}
                                    >
                                      <Grid
                                        templateColumns='repeat(8, 1fr)'
                                        gap={4}
                                        px={4}
                                      >
                                        <GridItem colSpan={4}>
                                          <FormLabel fontSize='md'>Supervisor Remarks</FormLabel>
                                            <FormControl variant='floating' id='requestType' mt={2}>
                                              <Input 
                                                name={"file"}
                                                data-pip-id={pipGoals[i].pip_id}
                                                data-goal-id={pipGoals[i].id}
                                                data-is-summary={0}
                                                id={1} 
                                                mt={4} 
                                                type="file"
                                                multiple 
                                              />
                                              <FormLabel>Attach Evidence</FormLabel>
                                            </FormControl>
                                            <FormControl variant='floating' id='requestType' mt={2} >
                                              <Textarea 
                                                name={"first_period_supervisor_remarks"}
                                                data-query={'first_period_remarks'} 
                                                id={pipGoals[i].id} 
                                                mt={4} 
                                                type="text"
                                              >
                                                {
                                                  pipGoals[i].first_period_supervisor_remarks
                                                }
                                              </Textarea>
                                              <FormLabel>Remarks</FormLabel>
                                            </FormControl>
                                        </GridItem>
                                        <GridItem 
                                          colSpan={4} 
                                          borderColor={'900.grey'}
                                          borderWidth={'1px'}
                                          maxWidth={"460px"}
                                        >
                                          <Grid
                                            margin={2}
                                            gap={2}
                                          >
                                            {resFirstPeriodAttachment?.map((uploads, i) => (
                                              <GridItem colSpan={1} key={i}>
                                                <Tag
                                                  size={'sm'}
                                                  key={'sm'}
                                                  borderRadius='full'
                                                  variant='solid'
                                                  colorScheme='green'
                                                  style={{"wordWrap": "break-word"}}
                                                  maxWidth={"300px"}
                                                >
                                                  <TagLabel title={'test.png'}>{uploads.uploadName}</TagLabel>
                                                  <a 
                                                    href={(window.location.origin).substring(0,(window.location.origin).length - 5)+`:`+process.env.NEXT_PUBLIC_DOWNLOAD_PORT+`/`+uploads.uploadName} 
                                                    target="_blank"
                                                  >
                                                    <IconButton 
                                                      icon={<DownloadIcon />} 
                                                      size={'xs'} 
                                                      colorScheme={'green'} 
                                                    />
                                                  </a>
                                                </Tag>
                                              </GridItem>

                                            ))}
                                          </Grid>
                                        </GridItem>
                                      </Grid>
                                    </Box>
                                  </div>
                                  <Button 
                                    colorScheme={'green'}
                                    type={"submit"}
                                    mt={4}
                                    isDisabled={buttonControl}
                                    hidden={userData.ffID == pipData.originator_ffid ? false : true}
                                  >
                                      Update First Period
                                  </Button>
                                </form>
                                {/*  */}
                                <Checkbox 
                                  mt={5}
                                  id={pipGoals[i].id}  
                                  name="has_first_period_capa"
                                  onChange={handleHasCAPA}
                                  defaultChecked={pipGoals[i].has_first_period_capa == 1 ? true : false}
                                  isDisabled={buttonControl}
                                  hidden={userData.ffID == pipData.originator_ffid ? false : true}
                                >
                                  Employee did not met Goal/s
                                </Checkbox>
                                <div hidden={pipGoals[i].has_first_period_capa == 1 ? false : true}>
                                  <Container 
                                    maxW="container.lg" 
                                    borderColor={useColorModeValue('gray.800', 'gray.500')}
                                    borderWidth={'1px'}
                                    mt={4}
                                  >
                                    <FormLabel fontSize='xl' mt={2}>
                                      CAPA
                                    </FormLabel>
                                    <TableContainer>
                                        <Table size={'sm'}>
                                          <Thead>
                                            <Tr>
                                              <Th>Task</Th>
                                              <Th>Expected Start Date</Th>
                                              <Th>Expected End Date</Th>
                                            </Tr>
                                          </Thead>
                                          <Tbody>
                                            {resFirstPeriod?.map((item, i) => (
                                              <Tr key={i}>
                                                <Td style={{"whiteSpace": "pre-wrap"}}>{item.task}</Td>
                                                <Td>{new Date(item.start_date).toLocaleDateString()}</Td>
                                                <Td>{new Date(item.end_date).toLocaleDateString()}</Td>
                                                <Td style={{"whiteSpace": "pre-wrap"}}>
                                                  <form onSubmit={removeCAPA} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault()}}>
                                                    <HStack>
                                                      <Box>
                                                        <IconButton 
                                                          title='remove CAPA' 
                                                          colorScheme={'red'} 
                                                          icon={<MinusIcon />} 
                                                          id={item.id}
                                                          type="submit"
                                                          isDisabled={buttonControl}
                                                        />
                                                      </Box>
                                                    </HStack>
                                                  </form>
                                                </Td>
                                              </Tr>
                                            ))}
                                          </Tbody>
                                        </Table>
                                    </TableContainer>
                                  </Container>
                                  <div hidden={userData.ffID == pipData.originator_ffid ? false : true}>
                                    <form onSubmit={addCAPA} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault()}}>
                                      <HStack mt={6}>
                                        <Box width={"35%"}>
                                          <FormControl variant='floating' isRequired>
                                            <Input name="task" style={{"whiteSpace": "pre-wrap"}} mt={4}/>
                                            <FormLabel>Task</FormLabel>
                                          </FormControl>
                                        </Box>
                                        <Box width={"25%"}>
                                          <FormControl variant='floating' isRequired>
                                            <Input type="date" name="expected_start_date" mt={4} />
                                            <FormLabel>Expected Start Date</FormLabel>      
                                          </FormControl>
                                        </Box>
                                        <Box width={"25%"}>
                                          <FormControl variant='floating' isRequired>
                                            <Input type="date" name="expected_end_date" mt={4}/>
                                            <FormLabel>Expected End Date</FormLabel>      
                                          </FormControl>
                                        </Box>
                                        <Box width={"15%"}>
                                          <Button 
                                            title='Add CAPA' 
                                            colorScheme={'green'} 
                                            data-pip-id={pipGoals[i].pip_id}
                                            data-goal-id={pipGoals[i].id}
                                            id={1}
                                            type="submit"
                                            isDisabled={buttonControl}
                                            mt={4}
                                          >
                                            ADD CAPA<AddIcon ml={4}/>
                                          </Button>
                                        </Box>
                                      </HStack>
                                    </form>            
                                  </div>
                                </div>
                                <Divider mt={4}/>
                                <div 
                                  hidden={(pipGoals[i].first_period_actual_start && pipGoals[i].first_period_actual_end) ? false : true}
                                >
                                  <FormLabel fontSize='xl' mt={5}>
                                    Review Sign-off
                                  </FormLabel>
                                  <TableContainer>
                                    <Table size={'sm'}>
                                      <Thead>
                                        <Tr>
                                          <Th></Th>
                                          <Th>Name</Th>
                                          <Th>Status</Th>
                                          <Th>Date</Th>
                                          <Th>Remarks</Th>
                                        </Tr>
                                      </Thead>
                                      <Tbody>
                                        <Tr>
                                          <Td>Employee</Td>
                                          <Td style={{"whiteSpace": "pre-wrap"}}>{pipData.employee_name}</Td>
                                          <Td>{pipGoals[i].first_period_employee_approval}</Td>
                                          <Td>{pipGoals[i].first_period_employee_approval_date ? new Date(pipGoals[i].first_period_employee_approval_date).toLocaleDateString('en-CA') : ""}</Td>
                                          <Td style={{"whiteSpace": "pre-wrap"}}>
                                          {
                                            (()=>{
                                              return(userData.ffID == pipData.employee_ffid ? (
                                              <div>
                                                <form onSubmit={handleApproval} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault()}}>
                                                  <HStack>
                                                    <Box>
                                                      <Input
                                                        name={'remarks'} 
                                                        size={"sm"}
                                                        defaultValue={pipGoals[i].first_period_employee_approval_remarks}
                                                        id={pipGoals[i].id} 
                                                        data-remarks-query={'first_period_employee_approval_remarks'}
                                                        data-approval-query={'first_period_employee_approval'}
                                                        data-date-query={'first_period_employee_approval_date'}
                                                      />
                                                    </Box>
                                                    <Box>
                                                      <IconButton 
                                                        title='ACKNOWLEDGED' 
                                                        colorScheme={'green'} 
                                                        icon={<CheckIcon />} 
                                                        onClick={() => {setSignoffStatus('ACKNOWLEDGED')}} 
                                                        type="submit"
                                                        isDisabled={buttonControl}
                                                      />
                                                    </Box>
                                                  </HStack>
                                                </form>
                                              </div>
                                              ) : pipGoals[i].first_period_employee_approval_remarks)
                                            })()
                                          }      
                                          </Td>
                                        </Tr>
                                        <Tr>
                                          <Td>Department Manager</Td>
                                          <Td style={{"whiteSpace": "pre-wrap"}}>{pipData.department_head_name}</Td>
                                          <Td>{pipGoals[i].first_period_department_head_approval}</Td>
                                          <Td>{pipGoals[i].first_period_department_head_approval_date ? new Date(pipGoals[i].first_period_department_head_approval_date).toLocaleDateString('en-CA') : ""}</Td>
                                          <Td style={{"whiteSpace": "pre-wrap"}}>
                                          {
                                            (()=>{
                                              return(userData.ffID == pipData.department_head_ffid ? (
                                              <div>
                                                <form onSubmit={handleApproval} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault()}}>
                                                  <HStack>
                                                    <Box>
                                                      <Input
                                                        name={'remarks'} 
                                                        size={"sm"}
                                                        defaultValue={pipGoals[i].first_period_department_head_approval_remarks}
                                                        id={pipGoals[i].id} 
                                                        data-remarks-query={'first_period_department_head_approval_remarks'}
                                                        data-approval-query={'first_period_department_head_approval'}
                                                        data-date-query={'first_period_department_head_approval_date'}
                                                      />
                                                    </Box>
                                                    <Box>
                                                      <IconButton 
                                                        title='ACKNOWLEDGED' 
                                                        colorScheme={'green'} 
                                                        icon={<CheckIcon />} 
                                                        onClick={() => {setSignoffStatus('ACKNOWLEDGED')}} 
                                                        type="submit"
                                                        isDisabled={buttonControl}
                                                      />
                                                    </Box>
                                                  </HStack>
                                                </form>
                                              </div>
                                              ) : pipGoals[i].first_period_department_head_approval_remarks)
                                            })()
                                          }
                                          </Td>
                                        </Tr>
                                      </Tbody>
                                    </Table>
                                  </TableContainer>
                                </div>
                              </AccordionPanel>
                            </AccordionItem>
                            <AccordionItem isDisabled={secondPeriodController}>
                              <h2>
                                <AccordionButton
                                  _expanded={{ bg: 'teal', color: 'white' }}
                                  borderColor={useColorModeValue('gray.800', 'gray.500')}
                                  borderWidth={'1px'}
                                >
                                  <Box flex='1' textAlign='left'>
                                    Second Period
                                  </Box>
                                  <AccordionIcon />
                                </AccordionButton>
                              </h2>
                              <AccordionPanel 
                                pb={4} 
                              >
                              <form onSubmit={handlePeriod} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault()}}>
                                <Grid
                                  templateColumns='repeat(8, 1fr)'
                                  gap={4}
                                  px={4}
                                  pt={3}
                                >
                                  <GridItem colSpan={2}>
                                    <FormLabel fontSize='md'>Expected Start</FormLabel>
                                    <FormControl variant='floating' id='requestType' mt={2}>
                                      <Input className={"second_expected_start_date"} mt={4} width={'4xs'} type="text" value={new Date(pipGoals[i].second_period_expected_start).toLocaleDateString()} readOnly/>
                                      <FormLabel>2nd Period</FormLabel>
                                    </FormControl>
                                  </GridItem>
                                  <GridItem colSpan={2}>
                                    <FormLabel fontSize='md'>Expected End</FormLabel>
                                    <FormControl variant='floating' id='requestType' mt={2}>
                                      <Input className={"second_expected_end_date"} mt={4} width={'4xs'} type="text" value={new Date(pipGoals[i].second_period_expected_end).toLocaleDateString()} readOnly/>
                                      <FormLabel>2nd Period</FormLabel>
                                    </FormControl>
                                  </GridItem>
                                  <GridItem colSpan={2}>
                                    <FormLabel fontSize='md'>Actual Start</FormLabel>
                                      <FormControl variant='floating' id='requestType' mt={2}>
                                        <Input 
                                          name={"date"}
                                          data-query={'second_period_actual_start'} 
                                          data-pip-id={pipData.id}
                                          id={pipGoals[i].id} 
                                          mt={4} 
                                          type="date" 
                                          defaultValue={pipGoals[i].second_period_actual_start ? new Date(pipGoals[i].second_period_actual_start).toISOString().substring(0, 10) : null}
                                          readOnly={userData.ffID == pipData.originator_ffid ? false : true} 
                                          data-for-mail={false}
                                        />
                                        <FormLabel>2nd Period</FormLabel>
                                      </FormControl>
                                  </GridItem>
                                  <GridItem colSpan={2}>
                                    <FormLabel fontSize='md'>Actual End</FormLabel>
                                      <FormControl variant='floating' id='requestType' mt={2}>
                                        <Input 
                                          name={"date"}
                                          data-query={'second_period_actual_end'} 
                                          data-pip-id={pipData.id}
                                          id={pipGoals[i].id} 
                                          mt={4} 
                                          type="date" 
                                          defaultValue={pipGoals[i].second_period_actual_end ? new Date(pipGoals[i].second_period_actual_end).toISOString().substring(0, 10) : null}
                                          readOnly={userData.ffID == pipData.originator_ffid ? false : true} 
                                          data-for-mail={true}
                                        />
                                        <FormLabel>2nd Period</FormLabel>
                                      </FormControl>
                                  </GridItem>
                                </Grid>
                                <div 
                                  hidden={userData.ffID == pipData.originator_ffid ? false : true}
                                >
                                  <Box
                                    borderRadius='lg' 
                                    overflow='hidden'
                                    borderWidth='1px'
                                    m={4}
                                    p={5}
                                  >
                                    <Grid
                                      templateColumns='repeat(8, 1fr)'
                                      gap={4}
                                      px={4}
                                    >
                                      <GridItem colSpan={4}>
                                        <FormLabel fontSize='md'>Supervisor Remarks</FormLabel>
                                          <FormControl variant='floating' id='requestType' mt={2}>
                                            <Input 
                                              name={"file"}
                                              data-query={'first_period_actual_end'} 
                                              data-pip-id={pipGoals[i].pip_id}
                                              data-goal-id={pipGoals[i].id}
                                              data-is-summary={0}
                                              id={2} 
                                              mt={4} 
                                              type="file"
                                              multiple 
                                            />
                                            <FormLabel>Attach Evidence</FormLabel>
                                          </FormControl>
                                          <FormControl variant='floating' id='requestType' mt={2}>
                                            <Textarea 
                                              name={"second_period_supervisor_remarks"}
                                              data-query={'second_period_remarks'} 
                                              id={pipGoals[i].id} 
                                              mt={4} 
                                              type="text"
                                            >
                                              {
                                                pipGoals[i].second_period_supervisor_remarks
                                              }
                                            </Textarea>
                                            <FormLabel>Remarks</FormLabel>
                                          </FormControl>
                                          
                                      </GridItem>
                                      <GridItem colSpan={4} 
                                        borderColor={'900.grey'}
                                        borderWidth={'1px'}
                                        maxWidth={"460px"}
                                      >
                                        <Grid
                                          margin={2}
                                          gap={2}
                                        >
                                          {resSecondPeriodAttachment?.map((uploads, i) => (
                                            <GridItem colSpan={1} key={i}>
                                              <Tag
                                                size={'sm'}
                                                key={'sm'}
                                                borderRadius='full'
                                                variant='solid'
                                                colorScheme='green'
                                                style={{"wordWrap": "break-word"}}
                                                maxWidth={"300px"}
                                              >
                                                <TagLabel>{uploads.uploadName}</TagLabel>
                                                <a 
                                                  href={(window.location.origin).substring(0,(window.location.origin).length - 5)+`:`+process.env.NEXT_PUBLIC_DOWNLOAD_PORT+`/`+uploads.uploadName} 
                                                  target="_blank"
                                                >
                                                  <IconButton 
                                                    icon={<DownloadIcon />} 
                                                    size={'xs'} 
                                                    colorScheme={'green'} 
                                                  />
                                                </a>
                                              </Tag>
                                            </GridItem>

                                          ))}
                                        </Grid>
                                      </GridItem>
                                    </Grid>          
                                  </Box>
                                </div>
                                <Button 
                                  colorScheme={'green'} 
                                  type={"submit"} 
                                  mt={4}
                                  isDisabled={buttonControl}
                                  hidden={userData.ffID == pipData.originator_ffid ? false : true}
                                >
                                  Update Second Period
                                </Button>
                              </form>

                                <Checkbox 
                                  mt={5}
                                  id={pipGoals[i].id} 
                                  name="has_second_period_capa"
                                  onChange={handleHasCAPA}
                                  defaultChecked={pipGoals[i].has_second_period_capa == 1 ? true : false}
                                  isDisabled={buttonControl}
                                  hidden={userData.ffID == pipData.originator_ffid ? false : true}
                                >
                                  Employee did not met Goal/s
                                </Checkbox>
                                <div hidden={pipGoals[i].has_second_period_capa == 1 ? false : true}>
                                  <Container 
                                    maxW="container.lg" 
                                    borderColor={useColorModeValue('gray.800', 'gray.500')}
                                    borderWidth={'1px'}
                                    mt={4}
                                  >
                                    <FormLabel fontSize='xl' mt={2}>
                                      CAPA
                                    </FormLabel>
                                    <TableContainer>
                                        <Table size={'sm'}>
                                          <Thead>
                                            <Tr>
                                              <Th>Task</Th>
                                              <Th>Expected Start Date</Th>
                                              <Th>Expected End Date</Th>
                                            </Tr>
                                          </Thead>
                                          <Tbody>
                                            {resSecondPeriod?.map((item, i) => (
                                              <Tr key={i}>
                                                <Td style={{"whiteSpace": "pre-wrap"}}>{item.task}</Td>
                                                <Td>{new Date(item.start_date).toLocaleDateString()}</Td>
                                                <Td>{new Date(item.end_date).toLocaleDateString()}</Td>
                                                <Td style={{"whiteSpace": "pre-wrap"}}>
                                                  <form onSubmit={removeCAPA} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault()}}>
                                                    <HStack>
                                                      <Box>
                                                        <IconButton 
                                                          title='remove CAPA' 
                                                          colorScheme={'red'} 
                                                          icon={<MinusIcon />} 
                                                          id={item.id} 
                                                          type="submit"
                                                          isDisabled={buttonControl}
                                                        />
                                                      </Box>
                                                    </HStack>
                                                  </form>
                                                </Td>
                                              </Tr>
                                            ))}
                                          </Tbody>
                                        </Table>
                                    </TableContainer>
                                  </Container>
                                  <div hidden={userData.ffID == pipData.originator_ffid ? false : true}>
                                    <form onSubmit={addCAPA} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault()}}>
                                      <HStack mt={6}>
                                        <Box width={"35%"}>
                                          <FormControl variant='floating' isRequired>
                                            <Input name="task" style={{"whiteSpace": "pre-wrap"}} mt={4}/>
                                            <FormLabel>Task</FormLabel>
                                          </FormControl>
                                        </Box>
                                        <Box width={"25%"}>
                                          <FormControl variant='floating' isRequired>
                                            <Input type="date" name="expected_start_date" mt={4} />
                                            <FormLabel>Expected Start Date</FormLabel>      
                                          </FormControl>
                                        </Box>
                                        <Box width={"25%"}>
                                          <FormControl variant='floating' isRequired>
                                            <Input type="date" name="expected_end_date" mt={4}/>
                                            <FormLabel>Expected End Date</FormLabel>      
                                          </FormControl>
                                        </Box>
                                        <Box width={"15%"}>
                                          <Button 
                                            title='Add CAPA' 
                                            colorScheme={'green'} 
                                            data-pip-id={pipGoals[i].pip_id}
                                            data-goal-id={pipGoals[i].id}
                                            id={2}
                                            type="submit"
                                            isDisabled={buttonControl}
                                            mt={4}
                                          >
                                            ADD CAPA<AddIcon ml={4}/>
                                          </Button>
                                        </Box>
                                      </HStack>
                                    </form>          
                                  </div>
                                </div>
                                <Divider mt={4}/>
                                <div hidden={(pipGoals[i].second_period_actual_start && pipGoals[i].second_period_actual_end) ? false : true}>
                                  <FormLabel fontSize='xl' mt={5}>
                                    Review Sign-off
                                  </FormLabel>
                                  <TableContainer>
                                    <Table size={'sm'}>
                                      <Thead>
                                        <Tr>
                                          <Th></Th>
                                          <Th>Name</Th>
                                          <Th>Status</Th>
                                          <Th>Date</Th>
                                          <Th>Remarks</Th>
                                        </Tr>
                                      </Thead>
                                      <Tbody>
                                        <Tr>
                                          <Td>Employee</Td>
                                          <Td style={{"whiteSpace": "pre-wrap"}}>{pipData.employee_name}</Td>
                                          <Td>{pipGoals[i].second_period_employee_approval}</Td>
                                          <Td>{pipGoals[i].second_period_employee_approval_date ? new Date(pipGoals[i].second_period_employee_approval_date).toLocaleDateString('en-CA') : ""}</Td>
                                          <Td style={{"whiteSpace": "pre-wrap"}}>
                                          {
                                            (()=>{
                                              return(userData.ffID == pipData.employee_ffid ? (
                                              <div>
                                                <form onSubmit={handleApproval} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault()}}>
                                                  <HStack>
                                                    <Box>
                                                      <Input
                                                        name={'remarks'} 
                                                        size={"sm"}
                                                        defaultValue={pipGoals[i].second_period_employee_approval_remarks}
                                                        id={pipGoals[i].id} 
                                                        data-remarks-query={'second_period_employee_approval_remarks'}
                                                        data-approval-query={'second_period_employee_approval'}
                                                        data-date-query={'second_period_employee_approval_date'}
                                                      />
                                                    </Box>
                                                    <Box>
                                                      <IconButton 
                                                        title='ACKNOWLEDGED' 
                                                        colorScheme={'green'} 
                                                        icon={<CheckIcon />} 
                                                        onClick={() => {setSignoffStatus('ACKNOWLEDGED')}} 
                                                        type="submit"
                                                        isDisabled={buttonControl}
                                                      />
                                                    </Box>
                                                  </HStack>
                                                </form>
                                              </div>
                                              ) : pipGoals[i].second_period_employee_approval_remarks)
                                            })()
                                          } 
                                          </Td>
                                        </Tr>
                                        <Tr>
                                          <Td>Department Manager</Td>
                                          <Td style={{"whiteSpace": "pre-wrap"}}>{pipData.department_head_name}</Td>
                                          <Td>{pipGoals[i].second_period_department_head_approval}</Td>
                                          <Td>{pipGoals[i].second_period_department_head_approval_date ? new Date(pipGoals[i].second_period_department_head_approval_date).toLocaleDateString('en-CA') : ""}</Td>
                                          <Td style={{"whiteSpace": "pre-wrap"}}>
                                          {
                                            (()=>{
                                              return(userData.ffID == pipData.department_head_ffid ? (
                                              <div>
                                                <form onSubmit={handleApproval} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault()}}>
                                                <HStack>
                                                  <Box>
                                                    <Input
                                                      name={'remarks'} 
                                                      size={"sm"}
                                                      defaultValue={pipGoals[i].second_period_department_head_approval_remarks}
                                                      id={pipGoals[i].id} 
                                                      data-remarks-query={'second_period_department_head_approval_remarks'}
                                                      data-approval-query={'second_period_department_head_approval'}
                                                      data-date-query={'second_period_department_head_approval_date'}
                                                    />
                                                  </Box>
                                                  <Box>
                                                    <IconButton 
                                                      title='ACKNOWLEDGED' 
                                                      colorScheme={'green'} 
                                                      icon={<CheckIcon />} 
                                                      onClick={() => {setSignoffStatus('ACKNOWLEDGED')}} 
                                                      type="submit"
                                                      isDisabled={buttonControl}
                                                    />
                                                  </Box>
                                                </HStack>
                                              </form>
                                              </div>
                                              ) : pipGoals[i].second_period_department_head_approval_remarks)
                                            })()
                                          }
                                          </Td>
                                        </Tr>
                                      </Tbody>
                                    </Table>
                                  </TableContainer>
                                </div>
                              </AccordionPanel>
                            </AccordionItem>
                            <AccordionItem isDisabled={thirdPeriodController}>
                              <h2>
                                <AccordionButton
                                  _expanded={{ bg: 'teal', color: 'white' }}
                                  borderColor={useColorModeValue('gray.800', 'gray.500')}
                                  borderWidth={'1px'}
                                >
                                  <Box flex='1' textAlign='left'>
                                    Third Period
                                  </Box>
                                  <AccordionIcon />
                                </AccordionButton>
                              </h2>
                              <AccordionPanel 
                                pb={4}
                              >
                              <form onSubmit={handlePeriod} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault()}}>
                                <Grid
                                  templateColumns='repeat(8, 1fr)'
                                  gap={4}
                                  px={4}
                                  pt={3}
                                >
                                  <GridItem colSpan={2}>
                                    <FormLabel fontSize='md'>Expected Start</FormLabel>
                                    <FormControl variant='floating' id='requestType' mt={2}>
                                      <Input className={"third_expected_start_date"} mt={4} width={'4xs'} type="text" value={new Date(pipGoals[i].third_period_expected_start).toLocaleDateString()} readOnly/>
                                      <FormLabel>3rd Period</FormLabel>
                                    </FormControl>
                                  </GridItem>
                                  <GridItem colSpan={2}>
                                    <FormLabel fontSize='md'>Expected End</FormLabel>
                                    <FormControl variant='floating' id='requestType' mt={2}>
                                      <Input className={"third_expected_end_date"} mt={4} width={'4xs'} type="text" value={new Date(pipGoals[i].third_period_expected_end).toLocaleDateString()} readOnly/>
                                      <FormLabel>3rd Period</FormLabel>
                                    </FormControl>
                                  </GridItem>
                                  <GridItem colSpan={2}>
                                    <FormLabel fontSize='md'>Actual Start</FormLabel>
                                      <FormControl variant='floating' id='requestType' mt={2}>
                                        <Input 
                                          name={"date"}
                                          data-query={'third_period_actual_start'} 
                                          data-pip-id={pipData.id}
                                          id={pipGoals[i].id} 
                                          mt={4} 
                                          type="date" 
                                          defaultValue={pipGoals[i].third_period_actual_start ? new Date(pipGoals[i].third_period_actual_start).toISOString().substring(0, 10) : null}
                                          readOnly={userData.ffID == pipData.originator_ffid ? false : true} 
                                          data-for-mail={false}
                                        />
                                        <FormLabel>3rd Period</FormLabel>
                                      </FormControl>
                                  </GridItem>
                                  <GridItem colSpan={2}>
                                    <FormLabel fontSize='md'>Actual End</FormLabel>
                                      <FormControl variant='floating' id='requestType' mt={2}>
                                        <Input 
                                          name={"date"}
                                          data-query={'third_period_actual_end'} 
                                          data-pip-id={pipData.id}
                                          id={pipGoals[i].id} 
                                          mt={4} 
                                          type="date" 
                                          defaultValue={pipGoals[i].third_period_actual_end ? new Date(pipGoals[i].third_period_actual_end).toISOString().substring(0, 10) : null}
                                          readOnly={userData.ffID == pipData.originator_ffid ? false : true}  
                                          data-for-mail={true}
                                        />
                                        <FormLabel>3rd Period</FormLabel>
                                      </FormControl>
                                  </GridItem>
                                  </Grid>
                                  <div 
                                    hidden={userData.ffID == pipData.originator_ffid ? false : true}
                                  >
                                    <Box
                                      borderRadius='lg' 
                                      overflow='hidden'
                                      borderWidth='1px'
                                      m={4}
                                      p={5}
                                    >
                                      <Grid
                                        templateColumns='repeat(8, 1fr)'
                                        gap={4}
                                        px={4}
                                      >
                                        <GridItem colSpan={4}>
                                          <FormLabel fontSize='md'>Supervisor Remarks</FormLabel>
                                            <FormControl variant='floating' id='requestType' mt={2}>
                                              <Input 
                                                name={"file"}
                                                data-query={'first_period_actual_end'} 
                                                data-pip-id={pipGoals[i].pip_id}
                                                data-goal-id={pipGoals[i].id}
                                                data-is-summary={0}
                                                id={3} 
                                                mt={4} 
                                                type="file"
                                                multiple 
                                              />
                                              <FormLabel>Attach Evidence</FormLabel>
                                            </FormControl>
                                            <FormControl variant='floating' id='requestType' mt={2}>
                                              <Textarea 
                                                name={"third_period_supervisor_remarks"}
                                                data-query={'third_period_remarks'} 
                                                id={pipGoals[i].id} 
                                                mt={4} 
                                                type="text"
                                              >
                                                {
                                                  pipGoals[i].third_period_supervisor_remarks
                                                }
                                              </Textarea>
                                              <FormLabel>Remarks</FormLabel>
                                            </FormControl>
                                            
                                        </GridItem>
                                        <GridItem colSpan={4} 
                                          borderColor={'900.grey'}
                                          borderWidth={'1px'}
                                          maxWidth={"460px"}
                                        >
                                          <Grid
                                            margin={2}
                                            gap={2}
                                          >
                                            {resThirdPeriodAttachment?.map((uploads, i) => (
                                              <GridItem colSpan={1} key={i}>
                                                <Tag
                                                  size={'sm'}
                                                  key={'sm'}
                                                  borderRadius='full'
                                                  variant='solid'
                                                  colorScheme='green'
                                                  style={{"wordWrap": "break-word"}}
                                                  maxWidth={"300px"}
                                                >
                                                  <TagLabel>{uploads.uploadName}</TagLabel>
                                                  <a 
                                                    href={(window.location.origin).substring(0,(window.location.origin).length - 5)+`:`+process.env.NEXT_PUBLIC_DOWNLOAD_PORT+`/`+uploads.uploadName} 
                                                    target="_blank"
                                                  >
                                                    <IconButton 
                                                      icon={<DownloadIcon />} 
                                                      size={'xs'} 
                                                      colorScheme={'green'} 
                                                    />
                                                  </a>
                                                </Tag>
                                              </GridItem>

                                            ))}
                                          </Grid>
                                        </GridItem>
                                      </Grid>
                                    </Box>
                                  </div>
                                  <Button 
                                    colorScheme={'green'} 
                                    type={"submit"} 
                                    mt={4}
                                    isDisabled={buttonControl}
                                    hidden={userData.ffID == pipData.originator_ffid ? false : true}
                                  >
                                    Update Third Period
                                  </Button>
                                </form>
                                <Checkbox 
                                  mt={5} 
                                  id={pipGoals[i].id} 
                                  name="has_third_period_capa"
                                  onChange={handleHasCAPA}
                                  defaultChecked={pipGoals[i].has_third_period_capa == 1 ? true : false}
                                  isDisabled={buttonControl}
                                  hidden={userData.ffID == pipData.originator_ffid ? false : true} 
                                >
                                  Employee did not met Goal/s
                                </Checkbox>
                                <div hidden={pipGoals[i].has_third_period_capa == 1 ? false : true}>
                                  <Container 
                                    maxW="container.lg" 
                                    borderColor={useColorModeValue('gray.800', 'gray.500')}
                                    borderWidth={'1px'}
                                    mt={4}
                                  >
                                    <FormLabel fontSize='xl' mt={2}>
                                      CAPA
                                    </FormLabel>
                                    <TableContainer>
                                        <Table size={'sm'}>
                                          <Thead>
                                            <Tr>
                                              <Th>Task</Th>
                                              <Th>Expected Start Date</Th>
                                              <Th>Expected End Date</Th>
                                            </Tr>
                                          </Thead>
                                          <Tbody>
                                            {resThirdPeriod?.map((item, i) => (
                                              <Tr key={i}>
                                                <Td style={{"whiteSpace": "pre-wrap"}}>{item.task}</Td>
                                                <Td>{new Date(item.start_date).toLocaleDateString()}</Td>
                                                <Td>{new Date(item.end_date).toLocaleDateString()}</Td>
                                                <Td style={{"whiteSpace": "pre-wrap"}}>
                                                  <form onSubmit={removeCAPA} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault()}}>
                                                    <HStack>
                                                      <Box>
                                                        <IconButton 
                                                          title='remove CAPA' 
                                                          colorScheme={'red'} 
                                                          icon={<MinusIcon />} 
                                                          id={item.id} 
                                                          type="submit"
                                                          isDisabled={buttonControl}
                                                        />
                                                      </Box>
                                                    </HStack>
                                                  </form>
                                                </Td>
                                              </Tr>
                                            ))}
                                            {/* <Tr>
                                              <Td style={{"whiteSpace": "pre-wrap"}}><Input/></Td>
                                              <Td><Input type="date"/></Td>
                                              <Td><Input type="date"/></Td>
                                              <Td style={{"whiteSpace": "pre-wrap"}}>
                                                <form onSubmit={addCAPA} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault()}}>
                                                  <HStack>
                                                    <Box>
                                                      <IconButton 
                                                        title='Add CAPA' 
                                                        colorScheme={'green'} 
                                                        icon={<AddIcon />} 
                                                        data-pip-id={pipGoals[i].pip_id}
                                                        data-goal-id={pipGoals[i].id}
                                                        id={3}
                                                        type="submit"
                                                        isDisabled={buttonControl}
                                                      />
                                                    </Box>
                                                  </HStack>
                                                </form>
                                              </Td>
                                            </Tr> */}
                                          </Tbody>
                                        </Table>
                                    </TableContainer>
                                  </Container>
                                  <div hidden={userData.ffID == pipData.originator_ffid ? false : true}>
                                    <form onSubmit={addCAPA} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault()}}>
                                      <HStack mt={6}>
                                        <Box width={"35%"}>
                                          <FormControl variant='floating' isRequired>
                                            <Input name="task" style={{"whiteSpace": "pre-wrap"}} mt={4}/>
                                            <FormLabel>Task</FormLabel>
                                          </FormControl>
                                        </Box>
                                        <Box width={"25%"}>
                                          <FormControl variant='floating' isRequired>
                                            <Input type="date" name="expected_start_date" mt={4} />
                                            <FormLabel>Expected Start Date</FormLabel>      
                                          </FormControl>
                                        </Box>
                                        <Box width={"25%"}>
                                          <FormControl variant='floating' isRequired>
                                            <Input type="date" name="expected_end_date" mt={4}/>
                                            <FormLabel>Expected End Date</FormLabel>      
                                          </FormControl>
                                        </Box>
                                        <Box width={"15%"}>
                                          <Button 
                                            title='Add CAPA' 
                                            colorScheme={'green'} 
                                            data-pip-id={pipGoals[i].pip_id}
                                            data-goal-id={pipGoals[i].id}
                                            id={3}
                                            type="submit"
                                            isDisabled={buttonControl}
                                            mt={4}
                                          >
                                            ADD CAPA<AddIcon ml={4}/>
                                          </Button>
                                        </Box>
                                      </HStack>
                                    </form>            
                                  </div>
                                </div>
                                <Divider mt={4}/>
                                <div hidden={(pipGoals[i].third_period_actual_start && pipGoals[i].third_period_actual_end) ? false : true}>
                                  <FormLabel fontSize='xl' mt={5}>
                                    Review Sign-off
                                  </FormLabel>
                                  <TableContainer>
                                    <Table size={'sm'}>
                                      <Thead>
                                        <Tr>
                                          <Th></Th>
                                          <Th>Name</Th>
                                          <Th>Status</Th>
                                          <Th>Date</Th>
                                          <Th>Remarks</Th>
                                        </Tr>
                                      </Thead>
                                      <Tbody>
                                        <Tr>
                                          <Td>Employee</Td>
                                          <Td style={{"whiteSpace": "pre-wrap"}}>{pipData.employee_name}</Td>
                                          <Td>{pipGoals[i].third_period_employee_approval}</Td>
                                          <Td>{pipGoals[i].third_period_employee_approval_date ? new Date(pipGoals[i].third_period_employee_approval_date).toLocaleDateString('en-CA'):""}</Td>
                                          <Td style={{"whiteSpace": "pre-wrap"}}>
                                          {
                                            (()=>{
                                              return(userData.ffID == pipData.employee_ffid ? (
                                              <div>
                                                <form onSubmit={handleApproval} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault()}}>
                                                <HStack>
                                                  <Box>
                                                    <Input
                                                      name={'remarks'} 
                                                      size={"sm"}
                                                      defaultValue={pipGoals[i].third_period_employee_approval_remarks}
                                                      id={pipGoals[i].id} 
                                                      data-remarks-query={'third_period_employee_approval_remarks'}
                                                      data-approval-query={'third_period_employee_approval'}
                                                      data-date-query={'third_period_employee_approval_date'}
                                                    />
                                                  </Box>
                                                  <Box>
                                                    <IconButton 
                                                      title='ACKNOWLEDGED' 
                                                      colorScheme={'green'} 
                                                      icon={<CheckIcon />} 
                                                      onClick={() => {setSignoffStatus('ACKNOWLEDGED')}} 
                                                      type="submit"
                                                      isDisabled={buttonControl}
                                                    />
                                                  </Box>
                                                </HStack>
                                              </form>
                                              </div>
                                              ) : pipGoals[i].third_period_employee_approval_remarks)
                                            })()
                                          } 
                                          </Td>
                                        </Tr>
                                        {/* <Tr>
                                          <Td>Supervisor</Td>
                                          <Td style={{"whiteSpace": "pre-wrap"}}>{pipData.originator}</Td>
                                          <Td>{pipGoals[i].first_period_supervisor}</Td>
                                          <Td>{pipData.date_submitted}</Td>
                                          <Td style={{"whiteSpace": "pre-wrap"}}>
                                            <HStack>
                                              <Box>
                                                <Input
                                                  name={'first_period_employee_approval_remarks'} 
                                                  size={"sm"}
                                                  defaultValue={pipGoals[i].first_period_employee_approval_remarks}
                                                />
                                              </Box>
                                              <Box>
                                                <IconButton colorScheme={'green'} icon={<CheckIcon />} onClick={(event) => handleApproval(event)} value={"APROVED"}/>
                                                <IconButton colorScheme={'red'} icon={<CloseIcon />}/>
                                              </Box>
                                            </HStack>
                                          </Td>
                                        </Tr> */}
                                        <Tr>
                                          <Td>Department Manager</Td>
                                          <Td style={{"whiteSpace": "pre-wrap"}}>{pipData.department_head_name}</Td>
                                          <Td>{pipGoals[i].third_period_department_head_approval}</Td>
                                          <Td>{pipGoals[i].third_period_department_head_approval_date ? new Date(pipGoals[i].third_period_department_head_approval_date).toLocaleDateString('en-CA') : ""}</Td>
                                          <Td style={{"whiteSpace": "pre-wrap"}}>
                                          {
                                            (()=>{
                                              return(userData.ffID == pipData.department_head_ffid ? (
                                              <div>
                                                <form onSubmit={handleApproval} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault()}}>
                                                  <HStack>
                                                    <Box>
                                                      <Input
                                                        name={'remarks'} 
                                                        size={"sm"}
                                                        defaultValue={pipGoals[i].third_period_department_head_approval_remarks}
                                                        id={pipGoals[i].id} 
                                                        data-remarks-query={'third_period_department_head_approval_remarks'}
                                                        data-approval-query={'third_period_department_head_approval'}
                                                        data-date-query={'third_period_department_head_approval_date'}
                                                      />
                                                    </Box>
                                                    <Box>
                                                      <IconButton 
                                                        title='ACKNOWLEDGED' 
                                                        colorScheme={'green'} 
                                                        icon={<CheckIcon />} 
                                                        onClick={() => {setSignoffStatus('ACKNOWLEDGED')}} 
                                                        type="submit"
                                                        isDisabled={buttonControl}
                                                      />
                                                      {/* <IconButton 
                                                        title='DECLINED' 
                                                        colorScheme={'red'} 
                                                        icon={<CloseIcon />} 
                                                        onClick={() => {setSignoffStatus('DECLINED')}} 
                                                        type="submit"
                                                        isDisabled={buttonControl}
                                                      /> */}
                                                    </Box>
                                                  </HStack>
                                                </form>
                                              </div>
                                              ) : pipGoals[i].third_period_department_head_approval_remarks)
                                            })()
                                          }
                                          </Td>
                                        </Tr>
                                      </Tbody>
                                    </Table>
                                  </TableContainer>
                                </div>
                              </AccordionPanel>
                            </AccordionItem>
                          </Accordion>
                          <Divider />
                        </TabPanel>
                      )
                    }
                    return rows
                  })()
                } 
                  <TabPanel>
                    <Summary 
                      pipData={pipData} 
                      pipGoals={pipGoals} 
                      handleShowPIPtoEmployee={handleShowPIPtoEmployee}
                      userData={userData}
                    />
                      <Box
                        bg="white"
                        px={4}
                        boxShadow={'xl'}
                        mb={4}
                        borderColor={useColorModeValue('gray.800', 'gray.500')}
                        borderWidth={'1px'}
                      >
                        <HStack className="row" w={"100%"}>
                          <Heading fontSize="4xl" fontWeight="0px">Supervisor Remarks</Heading>
                        </HStack>
                        <Divider/>
                        <Grid
                          templateColumns='repeat(8, 1fr)'
                          gap={4}
                          px={4}
                          pt={3}
                          mb={4}
                        >
                          <GridItem colSpan={4}>
                            <form onSubmit={handleFileUpload} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault()}}>
                              <FormControl variant='floating' id='requestType' mt={2} isRequired>
                                <Input 
                                  name={"file"}
                                  data-query={'first_period_actual_end'} 
                                  data-pip-id={pipData.formID}
                                  data-goal-id={0}
                                  data-is-summary={1}
                                  id={0} 
                                  mt={4} 
                                  type="file"
                                  multiple 
                                  //readOnly={userData.ffID == pipData.originator_ffid ? false : true}
                                />
                                <FormLabel>Attach Evidence</FormLabel>
                              </FormControl>
                              <FormControl variant='floating' id='requestType' mt={2}>
                                <Textarea 
                                  name={"supervisor_remarks"}
                                  data-query={'final_period_remarks'} 
                                  // id={pipGoals[i].id} 
                                  mt={4} 
                                  type="text"
                                  //readOnly={userData.ffID == pipData.originator_ffid ? false : true}
                                >
                                  {
                                    pipData.supervisor_remarks
                                  }
                                </Textarea>
                                <FormLabel>Remarks</FormLabel>
                              </FormControl>
                              <Button 
                                colorScheme={'green'} 
                                type={"submit"} 
                                mt={4}
                                isDisabled={buttonControl}
                              >
                                Submit
                              </Button>
                            </form>
                          </GridItem>
                          <GridItem 
                            colSpan={4} 
                            borderColor={'900.grey'}
                            borderWidth={'1px'}
                            maxWidth={"460px"}
                          >
                            <Grid
                              margin={2}
                              gap={2}
                            >
                              {resSummaryAttachment?.map((uploads, i) => (
                                <GridItem colSpan={1} key={i}>
                                  <Tag
                                    size={'sm'}
                                    key={'sm'}
                                    borderRadius='full'
                                    variant='solid'
                                    colorScheme='green'
                                    style={{"wordWrap": "break-word"}}
                                    maxWidth={"300px"}
                                  >
                                    <TagLabel 
                                      title={'test.png'}
                                    >
                                      {uploads.uploadName}
                                    </TagLabel>
                                    <a 
                                      href={(window.location.origin).substring(0,(window.location.origin).length - 5)+`:`+process.env.NEXT_PUBLIC_DOWNLOAD_PORT+`/`+uploads.uploadName} 
                                      target="_blank"
                                    >
                                      <IconButton 
                                        icon={<DownloadIcon />} 
                                        size={'xs'} 
                                        colorScheme={'green'} 
                                      />
                                    </a>
                                  </Tag>
                                </GridItem>
                              ))} 
                            </Grid>
                          </GridItem>   
                        </Grid>
                      </Box>
                      <Box
                        bg="white"
                        px={4}
                        boxShadow={'xl'}
                        // rounded={'lg'}
                        mb={4}
                        borderColor={useColorModeValue('gray.800', 'gray.500')}
                        borderWidth={'1px'}
                      >
                        <HStack className="row" w={"100%"}>
                          <Heading fontSize="4xl" fontWeight="0px">Approvers Sign-off</Heading>
                        </HStack>
                        <Divider/>
                        <TableContainer>
                          <Table size={'sm'}>
                            <Thead>
                              <Tr>
                                <Th></Th>
                                <Th>Name</Th>
                                <Th>Status</Th>
                                <Th>Date</Th>
                                <Th>Remarks</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              <Tr>
                                <Td>HR Manager</Td>
                                <Td style={{"whiteSpace": "pre-wrap"}}>{pipData.hr_manager_name}</Td>
                                <Td>{pipData.hr_manager_approval_status}</Td>
                                <Td>{pipData.hr_manager_approval_date ? new Date(pipData.hr_manager_approval_date).toLocaleDateString('en-CA') : ""}</Td>
                                <Td style={{"whiteSpace": "pre-wrap"}}>
                                {
                                  (()=>{
                                    return(userData.ffID == pipData.hr_manager_ffid ? (
                                    <div>
                                      <form onSubmit={handleFinalReviewSignOff} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault()}}>
                                        <HStack>
                                          <Box>
                                            <Input
                                              name={'remarks'} 
                                              size={"sm"}
                                              id={pipData.id} 
                                              data-remarks-query={'hr_manager_remarks'}
                                              data-approval-query={'hr_manager_approval_status'}
                                              data-date-query={'hr_manager_approval_date'}
                                            />
                                          </Box>
                                          <Box>
                                            <IconButton 
                                              title='ACKNOWLEDGED' 
                                              colorScheme={'green'} 
                                              icon={<CheckIcon />} 
                                              onClick={() => {setSignoffStatus('ACKNOWLEDGED')}} 
                                              type="submit"
                                              isDisabled={buttonControl}
                                            />
                                          </Box>
                                        </HStack>
                                      </form>
                                    </div>
                                    ) : pipData.hr_manager_remarks)
                                  })()
                                }      
                                </Td>
                              </Tr>
                              <Tr>
                                <Td>Department Manager</Td>
                                <Td style={{"whiteSpace": "pre-wrap"}}>{pipData.department_head_name}</Td>
                                <Td>{pipData.department_head_approval_status}</Td>
                                <Td>{pipData.department_head_approval_date ? new Date(pipData.department_head_approval_date).toLocaleDateString('en-CA') : ""}</Td>
                                <Td style={{"whiteSpace": "pre-wrap"}}>
                                {
                                  (()=>{
                                    return(userData.ffID == pipData.department_head_ffid ? (
                                    <div>
                                      <form onSubmit={handleFinalReviewSignOff} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault()}}>
                                        <HStack>
                                          <Box>
                                            <Input
                                              name={'remarks'} 
                                              size={"sm"}
                                              id={pipData.id} 
                                              data-remarks-query={'department_head_remarks'}
                                              data-approval-query={'department_head_approval_status'}
                                              data-date-query={'department_head_approval_date'}
                                            />
                                          </Box>
                                          <Box>
                                            <IconButton 
                                              title='ACKNOWLEDGED' 
                                              colorScheme={'green'} 
                                              icon={<CheckIcon />} 
                                              onClick={() => {setSignoffStatus('ACKNOWLEDGED')}} 
                                              type="submit"
                                              isDisabled={buttonControl}
                                            />
                                          </Box>
                                        </HStack>
                                      </form>
                                    </div>
                                    ) : pipData.department_head_remarks)
                                  })()
                                }   
                                </Td>
                              </Tr>
                            </Tbody>
                          </Table>
                        </TableContainer>
                      </Box>
                      <Box
                        bg="white"
                        px={4}
                        boxShadow={'xl'}
                        // rounded={'lg'}
                        mb={4}
                        borderColor={useColorModeValue('gray.800', 'gray.500')}
                        borderWidth={'1px'}
                        hidden={(pipData.hr_manager_approval_status == "ACKNOWLEDGED" && pipData.department_head_approval_status == "ACKNOWLEDGED" && pipData.isPIPEmployeeReady == 1) ? false : true}
                      >
                        <HStack className="row" w={"100%"}>
                          <Heading fontSize="4xl" fontWeight="0px">Final Employee Sign-off</Heading>
                        </HStack>
                        <Divider/>
                        <TableContainer>
                          <Table size={'sm'}>
                            <Thead>
                              <Tr>
                                <Th></Th>
                                <Th>Name</Th>
                                <Th>Status</Th>
                                <Th>Date</Th>
                                <Th>Remarks</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              <Tr>
                                <Td>Employee</Td>
                                <Td style={{"whiteSpace": "pre-wrap"}}>{pipData.employee_name}</Td>
                                <Td>{pipData.employee_approval_status}</Td>
                                <Td>{pipData.employee_approval_date ? new Date(pipData.employee_approval_date).toLocaleDateString('en-CA') : ""}</Td>
                                <Td style={{"whiteSpace": "pre-wrap"}}>
                                {
                                  (()=>{
                                    return((
                                      (userData.ffID == pipData.employee_ffid) || 
                                      userData.isAdmin == true
                                    ) ? (
                                        <div>
                                          <form onSubmit={handleFinalReviewSignOff} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault()}}>
                                            <HStack>
                                              <Box>
                                                <Input
                                                  name={'remarks'} 
                                                  size={"sm"}
                                                  id={pipData.id} 
                                                  data-remarks-query={'employee_remarks'}
                                                  data-approval-query={'employee_approval_status'}
                                                  data-date-query={'employee_approval_date'}
                                                />
                                              </Box>
                                              <Box>
                                                <IconButton 
                                                  title='ACKNOWLEDGED' 
                                                  colorScheme={'green'} 
                                                  icon={<CheckIcon />} 
                                                  onClick={() => {setSignoffStatus('ACKNOWLEDGED')}} 
                                                  type="submit"
                                                  isDisabled={buttonControl}
                                                />
                                              </Box>
                                            </HStack>
                                          </form>
                                        </div>
                                      ) : ""
                                    )
                                  })()
                                }
                                </Td>
                              </Tr>
                            </Tbody>
                          </Table>
                        </TableContainer>
                      </Box>
                  </TabPanel>
                </TabPanels>
              </GridItem>
            </Grid>
          </Box>
        </Tabs>
      </Container>
      </>
    )
  }
  catch(err){
    console.log(err)
    setToastMessage(["Error", err.message, "error"])
  }
}
