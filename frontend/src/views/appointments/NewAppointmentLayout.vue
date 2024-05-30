<script setup>

</script>
<template>
    <nav class="my-5 flex gap-3">
        <RouterLink :to="{name: 'new-appointment'}" class="flex-1 text-center p-3 uppercase font-extrabold hover:bg-blue-600 hover:text-white text-blue-500 bg-white">Servicios</RouterLink>

    </nav>
  

     
        <RouterView />
  
</template>



