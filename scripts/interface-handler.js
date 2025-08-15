document.addEventListener('DOMContentLoaded', function() {
    const myButton = document.getElementById('startmunuButton');
    const myElement = document.getElementById('startmunu');
    
    if (myButton && myElement) {
        myButton.addEventListener('click', function() {
            myElement.classList.toggle('show');
        });
    } else {
        console.error("错误!元素未找到");
    }
});
