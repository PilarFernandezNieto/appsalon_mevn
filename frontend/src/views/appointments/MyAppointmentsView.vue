<script setup>
import { useUserStore } from '@/stores/user.js';
import Appointments from "../../components/Appointments.vue"
const user = useUserStore();

</script>

<template>
    <h2 class="text text-4xl font-extrabold text-white mt-10">Mis Citas</h2>
    <p class="text-white text-lg mt-5">Desde aquí podrás administrar tus citas</p>

    <p v-if="user.loading" class="text-white text-2xl text-center">Cargando...</p>
    <div v-else>
        <p v-if="user.noAppointments" class="text-white text-2xl text-center">No tienes próximas citas</p>
        <div v-else class="grid grid-cols-1 gap-5 mt-10">
            <Appointments v-for="appointment in user.userAppointments"  :key="appointment._id" :appointment="appointment"/>
        </div>
    </div>
</template>
