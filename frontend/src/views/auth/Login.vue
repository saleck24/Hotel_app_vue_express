<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <div class="w max-w-md p-4 login-card">
      <h1 class="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">Login</h1>

      <form @submit.prevent="login" class="space-y-8">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          required
          class="login-input"
        />

        <input
          v-model="password"
          type="password"
          placeholder="Mot de passe"
          required
          class="login-input"
        />

        <button
          type="submit"
          class="w-full login-button"
        >
          Se connecter
        </button>

        <p v-if="errorMessage" class="login-error">{{ errorMessage }}</p>
      </form>

      <div class="mt-4 text-center">
        <router-link class="login-link" to="/forgot-password">
          Mot de passe oublié?
        </router-link>
        <br />
        <router-link class="login-link" to="/register">
          S'inscrire
        </router-link>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref } from "vue";
import API from "../../services/api";
import { useRouter } from "vue-router";
import { updateUser } from "../../stores/user";

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const router = useRouter();

const login = async () => {
  try {
    const res = await API.post("/auth/login", { 
      email: email.value, 
      password: password.value 
    });

    const { token, user } = res.data;
    console.log("Login successful, user:", user);
    console.log("User role:", user.role);
    
    if (!user.role) {
      console.error("No role found in user object!");
      errorMessage.value = "Erreur: rôle utilisateur non défini";
      return;
    }
    
    localStorage.setItem("token", token);
    updateUser(user);
    console.log("User updated, role:", user.role);

    // Redirection basée sur le rôle
    if (user.role === "ADMIN") {
      console.log("Redirecting to admin dashboard");
      router.push("/admin/dashboard");
    } else {
      console.log("Redirecting to client dashboard");
      router.push("/client/dashboard");
    }
  } catch (err) {
    console.error("Login error:", err);
    if (err.response?.status === 401) {
      errorMessage.value = "Email ou mot de passe incorrect";
    } else {
      errorMessage.value = err.response?.data?.message || "Erreur lors de la connexion";
    }
  }
};
</script>
