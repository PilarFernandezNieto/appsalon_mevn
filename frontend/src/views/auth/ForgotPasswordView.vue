<script setup>
import { inject } from 'vue';
import { reset } from '@formkit/core';
import AuthApi from '@/api/AuthApi';
const toast = inject("toast")

const hadleSubmit = async({email}) => {
    try {
        const {data} = await AuthApi.forgotPassword({email})

        toast.open({
            message: data.msg,
            type: "success"
        })
        reset("forgotPassword")
    } catch (error) {
        toast.open({
            message: error.response.data.msg,
            type: "error"
        })
    }
}

</script>


<template>
    <div>
        <h1 class="text-6xl font-extrabold text-white text-center mt-10">Olvidé mi password</h1>
        <p class="text-2xl text-white text-center my-5">Recupera el acceso a tu cuenta</p>
        <FormKit id="forgotPassword" type="form" :actions="false" incomplete-message="No se pudo enviar. Revisa los mensajes"
            @submit="hadleSubmit">

            <FormKit type="text" label="Email" name="email" placeholder="Email de usuario" validation="required|email"
                :validation-messages="{
                    required: 'El email es obligatorio',
                    email: 'Email no válido'
                }" />
                <FormKit type="submit">Enviar instrucciones</FormKit>
        </FormKit>
    </div>
</template>
