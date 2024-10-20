<template>
  <div>
    <h1>{{ msg }}</h1>

    <div class="search-bar-container">
      <input v-model="searchString" placeholder="Search..." class="search-input" />
      <button class="search-button" @click="resetAndFetchData">Search</button>
    </div>

    <div class="search-buttons">
      <button @click="setDateFilter('1910-1950')">1910-1950</button>
      <button @click="setDateFilter('1951-1990')">1951-1990</button>
      <button @click="setDateFilter('all')">All</button>
    </div>

    <div class="sorting-buttons">
      <button class="color-button red" @click="sortByColor('red')">Red</button>
      <button class="color-button green" @click="sortByColor('green')">Green</button>
      <button class="color-button blue" @click="sortByColor('blue')">Blue</button>
      <button class="color-button yellow" @click="sortByColor('yellow')">Yellow</button>
      <button class="color-button purple" @click="sortByColor('purple')">Purple</button>
      <button class="color-button orange" @click="sortByColor('orange')">Orange</button>
      <button class="color-button all" @click="sortByColor('all')">Show All</button>
    </div>

    <p>Total: {{ total }}</p>

    <p v-if="searchString && items.length === 0">
      No results under this search: "{{ searchString }}"
    </p>

    <div id="gallery">
      <div
        v-for="(item, index) in items"
        :key="`${item.id}-${index}`"
        class="card-container"
        :class="item.color"
        @click="openPopup(item)"
      >
        <h3>{{ item.title || 'No Title' }}</h3>
        <p>{{ item.name || 'No Name' }}</p>
        <div class="imgContainer">
          <img :src="item.imgurl" alt="Image not available" />
        </div>
      </div>
    </div>

    <p v-if="total === 0 && searchString.length === 0">
      Sorry, there are no results under this search query.
    </p>

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
  props: {
    msg: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      searchString: '',
      total: 0,
      items: [],
      query: 'https://api.collection.nfsa.gov.au/search?limit=25&forms=Lobby%20card&hasMedia=yes',
      imgURL: 'https://media.nfsacollection.net/',
      currentPage: 1,
      originalItems: [],
      isLoading: false,
      dateFilter: '',
      colorFilter: '',
      popupVisible: false,
      selectedItem: {} // To store the details of the clicked item
    }
  },
  methods: {
    fetchData() {
      this.isLoading = true

      let url = `${this.query}&query=${this.searchString}&page=${this.currentPage}`

      if (this.dateFilter && this.dateFilter !== 'all') {
        url += `&year=${this.dateFilter}`
      }

      fetch(url)
        .then((response) => {
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
          return response.json()
        })
        .then((res) => {
          this.total = res.meta.count.total // Set total based on response

          const newItems = res.results.map((item) => {
            const imgurl = item.preview?.find((preview) => preview.filePath)?.filePath
            return {
              id: item.id,
              title: item.title || 'No Title',
              name: item.name || 'No Name',
              imgurl: imgurl ? `${this.imgURL}${imgurl}` : '',
              countries: item.countries || 'Unknown', // Example property
              productionDates: item.productionDates || 'Unknown', // Example property
              summary: item.summary || 'No Summary',
              description: item.description || 'No Description', // Example property
              authors: item.authors || 'Unknown', // Example property
              parentTitle: item.parentTitle || 'Unknown',
              color: this.assignRandomColor()
            }
          })

          // Adjust total if no new items are found
          if (newItems.length === 0) {
            this.total = 0
          } else {
            const existingIds = new Set(this.items.map((item) => item.id))
            const uniqueNewItems = newItems.filter((item) => !existingIds.has(item.id))

            this.items.push(...uniqueNewItems)
            this.originalItems.push(...uniqueNewItems)
            this.currentPage++
          }

          this.isLoading = false
        })
        .catch((err) => {
          console.error(err)
          this.isLoading = false
        })
    },
    loadMore() {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollY = window.scrollY

      if (
        scrollY + windowHeight >= documentHeight - 100 &&
        !this.isLoading &&
        this.currentPage * 25 < this.total
      ) {
        this.fetchData()
      }
    },
    assignRandomColor() {
      const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange']
      return colors[Math.floor(Math.random() * colors.length)]
    },
    sortByColor(color) {
      this.colorFilter = color
      this.currentPage = 1
      if (color === 'all') {
        this.items = [...this.originalItems]
      } else {
        this.items = this.originalItems.filter((item) => item.color === color)
      }
    },
    setDateFilter(year) {
      this.dateFilter = year
      this.currentPage = 1
      this.items = []
      this.fetchData()
    },
    resetAndFetchData() {
      this.currentPage = 1
      this.items = []
      this.fetchData()
    },
    openPopup(item) {
      this.selectedItem = item // Store the selected item details
      this.popupVisible = true // Show the popup
    },
    closePopup() {
      this.popupVisible = false // Hide the popup
      this.selectedItem = {} // Clear the selected item
    }
  },
  mounted() {
    this.fetchData()
    window.addEventListener('scroll', this.loadMore)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.loadMore)
  }
}
</script>

<style scoped>
/* Add your existing styles here */

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

.imgPopup {
  object-fit: cover;
}

.imgPopup img {
  border-radius: 0%;
  width: 100%;
  padding-top: 1em;
  padding-bottom: 1em;
}

.close-button:hover {
  rotate: 90deg;
  transition-duration: 0.5s;
}

body {
  font-family: 'Arial', sans-serif;
  background-color: #f3f4f6;
  color: #333;
  text-align: center;
  margin: 0;
  padding: 0;
}

.search-bar-container {
  display: flex;
  justify-content: left;
  align-items: center;
  margin: 10px;
  width: 100%;
}

.search-input {
  width: 300px; /* Increase width for a more balanced look */
  padding: 12px 18px;
  border: 2px solid #ccc;
  border-radius: 50px; /* Full rounded edges */
  font-size: 16px; /* Text size */
  outline: none; /* Remove default outline */
  transition: all 0.3s ease; /* Smooth hover effect */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Add subtle shadow */
}

.search-button {
  background-color: #505967;
  color: white;
  border: none;
  border-radius: 50px; /* Same full rounded corners */
  padding: 12px 25px;
  margin-left: 10px;
  cursor: pointer;
  font-size: 16px;
  transition:
    background-color 0.3s ease,
    transform 0.3s ease; /* Hover effect */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow */
}

.search-buttons {
  height: 4em;
  display: flex;
  position: relative;
  color: #1f2937;
  gap: 10px;
}

.search-button:hover {
  background-color: #1f2937;
}

.sorting-buttons {
  position: fixed; /* Make it fixed */
  top: 50%; /* Center it vertically */
  right: -10px; /* Position it on the right side */
  transform: translateY(-50%); /* Center vertically */
  display: flex;
  flex-direction: column; /* Stack buttons vertically */
  gap: 10px; /* Space between buttons */
}

.color-button {
  font-size: 0.9em;
  width: 60px; /* Set a width for the buttons */
  padding: 10px; /* Padding for buttons */
  color: white; /* Text color for all buttons */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: transform 0.3s ease; /* Hover effect */
}

.color-button:hover {
  transform: scale(1.05); /* Slight scale on hover */
}

/* Button colors */
.red {
  background-color: rgb(183, 45, 45);
}

.green {
  background-color: rgb(67, 122, 45);
}

.blue {
  background-color: rgb(14, 117, 190);
}

.yellow {
  background-color: rgb(255, 232, 104);
  color: #1f2937;
}

.purple {
  background-color: rgb(130, 54, 157);
}

.orange {
  background-color: rgb(207, 146, 60);
  color: #1f2937;
}

.all {
  background-color: #ccc; /* Base color for 'Show All' button */
  color: #1f2937;
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
}

.card-container:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.card-container h3 {
  font-size: 1.2em;
  color: #1f2937;
  margin: 10px 0;
  font-weight: 800;
}

.card-container p {
  font-size: 0.9em;
  color: #6b7280;
  margin-bottom: 15px;
}

.imgContainer img {
  width: 100%;
  height: auto;
  transition: transform 0.4s ease;
  border-radius: 10px;
}

/* Border colors for card containers */
.red {
  border-left: 5px solid rgb(183, 45, 45);
  border-bottom: 5px solid rgb(183, 45, 45);
}
.green {
  border-left: 5px solid rgb(67, 122, 45);
  border-bottom: 5px solid rgb(67, 122, 45);
}
.blue {
  border-left: 5px solid rgb(14, 117, 190);
  border-bottom: 5px solid rgb(14, 117, 190);
}
.yellow {
  border-left: 5px solid rgb(255, 232, 104);
  border-bottom: 5px solid rgb(255, 232, 104);
}
.purple {
  border-left: 5px solid rgb(130, 54, 157);
  border-bottom: 5px solid rgb(130, 54, 157);
}
.orange {
  border-left: 5px solid rgb(207, 146, 60);
  border-bottom: 5px solid rgb(207, 146, 60);
}

h1 {
  color: #f3f4f6;
  margin-top: 15px;
}

@media (max-width: 1024px) {
  .sorting-buttons {
    position: relative; /* Make it fixed */
    display: flex;
    flex-direction: row; /* Stack buttons vertically */
    margin-top: 3em;
    flex-wrap: wrap;
  }
  .color-button {
    height: 2em;
  }
  .search-buttons {
    height: 2em;
    left: 10px;
    top: 10px;
  }
}
</style>
