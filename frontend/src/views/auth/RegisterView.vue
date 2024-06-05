<script setup>
import AuthApi from '@/api/AuthApi';



const hadleSubmit = async({password_confirm, ...data}) => {
    try {
        await AuthApi.register(data)
    } catch (error) {
        console.log(error);
    }
 
}

</script>

<template>
    <h1 class="text-6xl font-extrabold text-white text-center mt-10">Crea una cuenta</h1>
    <p class="text-2xl text-white text-center my-10">Crea una cuenta en AppSalón</p>

    <FormKit type="form"
        :actions="false"
        incomplete-message="No se pudo enviar, revista las notificaciones"
        @submit="hadleSubmit"
    >
        <FormKit 
            type="text"
            label="Nombre"
            name="name"
            placeholder="Tu Nombre"
            validation="required|length:3"
            :validation-messages="{
                required: 'El nombre es obligatorio',
                length: 'El nombre es muy corto'
            }"
        >
        </FormKit>
        <FormKit 
            type="email"
            label="Email"
            name="email"
            placeholder="Email de Registro"
            validation="required|email"
            :validation-messages="{
                required: 'El email es obligatorio',
                email: 'Email no válido'
            }"
        >
        </FormKit>
        <FormKit 
            type="password"
            label="Password"
            name="password"
            placeholder="Password de usuario - Min 8 caracteres"
            validation="required|length:8"
            :validation-messages="{
                required: 'El password es obligatorio',
                length: 'El password debe contener al menos 8 caracteres'
            }"
        >
        </FormKit>
        <FormKit 
            type="password"
            label="Repetir Password"
            name="password_confirm"
            placeholder="Repite el password"
            validation="required|confirm"
            :validation-messages="{
                required: 'El password es obligatorio',
                confirm: 'Los passwords no son iguales'
            }"
        >
        </FormKit>
        <FormKit type="submit">Crear cuenta</FormKit>
    </FormKit>


</template>
