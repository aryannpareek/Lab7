// script.js

import { router } from './router.js'; // Router imported so you can use it to manipulate your SPA app here
const setState = router.setState;

// Make sure you register your service worker here too
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('./sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  fetch('https://cse110lab6.herokuapp.com/entries')
    .then(response => response.json())
    .then(entries => {
      entries.forEach(entry => {
        let newPost = document.createElement('journal-entry');
        newPost.entry = entry;
        document.querySelector('main').appendChild(newPost);
        newPost.addEventListener('click', () => {
          let entryNumber = 0;
          let entryArr = document.querySelectorAll('journal-entry');
      
          for(let i = 0; i < entryArr.length; i++)
          {
            if(entry.content == entryArr[i].entry.content 
               && entry.date == entryArr[i].entry.date 
               && entry.title == entryArr[i].entry.title )
            {
                entryNumber = i + 1;
            }
          }
          window.history.pushState({page_id: 1, entry_id: entry}, "entry", "#entry" + entryNumber); 
          setState(entry); 
        });
      });
    });

    document.querySelector('img').addEventListener('click', ()=> {
      if (window.location.hash != "#settings"){ 
        window.history.pushState({page_id: 2}, "setting", "#settings"); 
        setState(); 
      }
    });

    document.querySelector('h1').addEventListener('click', ()=> { 
      if (window.location.hash != "")
      { 
        window.history.pushState({page_id: 0}, "home", window.origin + "/Lab7/");
        setState(); 
      }
    });

    window.addEventListener('popstate', (event)=> {
      if (event.state == null)
      { 
        setState(); 
        return;
      }
      if (event.state.page_id == 1)
      {
        setState(event.state.entry_id);
      }
      else
      {
        setState(); 
      }
    });
});