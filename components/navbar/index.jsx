import { ReactNode } from 'react';
import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  useColorModeValue,
  Stack,
  Link,
  Heading,
  Text
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon, AddIcon } from '@chakra-ui/icons'
import { ReactText } from 'react'
import NextLink from 'next/link'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { SettingsIcon } from '@chakra-ui/icons';

const LinkItems = [
  { name: 'Dashboard', url: '/' },
  // { name: 'Pending Forms', url: '/error' },
  // { name: 'Your Forms', url: '/error' },
];

const NavLink = ({ children, url }) => (
  <NextLink
    href={url}
  >
    <Link
      fontWeight="600"
      px={2}
      py={1}
      rounded={'md'}
    >
      {children}
    </Link>
  </NextLink>
);

export default function withAction({
  children,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const router = useRouter()
  
  function onLogout(){
    // Cookies.remove('ffID')
    // Cookies.remove('fullname')
    // Cookies.remove('mail')
    // Cookies.remove('thumbnailPhoto')
    // Cookies.remove('title')
    // Cookies.remove('authorized')
    // Cookies.remove('manager')
    // Cookies.remove('manager_mail')
    // Cookies.remove('location')
    // Cookies.remove('isAdmin')
    document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
    router.push('/login')
  }

  return (
      <>
        <Box bg={useColorModeValue('blue.50', 'blue.900')} px={4} boxShadow={'xl'}>
          <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
            <IconButton
              size={'md'}
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              aria-label={'Open Menu'}
              display={{ md: 'none' }}
              onClick={isOpen ? onClose : onOpen}
            />
            <HStack spacing={8} alignItems={'center'}>
              {/* <Image maxW="10%" src={"images/light-logo.png"} /> */}
              <Heading color={'#2C4C54'}>E-PIP</Heading>
              <HStack
                as={'nav'}
                spacing={4}
                display={{ base: 'none', md: 'flex' }}>
                {LinkItems.map((link) => (
                  <NavLink 
                    key={link.name} 
                    url={link.url}
                    
                  >
                    <Button
                      colorScheme="teal"
                      bgGradient="linear(to-r, teal.400, teal.500, teal.600)"
                      color="white"
                      variant="solid"
                    >
                    {link.name}
                    </Button>
                  </NavLink>
                ))}
              </HStack>
            </HStack>
            <Flex alignItems={'center'}>
              <NextLink href="/createPIP">
                <Button
                  mr={4}
                  leftIcon={<AddIcon />}
                  colorScheme="teal"
                  bgGradient="linear(to-r, teal.400, teal.500, teal.600)"
                  color="white"
                  variant="solid"
                >
                  Create Form
                </Button>
              </NextLink>

              <Menu>
                <MenuButton
                  as={Button}
                  rounded={'full'}
                  variant={'link'}
                  cursor={'pointer'}
                  minW={0}>
                  <SettingsIcon
                    h={6}
                  />
                </MenuButton>
                <MenuList>
                    {/* <MenuItem onClick={(e) => { approverList()}}>
                      Approvers List
                    </MenuItem> */}
                    <MenuItem onClick={(e) => { onLogout()}}>
                      Log Out
                    </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          </Flex>

          {isOpen ? (
            <Box pb={4} display={{ md: 'none' }}>
              <Stack as={'nav'} spacing={4}>
                {LinkItems.map((link) => (
                  <NavLink key={link.name} url={link.url}>{link.name}</NavLink>
                ))}
              </Stack>
            </Box>
          ) : null}
        </Box>

        <Box p={4}>{children}</Box>
      </>
    )
  }
