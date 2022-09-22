function addScript(src, onLoad, resolve){
  onLoad();
  const script = document.createElement('script');
  script.setAttribute('src', src);
  script.addEventListener('load', () => resolve());
  document.head.appendChild(script);
}

function progressLoaded(src, type, onLoad, resolve){
  if(type === 'script'){
    addScript(src, onLoad, resolve);
    return;
  }

  onLoad();
  resolve();
}

function progressLoad(src, type="script", onProgress=()=>{}, onLoad=()=>{}){
  return new Promise(( resolve, reject )=>{
    //guard: script loaded.
    if(sessionStorage.getItem(`loaded:${src}`) === 'ready'){
      progressLoaded(src, type, onLoad, resolve);
      return;
    }

    //use ajax to monitor loading progress
    const req = new XMLHttpRequest();
    req.addEventListener("progress", evt => onProgress(evt));

    req.addEventListener("load", () => {
      const blobURL = URL.createObjectURL(new Blob([req.response]));
      progressLoaded(blobURL, type, onLoad, resolve);
      sessionStorage.setItem(`loaded:${src}`, 'ready');
    });

    req.addEventListener("error", (err) => reject(err));
    req.open("GET", src);
    req.send();
  })
}