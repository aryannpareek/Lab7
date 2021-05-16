// script.js
import { router } from './router.js'; // Router imported so you can use it to manipulate your SPA app here
const setState = router.setState;

// Make sure you register your service worker here too

document.addEventListener('DOMContentLoaded', () => {
  fetch('https://cse110lab6.herokuapp.com/entries')
    .then(response => response.json())
    .then(entries => {
      entries.forEach(entry => {
        let newPost = document.createElement('journal-entry');
        newPost.entry = entry;
        document.querySelector('main').appendChild(newPost);
        //Change to entry when clicked
        newPost.addEventListener('click', () => {
          //Find which entry number it is 
          let entryNum = router.findNum(entry); 
          //Push state of specific entry 
          window.history.pushState({page_id: 1, entry: entry}, "entry", "#entry" + entryNum); 
          setState(entry); 
        });
      });
    });

    //Change to settings
    document.querySelector('img').addEventListener('click', ()=> {
      //Don't nav to same page 
      if (window.location.hash != "#settings"){ 
        //Push to history 
        window.history.pushState({page_id: 2}, "setting", "#settings"); 
        setState(); 
      }
    });

    //Change back to main page when title is clicked 
    document.querySelector('h1').addEventListener('click', ()=> { 
      //Don't nav to itself 
      if (window.location.hash != ""){ 
        //Push home state
        window.history.pushState({page_id: 0}, "home", window.origin + "/Lab7/");
        setState(); 
      }
    });

    window.addEventListener('popstate', (event)=>{
      //If event.state == null, we're back at origin
      if (event.state == null){ 
        setState(); 
        return;
      }
      //If we have to go to individual entry, feed it entry in state object
      if (event.state.page_id == 1){
        setState(event.state.entry);
      }
      else{
        setState(); 
      }
    });
});

//Service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/Lab7/sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}
