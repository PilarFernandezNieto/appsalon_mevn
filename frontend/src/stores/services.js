import { ref, onMounted } from "vue";
import { defineStore } from "pinia";
import ServicesApi from "@/api/ServicesApi";

export const useServicesStore = defineStore("services", () => {

  const services = ref([]);
  onMounted(async () => {
    try {
      const { data } = await ServicesApi.all();
      services.value = data
    } catch (error) {
      console.log(error);
    }
  });

  return {
    services
  };
});
