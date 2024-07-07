<script setup>
import { inject } from 'vue';
import { reset } from '@formkit/vue';
import AuthApi from '@/api/AuthApi';

const toast = inject("toast")


const hadleSubmit = async ({ password_confirm, ...FormData }) => {
    try {
        const { data } = await AuthApi.register(FormData)
       
        toast.open({
            message: data.msg,
            type: "success"
        })
        reset("registerForm")

    } catch (error) {
        toast.open({
            message: error.response.data.msg,
            type: "error"
        })
      
    }
}

</script>

<template>
    <h1 class="text-6xl font-extrabold text-white text-center mt-10">Crea una cuenta</h1>
    <p class="text-2xl text-white text-center my-5">Crea una cuenta en AppSalón</p>

    <FormKit id="registerForm" type="form"  :actions="false" incomplete-message="No se pudo enviar. Revisa los mensajes"
        @submit="hadleSubmit">
        <FormKit type="text" label="Nombre" name="name" placeholder="Tu Nombre" validation="required|length:3"
            :validation-messages="{
                required: 'El nombre es obligatorio',
                length: 'El nombre es muy corto'
            }" />
        <FormKit type="text" label="Email" name="email" placeholder="Email de registro" validation="required|email"
            :validation-messages="{
                required: 'El email es obligatorio',
                email: 'Email no válido'
            }" />
        <FormKit type="password" label="Password" name="password" placeholder="Tu Password - Mínimo 8 caracteres"
            validation="required|length:8" :validation-messages="{
                required: 'El password es obligatorio',
                length: 'Al menos 8 caracteres'
            }" />
        <FormKit type="password" label="Repetir password" name="password_confirm" placeholder="Repite el password"
            validation="required|confirm" :validation-messages="{
                required: 'El password es obligatorio',
                confirm: 'Los passwords no son iguales'
            }" />
        <FormKit type="submit">Crear cuenta</FormKit>
    </FormKit>

</template>
