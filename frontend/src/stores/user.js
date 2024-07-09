import { ref, onMounted, computed } from "vue";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import AuthApi from "@/api/AuthApi";
import AppointmentApi from "@/api/AppointmentApi.js";

export const useUserStore = defineStore("user", () => {
    const router = useRouter()
  const user = ref({});

  onMounted(async () => {
    try {
      const { data }  = await AuthApi.auth();
        user.value = data.user
      
      await getUserAppointments()
    } catch (error) {
      console.log(error);
    }
  });

  async function getUserAppointments(){
    const { data } = await AppointmentApi.getUserAppointments(user.value._id)
    console.log(data);
  }

  function logout(){
    localStorage.removeItem("AUTH_TOKEN")
    user.value = {}
    router.push({name: "login"})
  }

  const getUserName = computed(() => user.value?.name ? user.value.name : "")

  return {
    user,
    logout,
    getUserName
  };
});
