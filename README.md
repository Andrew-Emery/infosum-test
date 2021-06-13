My approach to this project was as follows;

1. First of all I read the spec, but couldn't entirely understand the problem immediately.
2. I looked at the provided data in api.ts and api-definition.d.ts to try to get a better understanding of the problem. These notes looked like this...

```Make API call -> [Dataset, Dataset, Dataset]

Dataset -> id, name, created date, updated date, stats (keys & row_count)

keys -> [] -> id, label, null_fraction, distinct


null_fraction -> * row_count = number of null rows
distinct -> if positive, is the number of distinct rows, else *-1*row_count = number of distinct rows
duplicate -> row_count - (num of null rows + num of distinct rows)



Seperate data sets out, could be a list (maybe with search?), could be different pages, could be different tabs - not sure the expectations here
display the label for dataset, could also show last dates or something if wanted here and possibly row count

Somehow display a list of all of the keys within the dataset, alongside their respective values and possibly a graph (this sounds difficult, but visualisation is specified).

Part 2 (Gonna do it tho)
Dataset -> Data -> Categories

Category -> id, name, best_reprentation (Column)

Column -> statistics, reprentation_id, representation_name

Doesn't give much information on what's wanted here, will think about it after part 1
```

3. I drew a rough design at this stage for how to navigate the datasets
![Initial design](/readmeextra/initialdesign.png "First design")

4. I spent a fair amount of time changing colours (before deciding it was prettier to use infosums) and moving things around, though after a while I became quite happy with the style.
Things I'm still not sure about would be the search button that does nothing, I like it because it makes it obvious that it's a search bar, but the button itself is quite unnecessary. Also thought I'd use this button alot more so made it a common component. The original idea was to have the design taking the full width of the screen, but I quickly realised it would be nicer to have a fixed size in the middle of the screen.

5. Found a website called icomoon, adding icons seems to add a lot to my design.

6. Added a transition on hover to show when a dataset is hovered, spent a long time trying this with keyframes but eventually discovered css transitions which allowed me to make the effect reversable.

7. Went back to add a loading 'spinner' using the infosum logo, to show that the website may not immediately have data.

8. I then added another page, this is new to me so I'm not sure if I've done it correctly but using the documentation for react-router-dom helped to implement extra pages based on the URL
Originally I wasn't sure how to pass the id of the dataset to the component depending on which was clicked without using state, but found that I can put variables in a path and get them back out in the component.
(https://reactrouter.com/web/guides/quick-start)

9. Started out by creating a pseudo-tree / link on this page to get back to the main page.

10. Wasn't sure how to design this originally as I still didn't really know what I wanted, just that I wanted a grid and a graph, so started out designing a grid using css flex for rows.

11. Flex was making the rows quite weirdly spaced for longer bits of text so I swapped to using grid, but as my rows were in components I couldn't work out how to space them properly.
Eventually discovered <></> which acts as if nothing is there, which fixed this issue.

12. I started researching graphs at this point, I found high-charts which looked very easy to drop in and had premade settings I could copy on their website. I then created a component after the grid for displaying this with some extra useful little pills for information and added an initial bar graph which seemed to represent the data well.

13. Because the data seemed like it would fit a percentage structure, I wanted to add a pie chart and so I needed to overcome a similar issue to which I had solved earlier (and also wanted to try query strings) so I added selecting a table row using a router, which would select that key and show a pie chart instead of that graph.

14. I didn't understand the second requirement very well at this point, but did consider section 1 as completed. I wanted to show a breakdown of the data for each common occurance, but also show the overall stats. At this point I realised I probably should have considered the design for option 2 before starting option 1.
I attempted to add a second container to the right hand side of the keys container using flex, but I didn't like how the infosum logo didn't always align with them when the window was the wrong size. I spent probably a bit too long trying to make this work, but eventually decided to backtrack and add the second container below the first with some form of collapsible section around them.

15. I created the collapsible section, and put the keys section and graph inside of it. I redesigned the key and graph containers to fit better inside the collapsible parent at this point (mostly just removing borders and radius, as well as spacing between them.)

16. Then I copy and pasted the work I had done for the keys section, and made minor adjustments to fit the data from the categories instead. This was surprisingly quick.

17. I wanted to show the more in depth data still around common occurances, but wasn't entirely sure what to do and was running out of time as well, I quickly found that highcharts has capabilities for drilling down into deeper data and thought that could be an intermediary solution. I still would have liked another table for each post code/gender etc but was unsure of how to design it. This was again quite easy to configure.


Things I wish I could do differently;
I'd like a bigger set of data.
Would have liked a better understanding of the data (particularly part 2, don't know if the data I'm displaying is actually correct)
Wish I had considered designs for part 2 before starting.
I don't like using css in lots of different files as it keeps conflicting with each other.
My images load in slightly later, but I'm not sure how to fix it
