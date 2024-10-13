<script lang="ts">
export default {
  name: 'SearchBar'
}
</script>

<template>
  <div id="controls">
    <button onclick="sortImagesByColorCategory('red')">Sort by Red</button>
    <button onclick="sortImagesByColorCategory('blue')">Sort by Blue</button>
    <button onclick="sortImagesByColorCategory('yellow')">Sort by Yellow</button>
    <button onclick="sortImagesByColorCategory('green')">Sort by Green</button>
    <button onclick="sortImagesByColorCategory('purple')">Sort by Purple</button>
    <button onclick="sortImagesByColorCategory('orange')">Sort by Orange</button>
    <button onclick="sortImagesByColorCategory('white')">Sort by White</button>
    <button onclick="sortImagesByColorCategory('black')">Sort by Black</button>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  button {
    margin: 10px;
    padding: 10px;
  }
}
</style>
