import { get, readonly, writable, type Writable } from "svelte/store";

type directions = -4 | -3 | -2 | -1 | 1 | 2 | 3 | 4;

export default class GameInstance{
    #size: number
    #board: Writable<Array<number>>
    #turn: Writable<0 | 1>

    constructor(size: number, board: Array<number>, turn: 0 | 1 = 0){
        this.#size = size
        this.#board = writable(board)
        this.#turn = writable(turn)
    }

    static new(size: number) {
        const board: Array<number> = new Array(size**2).fill(-1)

        return new this(size, board)
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

        board[index] = team as 0 | 1 | -1

        this.#board.set(board)
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