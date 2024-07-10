<script setup>
import { ref } from "vue"
import VueTailwindDatePicker from "vue-tailwind-datepicker"
import SelectedService from '@/components/SelectedService.vue';
import { formatCurrency } from '@/helpers';
import { useAppointmentsStore } from '@/stores/appointments';

const formatter = ref({
  date:"DD/MM/YYYY"
});
const appointments = useAppointmentsStore();

const disabledDate = (date) => {
    const today = new Date();
    return date < today || date.getMonth() > today.getMonth() + 1 || [0, 6].includes(date.getDay())
}


</script>

<template>
   <div class="space-y-5">
      <h2 class="text text-4xl font-extrabold text-white">Detalles de la cita y Resumen</h2>
      <p class="text-white text-lg">Verifica la información y confirma tu cita</p>

      <h3 class="text-3xl font-extrabold text-white ">Servicios</h3>
      <p v-if="appointments.noServicesSelected" class="text-white text-center text-2xl">No hay servicios seleccionados
      </p>

      <div v-else class="grid gap-5">
         <SelectedService v-for="service in appointments.services" :key="service._id" :service="service" />
         <p class="text-right text-white text-2xl">Total a pagar: <span class="font-black">{{
            formatCurrency(appointments.totalAmount) }}</span></p>
      </div>

      <div class="space-y-8" v-if="!appointments.noServicesSelected">
         <h3 class="text-3xl font-extrabold text-white">Fecha y Hora</h3>

         <div class="lg:flex gap-5 items-start">
            <div class="w-full lg:w-96 bg-white flex justify-center rounded-lg">
               <VueTailwindDatePicker v-model="appointments.dateValue"  
                  :disable-date="disabledDate"
                  i18n="es"
                  as-single
                  no-input
                  :formatter="formatter"
               />
            </div>
            <div v-if="appointments.isDateSelected" class="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-5 mt-10 lg:mt-0 ">
               <button type="button" 
                  v-for="hour in appointments.hours" 
                  class="block text-blue-500 rounded-lg text-xl font-black p-3 disabled:opacity-50"
                  :class="appointments.time === hour ? 'bg-blue-500 text-white' : 'bg-white' "
                  @click="appointments.time = hour"
                  :disabled="appointments.disabledTime(hour) ? true : false"
               >{{ hour }}</button>

            </div>
         </div>
         <div v-if="appointments.isValidReservation" class="flex justify-end">
            <button 
               class="w-full md:w-auto bg-blue-500 p-3 rounded-lg uppercase font-black text-white"
               @click="appointments.saveAppointment"
               >Confirmar reserva</button>
         </div>
      </div>

   </div>

</template>
