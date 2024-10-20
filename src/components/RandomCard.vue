<template>
  <div class="lobby-card-random">
    <h1>Random Lobby Card</h1>
    <button @click="fetchRandomCard">Get Random Lobby Card</button>
    <div v-if="randomCard" class="card-container">
      <h3>{{ randomCard.title || 'No Title' }}</h3>
      <p>{{ randomCard.name || 'No Name' }}</p>
      <div class="imgContainer">
        <img :src="randomCard.imgurl" alt="Image not available" />
      </div>
    </div>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      randomCard: null, // Store the selected random card
      originalItems: [], // Store all items fetched for random selection
      errorMessage: '' // To store any error messages
    }
  },
  methods: {
    async fetchRandomCard() {
      const url =
        'https://api.collection.nfsa.gov.au/search?limit=25&forms=Lobby%20card&hasMedia=yes'
      try {
        const response = await fetch(url)
        if (!response.ok) throw new Error(`Response status: ${response.status}`)

        const data = await response.json()
        let baseurl = 'https://media.nfsacollection.net/'

        this.originalItems = data.results.map((item) => {
          const imgurl = item.preview?.find((preview) => preview.filePath)?.filePath
          return {
            title: item.title,
            name: item.name,
            imgurl: imgurl ? `${baseurl}${imgurl}` : ''
          }
        })

        // Select a random card from the fetched items
        this.randomCard = this.getRandomCard()
        this.errorMessage = '' // Clear any previous error message
      } catch (error) {
        console.error(error.message)
        this.errorMessage = 'Failed to fetch lobby cards. Please try again.' // Set error message
      }
    },
    getRandomCard() {
      if (this.originalItems.length === 0) return null
      const randomIndex = Math.floor(Math.random() * this.originalItems.length)
      return this.originalItems[randomIndex]
    }
  }
}
</script>

<style scoped>
.lobby-card-random {
  min-width: 340px;
  display: flex;
  flex-direction: column;
  max-height: 600px;
  border: #45a049;
  border-style: dotted;
  border-radius: 20px;
  text-align: center;
  margin: 20px;
  padding: 20px;
}
.card-container {
  color: #1f2937;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  margin-top: 20px;
  display: inline-block;
  width: 300px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}
button {
  background-color: #4caf50; /* Green */
  color: white;
  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}
button:hover {
  background-color: #45a049;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>
