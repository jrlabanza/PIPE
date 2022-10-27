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
  CheckboxGroup
} from "@chakra-ui/react"
import { useColorModeValue } from '@chakra-ui/color-mode'

export default function Summary(
  {
    pipData,
    pipGoals,
    handleShowPIPtoEmployee,
    userData
    // setToastMessage,
  }
  ){
  try{
    return (
      <>
        <Box
          bg="white"
          px={4}
          boxShadow={'xl'}
          mb={4}
          borderColor={useColorModeValue('gray.800', 'gray.500')}
          borderWidth={'1px'}
        >
          <HStack className="row" w={"100%"}>
            <Heading fontSize="4xl" fontWeight="0px">Performance Improvement Plan Program Report</Heading>
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
            </GridItem>
            <GridItem colSpan={6}>
              <HStack>
                <Text>Department Code:</Text>
                <Text as={'b'}>{pipData.employee_departmentcode}</Text>
              </HStack>
              <HStack mt="3">
                <Text>Job Title:</Text>
                <Text as={'b'}>{pipData.employee_title}</Text>
              </HStack>
            </GridItem>
          </Grid>
          <HStack className="row" w={"100%"}>
            <Heading fontSize="2xl" fontWeight="0px" mt="6" mb="6">Period Review Result Summary</Heading>
          </HStack>
          <Divider/>
          <TableContainer>
            <Table size={'sm'}>
              <Thead>
                <Tr>
                  <Th>Goal#</Th>
                  <Th>Target area(s) for improvement and Smart Goals</Th>
                  <Th>1st Review</Th>
                  <Th>2nd Review</Th>
                  <Th>3rd Review</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
              {pipGoals?.map((item, i) => (
                <Tr>
                  <Td>{i+1}</Td>
                  <Td style={{"whiteSpace": "pre-wrap"}}>
                    1.{item.target_area_for_improvement}<br/>
                    2.{item.expected_standards_of_performance}
                  </Td>
                  <Td>
                    <FormControl>
                      <FormLabel>Met Goal?</FormLabel>
                      <RadioGroup value={item.first_period_actual_end ? item.has_first_period_capa : null}>
                        <Stack>
                          <Radio value={0} isReadOnly>Yes</Radio>
                          <Radio value={1} isReadOnly>No</Radio>
                        </Stack>
                      </RadioGroup>
                    </FormControl>
                  </Td>
                  <Td>
                    <FormControl>
                      <FormLabel>Met Goal?</FormLabel>
                      <RadioGroup value={item.second_period_actual_end ? item.has_second_period_capa : null}>
                        <Stack>
                          <Radio value={0} isReadOnly>Yes</Radio>
                          <Radio value={1} isReadOnly>No</Radio>
                        </Stack>
                      </RadioGroup>
                    </FormControl>
                  </Td>
                  <Td>
                    <FormControl>
                      <FormLabel>Met Goal?</FormLabel>
                      <RadioGroup value={item.third_period_actual_end ? item.has_third_period_capa : null}>
                        <Stack>
                          <Radio value={0} isReadOnly>Yes</Radio>
                          <Radio value={1} isReadOnly>No</Radio>
                        </Stack>
                      </RadioGroup>
                    </FormControl>
                  </Td>
                </Tr>
              ))}
              </Tbody>
            </Table>
          </TableContainer>
            <Grid 
              justifyContent={'center'} 
              mt={8} 
              mb={8} 
              hidden={pipData.isPIPEmployeeReady == 0 && pipData.originator_ffid == userData.ffID ? false : true}
            >
              <form onSubmit={handleShowPIPtoEmployee} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault()}}>
                <Button colorScheme={'red'} type={'submit'}>SHOW RESULT TO EMPLOYEE</Button>
              </form>
            </Grid>
            <div hidden={pipData.isPIPEmployeeReady == 1 ? false : true}>
              <HStack className="row" w={"100%"} mt="6" mb="6">
                <Heading fontSize="2xl" fontWeight="0px">Recommendation</Heading>
              </HStack>
              <Divider/>
              <RadioGroup value={pipData.evaluation_rate} fontSize={'11px'} mb="6">
                <Stack spacing={4} direction='row'>
                  <Radio value='1' isReadOnly>
                    Released from the Program. Employee has met the requirements of the PIP
                  </Radio>
                  <Radio value='2' isReadOnly>
                    Reassigned Provided there is business exigency. Employee will continue to be under PIP based on new deliverables consistent to the new role
                  </Radio>
                  <Radio value='3' isReadOnly>
                    Suspension/Termination in accordance with RCCD and Article 297 of the Philippine Labor Code
                  </Radio>
                </Stack>
              </RadioGroup>
            </div>
        </Box>
      </>
    )
  }
  catch(err){
    console.log(err)
    setToastMessage(["Error", err.message, "error"])
  }
}
