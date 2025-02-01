import { useEffect, useState } from 'react'
import { supabase } from '../../config/supabaseClient'
import {
  Box,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCoupons: 0,
    activeCoupons: 0,
    expiredCoupons: 0,
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    const today = new Date().toISOString()
    
    const { data: allCoupons } = await supabase
      .from('coupons')
      .select('*')

    const { data: activeCoupons } = await supabase
      .from('coupons')
      .select('*')
      .gte('expiration_date', today)

    setStats({
      totalCoupons: allCoupons?.length || 0,
      activeCoupons: activeCoupons?.length || 0,
      expiredCoupons: (allCoupons?.length || 0) - (activeCoupons?.length || 0),
    })
  }

  return (
    <Box maxW="1200px" mx="auto" mt={8}>
      <Heading mb={6}>Dashboard</Heading>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        <Stat p={4} shadow="md" border="1px" borderColor="gray.200" borderRadius="md">
          <StatLabel>Total Coupons</StatLabel>
          <StatNumber>{stats.totalCoupons}</StatNumber>
          <StatHelpText>All time</StatHelpText>
        </Stat>
        <Stat p={4} shadow="md" border="1px" borderColor="gray.200" borderRadius="md">
          <StatLabel>Active Coupons</StatLabel>
          <StatNumber>{stats.activeCoupons}</StatNumber>
          <StatHelpText>Currently valid</StatHelpText>
        </Stat>
        <Stat p={4} shadow="md" border="1px" borderColor="gray.200" borderRadius="md">
          <StatLabel>Expired Coupons</StatLabel>
          <StatNumber>{stats.expiredCoupons}</StatNumber>
          <StatHelpText>Past expiration date</StatHelpText>
        </Stat>
      </SimpleGrid>
    </Box>
  )
}

export default Dashboard