import { Markup, Scenes } from 'telegraf';
import createDebug from 'debug';
import { Message } from 'telegraf/typings/core/types/typegram';
import { setCardChatId } from '../services/setCardChatId';
import { BACK, CHECK_STATUS, GREETING, SUBSCRIBE } from '../services/constants';
const debug = createDebug('bot:about_command');

const { leave } = Scenes.Stage;
const subscribePhone = () => async (ctx: Scenes.SceneContext) => {

  const message = ctx.message as Message.TextMessage

  if ([CHECK_STATUS, SUBSCRIBE, BACK].includes(message.text)) return

  const result = await setCardChatId(message.text, message.chat.id.toString())

  await ctx.reply(result,
    Markup.keyboard([CHECK_STATUS, SUBSCRIBE]).oneTime().resize())

  if (!result.error) {
    ctx.scene.leave()
  }
}

const subscribeScene = new Scenes.BaseScene<Scenes.SceneContext>("subscribeScene");

const message = `
📱 Введите ваш номер телефона:
Пожалуйста, укажите номер телефона, который вы предоставили при оформлении заказа у нашего менеджера✅

✅Мобильный телефон.
При записи номера мобильного телефона следует:
– Указывать префикс. Для РК это «+7».
– Не писать все цифры слитно.
– Код оператора отбивать пробелами,  используя скобки.
– Использовать дефисы между тремя последними группами.
Пример написания:
◘ +7(777)777-77-77

Это необходимо для верификации и будет использоваться для отслеживания статуса вашего заказа через наш телеграм-бот. Напишите тот номер, который вы указали в образце списка при заказе

Еще можете Подписаться и «Отслеживать статус вашего заказа ♻ »  чтобы получать мгновенные уведомления о любых изменениях.
`;
subscribeScene.enter(ctx => ctx.reply(message, Markup.keyboard([CHECK_STATUS, SUBSCRIBE, BACK]).oneTime().resize()));
subscribeScene.command("start", ctx => {
  ctx.scene.leave();
  ctx.reply(GREETING, Markup.keyboard([CHECK_STATUS, SUBSCRIBE]).oneTime().resize());
});
subscribeScene.command(BACK, ctx => ctx.scene.leave());
subscribeScene.hears(CHECK_STATUS, ctx => ctx.scene.enter('statusScene'));
subscribeScene.hears(SUBSCRIBE, ctx => ctx.scene.enter('subscribeScene'));
subscribeScene.on("message", subscribePhone());



export { subscribeScene };
