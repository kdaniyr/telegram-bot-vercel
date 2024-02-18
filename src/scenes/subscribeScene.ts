import {  Markup, Scenes } from 'telegraf';
import createDebug from 'debug';
import { Message } from 'telegraf/typings/core/types/typegram';
import { setCardChatId } from '../services/setCardChatId';
import { fetchStatus } from '../services/fetchStatus';
import { CHECK_STATUS, SUBSCRIBE } from '../services/constants';
const debug = createDebug('bot:about_command');

const { leave } = Scenes.Stage;
const count = 0
const subscribePhone = () => async (ctx: Scenes.SceneContext) => {

  const message = ctx.message as Message.TextMessage
  const result = await setCardChatId(message.text, message.chat.id.toString())

  // const status = await fetchStatus(message.text)
  // const resultWithStatus = result + '\n' + status

  await ctx.reply(result,
    Markup.keyboard([CHECK_STATUS, SUBSCRIBE]).oneTime().resize())

  // ctx.scene.enter('menuScene')
  ctx.scene.leave()
}

const subscribeScene = new Scenes.BaseScene<Scenes.SceneContext>("subscribeScene");

const message = `
♻ Отслеживать статус заказа
Чтобы проверить текущий статус вашего заказа выпускных лент, введите, пожалуйста, номер телефона , который был предоставлен вам нашим менеджером при подтверждении заказа или при заполнении «Образец Списка». 

Мы понимаем, насколько важно быть в курсе всех этапов производства вашего заказа, и стараемся предоставить вам всю необходимую информацию для вашего удобства и спокойствия.

📝 Пожалуйста, введите номер вашего заказа ниже, в формате:

 +7(XXX)XXX-XX-XX

чтобы мы могли предоставить вам актуальный статус и уведомим каждый раз когда измениться статус вашего заказа 😊

`;
subscribeScene.enter(ctx => ctx.reply(message));
subscribeScene.command("back", leave<Scenes.SceneContext>());
subscribeScene.on("message", subscribePhone());



export { subscribeScene };
