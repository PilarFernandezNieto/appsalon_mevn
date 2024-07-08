import { ref, computed, onMounted, inject } from "vue";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import AppointmentApi from "@/api/AppointmentApi";
import { convertToISO } from "@/helpers/date";

export const useAppointmentsStore = defineStore("appointments", () => {
  const services = ref([]);
  const dateValue = ref("");
  const hours = ref([]);
  const time = ref("");

  const toast = inject("toast");
  const router = useRouter();

  // Genera el horario
  onMounted(() => {
    const startHour = 10;
    const endHour = 19;
    for (let hour = startHour; hour <= endHour; hour++) {
      hours.value.push(hour + ":00");
    }
  });

  function onServiceSelected(service) {
    if (services.value.some(selectedService => selectedService._id === service._id)) {
      services.value = services.value.filter(selectedService => selectedService._id !== service._id);
    } else {
      if (services.value.length === 2) {
        alert("Máximo dos servicios por cita");
        return;
      }
      services.value.push(service);
    }
  }
  async function createAppointment() {
    const appointment = {
      services: services.value.map(service => service._id),
      date: convertToISO(dateValue.value),
      time: time.value,
      totalAmount: totalAmount.value
    };

    try {
      const { data } = await AppointmentApi.create(appointment);
      toast.open({
        message: data.msg,
        type: "success"
      });
      clearAppointmentData()
      router.push({name: "my-appointments"})
    } catch (error) {
      console.log(error);
    }
  
  }
  function clearAppointmentData(){
    services.value = []
    dateValue.value = ""
    time.value = ""
  }

  const isServiceSelected = computed(() => {
    return id => services.value.some(service => service._id === id);
  });

  const noServicesSelected = computed(() => services.value.length === 0);

  const totalAmount = computed(() => {
    return services.value.reduce((total, service) => total + service.price, 0);
  });

  const isValidReservation = computed(() => {
    return services.value.length && dateValue.value.length && time.value.length;
  });

  return {
    services,
    dateValue,
    hours,
    time,
    onServiceSelected,
    createAppointment,
    isServiceSelected,
    noServicesSelected,
    totalAmount,
    isValidReservation
  };
});
