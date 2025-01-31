import { useState, useEffect } from 'react'
import { supabase } from '../../config/supabaseClient'
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  FormControl,
  FormLabel,
  VStack,
  HStack,
  useToast,
  Select,
  InputGroup,
  InputLeftElement,
  Icon,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'

const CouponManager = () => {
  const [coupons, setCoupons] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [loading, setLoading] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discount: '',
    expiration_date: '',
    description: ''
  })

  useEffect(() => {
    fetchCoupons()
  }, [searchTerm, filterStatus])

  const fetchCoupons = async () => {
    setLoading(true)
    try {
      let query = supabase.from('coupons').select('*')

      if (searchTerm) {
        query = query.ilike('code', `%${searchTerm}%`)
      }

      if (filterStatus !== 'all') {
        const today = new Date().toISOString()
        if (filterStatus === 'active') {
          query = query.gte('expiration_date', today)
        } else {
          query = query.lt('expiration_date', today)
        }
      }

      const { data, error } = await query.order('created_at', { ascending: false })
      
      if (error) throw error
      setCoupons(data)
    } catch (error) {
      toast({
        title: 'Error fetching coupons',
        description: error.message,
        status: 'error',
        duration: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddCoupon = async () => {
    try {
      const { error } = await supabase
        .from('coupons')
        .insert([{ ...newCoupon, created_at: new Date() }])

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Coupon added successfully',
        status: 'success',
        duration: 3000,
      })

      setNewCoupon({
        code: '',
        discount: '',
        expiration_date: '',
        description: ''
      })
      
      fetchCoupons()
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
      })
    }
  }

  const handleDeleteCoupon = async () => {
    try {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', selectedCoupon.id)

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Coupon deleted successfully',
        status: 'success',
        duration: 3000,
      })

      onClose()
      fetchCoupons()
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
      })
    }
  }

  return (
    <Box maxW="1200px" mx="auto" mt={8}>
      <VStack spacing={6} align="stretch">
        <HStack spacing={4}>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={SearchIcon} color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Search coupons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            w="200px"
          >
            <option value="all">All Coupons</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
          </Select>
        </HStack>

        <Box p={4} borderWidth={1} borderRadius="md">
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Coupon Code</FormLabel>
              <Input
                value={newCoupon.code}
                onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value})}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Discount</FormLabel>
              <Input
                value={newCoupon.discount}
                onChange={(e) => setNewCoupon({...newCoupon, discount: e.target.value})}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Expiration Date</FormLabel>
              <Input
                type="date"
                value={newCoupon.expiration_date}
                onChange={(e) => setNewCoupon({...newCoupon, expiration_date: e.target.value})}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Input
                value={newCoupon.description}
                onChange={(e) => setNewCoupon({...newCoupon, description: e.target.value})}
              />
            </FormControl>
            <Button colorScheme="green" onClick={handleAddCoupon} width="100%">
              Add Coupon
            </Button>
          </VStack>
        </Box>

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Code</Th>
              <Th>Discount</Th>
              <Th>Expiration Date</Th>
              <Th>Description</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {coupons.map((coupon) => (
              <Tr key={coupon.id}>
                <Td>{coupon.code}</Td>
                <Td>{coupon.discount}</Td>
                <Td>{new Date(coupon.expiration_date).toLocaleDateString()}</Td>
                <Td>{coupon.description}</Td>
                <Td>
                  <Button
                    colorScheme="red"
                    size="sm"
                    onClick={() => {
                      setSelectedCoupon(coupon)
                      onOpen()
                    }}
                  >
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <AlertDialog isOpen={isOpen} onClose={onClose}>
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader>Delete Coupon</AlertDialogHeader>
              <AlertDialogBody>
                Are you sure you want to delete this coupon? This action cannot be undone.
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button onClick={onClose}>Cancel</Button>
                <Button colorScheme="red" onClick={handleDeleteCoupon} ml={3}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </VStack>
    </Box>
  )
}

export default CouponManager