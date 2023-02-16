import {
  Box,
  chakra,
  Flex,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
} from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import { BsPerson } from 'react-icons/bs';

function StatsCard(props) {
  const { title, stat, icon } = props;
  return (
    <Stat
      px={{ base: 2, md: 4 }}
      py={'5'}
      shadow={'xl'}
      // border={'1px solid'}
      borderColor={useColorModeValue('gray.800', 'gray.500')}
      rounded={'lg'}>
      <Flex justifyContent={'space-between'}>
        <Box pl={{ base: 2, md: 4 }}>
          <StatLabel fontWeight={'medium'} isTruncated>
            {title}
          </StatLabel>
          <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
            {stat}
          </StatNumber>
        </Box>
        <Box
          my={'auto'}
          color={useColorModeValue('gray.800', 'gray.200')}
          alignContent={'center'}>
          {icon}
        </Box>
      </Flex>
    </Stat>
  );
}

export default function BasicStatistics( {totalEntries, setFilter, isAdmin}) {
  return (
    <Box w="xs" mx={'auto'} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
      <SimpleGrid columns={{ base: 1, md: 1 }} spacing={{ base: 5, lg: 8 }} mb={4}>
        {
          (() => {
            if(isAdmin == "true"){
              return(<StatsCard
                title={'Total Entries Submitted'}
                stat={<Button onClick={() => {setFilter("ALL")}}>{totalEntries.all[0].count}</Button>}
              />)
            }
          })()
        }
        <StatsCard
          title={'Total Entries Submitted by Me'}
          stat={<Button onClick={() => {setFilter("SUBMITTED")}}>{totalEntries.submitted[0].count}</Button>}
        />
        <StatsCard
          title={'Total Entries Assigned to Me'}
          stat={<Button onClick={() => {setFilter("ASSIGNED")}}>{totalEntries.assigned[0].count}</Button>}
        />
      </SimpleGrid>
    </Box>
  );
}