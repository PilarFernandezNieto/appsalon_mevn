import { ref, onMounted, computed } from "vue";
import { defineStore } from "pinia";
import AuthApi from "@/api/AuthApi";

export const useUserStore = defineStore("user", () => {
  const user = ref({});

  onMounted(async () => {
    try {
      const { data }  = await AuthApi.auth();
        user.value = data.user
        console.log(user.value);
    } catch (error) {
      console.log(error);
    }
  });

  const getUserName = computed(() => user.value?.name ? user.value.name : "")

  return {
    user,
    getUserName
  };
});
