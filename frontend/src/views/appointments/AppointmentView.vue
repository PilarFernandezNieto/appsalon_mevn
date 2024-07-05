<script setup>
import SelectedService from '@/components/SelectedService.vue';
import { useAppointmentsStore } from '@/stores/appointments';

const appointments = useAppointmentsStore();


</script>

<template>
   <div>
      <h2 class="text text-4xl font-extrabold text-white mt-10">Detalles de la cita y Resumen</h2>
      <p class="text-white text-lg">Verifica la información y confirma tu cita</p>

      <h3 class="text-3xl font-extrabold text-white ">Servicios</h3>
      <div class="grid gap-5">
         <SelectedService v-for="service in appointments.services" :key="service._id" :service="service" />
      </div>

   </div>

</template>
