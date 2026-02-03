<template>
  <div class="rooms-manager">
    <div class="actions-header">
      <BaseButton @click="openCreateModal" class="btn-add-room">Ajouter une chambre</BaseButton>
    </div>

    <div v-if="loading">Chargement des chambres...</div>
    <div v-else class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Type</th>
            <th>Numéro</th>
            <th>Prix</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="room in rooms" :key="room.id">
            <td>
              <div class="thumb-container">
                <img v-for="(img, idx) in room.images" :key="idx" :src="img" class="thumb">
                <img v-if="!room.images || room.images.length === 0" src="https://placehold.co/100x60?text=No+Image" class="thumb">
              </div>
            </td>
            <td>{{ room.type }}</td>
            <td>{{ room.numero }}</td>
            <td>{{ room.prix }} MRU</td>
            <td><span :class="['status-text', getStatusColor(room.statut)]">{{ room.statut }}</span></td>
            <td>
              <div class="action-buttons">
                <button class="btn-admin btn-admin-edit" @click="editRoom(room)">Modifier</button>
                <button class="btn-admin btn-admin-delete" @click="deleteRoom(room.id)">Supprimer</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal :isOpen="isModalOpen" :title="isEditing ? 'Modifier la chambre' : 'Ajouter une chambre'" @close="closeModal">
      <form @submit.prevent="saveRoom" id="room-form">
        <BaseInput label="Numéro de chambre" id="numero" v-model="form.numero" required />
        <BaseInput label="Type" id="type" v-model="form.type" required placeholder="ex: Suite Deluxe" />
        <div class="form-row">
           <BaseInput label="Prix (MRU)" id="prix" v-model="form.prix" type="number" required />
           <BaseInput label="Capacité" id="capacite" v-model="form.capacite" type="number" required />
        </div>
        <div class="form-group">
          <label>Statut</label>
          <select v-model="form.statut" class="form-select">
            <option value="DISPONIBLE">Disponible</option>
            <option value="EN_ATTENTE">En attente</option>
            <option value="RESERVEE">Réservée</option>
            <option value="OCCUPEE">Occupée</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="NETTOYAGE">Nettoyage</option>
          </select>
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea v-model="form.description" class="form-textarea" rows="3"></textarea>
        </div>
        <div class="form-group">
          <label>Images (max 3)</label>
          <input 
            type="file" 
            ref="imageInput"
            @change="handleImageChange" 
            accept="image/*" 
            multiple 
            class="form-file-input"
          />
          <p class="form-hint">Sélectionnez jusqu'à 3 images. Les images existantes seront remplacées uniquement si vous en uploadez de nouvelles.</p>
        </div>
      </form>
      <template #footer>
        <BaseButton variant="outline" @click="closeModal">Annuler</BaseButton>
        <BaseButton type="submit" form="room-form" :loading="saving">{{ isEditing ? 'Mettre à jour' : 'Créer' }}</BaseButton>
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
  image1: null,
  image2: null,
  image3: null
})

const selectedImages = ref([])
const imageInput = ref(null)

function getStatusColor(status) {
  switch(status) {
    case 'DISPONIBLE': return 'success';
    case 'OCCUPEE': 
    case 'RESERVEE': return 'danger';
    case 'EN_ATTENTE':
    case 'MAINTENANCE': 
    case 'NETTOYAGE': return 'warning';
    default: return 'warning';
  }
}

function handleImageChange(event) {
  const files = Array.from(event.target.files)
  if (files.length > 3) {
    alert('Vous ne pouvez sélectionner que 3 images maximum')
    selectedImages.value = files.slice(0, 3)
  } else {
    selectedImages.value = files
  }
}

function openCreateModal() {
  isEditing.value = false
  editingId.value = null
  selectedImages.value = []
  if (imageInput.value) imageInput.value.value = ''
  Object.assign(form, { 
    numero: '', 
    type: '', 
    prix: '', 
    capacite: '', 
    statut: 'DISPONIBLE', 
    description: '', 
    image1: null,
    image2: null,
    image3: null
  })
  isModalOpen.value = true
}

function editRoom(room) {
  isEditing.value = true
  editingId.value = room.id
  selectedImages.value = []
  if (imageInput.value) imageInput.value.value = ''
  // Assign only the necessary fields to avoid overwriting with nested objects
  form.numero = room.numero
  form.type = room.type
  form.prix = room.prix
  form.capacite = room.capacite
  form.statut = room.statut
  form.description = room.description
  // Store the original image filenames for update
  form.image1 = room.image1 || null
  form.image2 = room.image2 || null
  form.image3 = room.image3 || null
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
}

async function saveRoom() {
  saving.value = true
  try {
    // Si des images sont sélectionnées, utiliser FormData
    if (selectedImages.value.length > 0) {
      const formData = new FormData()
      formData.append('numero', form.numero)
      formData.append('type', form.type)
      formData.append('prix', form.prix)
      formData.append('capacite', form.capacite)
      formData.append('statut', form.statut)
      formData.append('description', form.description)
      
      // Ajouter les images
      selectedImages.value.forEach((file) => {
        formData.append('images', file)
      })
      
      if (isEditing.value) {
        await api.put(`/rooms/${editingId.value}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      } else {
        await api.post('/rooms', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }
    } else {
      // Sinon, envoyer du JSON simple
      const dataToSend = {
        numero: form.numero,
        type: form.type,
        prix: form.prix,
        capacite: form.capacite,
        statut: form.statut,
        description: form.description,
        image1: form.image1,
        image2: form.image2,
        image3: form.image3
      }
      
      if (isEditing.value) {
        await api.put(`/rooms/${editingId.value}`, dataToSend)
      } else {
        await api.post('/rooms', dataToSend)
      }
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
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette chambre ?')) return
  try {
    await api.delete(`/rooms/${id}`)
    roomStore.fetchRooms()
  } catch (err) {
    alert('Échec de la suppression')
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
  justify-content: flex-start;
}

.btn-add-room {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 700;
}

.table-container {
  background: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  overflow-x: auto;
}

:global(.dark) .table-container {
  background: var(--color-surface);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.data-table th, .data-table td {
  padding: var(--spacing-md);
  border: 1px solid #ddd;
  color: var(--color-text);
}

:global(.dark) .data-table th, 
:global(.dark) .data-table td {
  border-color: rgba(255,255,255,0.1);
}

.data-table th {
  background-color: #f1f1f1;
  font-weight: 700;
  color: var(--color-primary);
  text-transform: uppercase;
  font-size: 0.85rem;
}

:global(.dark) .data-table th {
  background-color: rgba(0,0,0,0.2);
  color: var(--color-text);
}

.thumb-container {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.thumb {
  width: 80px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.status-text {
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
}

.status-text.success { color: #10b981; }
.status-text.danger { color: #ef4444; }
.status-text.warning { color: #f59e0b; }

.action-buttons {
  display: flex;
  gap: 10px;
}

.btn-admin {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
  transition: opacity 0.2s;
}

.btn-admin:hover {
  opacity: 0.8;
}

.btn-admin-edit {
  background-color: #ffcc00;
  color: #fff;
}

.btn-admin-delete {
  background-color: #ff4444;
  color: #fff;
}

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
  background-color: var(--color-surface);
  color: var(--color-text);
}

:global(.dark) .form-select, 
:global(.dark) .form-textarea {
  border-color: rgba(255,255,255,0.1);
  background-color: var(--color-background);
}

.form-select:focus, .form-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}

.form-file-input {
  padding: var(--spacing-sm);
  border: 2px dashed #ddd;
  border-radius: var(--radius-md);
  cursor: pointer;
  font: inherit;
  width: 100%;
}

:global(.dark) .form-file-input {
  border-color: rgba(255,255,255,0.1);
}

.form-file-input:hover {
  border-color: var(--color-primary);
}

.form-hint {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin-top: 0.25rem;
}
</style>
