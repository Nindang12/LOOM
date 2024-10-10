import { Server as SocketIOServer } from 'socket.io'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Server as HTTPServer } from 'http'
import type { Socket as NetSocket } from 'net'

interface SocketServer extends HTTPServer {
  io?: SocketIOServer | undefined
}

interface SocketWithIO extends NetSocket {
  server: SocketServer
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO
}

const SocketHandler = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new SocketIOServer(res.socket.server as any)
    res.socket.server.io = io

    io.on('connection', socket => {
      console.log('New client connected')

      socket.on('join-room', (roomId: string) => {
        console.log(`Client joined room: ${roomId}`)
        socket.join(roomId)
      })

      socket.on('send-signal', (payload: any) => {
        console.log(`Sending signal to: ${payload.to}`)
        io.to(payload.to).emit('receive-signal', payload)
      })

      socket.on('disconnect', () => {
        console.log('Client disconnected')
      })
    })
  }
  res.end()
}

export const config = {
  api: {
    bodyParser: false,
  },
}

export default SocketHandler