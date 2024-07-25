<script setup>
import { inject } from 'vue';
import AuthApi from '@/api/AuthApi';
import { useRouter } from 'vue-router';

const toast = inject("toast")
const router = useRouter()

const hadleSubmit = async (formData) => {
    try {

        const { data: { token } } = await AuthApi.login(formData) // Recibe el jwt
        localStorage.setItem("AUTH_TOKEN", token)
        router.push({ name: "my-appointments" })

    } catch (error) {
        toast.open({
            message: error.response.data.msg,
            type: "error"
        })
    }
}

</script>

<template>
    <h1 class="text-6xl font-extrabold text-white text-center mt-10">Iniciar sesión</h1>
    <p class="text-2xl text-white text-center my-5">Si tienes una cuenta, inicia sesión</p>

    <FormKit id="loginForm" type="form" :actions="false" incomplete-message="No se pudo enviar. Revisa los mensajes"
        @submit="hadleSubmit">

        <FormKit type="text" label="Email" name="email" placeholder="Email de usuario" validation="required|email"
            :validation-messages="{
                required: 'El email es obligatorio',
                email: 'Email no válido'
            }" />
        <FormKit type="password" label="Password" name="password" placeholder="Tu Password" validation="required"
            :validation-messages="{
                required: 'El password es obligatorio'
            }" />

        <FormKit type="submit">Iniciar sesión</FormKit>
    </FormKit>

</template>
