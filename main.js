sprite = "madoka"

function setOrChangeGif() {
    switch (sprite) {
        case "madoka":
            sprite = "homura"
            break;
        case "homura":
            sprite = "sayaka"
            break;
        case "sayaka":
            sprite = "mami"
            break;
        case "mami":
            sprite = "kyoko"
            break;
        case "kyoko":
            sprite = "moemura"
            break;
        case "moemura":
            sprite = "madoka"
            break;
    }

    document.getElementById("sprite").src = `media/${sprite}_sprite.gif`;
}