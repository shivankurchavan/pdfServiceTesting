<!-- src/components/Certificate.vue -->
<template>
  <div class="certificate">
    <h1>Certificate of Achievement</h1>
    <p>This is to certify that</p>
    <h2>{{ studentName }}</h2>
    <p>has successfully completed the course.</p>
  </div>
</template>

<script>
export default {
  props: {
    studentName: String
  }
};
</script>

<style scoped>
.certificate {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid #000;
}
</style>
