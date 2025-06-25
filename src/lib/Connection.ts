export default class ServerConnection{
    #connection: WebSocket
    #activeRequests: Record<string, (value: [any, string | null] | PromiseLike<[any, string | null]>) => void>

    constructor(connection: WebSocket){
        this.#connection = connection
        this.#activeRequests = {}

        this.#connection.addEventListener("message", (data) => {this.handleMessage(data)});
    }

    private handleMessage({data}: any){
        const res = JSON.parse(data)
        if(res["Id"]){
            const func = this.#activeRequests[res["Id"]]
            if(func == undefined){
                console.warn("Received a ws request without a vaild active request")
                return
            }

            const {Status, Result} = res

            if(Status == "Successful")
                return func([Result, null])
            
            return func([null, Result])
        }

        console.log(res)
    }


    request(method: String, data: any){
        const id = (new Date).toISOString()

        this.#connection.send(JSON.stringify({
            id: id,
            method: method,
            data: data
        }))

        return new Promise<[any | undefined, string | null]>((resolve) => {
            this.#activeRequests[id] = resolve
        })
    }

    static open(uri: string){
        return new Promise<ServerConnection | undefined>((resolve, reject) => {
            try {
                const socket = new WebSocket(uri)

                socket.addEventListener("error", (e) => {
                    reject("Unable to connect to room")
                })

                socket.addEventListener("open", () => {
                    resolve(new ServerConnection(socket))
                })
            } catch (error) {
                reject(error)
            }
        })
    }
}