import React from 'react';
import {shuffleGrid,calculateWinner} from './shuffle';
import {listMoves} from './solver';
function Tile(props){
    if (props.value!==0)
    return (
        <span className="tile">
            {props.value}
        </span>
    );
    else
    return(
        <span className="empty">
            .
        </span>
    );
}


export class Board extends React.Component{
    constructor(props){
        super(props);
        this.state={
            empty_i:2,
            empty_j:2,
            grid:[
                [1,2,3],
                [4,5,6],
                [7,8,0]
            ],
            could_be_won:false,
            time:0,
            solving:false,
        }
    }           
    componentDidMount(){

    }
    componentWillUnmount(){
        //this.stopClock();
    }
    startClock = () => {
        this.interval = setInterval(this.increment, 1000);
    }
    stopClock=()=>{
        window.clearInterval(this.interval);
    }
    increment=()=>{
        this.setState((state)=>({time:state.time+1}) );
    }
    started_solving=()=>{
        this.setState({could_be_won:false,solving:true});
    }
    solve=()=>{

        let sol =listMoves(this.state.grid);
        let i=0;
        if(sol.length>1 && !this.state.solving){
             this.started_solving();
             this.timer=setInterval(()=>{
                if(i<sol.length){
                    this.setState(sol[i]);
                    i++;
                }
                else 
                    this.stop_solve();
            },300);
            this.reset();
            //for(let i=0;i<sol.length;i++)
            //    this.setState(sol[i]);
        }
    }
    stop_solve=()=>{
        clearInterval(this.timer);
        this.reset();
        this.setState({solving:false});
    }
    handleChange =(event)=>{
        let grid=this.state.grid;
        let empty_i=this.state.empty_i;
        let empty_j=this.state.empty_j;
        let key=event.keyCode;
        let down = key===40 && empty_i!==0;
        let up= key===38 && empty_i!==2
        let right = key===39 && empty_j!==0;
        let left = key===37 && empty_j!==2;

        if (down || up || right || left){
            let i;
            let j;
            if(down)
                {i=empty_i-1;j=empty_j;}
            if(up)
                {i=empty_i+1;j=empty_j;}
            if(right)
                {i=empty_i;j=empty_j-1;}
            if(left)
                {i=empty_i;j=empty_j+1;}
            
            //swaping
            let temp=grid[empty_i][empty_j];
            grid[empty_i][empty_j]=grid[i][j];
            grid[i][j]=temp;
            this.setState({grid:grid,empty_i:i,empty_j:j});

        }
    }
    shuffleBoard=()=>{
        this.startClock();
        let grid=shuffleGrid();
        let could_be_won=true;
        let i,j;
        let empty_i,empty_j;
        for(i=0;i<=2;i++)
            for(j=0;j<=2;j++)
                if(grid[i][j]===0)
                    {empty_i=i;empty_j=j;j=2;i=2;}
        this.setState({grid,empty_i,empty_j,could_be_won});
    }
    reset=()=>{
        let could_be_won=false;
        let grid=[
            [1,2,3],
            [4,5,6],
            [7,8,0]
        ];
    this.stopClock();
    this.setState({grid,could_be_won,empty_i:2,empty_j:2,time:0});
    }
    render(){
        let correct=calculateWinner(this.state.grid);
        let won=correct && this.state.could_be_won;
        if (!won)
        return(
        <div>
            <div className="card">
                <div className="board" onKeyDown={this.handleChange} tabIndex="0">
                    {//box section
                        this.state.grid.map((list, i)=>{
                    return (
                        <div key={i}>
                            { list.map((item,j)=>{
                                return(<Tile value={this.state.grid[i][j]} key={j}/>)
                            }) }
                        </div>
                    )                                
                    })
                }
                </div>
                <div className="clock">
                    <h3>{Math.floor(this.state.time/60)} : {this.state.time%60}</h3>
                </div>
            </div>
                <div className="buttons">
                    <button onClick={correct?this.shuffleBoard:this.reset}>{correct?"START":"RESET"}</button>
                    <button className="solve" onClick={!this.state.solving?this.solve:this.stop_solve}>{!this.state.solving?"SOLVE":"STOP"}</button>
                </div>
        </div>
        );
        else
        {
            this.stopClock();
            return(
                <div>
                    <h1>You won in {Math.floor(this.state.time/60)}:{this.state.time%60} Reload to play again</h1>
                </div>
            );
        }
    }
}