<template>
  <div class="lobby-card-random">
    <h1>Random Lobby Card</h1>
    <button class="greenbutton" @click="fetchRandomCard">Get Random Lobby Card</button>
    <div v-if="randomCard" class="card-container" @click="openPopup(randomCard)">
      <h3>{{ randomCard.title || 'No Title' }}</h3>
      <p>{{ randomCard.name || 'No Name' }}</p>
      <div class="imgContainer">
        <img :src="randomCard.imgurl" alt="Image not available" />
      </div>
    </div>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

    <!-- Popup implementation -->
    <div v-if="popupVisible" class="popup">
      <div class="popup-content">
        <button class="close-button" @click="closePopup">&times;</button>
        <h3>{{ selectedItem.title || 'No Title' }}</h3>
        <div class="imgPopup">
          <img :src="selectedItem.imgurl" alt="Image not available" />
        </div>
        <p>
          Date:
          {{
            selectedItem.productionDates && selectedItem.productionDates.length > 0
              ? selectedItem.productionDates[0].fromYear
              : 'Unknown'
          }}
        </p>
        <p>Description: {{ selectedItem.name || 'No description' }}</p>
        <p>Summary: {{ selectedItem.summary || 'No summary' }}</p>
        <p>
          Country:
          {{
            selectedItem.countries && selectedItem.countries.length > 0
              ? selectedItem.countries[0]
              : 'Unknown'
          }}
        </p>
        <p>
          Genre:
          {{
            selectedItem.parentTitle &&
            selectedItem.parentTitle.genres &&
            selectedItem.parentTitle.genres.length > 0
              ? selectedItem.parentTitle.genres[0]
              : 'Unknown'
          }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      randomCard: null, // Store the selected random card
      originalItems: [], // Store all items fetched for random selection
      currentPage: 1, // Current page for pagination
      totalResults: 0, // Total results available
      errorMessage: '', // To store any error messages
      query: 'https://api.collection.nfsa.gov.au/search?limit=25&forms=Lobby%20card&hasMedia=yes', // Base API query
      tempData: {}, // Temporary data for fetched results
      tempResultSet: [], // Temporary array to hold results
      popupVisible: false, // Control visibility of popup
      selectedItem: {} // To store the details of the clicked item
    }
  },
  methods: {
    fetchRandomCard() {
      this.originalItems = [] // Clear previous items
      this.currentPage = 1 // Reset to the first page
      this.fetchData() // Start fetching data
    },
    fetchData() {
      const queryString = `${this.query}&page=${this.currentPage}`
      fetch(queryString)
        .then((response) => {
          if (!response.ok) throw new Error(`Response status: ${response.status}`)
          return response.json()
        })
        .then((res) => {
          this.tempData = { ...this.tempData, ...res }
          this.tempResultSet = this.tempResultSet.concat(res.results)
          this.totalResults = res.meta.count.total // Update total results

          if (this.totalResults > 0) {
            if (this.currentPage * 25 < 500 && this.currentPage * 25 < this.totalResults) {
              this.currentPage++ // Increment the current page
              this.fetchData() // Fetch next page
            } else {
              this.originalItems = this.tempResultSet.map((item) => {
                const imgurl = item.preview?.find((preview) => preview.filePath)?.filePath
                return {
                  title: item.title,
                  name: item.name,
                  imgurl: imgurl ? `https://media.nfsacollection.net/${imgurl}` : '',
                  countries: item.countries || 'Unknown',
                  productionDates: item.productionDates || 'Unknown',
                  summary: item.summary || 'No Summary',
                  parentTitle: item.parentTitle || 'Unknown'
                }
              })

              // Select a random card from the fetched items
              this.randomCard = this.getRandomCard()
              this.errorMessage = '' // Clear any previous error message
              // Reset temporary variables
              this.tempData = {}
              this.tempResultSet = []
              this.currentPage = 1 // Reset current page after fetching all data
            }
          } else {
            console.log('no results')
            this.errorMessage = 'No results found.' // Set error message
          }
        })
        .catch((err) => {
          console.error(err)
          this.errorMessage = 'Failed to fetch lobby cards. Please try again.' // Set error message
        })
    },
    getRandomCard() {
      if (this.originalItems.length === 0) return null
      const randomIndex = Math.floor(Math.random() * this.originalItems.length)
      return this.originalItems[randomIndex]
    },
    openPopup(item) {
      this.selectedItem = item // Store the selected item details
      this.popupVisible = true // Show the popup
    },
    closePopup() {
      this.popupVisible = false // Hide the popup
      this.selectedItem = {} // Clear the selected item
    }
  }
}
</script>

<style scoped>
.lobby-card-random {
  align-items: center;
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
.card-container h3 {
  font-weight: 800;
}
.card-container {
  height: 600px;
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
  background-color: #409a43; /* Green */
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
.greenbutton:hover {
  background-color: #265a29;
}
.error {
  color: red;
  margin-top: 10px;
}

/* Popup styles */
.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: left;
  align-items: center;
  z-index: 1000;
}

.popup-content {
  font-size: 0.9em;
  top: 2em;
  color: #777d87;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  position: relative;
}

.popup-content h3 {
  color: #1f2937;
  font-weight: 900;
}

.close-button {
  color: #1f2937;
  position: absolute;
  top: -10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 40px;
  cursor: pointer;
}

.close-button:hover {
  color: red;
  transition-duration: 0.5s;
}

.imgPopup {
  object-fit: cover;
}

.imgPopup img {
  border-radius: 0%;
  width: 100%;
  padding-top: 1em;
  padding-bottom: 1em;
}
</style>
