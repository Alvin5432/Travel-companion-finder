Array.from(document.getElementsByTagName('input')).forEach((e , i)=>{
    e.addEventListener('keyup', (e1)=>{
        if (e.value.length > 0) {
            document.getElementsByClassName('bi-caret-down-fill')[i].style.transform = "rotate(360deg)";  
        } else {
            document.getElementsByClassName('bi-caret-down-fill')[i].style.transform = "rotate(0deg)";  
        }
    })
})