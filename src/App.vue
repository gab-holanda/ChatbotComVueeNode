<template>
  <div class="app">
    <section class="side-bar">
      <button @click="createNewChat">+ New chat</button>
      <ul class="history">
        <li
          v-for="(uniqueTitle, index) in uniqueTitles"
          :key="index"
          @click="handleClick(uniqueTitle)"
        >
          {{ uniqueTitle }}
        </li>
      </ul>
      <nav>
        <p>Made by Gabriel</p>
      </nav>
    </section>
    <section class="main">
      <h1 v-if="!currentTitle">GabrielGPT</h1>
      <ul class="feed">
        <li v-for="(chatMessage, index) in currentChat" :key="index">
          <!-- <img v-if="imageList[index]" :src="imageList[index]" /> -->
          <p class="role">{{ chatMessage.role }}</p>
          <div v-if="imageList[index - Math.ceil(index / 2)] && index % 2">
            <img :src="imageList[index - Math.ceil(index / 2)]" />
          </div>
          <p>{{ chatMessage.content }}</p>
        </li>
      </ul>
      <div class="bottom-section">
        <div class="input-container">
          <input v-model="value" />
          <div id="submit" @click="getMessages">
            ➢
          </div>
        </div>
        <p class="info">
          Get answers. Find inspiration. Be more productive. Free to use. Easy
          to try. Just ask and ChatGPT can help with writing, learning,
          brainstorming, and more.
        </p>
      </div>
    </section>
  </div>
</template>




<script>
import { ref, watch, computed } from 'vue';
export default {
  setup() {
    const value = ref(null);
    const message = ref(null);
    const imageList = ref([]);
    const previousChats = ref([]);
    const currentTitle = ref(null);




    const createNewChat = () => {
      message.value = null;
      value.value = "";
      currentTitle.value = null;
    };

    const handleClick = (uniqueTitle) => {
      currentTitle.value = uniqueTitle;
      message.value = null;
      value.value = "";
    };




    const getMessages = async () => {
      const options = {
        method: "POST",
        body: JSON.stringify({
          message: value.value,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };
      try {
        const response = await fetch("http://localhost:8000/completions", options);
        const data = await response.json();
        console.log("API response:", data);
        message.value = data.opeanAi.choices[0].message;

        
        
        if(data.imageUrl){
            imageList.value.push(data.imageUrl);
        }

        else{
          imageList.value.push(undefined);
        }


        // Mover a lógica de adicionar a conversa para dentro de getMessages
        if (!currentTitle.value) {
          currentTitle.value = value.value;
        }

       



        previousChats.value.push(
          { title: currentTitle.value, role: "user", content: value.value },
          { title: currentTitle.value, role: message.value.role, content: message.value.content }
        );




        value.value = ""; // Limpa o input após enviar a mensagem
      } catch (error) {
        console.error(error);
      }
    };




    const currentChat = computed(() =>
      previousChats.value.filter((chat) => chat.title === currentTitle.value)
    );




    const uniqueTitles = computed(() =>
      Array.from(new Set(previousChats.value.map((chat) => chat.title)))
    );




    return {
      value,
      imageList,
      message,
      previousChats,
      currentTitle,
      createNewChat,
      handleClick,
      getMessages,
      currentChat,
      uniqueTitles,
    };
  }
};




</script>




<style src="./index.css"></style>
