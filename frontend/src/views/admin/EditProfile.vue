<template>
  <div class="max-w-xl mx-auto bg-white dark:bg-gray-800 p-6 rounded shadow">
    <h1 class="text-2xl font-bold mb-6">Modifier le profil</h1>

    <!-- Image -->
    <div class="flex flex-col items-center mb-6">
      <img
        :src="profileImage"
        class="w-24 h-24 rounded-full object-cover border dark:border-gray-600"
        alt="Photo de profil"
      />
      <input
        type="file"
        accept="image/*"
        class="mt-3 text-sm"
        @change="onImageChange"
      />
    </div>

    <!-- Nom -->
    <div class="mb-4">
      <label class="block mb-1 font-medium">Nom</label>
      <input
        v-model="name"
        type="text"
        class="edit-profile-input w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
      />
    </div>

    <!-- Messages -->
    <p class="text-green-500 mb-2" v-if="successMessage">{{ successMessage }}</p>
    <p class="text-red-500 mb-2" v-if="errorMessage">{{ errorMessage }}</p>

    <!-- Actions -->
    <div class="flex justify-center">
      <button
        @click="saveProfile"
        class="edit-profile-button"
      >
        Enregistrer
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import API from "../../services/api"; 
import { userState, updateUser } from "../../stores/user";

const name = ref("");
const profileImage = ref("/default-avatar.jpg");
let selectedFile = null;
const router = useRouter();  

const errorMessage = ref("");
const successMessage = ref("");

// Charger depuis le store pour afficher au départ
onMounted(() => {
  name.value = userState.nom;
  profileImage.value = userState.profile_image;
});

// Changement de fichier
const onImageChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  selectedFile = file;
  profileImage.value = URL.createObjectURL(file);
};

// Enregistrement
const saveProfile = async () => {
  try {
    const formData = new FormData();
    formData.append("nom", name.value);
    if (selectedFile) formData.append("profile_image", selectedFile);

    const token = localStorage.getItem("token");

    const res = await API.put("/users/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    // Mise à jour réactive
    updateUser(res.data.user);

    router.push("/admin/dashboard");

  } catch (err) {
    console.error(err);
    errorMessage.value =
      err.response?.data?.message || "Erreur lors de la mise à jour";
    successMessage.value = "";
  }
};
</script>
