# My Vue Project

[Link to the working website](https://jonathan-stahl.github.io/vue-project/)

The website I made is a seamless search engine designed for the National Film Sound Archive's lobby card collection. Some of it's centric features include, an accurate search query bar to pull results, a colour sorter which sorts the images based on it's allocated colour, date filters, and a random lobby card generator. When a user hops onto this website, they are encouraged to activate the random lobby card generator, explore the NFSA lobby card collection, and aesthetically sort the lobby cards into their respective colours. The lobby cards themselves are displayed in card-like views within a gallery, showcasing the name and description of the lobby card. If a lobby card piques one's interest, they may click on a card which brings up a popup window with the image in a larger view, with extra details listed below it including the date published, country, summary, and genre. Overall this website encompasses the NFSA's collection in a structured and unique way. It encourages users to spend a few minutes of their time exploring a vast gallery, and hopefully encourage designers, like myself, in utilising the colour sorter feature to identify similarities and coherance in the lobby card collection.

# Development Process

Overall, my progress through this project has been on a roller coaster. Due to commitments outside of uni, I was unable to work on this project on extended periods of time. Also, starting off with an ambitious prototype to introduce a colour sorter in my website was something I didn't think too much of. I firstly progressed through the learning modules so that I can get a better understanding of how APIs and Vue work, and practised API things in random mockup websites. It did take awhile learning the basics, but once I started, I was pretty much on a roll.

When introducing the API into my website, I managed to bring up the title, name, and images of a lobby card and display the results in a flex grid on my website after a button was clicked. I then attempted to introduce a colour sorter, which did not go so well. After having some proxy issues, I was unable to install ColorThief which I believe would have been a great asset in my website. After multiple attempts, I had to resort to a 'mockup' version of a colour sorter. So, with the help of AI, introduced a random colour assignment to each card, which were able to be sorted by the colour buttons. Although, much less cool, it still had the vision of what I had intended.

After this, I found my website to be quite boring, so I introduced a new component; a random card generator. With the help of AI, I was able to create this easily, then copied in the CSS values as the other cards to maintain consistency. All this was working up to this point and I was quite happy with it, until I realised I had completely forgotten about pagination, so my website was showcasing a grand total of... 25 cards!. I managed to work out the pagination and took a few attempts with AI particularly helping the pagination for the random card generator so that it could access the 833 images, but overtime with understanding and prompting, we brought out solutions.

Lastly, I was still feeling my website was still a little boring. So I attempted to introduce a date filter into my website. Now, I understood that 833 was not very much results once queries come into play, so having 2 date filters would be most beneficial. This was one of the most time consuming and difficult parts of my website, as I didn't understand how to implement colour filters AND date filters at the same time with the same results. After multiple attemps with AI and lots of debugging and different prompting, I wasn't able to find a solution. So, I resorted to having the date filter working perfectly, and the colour filter being limited to the first 25 in the lobby card API collection.

# Evaluation

Overall, I think I have made a solid effort at this project. I believe I spent about near 35-40 hours on this assessment alone, mostly in the last 1-2 weeks of completion. There have been a lot of stressful fixing and debugging issues and I'm really thankful I got the most irritating ones out of the way with Riley that both me AND AI would not be able to solve. Even though it's a lot different than my prototypes, I'm quite content with the way it's turned out, that it's responsive... and working.. and somewhat interesting... where someone could spend a couple minutes on it if they really wanted to!

# References

- ColorThief. (2024). colorthief https://www.npmjs.com/package/colorthief

  - an attempt and a wishful desire to have this happen on my website but unfortunately unable due to proxy issues

- National Film and Sound Archive of Australia. (2024). The collection. https://www.nfsa.gov.au/collection

  - the foundation of my website's collection

- OpenAI. (2024, October 21). Response from ChatGPT [Large language model]. Personal communication.

  - often used as a debugger, time saver and tutor for my coding journey

- W3Schools. (2024). W3Schools online web tutorials. W3Schools. https://www.w3schools.com/

  - used to revisit random css values

- StackOverflow. (2017). Could not find a declaration file for module 'module-name'. '/path/to/module-name.js' implicitly has an 'any' type. https://stackoverflow.com/questions/41292559/could-not-find-a-declaration-file-for-module-module-name-path-to-module-nam
  - stack overflow has good debugging for overall issues, one simple line of code from a random user could fix my entire website!
