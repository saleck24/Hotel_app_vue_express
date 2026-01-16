<template>
  <div class="chat-view">
    <div class="chat-wrapper">
      <div class="chat-header">
        <h3>Contact Support</h3>
      </div>
      <div class="chat-messages" ref="msgContainer">
        <div v-if="messages.length === 0" class="no-messages">
          <p>No messages yet. Start a conversation!</p>
        </div>
        <div 
          v-for="msg in messages" 
          :key="msg.id" 
          :class="['message-bubble', msg.sender_id === authStore.user?.id ? 'sent' : 'received']"
        >
          {{ msg.message }}
        </div>
      </div>
      <div class="chat-input">
        <input 
          v-model="newMessage" 
          @keyup.enter="sendMessage" 
          placeholder="Type your message..." 
          :disabled="sending"
        />
        <button @click="sendMessage" :disabled="sending || !newMessage.trim()">
          Send
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'

const authStore = useAuthStore()
const messages = ref([])
const newMessage = ref('')
const sending = ref(false)
const msgContainer = ref(null)

// In a real app, this would be the admin user ID or a support channel ID
const ADMIN_ID = 1 // Placeholder

async function fetchMessages() {
  try {
    // Current user ID is used to fetch chat history with self? 
    // API: GET /api/messages/{userId}
    // If I am client, {userId} should probably be the OTHER person? 
    // Or if checking MY history, usually it's implied 'me' or I pass my ID.
    // The prompt says "GET /api/messages/{userId} ... Historique messages avec user".
    // If I am client, I want to see messages with Admin. Admin ID is unknown usually, but let's assume system chat.
    // Let's assume we pass 'admin' or something if the backend handles it, or just our own ID to see all?
    // Let's assume the endpoint returns messages associated with the user passed in path.
    if (authStore.user) {
        const res = await api.get(`/messages/${authStore.user.id}`) // Or admin ID?
        // Wait, if I am client, I want messages between ME and Admin.
        // If the endpoint gets history with {userId}, maybe as a client I query messages with 'admin'?
        // Let's assume the backend knows who 'admin' is, or we send '1'.
        // Actually, usually users just GET /messages and backend returns their messages.
        // But the API spec says GET /api/messages/{userId}.
        // Maybe it's "Get messages with userId". So if I am client, I call GET /messages/1 (admin).
        const res2 = await api.get(`/messages/${ADMIN_ID}`)
        messages.value = res2.data
    }
  } catch (err) {
    console.error('Chat fetch error', err)
  }
}

async function sendMessage() {
  if (!newMessage.value.trim()) return
  sending.value = true
  try {
    await api.post('/messages', {
      to_user_id: ADMIN_ID,
      message: newMessage.value
    })
    // Add locally or re-fetch
    messages.value.push({
      id: Date.now(),
      sender_id: authStore.user.id,
      message: newMessage.value
    })
    newMessage.value = ''
    scrollToBottom()
  } catch (err) {
    alert('Failed to send message')
  } finally {
    sending.value = false
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (msgContainer.value) {
      msgContainer.value.scrollTop = msgContainer.value.scrollHeight
    }
  })
}

onMounted(() => {
  fetchMessages()
  // Poll for new messages every 5s since no WebSocket
  setInterval(fetchMessages, 5000)
})
</script>

<style scoped>
.chat-view {
  height: calc(100vh - 150px);
  display: flex;
  flex-direction: column;
}

.chat-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.chat-header {
  padding: var(--spacing-md);
  border-bottom: 1px solid #eee;
  background-color: var(--color-primary);
  color: white;
}

.chat-messages {
  flex: 1;
  padding: var(--spacing-md);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  background-color: #f9f9f9;
}

.message-bubble {
  max-width: 70%;
  padding: 10px 15px;
  border-radius: 18px;
  font-size: 0.95rem;
  line-height: 1.4;
}

.sent {
  align-self: flex-end;
  background-color: var(--color-primary);
  color: white;
  border-bottom-right-radius: 4px;
}

.received {
  align-self: flex-start;
  background-color: #e0e0e0;
  color: var(--color-text);
  border-bottom-left-radius: 4px;
}

.chat-input {
  padding: var(--spacing-md);
  border-top: 1px solid #eee;
  display: flex;
  gap: var(--spacing-sm);
}

.chat-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 20px;
  outline: none;
}

.chat-input button {
  padding: 0 20px;
  background-color: var(--color-secondary);
  color: white;
  border: none;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
}

.chat-input button:disabled {
  opacity: 0.5;
}
</style>
