<script setup>
import { inject } from 'vue';
import { useRouter } from 'vue-router';
import AuthApi from '@/api/AuthApi';

const toast = inject("toast")
const router = useRouter();

const hadleSubmit = async (formData) => {
   try {
    const { data: {token} } = await AuthApi.login(formData)

    localStorage.setItem("AUTH_TOKEN", token)

    router.push({name:"my-appointments"})

   } catch (error) {

    console.log(error)
    toast.open({
        message: error.response.data.msg,
        type: "error"
    })
       
   }
}

</script>

<template>
    <h1 class="text-6xl font-extrabold text-white text-center mt-10">Iniciar sesión</h1>
    <p class="text-2xl text-white text-center my-10">Si tienes una cuenta, inicia sesión</p>

    <FormKit id="loginForm" type="form" :actions="false" incomplete-message="No se pudo enviar, revista las notificaciones"
        @submit="hadleSubmit">

        <FormKit type="email" label="Email" name="email" placeholder="Email de usuario" validation="required|email"
            :validation-messages="{
                required: 'El email es obligatorio',
                email: 'Email no válido'
            }">
        </FormKit>
        <FormKit type="password" label="Password" name="password" placeholder="Password de usuario"
            validation="required" :validation-messages="{
                required: 'El password es obligatorio'
            }">
        </FormKit>

        <FormKit type="submit">Iniciar Sesión</FormKit>
    </FormKit>


</template>



