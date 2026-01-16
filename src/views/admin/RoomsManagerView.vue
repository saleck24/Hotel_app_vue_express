<template>
  <div class="rooms-manager">
    <div class="actions-header">
      <BaseButton @click="openCreateModal">Add New Room</BaseButton>
    </div>

    <div v-if="loading">Loading rooms...</div>
    <div v-else class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Type</th>
            <th>Number</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="room in rooms" :key="room.id">
            <td>
              <img :src="room.images?.[0] || 'https://placehold.co/100x60?text=Room'" class="thumb">
            </td>
            <td>{{ room.type }}</td>
            <td>{{ room.numero }}</td>
            <td>${{ room.prix }}</td>
            <td><span :class="['badge', getStatusColor(room.statut)]">{{ room.statut }}</span></td>
            <td>
              <button class="btn-icon" @click="editRoom(room)">Edit</button>
              <button class="btn-icon text-danger" @click="deleteRoom(room.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal :isOpen="isModalOpen" :title="isEditing ? 'Edit Room' : 'Add New Room'" @close="closeModal">
      <form @submit.prevent="saveRoom" id="room-form">
        <BaseInput label="Room Number" id="numero" v-model="form.numero" required />
        <BaseInput label="Type" id="type" v-model="form.type" required placeholder="e.g. Deluxe Suite" />
        <div class="form-row">
           <BaseInput label="Price ($)" id="prix" v-model="form.prix" type="number" required />
           <BaseInput label="Capacity" id="capacite" v-model="form.capacite" type="number" required />
        </div>
        <div class="form-group">
          <label>Status</label>
          <select v-model="form.statut" class="form-select">
            <option value="DISPONIBLE">Available</option>
            <option value="OCCUPEE">Occupied</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="NETTOYAGE">Cleaning</option>
          </select>
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea v-model="form.description" class="form-textarea" rows="3"></textarea>
        </div>
      </form>
      <template #footer>
        <BaseButton variant="outline" @click="closeModal">Cancel</BaseButton>
        <BaseButton type="submit" form="room-form" :loading="saving">{{ isEditing ? 'Update' : 'Create' }}</BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRoomStore } from '@/stores/rooms'
import { storeToRefs } from 'pinia'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import api from '@/services/api'

const roomStore = useRoomStore()
const { rooms, loading } = storeToRefs(roomStore)

const isModalOpen = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const editingId = ref(null)

const form = reactive({
  numero: '',
  type: '',
  prix: '',
  capacite: '',
  statut: 'DISPONIBLE',
  description: '',
  images: [] 
})

function getStatusColor(status) {
  switch(status) {
    case 'DISPONIBLE': return 'success';
    case 'OCCUPEE': return 'danger';
    default: return 'warning';
  }
}

function openCreateModal() {
  isEditing.value = false
  editingId.value = null
  Object.assign(form, { numero: '', type: '', prix: '', capacite: '', statut: 'DISPONIBLE', description: '', images: [] })
  isModalOpen.value = true
}

function editRoom(room) {
  isEditing.value = true
  editingId.value = room.id // Ensure this matches API ID type (string/int)
  Object.assign(form, { ...room })
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
}

async function saveRoom() {
  saving.value = true
  try {
    if (isEditing.value) {
      await api.put(`/rooms/${editingId.value}`, form)
    } else {
      await api.post('/rooms', form)
    }
    await roomStore.fetchRooms()
    closeModal()
  } catch (err) {
    alert('Operation failed: ' + (err.response?.data?.message || err.message))
  } finally {
    saving.value = false
  }
}

async function deleteRoom(id) {
  if (!confirm('Are you sure you want to delete this room?')) return
  try {
    await api.delete(`/rooms/${id}`)
    roomStore.fetchRooms()
  } catch (err) {
    alert('Delete failed')
  }
}

onMounted(() => {
  roomStore.fetchRooms()
})
</script>

<style scoped>
.actions-header {
  margin-bottom: var(--spacing-lg);
  display: flex;
  justify-content: flex-end;
}

.table-container {
  background: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.data-table th, .data-table td {
  padding: var(--spacing-md);
  border-bottom: 1px solid #eee;
}

.data-table th {
  background-color: #f9f9f9;
  font-weight: 600;
  color: var(--color-text-muted);
}

.thumb {
  width: 60px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
}

.badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
}

.success { background-color: var(--color-success); color: white; }
.danger { background-color: var(--color-danger); color: white; }
.warning { background-color: var(--color-warning); color: white; }

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-primary);
  margin-right: var(--spacing-sm);
  font-weight: 600;
}

.btn-icon:hover { text-decoration: underline; }
.text-danger { color: var(--color-danger); }

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: var(--spacing-md);
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
  color: var(--color-text);
}

.form-select, .form-textarea {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid #ddd;
  border-radius: var(--radius-md);
  font: inherit;
}

.form-select:focus, .form-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}
</style>
