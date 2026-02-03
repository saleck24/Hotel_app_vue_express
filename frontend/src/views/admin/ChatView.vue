<template>
  <div class="admin-chat">
    <div class="chat-container">
      <div class="users-list">
        <h3>Conversations</h3>
        <div v-if="loadingUsers">Chargement...</div>
        <ul v-else>
          <li 
            v-for="user in users" 
            :key="user.id" 
            @click="selectUser(user)"
            :class="{ active: selectedUser?.id === user.id }"
          >
             {{ user.nom }}
          </li>
        </ul>
      </div>
      <div class="chat-area">
        <div v-if="selectedUser" class="chat-room">
          <div class="room-header">Discussion avec {{ selectedUser.nom }}</div>
          <div class="messages" ref="msgContainer">
             <div v-if="messages.length === 0" class="no-msg">Aucun message trouvé.</div>
             <div v-for="msg in messages" :key="msg.id" :class="['message-wrapper', msg.from_user_id === authStore.user?.id ? 'sent' : 'received']">
               <div class="message-bubble">
                 <div class="message-text">{{ msg.message }}</div>
                 <div class="message-time">{{ formatTime(msg.created_at) }}</div>
               </div>
             </div>
          </div>
          <div class="input-area">
             <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Répondre..." />
             <button @click="sendMessage">Envoyer</button>
          </div>
        </div>
        <div v-else class="empty-state">
          Sélectionnez un utilisateur pour discuter
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import { socket } from '@/services/socket'

const authStore = useAuthStore()
const users = ref([])
const loadingUsers = ref(true)
const selectedUser = ref(null)
const messages = ref([])
const newMessage = ref('')
const msgContainer = ref(null)

async function fetchConversations() {
  try {
    const res = await api.get('/messages/conversations')
    users.value = res.data
  } catch (err) {
    console.error(err)
  } finally {
    loadingUsers.value = false
  }
}

async function selectUser(user) {
  selectedUser.value = user
  fetchMessages(user.id)
}

async function fetchMessages(userId) {
  try {
     const res = await api.get(`/messages/${userId}`)
     messages.value = res.data
     scrollToBottom()
  } catch (err) {
    console.error(err)
  }
}

function formatTime(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function sendMessage() {
  if (!newMessage.value.trim() || !selectedUser.value) return
  
  const msgData = {
    toUserId: selectedUser.value.id,
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
  fetchConversations()
  
  socket.connect()
  
  socket.on('receive_message', (data) => {
    // If message is from the user we are currently chatting with
    if (selectedUser.value && data.fromUserId == selectedUser.value.id) {
      messages.value.push({
        id: Date.now(),
        from_user_id: data.fromUserId,
        message: data.message,
        created_at: data.timestamp
      })
      scrollToBottom()
    } else {
      // Potentially refresh conversation list to show new message/user
      fetchConversations()
    }
  })
})

onUnmounted(() => {
  socket.off('receive_message')
  socket.disconnect()
})
</script>

<style scoped>
.chat-container {
  display: flex;
  height: calc(100vh - 150px);
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  overflow: hidden;
  border: 1px solid #edf2f7;
}

.users-list {
  width: 300px;
  border-right: 1px solid #edf2f7;
  padding: 0;
  overflow-y: auto;
  background-color: #f8fafc;
}

.users-list h3 { 
  padding: 1.5rem;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a2a44;
  border-bottom: 1px solid #edf2f7;
}

.users-list ul { list-style: none; padding: 0; }
.users-list li {
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  gap: 12px;
}

.users-list li:hover { background-color: #f1f5f9; }
.users-list li.active { background-color: white; border-left: 4px solid #c5a059; }

.chat-area { flex: 1; display: flex; flex-direction: column; background: white; }
.chat-room { display: flex; flex-direction: column; height: 100%; }

.room-header { 
  padding: 1rem 1.5rem; 
  border-bottom: 1px solid #edf2f7; 
  font-weight: 700; 
  color: #1a2a44;
  background: white;
  font-size: 1.1rem;
}

.messages { 
  flex: 1; 
  padding: 1.5rem; 
  overflow-y: auto; 
  display: flex; 
  flex-direction: column; 
  gap: 1rem;
  background-color: #ffffff;
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
  background: #1a2a44; 
  color: white; 
  border-bottom-right-radius: 4px;
}

.sent .message-time {
  color: rgba(255, 255, 255, 0.7);
}

.received .message-bubble { 
  background: #f1f5f9; 
  color: #1a2a44;
  border-bottom-left-radius: 4px;
}

.received .message-time {
  color: #718096;
}

.input-area { 
  padding: 1.25rem 1.5rem; 
  border-top: 1px solid #edf2f7; 
  display: flex; 
  gap: 12px;
  background: white;
}

.input-area input { 
  flex: 1; 
  padding: 0.75rem 1.25rem; 
  border: 1px solid #e2e8f0; 
  border-radius: 25px; 
  outline: none;
  font-size: 0.95rem;
  transition: border-color 0.2s;
}

.input-area input:focus {
  border-color: #c5a059;
}

.input-area button { 
  padding: 0 1.5rem; 
  background: #c5a059; 
  color: white; 
  border: none; 
  border-radius: 25px; 
  font-weight: 700; 
  cursor: pointer;
  transition: transform 0.1s;
}

.input-area button:active { transform: scale(0.95); }

.empty-state { flex: 1; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-weight: 500; }
</style>
