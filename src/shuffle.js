export function shuffleGrid(){
    let arr=[];
    let ret=[[],[],[]];
    do{
        arr=shuffle();
    }while(invCount(arr)%2!==0);
    for(let i=0;i<arr.length;++i)
    {
        ret[Math.floor(i/3)].push(arr[i]);
    }
    return ret;
}
export function invCount(arr){
    //heck it dosen't matter in n=9 still
    //can be done using merge sort O(nlgn)
    //current O(n^2)
    let inv=0;
    for(let i=0;i<arr.length-1;++i)
    {
        for(let j=i+1;j<arr.length;++j)
        {
            if(arr[i]>arr[j] && arr[i]!==0 && arr[j]!==0)
                inv++;
        }
    }
    return inv;
}
export function shuffle(){
    //redo with fisher yates algo
    let arr=[0,1,2,3,4,5,6,7,8];
    let copy=[],n=arr.length,i;

    while(n){
        //pick a random element 
        i=Math.floor(Math.random()*arr.length);

        if (i in arr)
        {
            copy.push(arr[i]);
            delete arr[i];
            n--;
        }
    }
    return copy;
}
export function calculateWinner(arr){
    let a=[
        [1,2,3],
        [4,5,6],
        [7,8,0]
    ];
    for (let i=0;i<3;i++)
        for (let j=0;j<3;j++)
            if(arr[i][j]!==a[i][j])
                return false;
    return true;
}



