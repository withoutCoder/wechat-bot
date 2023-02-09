import {getOpenAiReply as getReply} from '../openai/index.js'
import {aliasAutoWhiteList, aliasWhiteList, keyword, roomWhiteList} from '../../config.js'

/**
 * 默认消息发送
 * @param msg
 * @param bot
 * @returns {Promise<void>}
 */
export async function defaultMessage(msg, bot) {
    const contact = msg.talker() // 发消息人
    const receiver = msg.to() // 消息接收人
    const content = msg.text() // 消息内容
    const room = msg.room() // 是否是群消息
    const roomName = (await room?.topic()) || null // 群名称
    const alias = (await contact.alias()) || (await contact.name()) // 发消息人昵称
    const remarkName = await contact.alias() // 备注名称
    const name = await contact.name() // 微信名称
    const isText = msg.type() === bot.Message.Type.Text // 消息类型是否为文本
    const isRoom = roomWhiteList.includes(roomName) && content.includes(`${keyword}`) // 是否在群聊白名单内并且艾特了机器人
    const isKeywordAlias = aliasWhiteList.includes(remarkName) || aliasWhiteList.includes(name) // 发消息的人是否在联系人白名单内
    const isAutoAlias = aliasAutoWhiteList.includes(remarkName) || aliasAutoWhiteList.includes(name) // 发消息的人是否在联系人白名单内

    const isBotSelf = keyword === remarkName || keyword === name // 是否是机器人自己
    if (isText && !isBotSelf) {
        try {
            // 区分群聊和私聊
            if (isRoom && room) {
                if (content.includes(`${keyword}`)) {
                    let reply = await getReply(content.replace(`${keyword}`, ''))
                    reply = '回复「' + name + '」: ' + reply
                    await room.say(reply)
                }
                return
            }
            // 私人聊天，白名单内的触发关键词直接发送
            if (isKeywordAlias && !room) {
                if (content.includes(`${keyword}`)) {
                    await contact.say(await getReply(content.replace(`${keyword}`, '')))
                }
            }
            // 私人聊天，白名单内的直接发送
            if (isAutoAlias && !room) {
                await contact.say(await getReply(content))
            }
        } catch (e) {
            console.error(e)
        }
    }
}
