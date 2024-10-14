<template>
  <div class="lobby-card-collection">
    <h1>Lobby Card Collection</h1>
    <button @click="fetchData">Load Lobby Cards</button>
    <div id="gallery">
      <div v-for="item in items" :key="item.id" class="card-container">
        <h3>{{ item.title || 'No Title' }}</h3>
        <p>{{ item.name || 'No Name' }}</p>
        <div class="imgContainer">
          <img :src="item.imgurl" alt="Image not available" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: []
    }
  },
  methods: {
    async fetchData() {
      const url =
        'https://api.collection.nfsa.gov.au/search?limit=25&forms=Lobby%20card&hasMedia=yes'
      try {
        const response = await fetch(url)
        if (!response.ok) throw new Error(`Response status: ${response.status}`)

        const data = await response.json()
        let baseurl = 'https://media.nfsacollection.net/'

        this.items = data.results.map((item) => {
          const imgurl = item.preview?.find((preview) => preview.filePath)?.filePath
          return {
            title: item.title,
            name: item.name,
            imgurl: imgurl ? `${baseurl}${imgurl}` : ''
          }
        })
      } catch (error) {
        console.error(error.message)
      }
    }
  }
}
</script>

<style scoped>
body {
  font-family: 'Arial', sans-serif;
  background-color: #f3f4f6;
  color: #333;
  text-align: center;
  margin: 0;
  padding: 0;
}

h1 {
  font-size: 2.5em;
  color: #374151;
  margin: 20px 0;
}

button {
  background-color: #6366f1;
  color: white;
  padding: 10px 20px;
  font-size: 1em;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;
}

button:hover {
  background-color: #4f46e5;
  transform: scale(1.05);
}

#gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
}

.card-container {
  background-color: white;
  border-radius: 15px;
  padding: 15px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  overflow: hidden;
}

.card-container:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.card-container h3 {
  font-size: 1.2em;
  color: #1f2937;
  margin: 10px 0;
}

.card-container p {
  font-size: 0.9em;
  color: #6b7280;
  margin-bottom: 15px;
}

.imgContainer {
  overflow: hidden;
  border-radius: 10px;
}

.imgContainer img {
  width: 100%;
  height: auto;
  transition: transform 0.4s ease;
  border-radius: 10px;
}

.imgContainer:hover img {
  transform: scale(1.1);
}
</style>
