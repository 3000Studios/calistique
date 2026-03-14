import { generateContent } from './contentGenerator.js'

export async function routeCommand(command) {

    if(command.action === 'generate_homepage'){
        return await generateContent('homepage')
    }

    if(command.action === 'generate_blog'){
        return await generateContent('blog')
    }

    return {status:'unknown command'}
}
