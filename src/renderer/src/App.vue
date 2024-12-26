<template>
  <div class="h-svh w-svw overflow-hidden">
    <RouterView />
  </div>
</template>
<script setup lang="ts"></script>
<style>
body {
  margin: 0;
}
html {
  overflow-y: auto !important;
}
</style>
