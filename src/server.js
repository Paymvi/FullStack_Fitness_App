// .js
// Fitness App - Server Functions
// by Kyle Furey

// Server - Stores all information related to a remote server.
export class Server {
    // Allows easy connectivity to the remote server.
    constructor(serverLink = 'http://localhost:8080') {
        this.serverLink = serverLink
    }

    // Sends data in a JSON string to the server and returns the result code. 
    // Will throw an error on bad input or failure.
    async sendJson(path, text) {
        const result = await fetch(`${this.serverLink}${path}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(text)
        })
        if (!result.ok) {
            throw new Error(await result.text())
        }
        return result.status !== 204 ? await result.json() : null
    }

    // Asynchronously returns an array of numbers containing date timestamps.
    // Will throw an error on failure.
    async getDates() {
        return this.sendJson('/api/getDates', {})
    }

    // Asynchronously deletes the date with the given timestamp.
    // Will throw an error on bad input or failure.
    async delDate(timestamp) {
        return this.sendJson('/api/delDate', timestamp)
    }

    // Asynchronously returns the weight lifting data from the given timestamp.
    // Returns an empty prototype if no matching timestamp was found.
    // Will throw an error on bad input or failure.
    async getWeight(timestamp) {
        return this.sendJson('/api/getWeight', timestamp)
    }

    // Asynchronously returns the running data from the given timestamp.
    // Returns an empty prototype if no matching timestamp was found.
    // Will throw an error on bad input or failure.
    async getRun(timestamp) {
        return this.sendJson('/api/getRun', timestamp)
    }

    // Asynchronously enters workout data with with given timestamp.
    // Will throw an error on bad input or failure.
    async enterWorkout(timestamp, weight, run) {
        const workout = {
            date: timestamp,
            weight_lifting: weight ?? null,
            running: run ?? null
        }
        return this.sendJson('/api/enterWorkout', workout)
    }
}

// Constructs the global server API.
const api = new Server()
