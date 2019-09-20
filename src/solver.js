//V 0.0 without manhatan function
//implment visited using hashing
//queue
const top = 0;
const parent = i => ((i + 1) >>> 1) - 1;
const left = i => (i << 1) + 1;
const right = i => (i + 1) << 1;

class PriorityQueue {
  constructor(comparator = (a, b) => a > b) {
    this._heap = [];
    this._comparator = comparator;
  }
  size() {
    return this._heap.length;
  }
  isEmpty() {
    return this.size() === 0;
  }
  peek() {
    return this._heap[top];
  }
  push(...values) {
    values.forEach(value => {
      this._heap.push(value);
      this._siftUp();
    });
    return this.size();
  }
  pop() {
    const poppedValue = this.peek();
    const bottom = this.size() - 1;
    if (bottom > top) {
      this._swap(top, bottom);
    }
    this._heap.pop();
    this._siftDown();
    return poppedValue;
  }
  replace(value) {
    const replacedValue = this.peek();
    this._heap[top] = value;
    this._siftDown();
    return replacedValue;
  }
  _greater(i, j) {
    return this._comparator(this._heap[i], this._heap[j]);
  }
  _swap(i, j) {
    [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
  }
  _siftUp() {
    let node = this.size() - 1;
    while (node > top && this._greater(node, parent(node))) {
      this._swap(node, parent(node));
      node = parent(node);
    }
  }
  _siftDown() {
    let node = top;
    while (
      (left(node) < this.size() && this._greater(left(node), node)) ||
      (right(node) < this.size() && this._greater(right(node), node))
    ) {
      let maxChild = (right(node) < this.size() && this._greater(right(node), left(node))) ? right(node) : left(node);
      this._swap(node, maxChild);
      node = maxChild;
    }
  }
}


class Board {
    constructor(arr) {
        this.arr = arr;
        this.empty_pos = this.calc_empty();
        this.priority=this.hamming();
        this.parent=-1;
      }

    hamming(){
        let h=0;
        for(let i=0;i<8;i++)
        {
            if(this.arr[i]!==i+1)
                h++;
        }
        return h;
    }
    calc_empty() {
        let empty_pos;
        for (let i = 0; i < this.arr.length; i++) {
            if (this.arr[i] === 0)
                empty_pos = i;
        }
        return empty_pos;
    }
}
let correctBoard =new Board([1,2,3,4,5,6,7,8,0]);

//isBoardSame(board1,board2)
//isVisited(board,visittedpuzzles)
//isSolved(board)returns true if board is of orignal config
//getNextBoards(board) returns an array of config board possible with one move
//bfs to solve the board 
function isBoardSame(b1,b2) {
    for(let i=0;i<b1.arr.length;i++)
        if(b1.arr[i]!==b2.arr[i]) return false;
    return true;
}
function isSolved(b1){
    if(isBoardSame(b1,correctBoard)) return true;
    return false;
}
function getNextBoards(b1){
    let ret=[];
    //swap with up
    if(b1.empty_pos>2){
        let arr=b1.arr.slice();
        arr[b1.empty_pos]=arr[b1.empty_pos-3];
        arr[b1.empty_pos-3]=0;
        let temp=new Board(arr);
        temp.parent=b1;
        ret.push(temp);
    }
    //swap with down 
    if(b1.empty_pos <6){
        let arr=b1.arr.slice();
        arr[b1.empty_pos]=arr[b1.empty_pos+3];
        arr[b1.empty_pos+3]=0;
        let temp=new Board(arr);
        temp.parent=b1;
        ret.push(temp);
    }
    //swap with left
    if(b1.empty_pos!==0 && b1.empty_pos!==3 && b1.empty_pos!==6){
        let arr=b1.arr.slice();
        arr[b1.empty_pos]=arr[b1.empty_pos-1];
        arr[b1.empty_pos-1]=0;
        let temp=new Board(arr);
        temp.parent=b1;
        ret.push(temp);        
    }
    //swap with right
    if(b1.empty_pos!==2 && b1.empty_pos!==5 && b1.empty_pos!==8){
        let arr=b1.arr.slice();
        arr[b1.empty_pos]=arr[b1.empty_pos+1];
        arr[b1.empty_pos+1]=0;
        let temp=new Board(arr);
        temp.parent=b1;
        ret.push(temp);        
    }    
     return ret;
}

function cmp(b1,b2){
    return b1.hamming()<b2.hamming();
}
function solver(start_board){
    //push into queue 
    //pop minimum hamming distance boad from queue
    //check if answer
    //while queue not empty if children not visited push in queue  
    //change visited to a hash table
    let visited=[];
    let q=new PriorityQueue(cmp);
    q.push(start_board);
    while(!q.isEmpty()){
      let curr=q.peek();
        visited.push(curr);
        if(isSolved(curr))
           return curr;
        let children = getNextBoards(curr);
        q.pop();
        for(let child of children){
            let to_push=true;
            for(let board of visited)
                if(isBoardSame(board,child)) to_push=false;
            if(to_push)
                q.push(child);  
        }
    }
}

//converts a 1d array into 2d array
function convArr(arr) {
	let empty_i=0;
	let empty_j=0;
	let grid = [[], [], []];
	for (let i = 0; i < 9; i++){
		grid[Math.floor(i / 3)].push(arr[i]);
		if(arr[i]===0)
			{empty_i=Math.floor(i/3);empty_j=i%3}
	}
	return {grid,empty_i,empty_j};
}
export function listMoves(arr2d){
  let arr=[];
  arr=[].concat(...arr2d);
  let ret=[];
  let puzzle =new Board(arr); 
  let sol=solver(puzzle);
  while(sol.parent!==-1){
    ret.push(convArr(sol.arr));
    sol=sol.parent;  
  }
  ret.push(convArr(sol.arr));
  ret.reverse();
  return ret;
}
