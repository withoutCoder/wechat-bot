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
        console.log('🙈🙈🙈 / send request...')
        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: prompt,
            max_tokens: 1000,
            temperature: 0.9,
            frequency_penalty: 0.0,
            presence_penalty: 0.6,
            stop: ['Human:', 'AI:'],
        })
        console.log('🙉🙉🙉 / get response...')
        const reply = markdownToText(response.data.choices[0].text)
        console.log('🚀🚀🚀 / reply:', reply)
        return reply
    } catch (e) {
        console.error('🤡🤡🤡 / error')
        return '🤡🤡🤡'
    }

}

function markdownToText(markdown) {
    return remark()
        .use(stripMarkdown)
        .processSync(markdown ?? '')
        .toString()
}
