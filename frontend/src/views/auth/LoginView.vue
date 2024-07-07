<script setup>
import { inject } from 'vue';
import AuthApi from '@/api/AuthApi';

const toast = inject("toast")

const hadleSubmit = async (formData) => {
   try {
      const { data } = await AuthApi.login(formData)
       
       toast.open({
           message: data.msg,
           type: "success"
       })
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

    <FormKit id="loginForm" type="form"  :actions="false" incomplete-message="No se pudo enviar. Revisa los mensajes"
        @submit="hadleSubmit">

        <FormKit type="text" label="Email" name="email" placeholder="Email de usuario" validation="required|email"
            :validation-messages="{
                required: 'El email es obligatorio',
                email: 'Email no válido'
            }" />
        <FormKit type="password" label="Password" name="password" placeholder="Tu Password"
            validation="required" :validation-messages="{
                required: 'El password es obligatorio'
            }" />

        <FormKit type="submit">Iniciar sesión</FormKit>
    </FormKit>

</template>



