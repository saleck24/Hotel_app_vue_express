<template>
  <div class="chat-view">
    <div class="chat-wrapper">
      <div class="chat-header">
        <h3>Support Client</h3>
      </div>
      <div class="chat-messages" ref="msgContainer">
        <div v-if="messages.length === 0" class="no-messages">
          <p>Aucun message pour l'instant. Commencez la conversation !</p>
        </div>
        <div 
          v-for="msg in messages" 
          :key="msg.id" 
          :class="['message-wrapper', msg.from_user_id === authStore.user?.id ? 'sent' : 'received']"
        >
          <div class="message-bubble">
            <div class="message-text">{{ msg.message }}</div>
            <div class="message-time">{{ formatTime(msg.created_at) }}</div>
          </div>
        </div>
      </div>
      <div class="chat-input">
        <input 
          v-model="newMessage" 
          @keyup.enter="sendMessage" 
          placeholder="Écrivez votre message..." 
          :disabled="sending"
        />
        <button @click="sendMessage" :disabled="sending || !newMessage.trim()">
          Envoyer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'
import { socket } from '@/services/socket'

const authStore = useAuthStore()
const messages = ref([])
const newMessage = ref('')
const sending = ref(false)
const msgContainer = ref(null)
const adminId = ref(null)

async function findAdmin() {
  try {
    const res = await api.get('/admins')
    const admin = res.data[0] // Taking the first available admin
    if (admin) {
      adminId.value = admin.id
      fetchMessages()
    }
  } catch (err) {
    console.error('Error finding admin', err)
  }
}

async function fetchMessages() {
  if (!adminId.value) return
  try {
    const res = await api.get(`/messages/${adminId.value}`)
    messages.value = res.data
    scrollToBottom()
  } catch (err) {
    console.error('Chat fetch error', err)
  }
}

function formatTime(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function sendMessage() {
  if (!newMessage.value.trim() || !adminId.value) return
  
  const msgData = {
    toUserId: adminId.value,
    message: newMessage.value
  }

  socket.emit('send_message', msgData)

  messages.value.push({
    id: Date.now(),
    from_user_id: authStore.user.id,
    message: newMessage.value,
    created_at: new Date().toISOString()
  })

  newMessage.value = ''
  scrollToBottom()
}

function scrollToBottom() {
  nextTick(() => {
    if (msgContainer.value) {
      msgContainer.value.scrollTop = msgContainer.value.scrollHeight
    }
  })
}

onMounted(() => {
  findAdmin()
  
  socket.connect()
  
  socket.on('receive_message', (data) => {
    // Check if message is from the admin we are talking to
    if (data.fromUserId == adminId.value) {
      messages.value.push({
        id: Date.now(),
        from_user_id: data.fromUserId,
        message: data.message,
        created_at: data.timestamp
      })
      scrollToBottom()
    }
  })
})

onUnmounted(() => {
  socket.off('receive_message')
  socket.disconnect()
})
</script>

<style scoped>
.chat-view {
  height: calc(100vh - 180px);
  display: flex;
  flex-direction: column;
}

.chat-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  overflow: hidden;
  border: 1px solid #edf2f7;
}

:global(.dark) .chat-wrapper {
  background: var(--color-surface);
  border-color: rgba(255,255,255,0.1);
}

.chat-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #edf2f7;
  background-color: var(--color-primary);
  color: white;
}

:global(.dark) .chat-header {
  background-color: var(--color-surface);
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.chat-header h3 {
  margin: 0;
  font-weight: 700;
  font-size: 1.1rem;
}

.chat-messages {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: #f8fafc;
}

:global(.dark) .chat-messages {
  background-color: var(--color-background);
}

.message-wrapper {
  display: flex;
  width: 100%;
}

.sent {
  justify-content: flex-end;
}

.received {
  justify-content: flex-start;
}

.message-bubble {
  max-width: 75%;
  padding: 0.8rem 1.2rem;
  border-radius: 18px;
  font-size: 0.95rem;
  line-height: 1.5;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.message-text {
  word-break: normal;
  overflow-wrap: break-word;
}

.message-time {
  font-size: 0.75rem;
  margin-top: 4px;
  opacity: 0.8;
  text-align: right;
}

.sent .message-bubble {
  background-color: var(--color-primary);
  color: white;
  border-bottom-right-radius: 4px;
}

:global(.dark) .sent .message-bubble {
  background-color: var(--color-secondary);
  color: white;
}

.sent .message-time {
  color: rgba(255, 255, 255, 0.7);
}

.received .message-bubble {
  background-color: white;
  color: var(--color-primary);
  border-bottom-left-radius: 4px;
  border: 1px solid #e2e8f0;
}

:global(.dark) .received .message-bubble {
  background-color: var(--color-surface);
  color: var(--color-text);
  border-color: rgba(255,255,255,0.1);
}

.received .message-time {
  color: #718096;
}

:global(.dark) .received .message-time {
  color: var(--color-text-muted);
}

.chat-input {
  padding: 1.25rem 1.5rem;
  border-top: 1px solid #edf2f7;
  display: flex;
  gap: 12px;
  background: white;
}

:global(.dark) .chat-input {
  background: var(--color-surface);
  border-color: rgba(255,255,255,0.1);
}

.chat-input input {
  flex: 1;
  padding: 0.75rem 1.25rem;
  border: 1px solid #e2e8f0;
  border-radius: 25px;
  outline: none;
  font-size: 0.95rem;
  transition: border-color 0.2s;
  background: white;
  color: var(--color-primary);
}

:global(.dark) .chat-input input {
  background: var(--color-background);
  border-color: rgba(255,255,255,0.1);
  color: var(--color-text);
}

.chat-input input:focus {
  border-color: var(--color-secondary);
}

.chat-input button {
  padding: 0 1.5rem;
  background-color: var(--color-secondary);
  color: white;
  border: none;
  border-radius: 25px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.chat-input button:hover:not(:disabled) {
  background-color: #b38f4d;
}

.chat-input button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.no-messages {
  text-align: center;
  color: #94a3b8;
  margin-top: 2rem;
}
</style>
