
async function test() {
    let my_op = asyncOperation(5)
    let result = await my_op
    let result2 = await my_op
    console.log(result, result2)
}

test()






async function asyncOperation (nb) {
    console.log('do async op')
    return nb + 5
}