
import { CHAT_FIELD_ID } from "./constants";
import { fetchCardByPhone } from "./fetchCardByPhone";
import createDebug from 'debug';
const debug = createDebug('bot:about_command');
const SUCCESS_TEXT = `✅ Вы успешно подписались на отслеживание заказа!
С этого момента вы будете получать автоматические уведомления о каждом изменении статуса вашего заказа выпускных лент, от подтверждения до доставки. Мы уведомим вас о:

* Переходе заказа на следующий этап производства.
* Ожидаемых сроках выполнения на каждом этапе.

🔍 Что дальше?
Мы приложим все усилия, чтобы ваш заказ был выполнен качественно и в срок. Если у вас возникнут вопросы по заказу или вы захотите получить дополнительную информацию, пожалуйста, не стесняйтесь обращаться к менеджеру . А так здесь вы узнаете  о готовности вашего заказа 😉👌 Мы всегда рады помочь!
Ожидайте и мы уведомим вас о изменениях🙂
`
export const setCardChatId = async (phone: string, chatId: string): Promise<string> => {

    const card = await fetchCardByPhone(phone)

    if (!card) return 'Не найдено, попробуйте поменять формат!'

    const url = `${process.env.TRELLO_API_URL}/cards/${card.id}/customField/${CHAT_FIELD_ID}/item?key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_API_TOKEN}`
    const body = { "value": { "text": chatId } }

    try {

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })

        debug(await response.text())
        return SUCCESS_TEXT

    } catch (e) {

        debug(e)
        return 'Не удалось подписаться, попробуйте позднее...'
    }



}
