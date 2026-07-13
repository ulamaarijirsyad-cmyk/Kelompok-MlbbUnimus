"use client";

import { useState } from "react";
import { calculateCounter } from "../utils/calculateCounter";
import CounterCard from "../components/CounterCard";

export default function CounterPick(){

    const heroes=[
        "Fanny",
        "Ling",
        "Hayabusa"
    ];

    const [selected,setSelected]=useState<string[]>([]);

    const result=calculateCounter(selected);

    function selectHero(hero:string){

        if(selected.includes(hero)) return;

        setSelected([...selected,hero]);

    }

    return(

<div className="grid grid-cols-2 gap-8 p-8">

<div>

<h1 className="text-3xl font-bold mb-4">

Enemy Hero

</h1>

<div className="grid grid-cols-3 gap-3">

{

heroes.map(hero=>

<button

key={hero}

onClick={()=>selectHero(hero)}

className="bg-zinc-800 p-3 rounded"

>

{hero}

</button>

)

}

</div>

</div>

<div>

<h1 className="text-3xl font-bold mb-4">

Recommended Counter

</h1>

{

result.map((hero:any)=>

<CounterCard

key={hero.hero}

hero={hero.hero}

score={hero.score}

reasons={hero.reasons}

/>

)

}

</div>

</div>

    )

}