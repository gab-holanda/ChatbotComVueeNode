<template>
  <div class="app">
    <section class="main">
      <h1>Painel Admin - Esportes Olímpicos</h1>
      <div class="input-container">
        <label for="image-upload">Upload de Imagem:</label>
        <input type="file" id="image-upload" @change="handleImageUpload" />
      </div>
      <div class="input-container">
        <label for="keyword-input">Palavra-chave:</label>
        <input v-model="keyword" id="keyword-input" placeholder="Digite a palavra-chave" />
      </div>
      <div class="bottom-section">
        <div class="input-container">
          <button @click="saveData">Enviar</button>
        </div>
      </div>
    </section>
  </div>
</template>


<script>
import { ref } from 'vue';


export default {
  setup() {
    const keyword = ref('');
    const image = ref(null);


    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      image.value = file;
    };


    const saveData = async () => {
      if (image.value && keyword.value) {
        const formData = new FormData();
        formData.append("image", image.value);
        formData.append("keyword", keyword.value);


        try {
          const response = await fetch("http://localhost:8000/upload", {
            method: "POST",
            body: formData,
          });
          const result = await response.json();
          alert('Dados salvos com sucesso!');
          console.log('Resultado:', result);
        } catch (error) {
          console.error('Erro ao enviar os dados:', error);
          alert('Erro ao enviar os dados. Por favor, tente novamente.');
        }
      } else {
        alert('Por favor, adicione uma imagem e uma palavra-chave.');
      }
    };


    return {
      keyword,
      handleImageUpload,
      saveData,
    };
  },
};
</script>


<style src="./index.css"></style>