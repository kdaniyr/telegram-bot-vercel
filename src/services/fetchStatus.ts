
const idBoards = '658c1664242f1f47da07c91e'
export const fetchStatus = async (phone: string): Promise<string> => {

    let query = phone
        .replaceAll(' ', '')
        .replaceAll('(', '')
        .replaceAll(')', '')
        .replaceAll('-', '')

    const url = `${process.env.TRELLO_API_URL}/search?idBoards=${idBoards}&modelTypes=cards&key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_API_TOKEN}&query=name:${query}`
    const response = await fetch(url, {
        method: 'GET'
    })
    const result = await response.json()

    const cards = result.cards

    if (!cards || !cards.length) return 'Не найдено, попробуйте еще раз!'

    const card = cards[0]



    return await fetchListName(card.idList)
}

const fetchListName = async (listId: string): Promise<string> => {

    const url = `${process.env.TRELLO_API_URL}/list/${listId}?key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_API_TOKEN}`
    const response = await fetch(url, {
        method: 'GET'
    })
    const result = await response.json()
    return result.name
}