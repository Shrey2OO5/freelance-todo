const addInput = document.querySelector("#add")
const btn = document.querySelector("#btn")

addInput.addEventListener("input", () => {
    btn.disabled = addInput.value.trim() === ""
})

btn.addEventListener("click", () => {
    console.log(`Added ${addInput.value}`)
    addInput.value = ""
    btn.disabled = true
})