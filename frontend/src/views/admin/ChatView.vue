<template>
  <div class="admin-chat">
    <div class="chat-container">
      <div class="users-list">
        <h3>Conversations</h3>
        <div v-if="loadingUsers">Loading...</div>
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
          <div class="room-header">Chat with {{ selectedUser.nom }}</div>
          <div class="messages" ref="msgContainer">
             <div v-if="messages.length === 0" class="no-msg">No messages found.</div>
             <div v-for="msg in messages" :key="msg.id" :class="['message', msg.sender_id === authStore.user?.id ? 'sent' : 'received']">
               {{ msg.message }}
             </div>
          </div>
          <div class="input-area">
             <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Reply..." />
             <button @click="sendMessage">Send</button>
          </div>
        </div>
        <div v-else class="empty-state">
          Select a user to chat
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const users = ref([])
const loadingUsers = ref(true)
const selectedUser = ref(null)
const messages = ref([])
const newMessage = ref('')
const msgContainer = ref(null)

async function fetchUsers() {
  // Ideally fetch users who have chats. For now fetch all users.
  try {
    const res = await api.get('/users')
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

async function sendMessage() {
  if (!newMessage.value.trim() || !selectedUser.value) return
  try {
    await api.post('/messages', {
      to_user_id: selectedUser.value.id,
      message: newMessage.value
    })
    messages.value.push({
      id: Date.now(),
      sender_id: authStore.user.id,
      message: newMessage.value
    })
    newMessage.value = ''
    scrollToBottom()
  } catch (err) {
    alert('Failed to send')
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (msgContainer.value) {
      msgContainer.value.scrollTop = msgContainer.value.scrollHeight
    }
  })
}

onMounted(fetchUsers)
</script>

<style scoped>
.chat-container {
  display: flex;
  height: calc(100vh - 120px);
  background: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.users-list {
  width: 250px;
  border-right: 1px solid #eee;
  padding: var(--spacing-md);
  overflow-y: auto;
}

.users-list h3 { margin-bottom: var(--spacing-md); font-size: 1.1rem; }
.users-list ul { list-style: none; }
.users-list li {
  padding: 10px;
  cursor: pointer;
  border-radius: 4px;
}
.users-list li:hover { background-color: #f5f5f5; }
.users-list li.active { background-color: var(--color-primary); color: white; }

.chat-area { flex: 1; display: flex; flex-direction: column; }
.chat-room { display: flex; flex-direction: column; height: 100%; }
.room-header { padding: 15px; border-bottom: 1px solid #eee; font-weight: bold; background: #fafafa; }
.messages { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; }
.message { max-width: 60%; padding: 10px 15px; border-radius: 15px; font-size: 0.9rem; }
.sent { align-self: flex-end; background: var(--color-primary); color: white; }
.received { align-self: flex-start; background: #eee; }
.input-area { padding: 15px; border-top: 1px solid #eee; display: flex; gap: 10px; }
.input-area input { flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 20px; outline: none; }
.input-area button { padding: 0 20px; background: var(--color-secondary); color: white; border: none; border-radius: 20px; font-weight: bold; cursor: pointer; }
.empty-state { flex: 1; display: flex; align-items: center; justify-content: center; color: #aaa; }
</style>
