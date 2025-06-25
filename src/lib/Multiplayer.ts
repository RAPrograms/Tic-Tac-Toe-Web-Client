export const httpProtocol = (import.meta.env.PROD)? "https":"http"

export function serverConnectPromise(ipAddress: string){
    return new Promise<ServerConfig | null>(async (resolve, reject) => {
        try {
            const res = await fetch(`${httpProtocol}://${ipAddress}/config`)

            setTimeout(async () => {
                if(!res.ok)
                    return reject("Unable to connect to server")

                
                resolve(await res.json())
            }, 600)
        } catch (error) {
            return resolve(null)
        }
    })
}