import { ref, computed, onMounted, inject, watch } from "vue";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import AppointmentApi from "@/api/AppointmentApi";
import { convertToISO, convertToDDMMYYYY } from "@/helpers/date";
import { useUserStore } from "./user";

export const useAppointmentsStore = defineStore("appointments", () => {
  const appointmentId = ref("");
  const services = ref([]);
  const dateValue = ref("");
  const time = ref("");
  const appointmentsByDate = ref([]);
  const hours = ref([]);

  const toast = inject("toast");
  const router = useRouter();
  const user = useUserStore();

  // Genera el horario
  onMounted(() => {
    const startHour = 10;
    const endHour = 19;
    for (let hour = startHour; hour <= endHour; hour++) {
      hours.value.push(hour + ":00");
    }
  });

  watch(dateValue, async () => {
    time.value = "";
    if (dateValue.value === "") return;
    // Obtenemos las citas
    const { data } = await AppointmentApi.getByDate(dateValue.value);

    if (appointmentId.value) {
      appointmentsByDate.value = data.filter(appointment => appointment._id !== appointmentId.value);
      time.value = data.filter(appointment => appointment._id === appointmentId.value)[0].time;
    } else {
      appointmentsByDate.value = data;
    }
  });

  function setSelectedAppointment(appointment) {
    console.log(appointment);
    services.value = appointment.services;
    dateValue.value = convertToDDMMYYYY(appointment.date);
    time.value = appointment.time;
    appointmentId.value = appointment._id;
  }

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
  async function saveAppointment() {
    const appointment = {
      services: services.value.map(service => service._id),
      date: convertToISO(dateValue.value),
      time: time.value,
      totalAmount: totalAmount.value
    };

    // So existe Id, edita
    if (appointmentId.value) {
      try {
        const { data } = await AppointmentApi.update(appointmentId.value, appointment);
        toast.open({
          message: data.msg,
          type: "success"
        });
      } catch (error) {
        console.log(error);
      }
      // Si no existe, crea
    } else {
      try {
        const { data } = await AppointmentApi.create(appointment);
        toast.open({
          message: data.msg,
          type: "success"
        });
      } catch (error) {
        console.log(error);
      }
    }
    clearAppointmentData();
    user.getUserAppointments();
    router.push({ name: "my-appointments" });
  }
  function clearAppointmentData() {
    services.value = [];
    dateValue.value = "";
    time.value = "";
    appointmentId.value = "";
  }

  async function cancelAppointment(id) {
    if(confirm('¿Deseas cancelar esta cita?')) {
      try {
          const { data } = await AppointmentApi.delete(id)
          toast.open({
              message: data.msg,
              type: 'success'
          })

          user.userAppointments = user.userAppointments.filter( appointment => appointment._id !== id)
      } catch (error) {
          toast.open({
              message: error.response.data.msg,
              type: 'error'
          })
      }
  }
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

  const isDateSelected = computed(() => {
    return dateValue.value ? true : false;
  });
  const disabledTime = computed(() => {
    return hour => {
      return appointmentsByDate.value.find(appointment => appointment.time === hour);
    };
  });

  return {
    services,
    dateValue,
    hours,
    time,
    appointmentsByDate,
    onServiceSelected,
    saveAppointment,
    clearAppointmentData,
    setSelectedAppointment,
    isServiceSelected,
    noServicesSelected,
    totalAmount,
    isValidReservation,
    isDateSelected,
    disabledTime,
    cancelAppointment
  };
});
