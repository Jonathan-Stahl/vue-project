<template>
  <div>
    <h1>{{ msg }}</h1>

    <div class="search-bar-container">
      <!-- Search Input Field -->
      <input v-model="searchString" placeholder="Search..." class="search-input" />

      <!-- Search Button -->
      <button class="search-button" @click="fetchData">Search</button>
    </div>

    <!-- Sorting Buttons -->
    <div class="sorting-buttons">
      <button class="color-button red" @click="sortByColor('red')">Red</button>
      <button class="color-button green" @click="sortByColor('green')">Green</button>
      <button class="color-button blue" @click="sortByColor('blue')">Blue</button>
      <button class="color-button yellow" @click="sortByColor('yellow')">Yellow</button>
      <button class="color-button purple" @click="sortByColor('purple')">Purple</button>
      <button class="color-button orange" @click="sortByColor('orange')">Orange</button>
      <button class="color-button all" @click="sortByColor('all')">Show All</button>
    </div>

    <!-- Displaying Total Results -->
    <p>Total: {{ total }}</p>

    <!-- Gallery for Results -->
    <div id="gallery">
      <div v-for="item in items" :key="item.id" class="card-container" :class="item.color">
        <h3>{{ item.title || 'No Title' }}</h3>
        <p>{{ item.name || 'No Name' }}</p>
        <div class="imgContainer">
          <img :src="item.imgurl" alt="Image not available" />
        </div>
      </div>
    </div>

    <!-- No results message -->
    <p v-if="total === 0">Sorry, there are no results under this search query.</p>
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
      searchString: '', // Bound to search input
      total: 0, // Total search results
      items: [], // Gallery items after search
      query: 'https://api.collection.nfsa.gov.au/search?limit=25&forms=Lobby%20card&hasMedia=yes',
      imgURL: 'https://media.nfsacollection.net/', // Base URL for images
      originalItems: [], // Original items for filtering
      currentPage: 1, // Track the current page for pagination
      tempData: {}, // Temporary data to hold results during pagination
      tempResultSet: [] // Temporary array to hold results
    }
  },

  methods: {
    fetchData() {
      let queryString = `${this.query}&query=${this.searchString}&page=${this.currentPage}`
      fetch(queryString)
        .then((response) => {
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
          return response.json()
        })
        .then((res) => {
          this.tempData = { ...this.tempData, ...res } // Merge with temporary data
          this.tempResultSet = this.tempResultSet.concat(res.results) // Concatenate results
          this.total = res.meta.count.total // Update total results

          if (this.total > 0) {
            if (this.currentPage * 25 < 500 && this.currentPage * 25 < this.total) {
              this.currentPage++ // Increment page number
              this.fetchData() // Fetch next page
            } else {
              this.items = this.tempResultSet.map((item) => {
                const imgurl = item.preview?.find((preview) => preview.filePath)?.filePath
                return {
                  id: item.id, // Ensure there's an ID for keys
                  title: item.title || 'No Title',
                  name: item.name || 'No Name',
                  imgurl: imgurl ? `${this.imgURL}${imgurl}` : '',
                  color: this.assignRandomColor() // Assign random color for sorting/filtering
                }
              })
              this.originalItems = [...this.items] // Store original items for filtering
              // Reset temp variables
              this.tempData = {}
              this.tempResultSet = []
              this.currentPage = 1 // Reset current page after fetching all data
            }
          } else {
            console.log('no results')
          }
        })
        .catch((err) => {
          console.error(err)
        })
    },

    assignRandomColor() {
      const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange']
      return colors[Math.floor(Math.random() * colors.length)]
    },

    sortByColor(color) {
      if (color === 'all') {
        this.items = [...this.originalItems] // Show all items
      } else {
        this.items = this.originalItems.filter((item) => item.color === color)
      }
    }
  }
}
</script>

<style scoped>
/* Similar styles for gallery and search list */
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

.imgContainer:hover img {
  transform: scale(1.1);
}

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
</style>
