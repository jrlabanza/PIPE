// import Entry from './entry'
import DataTable from 'react-data-table-component'
import { Button } from '@chakra-ui/button'
import { ViewIcon } from '@chakra-ui/icons'
import NextLink from 'next/link'
import Moment from 'react-moment'

const columns = [
  {
    name: 'TASK',
    selector: row => row.task,
    sortable: true,
  },
  {
    name: 'EXPECTED START DATE',
    selector: row => row.start_date,
    sortable: true,

  },
  {
    name: 'EXPECTED END DATE',
    selector: row => row.end_date,
    sortable: true,
  },
];

function CAPA({ entries }) {
  if (entries) {
    return (
      <DataTable
        responsive
        columns={columns}
        data={entries}
        pagination
        pointerOnHover
        highlightOnHover
        title="CAPA"
        onRowClicked={(e) => console.log(e)}
      />
    )
  } else {
    return null
  }
}

export default CAPA
