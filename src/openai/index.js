import {remark} from 'remark'
import stripMarkdown from 'strip-markdown'
import {Configuration, OpenAIApi} from 'openai'
import dotenv from 'dotenv'

const env = dotenv.config().parsed // 环境参数

const configuration = new Configuration({
    apiKey: env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

export async function getOpenAiReply(prompt) {
    console.log('🚀🚀🚀 / prompt', prompt)
    try {
        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: prompt,
            temperature: 0.9, // 每次返回的答案的相似度0-1（0：每次都一样，1：每次都不一样）
            max_tokens: 4000,
            top_p: 1,
            frequency_penalty: 0.0,
            presence_penalty: 0.6,
            stop: [' Human:', ' AI:'],
        })
        console.log('🙉🙉🙉 / send request...')
        const reply = markdownToText(response.data.choices[0].text)
        console.log('🚀🚀🚀 / reply:', reply)
        return reply
    } catch (e) {
        console.error('🤡🤡🤡 / reply:', '机器人消息处理繁忙')
        return "机器人消息处理繁忙"
    }

}

function markdownToText(markdown) {
    return remark()
        .use(stripMarkdown)
        .processSync(markdown ?? '')
        .toString()
}
