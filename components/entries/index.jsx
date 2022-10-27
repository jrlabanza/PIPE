// import Entry from './entry'
import DataTable from 'react-data-table-component'
import { Button } from '@chakra-ui/button'
import { ViewIcon } from '@chakra-ui/icons'
import { Badge } from '@chakra-ui/layout'
import NextLink from 'next/link'
import Moment from 'react-moment'

const columns = [
  {
    name: 'PIP ID',
    selector: row => "PIP-"+(row.id).toLocaleString('en-US', {minimumIntegerDigits: 4, useGrouping:false}),
    sortable: true,
  },
  {
    name: 'Status',
    selector: row => row.current_status,
    sortable: true,
    cell:(row) => {
      var color = ""
      var status = ""
      switch(row.status){
        case "SUPERVISOR APPROVAL":
        case "DEPARTMENT HEAD APPROVAL":
        case "EHS APPROVAL":
        case "BUYER APPROVAL":
        case "PLANNER APPROVAL":
        case "MANAGEMENT APPROVAL":
        case "WAREHOUSE APPROVAL":
          color = null
          status = row.status
          break
        case "COMPLETED":
          color = "green"
          status = row.status
          break
        case "CANCELLED":
          color = "red"
          status = row.status
          break
        case "ON HOLD - ACTION ITEM REQUIRED (SUPERVISOR)":
        case "ON HOLD - ACTION ITEM REQUIRED (DEPARTMENT HEAD)":
        case "ON HOLD - ACTION ITEM REQUIRED (EHS)":
        case "ON HOLD - ACTION ITEM REQUIRED (BUYER)":
        case "ON HOLD - ACTION ITEM REQUIRED (PLANNER)":
        case "ON HOLD - ACTION ITEM REQUIRED (MANAGEMENT)":
        case "ON HOLD - ACTION ITEM REQUIRED (WAREHOUSE)":
          color = "yellow"
          status = "ACTION REQUIRED"
          break
        default:
          color = "red"
          status = row.current_status
      }
      return (<Badge variant="solid" 
        //colorScheme={color} 
        style={{whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}
      >{status}</Badge>)
    }
  },
  {
    name: 'Employee',
    selector: row => row.employee_name,
    sortable: true,
  },
  {
    name: 'Department Code',
    selector: row => row.employee_departmentcode,
    sortable: true,
  },
  {
    name: 'Date Submitted',
    selector: row => <Moment format="YYYY/MM/DD HH:mm:ss" date={row.date_submitted}></Moment>,
    sortable: true,
  },
  {
    cell:(row) =>
    <>
      <NextLink
        href={"/viewPIP?ID="+row.formID}
      > 
        <Button 
          colorScheme="teal"
          bgGradient="linear(to-r, teal.400, teal.500, teal.600)"
          color="white"
          variant="solid"
          loadingText="Logging In"
          size="xs"
          leftIcon={<ViewIcon />}
        >
          View
        </Button>
      </NextLink>
    </>
    ,
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
  },
];

function Entries({ entries }) {
  if (entries) {
    return (
      <DataTable
        responsive
        columns={columns}
        data={entries}
        pagination
        pointerOnHover
        highlightOnHover
        title="Entries"
        onRowClicked={(e) => console.log(e)}
      />
    )
  } else {
    return null
  }
}

export default Entries
