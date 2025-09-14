//const fastify = require('fastify')
//const crypto = require('crypto')

import fastify from 'fastify'
import crypto from 'node:crypto'

const server = fastify({
    logger: {
        transport: {
            target: 'pino-pretty',
            options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
            },
        },
    },
})

const courses = [
    { id: '1', title: 'Curso de Node.js'},
    { id: '2', title: 'Curso de Python'},
    { id: '3', title: 'Curso de Ruby'},
]

server.get('/courses', () => {
    return {courses}
})

server.get('/courses/:id', (request, reply) => {
    type Params = {
        id: string
    }

    const params = request.params as Params
    const courseId = params.id

    const course = courses.find(course => course.id === courseId)

    if (course) {
        return {course}
    }
    // 404 => Nao encontrado
    return reply.status(404).send()
})

server.post('/courses', (request, reply) => {
    type Body = {
        title: string
    }

    const courseId = crypto.randomUUID()

    const body = request.body as Body
    const courseTitle = body.title

    if(!courseTitle){
        return reply.status(400).send({message: 'Titulo obrigatorio.'})
    }

    courses.push({ id: courseId, title: courseTitle })

    return reply.status(201).send({courseId})
})

server.delete('/courses/:id', (request, reply) => {
    type Params = {
        id: string
    }

    const params = request.params as Params
    const courseId = params.id

    const courseIndex = courses.findIndex( course => course.id === courseId)

    if (courseIndex === -1){
        return reply.status(404).send({ message: 'Curso não encontrado.' })
    }
    courses.splice(courseIndex, 1)

    return reply.status(204).send()
})

server.listen({ port: 3333}).then(() => {
    console.log('HTTP online!')
})