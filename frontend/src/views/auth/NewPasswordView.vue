<script setup>
import { onMounted, inject, ref } from 'vue';
import { reset } from '@formkit/vue';
import { useRoute, useRouter } from 'vue-router';
import AuthApi from '@/api/AuthApi';

const toast = inject("toast")
const route = useRoute()
const router = useRouter()
const {token} = route.params
const validToken = ref(false)
onMounted(async () => {
    try {
        const { data } = await AuthApi.verifyPasswordResetToken(token)
        validToken.value = true
        
    } catch (error) {
        toast.open({
            message: error.response.data.msg,
            type: "error"
        })
    }
})

const hadleSubmit = async ({password}) => {
    try {
        const { data } = await AuthApi.updatePassword(token, { password })
        toast.open({
            message: data.msg,
            type: "success"
        })
        setTimeout(() => {
            router.push({name: "login"})
        }, 3000);
    } catch (error) {
        toast.open({
            message: error.response.data.msg,
            type: "error"
        })
    }
}


</script>


<template>
    <div v-if="validToken">

        <h1 class="text-6xl font-extrabold text-white text-center mt-10">Nuevo Password</h1>
        <p class="text-2xl text-white text-center my-5">Introduce tu nuevo password</p>
        <FormKit id="newPasswordForm" type="form" :actions="false" incomplete-message="No se pudo enviar. Revisa los mensajes"
            @submit="hadleSubmit">
            <FormKit type="password" label="Password" name="password" placeholder="Tu Password - Mínimo 8 caracteres"
            validation="required|length:8" :validation-messages="{
                required: 'El password es obligatorio',
                length: 'Al menos 8 caracteres'
            }" />
 
                <FormKit type="submit">Guardar password</FormKit>
        </FormKit>
    </div>
    <p v-else class="text-center text2xl font-black text-white">Token no válido</p>
</template>
