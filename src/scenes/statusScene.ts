import { Context, Scenes } from 'telegraf';
import createDebug from 'debug';
import { fetchStatus } from '../services/fetchStatus';
import { Message } from 'telegraf/typings/core/types/typegram';
const debug = createDebug('bot:about_command');


const { leave } = Scenes.Stage;
const checkStatus = () => async (ctx: Scenes.SceneContext) => {
  const message = ctx.message as Message.TextMessage
  debug(`Triggered "checkStatus" command`);
  const result = await fetchStatus(message.text)
  await ctx.reply(result)

  ctx.scene.enter('menuScene')


}

const statusScene = new Scenes.BaseScene<Scenes.SceneContext>("statusScene");

const message = `
📱 Введите ваш номер телефона:
Пожалуйста, укажите номер телефона, который вы предоставили при оформлении заказа у нашего менеджера, в формате:

 +7(XXX)XXX-XX-XX

Это необходимо для верификации и будет использоваться для отслеживания статуса вашего заказа через наш телеграм-бот. Напишите тот номер, который вы указали в образце списка при заказе

Еще можете Подписаться и «Отслеживать статус вашего заказа ♻ »  чтобы получать мгновенные уведомления о любых изменениях.`;
statusScene.enter(ctx => ctx.reply(message));
statusScene.command("back", leave<Scenes.SceneContext>());
statusScene.on("message", checkStatus());



export { statusScene };
