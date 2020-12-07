const fs = require("fs")

console.log("==== DAY 7 ====")

let bags
// PART ONE
// ============================================================================================
let start = Date.now();
fs.readFile("./files/input7", 'utf8', (err, data) => {
        if (err) throw err

        bags = convertData(data)

        let shinyHoldingBags = findContent("shiny", "gold")

        let allShinyHoldingBags = [...shinyHoldingBags]
        let oldSize = -1
        let newSize = -2
        do {
            oldSize = allShinyHoldingBags.length

            let moreShinyHoldingBags = [] //find the next layer of bags,
            allShinyHoldingBags.forEach(bag => {
                let moreBags = findContent(bag.container.mutation, bag.container.color)
                moreShinyHoldingBags = [...moreShinyHoldingBags, ...moreBags]
            })

            //remove duplicates (there shouldn't be any dupes if I was any good from the first place)
            allShinyHoldingBags = Array.from(new Set([...allShinyHoldingBags, ...moreShinyHoldingBags]))

            newSize = allShinyHoldingBags.length

            //if no more new bags are found, head out
        } while (oldSize != newSize)

        console.log(allShinyHoldingBags.length)

        console.log(`This took ${Date.now() - start}ms`)

        partTwo()

    })

function partTwo() {
    start = Date.now();
    let shinyBag = {mutation:"shiny", color:"gold"}

    console.log(shinyBag)
    let result = recursiveBagFinding(shinyBag)

    console.log(result)

    console.log(`This took ${Date.now() - start}ms`)

}


function recursiveBagFinding(bag) {
    bag = findBag(bag.mutation, bag.color)

    if (!bag) return 0

    let contentCount = 0;

    //for for every bag in this bag, get the countCount
    for (let i = 0; i < bag.content.length; i++) {
        let content = bag.content[i]

        //add the count of this bag's content to the big counter (plus 1 for itself)
        contentCount += content.quantity * (1 + recursiveBagFinding(content))
    }

    return contentCount

}


function findBag(mutation, color) {
    return bags.find(bag => bag.container.mutation === mutation && bag.container.color === color)
}


function findContent(mutation, color) {
    return bags.filter(bag => {
        let canHold = false
        bag.content.forEach(c => {
            if (c.mutation === mutation && c.color === color)
                canHold = true
        })
        return canHold
    })
}


function convertData(data) {
    let entries = data.split("\n")

    return entries.filter(e => e !== "")
        .map(e => {
            let [container, content] = e.replace(/bags|\./g, "").split("contain")
            let [mutation, color] = container.trim().split(" ")

            container = {mutation,color}

            content = content.split(",")
                .map(c => {
                    let [quantity, mutation, color] = c.trim().split(" ")
                    if (quantity !== "no") {
                        return {
                            quantity: parseInt(quantity),
                            mutation,
                            color
                        }
                    }
                    else
                        null

                }).filter(c => c !== undefined)

            return {
                container: container,
                content
            }
        })
}