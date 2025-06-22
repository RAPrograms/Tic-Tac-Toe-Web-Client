import { get, readonly, writable, type Writable } from "svelte/store";
import { database } from "./state";

type directions = -4 | -3 | -2 | -1 | 1 | 2 | 3 | 4;

export default class GameInstance{
    #size: number
    #board: Writable<Array<number>>
    #turn: Writable<0 | 1>
    #emptyCellCount: number
    #id: string | undefined

    constructor(size: number, board: Array<number>, turn: 0 | 1 = 0, id: string | undefined = undefined){
        this.#size = size
        this.#board = writable(board)
        this.#turn = writable(turn)
        this.#id = id

        this.#emptyCellCount = this.calculateEmptyCells()
    }

    static new(size: number) {
        const board: Array<number> = new Array(size**2).fill(-1)

        return new this(size, board)
    }

    reset(){
        const length = this.#size**2
        this.#board.set(new Array(length).fill(-1))
        this.#turn.set(0)
        this.#emptyCellCount = length
    }

    /**
     * Get the cell's position on the board
     * 
     * @returns {[number, number]} column, row where the cell is on the board
     */
    getCellPosition(index: number): [number, number]{
        const column = index % this.#size
        const row = Math.floor(index / this.#size)
        return [column, row]
    }

    getNeighborCell(index: number, movement: directions){
        const [column, row] = this.getCellPosition(index)
        index += movement

        //Left check
        if([-4, -1, 2].includes(movement) && column == 0)
            return -1

        //Right check
        else if([4, 1, -2].includes(movement) && column == this.#size -1)
            return -1

        if(movement < -1 && row == 0)
            return -1

        else if(movement > 1 && row == this.#size -1)
            return -1

        return index
    }


    getPath(index: number, direction: directions, team: 0 | 1, reverse_array: boolean = false): Array<number>{
        if(get(this.#board)[index] != team)
            return []

        const next_cell_index = this.getNeighborCell(index, direction)
        if(next_cell_index == -1)
            return [index]

        const result = this.getPath(next_cell_index, direction, team)
        if(reverse_array)
            return [index, ...result]
        return [...result, index]
    }

    getWinningPath(index: number): Array<number> | undefined{
        const team = get(this.#board)[index]
        if(team == -1)
            return 

        const directionPairs = [
            [-4, 4],
            [-3, 3],
            [-2, 2],
            [-1, 1]
        ]

        for(let i=0; i<directionPairs.length; i++){
            const [first, second] = directionPairs[i] as Array<directions>


            const one = this.getPath(index, first, (team as 0 | 1))
            const two = this.getPath(index, second, (team as 0 | 1), true)
            one.pop()

            const result = [...one, ...two]
            if(result.length == this.#size)
                return result
        }
    }

    /**
     * Searches the entire board to find any winning paths
     * 
     * This is not efficient! Please use getWinningPath(index) if you know the cell index
     */
    findWinningPath(): Array<number> | undefined{
        for(let i=(this.#size**2)-1; i>=0; i--){
            const result = this.getWinningPath(i)
            if(result)
                return result
        }
    }


    private calculateEmptyCells(){
        const board = get(this.board)
        let count = board.length

        for(let i=0; i<board.length; i++){
            if(board[i] != -1)
                count -= 1
        }

        return count
    }

    /**
     * Sets a cell's claim
     * 
     * @param {number} index - the position in the board
     * @param {0 | 1 | -1 | undefined} team - undefined will use current team based on turn
     * @param {boolean} override - If false, the code will throw an error if the cell is already claimed
     */
    setCellClaim(index: number, team: 0 | 1 | -1 | undefined = undefined, override: boolean = false){
        const board = get(this.#board)

        console.assert(0 <= index && index < board.length, "Out of bounds index")
        console.assert(team == 0 || team == 1, "Invalid team")

        if(!override && board[index] != -1){
            console.error("Cell already claimed")
            return
        }

        if(board[index] == team)
            return

        board[index] = team as 0 | 1 | -1
        this.#board.set(board)

        this.#emptyCellCount += (team == -1)? 1 : -1
    }

    /**
     * Sets the current team's turn
     * 
     * Enter -1 to invert current team
     */
    setTurn(team: 0 | 1 | -1 = -1){
        if(team == -1)
            team = 1 - get(this.#turn)

        this.#turn.set(team as 0 | 1)
    }

    /**
     * Checks if the game is won and by who
     * 
     *      undefined: Game is not won
     *      -1: The game was tied
     *      0: X team won
     *      1: O team won
     */
    getResults(): 0 | 1 | -1 | undefined{
        const winningPath = this.findWinningPath()
        if(winningPath != undefined){
            const board = get(this.#board)
            const team = board[winningPath![0]] as 0 | 1
            return team
        }

        if(this.emptyCellCount <= 0){
            return -1
        }
    }


    async saveActive(force: boolean = false){
        if(!force && !this.playable)
            throw Error("This game is not active or playable")
        
        const storesInstance = await database.openDataStores('active', "readwrite")
        if(storesInstance == undefined)
            return

        const [stores, transaction] = storesInstance 
        const store = stores["active"]

        if(this.#id == undefined)
            this.#id = await database.generateID(store)
        
        await database.toRequestPromise<IDBValidKey>(
            store.put({
                size: this.#size,
                board: get(this.#board),
                turn: get(this.turn),
                id: this.#id,
                lastSave: new Date
            })
        )
        
    }

 
    get playable(){
        return this.getResults() == undefined
    }
    
    get emptyCellCount(){
        return this.#emptyCellCount
    }

    get size(){
        return this.#size
    }

    get board(){
        return readonly(this.#board)
    }

    get turn(){
        return readonly(this.#turn)
    }
}