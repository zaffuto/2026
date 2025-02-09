import { Box, Input, Button, VStack, HStack, Text, useColorModeValue, IconButton, Container, useToast, Spinner } from '@chakra-ui/react'
import { AttachmentIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RAGService } from '../../services/rag'

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const bgColor = useColorModeValue('white', 'gray.800')
  const bubbleColorUser = useColorModeValue('blue.500', 'blue.200')
  const bubbleColorBot = useColorModeValue('gray.100', 'gray.700')
  
  const toast = useToast()
  const ragService = new RAGService(process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    setIsLoading(true)

    const newMessage: Message = {
      id: crypto.randomUUID(),
      content: input,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newMessage])
    setInput('')

    try {
      const response = await ragService.sendMessage([...messages, newMessage])
      const botResponse: Message = {
        id: crypto.randomUUID(),
        content: response,
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botResponse])
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get response from AI'
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || isLoading) return
    
    setIsLoading(true)
    try {
      const analysis = await ragService.analyzeImage(file)
      const botResponse: Message = {
        id: crypto.randomUUID(),
        content: analysis,
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botResponse])
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to analyze image',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
      if (event.target) event.target.value = ''
    }
  }

  return (
    <Container maxW="container.md" p={4}>
      <Box 
        bg={bgColor} 
        borderRadius="lg" 
        boxShadow="lg" 
        p={4} 
        height="70vh" 
        display="flex" 
        flexDirection="column"
        role="region"
        aria-label="Chat messages"
      >
        <VStack flex={1} overflowY="auto" spacing={4} mb={4} alignItems="stretch">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                style={{ width: '100%' }}
              >
                <Box
                  alignSelf={message.isUser ? 'flex-end' : 'flex-start'}
                  bg={message.isUser ? bubbleColorUser : bubbleColorBot}
                  color={message.isUser ? 'white' : 'inherit'}
                  borderRadius="lg"
                  px={4}
                  py={2}
                  maxW="70%"
                  as={motion.div}
                  whileHover={{ scale: 1.02 }}
                  role="article"
                  aria-label={`${message.isUser ? 'Your' : 'Assistant'} message`}
                >
                  <Text>{message.content}</Text>
                  <Text fontSize="xs" color={message.isUser ? 'whiteAlpha.700' : 'gray.500'} mt={1}>
                    {message.timestamp.toLocaleTimeString()}
                  </Text>
                </Box>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </VStack>
        <HStack spacing={2} as="form" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            style={{ display: 'none' }}
            aria-label="Upload image"
          />
          <IconButton
            aria-label="Upload image"
            icon={<AttachmentIcon />}
            onClick={() => fileInputRef.current?.click()}
            isDisabled={isLoading}
          />
          <Input
            placeholder="Ask about eco-friendly coupons..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-label="Message input"
            isDisabled={isLoading}
          />
          <Button
            colorScheme="blue"
            rightIcon={isLoading ? <Spinner size="sm" /> : <ArrowForwardIcon />}
            onClick={handleSend}
            isDisabled={isLoading || !input.trim()}
            type="submit"
          >
            Send
          </Button>
        </HStack>
      </Box>
    </Container>
  )
}